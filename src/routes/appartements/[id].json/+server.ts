import { guards } from '$lib/server/lucia';
import { jsonAPIOutputsInclude } from '$lib/types';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ params, locals }) => {
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
		include: jsonAPIOutputsInclude
	});

	guards.appartmentAccessible(user, appartment);

	return new Response(JSON.stringify(appartment), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
