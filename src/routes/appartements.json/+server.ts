import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';
import { jsonAPIOutputsInclude } from '$lib/types';
import { env } from 'process';
import { photoURL } from '$lib/photos';

export const GET: RequestHandler = async ({ params, locals }) => {
	const appartments = await prisma.appartment.findMany({
		where: {
			archived: false,
			approved: true
		},
		include: jsonAPIOutputsInclude
	});

	return new Response(
		JSON.stringify(
			appartments.map((a) => ({
				link: `${env.ORIGIN || 'http://localhost:5173'}/appartements/${a.number}.json`,
				...a,
				photos: a.photos.map((p) => ({
					link: (env.ORIGIN || 'http://localhost:5173') + photoURL(p),
					...p
				}))
			}))
		),
		{
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
};
