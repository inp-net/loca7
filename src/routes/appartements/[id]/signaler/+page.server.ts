import { guards } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import type { ReportReason } from '@prisma/client';
import { redirect } from '@sveltejs/kit';
import xss from 'xss';
import type { Actions } from './$types';
import { log } from '$lib/server/logging';
import { sendMail } from '$lib/server/mail';
import { DISPLAY_REPORT_REASON, appartmentTitle } from '$lib/types';
import { lowerFirstChar } from '$lib/utils';

export const actions: Actions = {
	default: async ({ locals, request, url }) => {
		const session = await locals.auth.validate();
		const user = session?.user;
		// TODO rate limit (prisma rate limits to 10 req per 10 seconds but we should handle it to show users a nice message)

		const { reason, message, appartmentId, contact } = Object.fromEntries(
			await request.formData()
		) as Record<string, string>;

		const report = await prisma.report.create({
			data: {
				message: xss(message),
				contact,
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
			},
			include: {
				appartment: {
					include: {
						owner: true,
						photos: true
					}
				}
			}
		});

		await log.info('report_appartment', user, { reason, message, appartmentId });

		await sendMail({
			to: report.appartment.owner,
			subject: `Votre annonce #${report.appartment.number} a été signalée`,
			template: 'your-appartment-was-reported',
			data: {
				number: report.appartment.number,
				reason: lowerFirstChar(DISPLAY_REPORT_REASON[report.reason]),
				address: report.appartment.address,
				appartmentTitleInSentence: appartmentTitle(report.appartment, true),
				message: xss(report.message),
				appartUrl:
					(process.env.ORIGIN || 'http://localhost:5173') +
					`/appartements/${report.appartment.id}`
			}
		});

		redirect(301, `/appartements/${appartmentId}#report-submitted`);
	}
};
