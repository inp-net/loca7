<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { z } from 'zod';
	import BaseInputText from './BaseInputText.svelte';
	const emit = createEventDispatcher();

	export let search: string;

    // TODO add clear button
</script>

<BaseInputText
	type="text"
	leftIcon="search"
	schema={z.string()}
	bind:value={search}
	on:input
/>
