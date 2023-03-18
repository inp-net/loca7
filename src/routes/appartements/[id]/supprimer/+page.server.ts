import { error, fail, redirect } from '@sveltejs/kit';
import path from 'path';
import type { PageServerLoad, Actions } from './$types';
import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { rmSync } from 'fs';
import { appartmentPhotoURL } from '$lib/types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { session, user } = await locals.validateUser();

	guards.emailValidated(user, session);

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
	confirm: async ({ locals, params }) => {
		const { session, user } = await locals.validateUser();

		guards.emailValidated(user, session);

		const appartment = await prisma.appartment.findFirst({
			where: {
				id: params.id
			},
			include: {
				owner: true
			}
		});

		guards.appartmentAccessible(user, appartment);

		await prisma.appartment.delete({
			where: {
				id: params.id
			}
		});

		try {
			await rmSync(
				path.dirname(
					path.join(
						'public',
						appartmentPhotoURL({
							appartmentId: appartment.id,
							contentType: '',
							filename: '',
							position: 0
						})
					)
				),
				{
					recursive: true
				}
			);
		} catch (err) {
			if (err?.code !== 'ENOENT') {
				console.error(err);
				throw error(500, { message: 'Une erreur est survenue' });
			}
		}

		throw redirect(302, '/appartements/gerer');
	}
};
