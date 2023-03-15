import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.validateUser();

	if (!(user && session)) {
		throw redirect(302, '/login');
	}
	if (!user?.emailIsValidated) throw redirect(302, '/validate-email');

	return {
		appartments: (
			await prisma.appartment.findMany({
				where: { ownerId: user.id },
				include: {
					owner: true,
					location: true,
					nearbyStations: true,
					travelTimeToN7: true,
					reports: true,
					photos: true
				}
			})
		)
			.map((appartment) => ({
				...appartment,
				// Don't include potentially identifying information from the reports
				reports: appartment.reports.map(({ reason, message, id }) => ({
					reason,
					message,
					id
				})),
				photos: appartment.photos.sort((a, b) => a.position - b.position)
			}))
			.sort((a, b) => a.updatedAt.valueOf() - b.updatedAt.valueOf())
	};
};
