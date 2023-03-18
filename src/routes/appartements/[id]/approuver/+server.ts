import type { RequestHandler } from './$types';
import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { user, session } = await locals.validateUser();
	guards.isAdmin(user, session);

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

	return new Response('Archivage effectué avec succès', {
		status: 200
	});
};
