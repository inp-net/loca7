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
		type WithUndefinableProperties,
		createGhostEmail
	} from './types';
	import InputText from './InputText.svelte';
	import { tooltip } from './tooltip';
	import InputEmail from './InputEmail.svelte';
	import Fuse from 'fuse.js';
	import Icon from './Icon.svelte';
	import { MAX_PHOTO_SIZE_BYTES } from './constants';

	export let appartment: Appartment;
	export let action: string | undefined = undefined;
	export let submitText: string = 'Confirmer';
	export let user: User;
	export let allEmails: string[] = [];
	export let owner: User = user;
	/*@ts-ignore*/
	export let initial: WithUndefinableProperties<Appartment> = {
		...EMPTY_APPARTMENT
	};

	const emailSearcher = new Fuse(allEmails, {
		shouldSort: true,
		distance: Math.max(...allEmails.map((e) => e.length)),
		useExtendedSearch: true
	});

	let ownerCreationMode: 'vide' | 'nouveau' | 'existant' = 'vide';
	$: ownerCreationMode =
		owner.email === '' ? 'vide' : allEmails.includes(owner.email) ? 'existant' : 'nouveau';
</script>

<form class="fields" {action} method="post" enctype="multipart/form-data">
	{#if user?.admin}
		<section class="owner">
			<h2>Propriétaire</h2>
			<InputField label="Email">
				<InputEmail
					suggestions={emailSearcher.search(owner.email || '').map((r) => r.item)}
					name="ownerEmail"
					bind:value={owner.email}
					unit={ownerCreationMode}
				/>
			</InputField>
			<div class="explanation">
				{#if ownerCreationMode === 'vide'}
					Le compte du propriétaire sera créé avec les informations fournies, mais sans
					addresse e-mail utilisable <span
						class="help"
						use:tooltip={`de la forme ` +
							createGhostEmail(owner.firstName, owner.lastName, 'XXX')}
						><Icon name="question" />
					</span>
				{:else if ownerCreationMode === 'existant'}
					Cette annonce sera reliée au propriétaire {owner.email}
				{:else}
					Le compte du propriétaire sera créé avec les informations fournies
				{/if}
			</div>
			{#if ownerCreationMode !== 'existant'}
				<div class="side-by-side owner-creation">
					<InputField label="Prénom">
						<InputText
							autocomplete="given-name"
							name="ownerFirstName"
							bind:value={owner.firstName}
						/>
					</InputField>
					<InputField label="Nom de famille">
						<InputText
							autocomplete="family-name"
							name="ownerLastName"
							bind:value={owner.lastName}
						/>
					</InputField>
					<InputField label="Téléphone">
						<InputText name="ownerPhone" bind:value={owner.phone} />
					</InputField>
				</div>
				<div class="side-by-side owner-creation">
					<InputField label="Nom de l'agence">
						<InputText
							autocomplete="organization"
							name="ownerAgencyName"
							bind:value={owner.agencyName}
						/>
					</InputField>
					<InputField label="Site internet">
						<InputText
							autocomplete="url"
							name="ownerAgencyWebsite"
							bind:value={owner.agencyWebsite}
						/>
					</InputField>
				</div>
			{/if}
		</section>
		<h2>Annonce</h2>
	{/if}
	<InputField label="Type de logement" required>
		<InputSelectOne
			required
			name="kind"
			options={DISPLAY_APPARTMENT_KIND}
			bind:value={appartment.kind}
		/>
	</InputField>

	<div class="side-by-side">
		<InputField label="Surface" required>
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
			<InputField label="Nb chambres" required>
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
		<InputField label="Loyer" required>
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
			/>
		</InputField>

		<InputField label="Caution">
			<InputNumber
				name="deposit"
				unit="€"
				initial={initial.deposit}
				bind:value={appartment.deposit}
				schema={AppartmentSchema.shape.deposit}
			/>
		</InputField>
	</div>

	{#if appartment.kind === 'colocation'}
		<p class="typo-details">Veuillez rentrer le loyer total, pas un prix par chambre.</p>
	{/if}

	<InputField label="Date de libération" required>
		<InputDate
			name="availableAt"
			bind:value={appartment.availableAt}
			initial={initial.availableAt}
			required
		/>
	</InputField>

	<InputField label="Adresse" id="address" required>
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

	<InputField label="Critères">
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
			<InputCheckbox
				name="hasFiberInternet"
				bind:value={appartment.hasFiberInternet}
				label="Fibre optique"
			/>
			<InputCheckbox
				name="hasElevator"
				bind:value={appartment.hasElevator}
				label="Ascenseur"
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
		<InputImages
			name="photos"
			appartmentId={appartment.id}
			bind:value={appartment.photos}
			sizeLimit={MAX_PHOTO_SIZE_BYTES}
		/>
	</InputField>

	<p class="explain-validation">
		{#if action === '?/edit'}La modification{:else}L'annonce{/if} sera validée par un·e administrateur·ice
		avant d’être publiée
	</p>

	<section class="submit">
		<ButtonPrimary submits>{submitText}</ButtonPrimary>
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

	@media (max-width: 600px) {
		.side-by-side {
			flex-wrap: wrap;
		}
	}

	.wrap {
		/*display: flex;*/
		display: grid;
		grid-template-columns: repeat(auto-fill, 12em);
		align-items: center;
		justify-content: start;
		row-gap: 1rem;
		/*gap: 1rem;*/
		flex-wrap: wrap;
	}

	.owner {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.owner .explanation {
		max-width: 600px;
	}

	.fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.explain-validation {
		margin-top: 2rem;
		text-align: center;
	}

	.submit {
		flex-direction: column;
		justify-content: center;
		text-align: center;
		gap: 1rem;
	}

	.help {
		display: inline-block;
		height: 1em;
	}
</style>
