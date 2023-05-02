<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import InputPassword from '$lib/InputPassword.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Loca7 · Choisir un nouveau mot de passe</title>
</svelte:head>

<main>
	<h1>Choisissez votre mot de passe.</h1>

	<form method="post">
		<InputPassword feedback value="" label="Mot de passe" name="password" />

		<section class="submit">
			<ButtonPrimary submits
				>{#if data.creatingPassword}Définir{:else}Changer{/if} mon mot de passe</ButtonPrimary
			>
		</section>
	</form>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	h1 {
		margin-bottom: 1rem;
	}

	section.submit {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
	}
</style>
