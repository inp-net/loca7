import { dev } from '$app/environment';
import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';
import nodemailer from 'nodemailer';
import path from 'path';

// generate:EmailTemplates
/**
 * @generated by running pnpm update-mail-templates
 * Valid email templates
 */
export type EmailTemplates =
	| 'announcement'
	| 'email-changed'
	| 'password-changed'
	| 'reset-password'
	| 'validate-email';

// end generate

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
	template: EmailTemplates;
	to: string;
	subject: string;
	data: Record<string, string>;
}) {
	const computedSubject = Handlebars.compile(subject)(data);
	const layout = readFileSync('mail-templates/_layout.mjml').toString('utf-8');
	return mailer.sendMail({
		from: 'no-reply@loca7.enseeiht.fr',
		to,
		subject: computedSubject + ' @ ' + new Date().toISOString(),
		html: mjml2html(
			Handlebars.compile(
				layout.replace(
					'%content%',
					readFileSync(path.join('mail-templates', template + '.mjml')).toString('utf-8')
				)
			)({ title: computedSubject, ...data })
		).html
	});
}
