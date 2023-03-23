import {
	PASSWORD_RESET_VALID_FOR_MILLISECONDS,
	VALIDATION_LINK_VALID_FOR_MILLISECONDS
} from '$lib/constants';
import { guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, session } = await locals.validateUser();
	return { user };
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const email = (await request.formData()).get('email')?.toString();
		if (!email) {
			throw redirect(302, `/reset-password#noEmail`);
		}

		const user = await prisma.user.findUnique({
			where: { email }
		});

		if (!user) {
			throw redirect(302, `/reset-password?email=${encodeURIComponent(email)}#sent`);
		}

		const passwordReset = await prisma.passwordReset.create({
			data: {
				expires: Date.now() + PASSWORD_RESET_VALID_FOR_MILLISECONDS,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		});

		// Purge old validations
		await prisma.passwordReset.deleteMany({
			where: {
				user: {
					id: user.id
				},
				id: {
					not: passwordReset.id
				}
			}
		});

		await sendMail({
			to: email,
			data: {
				fullname: user.name,
				resetPasswordUrl: `${
					process.env.ORIGIN || 'http://localhost:5173'
				}/reset-password/${passwordReset.id}`
			},
			subject: 'Loca7: Réinitialisation de votre mot de passe',
			template: 'reset-password'
		});

		throw redirect(302, `/reset-password?email=${encodeURIComponent(email)}#sent`);
	}
};
