<script lang="ts">
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import CardAppartment from '$lib/CardAppartment.svelte';
	import { appartmentTitle } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ appartment } = data);
</script>

<svelte:head>
	<title>Loca7 · Suppression de {appartmentTitle(appartment)}</title>
</svelte:head>

<main>
	<h1>Suppression de l'annonce</h1>

	<p>Êtes-vous sûr·e de vouloir supprimer l'annonce suivante ?</p>

	<CardAppartment {...appartment} />

	<p>Il est impossible de revenir en arrière.</p>

	<section class="actions">
		<ButtonSecondary
			icon="back"
			on:click={() => {
				window.history.back();
			}}>Annuler</ButtonSecondary
		>
		<form action="?/confirm" method="post">
			<ButtonSecondary submits icon="delete" dangerous
				>Confirmer la suppression</ButtonSecondary
			>
		</form>
	</section>
</main>

<style>
	main {
		max-width: 800px;
		width: 100%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
		align-items: center;
	}

	section.actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}
</style>
