import { appartmentAccessible } from '$lib/types';
import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

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

	if (appartment === null || !appartmentAccessible(user, appartment))
		throw error(404, { message: "Cette annonce n'existe pas, ou n'est pas (encore) publique" });

	return {
		appartment: {
			...appartment,
			photos: appartment.photos.sort((a, b) => a.position - b.position)
		}
	};
};
