import type { PrismaClient } from '@prisma/client';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: import('lucia').AuthRequest;
		}
		// interface PageData {}
		// interface Platform {}
	}
	let prisma: PrismaClient;

	/// <reference types="lucia-auth" />
	declare namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = Omit<import('$lib/types').User, 'id'>;
		// eslint-disable-next-line @typescript-eslint/ban-types
		type DatabaseSessionAttributes = {};
	}
}

export {};
