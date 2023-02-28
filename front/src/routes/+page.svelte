<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import CardAppartment from '$lib/CardAppartment.svelte';
	import InputCheckbox from '$lib/InputCheckbox.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputNumber from '$lib/InputNumber.svelte';
	import InputSelectMultiple from '$lib/InputSelectMultiple.svelte';
	import InputSelectOne from '$lib/InputSelectOne.svelte';
	import {
		APPARTMENT_KINDS,
		randomAppartement,
		type Appartment,
		type SearchCriteria
	} from '$lib/types';
	import { distanceBetween, ENSEEIHT } from '$lib/utils';

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

	const appartments: Appartment[] = Array(15).fill({}).map(randomAppartement);

	let results: Appartment[] = [...appartments];
	$: results = appartments
		.filter(
			(appartment) =>
				(criteria.furniture === null ? true : appartment.hasFurniture === criteria.furniture) &&
				(criteria.parking === null ? true : appartment.hasParking === criteria.parking) &&
				(criteria.maximumRent === undefined ? true : appartment.rent <= criteria.maximumRent) &&
				(criteria.minimumSurface === undefined
					? true
					: appartment.surface >= criteria.minimumSurface) &&
				(criteria.type.length === 0 ? true : criteria.type.includes(appartment.kind))
		)
		.sort(({ charges, rent, surface, location, availableAt }) => {
			switch (sortBy) {
				case 'prix':
					return charges + rent;
				case 'surface':
					return surface;
				case "distance à l'n7":
					return location === null ? Number.MAX_SAFE_INTEGER : distanceBetween(location, ENSEEIHT);
				case 'délai avant libération':
					return Date.now() - Date.parse(availableAt);
				default:
					return 0;
			}
		});
</script>

<main>
	<div class="search">
		<h1>Recherche de logement</h1>
		<form action="?/search">
			<div class="side-by-side">
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
				<div class="side-by-side">
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
		<div class="sort">
			<h2>{results.length} Résultat{results.length === 1 ? '' : 's'}</h2>
			<InputField label="Trier par">
				<InputSelectOne options={sortOptions} bind:value={sortBy} />
			</InputField>
		</div>
		<ul class="results">
			{#each results as appartment}
				<li>
					<CardAppartment {...appartment} />
				</li>
			{/each}
		</ul>
	</div>
</main>

<style>
	form {
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	h1 {
		margin-bottom: 2rem;
	}

	.side-by-side {
		display: flex;
		gap: 1rem;
	}

	main {
		max-width: 1200px;
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
	}

	.results h2 {
		margin-bottom: 1rem;
	}

	.results ul {
		margin-top: 5rem;
		list-style: none;
		gap: 5rem;
	}
</style>
