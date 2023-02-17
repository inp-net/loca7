export type AppartmentKind =
	| 'Chambre'
	| 'Studio'
	| 'T1'
	| 'T1 bis'
	| 'T2'
	| 'T3 et plus'
	| 'Colocation';

export const APPARTMENT_KINDS = [
	'Chambre',
	'Studio',
	'T1',
	'T1 bis',
	'T2',
	'T3 et plus',
	'Colocation'
];

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
	distanceToN7: number;
	hasFurniture: boolean;
	hasParking: boolean;
	description: string;
	owner: {
		id: string;
		name: string;
		phone: string;
		email: string;
	};
};
