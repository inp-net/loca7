<script lang="ts">
	import BaseInputText from './BaseInputText.svelte';

	export let value: Date | null;
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let initial: Date | undefined = undefined;
	export let placeholder: string = '';
	export let future: boolean = false;
	export let past: boolean = false;
	export let required: boolean = false;
	export let showEmptyErrors: boolean = true;

	let dateString: string = value ? value.toISOString().split('T')[0] : '';
	$: value = dateString ? new Date(dateString) : null;

	let initialString: string;
	$: initialString = initial ? initial.toISOString().split('T')[0] : '';

	export let errorMessage: string = '';
	$: {
		if (value === null && showEmptyErrors && required) {
			errorMessage = 'Ce champ est requis';
		} else if (value !== null) {
			if (future && value.valueOf() < Date.now()) {
				errorMessage = 'La date doit être dans le futur';
			} else if (past && value.valueOf() > Date.now()) {
				errorMessage = 'La date doit être dans le passé';
			} else {
				errorMessage = '';
			}
		} else {
			errorMessage = '';
		}
	}
</script>

<BaseInputText
	{placeholder}
	type="date"
	bind:value={dateString}
	{id}
	{name}
	initial={initialString}
	{errorMessage}
	{required}
/>
