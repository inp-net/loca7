import { writable, type Writable } from 'svelte/store';
import type { Appartment, SearchCriteria } from './types';
import { persisted } from 'svelte-local-storage-store';

export const searchResults: Writable<Appartment[]> = writable([]);
export const searchCriteria: Writable<SearchCriteria> = persisted('searchCriteria', {
	minimumSurface: undefined,
	bicycleParking: null,
	furniture: null,
	maximumRent: undefined,
	parking: null,
	type: []
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
