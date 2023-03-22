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
	import { DISPLAY_APPARTMENT_KIND, type Appartment, type User } from './types';
	import { photoURL } from './photos';
	import { ENSEEIHT } from './utils';

	export let appartment: Appartment;
	export let action: string | undefined = undefined;
	export let submitText: string = 'Confirmer';
	export let user: User;
	/*@ts-ignore*/
	export let initial: Appartment = {
		address: undefined,
		availableAt: undefined,
		charges: undefined,
		deposit: undefined,
		latitude: null,
		longitude: null,
		description: '',
		hasFurniture: null,
		hasParking: null,
		kind: undefined,
		images: [],
		rent: undefined,
		roomsCount: undefined,
		surface: undefined,
		owner: user
	};

	let showEmptyErrors = false;
</script>

<form class="fields" {action} method="post" enctype="multipart/form-data">
	<InputField label="Type de logement">
		<InputSelectOne
			required
			{showEmptyErrors}
			name="kind"
			options={DISPLAY_APPARTMENT_KIND}
			bind:value={appartment.kind}
		/>
	</InputField>

	<div class="side-by-side">
		<InputField label="Surface">
			<InputNumber
				required
				{showEmptyErrors}
				name="surface"
				unit="m²"
				initial={initial.surface}
				bind:value={appartment.surface}
				positive
				nonzero
			/>
		</InputField>

		{#if appartment.kind === 'colocation'}
			<InputField label="Nb chambres">
				<InputNumber
					required
					{showEmptyErrors}
					name="roomsCount"
					initial={initial.roomsCount}
					bind:value={appartment.roomsCount}
					positive
					nonzero
					integer
				/>
			</InputField>
		{/if}
	</div>

	<div class="side-by-side">
		<InputField label="Loyer">
			<InputNumber
				name="rent"
				{showEmptyErrors}
				unit="€"
				initial={initial.rent}
				bind:value={appartment.rent}
				required
				positive
			/>
		</InputField>

		<InputField label="Charges">
			<InputNumber
				name="charges"
				unit="€"
				{showEmptyErrors}
				initial={initial.charges}
				bind:value={appartment.charges}
				required
				positive
			/>
		</InputField>

		<InputField label="Caution">
			<InputNumber
				name="deposit"
				unit="€"
				{showEmptyErrors}
				initial={initial.deposit}
				bind:value={appartment.deposit}
				required
				positive
			/>
		</InputField>
	</div>

	{#if appartment.kind === 'colocation'}
		<p class="typo-details">Veuillez rentrer le loyer total, pas un prix par chambre.</p>
	{/if}

	<InputField label="Date de libération">
		<InputDate
			name="availableAt"
			{showEmptyErrors}
			bind:value={appartment.availableAt}
			initial={initial.availableAt}
			required
		/>
	</InputField>

	<InputField label="Adresse" id="address">
		<InputAddress
			{showEmptyErrors}
			name="address"
			id="address"
			bind:value={appartment.address}
			bind:latitude={appartment.latitude}
			bind:longitude={appartment.longitude}
			initial={initial.address}
			required
		/>
	</InputField>

	<InputField label="Aspects">
		<div class="wrap">
			<InputCheckbox
				name="hasFurniture"
				bind:value={appartment.hasFurniture}
				label="Meublé"
			/>
			<InputCheckbox name="hasParking" bind:value={appartment.hasParking} label="Parking" />
			<!-- TODO place pour vélo -->
		</div>
	</InputField>

	<InputField label="Description">
		<InputRichText name="description" bind:value={appartment.description} />
	</InputField>

	<div class="typo-details">
		Inutile de préciser les informations suivantes dans la description:
		<ul>
			<li>Loyer, charges, caution</li>
			<li>Temps de trajet vers l'ENSEEIHT à pied, en vélo, en transports</li>
			<li>Arrêts de transports en commun à proximité</li>
			<li>Type de logement, surface, nombre de chambres</li>
			<li>Adresse</li>
			<li>Statut de logement meublé, présence de place de parking</li>
		</ul>
		Elles seront affichées dans la page de l'annonce.
	</div>

	<InputField label="Photos">
		<InputImages name="photos" appartmentId={appartment.id} bind:value={appartment.photos} />
	</InputField>

	<section class="submit">
		<ButtonPrimary on:click={() => (showEmptyErrors = true)} submits>{submitText}</ButtonPrimary
		>
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
