import { guards } from '$lib/server/lucia';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { openRouteService } from '$lib/server/traveltime';
import { ENSEEIHT } from '$lib/utils';
import { log } from '$lib/server/logging';

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

	await log.info('generate_travel_times', user, 'calculated foot & bike travel times', {
		appartment,
		newTravelTimes
	});

	await prisma.travelTimeToN7.update({
		where: { id: appartment.travelTimeToN7.id },
		data: {
			byFoot: newTravelTimes.byFoot,
			byBike: newTravelTimes.byBike,
			byPublicTransport: newTravelTimes.byPublicTransport
		}
	});

	await log.info('generate_travel_times', user, 'added to database', {
		appartment,
		newTravelTimes
	});

	return new Response('OK');
};
