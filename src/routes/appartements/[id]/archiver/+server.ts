import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { user, session } = await locals.validateUser();

	guards.emailValidated(user, session);

	const appartment = await prisma.appartment.findUnique({
		where: { id: params.id },
		include: {
			owner: true
		}
	});

	guards.appartmentAccessible(user, appartment);

	await prisma.appartment.update({
		where: { id: params.id },
		data: {
			archived: true
		}
	});

	return new Response('Archivage effectué avec succès', {
		status: 200
	});
};
