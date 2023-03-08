import { fail, redirect, type Actions, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { type AppartmentKind, appartmentPhotoURL, appartmentPhotoFilenameOnDisk } from '$lib/types';
import { prisma } from '$lib/server/prisma';
import { rmSync, readdirSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import xss from 'xss';
import md5 from 'md5';
import { getContentHash } from '$lib/utils';

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
			reports: true,
			photos: true
		}
	});

	if (appartment === null) {
		throw error(404, { message: "Cette annonce n'existe pas ou ne vous appartient pas" });
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

		const formDataRaw = await request.formData();
		const formData = Object.fromEntries(formDataRaw) as Record<string, string>;
		console.log({ 'editing appartment': formData });
		const files = formDataRaw.getAll('photos') as File[];

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

		console.log(files);

		const tristateCheckboxToBoolean = (value: string) => {
			return {
				indeterminate: null,
				on: true,
				off: false
			}[value];
		};

		const appartment = await prisma.appartment.update({
			where: {
				id: params.id
			},
			data: {
				photos: {
					upsert: files.map((file) => ({
						where: {
							filename: file.name
						},
						update: {
							contentType: file.type
						},
						create: {
							filename: file.name,
							contentType: file.type
						}
					}))
				},
				rent: Number(rent),
				charges: Number(charges),
				deposit: Number(deposit),
				surface: Number(surface),
				kind: kind as AppartmentKind,
				roomsCount: Object.keys(formData).includes('roomsCount') ? Number(formData.roomsCount) : 0,
				availableAt: new Date(Date.parse(availableAt)),
				address,
				description: xss(description),
				hasFurniture: Object.keys(formData).includes('hasFurniture')
					? tristateCheckboxToBoolean(formData.hasFurniture)
					: undefined,
				hasParking: Object.keys(formData).includes('hasParking')
					? tristateCheckboxToBoolean(formData.hasParking)
					: undefined,

				location:
					addressLatitude && addressLongitude
						? {
								create: {
									latitude: parseFloat(addressLatitude),
									longitude: parseFloat(addressLongitude)
								}
						  }
						: undefined
			},
			include: {
				photos: true
			}
		});

		await prisma.appartment.update({
			where: {
				id: params.id
			},
			data: {
				photos: {
					deleteMany: {
						filename: {
							notIn: files.map((f) => f.name)
						}
					}
				}
			}
		});

		const appartmentPhotosDirectory = path.dirname(
			path.join(
				'public',
				appartmentPhotoURL({
					appartmentId: appartment.id,
					contentType: '',
					filename: ''
				})
			)
		);

		// Add new photos
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

		// Remove photo files that were removed from the database
		for (const entry of readdirSync(appartmentPhotosDirectory)) {
			if (appartment.photos.find((photo) => appartmentPhotoFilenameOnDisk(photo) === entry)) {
				continue;
			} else {
				rmSync(path.join(appartmentPhotosDirectory, entry));
			}
		}

		throw redirect(302, `/appartements/gerer`);
	}
};
