<script lang="ts">
	import BaseInputText from './BaseInputText.svelte';

	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let initial: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
	export let value: string;
</script>

<BaseInputText type="text" bind:value {id} {name} {initial} {placeholder} />
