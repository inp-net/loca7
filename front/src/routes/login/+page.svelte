<script lang="ts">
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

	<form action="?/login" method="POST">
		<InputField label="Email">
			<InputEmail required bind:value={email} name="email" />
		</InputField>

		<InputPassword required label="Mot de passe" bind:value={password} name="password" />

		{#if form?.invalid}
			<p class="error">Username and password is required.</p>
		{/if}

		{#if form?.credentials}
			<p class="error">You have entered the wrong credentials.</p>
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
