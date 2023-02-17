<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import FormEditAppartment from '$lib/FormEditAppartment.svelte';
	import type { Appartment } from '$lib/types';

	const submit = () => {};

	let appartment: Appartment = {
		availableAt: undefined,
		address: undefined,
		charges: undefined,
		deposit: undefined,
		description: '',
		distanceToN7: undefined,
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
	<FormEditAppartment bind:appartment />
	<section class="send">
		<ButtonPrimary on:click={() => submit()}>Publier</ButtonPrimary>
	</section>
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
	}

	.send {
		margin-top: 5rem;
		display: flex;
		justify-content: center;
	}
</style>
