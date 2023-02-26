<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import FormEditAppartment from '$lib/FormEditAppartment.svelte';
	import type { Appartment } from '$lib/types';

	const submit = () => {};

	let appartment: Appartment = {
		availableAt: undefined,
		address: '',
		charges: undefined,
		deposit: undefined,
		description: '',
		location: null,
		hasFurniture: undefined,
		hasParking: undefined,
		kind: undefined,
		id: undefined,
		images: [],
		owner: {
			email: undefined,
			id: undefined,
			name: undefined,
			phone: undefined
		},
		rent: undefined,
		roomsCount: undefined,
		surface: undefined
	};
</script>

<main>
	<h1>Nouvelle annonce</h1>
	<p>Votre annonce sera validée par un·e administrateur·ice avant d’être publiée</p>
	<FormEditAppartment bind:appartment submitText="Poster" />
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		padding: 0 1em;
	}
</style>
