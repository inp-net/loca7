<script lang="ts">
	import BaseInputText from './BaseInputText.svelte';

	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let initial: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let value: string;
	export let required: boolean = false;
	export let errorMessage: string = '';
</script>

<BaseInputText
	autocomplete="email"
	type="email"
	bind:value
	on:input
	{id}
	{errorMessage}
	{name}
	{initial}
	{placeholder}
	{required}
/>
