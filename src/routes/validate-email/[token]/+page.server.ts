import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user, session } = await locals.validateUser();
	if (!(user && session)) {
		throw redirect(302, '/login');
	}
	const emailValidations = await prisma.emailValidation.findFirst({
		where: {
			user: {
				id: user.id
			},
			id: params.token
		}
	});
	if (!emailValidations) {
		throw redirect(302, '/validate-email#invalidToken');
	}

	await prisma.emailValidation.delete({
		where: {
			id: emailValidations.id
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
};
