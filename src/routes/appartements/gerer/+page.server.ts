import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { session, user } = await locals.validateUser();
	guards.emailValidated(user, session, url);

	let conditions = [{ owner: { id: user.id } }];
	if (user?.admin) {
		conditions.push({ createdByAdmin: true });
	}
	return {
		appartments: (
			await prisma.appartment.findMany({
				where: { OR: conditions },
				include: {
					owner: true,
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
			.sort((a, b) => -(a.updatedAt.valueOf() - b.updatedAt.valueOf()))
	};
};
