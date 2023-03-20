import { PrismaClient } from '@prisma/client';
import { convert as html2text } from 'html-to-text';
import { distanceBetween, ENSEEIHT } from '../src/lib/utils';
import { DISPLAY_PUBLIC_TRANSPORT_TYPE } from '../src/lib/types';
// import { openRouteService } from '../src/lib/server/traveltime';
import xss from 'xss';
import type { User, TravelTimeToN7, Report, AppartmentKind } from '@prisma/client';
import tisseoStops from '../public/tisseo-stops.json' assert { type: 'json' };
import md5 from 'md5';
import lucia from 'lucia-auth';
import luciaPrismaAdapter from '@lucia-auth/adapter-prisma';
import createPassword from 'password';
import oldLogements from './old-data/logements.json' assert { type: 'json' };
import oldPhotos from './old-data/photos.json' assert { type: 'json' };
import bbcode2html from 'bitter-bbcode';
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import mime2ext from 'mime2ext';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import nqdm from "nqdm"

const __dirname = dirname(fileURLToPath(import.meta.url));

const prisma = new PrismaClient();
const auth = lucia({
	adapter: luciaPrismaAdapter(prisma),
	env: 'DEV',
	transformUserData(userData) {
		return {
			id: userData.id,
			name: userData.name,
			email: userData.email,
			phone: userData.phone,
			emailIsValidated: userData.emailIsValidated,
			admin: userData.admin
		} as User;
	}
});

async function nearbyStations(location: GeographicPoint): Promise<PublicTransportStation[]> {
	const allStops = tisseoStops as {
		stop_id: `stop_point:SP_${number}`;
		stop_code: `${number}`;
		stop_name: string;
		stop_lat: number;
		stop_lon: number;
		route_type:
			| 'tram'
			| 'metro'
			| 'train'
			| 'bus'
			| 'ferry'
			| 'cable_car'
			| 'gondola'
			| 'funicular'
			| 'trolleybus'
			| 'monorail';
		parent_station: `stop_area:SA_${number}`;
		wheelchair_boarding: boolean | null;
		route_id: string;
		agency_id: string;
		route_short_name: string;
		route_long_name: string;
		route_color: string;
		route_text_color: string;
		location_type: 'stop' | 'station' | 'entrance' | 'generic' | 'boarding_area';
	}[];

	return allStops
		.map((stop) => ({
			...stop,
			position: { latitude: stop.stop_lat, longitude: stop.stop_lon }
		}))
		.filter((stop) => Object.keys(DISPLAY_PUBLIC_TRANSPORT_TYPE).includes(stop.route_type))
		.filter((stop) => Math.abs(distanceBetween(location, stop.position)) < 500)
		.sort(
			(a, b) => distanceBetween(location, a.position) - distanceBetween(location, b.position)
		)
		.filter(
			(stop, i, self) =>
				self.findIndex(
					(s) =>
						s.route_short_name === stop.route_short_name &&
						s.route_type === stop.route_type
				) === i
		)
		.map((stop) => ({
			color: '#' + stop.route_color,
			line: stop.route_short_name,
			name: stop.stop_name,
			type:
				stop.route_type === 'bus' && /L\d{1,3}/.test(stop.route_short_name)
					? 'bhnf'
					: (stop.route_type as PublicTransportType),
			latitude: stop.stop_lon,
			longitude: stop.stop_lat
		}));
}

type datetimestr = string;
type bbcodestr = string;
type intstr = string;
type floatstr = string;
type boolstr = '0' | '1';

type AppartmentOld = {
	date_maj: datetimestr;
	typel: 'ch' | 'st' | 'co' | 't1' | 't1b' | 't2' | 't3p' | 'au';
	surface: intstr | null;
	loyer: intstr;
	montant_charges: intstr | null;
	montant_caution: intstr | null;
	place_parking: boolstr | null;
	free_date: datetimestr;
	meuble: boolstr | null;
	adresse: string;
	latitude: floatstr | null;
	longitude: floatstr | null;
	description: bbcodestr;
	contact_nom: string;
	contact_prenom: string;
	contact_mail: string;
	contact_tel: string;
	contact_port: string;
	pub_date: datetimestr;
	statut: '0' | '1' | '2' | '3';
	nb_obsolete: intstr;
	uuid_proprietaire: string;
	id: string;
};

type PhotoOld = {
	id: string;
	logement_id: string;
	photo: string;
};

const KIND_MAP: Record<AppartmentOld['typel'], AppartmentKind> = {
	ch: 'chambre',
	st: 'studio',
	co: 'colocation',
	t1: 't1',
	t1b: 't1bis',
	t2: 't2',
	t3p: 't3etplus',
	au: 'autre'
};

function optionalNumberStr(str: intstr | floatstr | null): number | null {
	if (str === null) return null;
	return Number(str);
}

function optionalBooleanStr(str: boolstr | null): boolean | null {
	if (str === null) return null;
	return str === '1';
}

function status(status: AppartmentOld['statut']): { archived: boolean; approved: boolean } {
	switch (status) {
		case '0':
			// Published
			return { archived: false, approved: true };

		case '1':
			// Archived
			return { archived: true, approved: true };

		case '2':
			// Pending
			return { archived: false, approved: false };

		case '3':
			// Deleted (same as archived)
			return { archived: true, approved: true };

		default:
			throw new Error('Unknown status: ' + status);
	}
}

function findRoomsCountInDescription(description: string): number {
	// Convert bbcode to plaintext
	description = html2text(bbcode2html(description))
		// Replace number words
		.replaceAll(/\bdeux\b/gi, '2')
		.replaceAll(/\btrois\b/gi, '3')
		.replaceAll(/\bquatre\b/gi, '4')
		.replaceAll(/\bcinq\b/gi, '5')
		.replaceAll(/\bsix\b/gi, '6')
		.replaceAll(/\bsept\b/gi, '7')
		.replaceAll(/\bhuit\b/gi, '8')
		.replaceAll(/\bneuf\b/gi, '9')
		.replaceAll(/\bdix\b/gi, '10')
		.replaceAll(/\bun\b/gi, '1')
		.replaceAll(/\bune\b/gi, '1')
		// Fix up some typos
		.replaceAll(/\bùeubl/gi, 'meubl');

	// extract number
	const result = /\b(\d+)\s+chambre/gi.exec(description);
	if (!result) return 0;
	return Number(result[1]);
}

async function travelTimes(appart: AppartmentOld): Promise<Omit<TravelTimeToN7, 'id'>> {
	let traveltimes: Omit<TravelTimeToN7, 'id'> = {
		byBike: null,
		byFoot: null,
		byPublicTransport: null
	};

	return traveltimes;

	// TODO
	// let latitude = optionalNumberStr(appart.latitude);
	// let longitude = optionalNumberStr(appart.longitude);

	// if (latitude && longitude) {
	//     traveltimes.byBike = await openRouteService.travelTime("bike", )
	// }
}

async function appartment(ghost: User, appart: AppartmentOld, photos: PhotoOld[], user: User) {
	const latitude = optionalNumberStr(appart.latitude);
	const longitude = optionalNumberStr(appart.longitude);
	// console.info(`\tCreating appartment ${appart.adresse} (#${appart.id})`);
	const appartment = await prisma.appartment.create({
		data: {
			address: appart.adresse,
			availableAt: new Date(appart.free_date),
			charges: optionalNumberStr(appart.montant_charges) || 0,
			deposit: optionalNumberStr(appart.montant_caution) || 0,
			description: xss(bbcode2html(appart.description)),
			kind: KIND_MAP[appart.typel] ?? 'autre',
			// FIXME tkt
			latitude: longitude,
			longitude: latitude,
			rent: Number(appart.loyer),
			surface: optionalNumberStr(appart.surface) || 0,
			roomsCount: findRoomsCountInDescription(appart.description),
			...status(appart.statut),
			updatedAt: new Date(appart.date_maj),
			createdAt: new Date(appart.pub_date),
			hasFurniture: optionalBooleanStr(appart.meuble),
			hasParking: optionalBooleanStr(appart.place_parking),
			owner: {
				connect: {
					id: user.id
				}
			},
			travelTimeToN7: {
				create: travelTimes(appart)
			},
			nearbyStations: {
				createMany: {
					data: latitude && longitude ? await nearbyStations({ longitude, latitude }) : []
				}
			},
			photos: {
				createMany: {
					data: photos
						.filter((photo) => photo.logement_id == appart.id)
						.map(
							(photo, i) =>
								({
									contentType: 'image/jpeg',
									filename: path.basename(photo.photo),
									position: i,
									hash: null /* TODO */
								} as Photo)
						)
				}
			},
			reports: {
				createMany: {
					data: Array.from({ length: Number(appart.nb_obsolete) }).map(
						() =>
							({
								authorId: ghost.id,
								reason: 'obsolete',
								createdAt: new Date(appart.date_maj),
								message: "L'annonce est obsolète (importé depuis l'ancien site)"
							} as Report)
					)
				}
			}
		},
		include: {
			nearbyStations: true,
			photos: true,
			reports: true,
			travelTimeToN7: true
		}
	});

	for (const photoInDb of appartment.photos) {
		const photo = photos.find((p) => path.basename(p.photo) === photoInDb.filename);
		const photoOnDiskFilename = path.join(__dirname, 'old-data', photo?.photo);

		if (photo === undefined || !photo || !existsSync(photoOnDiskFilename)) {
			// console.log(
			// 	`\t\t⚠️  Photo at ${photoOnDiskFilename} {${JSON.stringify(
			// 		photoInDb
			// 	)}} was not imported correctly`
			// );
		} else {
			const targetFilename = path.join(
				__dirname,
				'../public/photos/appartments',
				photoInDb.id + '.jpeg'
			);

			mkdirSync(path.dirname(targetFilename), { recursive: true });
			copyFileSync(photoOnDiskFilename, targetFilename);
		}
	}
}

async function importData(ghost: User, appartments: AppartmentOld[], photos: PhotoOld[]) {
	const userPasswords: Record<string, null> = {};
	const appartmentsByOwner = appartments.reduce((acc, appart) => {
		const key = appart.contact_mail || appart.uuid_proprietaire;
		if (!acc[key]) acc[key] = [];
		acc[key].push(appart);
		return acc;
	}, {} as Record<string, AppartmentOld[]>);

	// create users
	for (const apparts of nqdm(Object.values(appartmentsByOwner))) {
		// console.info(
		// 	`Creating user ${apparts[0].contact_prenom} ${apparts[0].contact_nom} (#${apparts[0].uuid_proprietaire})`
		// );
		const appart = apparts[0];
		const attributes = {
			email: appart.contact_mail || `ghost.${appart.uuid_proprietaire}@loca7.enseeiht.fr`,
			name: appart.contact_prenom + ' ' + appart.contact_nom,
			phone: appart.contact_port || appart.contact_tel
		};
		const password = createPassword(3);
		if (!appart.contact_mail) {
			// console.log('\t⚠️  No email, creating ghost user');
		}
		await auth.createUser({
			key: {
				providerId: 'email',
				password,
				providerUserId: attributes.email
			},
			attributes
		});
		const user = await prisma.user.findUnique({
			where: {
				email: attributes.email
			}
		});
		if (user === null) throw new Error('User not found');
		userPasswords[user.id] = password;
		await appartment(ghost, appart, photos, user);
	}
	return userPasswords;
}

async function nukeDb() {
	const tablenames = await prisma.$queryRaw<
		Array<{ tablename: string }>
	>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

	const tables = tablenames
		.map(({ tablename }) => tablename)
		.filter((name) => name !== '_prisma_migrations')
		.map((name) => `"public"."${name}"`)
		.join(', ');

	try {
		await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
	} catch (error) {
		console.log({ error });
	}

	rmSync(path.join(__dirname, '../public/photos/appartments'), { recursive: true });
	mkdirSync(path.join(__dirname, '../public/photos/appartments'));
}

async function main() {
	// Delete all data
	await nukeDb();

	// Create ghost user
	const ghost = await prisma.user.create({
		data: {
			name: 'Ghost',
			email: 'ghost@loca7.enseeiht.fr',
			phone: ''
		}
	});

	// Create admin user
	const admin = await auth.createUser({
		key: {
			providerId: 'email',
			password: 'refrain-candied-exert-phony-storewide',
			providerUserId: 'hey2@ewen.works'
		},
		attributes: {
			email: 'hey2@ewen.works',
			admin: true,
			emailIsValidated: true,
			name: 'Admin',
			phone: ''
		}
	});

	// Get old data
	const appartments = oldLogements.find((e) => e.type === 'table')?.data;
	const photos = oldPhotos.find((e) => e.type === 'table')?.data;

	// Create users
	const passwords = await importData(ghost, appartments, photos);
	console.log('Created users with passwords:');
	console.log(passwords);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
