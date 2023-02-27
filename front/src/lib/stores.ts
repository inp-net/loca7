import { readable, type Readable } from 'svelte/store';
import type { User } from './types';

export const user: Readable<User | null> = readable(null);
