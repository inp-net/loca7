<script lang="ts">
	import type { Name as IconName } from '$lib/icons/types';
	import Icon from './Icon.svelte';
	export let id: string = '';
	export let icon: IconName | undefined = undefined;
	export let href: string | undefined = undefined;
	export let submits: boolean = false;
	export let smaller: boolean = false;
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{id}
	{href}
	class="button-primary typo-big-button"
	class:smaller
	on:click
	type={submits ? 'submit' : 'button'}
>
	{#if icon !== undefined}
		<span class="icon">
			<Icon name={icon} />
		</span>
	{/if}
	<slot />
</svelte:element>

<style>
	.button-primary {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 1rem 2rem;

		background: var(--diamond);
		color: #000;
		--fg: #000;

		border: none;
		border-radius: 1000px;

		cursor: pointer;
	}

	.button-primary.smaller {
		padding: 0.75rem 1.5rem;
	}

	.icon {
		height: 2em;
		margin-right: 0.5em;
	}

	.smaller .icon {
		height: 1.2em;
	}

	.button-primary:hover,
	.button-primary:focus {
		background: var(--sky); /* TODO check contrast */
	}
</style>
