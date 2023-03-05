import {
	randomAppartment,
	GeographicalPoint,
	type Appartment,
	type PublicTransportStation
} from '$lib/types';
import { ENSEEIHT } from '$lib/utils';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad<{ appartment: Appartment }> = ({ params }) => {
	if (params.id === 'tr') {
		return {
			appartment: {
				id: 'tr',
				address: '2 Rue Charles Camichel, 31000 Toulouse',
				availableAt: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
				rent: 0,
				charges: 0,
				location: ENSEEIHT,
				deposit: 0,
				hasFurniture: false,
				hasParking: true,
				images: [],
				kind: 'Colocation',
				roomsCount: 11 + 3,
				surface: 666,
				description:
					'Beaucoup de magnifiques locaux utiles pour dormir (illégal), manger (illégal), surtout en période de H24. Attention aux nettoyeurs qui passnent vers 3h du matin, ils ont peur de la télé.',
				owner: {
					id: 'ewen',
					name: 'Ewen Le Bihan',
					email: 'contact@tvn7.fr',
					phone: '06 66 66 66 66'
				},
				travelTimeToN7: {
					byFoot: 0 * 60,
					byBike: 0 * 60,
					byPublicTransport: 0 * 60
				},
				nearbyStations: [
					{ type: 'metro', line: 'B', name: 'François Merdier' },
					{ type: 'bhnf', line: 'L1', name: 'Place Dupuy' },
					{ type: 'bhnf', line: 'L8', name: 'Place Dupuy' },
					{ type: 'bhnf', line: 'L9', name: 'Place Dupuy' },
					{ type: 'bus', line: '29', name: 'Place Dupuy' },
					{ type: 'bus', line: '27', name: 'Guilhemery' }
				] as PublicTransportStation[],
				velotoulouse: true
			}
		};
	} else if (params.id === 'uwun') {
		return {
			appartment: {
				id: 'uwun',
				address: '10 Rue de Verdun, 31000 Toulouse',
				availableAt: '2099-01-01',
				charges: 0,
				deposit: 0,
				description: 'Mon appart :)))',
				distanceToN7: 1.4,
				images: ['https://media.ewen.works/studio.jpeg', 'https://media.ewen.works/velo.jpeg'],
				hasFurniture: true,
				kind: 'T1 bis',
				roomsCount: 1,
				hasParking: false,
				owner: {
					id: 'monique',
					email: 'reynes@cpasvrai.net',
					name: 'Monique Reynes',
					phone: ''
				},
				rent: 590,
				surface: 30,
				travelTimeToN7: {
					byFoot: 20 * 60,
					byBike: 10 * 60,
					byPublicTransport: 15 * 60
				},
				nearbyStations: [
					{ type: 'metro', line: 'B', name: "Jeanne d'Arc" },
					{ type: 'bhnf', line: 'L1', name: 'Concorde' },
					...[14, 29, 45, 70].map((no) => ({ type: 'bus', line: `${no}`, name: 'Concorde' })),
					{ type: 'bus', line: 'Cimetières', name: "Jeanne d'Arc" }
				] as PublicTransportStation[],
				velotoulouse: false,
				location: GeographicalPoint({
					latitude: 1.443092,
					longitude: 43.611764
				})
			}
		};
	}

	return {
		appartment: randomAppartment()
	};
};
