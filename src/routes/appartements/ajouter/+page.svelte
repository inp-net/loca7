<script lang="ts">
	import FormEditAppartment from '$lib/FormEditAppartment.svelte';
	import type { Appartment } from '$lib/types';
	import type { User } from '@prisma/client';
	import type { PageData, Snapshot } from './$types';

	export let data: PageData;
	let user: User = data.user!;

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
		hasBicycleParking: null,
		hasFiberInternet: null,
		hasElevator: null,
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
	<FormEditAppartment {user} bind:appartment submitText="Poster" action="?/postAppartment" />
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	h1,
	h1 + p {
		text-align: center;
	}
	h1 + p {
		margin-bottom: 2rem;
	}
</style>
