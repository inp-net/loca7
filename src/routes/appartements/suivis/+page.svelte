<script lang="ts">
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import CardAppartment from '$lib/CardAppartment.svelte';
	import { titleCase } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ appartments } = data);
</script>

<svelte:head>
	<title>Loca7 · Annonces suivies</title>
</svelte:head>

<main class:empty={appartments.length === 0}>
	<h1>Mes appartements suivis</h1>

	<ul class="appartments">
		{#each appartments as appartment}
			<li>
				<CardAppartment dislikeable {...appartment}></CardAppartment>
			</li>
		{:else}
			<li>
				Aucune annonce suivie. Suivez des annonces en cliquant sur <ButtonSecondary
					insideProse
					icon="heart">Suivre</ButtonSecondary
				> depuis la page d'une annonce.
			</li>
		{/each}
	</ul>
</main>

<style>
	.appartments {
		display: flex;
		padding-left: 0;
		flex-wrap: wrap;
		list-style: none;
		justify-content: center;
		margin-top: 2rem;
	}

	h1 {
		text-align: center;
	}
</style>
