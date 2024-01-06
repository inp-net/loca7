import { writable, type Writable } from 'svelte/store';
import type { SearchCriteria } from './types';
import { persisted } from 'svelte-local-storage-store';
import type { Appartment, Like, Photo, User } from '@prisma/client';

export const searchResults: Writable<
	(Appartment & { owner: User; likes: Like[]; photos: Photo[] })[]
> = writable([]);
export const searchCriteria: Writable<SearchCriteria> = persisted('searchCriteria', {
	minimumSurface: null,
	bicycleParking: null,
	furniture: null,
	maximumRent: null,
	parking: null,
	fiberInternet: null,
	elevator: null,
	type: [],
	description: ''
});

export const SORT_OPTIONS = [
	'prix',
	'prix/m²',
	'surface',
	"distance à l'n7",
	'délai avant libération'
] as const;

export type SortOptions = (typeof SORT_OPTIONS)[number];

export const searchSortBy: Writable<SortOptions> = persisted('searchSortBy', SORT_OPTIONS[0]);

export const searchResultsScrollPosition: Writable<number> = persisted(
	'searchResultsScrollPosition',
	0
);

export const resultsTab: Writable<'list' | 'map'> = persisted('resultsTab', 'list');

export const dismissedN7ienOnlyWarning: Writable<boolean> = persisted(
	'dismissedN7ienOnlyWarning',
	false
);

export const darkMode: Writable<boolean | null> = persisted('darkMode', null);

export const oauthAccessToken: Writable<string> = persisted('oauthAccessToken', '');
export const oauthCSRFToken: Writable<string> = persisted('oauthState', '');
