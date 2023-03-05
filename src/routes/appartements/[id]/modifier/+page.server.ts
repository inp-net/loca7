import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AppartmentKind } from '$lib/types';
import xss from 'xss';

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user, session } = await locals.validateUser();
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
		},
		include: {
			owner: true,
			location: true,
			nearbyStations: true,
			travelTimeToN7: true,
			reports: true
		}
	});

	if (appartment === null) {
		throw fail(404, { message: 'Appartment not found or not owned by you' });
	}

	return {
		appartment: {
			...appartment,
			// Don't include potentially identifying information from the reports
			reports: appartment.reports.map(({ reason, message, id }) => ({ reason, message, id }))
		}
	};
};

export const actions: Actions = {
	edit: async ({ request, locals, params }) => {
		const { user, session } = await locals.validateUser();
		if (!(user && session)) {
			throw redirect(302, '/login');
		}

		const formData = Object.fromEntries(await request.formData()) as Record<string, string>;

		const {
			rent,
			charges,
			deposit,
			surface,
			kind,
			availableAt,
			address,
			addressLatitude,
			addressLongitude,
			description
		} = formData;

		await prisma.appartment.update({
			where: {
				id: params.id
			},
			data: {
				lastModifiedAt: new Date(),
				rent: Number(rent),
				charges: Number(charges),
				deposit: Number(deposit),
				surface: Number(surface),
				kind: kind as AppartmentKind,
				roomsCount: Object.keys(formData).includes('roomsCount') ? Number(formData.roomsCount) : 0,
				availableAt: new Date(Date.parse(availableAt)),
				address,
				description: xss(description),
				location:
					addressLatitude && addressLongitude
						? {
								create: {
									latitude: parseFloat(addressLatitude),
									longitude: parseFloat(addressLongitude)
								}
						  }
						: undefined
			}
		});

		throw redirect(302, `/appartements/gerer`);
	}
};
