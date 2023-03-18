import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { user } = await locals.validateUser();
	const appartment = await prisma.appartment.findUnique({
		where: { id: params.id },
		include: {
			owner: true,
			nearbyStations: true,
			travelTimeToN7: true,
			photos: true,
			reports: true
		}
	});

	guards.appartmentAccessible(user, appartment);

	return {
		appartment: {
			...appartment,
			photos: appartment.photos.sort((a, b) => a.position - b.position)
		}
	};
};
