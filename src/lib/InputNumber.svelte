<script lang="ts">
	import { z } from 'zod';
	import BaseInputText from './BaseInputText.svelte';

	interface Props {
		unit?: string;
		value: number | undefined;
		id?: string | undefined;
		name?: string | undefined;
		initial?: number | undefined;
		placeholder?: string;
		closeKeyboardOnEnter?: boolean;
		schema?: Zod.ZodSchema;
		required?: boolean;
	}

	let {
		unit = '',
		value = $bindable(),
		id = undefined,
		name = undefined,
		initial = undefined,
		placeholder = '',
		closeKeyboardOnEnter = false,
		schema = z.number(),
		required = false
	}: Props = $props();
</script>

<BaseInputText
	{placeholder}
	type="number"
	{unit}
	bind:value
	{id}
	{name}
	{initial}
	{schema}
	{required}
	{closeKeyboardOnEnter}
/>
