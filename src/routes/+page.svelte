<script lang="ts">
	import { browser } from '$app/environment';
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
	import {
		searchResults,
		searchCriteria,
		searchSortBy,
		resultsTab,
		SORT_OPTIONS,
		searchResultsScrollPosition
	} from '$lib/stores';
	import { DISPLAY_APPARTMENT_KIND } from '$lib/types';
	import { distanceBetween, ENSEEIHT, titleCase } from '$lib/utils';
	import type { Appartment } from '@prisma/client';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import AppartmentAdminItem from '$lib/AppartmentAdminItem.svelte';
	import { page } from '$app/stores';

	export let data: PageData;

	onMount(() => {
		if (window.scrollY === 0) {
			window.scrollTo(0, $searchResultsScrollPosition);
		}
		window.addEventListener('scroll', () => {
			$searchResultsScrollPosition = window.scrollY;
		});

		if ($page.url.searchParams.has('reload')) {
			window.location.search = '';
		}
	});

	let appartments: Appartment[] = [];
	$: ({ appartments } = data);

	const aspectCriteria = (aspectName: keyof typeof $searchCriteria, appartment: Appartment) =>
		$searchCriteria[aspectName] === null
			? true
			: appartment['has' + titleCase(aspectName)] === $searchCriteria[aspectName];

	const aspectCriterias = (
		appartment: Appartment,
		...aspectNames: (keyof typeof $searchCriteria)[]
	) => {
		return aspectNames.reduce(
			(acc, aspectName) => acc && aspectCriteria(aspectName, appartment),
			true
		);
	};

	$searchResults = [...appartments];
	$: $searchResults = appartments
		.filter(
			(appartment) =>
				aspectCriterias(
					appartment,
					'furniture',
					'parking',
					'bicycleParking',
					'fiberInternet',
					'elevator'
				) &&
				(!$searchCriteria.maximumRent || appartment.rent <= $searchCriteria.maximumRent) &&
				(!$searchCriteria.minimumSurface ||
					appartment.surface >= $searchCriteria.minimumSurface) &&
				(!$searchCriteria.type.length || $searchCriteria.type.includes(appartment.kind))
		)
		.sort((a, b) => {
			const quantity = ({
				charges,
				rent,
				surface,
				latitude,
				longitude,
				availableAt
			}: Appartment) => {
				switch ($searchSortBy) {
					case 'prix':
						return charges + rent;
					case 'prix/m²':
						return surface ? (charges + rent) / surface : Number.MAX_SAFE_INTEGER;
					case 'surface':
						return -surface;
					case "distance à l'n7":
						return latitude && longitude
							? Number.MAX_SAFE_INTEGER
							: distanceBetween({ latitude, longitude }, ENSEEIHT);
					case 'délai avant libération':
						return Date.now() - availableAt.valueOf();
					default:
						return 0;
				}
			};

			return quantity(a) - quantity(b);
		});

	function toggleTab(e) {
		e.target.blur();
		$resultsTab = $resultsTab === 'list' ? 'map' : 'list';
	}
</script>

<svelte:head>
	<title>Loca7 · Recherche</title>
</svelte:head>

<main data-view={$resultsTab}>
	<div id="post-appartment-cta">
		<ButtonPrimary smaller icon="add" href="/appartements/ajouter"
			>Déposer une annonce</ButtonPrimary
		>
	</div>

	<section class="search">
		<div class="filters">
			{#if $resultsTab === 'list'}{/if}
			<h1>Recherche de logement</h1>
			<form action="?/search">
				<div class="surface-and-price">
					<InputField label="Surface minimale">
						<InputNumber
							unit="m²"
							positive
							bind:value={$searchCriteria.minimumSurface}
						/>
					</InputField>
					<InputField label="Loyer maximum">
						<InputNumber
							unit="€"
							positive
							bind:value={$searchCriteria.maximumRent}
							closeKeyboardOnEnter
						/>
					</InputField>
				</div>
				<InputField label="Type de logement">
					<InputSelectMultiple
						options={DISPLAY_APPARTMENT_KIND}
						bind:selection={$searchCriteria.type}
					/>
				</InputField>
				<InputField label="Aspects">
					<div class="aspects">
						<InputCheckbox
							labelNull="Peu importe"
							label="Meublé"
							bind:value={$searchCriteria.furniture}
						/>
						<InputCheckbox
							labelNull="Peu importe"
							label="Parking"
							bind:value={$searchCriteria.parking}
						/>
						<InputCheckbox
							labelNull="Peu importe"
							label="Parking vélo"
							bind:value={$searchCriteria.bicycleParking}
						/>
						<InputCheckbox
							labelNull="Peu importe"
							label="Fibre optique"
							bind:value={$searchCriteria.fiberInternet}
						/>
						<InputCheckbox
							labelNull="Peu importe"
							label="Ascenseur"
							bind:value={$searchCriteria.elevator}
						/>
					</div>
				</InputField>
			</form>
			<section class="search-actions">
				<ButtonSecondary
					icon="search"
					id="scroll-to-results"
					on:click={() => {
						document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
					}}>Résultats</ButtonSecondary
				>
				{#if $resultsTab === 'list'}
					<ButtonSecondary icon="map" on:click={toggleTab}
						>Voir sur la carte</ButtonSecondary
					>
				{/if}
			</section>
		</div>
		<div class="results" id="results">
			<h2>{$searchResults.length} Résultat{$searchResults.length === 1 ? '' : 's'}</h2>
			<div class="sort">
				<InputField label="Trier par">
					<InputSelectOne options={SORT_OPTIONS} bind:value={$searchSortBy} />
				</InputField>
			</div>
			<ul class="results">
				{#each $searchResults as appartment (appartment.id)}
					<li>
						<CardAppartment {...appartment} />
					</li>
				{/each}
			</ul>
			{#if $resultsTab === 'map'}
				<div class="map">
					<AppartmentsMap appartments={$searchResults} scrollIsZoom />
				</div>
			{/if}
			<div class="goto-map">
				<ButtonFloating icon={$resultsTab === 'list' ? 'map' : 'back'} on:click={toggleTab}>
					{#if $resultsTab === 'list'}
						Voir sur la carte
					{:else}
						Retour à la liste
					{/if}
				</ButtonFloating>
			</div>
		</div>
	</section>
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
	}

	#post-appartment-cta {
		display: flex;
		justify-content: center;
		margin-bottom: 3rem;
	}

	section.search {
		display: flex;
		gap: 5rem;
		position: relative;
		justify-content: center;
	}

	.filters {
		position: sticky;
		top: 180px;
		align-self: flex-start;
	}

	@media (min-width: 1350px) {
		#post-appartment-cta {
			display: none;
		}
	}

	@media (min-width: 500px) {
		.filters {
			min-width: 400px;
		}
	}

	@media (max-width: 1100px) {
		.filters {
			position: static;
		}
		section.search {
			flex-wrap: wrap;
		}
	}

	.search-actions {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
		gap: 1rem;
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
		--border-radius: 0;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 10000;
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

	main[data-view='map'] .goto-map {
		z-index: 100000;
		position: fixed;
		bottom: 2rem;
	}

	@media (min-width: 1200px) {
		:global(#scroll-to-results) {
			display: none;
		}

		main[data-view='map'] .goto-map {
			position: fixed;
			bottom: 4rem;
			left: 4rem;
			justify-content: start;
		}

		main[data-view='map'] .filters {
			position: fixed;
			z-index: 100000;
			left: 4rem;
			top: 4rem;
			bottom: unset;
			background: var(--bg);
			padding: 2rem;
			border-radius: 1rem;
		}
	}
</style>
