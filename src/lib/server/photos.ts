import { writeFileSync, rmSync, copyFileSync } from 'fs';
import { error } from '@sveltejs/kit';
import path from 'path';
import { photoURL } from '$lib/photos';
import type { Photo } from '@prisma/client';
import sharp from 'sharp';
import { publicPath } from './utils';
import { log } from './logging';
import { MAX_PHOTO_SIZE_BYTES } from '$lib/constants';

export async function writePhotosToDisk(photos: Photo[], files: File[]) {
	await log.trace('submit_appartment', null, 'Writing photos to disk');
	for (const photo of photos) {
		await log.trace('submit_appartment', null, 'Writing photo to disk', {
			photo: photo.filename
		});
		const file = files.find((file) => file.name === photo.filename);
		if (!file) {
			await log.warn(
				'submit_appartment',
				null,
				`Couldn't find file ${photo.filename} in files ${JSON.stringify(
					files.map(({ name }) => name)
				)}`
			);
			continue;
		}

		const buffer = Buffer.from(await file.arrayBuffer());

		if (buffer.length === 0) {
			await log.warn(
				'submit_appartment',
				null,
				`While writing photo ${photo.filename}: buffer is empty`
			);
			continue;
		}

		if (buffer.byteLength > MAX_PHOTO_SIZE_BYTES) {
			error(400, {
				message: `Les photos doivent faire moins de ${MAX_PHOTO_SIZE_BYTES * 1e-6} Mo`
			});
		}
		try {
			compressPhoto(Buffer.from(await file.arrayBuffer()), publicPath(photoURL(photo)));
		} catch (err) {
			await log.error(
				'submit_appartment',
				null,
				`While compressing photo ${photo.filename}: ${err}`
			);
		}
	}
}

export async function copyPhotos(to: Photo[], from: Photo[]) {
	for (const photo of to) {
		const source = from.find((p) => p.filename === photo.filename);
		if (!source) continue;
		copyFileSync(publicPath(photoURL(source)), publicPath(photoURL(photo)));
	}
}

export async function compressPhoto(buf: Buffer, filename: string) {
	await sharp(buf, {
		failOn: 'none'
	})
		.resize({
			width: 1000,
			withoutEnlargement: true
		})
		.jpeg({
			quality: 80
		})
		.toFile(filename);
}

export async function deletePhotosFromDisk(photos: Photo[]) {
	for (const photo of photos) {
		try {
			rmSync(publicPath(photoURL(photo)));
		} catch (error) {
			if (error?.code !== 'ENOENT') {
				throw error;
			}
		}
	}
}
