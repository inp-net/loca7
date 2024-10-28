<script lang="ts">
	import { z } from 'zod';
	import BaseInputText from './BaseInputText.svelte';
	import { EMAIL_REGEX } from './types';

	interface Props {
		id?: string | undefined;
		name?: string | undefined;
		initial?: string | undefined;
		placeholder?: string | undefined;
		value: string;
		unit?: string;
		suggestions?: string[] | undefined;
		required?: boolean;
		schema?: Zod.ZodString;
	}

	let {
		id = undefined,
		name = undefined,
		initial = undefined,
		placeholder = undefined,
		value = $bindable(),
		unit = '',
		suggestions = undefined,
		required = false,
		schema = z.string().regex(EMAIL_REGEX, {
			message: 'Adresse email invalide'
		})
	}: Props = $props();
</script>

<BaseInputText
	autocomplete="email"
	type="email"
	bind:value
	on:input
	{id}
	{schema}
	{name}
	{unit}
	{initial}
	{placeholder}
	{suggestions}
	{required}
/>
