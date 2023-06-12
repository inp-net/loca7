import { auth } from '$lib/server/lucia';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { PageServerLoad } from './$types';
import { log } from '$lib/server/logging';

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
	default: async ({ request, locals, url }) => {
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
					await log.error(
						'login',
						email,
						`invalid credentials (lucia says ${err.message})`,
						{ tried: { email, password } }
					);
					throw redirect(302, `/login${url.search}#invalid-${err.message === 'AUTH_INVALID_PASSWORD' ? 'password' : 'email'}`);

				default:
					await log.fatal('login', email, `unknown error (lucia says ${err.message}) `);
					throw error(400, { message: 'Connexion impossible.' });
			}
		}

		await log.info('login', email, 'success');
		throw redirect(302, url.searchParams.get('go') ?? '/');
	}
};
