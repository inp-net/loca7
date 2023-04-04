import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { ternaryStateCheckboxToBoolean } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';
import { copyPhotos, writePhotosToDisk } from '$lib/server/photos';
import xss from 'xss';
import { redirect } from '@sveltejs/kit';
import type { AppartmentKind } from '@prisma/client';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const { user, session } = await locals.validateUser();
	guards.emailValidated(user, session, url);

	const appartment = await prisma.appartment.findFirst({
		where: {
			id: params.id
		},
		include: {
			owner: true,
			nearbyStations: true,
			travelTimeToN7: true,
			reports: true,
			photos: true
		}
	});

	guards.appartmentAccessible(user, appartment);

	return {
		appartment: {
			...appartment,
			photos: appartment.photos.sort((a, b) => a.position - b.position),
			// Don't include potentially identifying information from the reports
			reports: appartment.reports.map(({ reason, message, id }) => ({ reason, message, id }))
		}
	};
};

export const actions: Actions = {
	edit: async ({ request, locals, params, url }) => {
		const { user, session } = await locals.validateUser();
		guards.emailValidated(user, session, url);
		const appartment = await prisma.appartment.findUnique({
			where: { id: params.id },
			include: {
				owner: true,
				photos: true
			}
		});
		guards.appartmentAccessible(user, appartment);

		const formDataRaw = await request.formData();
		const formData = Object.fromEntries(formDataRaw) as Record<string, string>;
		let files = formDataRaw.getAll('photos') as File[];
		const isDummyFile = (file: File) =>
			file.size === 0 && file.type === 'application/octet-stream';

		// XXX: The files array should be empty in that case, but it's not, let's pretend it is
		if (files.length === 1 && isDummyFile(files[0])) {
			files = [];
		}

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
			hasFurniture,
			hasParking,
			hasBicycleParking,
			addressLongitude,
			description
		} = formData;

		const latitude = addressLatitude && addressLongitude ? Number(addressLatitude) : null;
		const longitude = addressLatitude && addressLongitude ? Number(addressLongitude) : null;

		const edit = await prisma.appartmentEdit.create({
			data: {
				appartment: {
					connect: {
						id: appartment.id
					}
				},
				address: xss(address),
				availableAt: new Date(availableAt),
				charges: Number(charges),
				deposit: Number(deposit),
				description: xss(description),
				kind: kind as AppartmentKind,
				latitude,
				longitude,
				rent: Number(rent),
				roomsCount: formDataRaw.get('roomsCount') ? Number(formData.roomsCount) : 0,
				surface: Number(surface),
				applied: false,
				photos: {
					createMany: {
						data: files.map((file) => ({
							filename: file.name,
							position: photosOrder.indexOf(file.name),
							contentType: file.type
							// hash: md5() // TODO hash the file content
						}))
					}
				},
				hasFurniture: ternaryStateCheckboxToBoolean(hasFurniture),
				hasParking: ternaryStateCheckboxToBoolean(hasParking),
				hasBicycleParking: ternaryStateCheckboxToBoolean(hasBicycleParking)
			},
			include: {
				photos: true
			}
		});

		// This copy is necessary for photos that have no associated file (or rather the associated file is empty) because they were already uploaded (they were already in the appartment), and their content is not sent in the form data
		await copyPhotos(edit.photos, appartment.photos);
		await writePhotosToDisk(edit.photos, files);

		throw redirect(
			302,
			user?.admin ? `/administration` : `/appartements/${appartment.id}/modifier/fait`
		);
	}
};
