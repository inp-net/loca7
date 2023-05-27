import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth, guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import { CONTACT_EMAIL } from '$lib/constants';
import { log } from '$lib/server/logging';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user } = await locals.validateUser();
	const passwordReset = await prisma.passwordReset.findFirst({
		where: {
			id: params.token,
			expires: {
				gt: Date.now()
			}
		},
		include: {
			user: true
		}
	});
	if (!passwordReset) {
		await log.error(
			'use_password_reset',
			user,
			`token ${params.token} is invalid (expired or not found)`
		);
		throw redirect(302, '/reset-password#invalid-token');
	}
	const currentEmailKey = await prisma.key.findFirst({
		where: {
			user: {
				id: passwordReset.user.id
			}
		}
	});
	const creatingPassword = !currentEmailKey;
	return { creatingPassword, holder: passwordReset.user };
};

export const actions: Actions = {
	default: async ({ request, params, locals, url }) => {
		const { user, session } = await locals.validateUser();

		const passwordReset = await prisma.passwordReset.findFirst({
			where: {
				id: params.token,
				expires: {
					gt: Date.now()
				}
			},
			include: {
				user: true
			}
		});

		if (!passwordReset) {
			await log.error(
				'use_password_reset',
				user,
				`token ${params.token} is invalid (expired or not found)`
			);
			throw redirect(302, '/reset-password#invalid-token');
		}

		// Delete all password resets for this user
		await prisma.passwordReset.deleteMany({
			where: {
				user: {
					id: passwordReset.user.id
				}
			}
		});

		const newPassword = (await request.formData()).get('password')?.toString();

		if (!newPassword) {
			await log.error('use_password_reset', user, `no password given`);
			throw error(400, { message: "Aucun mot de passe n'a été fourni." });
		}

		const currentEmailKey = await prisma.key.findFirst({
			where: {
				user: {
					id: passwordReset.user.id
				}
			}
		});
		const creatingPassword = !currentEmailKey;

		if (creatingPassword) {
			await auth.createKey(passwordReset.user.id, {
				password: newPassword,
				providerId: 'email',
				providerUserId: passwordReset.user.email
			});
			await prisma.user.update({
				where: {
					id: passwordReset.user.id
				},
				data: {
					emailIsValidated: true
				}
			});
			await sendMail({
				to: passwordReset.user,
				subject: 'Votre compte Loca7 a été créé',
				data: {
					manageAppartmentsUrl: `${
						process.env.ORIGIN || 'http://localhost:5173'
					}/appartements/gerer`
				},
				template: 'account-created'
			});
		} else {
			await auth.updateKeyPassword('email', passwordReset.user.email, newPassword);
			await sendMail({
				to: passwordReset.user,
				subject: 'Loca7: Votre mot de passe a été changé',
				data: {},
				template: 'password-changed'
			});
		}
		await log.info(
			'use_password_reset',
			user,
			'password ' + creatingPassword ? 'created' : 'changed'
		);

		throw redirect(
			302,
			`/login#password-${creatingPassword ? 'definition' : ' reset'}-successful`
		);
	}
};
