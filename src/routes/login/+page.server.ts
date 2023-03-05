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
			return fail(400, { message: 'Could not login user' });
		}

		throw redirect(302, '/');
	}
};
