<script lang="ts">
	import ButtonPrimary from './ButtonPrimary.svelte';
	import InputAddress from './InputAddress.svelte';
	import InputCheckbox from './InputCheckbox.svelte';
	import InputDate from './InputDate.svelte';
	import InputField from './InputField.svelte';
	import InputImages from './InputImages.svelte';
	import InputNumber from './InputNumber.svelte';
	import InputRichText from './InputRichText.svelte';
	import InputSelectOne from './InputSelectOne.svelte';
	import { DISPLAY_APPARTMENT_KIND, type Appartment } from './types';

	export let appartment: Appartment;
	export let action: string | undefined = undefined;
	export let submitText: string = 'Confirmer';
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

<form class="fields" {action} method="post">
	<InputField label="Type de logement">
		<InputSelectOne name="kind" options={DISPLAY_APPARTMENT_KIND} bind:value={appartment.kind} />
	</InputField>

	<div class="side-by-side">
		<InputField label="Surface">
			<InputNumber
				name="surface"
				unit="m²"
				initial={initial.surface}
				bind:value={appartment.surface}
				positive
			/>
		</InputField>

		{#if appartment.kind === 'colocation'}
			<InputField label="Nb chambres">
				<InputNumber
					name="roomsCount"
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
			<InputNumber
				name="rent"
				unit="€"
				initial={initial.rent}
				bind:value={appartment.rent}
				positive
			/>
		</InputField>

		<InputField label="Charges">
			<InputNumber
				name="charges"
				unit="€"
				initial={initial.charges}
				bind:value={appartment.charges}
				positive
			/>
		</InputField>

		<InputField label="Caution">
			<InputNumber
				name="deposit"
				unit="€"
				initial={initial.deposit}
				bind:value={appartment.deposit}
				positive
			/>
		</InputField>
	</div>

	<InputField label="Date de libération">
		<InputDate name="availableAt" bind:value={appartment.availableAt} initial={initial.availableAt} />
	</InputField>

	<InputField label="Adresse" id="address">
		<InputAddress name="address" id="address" bind:value={appartment.address} initial={initial.address} />
	</InputField>

	<InputField label="Aspects">
		<div class="wrap">
			<InputCheckbox name="hasFurniture" bind:value={appartment.hasFurniture} label="Meublé" />
			<InputCheckbox name="hasParking" bind:value={appartment.hasParking} label="Parking" />
			<!-- TODO place pour vélo -->
		</div>
	</InputField>

	<InputField label="Description">
		<InputRichText name="description" bind:value={appartment.description} />
	</InputField>

	<InputField label="Photos">
		<InputImages name="images" bind:value={appartment.images} />
	</InputField>

	<section class="submit">
		<ButtonPrimary submits>{submitText}</ButtonPrimary>
	</section>
</form>

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

	.submit {
		margin-top: 3rem;
		display: flex;
		justify-content: center;
	}
</style>
