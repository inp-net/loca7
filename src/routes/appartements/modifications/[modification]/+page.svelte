<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import { appartmentTitle } from '$lib/types';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Loca7 · Modification de l'appartement {appartmentTitle(data)}</title>
</svelte:head>

<main>
	<h2>Modification de l'appartement</h2>
	<pre>
        {JSON.stringify(data, null, 2)}
    </pre>
	<form method="post">
		<ButtonPrimary submits>Approuver</ButtonPrimary>
	</form>
</main>

<style>
	main {
		max-width: 600px;
		margin: 0 auto;
	}
</style>
