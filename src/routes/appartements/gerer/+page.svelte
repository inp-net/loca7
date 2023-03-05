<script lang="ts">
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import CardAppartment from '$lib/CardAppartment.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ appartments } = data);
</script>

<main>
	<h1>
		Mes annonces <ButtonSecondary icon="add" href="/appartements/ajouter"
			>Nouvelle annonce</ButtonSecondary
		>
	</h1>

	<ul class="appartments">
		{#each appartments as appartment (appartment.id)}
			<li>
				<CardAppartment {...appartment} editable />
			</li>
		{:else}
			<!-- empty list -->
		{/each}
	</ul>
</main>

<style>
	h1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 3rem;
	}
	main {
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
	}

	ul.appartments {
		margin-top: 3rem;
		padding-left: 0;
		list-style: none;
		flex-wrap: wrap;
		display: flex;
		gap: 2rem;
	}
</style>
