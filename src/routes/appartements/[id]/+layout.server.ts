import type { Appartment, PublicTransportStation } from '$lib/types';
import { ENSEEIHT } from '$lib/utils';
import type { LayoutLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error, fail } from '@sveltejs/kit';

export const load: LayoutLoad<{ appartment: Appartment }> = async ({ params }) => {
	const appartment = await prisma.appartment.findUnique({
		where: { id: params.id },
		include: {
			owner: true,
			location: true,
			nearbyStations: true,
			travelTimeToN7: true,
			photos: true,
			reports: true
		}
	});

	if (appartment === null)
		throw error(404, { message: "Cette annonce n'existe pas, ou n'est pas (encore) publique" });

	return {
		appartment: {
			...appartment,
			photos: appartment.photos.sort((a, b) => a.position - b.position)
		}
	};
};
