import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, session } = await locals.validateUser();
	guards.isAdminElseRedirect(user, session);

	const appartments = await prisma.appartment.findMany({
		where: {},
		include: {
			_count: true,
			nearbyStations: true,
			owner: true,
			photos: true,
			reports: true,
			travelTimeToN7: true,
            history: true
		}
	});

	return { appartments, user };
};
