import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async () => {
	return {
		appartments: (
			await prisma.appartment.findMany({
				include: {
					owner: true,
					location: true,
					nearbyStations: true,
					travelTimeToN7: true,
					photos: true
				}
			})
		).map((appartment) => ({
			...appartment,
			photos: appartment.photos.sort((a, b) => a.position - b.position)
		}))
	};
};
