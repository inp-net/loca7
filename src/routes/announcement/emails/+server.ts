import { guards } from '$lib/server/lucia';
import { isGhostEmail } from '$lib/types';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ url, locals, params }) => {
	const { user, session } = await locals.validateUser();
	guards.isAdmin(user, session, url);

	const users = (
		await prisma.user.findMany({
			where: {
				keys: {
					none: {
						OR: [
							{
								id: {
									startsWith: 'email:'
								}
							},
							{
								id: {
									startsWith: 'oauth:'
								}
							}
						]
					}
				},
				PasswordReset: {
					none: {}
				}
			}
		})
	).filter((user) => !isGhostEmail(user.email));

	return new Response(users.map((u) => u.email).join('\n'));
};
