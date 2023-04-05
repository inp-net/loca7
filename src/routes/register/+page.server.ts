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
		const { firstName, lastName, email, password, phone } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		if ((firstName + lastName).trim() === '') {
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
					firstName,
					lastName,
					email,
					admin: false,
					emailIsValidated: false,
					god: false
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
