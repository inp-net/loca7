import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { ReportReason } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import xss from 'xss';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, request, url }) => {
		const { user, session } = await locals.validateUser();
		// TODO rate limit (prisma rate limits to 10 req per 10 seconds but we should handle it to show users a nice message)

		const { reason, message, appartmentId } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		await prisma.report.create({
			data: {
				message: xss(message),
				reason: reason as ReportReason,
				appartment: {
					connect: {
						id: appartmentId
					}
				},
				author: user
					? {
							connect: {
								id: user.id
							}
					  }
					: undefined
			}
		});

		throw redirect(301, `/appartements/${appartmentId}#reportSubmitted`);
	}
};
