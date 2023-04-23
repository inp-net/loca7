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

	return new Response('Archivage effectué avec succès', {
		status: 200
	});
};
