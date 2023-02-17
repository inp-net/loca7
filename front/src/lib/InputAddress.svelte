<script lang="ts">
	import BaseInputText from './BaseInputText.svelte';

	export let unit: string = '';
	export let value: string;
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let initial: string | undefined = undefined;
	export let placeholder: string = '';

	let errorMessage: string = '';

	let suggestions: string[] = [];
	$: suggestions = ['aaa', 'bbb', 'ccc'];

	// TODO implement adress validation/autocompletion
</script>

<BaseInputText
	{suggestions}
	{placeholder}
	type="number"
	{unit}
	bind:value
	{id}
	{name}
	{initial}
	{errorMessage}
/>
