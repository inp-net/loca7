import { redirect, type Actions, fail, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia-auth';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, session } = await locals.validateUser();

	if (user && !user.emailIsValidated) {
		throw redirect(302, '/validate-email');
	}

	if (session) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		try {
			const key = await auth.validateKeyPassword('email', email, password);
			const session = await auth.createSession(key.userId);
			locals.setSession(session);
		} catch (err) {
			console.error(err);
			if (!(err instanceof LuciaError)) {
				throw error(500);
			}
			switch (err.message) {
				case 'AUTH_INVALID_PASSWORD':
				case 'AUTH_OUTDATED_PASSWORD':
				case 'AUTH_INVALID_USER_ID':
				case 'AUTH_INVALID_KEY_ID':
					throw redirect(302, '/login#invalidCredentials');

				default:
					throw error(400, { message: 'Connexion impossible.' });
			}
		}

		throw redirect(302, '/');
	}
};
