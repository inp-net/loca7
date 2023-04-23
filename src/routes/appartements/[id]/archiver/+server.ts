import { log } from '$lib/server/logging';
import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals, url }) => {
	const { user, session } = await locals.validateUser();

	guards.emailValidated(user, session, url);

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

	await log.info('archive_appartment', user, 'success', { appartment: params.id });

	return new Response('Archivage effectué avec succès', {
		status: 200
	});
};
