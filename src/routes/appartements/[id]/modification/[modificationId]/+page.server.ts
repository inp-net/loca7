import { guards } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user, session } = await locals.validateUser();
	guards.emailValidated(user, session);
};
