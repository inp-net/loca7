import lucia from 'lucia-auth';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import { dev } from '$app/environment';
import { prisma } from '$lib/server/prisma';
import type { User } from '$lib/types';

export const auth = lucia({
	adapter: prismaAdapter(prisma),
	env: dev ? 'DEV' : 'PROD',
	transformUserData(userData) {
		return {
			id: userData.id,
			name: userData.name,
			email: userData.email,
			phone: userData.phone
		} as User;
	}
});

export type Auth = typeof auth;
