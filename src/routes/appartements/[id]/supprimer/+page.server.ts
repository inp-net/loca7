import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { photoURL } from '$lib/photos';
import { publicPath } from '$lib/server/utils';
import { error, redirect } from '@sveltejs/kit';
import { rmSync } from 'fs';
import path from 'path';
import type { Actions, PageServerLoad } from './$types';
import { log } from '$lib/server/logging';

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
				rmSync(publicPath(photoURL(photo)));
			} catch (error) {
				if (error?.code !== 'ENOENT') {
					await log.fatal(
						'delete_appartment',
						user,
						'while deleting a photo',
						error,
						'with data',
						{
							appartment,
							photo
						}
					);
					throw error;
				}
			}
		}

		await prisma.appartment.delete({
			where: {
				id: params.id
			}
		});

		await log.info('delete_appartment', user, { appartment });

		throw redirect(302, user?.admin ? '/administration' : '/appartements/gerer');
	}
};
