import nodemailer from 'nodemailer';
import mjml2html from 'mjml';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import path from 'path';
import { dev } from '$app/environment';

export const mailer = nodemailer.createTransport({
	host: process.env.MAIL_HOST,
	port: process.env.MAIL_PORT,
	secure: !dev,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS
	}
});

export function sendMail({
	template,
	to,
	subject,
	data
}: {
	template: string;
	to: string;
	subject: string;
	data: Record<string, string>;
}) {
	return mailer.sendMail({
		from: 'no-reply@loca7.enseeiht.fr',
		to,
		subject: subject + new Date().toISOString(),
		html: Handlebars.compile(
			mjml2html(readFileSync(path.join('mail-templates', template + '.mjml')).toString('utf-8'))
				.html
		)({ title: subject, ...data })
	});
}
