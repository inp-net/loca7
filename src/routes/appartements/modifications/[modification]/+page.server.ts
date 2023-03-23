import { guards } from '$lib/server/lucia';
import { openRouteService, tisseo } from '$lib/server/traveltime';
import { ENSEEIHT } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';
import { renameSync } from 'fs';
import path from 'path';
import type { Actions, PageServerLoad } from './$types';
import { writePhotosToDisk, deletePhotosFromDisk, copyPhotos } from '$lib/server/photos';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user, session } = await locals.validateUser();
	guards.emailValidated(user, session);

	const modification = await prisma.appartmentEdit.findUnique({
		where: {
			id: params.modification
		},
		include: {
			appartment: {
				include: {
					owner: true,
					photos: true
				}
			},
			photos: true
		}
	});

	return { modification };
};

export const actions: Actions = {
	async apply({ params, locals, fetch }) {
		const { user, session } = await locals.validateUser();
		guards.isAdmin(user, session);

		const edit = await prisma.appartmentEdit.findUnique({
			where: {
				id: params.modification
			},
			include: {
				appartment: {
					include: {
						owner: true,
						photos: true,
						nearbyStations: true,
						travelTimeToN7: true
					}
				},
				photos: true
			}
		});

		if (edit === null) return error(404, { message: 'Modification inexistante' });

		await deletePhotosFromDisk(edit.appartment.photos);

		const newAppartment = await prisma.appartment.update({
			where: {
				id: edit.appartment.id
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
										await openRouteService.travelTime('bike', edit, ENSEEIHT)
								  )
								: null,
						byFoot:
							edit.latitude && edit.longitude
								? Math.floor(
										await openRouteService.travelTime('foot', edit, ENSEEIHT)
								  )
								: null,
						byPublicTransport: null // TODO
					}
				}
			},
			include: {
				photos: true
			}
		});

		await copyPhotos(newAppartment.photos, edit.photos);

		await prisma.appartmentEdit.update({
			where: { id: edit.id },
			data: {
				applied: true,
				appliedAt: new Date()
			}
		});

		throw redirect(302, `/appartements/${newAppartment.id}`);
	},

	async delete({ params, locals }) {
		const { user, session } = await locals.validateUser();
		guards.emailValidated(user, session);
		const modification = await prisma.appartmentEdit.findUnique({
			where: {
				id: params.modification
			},
			include: {
				appartment: {
					include: {
						owner: true
					}
				},
				photos: true
			}
		});
		if (modification === null) return error(404, { message: 'Modification inexistante' });
		if (!(user.admin || user.id === modification.appartment.ownerId))
			return error(403, { message: "Vous n'êtes ni propriétaire, ni administrateur" });

		await deletePhotosFromDisk(modification.photos);
		await prisma.appartmentEdit.delete({
			where: {
				id: params.modification
			}
		});

		throw redirect(302, `/appartements/${modification.appartment.id}`);
	}
};
