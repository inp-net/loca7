<script lang="ts">
	import VirtualList from 'svelte-tiny-virtual-list';
	import AppartmentAdminItem from '$lib/AppartmentAdminItem.svelte';
	import { debounce } from 'lodash';
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

	type AppartmentEdit = AppartmentEditBase & { photos: Photo[] };
	type Appartment = AppartmentBase & {
		reports: Report[];
		history: AppartmentEdit[];
		owner: User;
		photos: Photo[];
	};

	export let data: PageData;
	const categories = {
		pending: 'en attente',
		online: 'en ligne',
		archived: 'archivé'
	};
	type Status = keyof typeof categories;
	let eagerStatus: Record<string, Status> = {};
	$: appartments = data.appartments.sort(
		(a, b) => a.availableAt.valueOf() - b.availableAt.valueOf()
	);

	$: yearsAvailable = [
		...new Set(appartments.map((a) => a.updatedAt.getFullYear().toString()))
	].sort();

	const isOnline = (a: Appartment) =>
		status(eagerStatus, a) === 'online' && a.history.every((h) => h.applied);
	const isPending = (a: Appartment) =>
		status(eagerStatus, a) === 'pending' ||
		(status(eagerStatus, a) !== 'archived' && a.history.some((h) => !h.applied));
	const isArchived = (a: Appartment) => status(eagerStatus, a) === 'archived';
	const isYearSelected = (years: string[]) => (a: Appartment) =>
		years.length === 0 || years.includes(effectiveUpdatedAt(a).getFullYear().toString());

	let currentCategory: Status = 'pending';

	$: searcher = new Fuse(appartments.filter(isYearSelected(years)), {
		keys: [
			'rent',
			'charges',
			'deposit',
			'surface',
			'kind',
			'address',
			'description',
			'number',
			'owner.name',
			'owner.email',
			'owner.phone'
		],
		threshold: 0.2,
		includeMatches: true,
		shouldSort: false,
		distance: 3500, // by analysis of imported data, description character length is at most 3148, wth most below 2000. (20 apparts have more than 2k chars in description)
		useExtendedSearch: true
	});

	let byCategory: Record<Status, (Appartment & { matches: readonly Fuse.FuseResultMatch[] })[]> =
		{
			pending: [],
			archived: [],
			online: []
		};

	const appartment = (category: keyof typeof byCategory, index: number) =>
		byCategory[category][index];

	/**
	 * Last update date that also takes into account pending edits and reports
	 * @param appartment
	 */
	const effectiveUpdatedAt = (appartment: Appartment) =>
		new Date(
			Math.max(
				appartment.updatedAt.valueOf(),
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
		byCategory = {
			pending: searchResults.filter(isPending).sort(byReportsThenUpdatedAt).reverse(),
			archived: searchResults.filter(isArchived).sort(byReportsThenUpdatedAt).reverse(),
			online: searchResults.filter(isOnline).sort(byReportsThenUpdatedAt).reverse()
		};
		console.log(byCategory);
	}, 300);

	$: updateSearchResults(search, years);
	$: eagerStatus, updateSearchResults(search, years);

	let search: string = '';

	let years: string[] =
		new Date().getMonth() >= 9
			? [new Date().getFullYear().toString()]
			: [new Date().getFullYear().toString(), (new Date().getFullYear() - 1).toString()];

	let openAppartmentId: string = '';

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
		a.reports.length === b.reports.length
			? effectiveUpdatedAt(a).valueOf() - effectiveUpdatedAt(b).valueOf()
			: a.reports.length - b.reports.length;

	const setEagerStatus = (index: number, status: Status) => () => {
		let appart = appartment(currentCategory, index);
		eagerStatus[appart.id] = status;
	};
</script>

<svelte:head>
	<title>Loca7 · Administration</title>
</svelte:head>

<main>
	<section class="filters">
		<InputSelectOne options={categories} bind:value={currentCategory} />
		<div class="side-by-side">
			<InputField label="Dernière modification">
				<InputSelectMultiple options={yearsAvailable} bind:selection={years} />
			</InputField>
			<InputField label="Rechercher">
				<InputText bind:value={search} />
			</InputField>
		</div>
	</section>

	{#if currentCategory === 'pending'}
		<h2>{byCategory.pending.length || ''} en attente</h2>
	{:else if currentCategory === 'online'}
		<h2>{byCategory.online.length || ''} en ligne</h2>
	{:else}
		<h2>
			{byCategory.archived.length || ''} archivé{byCategory.archived.length > 1 ? 's' : ''}
		</h2>
	{/if}

	<ul>
		<VirtualList
			width="100%"
			height={Math.min(510, 110 * byCategory[currentCategory].length)}
			itemCount={byCategory[currentCategory].length}
			itemSize={110}
		>
			<div slot="item" let:index let:style {style}>
				<AppartmentAdminItem
					{...appartment(currentCategory, index)}
					updatedAt={effectiveUpdatedAt(appartment(currentCategory, index))}
					highlight={appartment(currentCategory, index).matches}
					approved={currentCategory !== 'pending'}
					archived={currentCategory === 'archived'}
					on:approuver={setEagerStatus(index, 'online')}
					on:archiver={setEagerStatus(index, 'archived')}
					on:publier={setEagerStatus(index, 'online')}
					open={openAppartmentId === appartment(currentCategory, index).id}
					on:close={() => (openAppartmentId = '')}
					on:open={() => (openAppartmentId = appartment(currentCategory, index).id)}
				/>
			</div>
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
		display: flex;
		gap: 2rem;
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
</style>
