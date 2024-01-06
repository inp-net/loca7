<script lang="ts">
	import { page } from '$app/stores';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import InputEmail from '$lib/InputEmail.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputPassword from '$lib/InputPassword.svelte';
	import { oauthCSRFToken, oauthAccessToken } from '$lib/stores';
	import { onMount } from 'svelte';

	let email: string = '';
	let password: string = '';

	onMount(() => {
		$oauthCSRFToken = Math.random().toString(36).slice(2);
	});
	let passwordResetSuccessful: boolean = $page.url.hash === '#password-reset-successful';
	let passwordDefinitionSuccessful: boolean =
		$page.url.hash === '#password-definition-successful';
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
	{:else if passwordDefinitionSuccessful}
		<p class="notice success password-definition-successful">
			Votre mot de passe a été défini avec succès. Vous pouvez maintenant vous connecter.
		</p>
	{/if}

	{#if $page.url.searchParams.get('go') === '/appartements/ajouter'}
		<p class="notice info">
			Vous devez vous connecter ou créer un compte pour déposer une annonce.

			<ButtonSecondary insideProse href="/register{$page.url.search}"
				>Créer un compte</ButtonSecondary
			>
		</p>
	{/if}

	<h1>Connexion</h1>

	<form class="through-oauth" method="post" action="?/oauth">
		<p>Vous êtes étudiant·e à l'n7 ?</p>
		<ButtonSecondary insideProse submits icon="lock"
			>Connexion via
			<img src="https://churros.inpt.fr/wordmark.svg" alt="Churros" class="inline-logo" />
		</ButtonSecondary>
		<input type="hidden" name="csrfToken" value={$oauthCSRFToken} />
		<input type="hidden" name="accessToken" value={$oauthAccessToken} />
	</form>

	<form method="post" action="?/manual">
		<InputField required label="Email">
			<InputEmail required bind:value={email} name="email" />
		</InputField>

		<InputPassword required label="Mot de passe" bind:value={password} name="password" />

		{#if $page.url.hash === '#invalid-email'}
			<p class="error">Adresse e-mail incorrecte.</p>
		{:else if $page.url.hash === '#invalid-password'}
			<p class="error">Mot de passe incorrect.</p>
		{/if}

		<p class="reset">
			Mot de passe perdu ? <ButtonSecondary insideProse href="/reset-password"
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

	.through-oauth {
		display: flex;
		align-items: center;
		margin: 1.5rem 0;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.25rem;
	}

	.inline-logo {
		height: 1.3em;
	}

	.through-oauth :global(.button-secondary:focus-visible .inline-logo),
	.through-oauth :global(.button-secondary:hover .inline-logo) {
		filter: grayscale(1) invert(1);
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

	h1 {
		margin-bottom: 1rem;
	}

	section.submit {
		display: flex;
		justify-content: center;
	}
</style>
