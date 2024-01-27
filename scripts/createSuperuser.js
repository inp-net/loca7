import { text } from '@clack/prompts';
import { PrismaClient } from '@prisma/client';
import { intro, outro } from '@clack/prompts';

import { lucia } from 'lucia';
import { prisma as luciaPrismaAdapter } from '@lucia-auth/adapter-prisma';
intro('Creating a superuser');

const prisma = new PrismaClient();
const auth = lucia({
	adapter: luciaPrismaAdapter(prisma),
	env: 'DEV',
	transformUserData(userData) {
		return {
			id: userData.id,
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
			phone: userData.phone,
			emailIsValidated: userData.emailIsValidated,
			admin: userData.admin,
			god: userData.god,
			agencyName: userData.agencyName,
			agencyWebsite: userData.agencyWebsite
		};
	}
});

const email = await text({
	message: 'Email',
	validate(value) {
		if (!value.includes('@')) return 'Invalid email';
	}
});

const password = await text({
	message: 'Password'
});

auth.createUser({
	key: {
		providerId: 'email',
		providerUserId: email,
		password: password
	},
	attributes: {
		firstName: await text({ message: 'Prénom', initialValue: 'Admin' }),
		lastName: await text({ message: 'Nom de famille', initialValue: 'Istrateur' }),
		emailIsValidated: true,
		admin: true,
		god: true,
		agencyName: 'Loca7',
		agencyWebsite: 'https://loca7.fr',
		phone: '',
		email
	}
});

outro(`Created superuser ${email}`);
