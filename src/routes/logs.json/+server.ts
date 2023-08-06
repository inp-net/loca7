import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { guards } from '$lib/server/lucia';

export const GET: RequestHandler = async ({ locals, url }) => {
	const { user, session } = await locals.validateUser();
	guards.isGodOrAdmin(user, session, url);

	const logs = await prisma.log.findMany({ orderBy: { createdAt: 'desc' } });
	return new Response(JSON.stringify(logs));
};
