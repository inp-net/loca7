import { auth, guards } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { log } from '$lib/server/logging';

export const POST: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	guards.loggedIn(user, session, url);

	await auth.invalidateSession(session.sessionId);
	locals.setSession(null);

	await log.info('logout', user, 'success');
	redirect(302, '/?reload');
};
