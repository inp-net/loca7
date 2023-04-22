import { PrismaClient } from '@prisma/client';
import nqdm from 'nqdm';

const prisma = new PrismaClient();

const appartments = await prisma.appartment.findMany();

for (const appartment of nqdm(appartments)) {
	await prisma.appartment.update({
		where: { id: appartment.id },
		data: {
			description: appartment.description.replace(/\u0001/g, '')
		}
	});
}
