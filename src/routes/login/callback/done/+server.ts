import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { log } from '$lib/server/logging';
import * as oauth from '$lib/server/oauth';
import { auth } from '$lib/server/lucia';
import { LuciaError, type User } from 'lucia-auth';

export const GET: RequestHandler = async ({ url, locals, cookies }) => {
	const authorizationCode = url.searchParams.get('code');
	let accessToken = url.searchParams.get('access_token');
	let oauthUserInfo: Awaited<ReturnType<typeof oauth.identity>>;
	let user: User | null = null;

	if (!accessToken) {
		if (!authorizationCode) {
			await log.trace(
				'login',
				null,
				'redirecting to login page /login code AND access_token missing'
			);
			throw redirect(303, '/login');
		}

		try {
			accessToken = await oauth.login(authorizationCode, url.toString());
		} catch (error) {
			console.error(error);
			await log.error(
				'login',
				null,
				'while logging in through OAuth:',
				JSON.stringify({ error })
			);
			throw redirect(303, '/login/callback?error=unauthorized');
		}

		if (!accessToken) {
			await log.error('login', null, 'OAuth login failed: no access token');
			throw redirect(303, '/login/callback?error=unauthorized');
		}

		throw redirect(303, `/login/callback?access_token=${accessToken}`);
	}

	oauthUserInfo = await oauth.identity(accessToken);
	try {
	} catch (error) {
		await log.error(
			'login',
			null,
			'while getting user info through OAuth:',
			JSON.stringify({ error, oauthUserInfo })
		);
		throw redirect(303, '/login/callback?error=unauthorized');
	}

	try {
		await log.trace(
			'login',
			oauthUserInfo.email,
			'OAuth login successful',
			JSON.stringify(oauthUserInfo)
		);
		const { email, username, firstName, lastName, groups, isRoot } = oauthUserInfo;

		try {
			const { user: casUser } = await auth
				.getKeyUser('cas', username)
				.catch(() => ({ user: null }));
			if (casUser) {
				await log.info('login', casUser, 'migrating CAS account to OAuth');
				await auth.deleteKey('cas', username);
				const hasOauthKey = Boolean(
					await auth.getKeyUser('oauth', username).catch(() => false)
				);
				if (!hasOauthKey)
					await auth.createKey(casUser.id, {
						providerId: 'oauth',
						providerUserId: username,
						password: null
					});
			}
			({ user } = await auth.getKeyUser('oauth', username));
		} catch (err) {
			if (err instanceof LuciaError && err.message)
				if (
					err instanceof LuciaError &&
					(err.message === 'AUTH_INVALID_USER_ID' ||
						err.message === 'AUTH_INVALID_KEY_ID')
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
				god: user.admin,
				admin: groups.includes('loca7')
			});
		}
	} catch (err) {
		throw redirect(303, '/login');
	}

	await log.info('login', user.email, 'success, through OAuth');
	try {
		locals.setSession(await auth.createSession(user.id));
	} catch (error) {
		await log.error('login', user.email, 'error while creating session thru OAuth', error);
	}
	cookies.set('authed_via', 'oauth', { path: '/' });
	throw redirect(303, '/');
};
