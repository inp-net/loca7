<script lang="ts">
	import type { Appartment, Photo } from '@prisma/client';
	import { createEventDispatcher } from 'svelte';
	import ButtonSecondary from './ButtonSecondary.svelte';
	import type Fuse from 'fuse.js';
	import Icon from './Icon.svelte';
	import { addToast } from './toasts';
	import { photoURL } from './photos';
	import type { AppartmentEdit } from './types';
	import HighlightedText from './HighlightedText.svelte';
	import SmallCheckbox from './SmallCheckbox.svelte';
	const emit = createEventDispatcher();

	export let number: number;
	export let owner: { firstName: string; lastName: string };
	export let updatedAt: Date;
	export let reports: any[];
	export let approved: boolean;
	export let address: string;
	export let rent: number;
	export let charges: number;
	export let archived: boolean;
	export let history: AppartmentEdit[];
	export let photos: Photo[];
	export let highlight: readonly Fuse.FuseResultMatch[] = [];
	export let open: boolean = false;
	export let selected: boolean = false;
	let error: string = '';

	const action = (name: 'archiver' | 'publier' | 'approuver') => async () => {
		const response = await fetch(`/appartements/${number}/${name}`, { method: 'post' });
		if (response.status === 200) {
			emit(name);
		} else {
			addToast('error', (await response.json())?.message || 'Une erreur est survenue');
		}
		open = false;
		emit('close');
	};

	const indices = (key: string, highlight: readonly Fuse.FuseResultMatch[]) =>
		highlight.filter((h) => h.key === key).flatMap((h) => h.indices);
</script>

<li class:reported={reports.length > 0} class:approved class:open class:selected>
	<div class="select">
		<SmallCheckbox
			value={selected}
			on:change={({ target }) => {
				if (target?.checked) {
					emit('select');
				} else {
					emit('deselect');
				}
			}}
		/>
	</div>
	<img src={photos.length > 0 ? photoURL(photos[0]) : '/missing-photo.png'} class="photo" />
		<svelte:element
			this={window.innerWidth > 1000 ? 'a' : 'div'}
			href="/appartements/{number}"
			class="row-1"
			on:click={() => {
				open = !open;
				emit(open ? 'open' : 'close');
			}}
			on:keypress={(e) => {
				if (e.key === 'Enter') {
					open = !open;
					emit(open ? 'open' : 'close');
				}
			}}
		>
			<span class="data"
				>#<HighlightedText indices={indices('number', highlight)}>{number}</HighlightedText
				></span
			>
			<span class="data"
				><HighlightedText indices={indices('address', highlight)}>{address}</HighlightedText
				></span
			>
			<span class="data reports">{reports.length}</span>
		</svelte:element>
		<svelte:element
			this={window.innerWidth > 1000 ? 'a' : 'div'}
			href="/appartements/{number}"
			class="row-2"
			on:click={() => {
				open = !open;
				emit(open ? 'open' : 'close');
			}}
			on:keypress={(e) => {
				if (e.key === 'Enter') {
					open = !open;
					emit(open ? 'open' : 'close');
				}
			}}
		>
			<span class="data"
				><HighlightedText indices={indices('rent', highlight)}>{rent}</HighlightedText>€ + <HighlightedText
					indices={indices('charges', highlight)}>{charges}</HighlightedText
				>€</span
			>
			<span class="data"
				><HighlightedText indices={indices('owner.firstName', highlight)}
					>{owner.firstName}
				</HighlightedText>
				<HighlightedText indices={indices('owner.lastName', highlight)}
					>{owner.lastName.toUpperCase()}</HighlightedText
				>
			</span>
			<span class="data"
				>{Intl.DateTimeFormat('fr-FR', { dateStyle: 'short' }).format(updatedAt)}</span
			>
		</svelte:element>
	<div class="actions" class:open>
		{#if history.some((h) => !h.applied)}
			<ButtonSecondary href="/appartements/{number}#modifications" icon="editor-list"
				>Modifications</ButtonSecondary
			>
		{:else if archived}
			<ButtonSecondary on:click={action('publier')} icon="eye-open">Publier</ButtonSecondary>
		{:else if !approved}
			<ButtonSecondary on:click={action('approuver')} icon="checkmark"
				>Valider</ButtonSecondary
			>
		{:else}
			<ButtonSecondary on:click={action('archiver')} submits icon="eye-cancel"
				>Archiver</ButtonSecondary
			>
		{/if}
		{#if approved && !archived}
			<ButtonSecondary href="/appartements/{number}/modifier" icon="edit"
				>Modifier</ButtonSecondary
			>
		{:else}
			<ButtonSecondary href="/appartements/{number}" icon="add">Voir</ButtonSecondary>
		{/if}
		<ButtonSecondary href="/appartements/{number}/supprimer" icon="delete"
			>Suppr.</ButtonSecondary
		>
	</div>
	<button
		class:open
		class="collapse"
		on:click={() => {
			open = false;
			emit('close');
		}}
	>
		<Icon name="next" />
	</button>
</li>

<style>
	li {
		--background: var(--bg);
		border-bottom: 2px solid var(--muted);
		background: var(--background);
		padding: 0.75rem 0.5rem;
	}
	li.reported:not(.selected) {
		/* using only --bg does not work on .collapse for some reason, but using only --background does not allowing overriding the background color of the action buttons, since they use var(--bg) */
		--background: var(--rose);
		--bg: var(--rose);
		color: var(--blood);
	}
	li.selected {
		--background: var(--ice);
		--bg: var(--ice);
	}
	li.open {
		position: relative;
		z-index: 10;
	}
	li [class^='row'] {
		display: grid;
		gap: 0.5rem 1rem;
	}
	li .data:last-child {
		text-align: right;
	}
	li .row-1,
	li .row-2 {
		cursor: pointer;
		align-items: start;
		justify-content: start;
	}
	li .row-1 {
		grid-template-columns: 2fr 9fr 1fr;
		align-items: end;
	}
	li .row-2 {
		grid-template-columns: 2fr 7fr 3fr;
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
		background: var(--background);
		color: var(--fg);
	}
	.collapse {
		background: var(--background);
		border: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		height: 3rem;
		display: flex;
		align-items: center;
		width: 100%;
	}

	.photo {
		display: none;
		height: 5rem;
		width: 5rem;
		object-fit: cover;
	}
	.actions.open,
	.collapse.open {
		opacity: 1;
	}
	.actions,
	.collapse {
		overflow: hidden;
		transition: all 50ms ease;
	}
	.collapse :global(svg) {
		transform: rotate(-90deg);
		height: 3rem;
	}

	@media (max-width: 1000px) {
		.actions:not(.open),
		.collapse:not(.open) {
			height: 0;
			opacity: 0;
		}
		.select {
			display: none;
		}
	}

	@media (min-width: 1000px) {
		li {
			display: grid;
			grid-template-areas: 'checkbox photo row-1 actions' 'checkbox photo row-2 actions';
			grid-template-columns: 0.5fr 1.5fr 10fr 6fr;
			column-gap: 1rem;
		}
		.select {
			grid-area: checkbox;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
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
		.collapse {
			display: none;
		}
	}
</style>
