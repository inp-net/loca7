import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { jsonAPIOutputsInclude } from '$lib/types';

export const GET: RequestHandler = async ({ params, locals }) => {
	const appartments = await prisma.appartment.findMany({
		where: {
			archived: false,
			approved: true
		},
		include: jsonAPIOutputsInclude
	});

	return new Response(JSON.stringify(appartments), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
