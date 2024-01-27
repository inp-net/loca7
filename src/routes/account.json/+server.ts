import { guards } from '$lib/server/lucia';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	guards.emailValidated(user, session, url);
	return new Response(JSON.stringify(user), {
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
