import { auth, guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import { isGhostEmail } from '$lib/types';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const GET: RequestHandler = async ({ url, locals, params }) => {
	const { user, session } = await locals.validateUser();
	guards.isAdmin(user, session, url);

	const users = (
		await prisma.user.findMany({
			where: {
				email: {
					in: params.emails.split('/')
				},
				keys: {
					none: {
						id: {
							startsWith: 'email:'
						}
					}
				}
			}
		})
	).filter((user) => !isGhostEmail(user.email));
	for (const user of users) {
		const passwordReset = await prisma.passwordReset.create({
			data: {
				expires: Date.now() + Number.MAX_SAFE_INTEGER,
				user: {
					connect: {
						id: user.id
					}
				}
			}
		});
		await sendMail({
			to: user,
			subject: (user.firstName ? `${user.firstName}, ` : '') + `Loca7 fait peau neuve`,
			template: 'announcement',
			data: {
				createAccountUrl: `${
					process.env.ORIGIN || 'http://localhost:5173'
				}/reset-password/${passwordReset.id}`
			}
		});
	}
	return new Response(users.map((user) => user.email).join('\n'));
};
