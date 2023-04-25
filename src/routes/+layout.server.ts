import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import VERSION_DATA from '../../public/version.json' assert { type: 'json' };

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, session } = await locals.validateUser();
	const appartments = await prisma.appartment.findMany({ include: { owner: true } });
	const allEmails: string[] = (await prisma.user.findMany({ select: { email: true } })).map(
		(u) => u.email
	);

	return {
		user,
		allEmails,
		appartments,
		beta: process.env.STAGE === 'beta',
		currentCommit: VERSION_DATA?.commit,
		currentVersion: VERSION_DATA?.version || '?'
	};
};
