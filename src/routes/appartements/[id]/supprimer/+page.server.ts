import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { session, user } = await locals.validateUser();

	if (!(user && session)) {
		throw redirect(302, '/login');
	}

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
		throw fail(404, { message: 'Appartment not found or not owned by you' });
	}

	return { appartment };
};

export const actions: Actions = {
	confirm: async ({ locals, params }) => {
		const { session, user } = await locals.validateUser();

		if (!(user && session)) {
			throw redirect(302, '/login');
		}

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
			throw fail(404, { message: 'Appartment not found or not owned by you' });
		}

		await prisma.appartment.delete({
			where: {
				id: params.id
			}
		});

		throw redirect(302, '/appartements/gerer');
	}
};
