<script lang="ts">
	import InputAddress from './InputAddress.svelte';
	import InputCheckbox from './InputCheckbox.svelte';
	import InputDate from './InputDate.svelte';
	import InputField from './InputField.svelte';
	import InputImages from './InputImages.svelte';
	import InputNumber from './InputNumber.svelte';
	import InputRichText from './InputRichText.svelte';
	import InputSelectOne from './InputSelectOne.svelte';
	import { APPARTMENT_KINDS, type Appartment } from './types';

	export let appartment: Appartment;
	export let initial: Appartment = {
		address: undefined,
		availableAt: undefined,
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

<div class="fields">
	<InputField label="Type de logement">
		<InputSelectOne options={APPARTMENT_KINDS} bind:value={appartment.kind} />
	</InputField>

	<div class="side-by-side">
		<InputField label="Surface">
			<InputNumber unit="m²" initial={initial.surface} bind:value={appartment.surface} positive />
		</InputField>

		{#if appartment.kind === 'Colocation'}
			<InputField label="Nb chambres">
				<InputNumber
					initial={initial.roomsCount}
					bind:value={appartment.roomsCount}
					positive
					integer
				/>
			</InputField>
		{/if}
	</div>

	<div class="side-by-side">
		<InputField label="Loyer">
			<InputNumber unit="€" initial={initial.rent} bind:value={appartment.rent} positive />
		</InputField>

		<InputField label="Charges">
			<InputNumber unit="€" initial={initial.charges} bind:value={appartment.charges} positive />
		</InputField>

		<InputField label="Caution">
			<InputNumber unit="€" initial={initial.deposit} bind:value={appartment.deposit} positive />
		</InputField>
	</div>

	<InputField label="Date de libération">
		<InputDate bind:value={appartment.availableAt} initial={initial.availableAt} />
	</InputField>

	<InputField label="Adresse">
		<InputAddress bind:value={appartment.address} initial={initial.address} />
	</InputField>

	<InputField label="Aspects">
		<div class="wrap">
			<InputCheckbox bind:value={appartment.hasFurniture} label="Meublé" />
			<InputCheckbox bind:value={appartment.hasParking} label="Parking" />
			<!-- TODO place pour vélo -->
		</div>
	</InputField>

	<InputField label="Description">
		<InputRichText bind:value={appartment.description} />
	</InputField>

	<InputField label="Photos">
		<InputImages bind:value={appartment.images} />
	</InputField>
</div>

<style>
	.side-by-side {
		display: flex;
		gap: 1rem;
	}

	.wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
