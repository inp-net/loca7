<script lang="ts">
	import { run } from 'svelte/legacy';

	import VirtualList from 'svelte-tiny-virtual-list';
	import AppartmentAdminItem from '$lib/AppartmentAdminItem.svelte';
	import { debounce } from 'lodash-es';
	import type { PageData } from './$types';
	import InputSelectMultiple from '$lib/InputSelectMultiple.svelte';
	import InputField from '$lib/InputField.svelte';
	import type {
		Appartment as AppartmentBase,
		AppartmentEdit as AppartmentEditBase,
		Photo,
		Report,
		User
	} from '@prisma/client';
	import InputText from '$lib/InputText.svelte';
	import Fuse from 'fuse.js';
	import InputSelectOne from '$lib/InputSelectOne.svelte';
	import InputSearch from '$lib/InputSearch.svelte';
	import Icon from '$lib/Icon.svelte';
	import ButtonColored from '$lib/ButtonColored.svelte';
	import ButtonCircle from '$lib/ButtonCircle.svelte';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';

	type AppartmentEdit = AppartmentEditBase & { photos: Photo[] };
	type Appartment = AppartmentBase & {
		reports: Report[];
		history: AppartmentEdit[];
		owner: User;
		photos: Photo[];
	};

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	const categories = {
		pending: 'en attente',
		reported: 'signalée',
		online: 'en ligne',
		archived: 'archivée',
		all: 'toutes'
	};
	type Status = keyof typeof categories;
	let eagerStatus: Record<string, Status> = $state({});

	const isOnline = (a: Appartment) =>
		status(eagerStatus, a) === 'online' && a.history.every((h) => h.applied);
	const isPending = (a: Appartment) =>
		status(eagerStatus, a) === 'pending' || a.history.some((h) => !h.applied);
	const isArchived = (a: Appartment) => status(eagerStatus, a) === 'archived';
	const isReported = (a: Appartment) => a.reports.length > 0 && !isArchived(a);
	const isYearSelected = (years: string[]) => (a: Appartment) =>
		years.length === 0 || years.includes(effectiveUpdatedAt(a).getFullYear().toString());

	let currentCategory: Status = $state('pending');

	let byCategory: Record<Status, (Appartment & { matches: readonly Fuse.FuseResultMatch[] })[]> =
		$state({
			pending: [],
			archived: [],
			online: [],
			reported: [],
			all: []
		});

	const appartment = (category: keyof typeof byCategory, index: number) =>
		byCategory[category][index];

	/**
	 * Last update date that also takes into account pending edits and reports
	 * @param appartment
	 */
	const effectiveUpdatedAt = (appartment: Appartment) =>
		new Date(
			Math.max(
				appartment.createdAt.valueOf(),
				...appartment.reports.map((r) => r.createdAt.valueOf()),
				...appartment.history.map((h) => h.createdAt.valueOf())
			)
		);

	const updateSearchResults = debounce((search: string, years: string[]) => {
		let searchResults: (typeof byCategory)['archived'] = [];
		if (search) {
			searchResults = searcher
				.search(search)
				.map((r) => ({ ...r.item, matches: r.matches ?? [] }));
		} else {
			searchResults = appartments
				.filter(isYearSelected(years))
				.map((a) => ({ ...a, matches: [] }));
		}
		let all = searchResults.sort(byReportsThenUpdatedAt).reverse();
		byCategory = {
			pending: all.filter(isPending),
			archived: all.filter(isArchived),
			online: all.filter(isOnline),
			reported: all.filter(isReported),
			all
		};
	}, 300);

	let search: string = $state('');

	let years: string[] = $state(
		new Date().getMonth() >= 9
			? [new Date().getFullYear().toString()]
			: [new Date().getFullYear().toString(), (new Date().getFullYear() - 1).toString()]
	);

	let openAppartmentId: string = $state('');

	function status(
		eagerStatus: Record<string, Status>,
		appartment: {
			id: string;
			approved: boolean;
			archived: boolean;
		}
	): Status {
		return (
			eagerStatus?.[appartment.id] ??
			(!appartment.approved ? 'pending' : appartment.archived ? 'archived' : 'online')
		);
	}

	const byReportsThenUpdatedAt = (
		a: { reports: Report[]; updatedAt: Date },
		b: { reports: Report[]; updatedAt: Date }
	) =>
		// don't sort by number of reports first in archived tab
		currentCategory === 'archived' || a.reports.length === b.reports.length
			? effectiveUpdatedAt(a).valueOf() - effectiveUpdatedAt(b).valueOf()
			: a.reports.length - b.reports.length;

	const setEagerStatus = (index: number, status: Status) => () => {
		let appart = appartment(currentCategory, index);
		eagerStatus[appart.id] = status;
	};

	let selection: string[] = $state([]);
	let confirmingBulkDelete = $state(false);
	let appartments = $derived(
		data.appartments.sort((a, b) => a.availableAt.valueOf() - b.availableAt.valueOf())
	);
	let yearsAvailable = $derived(
		[...new Set(appartments.map((a) => effectiveUpdatedAt(a).getFullYear().toString()))].sort()
	);
	let searcher = $derived(
		new Fuse(appartments.filter(isYearSelected(years)), {
			keys: [
				'rent',
				'charges',
				'deposit',
				'surface',
				'kind',
				'address',
				'description',
				'number',
				'owner.firstName',
				'owner.lastName',
				'owner.email',
				'owner.phone',
				'owner.agencyName',
				'owner.agencyWebsite'
			],
			threshold: 0.2,
			includeMatches: true,
			shouldSort: false,
			distance: 3500, // by analysis of imported data, description character length is at most 3148, wth most below 2000. (20 apparts have more than 2k chars in description)
			useExtendedSearch: true
		})
	);
	run(() => {
		updateSearchResults(search, years);
	});
	run(() => {
		eagerStatus, updateSearchResults(search, years);
	});
</script>

<svelte:head>
	<title>Loca7 · Administration</title>
</svelte:head>

<main>
	<section class="filters">
		<InputSelectOne
			options={Object.fromEntries(
				Object.entries(categories).map(([k, v]) => [
					k,
					{ reported: 'signalées', archived: 'archivées' }?.[k] ?? v
				])
			)}
			bind:value={currentCategory}
		>
			{#snippet children({ display, option })}
				{display}
				{#if option === 'pending'}
					<span class="pill" data-done={byCategory.pending.length === 0}
						>{byCategory.pending.length}
					</span>
				{:else if option === 'reported'}
					<span class="pill danger" data-done={byCategory.reported.length === 0}
						>{byCategory.reported.length}
					</span>
				{/if}
			{/snippet}
		</InputSelectOne>
		<div class="side-by-side">
			<InputField label="Dernière modification">
				<InputSelectMultiple options={yearsAvailable} bind:selection={years} />
			</InputField>
			<InputField label="Rechercher">
				<InputSearch bind:search />
			</InputField>
		</div>
	</section>

	<section class="bulk-actions" class:danger={confirmingBulkDelete}>
		{#if confirmingBulkDelete}
			<p>
				Êtes-vous sûr·e de vouloir <strong
					>supprimer {selection.length} annonce{selection.length > 1 ? 's' : ''}</strong
				> ? Cette action n'est pas réversible.
			</p>
			<ButtonColored
				dangerous
				on:click={async () => {
					await Promise.all(
						selection.map(async (id) => {
							await fetch(`/appartements/${id}/supprimer?/confirm`, {
								method: 'POST',
								body: new FormData()
							});
						})
					);
					confirmingBulkDelete = false;
					window.location.reload();
				}}>Confirmer</ButtonColored
			>
		{:else if selection.length > 0}
			<p>{selection.length} sélectionnée{selection.length > 1 ? 's' : ''}</p>
			<ButtonColored
				on:click={async () => {
					await Promise.all(
						selection.map(async (id) => {
							await fetch(`/appartements/${id}/archiver`, { method: 'POST' });
						})
					);
					window.location.reload();
				}}
				>Archiver
			</ButtonColored>
			{#if currentCategory !== 'online'}
				<ButtonColored
					on:click={async () => {
						await Promise.all(
							selection.map(async (id) => {
								await fetch(`/appartements/${id}/approuver`, { method: 'POST' });
								await fetch(`/appartements/${id}/publier`, { method: 'POST' });
							})
						);
						window.location.reload();
					}}
					>Valider & publier
				</ButtonColored>
			{/if}
			<ButtonColored
				dangerous
				on:click={() => {
					confirmingBulkDelete = true;
				}}
				>Supprimer
			</ButtonColored>
			<div class="close">
				<ButtonCircle
					on:click={() => {
						selection = [];
					}}
					icon="close"
				/>
			</div>
		{:else}
			<p>Aucune annonce sélectionnée</p>
			<ButtonColored
				on:click={() => {
					selection = byCategory[currentCategory].map((a) => a.id);
				}}>Tout sélectionner</ButtonColored
			>
		{/if}
	</section>

	<ul>
		<VirtualList
			width="100%"
			height={Math.min(610, 110 * byCategory[currentCategory].length)}
			itemCount={byCategory[currentCategory].length}
			itemSize={110}
		>
			{#snippet item({ index, style })}
				<div {style}>
					<AppartmentAdminItem
						{...appartment(currentCategory, index)}
						selected={selection.includes(appartment(currentCategory, index).id)}
						on:select={() => {
							selection = [...selection, appartment(currentCategory, index).id];
						}}
						on:deselect={() => {
							selection = selection.filter(
								(id) => id !== appartment(currentCategory, index).id
							);
						}}
						updatedAt={effectiveUpdatedAt(appartment(currentCategory, index))}
						highlight={appartment(currentCategory, index).matches}
						approved={status(eagerStatus, appartment(currentCategory, index)) !==
							'pending'}
						archived={status(eagerStatus, appartment(currentCategory, index)) ===
							'archived'}
						on:approuver={setEagerStatus(index, 'online')}
						on:archiver={setEagerStatus(index, 'archived')}
						on:publier={setEagerStatus(index, 'online')}
						open={openAppartmentId === appartment(currentCategory, index).id}
						on:close={() => (openAppartmentId = '')}
						on:open={() => (openAppartmentId = appartment(currentCategory, index).id)}
					/>
				</div>
			{/snippet}
		</VirtualList>

		{#if byCategory[currentCategory].length <= 0}
			<li class="empty">Aucun appartment {categories[currentCategory]}.</li>
		{/if}
	</ul>
</main>

<style>
	main {
		margin: 0 auto;
		max-width: 1200px;
		width: 100%;
	}

	section.filters {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 auto;
		gap: 1rem;
	}

	section.filters .side-by-side {
		margin-top: 1rem;
		display: flex;
		gap: 2rem;
		flex-wrap: wrap;
	}

	h1 {
		text-align: center;
		margin-bottom: 3rem;
	}

	li.empty {
		text-align: center;
	}

	h2 {
		text-align: center;
		margin-top: 3rem;
		margin-bottom: 1.5rem;
	}

	ul {
		list-style: none;
		padding-left: 0;
	}

	:global(.pill) {
		margin-left: 0.5rem;
		font-family: var(--font-mono);
		font-weight: bold;
		background: var(--gold);
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: black;
		padding: 0 0.5rem;
		border-radius: 100000px;
	}

	:global(.pill.danger) {
		background: var(--mushroom);
		color: #fff;
	}

	:global(.pill svg) {
		padding: 0.15rem 0;
		height: 1.2rem;
	}

	:global([aria-current='true'] .pill) {
		--fg: var(--diamond);
		background: black;
		color: var(--diamond);
	}

	:global(label:not([aria-current='true']) .pill[data-done='true']) {
		--fg: black;
		background: var(--acid);
		color: black;
	}

	.bulk-actions {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 1rem 0;
	}

	.bulk-actions .close {
		margin-left: auto;
	}

	@media (max-width: 1000px) {
		.bulk-actions {
			display: none;
		}
		section.filters {
			margin-bottom: 2rem;
		}
	}
</style>
