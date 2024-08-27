import { OAUTH_CLIENT_SECRET, OAUTH_TOKEN_URL, OAUTH_USERINFO_URL } from '$env/static/private';
import { PUBLIC_OAUTH_CLIENT_ID } from '$env/static/public';

export async function login(code: string, origin: string): Promise<string> {
	console.log({ creds: `${PUBLIC_OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}` });
	const encodedCredentials = Buffer.from(
		`${PUBLIC_OAUTH_CLIENT_ID}:${OAUTH_CLIENT_SECRET}`,
		'utf-8'
	).toString('base64');
	console.log({ encodedCredentials, code });
	// CSRF protection check occured in the frontend beforehand
	// this means that the URL where this function is called should absolutely not be added to the allowed redirect URIs
	const response = await fetch(OAUTH_TOKEN_URL, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${encodedCredentials}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			client_id: PUBLIC_OAUTH_CLIENT_ID,
			redirect_uri: new URL('/login/callback', origin).toString()
		}).toString()
	}).then((res) => res.text());

	console.log({ response });

	try {
		return JSON.parse(response).access_token;
	} catch (error) {
		console.error('Could not parse access token:', response);
		throw new Error('Could not parse access token');
	}
}

export async function identity(accessToken: string) {
	const response = await fetch(OAUTH_USERINFO_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	}).then((res) => res.text());

	try {
		const user = JSON.parse(response);
		return {
			username: user.uid as string,
			groups: user.groups as string[],
			isRoot: user.admin as boolean,
			email: user.email as string,
			firstName: user.firstName as string,
			lastName: user.lastName as string
		};
	} catch (error) {
		console.error('Could not parse user info:', response);
		throw new Error('Could not parse user info');
	}
}
