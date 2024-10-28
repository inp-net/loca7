<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { z } from 'zod';
	import BaseInputText from './BaseInputText.svelte';
	const emit = createEventDispatcher();

	interface Props {
		search: string;
	}

	let { search = $bindable() }: Props = $props();

	// TODO add clear button
</script>

<BaseInputText
	on:keyup={(e) => {
		if (e.key === 'Enter') {
			e?.target?.blur();
		}
	}}
	type="search"
	leftIcon="search"
	schema={z.string()}
	bind:value={search}
	on:input
/>
