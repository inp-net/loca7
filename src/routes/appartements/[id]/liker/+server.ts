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
		await log.error('like_appartment', user, 'already liked', { appartment });
		return new Response('Appartment déjà liké', { status: 400 });
	} else {
		await prisma.like.create({
			data: {
				by: {
					connect: {
						id: user.id
					}
				},
				of: {
					connect: {
						id: appartment.id
					}
				}
			}
		});
		await log.info('like_appartment', user, `liked appartment`, { appartment });
	}

	return new Response('Appartment liké', {
		status: 200
	});
};
