import { auth, guards } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { log } from '$lib/server/logging';
import { env as secrets } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ locals, url, cookies }) => {
	const { user, session } = await locals.validateUser();
	guards.loggedIn(user, session, url);

	await auth.invalidateSession(session.sessionId);
	locals.setSession(null);

	await log.info('logout', user, 'success');
	if (cookies.get('authed_via') === 'oauth') {
		cookies.delete('authed_via');
		throw redirect(302, secrets.OAUTH_LOGOUT_URL);
	}
	throw redirect(302, '/?reload');
};
