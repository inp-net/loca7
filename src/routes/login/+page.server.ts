import { auth } from '$lib/server/lucia';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { LuciaError } from 'lucia';
import type { PageServerLoad } from './$types';
import { log } from '$lib/server/logging';
import { churros } from '$lib/server/oauth';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	const user = session?.user;

	if (user && !user.emailIsValidated) {
		redirect(302, '/validate-email');
	}

	if (session) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	manual: async ({ request, locals, url }) => {
		const { email, password } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		try {
			const key = await auth.use('email', email, password);
			const session = await auth.createSession({ userId: key.userId });
			locals.setSession(session);
		} catch (err) {
			console.error(err);
			if (!(err instanceof LuciaError)) {
				error(500);
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
					redirect(
						302,
						`/login${url.search}#invalid-${
							err.message === 'AUTH_INVALID_PASSWORD' ? 'password' : 'email'
						}`
					);

				default:
					await log.fatal('login', email, `unknown error (lucia says ${err.message}) `);
					error(400, { message: 'Connexion impossible.' });
			}
		}

		await log.info('login', email, 'success');
		redirect(302, url.searchParams.get('go') ?? '/');
	},

	async oauth({ request }) {
		const data = await request.formData();
		if (data.get('accessToken')) {
			redirect(
				302,
				'/login/callback/done?' +
					new URLSearchParams({
						access_token: data.get('accessToken')?.toString() ?? ''
					})
			);
		}
		churros.state = data.get('csrfToken')?.toString() ?? '';
		redirect(302, churros.authorizationURL);
	}
};
