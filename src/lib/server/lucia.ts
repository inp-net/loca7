import { dev } from '$app/environment';
import { prisma } from '$lib/server/prisma';
import { appartmentAccessible } from '$lib/types';
import prismaAdapter from '@lucia-auth/adapter-prisma';
import type { User } from '@prisma/client';
import { error, redirect } from '@sveltejs/kit';
import lucia, { type Session } from 'lucia-auth';

export const auth = lucia({
	adapter: prismaAdapter(prisma),
	env: dev ? 'DEV' : 'PROD',
	transformUserData(userData) {
		return {
			id: userData.id,
			name: userData.name,
			email: userData.email,
			phone: userData.phone,
			emailIsValidated: userData.emailIsValidated,
			admin: userData.admin,
			god: userData.god
		} as User;
	}
});

export type Auth = typeof auth;

export const guards: {
	loggedIn: (user: User | null, session: Session | null) => asserts user is User;
	emailValidated: (
		user: User | null,
		session: Session | null
	) => asserts user is User & { emailIsValidated: true };
	isAdmin: (
		user: User | null,
		session: Session | null
	) => asserts user is User & { emailIsValidated: true; admin: true };
	isAdminElseRedirect: (
		user: User | null,
		session: Session | null
	) => asserts user is User & { emailIsValidated: true; admin: true };
	appartmentAccessible: (
		user: User | null,
		appartment: { approved: boolean; archived: boolean; owner: { id: string } } | null
	) => asserts appartment;
	appartmentExists: (
		appartment: { approved: boolean; archived: boolean; owner: { id: string } } | null
	) => asserts appartment;
} = {
	/**
	 * Checks if the user is logged in, if not, redirects to /login
	 */
	loggedIn: (user, session) => {
		if (!(user && session)) throw redirect(302, '/login');
	},
	/**
	 * Checks if the user has validated their email, if not, redirects to /validate-email
	 * Implies a check to see if the user is logged in (see guards.loggedIn)
	 */
	emailValidated: (user, session) => {
		guards.loggedIn(user, session);
		if (!user.emailIsValidated) throw redirect(302, '/validate-email');
	},
	/**
	 * Checks if the user is an admin, if not, throws an error
	 * Implies a check to see if the user has validated their email (see guards.emailValidated)
	 * Implies a check to see if the user is logged in (see guards.loggedIn)
	 */
	isAdmin: (user, session) => {
		guards.emailValidated(user, session);
		if (!user.admin) throw error(401, { message: "Vous n'êtes pas administrateur" });
	},
	/**
	 * Acts like guards.isAdmin, but redirects to / instead of throwing an error
	 */
	isAdminElseRedirect: (user, session) => {
		guards.emailValidated(user, session);
		if (!user.admin) throw redirect(302, '/');
	},
	/**
	 * Checks if the appartement is accessible to the user, if not, throws an error
	 * WARNING: Does not imply a check to see if the user is logged in
	 */
	appartmentAccessible: (user, appartment) => {
		if (appartment === null || !appartmentAccessible(user, appartment))
			throw error(404, {
				message: "Cette annonce n'existe pas, ou n'est pas (encore) publique"
			});
	},
	/**
	 * Checks if the appartement exists, if not, throws an error
	 * WARNING: Does not imply a check to see if the user is logged in
	 */
	appartmentExists: (appartment) => {
		if (appartment === null) throw error(404, { message: "Cette annonce n'existe pas" });
	}
};
