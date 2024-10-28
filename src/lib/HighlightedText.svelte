<script lang="ts">
	import type Fuse from 'fuse.js';

	const first = ([first]: Fuse.RangeTuple) => first;
	const second = ([, second]: Fuse.RangeTuple) => second;

	interface Props {
		indices?: Fuse.RangeTuple[] | undefined;
		children?: import('svelte').Snippet;
	}

	let { indices = [], children }: Props = $props();

	const startsHighlight = (index: number, indices) => (indices || []).map(first).includes(index);
	const endsHighlight = (index: number, indices) => (indices || []).map(second).includes(index);

	let highlightSource: HTMLSpanElement = $state();
</script>

<span class="highlight-source" bind:this={highlightSource}>
	{#if children}{@render children()}{:else}<!-- optional fallback -->{/if}
</span>

{@html Array.from(highlightSource?.innerHTML || '')
	.map((character, index) => {
		if (
			startsHighlight(
				index,
				indices.filter((i) => first(i) !== second(i))
			)
		) {
			return `<span class="highlight">${character}`;
		} else if (
			endsHighlight(
				index,
				indices.filter((i) => first(i) !== second(i))
			)
		) {
			return `${character}</span>`;
		} else {
			return character;
		}
	})
	.join('')}

<style>
	:global(span.highlight) {
		font-variation-settings: 'wght' 800;
		background-color: var(--ice, transparent);
		color: var(--cobalt);
	}

	span.highlight-source {
		display: none;
	}
</style>
