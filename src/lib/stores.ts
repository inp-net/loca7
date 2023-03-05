import { readable, type Readable, writable, type Writable } from 'svelte/store';
import type { Appartment, User } from './types';

export const user: Readable<User | null> = readable(null);
export const searchResults: Writable<Appartment[]> = writable([]);
