import { guards } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user, session } = await locals.validateUser();
	guards.isGodOrAdmin(user, session, url);
	const page = Number.parseFloat(url.searchParams.get('page') ?? '1');
	const pagesize = Number.parseFloat(url.searchParams.get('pagesize') ?? '300');
	const pagesCount = Math.ceil((await prisma.log.count()) / pagesize);

	const logs = await prisma.log.findMany({
		include: {
			user: true
		},
		take: pagesize,
		skip: (page - 1) * pagesize,
		orderBy: {
			createdAt: 'desc'
		}
	});

	return { logs, pagesCount };
};
