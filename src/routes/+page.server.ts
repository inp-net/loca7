import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { redirect, type Actions, fail } from '@sveltejs/kit';
import type { AppartmentKind } from '@prisma/client';

export const load: PageServerLoad = async () => {
	return {
		appartments: await prisma.appartment.findMany({
			include: {
				owner: true,
				location: true,
				nearbyStations: true,
				travelTimeToN7: true
			}
		})
	};
};

export const actions: Actions = {
	postAppartment: async ({ request, locals }) => {
		const { user, session } = await locals.validateUser();
		if (!(user && session)) {
			throw redirect(302, '/');
		}

		const {
			images,
			rent,
			charges,
			deposit,
			surface,
			kind,
			roomsCount,
			availableAt,
			address,
			addressLatitude,
			addressLongitude,
			hasFurniture,
			hasParking,
			description
		} = Object.fromEntries(await request.formData()) as unknown as {
			images: string[];
			rent: number;
			charges: number;
			deposit: number;
			surface: number;
			kind: AppartmentKind;
			roomsCount: number;
			availableAt: Date;
			address: string;
			addressLatitude: string;
			addressLongitude: string;
			hasFurniture: boolean;
			hasParking: boolean;
			description: string;
		};

		try {
			await prisma.appartment.create({
				data: {
					images,
					rent,
					charges,
					deposit,
					surface,
					kind,
					roomsCount,
					availableAt,
					address,
					hasFurniture,
					hasParking,
					description,
					location: {
						create: {
							latitude: parseFloat(addressLatitude),
							longitude: parseFloat(addressLongitude)
						}
					},
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
					createdAt: new Date()
				}
			});
		} catch (err) {
			console.error(err);
			return fail(500, { message: 'Could not create appartment posting' });
		}

		return {
			status: 201
		};
	}
};
