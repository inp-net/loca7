import { PrismaClient, User } from '@prisma/client';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma as luciaPrismaAdapter } from '@lucia-auth/adapter-prisma';
import { lucia } from 'lucia';

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
