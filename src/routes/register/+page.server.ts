import { auth } from '$lib/server/lucia';
import { prisma } from '$lib/server/prisma';
import { error, redirect, type Actions } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';
import type { PageServerLoad } from './$types';
import { log } from '$lib/server/logging';
import { isGhostEmail } from '$lib/types';
import parsePhoneNumber, { PhoneNumber } from 'libphonenumber-js';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { session, user } = await locals.validateUser();

	if (session) {
		await log.info('create_account', user, 'already logged in, redirecting', { session });
		throw redirect(302, '/' + url.search);
	}
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const inputData = Object.fromEntries(await request.formData()) as Record<string, string>;
		const { firstName, lastName, email, password, phone, agencyName, agencyWebsite } =
			inputData;

		if ((firstName + lastName).trim() === '') {
			await log.error('create_account', null, `fail because blank name`, {
				inputData
			});
			throw error(400, { message: 'Veuillez renseigner votre nom.' });
		}

		if (isGhostEmail(email)) {
			await log.error('create_account', null, `fail because ghost email used`, {
				inputData
			});
			throw error(400, { message: 'Veuillez renseigner une adresse email valide.' });
		}

		if (phone !== '' && parsePhoneNumber(phone, 'FR') !== undefined) {
			const phoneNumbers = (
				await prisma.user.findMany({
					where: {
						phone: {
							not: {
								equals: ''
							}
						}
					},
					select: {
						phone: true
					}
				})
			)
				.map(({ phone }) => parsePhoneNumber(phone, 'FR'))
				.filter(Boolean) as PhoneNumber[];

			if (phoneNumbers.some((number) => parsePhoneNumber(phone, 'FR')?.isEqual(number))) {
				await log.error(`create_account`, null, `fail because duplicate phone`, { inputData })
				throw redirect(
					302,
					'/register' + url.search + '#duplicate-phone=' + encodeURIComponent(phone)
				);
			}
		}

		try {
			await auth.createUser({
				key: {
					providerId: 'email',
					providerUserId: email,
					password
				},
				attributes: {
					phone,
					firstName,
					lastName,
					email,
					agencyName: agencyName ?? '',
					agencyWebsite: agencyWebsite ?? '',
					admin: false,
					emailIsValidated: false,
					god: false
				}
			});
		} catch (err) {
			if (!(err instanceof LuciaError)) {
				await log.fatal('create_account', email, `NON-LUCIA unknown error`, err, {
					inputData
				});
				throw error(500);
			}

			switch (err.message) {
				case 'AUTH_DUPLICATE_KEY_ID':
					await log.error(
						'create_account',
						null,
						`duplicate email (lucia says ${err.message})`,
						{ inputData }
					);
					throw redirect(
						302,
						'/register' + url.search + '#duplicate-email=' + encodeURIComponent(email)
					);
				default:
					await log.fatal(
						'create_account',
						null,
						`unknown error (lucia says ${err.message})`,
						{ inputData }
					);
					throw error(400, { message: 'Inscription impossible.' });
			}
		}

		await log.info('create_account', email, 'success', { inputData });
		throw redirect(302, '/login' + url.search);
	}
};
