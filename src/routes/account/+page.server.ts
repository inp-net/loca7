import { auth, guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { Actions, PageServerLoad } from './$types';
import { sendMail } from '$lib/server/mail';
import { CONTACT_EMAIL } from '$lib/constants';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user, session } = await locals.validateUser();
	guards.emailValidated(user, session, url);
	return { user };
};

export const actions: Actions = {
	async updateProfile({ locals, request, url }) {
		const { user, session } = await locals.validateUser();
		guards.emailValidated(user, session, url);

		const { firstName, lastName, email, phone } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		await prisma.user.update({
			where: { id: user.id },
			data: { firstName, lastName, email, phone, emailIsValidated: email === user.email }
		});

		if (email !== user.email) {
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
					throw redirect(302, '/account#invalidCredentials');
				default:
					throw error;
			}
		}
		await fetch('/logout', { method: 'POST' });
	}
};
