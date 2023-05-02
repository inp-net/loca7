import { log } from '$lib/server/logging';
import { guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import { prisma } from '$lib/server/prisma';
import { appartmentTitle } from '$lib/types';
import xss from 'xss';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals, url }) => {
	const { user, session } = await locals.validateUser();

	guards.emailValidated(user, session, url);

	const appartment = await prisma.appartment.findUnique({
		where: { id: params.id },
		include: {
			owner: true,
			likes: {
				include: {
					by: true
				}
			}
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

	await sendMail({
		to: appartment.likes.map((like) => like.by),
		subject: `Une annonce vous intéréssant a été archivée`,
		template: 'liked-appartment-was-archived',
		data: {
			address: appartment.address,
			appartmentTitle: appartmentTitle(appartment),
			description: xss(appartment.description)
		}
	});

	return new Response('Archivage effectué avec succès', {
		status: 200
	});
};
