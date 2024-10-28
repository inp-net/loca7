<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import Icon from './Icon.svelte';
	import type { Name as IconName } from './icons/types';

	interface Props {
		id?: string;
		icon: IconName;
	}

	let { id = '', icon }: Props = $props();

	let hoverOrFocus = $state(false);
</script>

<button
	{id}
	onfocus={() => (hoverOrFocus = true)}
	onblur={() => (hoverOrFocus = false)}
	onmouseenter={() => (hoverOrFocus = true)}
	onmouseleave={() => (hoverOrFocus = false)}
	onclick={bubble('click')}
	type="button"
>
	<Icon name={icon} color={hoverOrFocus ? '#fffa' : 'bg'} />
</button>

<style>
	button {
		background: var(--fg);
		color: var(--bg);
		border-color: transparent;

		border-radius: 50%;
		height: 2rem;
		width: 2rem;
		padding: 0.25rem;

		cursor: pointer;
	}
</style>
