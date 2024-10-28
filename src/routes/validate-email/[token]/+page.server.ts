import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { log } from '$lib/server/logging';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const { user, session } = await locals.validateUser();
	if (!(user && session)) {
		redirect(302, '/login');
	}

	const emailValidations = await prisma.emailValidation.findFirst({
		where: {
			user: {
				id: user.id
			},
			id: params.token,
			expires: {
				gt: Date.now()
			}
		}
	});
	if (!emailValidations) {
		await log.error(
			'use_email_validation',
			user,
			`token ${params.token} is invalid (expired or not found)`
		);
		redirect(302, '/validate-email' + url.search + '#invalid-token');
	}

	// Delete this validation as well as expired validations
	await prisma.emailValidation.deleteMany({
		where: {
			OR: [
				{
					id: emailValidations.id
				},
				{
					user: {
						id: user.id
					},
					expires: {
						lt: Date.now()
					}
				}
			]
		}
	});

	await prisma.user.update({
		where: {
			id: user.id
		},
		data: {
			emailIsValidated: true
		}
	});

	await log.info('use_email_validation', user, `success with token ${params.token}`);

	const redirectTo = url.searchParams.get('go');
	if (redirectTo) {
		redirect(302, redirectTo);
	}
};
