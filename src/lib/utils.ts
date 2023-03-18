import md5 from 'md5';
import type { GeographicPoint } from './types';

export function durationDisplay(seconds: number) {
	const minute = 60;
	const hour = minute * 60;
	const day = hour * 24;
	const week = day * 7;
	const month = day * 31;
	const year = month * 12;
	const century = year * 100;
	let displayString = '';
	let base = 0;
	if (seconds < 1) {
		displayString = "moins d'une seconde";
	} else if (seconds < minute) {
		base = Math.round(seconds);
		displayString = `${base} ${base === 1 ? 'seconde' : 'secondes'}`;
	} else if (seconds < hour) {
		base = Math.round(seconds / minute);
		displayString = `${base} ${base === 1 ? 'minute' : 'minutes'}`;
	} else if (seconds < day) {
		base = Math.round(seconds / hour);
		displayString = `${base} ${base === 1 ? 'heure' : 'heures'}`;
	} else if (seconds < week) {
		base = Math.round(seconds / day);
		displayString = `${base} ${base === 1 ? 'jour' : 'jours'}`;
	} else if (seconds < month) {
		base = Math.round(seconds / week);
		displayString = `${base} ${base === 1 ? 'semaine' : 'semaines'}`;
	} else if (seconds < year) {
		base = Math.round(seconds / month);
		displayString = `${base} mois`;
	} else if (seconds < century) {
		base = Math.round(seconds / year);
		displayString = `${base} ${base === 1 ? 'an' : 'ans'}`;
	} else {
		displayString = 'des siècles';
	}
	return displayString;
}

export function distanceDisplay(distanceMeters: number): string {
	const useMeters = distanceMeters < 1000;
	return Intl.NumberFormat('fr-FR', {
		style: 'unit',
		unit: useMeters ? 'meter' : 'kilometer',
		maximumFractionDigits: useMeters ? 0 : 2
	}).format(useMeters ? distanceMeters : distanceMeters * 1e-3);
}

export function availableAtSentence(availableSince: number, availableAt: Date): string {
	let out = '';
	if (
		availableAt.getFullYear() === new Date().getFullYear() &&
		availableAt.getMonth() === new Date().getMonth() &&
		availableAt.getDate() === new Date().getDate()
	) {
		out += "Se libère aujourd'hui";
	} else if (availableSince > 0) {
		out += 'Libéré depuis le ';
	} else {
		out += 'Se libère le ';
	}
	if (availableSince !== 0) {
		out += new Intl.DateTimeFormat('fr-FR', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(new Date(availableAt));
	}

	return out;
}

/**
 * @returns Distance in meters
 */
export function distanceBetween(a: GeographicPoint, b: GeographicPoint): number {
	const earthRadiusKm = 6371;
	const latitudeDistanceRadians = degreesToRadians(b.latitude - a.latitude);
	const longitudeDistanceRadians = degreesToRadians(b.longitude - a.longitude);
	const x =
		Math.sin(latitudeDistanceRadians / 2) * Math.sin(latitudeDistanceRadians / 2) +
		Math.cos(degreesToRadians(a.latitude)) *
			Math.cos(degreesToRadians(b.latitude)) *
			Math.sin(longitudeDistanceRadians / 2) *
			Math.sin(longitudeDistanceRadians / 2);
	const distanceRadians = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
	const distanceMeters = earthRadiusKm * 1e3 * distanceRadians;
	return distanceMeters;
}

function degreesToRadians(degrees: number): number {
	return degrees * (Math.PI / 180);
}

export function readableOn(color: string): string {
	const rgb = color.replace(/^#/, '').match(/.{2}/g);
	if (rgb === null) throw new Error('Invalid color, use hex notation');
	const o = Math.round(
		(parseInt(rgb[0], 16) * 299 + parseInt(rgb[1], 16) * 587 + parseInt(rgb[2], 16) * 114) /
			1000
	);
	return o > 125 ? '#000000' : '#ffffff';
}

export const ENSEEIHT: GeographicPoint = {
	latitude: 1.455074,
	longitude: 43.60263
};

export async function getDataURL(file: File): Promise<string> {
	console.log(`getting data url of ${file.name}`);
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => resolve(reader.result as string));
		reader.addEventListener('error', (e) => reject(e));
		reader.readAsDataURL(file);
	});
}

export async function getContentHash(file: File): Promise<string> {
	console.log(`getting hash of ${file.name}`);
	return md5(new Uint8Array(await file.arrayBuffer()));
}

// Thx to https://gist.github.com/xenozauros/f6e185c8de2a04cdfecf
export function hexToHsl(hex: `#${string}`): {
	hue: number;
	saturation: number;
	lightness: number;
} {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result === null) throw new Error('Invalid color, use hex notation');
	let r = parseInt(result[1], 16);
	let g = parseInt(result[2], 16);
	let b = parseInt(result[3], 16);
	(r /= 255), (g /= 255), (b /= 255);
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	let h, s;
	const l = (max + min) / 2;
	if (max == min) {
		h = s = 0; // achromatic
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
			default:
				throw new Error('Unreachable code @ hexToHsl');
		}
		h /= 6;
	}
	return {
		hue: h,
		saturation: s,
		lightness: l
	};
}
