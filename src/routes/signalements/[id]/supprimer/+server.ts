import type { RequestHandler } from './$types';
import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ locals, params }) => {
	const { user, session } = await locals.validateUser();
	guards.isAdmin(user, session);

	await prisma.report.delete({
		where: { id: params.id }
	});

	return new Response('Signalement supprimé avec succès', {
		status: 200
	});
};
