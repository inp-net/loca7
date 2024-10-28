import { auth, guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { Actions, PageServerLoad } from './$types';
import { sendMail } from '$lib/server/mail';
import { CONTACT_EMAIL } from '$lib/constants';
import { log } from '$lib/server/logging';
import { deletePhotosFromDisk } from '$lib/server/photos';
import { publicPath } from '$lib/server/utils';
import { photoURL } from '$lib/photos';
import { rmSync } from 'fs';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user, session } = await locals.validateUser();
	guards.emailValidated(user, session, url);
	const userHasNoEmailKey = (await auth.getAllUserKeys(user.id)).every(
		(key) => key?.providerId !== 'email'
	);
	return { user, userHasNoEmailKey };
};

export const actions: Actions = {
	async updateProfile({ locals, request, url }) {
		const { user, session } = await locals.validateUser();
		guards.emailValidated(user, session, url);

		const { firstName, lastName, email, phone, agencyName, agencyWebsite } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		if (user.email !== email) {
			if (await prisma.user.findUnique({ where: { email } })) {
				redirect(302, '/account' + url.search + '#email-already-in-use');
			}
		}

		await prisma.user.update({
			where: { id: user.id },
			data: {
				firstName,
				lastName,
				email,
				phone,
				emailIsValidated: email === user.email,
				agencyName,
				agencyWebsite
			}
		});
		await log.info('edit_account', user, 'success', {
			firstName,
			lastName,
			email,
			phone,
			agencyName,
			agencyWebsite
		});

		if (email !== user.email) {
			await log.info('change_email', user, 'attempt', { from: user.email, to: email });
			// XXX this should be done through lucia-auth
			await prisma.key.updateMany({
				where: {
					user: {
						id: user.id
					},
					id: {
						startsWith: 'email:'
					}
				},
				data: {
					id: `email:${email}`
				}
			});

			await sendMail({
				to: user,
				subject: 'Loca7: Votre adresse email a été changée',
				data: {
					newEmail: email
				},
				template: 'email-changed'
			});
		}

		await log.info('change_email', user, 'success', { from: user.email, to: email });
		redirect(302, '/account');
	},

	async changePassword({ locals, request, fetch, url }) {
		const { user, session } = await locals.validateUser();
		guards.emailValidated(user, session, url);

		const { oldPassword = '', newPassword } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		const userHasNoEmailKey = (await auth.getAllUserKeys(user.id)).every(
			(key) => key?.providerId !== 'email'
		);

		try {
			if (userHasNoEmailKey) {
				await auth.createKey(user.id, {
					password: newPassword,
					providerId: 'email',
					providerUserId: user.email
				});
			} else {
				await auth.validateKeyPassword('email', user.email, oldPassword);
				await auth.updateKeyPassword('email', user.email, newPassword);
			}
			await log.info('change_password', user, 'attempt');
			await sendMail({
				to: user,
				subject: 'Loca7: Votre mot de passe a été changé',
				data: {},
				template: 'password-changed'
			});
		} catch (error) {
			if (!(error instanceof LuciaError)) {
				await log.fatal('change_password', user, 'unknown NON-LUCIA error', error);
				throw error;
			}

			switch (error.message) {
				case 'AUTH_INVALID_PASSWORD':
				case 'AUTH_INVALID_KEY_ID':
				case 'AUTH_INVALID_USER_ID':
					await log.error('change_password', user, 'invalid credentials');
					redirect(302, '/account' + url.search + '#invalid-credentials');
				default:
					await log.fatal('change_password', user, 'unknown error', error);
					throw error;
			}
		}
		await log.info('change_password', user, 'success');
		await fetch('/logout', { method: 'POST' });
	},

	async toggleAdmin({ locals, url }) {
		const { user, session } = await locals.validateUser();
		guards.isGod(user, session, url);

		await prisma.user.update({
			where: { id: user.id },
			data: {
				admin: !user.admin
			}
		});
	},

	async deleteAccount({ locals, url, request }) {
		const { user, session } = await locals.validateUser();
		guards.loggedIn(user, session, url);

		const thruOauth = (await auth.getAllUserKeys(user.id)).some(
			(key) => key?.providerId === 'oauth'
		);

		if (!thruOauth) {
			const { email, password } = Object.fromEntries(await request.formData()) as Record<
				string,
				string
			>;

			try {
				await auth.validateKeyPassword('email', email, password);
			} catch (error) {
				if (!(error instanceof LuciaError)) {
					await log.fatal('delete_account', user, 'unknown NON-LUCIA error', error);
					throw error;
				}

				switch (error.message) {
					case 'AUTH_INVALID_PASSWORD':
					case 'AUTH_INVALID_KEY_ID':
						await log.error('delete_account', user, 'invalid credentials');
						redirect(
							302,
							'/account' + url.search + '#invalid-credentials-delete-account'
						);
					default:
						await log.fatal('delete_account', user, 'unknown error', error);
						throw error;
				}
			}
		}

		const appartments = await prisma.appartment.findMany({
			where: {
				ownerId: user.id
			},
			include: {
				photos: true,
				history: {
					include: {
						photos: true
					}
				}
			}
		});
		for (const photo of appartments.flatMap((appartment) => [
			...appartment.photos,
			...appartment.history.flatMap((h) => h.photos)
		])) {
			try {
				rmSync(publicPath(photoURL(photo)));
			} catch (error) {
				if (error?.code !== 'ENOENT') {
					await log.fatal(
						'delete_appartment',
						user,
						'while deleting a photo while deleting user',
						error,
						'with data',
						{
							appartmentId: photo.appartmentId,
							photo
						}
					);
					throw error;
				}
			}
		}
		await auth.deleteUser(user.id);

		await log.warn('delete_account', null, `deleted ${user.email}`);
		redirect(302, '/');
	}
};
