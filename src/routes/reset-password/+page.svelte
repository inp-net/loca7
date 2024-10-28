<script lang="ts">
	import { page } from '$app/stores';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import {
		PASSWORD_RESET_VALID_FOR_MILLISECONDS,
		VALIDATION_LINK_VALID_FOR_MILLISECONDS
	} from '$lib/constants';
	import InputEmail from '$lib/InputEmail.svelte';
	import InputField from '$lib/InputField.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let sent: boolean = $page.url.hash === '#sent';
	let email: string = $state($page.url.searchParams.get('email') ?? '');
</script>

<svelte:head>
	<title>Loca7 · Réinitialisez votre mot de passe</title>
</svelte:head>

<main>
	<h1>Réinitialisez votre mot de passe.</h1>

	{#if $page.url.hash === '#invalid-token'}
		<p class="error">Le lien de réinitialisation a expiré ou est invalide.</p>
	{:else if $page.url.hash === '#no-email'}
		<p class="error">Cette addresse e-mail n'existe pas</p>
	{/if}

	{#if sent}
		<p>
			On a envoyé un e-mail à <strong>{email}</strong> avec un lien de réinitialisation.
		</p>
		<p>
			Il expire {new Intl.RelativeTimeFormat('fr-FR', {
				numeric: 'auto'
			}).format((PASSWORD_RESET_VALID_FOR_MILLISECONDS * 1e-3) / 60, 'minutes')}
		</p>
		<form method="post">
			<input type="hidden" name="email" value={email} />
			<ButtonSecondary submits icon="reset">Renvoyer le mail</ButtonSecondary>
		</form>
	{:else}
		<form method="post">
			<InputField label="Adresse e-mail">
				<InputEmail required bind:value={email} name="email" />
			</InputField>
			<section class="submit">
				<ButtonPrimary submits>Envoyer un mail de réinitialisation</ButtonPrimary>
			</section>
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

	section.submit {
		margin-top: 2rem;
	}

	p.error {
		color: var(--mushroom);
	}
</style>
