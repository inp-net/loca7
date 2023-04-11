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

	let passwordResetSuccessful: boolean = $page.url.hash === '#passwordResetSuccessful';
</script>

<svelte:head>
	<title>Loca7 · Connexion</title>
</svelte:head>

<main>
	{#if passwordResetSuccessful}
		<p class="notice success password-reset-successful">
			Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous
			connecter.
		</p>
	{/if}

	{#if $page.url.searchParams.get('go') === '/appartements/ajouter'}
		<p class="notice info">
			Vous devez vous connecter ou créer un compte pour déposer une annonce.

			<ButtonSecondary insideProse href="/register">Créer un compte</ButtonSecondary>
		</p>
	{/if}

	<h1>Connexion</h1>

	<form method="post">
		<InputField label="Email">
			<InputEmail required bind:value={email} name="email" />
		</InputField>

		<InputPassword required label="Mot de passe" bind:value={password} name="password" />

		{#if $page.url.hash === '#invalidCredentials'}
			<p class="error">Coordonnées incorrectes.</p>
		{/if}

		<p class="reset">
			Mot de passe perdu ? <ButtonSecondary href="/reset-password"
				>Réinitialisez-le</ButtonSecondary
			>
		</p>

		<section class="submit">
			<ButtonPrimary submits>Se connecter</ButtonPrimary>
		</section>

		<p>
			Pas de compte?

			<ButtonSecondary insideProse href="/register{$page.url.search}"
				>Créez-en un</ButtonSecondary
			>
		</p>
	</form>
</main>

<style>
	.notice {
		padding: 1rem 2rem;
		margin-bottom: 3rem;
		background-color: var(--bg);
	}
	.notice.info {
		--bg: var(--ice);
		--fg: var(--cobalt);
	}
	.notice.success {
		--bg: var(--moss);
		--fg: var(--cactus);
	}

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

	section.submit {
		display: flex;
		justify-content: center;
	}
</style>
