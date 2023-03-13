<script lang="ts">
	import { page } from '$app/stores';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import { VALIDATION_LINK_VALID_FOR_MILLISECONDS } from '$lib/constants';
	import type { PageData } from './$types';

	export let data: PageData;

	let sent: boolean = $page.url.hash === '#sent';
</script>

<main>
	<h1>Votre adresse e-mail doit être vérifiée.</h1>

	{#if $page.url.hash === '#invalidToken'}
		<p class="error">Le lien de vérification est invalide ou a expiré.</p>
	{/if}

	{#if sent}
		<p>
			On a envoyé un e-mail à <strong>{data.user.email}</strong> avec un lien de vérification.
		</p>
		<p>
			Il sera valide pendant {new Intl.RelativeTimeFormat('fr-FR', { numeric: 'auto' }).format(
				(VALIDATION_LINK_VALID_FOR_MILLISECONDS * 1e-3) / 60 / 60,
				'hours'
			)}
		</p>
		<form method="post">
			<ButtonSecondary submits icon="reset">Renvoyer le mail</ButtonSecondary>
		</form>
	{:else}
		<form method="post">
			<ButtonPrimary submits>Envoyer un mail de vérification</ButtonPrimary>
		</form>
	{/if}
</main>

<style>
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		text-align: center;
	}

	p + form {
		margin-top: 2rem;
	}

	h1 {
		margin-bottom: 1rem;
	}
</style>
