import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { photoURL } from '$lib/photos';
import { error, redirect } from '@sveltejs/kit';
import { rmSync } from 'fs';
import path from 'path';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const { session, user } = await locals.validateUser();

	guards.emailValidated(user, session, url);

	const appartment = await prisma.appartment.findFirst({
		where: {
			id: params.id
		},
		include: {
			photos: true,
			owner: true
		}
	});

	guards.appartmentAccessible(user, appartment);

	return { appartment };
};

export const actions: Actions = {
	confirm: async ({ locals, params, url }) => {
		const { session, user } = await locals.validateUser();

		guards.emailValidated(user, session, url);

		const appartment = await prisma.appartment.findFirst({
			where: {
				id: params.id
			},
			include: {
				owner: true,
				history: {
					include: {
						photos: true
					}
				},
				photos: true
			}
		});

		guards.appartmentAccessible(user, appartment);

		for (const photo of [
			...appartment.photos,
			...appartment.history.flatMap((h) => h.photos)
		]) {
			try {
				rmSync(path.join('public', photoURL(photo)));
			} catch (error) {
				if (error?.code !== 'ENOENT') {
					throw error;
				}
			}
		}

		await prisma.appartment.delete({
			where: {
				id: params.id
			}
		});

		throw redirect(302, '/appartements/gerer');
	}
};
