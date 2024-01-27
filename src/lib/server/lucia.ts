import { dev } from '$app/environment';
import { prisma } from '$lib/server/prisma';
import { appartmentAccessible } from '$lib/types';
import { prisma as prismaAdapter } from '@lucia-auth/adapter-prisma';
import type { User } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import { lucia, type Session } from 'lucia';

export const auth = lucia({
	adapter: prismaAdapter(prisma),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes(userData) {
		return {
			id: userData.id,
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
			phone: userData.phone,
			emailIsValidated: userData.emailIsValidated,
			admin: userData.admin,
			god: userData.god,
			agencyName: userData.agencyName,
			agencyWebsite: userData.agencyWebsite
		} as User;
	}
});

export type Auth = typeof auth;

export const guards: {
	loggedIn: (
		user: User | undefined | null,
		session: Session | undefined | null,
		url: URL
	) => asserts user is User;
	emailValidated: (
		user: User | undefined | null,
		session: Session | undefined | null,
		url: URL
	) => asserts user is User & { emailIsValidated: true };
	isAdmin: (
		user: User | undefined | null,
		session: Session | undefined | null,
		url: URL
	) => asserts user is User & { emailIsValidated: true; admin: true };
	isGod: (
		user: User | undefined | null,
		session: Session | undefined | null,
		url: URL
	) => asserts user is User & { emailIsValidated: true; god: true };
	isGodOrAdmin: (
		user: User | undefined | null,
		session: Session | undefined | null,
		url: URL
	) => asserts user is User & { emailIsValidated: true } & ({ admin: true } | { god: true });
	isAdminElseRedirect: (
		user: User | undefined | null,
		session: Session | undefined | null,
		url: URL
	) => asserts user is User & { emailIsValidated: true; admin: true };
	appartmentAccessible: (
		user: User | undefined | null,
		appartment:
			| { approved: boolean; archived: boolean; owner: { id: string } }
			| undefined
			| null
	) => asserts appartment;
	appartmentExists: (
		appartment:
			| { approved: boolean; archived: boolean; owner: { id: string } }
			| undefined
			| null
	) => asserts appartment;
	appartmentOwnedByUser: (
		user: User,
		appartment: { approved: boolean; archived: boolean; owner: { id: string } }
	) => asserts appartment;
} = {
	/**
	 * Checks if the user is logged in, if not, redirects to /login
	 */
	loggedIn(user, session, url) {
		if (!(user && session)) redirect(302, '/login?go=' + url.pathname);
	},
	/**
	 * Checks if the user has validated their email, if not, redirects to /validate-email
	 * Implies a check to see if the user is logged in (see guards.loggedIn)
	 */
	emailValidated(user, session, url) {
		guards.loggedIn(user, session, url);
		if (!user.emailIsValidated) redirect(302, '/validate-email?go=' + url.pathname);
	},
	/**
	 * Checks if the user is an admin, if not, throws an error
	 * Implies a check to see if the user has validated their email (see guards.emailValidated)
	 * Implies a check to see if the user is logged in (see guards.loggedIn)
	 */
	isAdmin(user, session, url) {
		guards.emailValidated(user, session, url);
		if (!user.admin) error(401, { message: "Vous n'êtes pas administrateur" });
	},
	/**
	 * Acts like guards.isAdmin, but redirects to / instead of throwing an error
	 */
	isAdminElseRedirect(user, session, url) {
		guards.emailValidated(user, session, url);
		if (!user.admin) redirect(302, '/');
	},
	/**
	 * Checks if the appartement is accessible to the user, if not, throws an error
	 * WARNING: Does not imply a check to see if the user is logged in
	 */
	appartmentAccessible(user, appartment) {
		if (!appartment || !appartmentAccessible(user, appartment))
			error(404, {
				message: "Cette annonce n'existe pas, ou n'est pas (encore) publique"
			});
	},
	/**
	 * Checks if the appartement exists, if not, throws an error
	 * WARNING: Does not imply a check to see if the user is logged in
	 */
	appartmentExists(appartment) {
		if (appartment === null) error(404, { message: "Cette annonce n'existe pas" });
	},

	/**
	 * Checks if the appartement is owned by the current user
	 * WARNING: Does not imply a check to see if the user is logged in
	 */
	appartmentOwnedByUser(user, appartment) {
		if (appartment === null || appartment.owner.id !== user?.id)
			error(404, { message: "Cette annonce n'existe pas" });
	},

	isGod(user, session, url) {
		guards.emailValidated(user, session, url);
		if (!user.god) error(401, { message: "Vous n'êtes pas un dieu" });
	},

	isGodOrAdmin(user, session, url) {
		guards.emailValidated(user, session, url);
		if (!user.god && !user.admin)
			error(401, { message: "Vous n'êtes pas un dieu ou un administrateur" });
	}
};
