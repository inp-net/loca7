import { photoURL } from '$lib/photos';
import { log } from '$lib/server/logging';
import { guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import { prisma } from '$lib/server/prisma';
import { publicPath } from '$lib/server/utils';
import { appartmentTitle } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { rmSync } from 'fs';
import xss from 'xss';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const session = await locals.auth.validate();
	const user = session?.user;

	guards.emailValidated(user, session, url);

	const appartment = await prisma.appartment.findFirst({
		where: isNaN(Number(params.id)) ? { id: params.id } : { number: Number(params.id) },
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
		const session = await locals.auth.validate();
		const user = session?.user;

		guards.emailValidated(user, session, url);

		const appartment = await prisma.appartment.findFirst({
			where: isNaN(Number(params.id)) ? { id: params.id } : { number: Number(params.id) },
			include: {
				owner: true,
				history: {
					include: {
						photos: true
					}
				},
				photos: true,
				likes: {
					include: {
						by: true
					}
				}
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
				} else {
					await log.warn(
						'delete_appartment',
						user,
						'tried to delete non-existent photo',
						{ appartment, photo }
					);
				}
			}
		}

		await prisma.appartment.delete({
			where: isNaN(Number(params.id)) ? { id: params.id } : { number: Number(params.id) }
		});

		await log.warn('delete_appartment', user, { appartment });

		await sendMail({
			to: appartment.likes.map((like) => like.by),
			subject: `Une annonce vous intéréssant a été supprimée`,
			template: 'liked-appartment-was-deleted',
			data: {
				address: appartment.address,
				appartmentTitle: appartmentTitle(appartment),
				description: xss(appartment.description)
			}
		});

		await sendMail({
			to: appartment.owner,
			subject: `Votre annonce a été supprimée`,
			template: 'your-appartment-was-deleted',
			data: {
				address: appartment.address,
				appartmentTitle: appartmentTitle(appartment),
				description: xss(appartment.description),
				number: appartment.number
			}
		});

		redirect(302, user?.admin ? '/administration' : '/appartements/gerer');
	}
};
