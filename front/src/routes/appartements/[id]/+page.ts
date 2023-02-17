import type { Appartment } from '$lib/types';
import type { PageLoad } from './$types';

export const load: PageLoad<{ appartement: Appartment }> = ({ params }) => {
	if (params.id === 'tr') {
		return {
			appartement: {
				id: 'tr',
				address: '2 Rue Charles Camichel',
				availableAt: new Date().toISOString(),
				rent: 0,
				charges: 0,
				distanceToN7: 0,
				deposit: 0,
				hasFurniture: true,
				hasParking: false,
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
				}
			}
		};
	} else if (params.id === 'uwun') {
		return {
			appartement: {
				id: 'uwun',
				address: '10 Rue de Verdun',
				availableAt: '2099-01-01',
				charges: 0,
				deposit: 0,
				description: 'Mon appart :)))',
				distanceToN7: 1.4,
				images: [],
				hasFurniture: true,
				kind: 'T1 bis',
				roomsCount: 1,
				hasParking: false,
				owner: {
					id: 'monique',
					email: 'reynes@cpasvrai.net',
					name: 'Monique Reynes',
					phone: null
				},
				rent: 590,
				surface: 30
			}
		};
	}

	return null;
};
