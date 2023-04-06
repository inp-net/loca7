<script lang="ts">
	import FormEditAppartment from '$lib/FormEditAppartment.svelte';
	import type { Appartment } from '$lib/types';
	import type { Snapshot } from './$types';

	let appartment: Appartment = {
		availableAt: new Date(),
		address: '',
		charges: undefined,
		deposit: undefined,
		description: '',
		latitude: null,
		longitude: null,
		hasFurniture: null,
		hasParking: null,
		kind: undefined,
		images: [],
		rent: undefined,
		roomsCount: undefined,
		surface: undefined
	};

	export const snapshot: Snapshot = {
		capture: () => appartment,
		restore: (data) => (appartment = data)
	};
</script>

<svelte:head>
	<title>Loca7 · Nouvelle annonce</title>
</svelte:head>

<main>
	<h1>Nouvelle annonce</h1>
	<p>Votre annonce sera validée par un·e administrateur·ice avant d’être publiée</p>
	<FormEditAppartment bind:appartment submitText="Poster" action="?/postAppartment" />
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
	}
</style>
