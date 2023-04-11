import type { LayoutServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, session } = await locals.validateUser();
	const appartments = await prisma.appartment.findMany({ include: { owner: true } });
	let allEmails: string[] = [];
	if (user?.admin) {
		allEmails = (await prisma.user.findMany({ select: { email: true } })).map((u) => u.email);
	}
	return {
		user,
		allEmails,
		appartments,
		beta: process.env.STAGE === 'beta'
	};
};
