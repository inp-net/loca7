import { faker } from '@faker-js/faker';
import { ENSEEIHT } from './utils';
import {
	TADColorsByLine,
	busLinesByColor,
	metroColorsByLine,
	tramColorsByLine
} from './publicTransportColors';
import mime from 'mime-types';
import md5 from 'md5';

export type AppartmentKind =
	| 'chambre'
	| 'studio'
	| 't1'
	| 't1bis'
	| 't2'
	| 't3etplus'
	| 'colocation';

export type PublicTransportType = 'bus' | 'bhnf' | 'metro' | 'tram' | 'telepherique' | 'tad';

export const DISPLAY_APPARTMENT_KIND: Record<AppartmentKind, string> = {
	chambre: 'Chambre',
	studio: 'Studio',
	t1: 'T1',
	t1bis: 'T1 bis',
	t2: 'T2',
	t3etplus: 'T3 et plus',
	colocation: 'Colocation'
};

export const DISPLAY_PUBLIC_TRANSPORT_TYPE: Record<PublicTransportType, string> = {
	bus: 'bus',
	bhnf: 'tram-bus',
	metro: 'métro',
	tram: 'tramway',
	telepherique: 'téléphérique',
	tad: 'TAD'
};

export type PublicTransportStation = {
	name: string;
	line: string;
	type: PublicTransportType;
	color: string | null;
};

export type Photo = {
	filename: string;
	contentType: string;
	appartmentId: string;
	position: number;
};

export type Appartment = {
	photos: Photo[];
	id: string;
	rent: number;
	charges: number;
	deposit: number;
	surface: number;
	kind: AppartmentKind;
	roomsCount: number;
	availableAt: Date;
	createdAt: Date;
	address: string;
	location: GeographicPoint | null;
	hasFurniture: boolean | null;
	hasParking: boolean | null;
	description: string;
	travelTimeToN7: {
		byFoot: number | null;
		byBike: number | null;
		byPublicTransport: number | null;
	};
	nearbyStations: PublicTransportStation[];
	owner: {
		id: string;
		name: string;
		phone: string;
		email: string;
	};
};

export type User = {
	id: string;
	name: string;
	phone: string;
	email: string;
};

export type SearchCriteria = {
	minimumSurface: number | undefined;
	maximumRent: number | undefined;
	type: AppartmentKind[];
	furniture: boolean | null;
	parking: boolean | null;
	bicycleParking: boolean | null;
};

const randomAppartementSpread = 0.025;
export const randomAppartment: () => Appartment = () => ({
	address: faker.address.streetAddress(true),
	availableAt: faker.date.past(),
	createdAt: faker.date.past(),
	charges: faker.datatype.number({ min: 10, max: 100 }),
	deposit: faker.datatype.number({ min: 20, max: 1500 }),
	description: faker.lorem.paragraphs(3),
	hasFurniture: faker.datatype.boolean(),
	hasParking: faker.datatype.boolean(),
	kind: faker.helpers.arrayElement(Object.keys(DISPLAY_APPARTMENT_KIND)) as AppartmentKind,
	id: faker.datatype.uuid(),
	photos: [],
	location: {
		latitude:
			ENSEEIHT.latitude +
			faker.datatype.number({
				max: randomAppartementSpread,
				min: -randomAppartementSpread,
				precision: randomAppartementSpread / 10
			}),
		longitude:
			ENSEEIHT.longitude +
			faker.datatype.number({
				max: randomAppartementSpread,
				min: -randomAppartementSpread,
				precision: randomAppartementSpread / 10
			})
	},
	nearbyStations: Array(faker.datatype.number({ max: 6, min: 0 }))
		.fill({})
		.map(() => {
			const type = faker.helpers.arrayElement(
				Object.keys(DISPLAY_PUBLIC_TRANSPORT_TYPE)
			) as PublicTransportType;
			let line: string;
			switch (type) {
				case 'bhnf':
					line = `L${faker.datatype.number({ max: 14, min: 1 })}`;
					break;
				case 'bus':
					line = faker.helpers.arrayElement(Object.values(busLinesByColor).flat());
					break;
				case 'metro':
					line = faker.helpers.arrayElement(Object.keys(metroColorsByLine));
					break;
				case 'tad':
					line = faker.helpers.arrayElement(Object.keys(TADColorsByLine));
					break;
				case 'tram':
					line = faker.helpers.arrayElement(Object.keys(tramColorsByLine));
					break;
				case 'telepherique':
					line = 'Téléo';
					break;
			}
			return {
				name: faker.address.streetName(),
				line,
				type,
				color: null
			};
		}),
	owner: {
		name: faker.name.fullName(),
		id: faker.datatype.uuid(),
		phone: faker.phone.number(),
		email: faker.internet.email()
	},
	rent: faker.datatype.number({ min: 300, max: 1500 }),
	roomsCount: faker.datatype.number({ max: 5, min: 1 }),
	surface: faker.datatype.number({ max: 100, min: 10 }),
	travelTimeToN7: {
		byBike: faker.datatype.number({ max: 30, min: 5 }) * 60,
		byFoot: faker.datatype.number({ max: 30, min: 5 }) * 60,
		byPublicTransport: faker.datatype.number({ max: 30, min: 5 }) * 60
	}
});

export type GeographicPoint = {
	latitude: number;
	longitude: number;
};

export function appartmentPhotoURL(photo: Photo): string {
	return `/photos/appartments/${photo.appartmentId}/${appartmentPhotoFilenameOnDisk(photo)}`;
}

export function appartmentPhotoFilenameOnDisk(photo: Photo): string {
	return `${md5(photo.filename)}.${mime.extension(photo.contentType) || 'bin'}`;
}
