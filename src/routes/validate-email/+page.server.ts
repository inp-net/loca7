import { VALIDATION_LINK_VALID_FOR_MILLISECONDS } from '$lib/constants';
import { guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user, session } = await locals.validateUser();
	guards.loggedIn(user, session, url);

	if (user.emailIsValidated) {
		throw redirect(302, '/');
	}

	return { user };
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const { user, session } = await locals.validateUser();
		guards.loggedIn(user, session, url);

		if (user.emailIsValidated && !url.hash) {
			throw redirect(302, '/');
		}

		const validation = await prisma.emailValidation.create({
			data: {
				expires: Date.now() + VALIDATION_LINK_VALID_FOR_MILLISECONDS,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		});

		// Purge old validations
		await prisma.emailValidation.deleteMany({
			where: {
				user: {
					id: user.id
				},
				id: {
					not: validation.id
				}
			}
		});

		await sendMail({
			to: user.email,
			data: {
				fullname: user.name,
				validateEmailUrl: `${
					process.env.ORIGIN || 'http://localhost:5173'
				}/validate-email/${validation.id}`
			},
			subject: 'Loca7: Vérifiez votre adresse email',
			template: 'validate-email'
		});

		throw redirect(302, '/validate-email#sent');
	}
};
