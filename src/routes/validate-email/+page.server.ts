import { VALIDATION_LINK_VALID_FOR_MILLISECONDS } from '$lib/constants';
import { guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { log } from '$lib/server/logging';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	guards.loggedIn(user, session, url);

	if (user.emailIsValidated) {
		redirect(302, url.searchParams.get('go') ?? '/');
	}
	return { user };
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const session = await locals.auth.validate();
		const user = session?.user;
		guards.loggedIn(user, session, url);

		if (user.emailIsValidated && !url.hash) {
			redirect(302, url.searchParams.get('go') ?? '/');
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

		await log.info('request_email_validation', user);

		await sendMail({
			to: user,
			data: {
				validateEmailUrl:
					`${process.env.ORIGIN || 'http://localhost:5173'}/validate-email/${
						validation.id
					}` + url.search
			},
			subject: 'Loca7: Vérifiez votre adresse email',
			template: 'validate-email'
		});

		redirect(302, '/validate-email' + url.search + '#sent');
	}
};
