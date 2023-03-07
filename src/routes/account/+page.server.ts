import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia-auth';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, session } = await locals.validateUser();
	if (!(user && session)) throw redirect(302, '/login');
	return { user };
};

export const actions: Actions = {
	async updateProfile({ locals, request }) {
		const { user, session } = await locals.validateUser();
		if (!(user && session)) throw redirect(302, '/login');

		const { name, email, phone } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		await prisma.user.update({
			where: { id: user.id },
			data: { name, email, phone }
		});

		throw redirect(302, '/account');
	},

	async changePassword({ locals, request }) {
		const { user, session } = await locals.validateUser();
		if (!(user && session)) throw redirect(302, '/login');

		const { oldPassword, newPassword } = Object.fromEntries(await request.formData()) as Record<
			string,
			string
		>;

		try {
			await auth.validateKeyPassword('email', user.email, oldPassword);
			await auth.updateKeyPassword('email', user.email, newPassword);
		} catch (error) {
			if (!(error instanceof LuciaError)) throw error;

			switch (error.message) {
				case 'AUTH_INVALID_PASSWORD':
					throw redirect(302, '/account#invalidPassword');
				default:
					throw error;
			}
		}
		throw redirect(302, '/logout');
	}
};
