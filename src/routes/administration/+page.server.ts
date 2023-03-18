import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, session } = await locals.validateUser();
	if (!(user && session)) {
		throw redirect(302, '/login');
	}
	if (!user.emailIsValidated) {
		throw redirect(302, '/validate-email');
	}
	if (!user.admin) {
		throw redirect(302, '/');
	}

	const appartments = await prisma.appartment.findMany({
		where: {},
		include: {
			_count: true,
			nearbyStations: true,
			owner: true,
			photos: true,
			reports: true,
			travelTimeToN7: true
		}
	});

	return { appartments, user };
};
