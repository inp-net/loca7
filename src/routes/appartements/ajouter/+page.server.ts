import { error, redirect } from '@sveltejs/kit';
import path from 'path';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import xss from 'xss';
import type { AppartmentKind, GeographicPoint, Prisma } from '@prisma/client';
import { writeFileSync, mkdirSync } from 'fs';
import { appartmentPhotoURL, type Appartment } from '$lib/types';
import { ENSEEIHT, getContentHash } from '$lib/utils';
import { openRouteService, tisseo } from '$lib/server/traveltime';
import type { TransportationType } from 'traveltime-api';

export const load: PageServerLoad = async ({ locals }) => {
	const { session, user } = await locals.validateUser();

	if (!(session && user)) {
		throw redirect(302, '/login');
	}
	if (!user?.emailIsValidated) throw redirect(302, '/validate-email');
};

export const actions: Actions = {
	postAppartment: async ({ request, locals, fetch }) => {
		const { user, session } = await locals.validateUser();
		if (!(user && session)) {
			throw redirect(302, '/');
		}
		if (!user?.emailIsValidated) throw redirect(302, '/validate-email');

		const formDataRaw = await request.formData();
		const formData = Object.fromEntries(formDataRaw) as Record<string, string>;
		console.log({ 'uploading appartment from form data': formData });

		const isDummyFile = (file: File) =>
			file.size === 0 && file.type === 'application/octet-stream';
		const files = (formDataRaw.getAll('photos') as File[]).filter((f) => !isDummyFile(f));
		console.log(files);

		const photosOrder = JSON.parse(formData.photosOrder) as string[];

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

		const latitude = addressLatitude && addressLongitude ? Number(addressLatitude) : null;
		const longitude = addressLatitude && addressLongitude ? Number(addressLongitude) : null;

		const tristateCheckboxToBoolean = (value: string) => {
			return {
				indeterminate: null,
				on: true,
				off: false
			}[value];
		};

		let appartment;
		try {
			const appartInput: Prisma.AppartmentCreateArgs['data'] = {
				photos: {
					createMany: {
						data: files.map((file) => ({
							filename: file.name,
							contentType: file.type,
							position: photosOrder.indexOf(file.name)
						}))
					}
				},
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
				latitude,
				longitude,
				description: xss(description),
				owner: {
					connect: {
						id: user.id
					}
				},
				travelTimeToN7: {
					create: {
						byFoot: null,
						byBike: null,
						byPublicTransport: null
					}
				},
				hasFurniture: Object.keys(formData).includes('hasFurniture')
					? tristateCheckboxToBoolean(formData.hasFurniture)
					: null,
				hasParking: Object.keys(formData).includes('hasParking')
					? tristateCheckboxToBoolean(formData.hasParking)
					: null
			};
			if (latitude && longitude) {
				appartInput.travelTimeToN7.create = {
					byBike:
						Math.floor(
							await openRouteService.travelTime(
								'bike',
								{ latitude, longitude },
								ENSEEIHT
							)
						) || null,
					byFoot:
						Math.floor(
							await openRouteService.travelTime(
								'foot',
								{ latitude, longitude },
								ENSEEIHT
							)
						) || null,
					byPublicTransport: null
				};
				appartInput.nearbyStations = {
					createMany: {
						data: await tisseo.nearbyStations({ latitude, longitude }, fetch)
					}
				};
			}

			appartment = await prisma.appartment.create({
				data: appartInput,
				include: { photos: true }
			});
			console.log(appartment);
		} catch (err) {
			console.error(err);
			throw error(500, { message: "Impossible de poster l'annonce" });
		}

		for (const photo of appartment.photos) {
			const file = files.find((file) => file.name === photo.filename);
			if (!file) continue;

			const buffer = Buffer.from(await file.arrayBuffer());

			if (buffer.length === 0) continue;

			if (buffer.byteLength > 10e6) {
				throw error(400, { message: 'Les photos doivent faire moins de 10 Mo' });
			}

			mkdirSync(path.dirname(path.join('public', appartmentPhotoURL(photo))), {
				recursive: true
			});
			writeFileSync(
				path.join('public', appartmentPhotoURL(photo)),
				Buffer.from(await file.arrayBuffer())
			);
		}

		throw redirect(302, '/appartements/gerer');
	}
};
