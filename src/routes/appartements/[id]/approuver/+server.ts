import { log } from '$lib/server/logging';
import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals, url }) => {
	const { user, session } = await locals.validateUser();
	guards.isAdmin(user, session, url);

	const appartment = await prisma.appartment.findUnique({
		where: { id: params.id },
		include: {
			owner: true
		}
	});

	guards.appartmentExists(appartment);

	await prisma.appartment.update({
		where: { id: params.id },
		data: {
			approved: true
		}
	});

	await log.info('approve_appartent', user, 'success', { appartment: params.id });

	return new Response('Appartement approuvé', {
		status: 200
	});
};
