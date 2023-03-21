<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import CardAppartment from '$lib/CardAppartment.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputRichText from '$lib/InputRichText.svelte';
	import InputSelectOne from '$lib/InputSelectOne.svelte';
	import { appartmentTitle } from '$lib/types';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Loca7 · Signaler l'annonce “{appartmentTitle(data.appartment, true)}”</title>
</svelte:head>

<main>
	<h1>Signaler une annonce</h1>

	<p>Vous signalez l'annonce <em>{appartmentTitle(data.appartment, true)}</em></p>

	<section class="appart">
		<CardAppartment {...data.appartment} />
	</section>

	<form method="post">
		<InputField label="Raison">
			<InputSelectOne
				name="reason"
				options={{
					obsolete: 'annonce obsolète',
					dangerous: 'contenu dangereux',
					other: 'autre'
				}}
			/>
		</InputField>

		<InputField label="Explication">
			<InputRichText name="message" />
		</InputField>

		<input type="hidden" name="appartmentId" value={data.appartment.id} />

		<section class="submit">
			<ButtonPrimary submits>Signaler</ButtonPrimary>
		</section>
	</form>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	@media (max-width: 800px) {
		section.appart {
			display: none;
		}
	}

	@media (min-width: 800px) {
		main {
			margin: 0 auto;
			display: grid;
			grid-template-areas: 'h1 h1' 'appart form';
			grid-template-columns: 2fr 3fr;
			justify-content: center;
			gap: 3rem;
		}

		h1 + p {
			display: none;
		}
	}

	h1 {
		grid-area: h1;
	}

	.appart {
		grid-area: appart;
	}

	form {
		grid-area: form;
		max-width: 600px;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	form :global(.field) {
		flex-grow: unset;
	}

	form section.submit {
		display: flex;
		justify-content: center;
	}
</style>
