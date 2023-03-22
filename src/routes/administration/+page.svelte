<script lang="ts">
	import AppartmentAdminItem from '$lib/AppartmentAdminItem.svelte';
	import type { PageData } from './$types';
	import type { Appartment } from '$lib/types';
	import InputSelectMultiple from '$lib/InputSelectMultiple.svelte';
	import InputField from '$lib/InputField.svelte';

	export let data: PageData;
	type Status = 'pending' | 'approved' | 'archived';
	let eagerStatus: Record<string, Status> = {};
	$: appartments = data.appartments.sort(
		(a, b) => a.availableAt.valueOf() - b.availableAt.valueOf()
	);

	$: yearsAvailable = [
		...new Set(appartments.map((a) => a.updatedAt.getFullYear().toString()))
	].sort();
	let years: string[] = [];

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
			(!appartment.approved ? 'pending' : appartment.archived ? 'archived' : 'approved')
		);
	}

	const byReportsThenUpdatedAt = (a: Appartment, b: Appartment) =>
		a.reports.length === b.reports.length
			? a.updatedAt.valueOf() - b.updatedAt.valueOf()
			: a.reports.length - b.reports.length;

	$: appartmentsPending = appartments
		.filter(
			(a) =>
				status(eagerStatus, a) === 'pending' ||
				(status(eagerStatus, a) !== 'archived' && a.history.some((h) => !h.applied))
		)
		.filter((a) => years.length === 0 || years.includes(a.updatedAt.getFullYear().toString()))
		.sort(byReportsThenUpdatedAt)
		.reverse();
	$: appartmentsArchived = appartments
		.filter((a) => status(eagerStatus, a) === 'archived')
		.filter((a) => years.length === 0 || years.includes(a.updatedAt.getFullYear().toString()))
		.sort(byReportsThenUpdatedAt)
		.reverse();
	$: appartmentsOnline = appartments
		.filter((a) => status(eagerStatus, a) === 'approved' && a.history.every((h) => h.applied))
		.filter((a) => years.length === 0 || years.includes(a.updatedAt.getFullYear().toString()))
		.sort(byReportsThenUpdatedAt)
		.reverse();
</script>

<svelte:head>
	<title>Loca7 · Administration</title>
</svelte:head>

<main>
	<h1>Administration</h1>

	<section class="filters">
		<InputField label="Dernière modification">
			<InputSelectMultiple options={yearsAvailable} bind:selection={years} />
		</InputField>
	</section>

	<h2>{appartmentsPending.length || ''} en attente</h2>

	<ul>
		{#each appartmentsPending as appartment (appartment.id)}
			<AppartmentAdminItem
				{...appartment}
				approved={false}
				on:approuver={() => {
					eagerStatus[appartment.id] = 'approved';
				}}
				open={openAppartmentId === appartment.id}
				on:close={() => (openAppartmentId = '')}
				on:open={() => (openAppartmentId = appartment.id)}
			/>
		{:else}
			<li class="empty">Aucune annonce.</li>
		{/each}
	</ul>

	<h2>{appartmentsOnline.length || ''} en ligne</h2>

	<ul>
		{#each appartmentsOnline as appartment (appartment.id)}
			<AppartmentAdminItem
				{...appartment}
				approved={true}
				archived={false}
				on:archiver={() => {
					eagerStatus[appartment.id] = 'archived';
				}}
				open={openAppartmentId === appartment.id}
				on:close={() => (openAppartmentId = '')}
				on:open={() => (openAppartmentId = appartment.id)}
			/>
		{:else}
			<li class="empty">Aucune annonce.</li>
		{/each}
	</ul>

	<h2>{appartmentsArchived.length || ''} archivé{appartmentsArchived.length > 1 ? 's' : ''}</h2>

	<ul>
		{#each appartmentsArchived as appartment (appartment.id)}
			<AppartmentAdminItem
				{...appartment}
				approved={true}
				archived={true}
				on:publier={() => {
					eagerStatus[appartment.id] = 'approved';
				}}
				open={openAppartmentId === appartment.id}
				on:close={() => (openAppartmentId = '')}
				on:open={() => (openAppartmentId = appartment.id)}
			/>
		{:else}
			<li class="empty">Aucune annonce.</li>
		{/each}
	</ul>
</main>

<style>
	main {
		margin: 0 auto;
		max-width: 1200px;
	}

	section.filters {
		display: flex;
		flex-direction: column;
		align-items: center;
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
