import { guards } from '$lib/server/lucia';
import { isGhostEmail } from '$lib/types';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ url, locals, params }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	guards.isAdmin(user, session, url);

	const users = (
		await prisma.user.findMany({
			where: {
				keys: {
					none: {
						id: {
							startsWith: 'email:'
						}
					}
				}
			}
		})
	).filter((user) => isGhostEmail(user.email));

	return new Response(
		users.map((u) => u.phone + '\t' + (u.firstName + ' ' + u.lastName).trim()).join('\n')
	);
};
