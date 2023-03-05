<script lang="ts">
	import AppartmentsMap from '$lib/AppartmentsMap.svelte';
	import ButtonFloating from '$lib/ButtonFloating.svelte';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import CardAppartment from '$lib/CardAppartment.svelte';
	import InputCheckbox from '$lib/InputCheckbox.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputNumber from '$lib/InputNumber.svelte';
	import InputSelectMultiple from '$lib/InputSelectMultiple.svelte';
	import InputSelectOne from '$lib/InputSelectOne.svelte';
	import { searchResults } from '$lib/stores';
	import {
		APPARTMENT_KINDS,
		randomAppartement,
		type Appartment,
		type SearchCriteria
	} from '$lib/types';
	import { distanceBetween, ENSEEIHT } from '$lib/utils';
	import { onMount } from 'svelte';

	let criteria: SearchCriteria = {
		bicycleParking: null,
		furniture: null,
		maximumRent: undefined,
		minimumSurface: undefined,
		parking: null,
		type: []
	};

	let sortOptions = ['prix', 'surface', "distance à l'n7", 'délai avant libération'];
	let sortBy = sortOptions[0];
	let resultsTab = 'list';

	let scroll = 0;
	onMount(() => {
		window.addEventListener('scroll', () => {
			if (resultsTab === 'list') scroll = window.scrollY;
		});
	});
	$: if (resultsTab === 'list') {
		window.scrollTo(0, scroll);
	} else {
		window.scrollTo(0, 0);
	}

	const appartments: Appartment[] = Array(15).fill({}).map(randomAppartement);

	$searchResults = [...appartments];
	$: $searchResults = appartments
		.filter(
			(appartment) =>
				(criteria.furniture === null ? true : appartment.hasFurniture === criteria.furniture) &&
				(criteria.parking === null ? true : appartment.hasParking === criteria.parking) &&
				(!criteria.maximumRent || appartment.rent <= criteria.maximumRent) &&
				(!criteria.minimumSurface || appartment.surface >= criteria.minimumSurface) &&
				(!criteria.type.length || criteria.type.includes(appartment.kind))
		)
		.sort((a, b) => {
			const quantity = ({ charges, rent, surface, location, availableAt }: Appartment) => {
				switch (sortBy) {
					case 'prix':
						return charges + rent;
					case 'surface':
						return surface;
					case "distance à l'n7":
						return location === null
							? Number.MAX_SAFE_INTEGER
							: distanceBetween(location, ENSEEIHT);
					case 'délai avant libération':
						return Date.now() - Date.parse(availableAt);
					default:
						return 0;
				}
			};

			return quantity(a) - quantity(b);
		});
</script>

<svelte:head>
	<title>Loca7 · Recherche</title>
</svelte:head>

<main>
	<div class="search">
		<h1>Recherche de logement</h1>
		<form action="?/search">
			<div class="surface-and-price">
				<InputField label="Surface minimale">
					<InputNumber unit="m²" positive bind:value={criteria.minimumSurface} />
				</InputField>
				<InputField label="Loyer maximum">
					<InputNumber unit="€" positive bind:value={criteria.maximumRent} />
				</InputField>
			</div>
			<InputField label="Type de logement">
				<InputSelectMultiple options={APPARTMENT_KINDS} bind:selection={criteria.type} />
			</InputField>
			<InputField label="Aspects">
				<div class="aspects">
					<InputCheckbox labelNull="Peu importe" label="Meublé" bind:value={criteria.furniture} />
					<InputCheckbox labelNull="Peu importe" label="Parking" bind:value={criteria.parking} />
					<InputCheckbox
						labelNull="Peu importe"
						label="Parking vélo"
						bind:value={criteria.bicycleParking}
					/>
				</div>
			</InputField>
			<section class="submit">
				<ButtonPrimary submits>Rechercher</ButtonPrimary>
			</section>
		</form>
	</div>

	<div class="results">
		<h2>{$searchResults.length} Résultat{$searchResults.length === 1 ? '' : 's'}</h2>
		{#if resultsTab === 'list'}
			<div class="sort">
				<InputField label="Trier par">
					<InputSelectOne options={sortOptions} bind:value={sortBy} />
				</InputField>
			</div>
			<ul class="results">
				{#each $searchResults as appartment (appartment.id)}
					<li>
						<CardAppartment {...appartment} />
					</li>
				{/each}
			</ul>
		{:else}
			<div class="map">
				<AppartmentsMap appartments={$searchResults} scrollIsZoom />
			</div>
		{/if}
		<div class="goto-map">
			{#if resultsTab === 'list'}
				<ButtonFloating icon="map" on:click={() => (resultsTab = 'map')}
					>Voir sur la carte</ButtonFloating
				>
			{:else}
				<ButtonFloating icon="back" on:click={() => (resultsTab = 'list')}
					>Retour à la liste</ButtonFloating
				>
			{/if}
		</div>
	</div>
</main>

<style>
	form {
		max-width: 500px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: start;
		gap: 2rem;
	}

	h1 {
		margin-bottom: 2rem;
	}

	.surface-and-price,
	.aspects {
		display: flex;
		gap: 1rem;
	}

	.aspects {
		flex-wrap: wrap;
	}

	@media (max-width: 1200px) {
		.surface-and-price {
			flex-wrap: wrap;
		}
	}

	main {
		max-width: 1400px;
		width: 100%;
		margin: 0 auto;
		display: flex;
		gap: 5rem;
		position: relative;
		justify-content: center;
	}

	.search {
		position: sticky;
		top: 100px;
		align-self: flex-start;
	}

	@media (min-width: 500px) {
		.search {
			min-width: 400px;
		}
	}

	@media (max-width: 1100px) {
		.search {
			position: static;
		}
		main {
			flex-wrap: wrap;
		}
	}

	.submit {
		display: flex;
	}

	.sort {
		background: var(--bg);
		z-index: 20;
	}

	.results {
		display: flex;
		flex-direction: column;
		padding: 0;
		position: relative;
		width: 100%;
	}

	.results h2 {
		margin-bottom: 1rem;
	}

	.results ul {
		margin-top: 2rem;
		list-style: none;
		gap: 3rem;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		width: 100%;
	}

	.results .map {
		width: 100%;
		height: calc(100vh - 200px);
	}

	.results .goto-map {
		margin-top: 2rem;
		position: sticky;
		bottom: 2rem;
		z-index: 1000;
		width: 100%;
		display: flex;
		justify-content: center;
	}
</style>
