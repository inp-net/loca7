import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';
import { compareDesc } from 'date-fns';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { session, user } = await locals.validateUser();
	guards.emailValidated(user, session, url);

	return {
		appartments: (
			await prisma.appartment.findMany({
				where: {
					likes: {
						some: {
							by: {
								id: user.id
							}
						}
					}
				},
				include: {
					likes: { include: { by: true } },
					owner: true,
					nearbyStations: true,
					travelTimeToN7: true,
					reports: true,
					photos: true
				}
			})
		).sort((a, b) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const usersLike = (appt: typeof a) => appt.likes.find((l) => l.by.id === user.id)!;
			return compareDesc(usersLike(a).createdAt, usersLike(b).createdAt) ? 1 : -1;
		})
	};
};
