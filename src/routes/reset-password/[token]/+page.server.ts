import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth, guards } from '$lib/server/lucia';
import { sendMail } from '$lib/server/mail';
import { CONTACT_EMAIL } from '$lib/constants';
import { log } from '$lib/server/logging';

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	const user = session?.user;
	const passwordReset = await prisma.passwordReset.findFirst({
		where: {
			id: params.token,
			expires: {
				gt: Date.now()
			}
		},
		include: {
			user: true
		}
	});
	if (!passwordReset) {
		await log.error(
			'use_password_reset',
			user,
			`token ${params.token} is invalid (expired or not found)`
		);
		redirect(302, '/reset-password#invalid-token');
	}
	try {
		const currentEmailKey = await prisma.key.findFirst({
			where: {
				user: {
					id: passwordReset.user.id
				}
			}
		});
		const creatingPassword = !currentEmailKey;
		return { creatingPassword, holder: passwordReset.user };
	} catch (err) {
		await log.fatal('use_password_reset', user, `while finding current email key: ${err}`);
		error(500, {
			message: `Une erreur s’est produite. Veuillez réessayer. Code technique: FINDING_CURRENT_EMAIL_KEY`
		});
	}
};

export const actions: Actions = {
	default: async ({ request, params, locals, url }) => {
		const session = await locals.auth.validate();
		const user = session?.user;

		const passwordReset = await prisma.passwordReset
			.findFirst({
				where: {
					id: params.token,
					expires: {
						gt: Date.now()
					}
				},
				include: {
					user: true
				}
			})
			.catch(async (err) => {
				await log.fatal('use_password_reset', user, `while finding password reset: ${err}`);
			});

		if (!passwordReset) {
			await log.error(
				'use_password_reset',
				user,
				`token ${params.token} is invalid (expired or not found)`
			);
			redirect(302, '/reset-password#invalid-token');
		}

		// Delete all password resets for this user
		await prisma.passwordReset
			.deleteMany({
				where: {
					user: {
						id: passwordReset.user.id
					}
				}
			})
			.catch(async (err) => {
				await log.fatal(
					'use_password_reset',
					user,
					`while deleting password resets: ${err} ${JSON.stringify(
						{ passwordReset },
						(_, v) => (typeof v === 'bigint' ? v.toString() : v)
					)}`
				);
			});

		const newPassword = (await request.formData()).get('password')?.toString();

		if (!newPassword) {
			await log.error(
				'use_password_reset',
				user ?? passwordReset.user,
				`no password given. user is ${user ? 'logged in' : 'password reset holder'} ` +
					JSON.stringify(passwordReset, (_, v) =>
						typeof v === 'bigint' ? v.toString() : v
					)
			);
			error(400, { message: "Aucun mot de passe n'a été fourni." });
		}

		const currentEmailKey = await prisma.key.findFirst({
			where: {
				user: {
					id: passwordReset.user.id
				}
			}
		});
		const creatingPassword = !currentEmailKey;

		if (creatingPassword) {
			await auth
				.createKey({
					userId: passwordReset.user.id,
					password: newPassword,
					providerId: 'email',
					providerUserId: passwordReset.user.email
				})
				.catch(async (err) => {
					await log.fatal(
						'use_password_reset',
						user,
						`while creating key: ${err} ${JSON.stringify({ passwordReset }, (_, v) =>
							typeof v === 'bigint' ? v.toString() : v
						)}`
					);
				});
			await prisma.user
				.update({
					where: {
						id: passwordReset.user.id
					},
					data: {
						emailIsValidated: true
					}
				})
				.catch(async (err) => {
					await log.fatal(
						'use_password_reset',
						user,
						`while updating user: ${err} ${JSON.stringify({ passwordReset }, (_, v) =>
							typeof v === 'bigint' ? v.toString() : v
						)}`
					);
				});
			await sendMail({
				to: passwordReset.user,
				subject: 'Votre compte Loca7 a été créé',
				data: {
					manageAppartmentsUrl: `${
						process.env.ORIGIN || 'http://localhost:5173'
					}/appartements/gerer`
				},
				template: 'account-created'
			});
		} else {
			await auth
				.updateKeyPassword('email', passwordReset.user.email, newPassword)
				.catch(async (err) => {
					await log.fatal(
						'use_password_reset',
						user,
						`while updating key: ${err} ${JSON.stringify({ passwordReset }, (_, v) =>
							typeof v === 'bigint' ? v.toString() : v
						)}`
					);
				});
			await sendMail({
				to: passwordReset.user,
				subject: 'Loca7: Votre mot de passe a été changé',
				data: {},
				template: 'password-changed'
			});
		}
		await log.info(
			'use_password_reset',
			user ?? passwordReset.user,
			`password ${creatingPassword ? 'created' : 'changed'} for ${
				passwordReset.user.email
			}. user is ${user ? 'logged in' : 'password reset holder'} ` +
				JSON.stringify(passwordReset, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
		);

		redirect(302, `/login#password-${creatingPassword ? 'definition' : ' reset'}-successful`);
	}
};
