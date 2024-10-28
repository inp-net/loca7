<script lang="ts">
	import { z } from 'zod';
	import BaseInputText from './BaseInputText.svelte';

	interface Props {
		value: Date | null;
		id?: string | undefined;
		name?: string | undefined;
		initial?: Date | undefined;
		placeholder?: string;
		required?: boolean;
		schema?: Zod.ZodDate;
	}

	let {
		value = $bindable(),
		id = undefined,
		name = undefined,
		initial = undefined,
		placeholder = '',
		required = false,
		schema = z.date()
	}: Props = $props();
</script>

<BaseInputText {placeholder} type="date" bind:value {id} {name} {initial} {schema} {required} />
