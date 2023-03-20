<script lang="ts">
	import AppartmentAdminItem from '$lib/AppartmentAdminItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	type Status = 'pending' | 'approved' | 'archived';
	let eagerStatus: Record<string, Status> = {};
	$: appartments = data.appartments.sort(
		(a, b) => a.availableAt.valueOf() - b.availableAt.valueOf()
	);

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

	$: appartmentsPending = appartments.filter(
		(a) =>
			status(eagerStatus, a) === 'pending' ||
			(status(eagerStatus, a) !== 'archived' && a.history.some((h) => !h.applied))
	);
	$: appartmentsArchived = appartments.filter((a) => status(eagerStatus, a) === 'archived');
	$: appartmentsOnline = appartments.filter(
		(a) => status(eagerStatus, a) === 'approved' && a.history.every((h) => h.applied)
	);
</script>

<svelte:head>
	<title>Loca7 · Administration</title>
</svelte:head>

<main>
	<h2>{appartmentsPending.length || ''} en attente</h2>

	<ul>
		{#each appartmentsPending as appartment (appartment.id)}
			<AppartmentAdminItem
				{...appartment}
				approved={false}
				on:approuver={() => {
					eagerStatus[appartment.id] = 'approved';
				}}
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
