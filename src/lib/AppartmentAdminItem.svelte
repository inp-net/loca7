<script lang="ts">
	import type { Photo } from '@prisma/client';
	import { createEventDispatcher } from 'svelte';
	import ButtonSecondary from './ButtonSecondary.svelte';
	import Icon from './Icon.svelte';
	import { appartmentPhotoURL } from './types';
	const emit = createEventDispatcher();

	export let id: string;
	export let owner: { name: string };
	export let availableAt: Date;
	export let reports: any[];
	export let approved: boolean;
	export let address: string;
	export let rent: number;
	export let charges: number;
	export let photos: Photo[];
	let open: boolean = false;
	let error: string = '';

	const action = (name: 'archiver' | 'publier') => async () => {
		const response = await fetch(`/appartements/${id}/${name}`, { method: 'post' });
		if (response.status === 200) {
			error = '';
			emit(name);
		} else {
			error = await response.text();
		}
	};
</script>

<li class:reported={reports.length > 0} class:approved class:errored={!!error}>
	<img src={appartmentPhotoURL(photos[0])} class="photo" />
	<div
		class="row-1"
		on:click={() => {
			open = !open;
		}}
		on:keypress={(e) => {
			if (e.key === 'Enter') open = !open;
		}}
	>
		<span class="data">{id}</span>
		<span class="data">{address}</span>
		<span class="data reports">{reports.length}</span>
	</div>
	<div
		class="row-2"
		on:click={() => {
			open = !open;
		}}
		on:keypress={(e) => {
			if (e.key === 'Enter') open = !open;
		}}
	>
		<span class="data">{rent}€+{charges}€</span>
		<span class="data">{owner.name}</span>
		<span class="data"
			>{Intl.DateTimeFormat('fr-FR', { dateStyle: 'short' }).format(availableAt)}</span
		>
	</div>
	<div class="actions" class:open>
		<ButtonSecondary href="/appartements/{id}/modifier" icon="edit">Modifier</ButtonSecondary>
		{#if !approved}
			<ButtonSecondary on:click={action('publier')} icon="eye-open">Publier</ButtonSecondary>
		{:else}
			<ButtonSecondary on:click={action('archiver')} submits icon="eye-cancel"
				>{availableAt.valueOf() < Date.now() ? 'Archiver' : 'Dépublier'}</ButtonSecondary
			>
		{/if}
		<ButtonSecondary href="/appartements/{id}/supprimer" icon="delete">Suppr.</ButtonSecondary>
		<button class="collapse" on:click={() => (open = false)}>
			<Icon name="next" />
		</button>
	</div>
</li>

<style>
	li {
		padding: 0.75rem 0.5rem;
		border-bottom: 2px solid var(--muted);
	}
	li > div {
		display: grid;
		gap: 0.5rem 1rem;
	}
	li .data:last-child {
		text-align: right;
	}
	li .row-1,
	li .row-2 {
		cursor: pointer;
	}
	li .row-1 {
		grid-template-columns: 2fr 7fr 1fr;
		align-items: end;
	}
	li .row-2 {
		grid-template-columns: 2fr 5fr 3fr;
	}
	li.reported {
		background-color: var(--rose);
		color: var(--blood);
	}
	li * {
		color: inherit;
	}
	.data {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.data.reports {
		text-align: right;
	}
	.actions {
		margin-top: 0.75rem;
		/* display: grid;
        grid-template-columns: repeat(3, 1fr); */
		gap: 0.5rem;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}
	.actions :global(button) {
		background: transparent;
	}
	.collapse {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		height: 3rem;
		display: flex;
		align-items: center;
		width: 100%;
	}
	.collapse :global(svg) {
		transform: rotate(-90deg);
	}
	.photo {
		display: none;
		height: 5rem;
		width: 5rem;
		object-fit: cover;
	}
	.actions {
		overflow: hidden;
		transition: height 500ms ease;
	}
	@media (max-width: 1000px) {
		.actions:not(.open) {
			height: 0;
		}
	}

	@media (min-width: 1000px) {
		li {
			display: grid;
			grid-template-areas: 'photo row-1 actions' 'photo row-2 actions';
			/* grid-template-columns: 1fr 1fr; */
			column-gap: 2rem;
		}
		li .row-1,
		li .row-2 {
			cursor: default;
		}
		.photo {
			grid-area: photo;
			display: block;
		}
		.row-1 {
			grid-area: row-1;
		}
		.row-2 {
			grid-area: row-2;
		}
		.actions {
			grid-area: actions;
			display: flex;
			justify-content: end;
			align-items: center;
			margin-top: 0;
		}
		.actions .collapse {
			display: none;
		}
	}
</style>
