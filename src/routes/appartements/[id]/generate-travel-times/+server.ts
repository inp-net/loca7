import { guards } from '$lib/server/lucia';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { openRouteService } from '$lib/server/traveltime';
import { ENSEEIHT } from '$lib/utils';

export const GET: RequestHandler = async ({ request, params, locals }) => {
	const { user, session } = await locals.validateUser();
	const appartment = await prisma.appartment.findUnique({
		where: isNaN(Number(params.id)) ? { id: params.id } : { number: Number(params.id) },
		include: {
			owner: true,
			travelTimeToN7: true
		}
	});
	guards.appartmentAccessible(user, appartment);

	let newTravelTimes = { ...appartment.travelTimeToN7 };
	if (newTravelTimes.byFoot === null) {
		newTravelTimes.byFoot = Math.ceil(
			await openRouteService.travelTime('foot', appartment, ENSEEIHT)
		);
	}
	if (newTravelTimes.byBike === null) {
		newTravelTimes.byBike = Math.ceil(
			await openRouteService.travelTime('bike', appartment, ENSEEIHT)
		);
	}

	await prisma.travelTimeToN7.update({
		where: { id: appartment.travelTimeToN7.id },
		data: {
			byFoot: newTravelTimes.byFoot,
			byBike: newTravelTimes.byBike,
			byPublicTransport: newTravelTimes.byPublicTransport
		}
	});

	return new Response('OK');
};
