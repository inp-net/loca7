import { guards } from '$lib/server/lucia';
import { appartmentTitle, createGhostEmail } from '$lib/types';
import { prisma } from '$lib/server/prisma';
import { ternaryStateCheckboxToBoolean } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';
import { copyPhotos, deletePhotosFromDisk, writePhotosToDisk } from '$lib/server/photos';
import xss from 'xss';
import { redirect } from '@sveltejs/kit';
import type { AppartmentKind } from '@prisma/client';
import { log } from '$lib/server/logging';
import { sendMail } from '$lib/server/mail';
import { EDITABLE_FIELDS } from '$lib/appartmentDiff';
import * as appartmentDiff from '$lib/appartmentDiff';
import { openRouteService, tisseo } from '$lib/server/traveltime';
import { ENSEEIHT } from '$lib/utils';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const { user, session } = await locals.validateUser();
	guards.emailValidated(user, session, url);

	const appartment = await prisma.appartment.findFirst({
		where: isNaN(Number(params.id)) ? { id: params.id } : { number: Number(params.id) },
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
			where: isNaN(Number(params.id)) ? { id: params.id } : { number: Number(params.id) },
			include: {
				owner: true,
				photos: true,
				likes: { include: { by: true } }
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
			hasFiberInternet,
			hasElevator,
			addressLongitude,
			description,
			ownerFirstName,
			ownerLastName,
			ownerEmail,
			ownerPhone,
			ownerAgencyName,
			ownerAgencyWebsite
		} = formData;

		const latitude = addressLatitude && addressLongitude ? Number(addressLatitude) : null;
		const longitude = addressLatitude && addressLongitude ? Number(addressLongitude) : null;

		const changingOwner =
			ownerEmail !== appartment.owner.email &&
			![ownerEmail, ownerLastName, ownerFirstName, ownerPhone].every(
				(x) => x === '' || x === undefined
			);

		if (changingOwner) {
			let newOwner = await prisma.user.findUnique({
				where: {
					email: ownerEmail
				}
			});

			const creatingOwner = !newOwner;

			if (!newOwner) {
				newOwner = await prisma.user.create({
					data: {
						email: ownerEmail || createGhostEmail(ownerFirstName, ownerLastName),
						firstName: ownerFirstName,
						lastName: ownerLastName,
						phone: ownerPhone,
						agencyName: ownerAgencyName,
						agencyWebsite: ownerAgencyWebsite
					}
				});
			}

			await prisma.appartment.update({
				where: {
					id: appartment.id
				},
				data: {
					owner: {
						connect: {
							id: newOwner.id
						}
					}
				}
			});
			await log.info(
				'submit_appartment_edit',
				user,
				'appartment owner changed from',
				ownerEmail,
				'to',
				newOwner?.email + (creatingOwner ? ' (new account)' : ''),
				'(effective immediately)'
			);
		}

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
				applied: user.admin, // TODO not sure about that, maybe add a checkbox? see #134
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
				hasBicycleParking: ternaryStateCheckboxToBoolean(hasBicycleParking),
				hasFiberInternet: ternaryStateCheckboxToBoolean(hasFiberInternet),
				hasElevator: ternaryStateCheckboxToBoolean(hasElevator)
			},
			include: {
				photos: true
			}
		});

		// This copy is necessary for photos that have no associated file (or rather the associated file is empty) because they were already uploaded (they were already in the appartment), and their content is not sent in the form data
		await copyPhotos(edit.photos, appartment.photos);
		await writePhotosToDisk(edit.photos, files);

		const diffs = (Object.keys(EDITABLE_FIELDS) as (keyof typeof EDITABLE_FIELDS)[])
			.filter((f) => appartmentDiff.modified(f, appartment, edit))
			.map((f) => ({
				diff: appartmentDiff.modification(f, appartment, edit),
				label: EDITABLE_FIELDS[f]
			}));

		if (!edit.applied) {
			await sendMail({
				to: (await prisma.user.findMany({ where: { admin: true } })).map(
					(admin) => admin.email
				),
				subject: `Modification de l'annonce #${appartment.number} en attente`,
				template: 'appartment-edit-to-validate',
				data: {
					userFullName: appartment.owner.firstName + ' ' + appartment.owner.lastName,
					userEmail: appartment.owner.email,
					number: appartment.number,
					appartmentId: appartment.id,
					editId: edit.id,
					edits: diffs,
					label: undefined /* key & content are inside of the #each edits, but this is to satisfy the (wrongly) generated type */,
					diff: undefined
				}
			});
		} else {
			// XXX code copied from /modifications/[modification]/+page.server.ts, should be refactored
			await deletePhotosFromDisk(appartment.photos);

			const newAppartment = await prisma.appartment.update({
				where: {
					id: appartment.id
				},
				data: {
					address: edit.address,
					approved: undefined,
					archived: undefined,
					availableAt: edit.availableAt,
					charges: edit.charges,
					createdAt: undefined,
					deposit: edit.deposit,
					description: edit.description,
					hasFurniture: edit.hasFurniture,
					hasParking: edit.hasParking,
					hasBicycleParking: edit.hasBicycleParking,
					hasFiberInternet: edit.hasFiberInternet,
					hasElevator: edit.hasElevator,
					history: undefined,
					id: undefined,
					kind: edit.kind,
					latitude: edit.latitude,
					longitude: edit.longitude,
					nearbyStations: {
						deleteMany: {},
						createMany: {
							data:
								edit.latitude && edit.longitude
									? await tisseo.nearbyStations(edit, fetch)
									: []
						}
					},
					owner: undefined,
					ownerId: undefined,
					rent: edit.rent,
					reports: undefined,
					roomsCount: edit.roomsCount,
					surface: edit.surface,
					photos: {
						deleteMany: {},
						createMany: {
							data: edit.photos.map((photo) => ({
								contentType: photo.contentType,
								filename: photo.filename,
								position: photo.position,
								hash: photo.hash
							}))
						}
					},
					travelTimeToN7: {
						update: {
							byBike:
								edit.latitude && edit.longitude
									? Math.floor(
											await openRouteService.travelTime(
												'bike',
												edit,
												ENSEEIHT
											)
										)
									: null,
							byFoot:
								edit.latitude && edit.longitude
									? Math.floor(
											await openRouteService.travelTime(
												'foot',
												edit,
												ENSEEIHT
											)
										)
									: null,
							byPublicTransport: null // TODO
						}
					}
				},
				include: {
					photos: true,
					likes: {
						include: {
							by: true
						}
					}
				}
			});

			await copyPhotos(newAppartment.photos, edit.photos);
			await sendMail({
				to: appartment.likes.map((like) => like.by),
				subject: `Une annonce vous intéréssant a été modifiée`,
				template: 'liked-appartment-was-edited',
				data: {
					appartmentTitle: appartmentTitle(appartment),
					diff: undefined,
					edits: diffs.filter((diff) => diff.label.toLowerCase() !== 'photos'),
					label: undefined,
					number: appartment.number
				}
			});
		}

		redirect(
			302,
			user?.admin ? `/administration` : `/appartements/${appartment.id}/modifier/fait`
		);
	}
};
