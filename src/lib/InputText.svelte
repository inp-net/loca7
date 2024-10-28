<script lang="ts">
	import { z, type ZodSchema } from 'zod';
	import BaseInputText from './BaseInputText.svelte';
	import type { Name as IconName } from './icons/types';

	interface Props {
		id?: string | undefined;
		name?: string | undefined;
		initial?: string | undefined;
		placeholder?: string | undefined;
		value: string;
		required?: boolean;
		autocomplete?: string | undefined;
		schema?: ZodSchema;
		errorMessage?: string | undefined;
		messageIsWarning?: boolean;
		actionIcon?: IconName | undefined;
		leftIcon?: IconName | undefined;
	}

	let {
		id = undefined,
		name = undefined,
		initial = undefined,
		placeholder = undefined,
		value = $bindable(),
		required = false,
		autocomplete = undefined,
		schema = z.string(),
		errorMessage = undefined,
		messageIsWarning = false,
		actionIcon = undefined,
		leftIcon = undefined
	}: Props = $props();
</script>

<BaseInputText
	type="text"
	bind:value
	on:input
	on:action
	{id}
	{autocomplete}
	{name}
	{initial}
	{errorMessage}
	{messageIsWarning}
	{schema}
	{placeholder}
	{required}
	{actionIcon}
	{leftIcon}
/>
