import type { User } from '@prisma/client';
import { prisma } from './prisma';
import { sendMail } from './mail';
export type LogAction =
	| 'send_mail'
	| 'submit_appartment'
	| 'submit_appartment_edit'
	| 'approve_appartment_edit'
	| 'report_appartment'
	| 'create_account'
	| 'login'
	| 'logout'
	| 'delete_account'
	| 'request_password_reset'
	| 'use_password_reset'
	| 'request_email_validation'
	| 'use_email_validation'
	| 'approve_appartent'
	| 'change_email'
	| 'change_password'
	| 'archive_appartment'
	| 'unarchive_appartment'
	| 'delete_appartment'
	| 'edit_account'
	| 'delete_appartment_edit'
	| 'delete_appartment_report'
	| 'generate_travel_times'
	| 'misc';
export const LOG_LEVELS = ['trace', 'info', 'warn', 'error', 'fatal'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

function serialize(o: any): string {
	if (typeof o === 'string') {
		return o;
	}
	if (o instanceof Error) {
		return o.message + (o.stack ? '\n' + o.stack : '(no stack trace available)');
	}
	try {
		return JSON.stringify(o);
	} catch (error) {
		return o.toString();
	}
}

async function _log(
	level: LogLevel,
	action: LogAction,
	by: User | string | null,
	...message: any[]
) {
	let messageString = message.map(serialize).join(' ');
	const consoleArgs = [
		level,
		typeof by === 'string' ? by : by?.email || 'unknown_user',
		action,
		messageString
	];
	if (level === 'error' || 'fatal') {
		console.error(...consoleArgs);
	} else if (level === 'warn') {
		console.warn(...consoleArgs);
	} else {
		console.info(...consoleArgs);
	}
	let user = null;
	if (by) {
		user = await prisma.user.findFirst({
			where:
				typeof by === 'string' ? { [by.includes('@') ? 'email' : 'id']: by } : { id: by.id }
		});
	}
	const createdLog = await prisma.log.create({
		data: {
			level: LOG_LEVELS.indexOf(level),
			action,
			message: messageString,
			ip: '', // TODO
			userId: user?.id ?? null
		}
	});
	if (level === 'fatal') {
		const gods = await prisma.user.findMany({
			where: {
				god: true
			}
		});
		await Promise.all(
			gods.map((god) =>
				sendMail({
					to: god.email,
					subject: `Loca7: Fatal error when ${action}`,
					template: 'plain',
					data: {
						text: `At ${new Date().toISOString()}<br><strong>${
							user?.email ?? 'unknown user'
						}</strong> triggered a fatal error when <strong>${action}</strong>:<br><br>${messageString.replaceAll(
							'\n',
							'<br>'
						)}<br><br><br><br>For some context: <a href="${
							process.env.ORIGIN || 'http://localhost:5173'
						}/logs#${createdLog.createdAt.toISOString()}" target="_blank">see logs</a>.`
					}
				})
			)
		);
	}
}

type LogFunction = (
	action: LogAction,
	by: User | string | null,
	...message: any[]
) => Promise<void>;

export const log = Object.fromEntries(
	LOG_LEVELS.map((level) => [
		level.toLowerCase(),
		((action, by, ...message) => _log(level, action, by, ...message)) as LogFunction
	])
) as {
	[level in LogLevel]: LogFunction;
};
