<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import CardAppartment from '$lib/CardAppartment.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputRichText from '$lib/InputRichText.svelte';
	import InputSelectOne from '$lib/InputSelectOne.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main>
	<h1>Signaler une annonce</h1>

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
		margin: 0 auto;
		display: grid;
		grid-template-areas: 'h1 h1' 'appart form';
		grid-template-columns: 1fr 1fr;
		justify-content: center;
		gap: 3rem;
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
