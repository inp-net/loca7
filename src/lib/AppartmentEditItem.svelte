<script lang="ts">
	import Icon from './Icon.svelte';
	import { photoURL } from './photos';
	import type { Photo, User } from './types';
	import ButtonSecondary from './ButtonSecondary.svelte';
	import * as appartmentDiff from './appartmentDiff';
	import { EDITABLE_FIELDS } from './appartmentDiff';
	import type { AppartmentEdit, Appartment } from '@prisma/client';

	interface Props {
		current: Appartment;
		edit: AppartmentEdit;
		user: User;
	}

	let { current, edit, user }: Props = $props();

	const modified = (field) => appartmentDiff.modified(field, current, edit);
	const modification = (field) => appartmentDiff.modification(field, current, edit);
</script>

<li class="edit-item" id="edit-{edit.id}" class:applied={edit.applied}>
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
		{#each Object.keys(EDITABLE_FIELDS)
			.filter((f) => f !== 'photos')
			.filter(modified) as modifiedFieldName}
			<li>
				<span class="label">{EDITABLE_FIELDS[modifiedFieldName]}</span>
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
