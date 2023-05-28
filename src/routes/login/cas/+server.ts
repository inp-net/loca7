import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { log } from '$lib/server/logging';
import { prisma } from '$lib/server/prisma';
import * as cas from '$lib/server/cas';
import { auth } from '$lib/server/lucia';
import { LuciaError, type User } from 'lucia-auth';

export const GET: RequestHandler = async ({ url, locals }) => {
	const ticket = url.searchParams.get('ticket');
	if (ticket === null || ticket === '') {
		const casLoginURL =
			process.env.PUBLIC_CAS_URL +
			'/login?service=' +
			encodeURIComponent((process.env.ORIGIN || 'http://localhost:5173') + '/login/cas');
		await log.trace(
			'login',
			'redirecting to CAS login page',
			casLoginURL,
			'ticket is null or empty'
		);
		throw redirect(303, casLoginURL);
	}

	try {
		const { email, username, firstName, lastName, groups } = await cas.login(
			(process.env.ORIGIN || 'http://localhost:5173') + '/login/cas',
			ticket
		);

		let user: User | null = null;
		try {
			({ user } = await auth.getKeyUser('cas', username));
		} catch (err) {
			if (
				err instanceof LuciaError &&
				(err.message === 'AUTH_INVALID_USER_ID' || err.message === 'AUTH_INVALID_KEY_ID')
			) {
				user = null;
			} else {
				await log.fatal('login', email, `unknown error ${err}`);
				throw error(500, 'Connexion impossible.');
			}
		}

		if (user === null) {
			await log.info(
				'login',
				`logging in through CAS, creating account as ${email} does not exist`
			);
			user = await auth.createUser({
				key: {
					providerId: 'cas',
					providerUserId: username,
					password: null
				},
				attributes: {
					firstName,
					lastName,
					email,
					emailIsValidated: true, // XXX not sure about this
					phone: '',
					god: groups.includes('root-n7') || groups.includes('root-inp'),
					admin: groups.includes('loca7-n7'),
					agencyName: '',
					agencyWebsite: ''
				}
			});
			await log.info('create_account', 'created account from CAS data', { user });
		} else {
			if ((await auth.getKey('cas', username)) === null) {
				await auth.createKey(user.id, {
					providerId: 'cas',
					providerUserId: username,
					password: null
				});
			}
			await auth.updateUserAttributes(user.id, {
				god: groups.includes('root-n7') || groups.includes('root-inp'),
				admin: groups.includes('loca7-n7')
			});
		}

		await log.info('login', email, 'success, through CAS');
		locals.setSession(await auth.createSession(user.id));
	} catch (err) {
		if (err?.code === 'INVALID_TICKET') {
			throw redirect(303, '/login/cas');
		}
		throw error(400, err.toString());
	}
	throw redirect(303, '/');
};
