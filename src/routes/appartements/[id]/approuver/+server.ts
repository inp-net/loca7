import { log } from '$lib/server/logging';
import { guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import { prisma } from '$lib/server/prisma';
import { appartmentTitle } from '$lib/types';
import xss from 'xss';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, locals, url }) => {
	const { user, session } = await locals.validateUser();
	guards.isAdmin(user, session, url);

	const appartment = await prisma.appartment.findUnique({
		where: { id: params.id },
		include: {
			owner: true,
			photos: true
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

	await sendMail({
		to: appartment.owner,
		subject: 'Votre appartement a été approuvé',
		template: 'your-appartment-was-approved',
		data: {
			address: appartment.address,
			appartmentTitle: appartmentTitle(appartment),
			description: xss(appartment.description),
			number: appartment.number
		}
	});

	return new Response('Appartement approuvé', {
		status: 200
	});
};
