// Generated by ts-to-zod
import { z } from 'zod';
import { lowerFirstChar } from './utils';
import slugify from 'slugify';
import { v4 as uuid } from 'uuid';
import Handlebars from 'handlebars';

export type WithUndefinableProperties<T> = {
	[P in keyof T]: T[P] | undefined;
};

export type ReportReason = z.infer<typeof ReportReasonSchema>;
export const ReportReasonSchema = z.union([
	z.literal('dangerous'),
	z.literal('obsolete'),
	z.literal('other')
]);
export const DISPLAY_REPORT_REASON: Record<ReportReason, string> = {
	dangerous: 'Contenu dangereux',
	obsolete: 'Annonce obsolète',
	other: 'Autre'
};

export type AppartmentKind = z.infer<typeof AppartmentKindSchema>;
export const AppartmentKindSchema = z.union([
	z.literal('chambre'),
	z.literal('studio'),
	z.literal('t1'),
	z.literal('t1bis'),
	z.literal('t2'),
	z.literal('t3etplus'),
	z.literal('colocation'),
	z.literal('autre')
]);
export const DISPLAY_APPARTMENT_KIND: Record<AppartmentKind, string> = {
	chambre: 'Chambre',
	studio: 'Studio',
	t1: 'T1',
	t1bis: 'T1 bis',
	t2: 'T2',
	t3etplus: 'T3 et plus',
	colocation: 'Colocation',
	autre: 'Autre'
};

export type PublicTransportType = z.infer<typeof PublicTransportTypeSchema>;
export const PublicTransportTypeSchema = z.union([
	z.literal('bus'),
	z.literal('bhnf'),
	z.literal('metro'),
	z.literal('tram'),
	z.literal('telepherique'),
	z.literal('tad')
]);
export const DISPLAY_PUBLIC_TRANSPORT_TYPE: Record<PublicTransportType, string> = {
	bus: 'bus',
	bhnf: 'tram-bus',
	metro: 'métro',
	tram: 'tramway',
	telepherique: 'téléphérique',
	tad: 'TAD'
};

export const TADLineSchema = z.union([
	z.literal('105'),
	z.literal('106'),
	z.literal('118'),
	z.literal('119'),
	z.literal('120'),
	z.literal('201'),
	z.literal('202'),
	z.literal('204'),
	z.literal('205')
]);
export type TADLine = z.infer<typeof TADLineSchema>;

export const TramLineSchema = z.union([z.literal('T1'), z.literal('T2')]);
export type TramLine = z.infer<typeof TramLineSchema>;

export const MetroLineSchema = z.union([z.literal('A'), z.literal('B'), z.literal('C')]);
export type MetroLine = z.infer<typeof MetroLineSchema>;

export type PublicTransportStation = z.infer<typeof PublicTransportStationSchema>;
export const PublicTransportStationSchema = z.intersection(
	z.object({
		name: z.string(),
		color: z.string().startsWith('#').nullable(),
		latitude: z.number(),
		longitude: z.number(),
		type: PublicTransportTypeSchema
	}),
	z.discriminatedUnion('type', [
		z.object({
			type: z.literal('bus'),
			line: z.string()
		}),
		z.object({
			type: z.literal('telepherique'),
			line: z.string()
		}),
		z.object({
			type: z.literal('bhnf'),
			line: z.string()
		}),
		z.object({
			type: z.literal('tad'),
			line: TADLineSchema
		}),
		z.object({
			type: z.literal('tram'),
			line: TramLineSchema
		}),
		z.object({
			type: z.literal('metro'),
			line: MetroLineSchema
		})
	])
);

export type Photo = z.infer<typeof PhotoSchema>;
export const PhotoSchema = z.object({
	filename: z.string(),
	contentType: z.string(),
	position: z.number(),
	hash: z.string().nullable()
});

export type AppartmentEdit = z.infer<typeof AppartmentEditSchema>;
export const AppartmentEditSchema = z.object({
	rent: z.number(),
	charges: z.number(),
	deposit: z.number(),
	surface: z.number(),
	kind: AppartmentKindSchema,
	roomsCount: z.number(),
	availableAt: z.date(),
	address: z.string(),
	latitude: z.number().nullable(),
	longitude: z.number().nullable(),
	hasFurniture: z.boolean().nullable(),
	hasParking: z.boolean().nullable(),
	hasBicycleParking: z.boolean().nullable(),
	description: z.string(),
	applied: z.boolean(),
	createdAt: z.date(),
	appliedAt: z.date().nullable(),
	appartmentId: z.string().nullable(),
	photos: z.array(PhotoSchema)
});

/**
 * Returns the edit that was made just before the given edit, based on the appliedAt date. Only works for edits that have been applied.
 */
export function editBefore(history: AppartmentEdit[], edit: AppartmentEdit & { appliedAt: Date }) {
	return history.filter((e) => e.appliedAt !== null).find((e) => e.appliedAt! < edit.appliedAt);
}

export type Report = z.infer<typeof ReportSchema>;
export const ReportSchema = z.object({
	reason: ReportReasonSchema,
	message: z.string(),
	createdAt: z.date(),
	appartmentId: z.string(),
	authorId: z.string()
});

export type User = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	agencyName: z.string().nullable(),
	agencyWebsite: z.string().nullable(),
	phone: z.string(),
	email: z.string(),
	emailIsValidated: z.boolean(),
	admin: z.boolean(),
	god: z.boolean()
});

export type SearchCriteria = z.infer<typeof SearchCriteriaSchema>;
export const SearchCriteriaSchema = z.object({
	minimumSurface: z.number().nullable(),
	maximumRent: z.number().nullable(),
	type: z.array(AppartmentKindSchema),
	furniture: z.boolean().nullable(),
	parking: z.boolean().nullable(),
	bicycleParking: z.boolean().nullable(),
	fiberInternet: z.boolean().nullable(),
	elevator: z.boolean().nullable()
});

export type GeographicPoint = z.infer<typeof GeographicPointSchema>;
export const GeographicPointSchema = z
	.object({
		latitude: z.number(),
		longitude: z.number()
	})
	.passthrough();

export const AppartmentSchema = z.object({
	photos: z.array(PhotoSchema),
	rent: z.number().nonnegative({
		message: 'Le loyer doit être positif'
	}),
	charges: z
		.number()
		.nonnegative({
			message: 'Les charges doivent être positif'
		})
		.default(0),
	deposit: z
		.number()
		.nonnegative({
			message: 'Le dépôt de garantie doit être positif'
		})
		.default(0),
	surface: z.number().positive({
		message: 'La surface doit être positive et non nulle'
	}),
	kind: AppartmentKindSchema,
	roomsCount: z.number().nonnegative({
		message: 'Le nombre de chambres doit positif'
	}),
	availableAt: z.date(),
	address: z.string(),
	hasFurniture: z.boolean().nullable(),
	hasParking: z.boolean().nullable(),
	hasBicycleParking: z.boolean().nullable(),
	hasFiberInternet: z.boolean().nullable(),
	hasElevator: z.boolean().nullable(),
	description: z.string(),
	latitude: z.number().nullable(),
	longitude: z.number().nullable()
});
export type Appartment = z.infer<typeof AppartmentSchema>;

export const EMPTY_APPARTMENT: WithUndefinableProperties<Appartment> = {
	address: '',
	availableAt: undefined,
	charges: 0,
	deposit: 0,
	description: '',
	hasFurniture: null,
	hasParking: null,
	hasBicycleParking: null,
	hasFiberInternet: null,
	hasElevator: null,
	kind: undefined,
	photos: [],
	rent: undefined,
	roomsCount: 0,
	surface: undefined,
	latitude: null,
	longitude: null
};

export function appartmentAccessible(
	user: (User & { id: string }) | null,
	appartment: { approved: boolean; archived: boolean; owner: { id: string } }
) {
	if (appartment.approved && !appartment.archived) return true;

	if (user?.id === appartment.owner.id || user?.admin) return true;

	return false;
}

export function appartmentTitle(appartment: Appartment, insideSentence = false): string {
	const lowercaseDisplayAppartmentKind = Object.fromEntries(
		Object.entries(DISPLAY_APPARTMENT_KIND).map(([key, value]) => {
			switch (key) {
				case 't1':
				case 't1bis':
				case 't2':
				case 't3plus':
					return [key, value];

				default:
					return [key, lowerFirstChar(value)];
			}
		})
	);
	return `${
		appartment.kind == 'autre'
			? insideSentence
				? 'bien'
				: 'Bien'
			: (insideSentence ? lowercaseDisplayAppartmentKind : DISPLAY_APPARTMENT_KIND)[
					appartment.kind
			  ]
	} de ${appartment.surface}m² à ${appartment.rent + appartment.charges}€/mois`;
}

export const ternaryStateCheckboxToBoolean = (value: string) => {
	return (
		{
			indeterminate: null,
			on: true,
			off: false
		}[value] ?? null
	);
};

/**
 * Prevent some (potentially) sensitive fields from being exposed in the JSON "API".
 */
export const jsonAPIOutputsInclude = {
	owner: {
		select: {
			id: true,
			firstName: true,
			lastName: true,
			email: true,
			phone: true
		}
	},
	nearbyStations: true,
	travelTimeToN7: true,
	photos: {
		select: {
			id: true,
			contentType: true,
			position: true,
			filename: true,
			hash: true
		}
	}
};

export const EMAIL_REGEX = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export const GHOST_EMAIL_TEMPLATE = Handlebars.compile(
	'ghost.{{ firstName }}.{{ lastName }}.{{ id }}@loca7.fr'
);

export const GHOST_EMAIL_REGEX = new RegExp(
	GHOST_EMAIL_TEMPLATE({ firstName: '(.*)', lastName: '(.*)', id: '(.*)' })
);

export function createGhostEmail(
	firstName: string,
	lastName: string,
	id: string | undefined = undefined
): string {
	const slug = (s: string) => slugify(s, { lower: true, strict: true });
	return GHOST_EMAIL_TEMPLATE({
		firstName: slug(firstName),
		lastName: slug(lastName),
		id: (id ?? uuid()).replace(/-/g, '')
	});
}

export function isGhostEmail(email: string): boolean {
	return GHOST_EMAIL_REGEX.test(email);
}

export function ownerIsAgency(owner: User) {
	return Boolean(owner.agencyName || owner.agencyWebsite);
}
