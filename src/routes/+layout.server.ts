import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, session } = await locals.validateUser();
	const appartments = await prisma.appartment.findMany({ include: { owner: true } });
	return {
		user,
		appartments,
		beta: process.env.STAGE === 'beta'
	};
};
