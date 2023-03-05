import { redirect } from '@sveltejs/kit';
import { prisma } from "$lib/server/prisma";
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.validateUser();

	if (!(user && session)) {
		throw redirect(302, '/login');
	}

	return {
		appartments: (
			await prisma.appartment.findMany({
				where: { ownerId: user.id },
				include: {
					owner: true,
					location: true,
					nearbyStations: true,
					travelTimeToN7: true,
					reports: true
				},
				orderBy: { lastModifiedAt: 'desc' }
			})
		).map((appartment) => ({
			...appartment,
			// Don't include potentially identifying information from the reports
			reports: appartment.reports.map(({ reason, message, id }) => ({ reason, message, id }))
		}))
	};
};
