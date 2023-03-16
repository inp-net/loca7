import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ locals, params }) => {
	const { user, session } = await locals.validateUser();
	if (!(user && session)) throw redirect(302, '/login');
	if (!user.admin) throw error(401, { message: "Vous n'êtes pas administrateur." });

	await prisma.report.delete({
		where: { id: params.id }
	});

	return new Response('Signalement supprimé avec succès', {
		status: 200
	});
};
