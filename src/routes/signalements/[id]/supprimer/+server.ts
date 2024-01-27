import { log } from '$lib/server/logging';
import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, params, url }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	guards.isAdmin(user, session, url);

	await prisma.report.delete({
		where: isNaN(Number(params.id)) ? { id: params.id } : { number: Number(params.id) }
	});

	await log.info('delete_appartment_report', user, 'success', { appartment: params.id });

	return new Response('Signalement supprimé avec succès', {
		status: 200
	});
};
