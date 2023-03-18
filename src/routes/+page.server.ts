import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		appartments: (
			await prisma.appartment.findMany({
				where: {
					archived: false,
					approved: true
				},
				include: {
					owner: true,
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
