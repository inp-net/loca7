import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users = await prisma.user.findMany({ include: { appartments: true } });

const usersByPhone = {};

for (const user of users) {
	if (!user.phone) continue;
	if (!usersByPhone[user.phone]) usersByPhone[user.phone] = [];
	usersByPhone[user.phone].push(user);
}

const earliestDate = (a) => {
	let earliest = a[0];
	for (const b of a) {
		if (b.valueOf() < earliest.valueOf()) earliest = b;
	}
	return earliest;
};

const duplicatePhones = Object.values(usersByPhone)
	.filter((users) => users.length > 1)
	.map((users) =>
		users.sort((a, b) => a.appartments[0]?.valueOf() - b.appartments[0]?.valueOf()).reverse()
	);

const formatUser = (user) =>
	`${user.firstName} ${user.lastName} <${
		user.email.includes('ghost') ? '' : user.email
	}> @ ${user.appartments[0]?.createdAt.getMonth()}/${user.appartments[0]?.createdAt.getFullYear()}`;

console.log(`Found ${duplicatePhones.length} duplicate phones.`);

for (const users of duplicatePhones) {
	console.log(`\n- ${users[0].phone}: ${users.length} (${users.map(formatUser).join(', ')})`);

	let userToKeep = users.find(
		(user) => !user.email.includes('ghost') && user.firstName && user.lastName
	);
	if (!userToKeep) {
		userToKeep = users.find((user) => !user.email.includes('ghost'));
	}
	if (!userToKeep) {
		userToKeep = users.find((user) => user.firstName || user.lastName);
	}
	if (!userToKeep) {
		userToKeep = users[0];
	}
	console.log(`\tKeeping ${formatUser(userToKeep)}`);

	const ownerModified = await prisma.user.update({
		where: {
			id: userToKeep.id
		},
		data: {
			createdAt: earliestDate(
				users.flatMap((user) => user.appartments.map((appartment) => appartment.createdAt))
			)
		},
		include: {
			appartments: true
		}
	});
	console.log(
		`\tChanged creation date of ${formatUser(ownerModified)} to ${ownerModified.createdAt}`
	);

	const modified = await prisma.appartment.updateMany({
		where: {
			owner: {
				id: {
					in: users.filter((user) => user.id !== userToKeep.id).map((user) => user.id)
				}
			}
		},
		data: {
			ownerId: userToKeep.id
		}
	});
	console.log(`\tChanged owner of ${modified.count} appartments.`);
	const deleted = await prisma.user.deleteMany({
		where: {
			id: {
				in: users.filter((user) => user.id !== userToKeep.id).map((user) => user.id)
			}
		}
	});
	console.log(`\tDeleted ${deleted.count} users.`);
}
