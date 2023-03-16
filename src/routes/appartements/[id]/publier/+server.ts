import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ params, locals }) => {
	const { user, session } = await locals.validateUser();
	if (!(user && session)) throw redirect(302, '/login');
	if (!user.emailIsValidated) throw redirect(302, '/validate-email');
	if (!user.admin) throw error(401, { message: "Vous n'êtes pas administrateur" });

	const appartment = await prisma.appartment.findUnique({
		where: { id: params.id },
		include: {
			owner: true
		}
	});

	if (appartment === null)
		throw error(404, {
			message: "Cette annonce n'existe pas."
		});

	await prisma.appartment.update({
		where: { id: params.id },
		data: {
			// Only approve if the user is an admin, else leave it as it was before
			// This prevents non-admins from approving their posts but still allows them to unmark them as archived
			approved: user.admin ? true : undefined,
			archived: false
		}
	});

	return new Response('Archivage effectué avec succès', {
		status: 200
	});
};
