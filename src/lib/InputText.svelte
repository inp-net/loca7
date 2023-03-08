<script lang="ts">
	import BaseInputText from './BaseInputText.svelte';

	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let initial: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let value: string;
	export let required: boolean = false;
	export let autocomplete: string | undefined = undefined;
	export let errorMessage: string = '';
</script>

<BaseInputText
	type="text"
	bind:value
	on:input
	{id}
	{autocomplete}
	{name}
	{initial}
	{errorMessage}
	{placeholder}
	{required}
/>
