import type { LayoutServerLoad } from './$types';
import { prisma } from "$lib/server/prisma";

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, session } = await locals.validateUser();
	const appartments = await prisma.appartment.findMany({ include: { owner: true } });
	return {
		user,
		appartments,
		beta: process.env.STAGE === 'beta'
	};
};
