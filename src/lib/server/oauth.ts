import { ChurrosClient } from '@inp-net/churros-client';

export const churros = new ChurrosClient({
	client_id: process.env.PUBLIC_OAUTH_CLIENT_ID,
	client_secret: process.env.OAUTH_CLIENT_SECRET,
	redirect_uri: 'http://localhost:5173/login/callback'
});

export async function login(code: string): Promise<string> {
	// CSRF protection check occured in the frontend beforehand
	// this means that the URL where this function is called should absolutely not be added to the allowed redirect URIs
	churros.state = '';
	const token = await churros.getToken(code, '');
	return token;
}

export async function identity(accessToken: string) {
	const user = await churros.getUserInfo(accessToken);

	return {
		username: user.uid,
		groups: user.groupsUids,
		// @ts-expect-error @inp-net/churros-client forgot to include this in UserInfo type lmao
		isRoot: user.admin,
		...user
	};
}
