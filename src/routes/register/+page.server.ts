import { auth } from '$lib/server/lucia';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { PageServerLoad } from './$types';
import { log } from '$lib/server/logging';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.validate();

	if (session) {
		throw redirect(302, '/' + url.search);
	}
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const inputData = Object.fromEntries(await request.formData()) as Record<string, string>;
		const { firstName, lastName, email, password, phone, agencyName, agencyWebsite } =
			inputData;

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
					agencyName: agencyName ?? '',
					agencyWebsite: agencyWebsite ?? '',
					admin: false,
					emailIsValidated: false,
					god: false
				}
			});
			throw Error("Shouldn't be here");
		} catch (err) {
			if (!(err instanceof LuciaError)) {
				await log.fatal('create_account', email, `NON-LUCIA unknown error`, err);
				throw error(500);
			}

			switch (err.message) {
				case 'AUTH_DUPLICATE_KEY_ID':
					await log.error(
						'create_account',
						null,
						`duplicate email (lucia says ${err.message})`
					);
					throw redirect(
						302,
						'/register' + url.search + '#duplicateEmail=' + encodeURIComponent(email)
					);
				default:
					await log.fatal(
						'create_account',
						null,
						`unknown error (lucia says ${err.message})`
					);
					throw error(400, { message: 'Inscription impossible.' });
			}
		}

		await log.info('create_account', email, { firstName, lastName, phone, email });
		throw redirect(302, '/login' + url.search);
	}
};
