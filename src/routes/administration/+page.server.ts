import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, parent }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	guards.isAdminElseRedirect(user, session, url);

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

	return { ...(await parent()), appartments, user };
};
