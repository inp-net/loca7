import { guards } from '$lib/server/lucia';
import { jsonAPIOutputsInclude } from '$lib/types';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { photoURL } from '$lib/photos';
import { env } from 'process';

export const GET: RequestHandler = async ({ params, locals }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	const appart = await prisma.appartment.findUnique({
		where: isNaN(Number(params.id)) ? { id: params.id } : { number: Number(params.id) },
		include: {
			owner: true
		}
	});

	guards.appartmentExists(appart);

	const appartment = await prisma.appartment.findUnique({
		where: { id: appart.id },
		include: jsonAPIOutputsInclude
	});

	guards.appartmentAccessible(user, appartment);

	return new Response(
		JSON.stringify({
			...appartment,
			photos: appartment.photos.map((p) => ({
				link: (env.ORIGIN || 'http://localhost:5173') + photoURL(p),
				...p
			}))
		}),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
