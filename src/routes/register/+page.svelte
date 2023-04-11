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

	export let data: PageData;
	let duplicateEmail: string = $page.url.hash.startsWith('#duplicateEmail')
		? decodeURIComponent($page.url.hash.replace('#duplicateEmail=', ''))
		: '';

	let user: {
		email: string;
		firstName: string;
		lastName: string;
		phone: string;
		password: string;
	} = {
		email: duplicateEmail,
		firstName: '',
		lastName: '',
		phone: '',
		password: ''
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

	<form method="post">
		<InputField label="Email" required>
			<InputEmail
				schema={z
					.string()
					.email({ message: "Cet e-mail n'est pas valide" })
					.regex(new RegExp('^(?!' + data.allEmails.join('|') + '$).*'), {
						message: 'Cet e-mail a déjà été utilisé'
					})}
				required
				name="email"
			/>
		</InputField>

		<div class="side-by-side">
			<InputField label="Prénom" required>
				<InputText
					autocomplete="given-name"
					required
					name="firstName"
				/>
			</InputField>
			<InputField label="Nom de famille" required>
				<InputText
					autocomplete="family-name"
					required
					name="lastName"
				/>
			</InputField>
		</div>

		<InputField label="Téléphone (conseillé)">
			<InputPhone name="phone" value="" />
		</InputField>

		<InputPassword
			feedback
			required
			label="Mot de passe"
			name="password"
		/>

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
	}

	h1,
	main > p {
		text-align: center;
	}

	form {
		max-width: 400px;
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
</style>
