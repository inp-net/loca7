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

<main>
	<h2>Modifier l'appartment #{appartment.id}</h2>
	<form method="post">
		<FormEditAppartment bind:appartment initial={initialAppartment} />

		<section class="send">
			<ButtonPrimary submits>Modifier</ButtonPrimary>
		</section>
	</form>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1em;
	}

	.send {
		margin-top: 5rem;
		display: flex;
		justify-content: center;
	}
</style>
