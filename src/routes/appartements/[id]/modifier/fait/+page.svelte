<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import Icon from '$lib/Icon.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Loca7 · Modifications prises en compte</title>
</svelte:head>

<main>
	<section class="icon">
		<Icon name="checkmark" />
	</section>

	<h1>Modifications prises en compte</h1>

	<p class="explain typo-paragraph">
		Vos modifications ont bien été prises en compte, et seront approuvées par un·e
		administrateur·ice.
	</p>

	<section class="back">
		<ButtonPrimary href="/appartements/{data.appartment.id}"
			>Retour à l'appartement</ButtonPrimary
		>
	</section>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	h1 {
		margin-bottom: 1rem;
	}

	section.icon {
		--fg: var(--diamond);
		height: 10rem;
	}

	section {
		margin: 4rem 0;
	}
</style>
