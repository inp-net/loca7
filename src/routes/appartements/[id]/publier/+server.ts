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
			photos: true,
			likes: {
				include: {
					by: true
				}
			}
		}
	});

	guards.appartmentExists(appartment);

	try {
		guards.appartmentOwnedByUser(user, appartment);
	} catch (e) {
		guards.isAdmin(user, session, url);
	}

	const newAppartment = await prisma.appartment.update({
		where: { id: params.id },
		data: {
			// Only approve if the user is an admin, else leave it as it was before
			// This prevents non-admins from approving their posts but still allows them to unmark them as archived
			approved: user.admin ? true : false,
			archived: false
		}
	});

	await log.info('unarchive_appartment', user, 'success', {
		before: appartment,
		after: newAppartment
	});

	await sendMail({
		to: appartment.likes.map((like) => like.by.email),
		subject: `Une annonce vous intéréssant a été re-publiée`,
		template: 'liked-appartment-was-unarchived',
		data: {
			address: appartment.address,
			appartmentTitle: appartmentTitle(appartment),
			description: xss(appartment.description),
			fullname: user.firstName + ' ' + user.lastName
		}
	});

	return new Response('Publication effectuée avec succès', {
		status: 200
	});
};
