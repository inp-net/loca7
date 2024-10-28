<script lang="ts">
	import { page } from '$app/stores';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import InputEmail from '$lib/InputEmail.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputPassword from '$lib/InputPassword.svelte';
	import InputPhone from '$lib/InputPhone.svelte';
	import InputText from '$lib/InputText.svelte';
	import { z } from 'zod';
	import type { PageData, Snapshot } from './$types';
	import escapeRegex from 'escape-string-regexp';
	import { EMAIL_REGEX } from '$lib/types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let duplicateEmail: string = $page.url.hash.startsWith('#duplicate-email')
		? decodeURIComponent($page.url.hash.replace('#duplicate-email=', ''))
		: '';
	let duplicatePhone: string = $page.url.hash.startsWith('#duplicate-phone')
		? decodeURIComponent($page.url.hash.replace('#duplicate-phone=', ''))
		: '';

	let user: {
		email: string;
		firstName: string;
		lastName: string;
		phone: string;
		password: string;
	} = $state({
		email: duplicateEmail,
		firstName: '',
		lastName: '',
		phone: duplicatePhone,
		password: ''
	});

	export const snapshot: Snapshot = {
		capture: () => user,
		restore: (data) => (user = data)
	};
</script>

<svelte:head>
	<title>Loca7 · Inscription</title>
</svelte:head>

<main>
	<h1>Inscription</h1>
	<p>
		Déjà un compte? <ButtonSecondary insideProse href="/login">Connectez-vous</ButtonSecondary>
	</p>

	<p class="explain-required-fields">
		Les champs marqués d'un <span class="required-indicator">*</span> sont requis.
	</p>

	<form method="post">
		<InputField label="Email" required>
			<InputEmail
				schema={z
					.string()
					.regex(EMAIL_REGEX, { message: "Cet e-mail n'est pas valide" })
					.regex(
						new RegExp('^(?!' + data.allEmails.map(escapeRegex).join('|') + '$).*'),
						{
							message: 'Cet e-mail a déjà été utilisé'
						}
					)}
				required
				name="email"
				bind:value={user.email}
			/>
		</InputField>

		<div class="side-by-side">
			<InputField label="Prénom">
				<InputText autocomplete="given-name" name="firstName" bind:value={user.firstName} />
			</InputField>
			<InputField label="Nom de famille" required>
				<InputText
					autocomplete="family-name"
					required
					name="lastName"
					bind:value={user.lastName}
				/>
			</InputField>
		</div>

		<InputField label="Téléphone (conseillé)">
			<InputPhone
				name="phone"
				bind:value={user.phone}
				schema={z.custom((value) => value === '' || value !== duplicatePhone, {
					message: 'Ce numéro de téléphone a déjà été utilisé'
				})}
			/>
		</InputField>

		<InputPassword
			feedback
			userInputs={Object.values(user).filter((v) => typeof v === 'string')}
			required
			label="Mot de passe"
			name="password"
			bind:value={user.password}
		/>

		<section class="agency">
			<div class="title-and-explain">
				<h2>Vous représentez une agence ?</h2>
				<p>Votre nom ne sera pas affiché sur vos annonces</p>
			</div>
			<InputField label="Nom de l'agence">
				<InputText
					autocomplete="organization"
					name="agencyName"
					bind:value={user.agencyName}
				/>
			</InputField>
			<InputField label="Site internet">
				<InputText
					autocomplete="url"
					name="agencyWebsite"
					bind:value={user.agencyWebsite}
				/>
			</InputField>
		</section>

		<section class="submit">
			<ButtonPrimary submits>Créer un compte</ButtonPrimary>
		</section>
	</form>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
	}

	h1,
	main > p {
		text-align: center;
	}

	.required-indicator {
		color: var(--sky);
		margin-left: 0.125rem;
		transform: scale(1.2) translateY(0.1em);
	}

	form {
		max-width: 500px;
		width: 100%;
		margin: 2rem auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	form .submit {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
	}

	.side-by-side {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}
	section.agency {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
