import { guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import xss from 'xss';
import type { PageServerLoad, Actions } from './$types';
import { log } from '$lib/server/logging';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	guards.isAdmin(user, session, url);

	return {};
};

export const actions: Actions = {
	async send({ locals, request, url }) {
		const session = await locals.auth.validate();
		const user = session?.user;
		guards.isAdmin(user, session, url);

		const {
			email: emailString,
			subject,
			body,
			bypassAuthKeyCheck
		} = Object.fromEntries(await request.formData()) as Record<string, string>;
		console.log(bypassAuthKeyCheck);
		const emails = emailString
			.split(',')
			.map((email) => email.trim())
			.filter((email) => email.length > 0);
		await log.info('send_mail', user, 'Sending mail manually', {
			emailString,
			subject,
			emails,
			body
		});

		await sendMail({
			to: emails,
			subject,
			bypassAuthKeyCheck: bypassAuthKeyCheck === 'on',
			template: 'plain',
			data: {
				text: xss(body)
			}
		});

		return { status: 200 };
	}
};
