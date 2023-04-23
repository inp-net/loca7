import { auth, guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { Actions, PageServerLoad } from './$types';
import { sendMail } from '$lib/server/mail';
import { CONTACT_EMAIL } from '$lib/constants';
import { log } from '$lib/server/logging';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user, session } = await locals.validateUser();
	guards.emailValidated(user, session, url);
	return { user };
};

export const actions: Actions = {
	async updateProfile({ locals, request, url }) {
		const { user, session } = await locals.validateUser();
		guards.emailValidated(user, session, url);

		const { firstName, lastName, email, phone, agencyName, agencyWebsite } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

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
					}
				},
				data: {
					id: `email:${email}`
				}
			});

			await sendMail({
				to: user.email,
				subject: 'Loca7: Votre adresse email a été changée',
				data: {
					fullname: user.firstName + ' ' + user.lastName,
					contactEmail: CONTACT_EMAIL,
					newEmail: email
				},
				template: 'email-changed'
			});
		}

		await log.info('change_email', user, 'success', { from: user.email, to: email });
		throw redirect(302, '/account');
	},

	async changePassword({ locals, request, fetch, url }) {
		const { user, session } = await locals.validateUser();
		guards.emailValidated(user, session, url);

		const { oldPassword, newPassword } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		try {
			await auth.validateKeyPassword('email', user.email, oldPassword);
			await auth.updateKeyPassword('email', user.email, newPassword);
			await log.info('change_password', user, 'attempt');
			await sendMail({
				to: user.email,
				subject: 'Loca7: Votre mot de passe a été changé',
				data: {
					fullname: user.firstName,
					contactEmail: CONTACT_EMAIL
				},
				template: 'password-changed'
			});
		} catch (error) {
			if (!(error instanceof LuciaError)) throw error;

			switch (error.message) {
				case 'AUTH_INVALID_PASSWORD':
					throw redirect(302, '/account' + url.search + '#invalidCredentials');
				default:
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
	}
};
