<script lang="ts">
	import { applyAction } from '$app/forms';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import FormEditAppartment from '$lib/FormEditAppartment.svelte';
	import type { User } from '@prisma/client';
	import type { LayoutData } from '../$types';

	export let data: LayoutData;
	let user: User = data.user!;
	const initialAppartment = data.appartment;
	let appartment = { ...initialAppartment };
	let allEmails = data.allEmails;
</script>

<svelte:head>
	<title>Loca7 · Modification d'une annonce</title>
</svelte:head>

<main>
	<h1>Modification d'une annonce</h1>
	<p>La modification sera validée par un·e administrateur·ice avant d’être publiée</p>
	<FormEditAppartment
		{user}
		owner={initialAppartment.owner}
		{allEmails}
		action="?/edit"
		bind:appartment
		initial={initialAppartment}
		submitText="Modifier"
	/>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h1,
	p {
		text-align: center;
	}

	h1 + p {
		margin-bottom: 2rem;
	}
</style>
