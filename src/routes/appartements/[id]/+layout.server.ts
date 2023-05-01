import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params, locals }) => {
	const { user } = await locals.validateUser();
	const appart = await prisma.appartment.findUnique({
		where: isNaN(Number(params.id)) ? { id: params.id } : { number: Number(params.id) },
		include: {
			owner: true
		}
	});

	guards.appartmentExists(appart);

	const appartment = await prisma.appartment.findUnique({
		where: { id: appart.id },
		include: {
			owner: true,
			nearbyStations: true,
			travelTimeToN7: true,
			photos: true,
			reports: user?.admin,
			likes: {
				include: {
					by: true
				}
			},
			history:
				user?.admin || user?.id === appart?.ownerId
					? {
							include: {
								photos: true
							}
					  }
					: false
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
