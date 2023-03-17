import { writable, type Writable } from 'svelte/store';
import type { Appartment } from './types';

export const searchResults: Writable<Appartment[]> = writable([]);
