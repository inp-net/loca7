import type { GeographicPoint } from './utils';

export type AppartmentKind =
	| 'Chambre'
	| 'Studio'
	| 'T1'
	| 'T1 bis'
	| 'T2'
	| 'T3 et plus'
	| 'Colocation';

export type PublicTransportType = 'bus' | 'bhnf' | 'metro' | 'tram' | 'telepherique' | 'tad';

export const APPARTMENT_KINDS = [
	'Chambre',
	'Studio',
	'T1',
	'T1 bis',
	'T2',
	'T3 et plus',
	'Colocation'
];

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
	color?: string;
};

export type Appartment = {
	images: string[];
	id: string;
	rent: number;
	charges: number;
	deposit: number;
	surface: number;
	kind: AppartmentKind;
	roomsCount: number;
	availableAt: string;
	address: string;
	location: GeographicPoint | null;
	hasFurniture: boolean;
	hasParking: boolean;
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
