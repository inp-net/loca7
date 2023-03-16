import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { prisma } from '$lib/server/prisma';
import type { ReportReason } from '@prisma/client';
import xss from 'xss';

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const { user, session } = await locals.validateUser();
		if (!(user && session)) throw redirect(302, '/login');

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
