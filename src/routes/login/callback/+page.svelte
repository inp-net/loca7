<script lang="ts">
	import { page } from '$app/stores';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import { oauthAccessToken, oauthCSRFToken } from '$lib/stores';
	import { onMount } from 'svelte';

	const code = $page.url.searchParams.get('code');
	const responseState = $page.url.searchParams.get('state');
	const errorCode = $page.url.searchParams.get('error');
	const accessTokenFromServer = $page.url.searchParams.get('access_token');
	let error = $state('');

	function tryRedirect(params: { access_token: string } | { code: string }): void {
		window.location.href = '/login/callback/done?' + new URLSearchParams(params);
	}

	onMount(() => {
		if (errorCode) {
			error = "Erreur d'authentification. Code: " + errorCode;
			$oauthCSRFToken = Math.random().toString(36).slice(2);
			if (['access_denied', 'unauthorized'].includes(errorCode)) {
				$oauthAccessToken = '';
			}
			return;
		} else if ($oauthAccessToken || accessTokenFromServer) {
			$oauthAccessToken ||= accessTokenFromServer ?? '';
			tryRedirect({ access_token: $oauthAccessToken });
		} else if (!code) {
			error = 'Non autorisé';
			return;
		} else if (responseState !== $oauthCSRFToken) {
			error = 'Validation CSRF échouée';
			$oauthCSRFToken = '';
			return;
		} else {
			$oauthCSRFToken = '';
			tryRedirect({ code });
		}
	});
</script>

<main>
	{#if error}
		Impossible de se connecter: {error}
		<form action="/login?/oauth" method="post">
			<ButtonSecondary submits>Réessayer</ButtonSecondary>
			<input type="hidden" name="csrfToken" value={$oauthCSRFToken} />
		</form>
		<ButtonSecondary href="/">Retour à l'accueil</ButtonSecondary>
	{:else}
		Connexion en cours…
	{/if}
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 1rem;
	}
</style>
