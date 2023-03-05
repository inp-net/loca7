<script lang="ts">
	import BaseInputText from './BaseInputText.svelte';

	export let value: string;
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let initial: string | undefined = undefined;
	export let placeholder: string = '';
	export let future: boolean = false;
	export let past: boolean = false;

	$: console.log(JSON.stringify(value));

	export let errorMessage: string = '';
	$: {
		if (value === null && initial == null) {
			errorMessage = '';
		} else {
			if (future && Date.parse(value) < Date.now()) {
				errorMessage = 'La date doit être dans le futur';
			} else if (past && Date.parse(value) > Date.now()) {
				errorMessage = 'La date doit être dans le passé';
			} else {
				errorMessage = '';
			}
		}
	}
</script>

<BaseInputText {placeholder} type="date" bind:value {id} {name} {initial} {errorMessage} />
