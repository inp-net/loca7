import { guards } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user, session } = await locals.validateUser();
	guards.isGodOrAdmin(user, session, url);

	const logs = await prisma.log.findMany({
		include: {
			user: true
		}
	});

	return { logs };
};
