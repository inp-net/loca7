import { log } from '$lib/server/logging';
import { guards } from '$lib/server/lucia';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ params, locals, url }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	guards.loggedIn(user, session, url);

	const appartment = await prisma.appartment.findUnique({
		where: isNaN(Number(params.id)) ? { id: params.id } : { number: Number(params.id) },
		include: { owner: true }
	});

	guards.appartmentAccessible(user, appartment);

	const existingLike = await prisma.like.findFirst({
		where: { by: { id: user.id }, of: { id: appartment.id } }
	});

	if (existingLike) {
		await prisma.like.delete({
			where: {
				id: existingLike.id
			}
		});
		await log.info('unlike_appartment', user, `removed like for appartment`, { appartment });
	} else {
		await log.info('unlike_appartment', user, `like does not exist`, { appartment });
		return new Response("Cet appartment n'a pas été liké", {
			status: 400
		});
	}
	return new Response('Appartment liké', {
		status: 200
	});
};
