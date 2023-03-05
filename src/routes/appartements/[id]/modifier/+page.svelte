<script lang="ts">
	import { applyAction } from '$app/forms';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import FormEditAppartment from '$lib/FormEditAppartment.svelte';
	import type { Appartment } from '$lib/types';
	import type { LayoutData } from '../$types';

	export let data: LayoutData;
	const initialAppartment: Appartment = data.appartement;
	let appartment: Appartment = { ...initialAppartment };
</script>

<svelte:head>
	<title>Loca7 · Modification d'une annonce</title>
</svelte:head>

<main>
	<h1>Modification d'une annonce</h1>
	<FormEditAppartment bind:appartment initial={initialAppartment} submitText="Modifier" />
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1em;
	}
</style>
