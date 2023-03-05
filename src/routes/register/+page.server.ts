import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();

	if (session) {
		throw redirect(302, '/');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const { name, email, password, phone } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

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
					email
				}
			});
		} catch (err) {
			console.error(err);
			return fail(400, { message: 'Could not register user' });
		}

		throw redirect(302, '/login');
	}
};
