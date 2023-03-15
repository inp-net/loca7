import { error, fail, redirect } from '@sveltejs/kit';
import path from 'path';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import { rmSync } from 'fs';
import { appartmentPhotoURL } from '$lib/types';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { session, user } = await locals.validateUser();

	if (!(user && session)) {
		throw redirect(302, '/login');
	}
	if (!user?.emailIsValidated) throw redirect(302, '/validate-email');

	const appartment = await prisma.appartment.findFirst({
		where: {
			id: params.id
		},
		}
	});

	if (appartment === null || (!user.admin && appartment.ownerId !== user.id)) {
		throw error(404, { message: "Cette annonce n'existe pas ou ne vous appartient pas" });
	}

	return { appartment };
};

export const actions: Actions = {
	confirm: async ({ locals, params }) => {
		const { session, user } = await locals.validateUser();

		if (!(user && session)) {
			throw redirect(302, '/login');
		}
		if (!user?.emailIsValidated) throw redirect(302, '/validate-email');

		const appartment = await prisma.appartment.findFirst({
			where: {
				AND: [
					{
						id: params.id
					},
					{
						ownerId: user.id
					}
				]
			}
		});

		if (appartment === null) {
			throw error(404, { message: "Cette annonce n'existe pas ou ne vous appartient pas" });
		}

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
							filename: ''
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
