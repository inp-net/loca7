import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const formatUser = (user) =>
	`${user.firstName}\t${user.lastName}\t${
		user.email.includes('ghost') ? '<ghost email>' : user.email
	}`;
const users = await prisma.user.findMany({ include: { appartments: true } });

for (const user of users) {
	if (user.appartments.length < 2) continue;

	console.log(`${formatUser(user)}\t${user.appartments.length}`);
}
