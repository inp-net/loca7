<script lang="ts">
	import BaseInputText from './BaseInputText.svelte';
	import { z } from 'zod';

	interface Props {
		id?: string | undefined;
		name?: string | undefined;
		initial?: string | undefined;
		placeholder?: string | undefined;
		value: string;
		schema?: Zod.ZodString;
		required?: boolean;
	}

	let {
		id = undefined,
		name = undefined,
		initial = undefined,
		placeholder = undefined,
		value = $bindable(),
		schema = z.string(),
		required = false
	}: Props = $props();
</script>

<BaseInputText
	autocomplete="tel"
	type="tel"
	bind:value
	{id}
	{name}
	{initial}
	{placeholder}
	{schema}
	{required}
/>
