<script lang="ts">
	interface Props {
		id?: string;
		href: string;
		current?: boolean;
		children?: import('svelte').Snippet;
	}

	let { id = '', href, current = false, children }: Props = $props();
</script>

<a aria-current={current} {href} {id}>{@render children?.()}</a>

<style>
	a {
		font-weight: 500;
		text-decoration: none;
		display: inline-block;
		color: var(--fg);
		font-size: 1.5rem;
	}

	a:hover,
	a:focus {
		text-decoration: underline;
		text-underline-offset: 0.2rem;
		text-decoration-color: var(--fg);
		text-decoration-thickness: 0.3rem;
		font-weight: 700;
	}

	a[aria-current='true'] {
		text-decoration: underline;
		text-underline-offset: 0.2rem;
		text-decoration-color: var(--diamond);
		text-decoration-thickness: 0.3rem;
		font-weight: 700;
	}
</style>
