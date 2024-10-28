<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		id?: string;
		dangerous?: boolean;
		warns?: boolean;
		successful?: boolean;
		href?: string;
		children?: import('svelte').Snippet;
	}

	let {
		id = '',
		dangerous = false,
		warns = false,
		successful = false,
		href = '',
		children
	}: Props = $props();

	const backgroundColor = dangerous ? 'rose' : warns ? 'plaster' : successful ? 'moss' : 'ice';
	const foregroundColor = dangerous
		? 'blood'
		: warns
			? 'safran'
			: successful
				? 'cactus'
				: 'cobalt';
	const pressedBackgroundColor = dangerous
		? 'mushroom'
		: warns
			? 'gold'
			: successful
				? 'acid'
				: 'sky';
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{id}
	{href}
	class="button-colored typo-paragraph"
	style:--foreground={`var(--${foregroundColor})`}
	style:--background={`var(--${backgroundColor})`}
	style:--pressed-background={`var(--${pressedBackgroundColor})`}
	style:--pressed-foreground={successful ? '#000' : '#fff'}
	onclick={bubble('click')}
>
	{@render children?.()}
</svelte:element>

<style>
	.button-colored {
		background-color: var(--background);
		color: var(--foreground);

		border: none;

		border-radius: 1em;

		padding: 0.5rem 1rem;

		cursor: pointer;
	}

	.button-colored:hover,
	.button-colored:focus {
		background-color: var(--pressed-background);
		color: var(--pressed-foreground);
	}
</style>
