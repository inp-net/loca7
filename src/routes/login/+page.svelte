<script lang="ts">
	import { page } from '$app/stores';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import InputEmail from '$lib/InputEmail.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputPassword from '$lib/InputPassword.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let email: string = '';
	let password: string = '';
</script>

<svelte:head>
	<title>Loca7 · Connexion</title>
</svelte:head>

<main>
	<h1>Connexion</h1>
	<p>
		Pas de compte?

		<ButtonSecondary href="/register">Créez-en un</ButtonSecondary>
	</p>

	<form method="post">
		<InputField label="Email">
			<InputEmail required bind:value={email} name="email" />
		</InputField>

		<InputPassword required label="Mot de passe" bind:value={password} name="password" />

		{#if $page.url.hash === '#invalidPassword'}
			<p class="error">Mot de passe incorrect.</p>
		{/if}

		<ButtonPrimary submits>Se connecter</ButtonPrimary>
	</form>
</main>

<style>
	form {
		max-width: 400px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2rem;
	}

	form .error {
		color: var(--blood);
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	main h1,
	main p {
		text-align: center;
	}

	h1 + p {
		margin-bottom: 2rem;
	}

	h1 {
		margin-bottom: 1rem;
	}
</style>
