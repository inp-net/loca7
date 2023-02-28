import { fail, redirect } from '@sveltejs/kit';
import { pbkdf2Sync } from 'crypto';
import type { PageServerLoad, Actions } from './$types';
import { PrismaClient } from '@prisma/client';
import type { User } from '$lib/types';

// If the user exists, redirect authenticated users to the profile page.
export const load: PageServerLoad<{ user: User | null }> = async ({ cookies }) => {
	const db = new PrismaClient();
	const userId = cookies.get('userId');
	if (!userId) return { user: null };
	const user = db.user.findUnique({ where: { id: userId } });
	return { user };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const db = new PrismaClient();
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');
		const phone = form.get('phone');
		const fullName = form.get('fullName');
		console.log({ email, password, phone, fullName });

		// check for empty values
		if (
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			typeof fullName !== 'string' ||
			email.length === 0 ||
			password.length === 0 ||
			fullName.length === 0
		) {
			return fail(400);
		}

		try {
			await db.user.create({
				data: {
					email,
					phone,
					fullName,
					passwordHash: pbkdf2Sync(
						password,
						'TODO put a real salt here',
						100000,
						64,
						'sha512'
					).toString('hex')
				}
			});
		} catch (e) {
			console.error(e);
			// username already in use
			return fail(400);
		}
	}
};
