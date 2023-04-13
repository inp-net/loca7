import type { Photo } from '@prisma/client';

export function photoFilenameOnDisk(photo: Photo): string {
	return `${photo.id}.jpeg`;
}

export function photoURL(photo: Photo): string {
	if (photo.appartmentId === null && photo.appartmentEditId === null)
		throw new Error(`photoURL: photo ${JSON.stringify(photo)} is not attached to anything`);
	return `/photos/appartments/${photoFilenameOnDisk(photo)}`;
}
