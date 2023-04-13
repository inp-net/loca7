import { writeFileSync, rmSync, copyFileSync } from 'fs';
import { error } from '@sveltejs/kit';
import path from 'path';
import { photoURL } from '$lib/photos';
import type { Photo } from '@prisma/client';
import sharp from 'sharp';

export async function writePhotosToDisk(photos: Photo[], files: File[]) {
	for (const photo of photos) {
		const file = files.find((file) => file.name === photo.filename);
		if (!file) continue;

		const buffer = Buffer.from(await file.arrayBuffer());

		if (buffer.length === 0) continue;

		if (buffer.byteLength > 10e6) {
			throw error(400, { message: 'Les photos doivent faire moins de 10 Mo' });
		}

		compressPhoto(Buffer.from(await file.arrayBuffer()), path.join('public', photoURL(photo)));
	}
}

export async function copyPhotos(to: Photo[], from: Photo[]) {
	for (const photo of to) {
		const source = from.find((p) => p.filename === photo.filename);
		if (!source) continue;
		copyFileSync(path.join('public', photoURL(source)), path.join('public', photoURL(photo)));
	}
}

export async function compressPhoto(buf: Buffer, filename: string) {
	await sharp(buf)
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
			rmSync(path.join('public', photoURL(photo)));
		} catch (error) {
			if (error?.code !== 'ENOENT') {
				throw error;
			}
		}
	}
}
