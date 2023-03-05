import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { AppartmentKind } from '$lib/types';
import { prisma } from '$lib/server/prisma';
import xss from 'xss';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.validate();

	if (!session) {
		throw redirect(302, '/login');
	}
};

export const actions: Actions = {
	postAppartment: async ({ request, locals }) => {
		const { user, session } = await locals.validateUser();
		if (!(user && session)) {
			throw redirect(302, '/');
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

		try {
			await prisma.appartment.create({
				data: {
					images: [], // FIXME,
					rent: Number(rent),
					charges: Number(charges),
					deposit: Number(deposit),
					surface: Number(surface),
					kind: kind as AppartmentKind,
					roomsCount: Object.keys(formData).includes('roomsCount')
						? Number(formData.roomsCount)
						: 0,
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
							: undefined,
					hasFurniture: Object.keys(formData).includes('hasFurniture')
						? formData.hasFurniture === 'on'
						: null,
					hasParking: Object.keys(formData).includes('hasParking')
						? formData.hasParking === 'on'
						: null,
					owner: {
						connect: {
							id: user.id
						}
					},
					travelTimeToN7: {
						create: {
							byBike: null,
							byFoot: null,
							byPublicTransport: null
						}
					},
					nearbyStations: {
						create: []
					},
					createdAt: new Date(),
					approved: true // TODO remove this, for now its true to test things out
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not create appartment posting' });
		}

		throw redirect(302, '/appartements/gerer');
	}
};
