import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { log } from '$lib/server/logging';
import * as oauth from '$lib/server/oauth';
import { auth } from '$lib/server/lucia';
import { LuciaError, type User } from 'lucia-auth';

export const GET: RequestHandler = async ({ url, locals }) => {
	const authorizationCode = url.searchParams.get('code');
	if (!authorizationCode) {
		await log.trace('login', 'redirecting to login page', '/login', 'code is null or empty');
		throw redirect(303, '/login');
	}

	// TODO validate state
	// const stateFromServer = url.searchParams.get('state');

	try {
		const { email, username, firstName, lastName, groups, isRoot } = await oauth.login(
			authorizationCode
		);

		let user: User | null = null;
		try {
			({ user } = await auth.getKeyUser('oauth', username));
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
				`logging in through OAuth, creating account as ${email} does not exist`
			);
			user = await auth.createUser({
				key: {
					providerId: 'oauth',
					providerUserId: username,
					password: null
				},
				attributes: {
					firstName,
					lastName,
					email,
					emailIsValidated: true, // XXX not sure about this
					phone: '',
					god: isRoot,
					admin: groups.includes('loca7'),
					agencyName: '',
					agencyWebsite: ''
				}
			});
			await log.info('create_account', 'created account from OAuth data', { user });
		} else {
			if ((await auth.getKey('oauth', username)) === null) {
				await auth.createKey(user.id, {
					providerId: 'oauth',
					providerUserId: username,
					password: null
				});
			}
			await auth.updateUserAttributes(user.id, {
				god: groups.includes('root-n7') || groups.includes('root-inp'),
				admin: groups.includes('loca7-n7')
			});
		}

		await log.info('login', email, 'success, through OAuth');
		locals.setSession(await auth.createSession(user.id));
	} catch (err) {
		throw redirect(303, '/login');
	}
	throw redirect(303, '/');
};
