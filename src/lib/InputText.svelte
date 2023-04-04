<script lang="ts">
	import { z, type ZodSchema } from 'zod';
	import BaseInputText from './BaseInputText.svelte';
	import type { Name as IconName } from './icons/types';

	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let initial: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let value: string;
	export let required: boolean = false;
	export let autocomplete: string | undefined = undefined;
	export let schema: ZodSchema = z.string();
	export let errorMessage: string | undefined = undefined;
	export let actionIcon: IconName | undefined = undefined;
	export let leftIcon: IconName | undefined = undefined;
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
	{schema}
	{placeholder}
	{required}
	{actionIcon}
	{leftIcon}
/>
