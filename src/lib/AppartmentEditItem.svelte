<script lang="ts">
	import Icon from './Icon.svelte';
	import { photoURL } from './photos';
	import type { Appartment, AppartmentEdit, Photo, User } from './types';
	import htmldiff from 'node-htmldiff';
	import InputField from './InputField.svelte';
	import ButtonSecondary from './ButtonSecondary.svelte';

	export let current: Appartment;
	export let edit: AppartmentEdit;
	export let user: User;

	const editableFields: Record<keyof Appartment & keyof AppartmentEdit, string> = {
		address: 'Adresse',
		latitude: 'Latitude',
		longitude: 'Longitude',
		availableAt: 'Disponible au',
		rent: 'Loyer',
		charges: 'Charges',
		deposit: 'Caution',
		hasFurniture: 'Meublé',
		hasParking: 'Parking',
		kind: 'Type',
		roomsCount: 'Nombre de chambres',
		surface: 'Surface',
		// createdAt: 'Créé le',
		description: 'Description'
		// id: 'ID',
		// photos: 'Photos',
	};

	function modified(field: keyof Appartment & keyof AppartmentEdit): boolean {
		if (field === 'photos') {
			const serialize = (ps: Photo[]) =>
				JSON.stringify(
					ps.map((p) => ({
						contentType: p.contentType,
						filename: p.filename,
						hash: p.hash,
						position: p.position
					}))
				);
			return serialize(current.photos) !== serialize(edit.photos);
		}
		if (current[field] instanceof Date) {
			return current[field]?.valueOf() !== edit[field]?.valueOf();
		}
		return current[field] !== edit[field];
	}

	function display(
		value: string | number | Date | boolean | null,
		field: keyof Appartment & keyof AppartmentEdit
	) {
		switch (typeof value) {
			case 'number':
				return (
					value +
					(field === 'surface'
						? ' m²'
						: ['charges', 'rent', 'deposit'].includes(field)
						? '€'
						: '')
				);

			case 'boolean':
				return value
					? '<span class="boolean-true">Oui</span>'
					: '<span class="boolean-false">Non</span>';
			default:
				if (value instanceof Date) {
					return Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(value);
				}
				return value?.toString() ?? '';
		}
	}

	function modification(field: keyof Appartment & keyof AppartmentEdit): string {
		return htmldiff(display(current[field], field), display(edit[field], field));
	}
</script>

<li class="edit-item" class:applied={edit.applied}>
	<p class="date typo-field-label">
		{Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(
			edit.appliedAt ?? edit.createdAt
		)}
	</p>

	<ul class="modifications">
		{#if modified('photos')}
			<li class="photos">
				<span class="label">Photos</span>
				<div class="before">
					{#each current.photos.sort((a, b) => a.position - b.position) as photo (photo.position)}
						<img src={photoURL(photo)} />
					{/each}
				</div>
				<div class="arrow">
					<Icon name="next" />
				</div>
				<div class="after">
					{#each edit.photos.sort((a, b) => a.position - b.position) as photo (photo.position)}
						<img src={photoURL(photo)} />
					{/each}
				</div>
			</li>
		{/if}
		{#each Object.keys(editableFields).filter(modified) as modifiedFieldName}
			<li>
				<span class="label">{editableFields[modifiedFieldName]}</span>
				{@html modification(modifiedFieldName)}
			</li>
		{/each}
	</ul>

	<section class="actions">
		{#if !edit.applied || user?.admin}
			<form action="/appartements/modifications/{edit.id}?/delete" method="post">
				<ButtonSecondary
					icon={!edit.applied && user?.admin ? 'close' : 'delete'}
					dangerous={!edit.applied}
					submits
				>
					{#if edit.applied}
						Supprimer de l'historique
					{:else if user?.admin}Rejeter{:else}Annuler la demande{/if}
				</ButtonSecondary>
			</form>
		{/if}
		{#if !edit.applied && user?.admin}
			<form action="/appartements/modifications/{edit.id}?/apply" method="post">
				<ButtonSecondary icon="checkmark" submits>Appliquer</ButtonSecondary>
			</form>
		{/if}
	</section>
</li>

<style>
	li.edit-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem;
		border-radius: 1rem;
		border: var(--border-width) solid var(--fg);
	}
	.date {
		text-align: center;
		margin-bottom: 1rem;
	}
	.arrow {
		height: 2rem;
	}
	ul.modifications {
		list-style: none;
		padding-left: 0;
		display: flex;
		flex-direction: column;
	}
	ul.modifications li .label {
		margin-right: 1rem;
	}
	.photos {
		display: flex;
		align-items: center;
	}
	.photos img {
		width: 4rem;
		height: 4rem;
		object-fit: contain;
	}
	section.actions {
		margin-top: 1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
</style>
