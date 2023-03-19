<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

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
