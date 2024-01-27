import { guards } from '$lib/server/lucia';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ params, locals, url }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	guards.isAdmin(user, session, url);

	const users = await prisma.user.findMany({});

	return new Response(JSON.stringify(users), {
		status: 200,
		headers: {
			'content-type': 'application/json'
		}
	});
};
