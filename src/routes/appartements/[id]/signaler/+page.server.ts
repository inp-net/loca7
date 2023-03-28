import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { ReportReason } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import xss from 'xss';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ locals, request, url }) => {
		const { user, session } = await locals.validateUser();
		guards.emailValidated(user, session, url);

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
				author: {
					connect: {
						id: user.id
					}
				}
			}
		});

		throw redirect(301, '/');
	}
};
