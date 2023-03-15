<script lang="ts">
	import AppartmentAdminItem from '$lib/AppartmentAdminItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	let eagerApproved: Record<string, boolean> = {};
	$: appartments = data.appartments.sort(
		(a, b) => a.availableAt.valueOf() - b.availableAt.valueOf()
	);

	function approved(
		eagerApproved: Record<string, boolean>,
		appartment: { id: string; approved: boolean }
	): boolean {
		return eagerApproved?.[appartment.id] ?? appartment.approved;
	}

	function archived(
		eagerApproved: Record<string, boolean>,
		appartment: { id: string; approved: boolean; availableAt: Date }
	): boolean {
		return (
			!approved(eagerApproved, appartment) && appartment.availableAt.valueOf() < Date.now()
		);
	}

	$: appartmentsPending = appartments.filter(
		(a) => !archived(eagerApproved, a) && !approved(eagerApproved, a)
	);
	$: appartmentsArchived = appartments.filter(
		(a) => archived(eagerApproved, a) && !approved(eagerApproved, a)
	);
	$: appartmentsOnline = appartments.filter((a) => approved(eagerApproved, a));
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
				on:publier={() => {
					eagerApproved[appartment.id] = true;
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
				on:archiver={() => {
					eagerApproved[appartment.id] = false;
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
				approved={false}
				on:publier={() => {
					eagerApproved[appartment.id] = true;
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
