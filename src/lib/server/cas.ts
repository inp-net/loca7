import { error } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { parseStringPromise as xml2js } from 'xml2js';
import { prisma } from '$lib/server/prisma';
import type { Session, User } from 'lucia-auth';
import { log } from './logging';

/**
 * Deeply removes "cas:" from the given object's keys.
 * @param o the object to remove the prefix from
 * @returns a new object, without the prefixes
 */
function removeCasPrefixFromObjectKeys(o: Record<string, any>): Record<string, any> {
	return Object.fromEntries(
		Object.entries(o).map(([k, v]) => [
			k.replace(/^cas:/, ''),
			v === null || typeof v !== 'object' || Object.getPrototypeOf(v) !== Object.prototype
				? v
				: removeCasPrefixFromObjectKeys(v)
		])
	);
}

export async function login(
	service: string,
	ticket: string
): Promise<{
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	groups: string[];
}> {
	const response = await fetch(
		`${
			process.env.PUBLIC_CAS_URL
		}/serviceValidate?ticket=${ticket}&service=${encodeURIComponent(service)}`
	);
	const json = await xml2js(await response.text(), { explicitArray: false });

	if (json['cas:serviceResponse']['cas:authenticationFailure'] !== undefined) {
		await log.error(
			'login',
			null,
			`response ${response.status} from CAS (converted to JSON)`,
			json
		);
		const { _: message, $: code } = json['cas:serviceResponse']['cas:authenticationFailure'];
		let error = new Error(message as string);
		error.code = code;
		throw error;
	}

	await log.trace(
		'login',
		null,
		`response ${response.status} from CAS (converted to JSON)`,
		json
	);

	const {
		email,
		first_name: firstName,
		last_name: lastName,
		groups: groupsJSONString
	} = removeCasPrefixFromObjectKeys(
		json['cas:serviceResponse']['cas:authenticationSuccess']['cas:attributes']
	);
	const username = json['cas:serviceResponse']['cas:authenticationSuccess']['cas:user'];
	const groups = JSON.parse(groupsJSONString.replace(/'/g, '"'));

	return { username, email, firstName, lastName, groups };
}
