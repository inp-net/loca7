import { auth, guards } from '$lib/server/lucia';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals , url }) => {
	const { user, session } = await locals.validateUser();
	guards.loggedIn(user, session, url);

	await auth.invalidateSession(session.sessionId);
	locals.setSession(null);

	throw redirect(302, '/');
};
