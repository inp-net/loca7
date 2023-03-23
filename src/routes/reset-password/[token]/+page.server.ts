import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth, guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import { CONTACT_EMAIL } from '$lib/constants';

export const load: PageServerLoad = async ({ locals, params }) => {
	const passwordResets = await prisma.passwordReset.findFirst({
		where: {
			id: params.token,
			expires: {
				gt: Date.now()
			}
		}
	});
	if (!passwordResets) {
		throw redirect(302, '/reset-password#invalidToken');
	}
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
			throw redirect(302, '/reset-password#invalidToken');
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
			throw error(400, { message: "Aucun mot de passe n'a été fourni." });
		}

		await auth.updateKeyPassword('email', passwordReset.user.email, newPassword);
		await sendMail({
			to: passwordReset.user.email,
			subject: 'Loca7: Votre mot de passe a été changé',
			data: {
				fullname: passwordReset.user.name,
				contactEmail: CONTACT_EMAIL
			},
			template: 'password-changed'
		});

		throw redirect(302, '/login#passwordResetSuccessful');
	}
};
