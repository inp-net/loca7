import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';
import nodemailer from 'nodemailer';
import path from 'path';
import { valueOfBooleanString } from './utils';
import { log } from './logging';
import { CONTACT_EMAIL } from '$lib/constants';
import type { User } from '@prisma/client';
import { auth } from './lucia';
import { prisma } from '$lib/server/prisma';

// generate:EmailTemplates
/**
 * Valid email templates
 * @generated by running pnpm update-mail-templates
 */
export type EmailTemplateNameAndData =
	| { template: 'announcement'; data: { createAccountUrl: any } }
	| {
			template: 'appartment-edit-to-validate';
			data: {
				userFullName: any;
				userEmail: any;
				number: any;
				edits: any;
				label: any;
				diff: any;
				appartmentId: any;
				editId: any;
			};
	  }
	| {
			template: 'appartment-to-validate';
			data: { userFullName: any; userEmail: any; appartment: any; appartmentId: any };
	  }
	| { template: 'email-changed'; data: { newEmail: any } }
	| {
			template: 'liked-appartment-was-archived';
			data: { appartmentTitle: any; address: any; description: any };
	  }
	| {
			template: 'liked-appartment-was-deleted';
			data: { appartmentTitle: any; address: any; description: any };
	  }
	| {
			template: 'liked-appartment-was-edited';
			data: { number: any; appartmentTitle: any; edits: any; label: any; diff: any };
	  }
	| {
			template: 'liked-appartment-was-unarchived';
			data: { appartmentTitle: any; address: any; description: any; number: any };
	  }
	| { template: 'password-changed'; data: {} }
	| { template: 'plain'; data: { text: any } }
	| { template: 'reset-password'; data: { resetPasswordUrl: any } }
	| { template: 'validate-email'; data: { validateEmailUrl: any } }
	| { template: 'your-appartment-was-approved'; data: { number: any } }
	| { template: 'your-appartment-was-archived'; data: { number: any } }
	| {
			template: 'your-appartment-was-deleted';
			data: { number: any; appartmentTitle: any; address: any; description: any };
	  }
	| {
			template: 'your-appartment-was-reported';
			data: {
				number: any;
				reason: any;
				appartmentTitleInSentence: any;
				address: any;
				message: any;
				appartUrl: any;
			};
	  }
	| {
			template: 'your-appartment-was-unarchived';
			data: { number: any; appartmentTitle: any; address: any; description: any };
	  }
	| {
			template: 'your-edit-was-approved';
			data: { number: any; edits: any; label: any; diff: any; modificationId: any };
	  };

// end generate

export type EmailTemplates = EmailTemplateNameAndData['template'];

export const mailer = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: valueOfBooleanString(process.env.MAIL_NODEMAILER_SECURE),
	...(process.env.MAIL_USER || process.env.MAIL_PASSWORD
		? {
				auth: {
					user: process.env.MAIL_USER,
					pass: process.env.MAIL_PASS
				}
		  }
		: {})
});

export async function sendMail({
	template,
	to,
	subject,
	data
}: {
	to: (string | User)[] | string | User;
	subject: string;
} & EmailTemplateNameAndData) {
	if (Array.isArray(to) && to.length < 1) {
		await log.trace('send_mail', null, 'not sending mail since no addresses were given', {
			to,
			template,
			subject,
			data
		});
		return;
	}
	let recipients = Array.isArray(to) ? to : [to];
	await log.info('send_mail', null, { to, template, subject, data });
	const computedSubject = Handlebars.compile(subject)(data);
	const address = (recipient: (typeof recipients)[number]) =>
		typeof recipient === 'string' ? recipient : recipient.email;
	const layout = readFileSync('mail-templates/_layout.mjml').toString('utf-8');
	for (const recipient of recipients) {
		// If the recipient has no associated auth keys, don't send unless it's the announcement template
		const recipientUser =
			typeof recipient === 'string'
				? await prisma.user.findUnique({ where: { email: recipient } })
				: recipient;
		if (
			recipientUser &&
			(await auth.getAllUserKeys(recipientUser.id)).length === 0 &&
			template !== 'announcement'
		) {
			await log.warn(
				'send_mail',
				null,
				`not sending mail to ${recipientUser.id} because they have no auth keys`,
				{ to, template, subject, data }
			);
			return;
		}
		return mailer.sendMail({
			from: 'loca7@bde.enseeiht.fr',
			to: address(recipient),
			subject: computedSubject,
			html: mjml2html(
				Handlebars.compile(
					layout.replace(
						'%content%',
						readFileSync(path.join('mail-templates', template + '.mjml')).toString(
							'utf-8'
						)
					)
				)({
					recipient: {
						...recipientUser,
						fullname: recipientUser?.firstName + ' ' + recipientUser?.lastName
					},
					title: computedSubject,
					contactEmail: CONTACT_EMAIL,
					...data
				})
			).html
		});
	}
}
