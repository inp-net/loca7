<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import CardAppartment from '$lib/CardAppartment.svelte';
	import type { Appartment } from '@prisma/client';
	import type { PageData } from './$types';
	import { boolean } from 'zod';
	import InputSelectOne from '$lib/InputSelectOne.svelte';

	export let data: PageData;
	$: ({ appartments } = data);

	const categories = {
		all: 'toutes',
		pending: 'en attente',
		online: 'en ligne',
		archived: 'archivées'
	};

	type Status = keyof typeof categories;

	let currentCategory: Status = 'all';

	function inCategory(category: Status): (a: Appartment) => boolean {
		return (a) => {
			switch (category) {
				case 'all':
					return true;
				case 'pending':
					return !a.approved && !a.archived;
				case 'online':
					return a.approved && !a.archived;
				case 'archived':
					return a.archived;
			}
		};
	}
</script>

<svelte:head>
	<title>Loca7 · Mes annonces</title>
</svelte:head>

<main class:empty={appartments.length === 0}>
	<h1>
		Mes annonces {#if appartments.length}<ButtonPrimary
				smaller
				icon="add"
				href="/appartements/ajouter">Nouvelle annonce</ButtonPrimary
			>{/if}
	</h1>

	{#if appartments.length === 0}
		<p>Vous n'avez pas encore d'annonces.</p>
		<section class="new">
			<ButtonPrimary href="/appartements/ajouter">Déposer une annonce</ButtonPrimary>
		</section>
	{:else}
		<section class="filter">
			<InputSelectOne options={categories} bind:value={currentCategory} />
		</section>

		<ul class="appartments">
			{#each appartments.filter(inCategory(currentCategory)) as appartment (appartment.id)}
				<li>
					<CardAppartment {...appartment} editable />
				</li>
			{:else}
				<li class="empty">Aucun appartement.</li>
			{/each}
		</ul>
	{/if}
</main>

<style>
	h1 {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 3rem;
		margin-bottom: 2rem;
	}

	section.filter {
		display: flex;
		flex-direction: column;
		align-items: center;
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
		justify-content: center;
	}

	main.empty {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	section.new {
		margin-top: 3rem;
	}
</style>
