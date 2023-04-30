import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { openRouteService, tisseo } from '$lib/server/traveltime';
import {
	DISPLAY_APPARTMENT_KIND,
	DISPLAY_ASPECT_FIELDS,
	createGhostEmail,
	ternaryStateCheckboxToBoolean
} from '$lib/types';
import { ENSEEIHT, distanceBetween } from '$lib/utils';
import type { AppartmentKind, Prisma } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import xss from 'xss';
import type { Actions, PageServerLoad } from './$types';
import { writePhotosToDisk } from '$lib/server/photos';
import { randomUUID } from 'crypto';
import { log } from '$lib/server/logging';
import { sendMail } from '$lib/server/mail';

export const load: PageServerLoad = async ({ locals, url, parent }) => {
	const { session, user } = await locals.validateUser();
	guards.emailValidated(user, session, url);

	return { ...(await parent()), user };
};

export const actions: Actions = {
	postAppartment: async ({ request, locals, fetch, url }) => {
		const { user, session } = await locals.validateUser();
		guards.emailValidated(user, session, url);

		const formDataRaw = await request.formData();
		const formData = Object.fromEntries(formDataRaw) as Record<string, string>;

		const isDummyFile = (file: File) =>
			file.size === 0 && file.type === 'application/octet-stream';
		const files = (formDataRaw.getAll('photos') as File[]).filter((f) => !isDummyFile(f));

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
			description,
			ownerEmail,
			ownerPhone,
			ownerFirstName,
			ownerLastName,
			ownerAgencyName,
			ownerAgencyWebsite
		} = formData;

		const latitude = addressLatitude && addressLongitude ? Number(addressLatitude) : null;
		const longitude = addressLatitude && addressLongitude ? Number(addressLongitude) : null;

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
				address: xss(address),
				latitude,
				longitude,
				description: xss(description),
				createdByAdmin: user.admin,
				approved: user.admin,
				owner: {
					connectOrCreate: {
						create: {
							email:
								ownerEmail ||
								createGhostEmail(ownerFirstName ?? '', ownerLastName ?? ''),
							firstName: ownerFirstName ?? '',
							lastName: ownerLastName ?? '',
							phone: ownerPhone ?? '',
							agencyName: ownerAgencyName ?? '',
							agencyWebsite: ownerAgencyWebsite ?? ''
						},
						where: {
							email: ownerEmail || user.email
						}
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
					? ternaryStateCheckboxToBoolean(formData.hasFurniture)
					: null,
				hasParking: Object.keys(formData).includes('hasParking')
					? ternaryStateCheckboxToBoolean(formData.hasParking)
					: null,
				hasBicycleParking: Object.keys(formData).includes('hasBicycleParking')
					? ternaryStateCheckboxToBoolean(formData.hasParking)
					: null,
				hasFiberInternet: Object.keys(formData).includes('hasFiberInternet')
					? ternaryStateCheckboxToBoolean(formData.hasFiberInternet)
					: null,
				hasElevator: Object.keys(formData).includes('hasElevator')
					? ternaryStateCheckboxToBoolean(formData.hasElevator)
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
				include: { photos: true, owner: true, travelTimeToN7: true }
			});
			await writePhotosToDisk(appartment.photos, files);
			for (const admin of await prisma.user.findMany({ where: { admin: true } })) {
				await sendMail({
					to: admin.email,
					subject: `Nouvelle annonce de ${appartment.owner.firstName + ' ' + appartment.owner.lastName} en attente`,
					template: 'appartment-to-validate',
					data: {
						userFullName: appartment.owner.firstName + ' ' + appartment.owner.lastName,
						userEmail: appartment.owner.email,
						appartmentId: appartment.id,
						appartment: {
							...appartment,
							availableAt: new Intl.DateTimeFormat('fr-FR').format(
								appartment.availableAt
							),
							displayKind: DISPLAY_APPARTMENT_KIND[appartment.kind],
							distance:
								appartment.longitude && appartment.latitude
									? distanceBetween(appartment, ENSEEIHT)
									: '?',
							aspectsLine: Object.entries(DISPLAY_ASPECT_FIELDS)
								.filter(([key, display]) => appartment[key])
								.map(([key, display]) => display)
								.join(', ')
						}
					}
				});
			}
			await log.info('submit_appartment', user, { input: appartInput, created: appartment });
		} catch (err) {
			await log.fatal(
				'submit_appartment',
				user,
				err,
				'\n\nwith data',
				{
					formData,
					latitude,
					longitude,
					photosOrder
				},
				'files',
				files
			);
			throw error(500, { message: "Impossible de poster l'annonce" });
		}

		throw redirect(302, '/appartements/gerer');
	}
};
