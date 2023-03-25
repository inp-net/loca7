<script lang="ts">
	import type { User } from '@prisma/client';
	import ButtonPrimary from './ButtonPrimary.svelte';
	import InputAddress from './InputAddress.svelte';
	import InputCheckbox from './InputCheckbox.svelte';
	import InputDate from './InputDate.svelte';
	import InputField from './InputField.svelte';
	import InputImages from './InputImages.svelte';
	import InputNumber from './InputNumber.svelte';
	import InputRichText from './InputRichText.svelte';
	import InputSelectOne from './InputSelectOne.svelte';
	import {
		AppartmentSchema,
		DISPLAY_APPARTMENT_KIND,
		EMPTY_APPARTMENT,
		type Appartment,
		type WithUndefinableProperties
	} from './types';

	export let appartment: Appartment;
	export let action: string | undefined = undefined;
	export let submitText: string = 'Confirmer';
	export let user: User;
	/*@ts-ignore*/
	export let initial: WithUndefinableProperties<Appartment> = {
		...EMPTY_APPARTMENT,
		owner: user
	};
</script>

<form class="fields" {action} method="post" enctype="multipart/form-data">
	<InputField label="Type de logement">
		<InputSelectOne
			required
			name="kind"
			options={DISPLAY_APPARTMENT_KIND}
			bind:value={appartment.kind}
		/>
	</InputField>

	<div class="side-by-side">
		<InputField label="Surface">
			<InputNumber
				required
				name="surface"
				unit="m²"
				initial={initial.surface}
				bind:value={appartment.surface}
				schema={AppartmentSchema.shape.surface}
			/>
		</InputField>

		{#if appartment.kind === 'colocation'}
			<InputField label="Nb chambres">
				<InputNumber
					required
					name="roomsCount"
					initial={initial.roomsCount}
					bind:value={appartment.roomsCount}
					schema={AppartmentSchema.shape.roomsCount}
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
				schema={AppartmentSchema.shape.rent}
				required
			/>
		</InputField>

		<InputField label="Charges">
			<InputNumber
				name="charges"
				unit="€"
				initial={initial.charges}
				bind:value={appartment.charges}
				schema={AppartmentSchema.shape.charges}
				required
			/>
		</InputField>

		<InputField label="Caution">
			<InputNumber
				name="deposit"
				unit="€"
				initial={initial.deposit}
				bind:value={appartment.deposit}
				schema={AppartmentSchema.shape.deposit}
				required
			/>
		</InputField>
	</div>

	{#if appartment.kind === 'colocation'}
		<p class="typo-details">Veuillez rentrer le loyer total, pas un prix par chambre.</p>
	{/if}

	<InputField label="Date de libération">
		<InputDate
			name="availableAt"
			bind:value={appartment.availableAt}
			initial={initial.availableAt}
			required
		/>
	</InputField>

	<InputField label="Adresse" id="address">
		<InputAddress
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
			<InputCheckbox
				name="hasBicycleParking"
				bind:value={appartment.hasBicycleParking}
				label="Place pour vélo"
			/>
		</div>
	</InputField>

	<InputField label="Description">
		<InputRichText name="description" bind:value={appartment.description} />
	</InputField>

	<div class="typo-details">
		Inutile de préciser les informations suivantes dans la description:
		<ul>
			<li>Votre numéro de téléphone ou addresse mail</li>
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
	form {
		max-width: 800px;
	}
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
