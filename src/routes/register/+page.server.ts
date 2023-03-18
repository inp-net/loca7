import { auth } from '$lib/server/lucia';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();

	if (session) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const { name, email, password, phone } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		if (name === '') {
			throw error(400, { message: 'Veuillez renseigner votre nom.' });
		}

		try {
			await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: email,
					password
				},
				attributes: {
					phone,
					name,
					email,
					admin: false,
					emailIsValidated: false
				}
			});
		} catch (err) {
			console.error(err);
			if (!(err instanceof LuciaError)) {
				throw error(500);
			}

			switch (err.message) {
				case 'AUTH_DUPLICATE_KEY_ID':
					throw redirect(302, '/register#duplicateEmail');
				default:
					throw error(400, { message: 'Inscription impossible.' });
			}
		}

		throw redirect(302, '/login');
	}
};
