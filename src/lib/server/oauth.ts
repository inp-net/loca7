import { log } from './logging';

export async function login(code: string): Promise<{
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	groups: string[];
	isRoot: boolean;
}> {
	const response = await fetch(`https://churros.inpt.fr/token`, {
		method: 'POST',
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: `${process.env.ORIGIN}/login/callback`
		}),
		headers: {
			Authorization: `Basic ${Buffer.from(
				`${process.env.CHURROS_CLIENT_ID}:${process.env.CHURROS_CLIENT_SECRET}`
			).toString('base64')}`
		}
	});
	const json = await response.json();

	await log.trace('login', null, `response ${response.status} from OAuth`, json);

	const { email, firstName, lastName, groups, uid, admin } = json as {
		email: string;
		firstName: string;
		lastName: string;
		groups: { group: { uid: string } }[];
		uid: string;
		admin: boolean;
	};

	return {
		username: uid,
		email,
		firstName,
		lastName,
		groups: groups.map(({ group }) => group.uid),
		isRoot: admin
	};
}
