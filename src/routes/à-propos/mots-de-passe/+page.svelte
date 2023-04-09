<script lang="ts">
	import { page } from '$app/stores';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import Icon from '$lib/Icon.svelte';
	import InputPassword from '$lib/InputPassword.svelte';

	const returnTo = $page.url.searchParams.get('from');
</script>

<main>
	<h1>
		{#if returnTo}
			<a href={returnTo} class="back">
				<Icon name="back" />
			</a>
		{/if}
		Détermination de la complexité d’un mot de passe
	</h1>

	<p class="intro">
		Loca7 utilise une solution réaliste de calcul de complexité de mot de passe développée par
		Dropbox, <strong>zxcvbn</strong>.
	</p>
	<p class="explain">
		Ce calcul est basé sur les techniques qu’utilisent les hackers pour trouver de mot de
		passes, et pas sur des règles arbitraires inutiles telles que la présence de caractères
		spéciaux ou la longueur du mot de passe.
	</p>

	<section class="test">
		<InputPassword feedback label="Testez ici" value="" />
	</section>

	<section class="learn-more">
		<ButtonSecondary
			href="https://dropbox.tech/security/zxcvbn-realistic-password-strength-estimation"
			icon="open-outside">En savoir plus (en anglais)</ButtonSecondary
		>

		<ButtonSecondary href={returnTo || '/'} icon="back">Retour</ButtonSecondary>
	</section>
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	h1 a {
		display: inline-block;
		height: 1.2em;
	}

	h1 {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
	}

	section.learn-more {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}
</style>
