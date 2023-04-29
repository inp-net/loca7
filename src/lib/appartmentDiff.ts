import type { Appartment, AppartmentEdit, Photo } from '@prisma/client';
import htmldiff from 'node-htmldiff';
import { DISPLAY_APPARTMENT_KIND } from './types';
import { photoURL } from './photos';

export function modified(
	field: keyof Appartment & keyof AppartmentEdit,
	current: Appartment,
	edit: AppartmentEdit
): boolean {
	if (field === 'photos') {
		const serialize = (ps: Photo[]) =>
			JSON.stringify(
				ps.map((p) => ({
					contentType: p.contentType,
					filename: p.filename,
					hash: p.hash,
					position: p.position
				}))
			);
		return serialize(current.photos) !== serialize(edit.photos);
	}
	return /<(ins|del)/g.test(modification(field, current, edit));
}

export function display(
	value: string | number | Date | boolean | null,
	field: keyof Appartment & keyof AppartmentEdit
) {
	if (field === 'description') {
		return value
			?.toString()
			.replaceAll(/<\/?span>/g, '')
			.replaceAll(/<\/?br>/g, '\n')
			.replace(/<\/?p>/g, '')
			.replaceAll(/</g, '&lt;')
			.replaceAll(/>/g, '&gt;');
	}
	if (field === 'kind' && typeof value === 'string') {
		return DISPLAY_APPARTMENT_KIND[value] ?? value;
	}
	if (field === 'photos') {
		return (value as Photo[])
			.map((photo) => `${photo.position + 1}: ${photo.filename}`)
			.join('\n');
	}
	switch (typeof value) {
		case 'number':
			return (
				value +
				(field === 'surface'
					? ' m²'
					: ['charges', 'rent', 'deposit'].includes(field)
					? '€'
					: '')
			);

		case 'boolean':
			return value
				? '<span class="boolean-true">Oui</span>'
				: '<span class="boolean-false">Non</span>';
		default:
			if (value instanceof Date) {
				return Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(value);
			}
			return value?.toString() ?? '';
	}
}

export function modification(
	field: keyof Appartment & keyof AppartmentEdit,
	current: Appartment,
	edit: AppartmentEdit
): string {
	return htmldiff(display(current[field], field), display(edit[field], field)).replaceAll(
		/\n/g,
		'<br />'
	);
}

export const EDITABLE_FIELDS: Record<keyof Appartment & keyof AppartmentEdit, string> = {
	address: 'Adresse',
	latitude: 'Latitude',
	longitude: 'Longitude',
	availableAt: 'Disponible au',
	rent: 'Loyer',
	charges: 'Charges',
	deposit: 'Caution',
	hasFurniture: 'Meublé',
	hasParking: 'Parking',
	hasFiberInternet: 'Fibre optique',
	hasElevator: 'Ascenseur',
	hasBicycleParking: 'Place pour vélo',
	kind: 'Type',
	roomsCount: 'Nombre de chambres',
	surface: 'Surface',
	// createdAt: 'Créé le',
	description: 'Description',
	// id: 'ID',
	photos: 'Photos'
};
