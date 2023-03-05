<script lang="ts">
	import Icon from './Icon.svelte';

	export let icon: string = '';
	export let id: string = '';
	export let href: string = '';
	export let formaction: string | undefined = undefined;
	export let dangerous: boolean = false;
	export let submits = false;

	let hoverOrFocus = false;
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	type={submits ? 'submit' : undefined}
	class="button-secondary typo-paragraph"
	class:dangerous
	{href}
	{formaction}
	{id}
	on:focus={() => (hoverOrFocus = true)}
	on:blur={() => (hoverOrFocus = false)}
	on:mouseenter={() => (hoverOrFocus = true)}
	on:mouseleave={() => (hoverOrFocus = false)}
	on:click
>
	{#if icon}
		<div class="icon">
			<Icon name={icon} color={dangerous ? '#fff' : hoverOrFocus ? 'bg' : 'fg'} />
		</div>
	{/if}
	<slot />
</svelte:element>

<style>
	.button-secondary {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.25rem 0.75rem;

		background: var(--bg);
		border: var(--border-width) solid var(--fg);
		border-radius: 1000px;

		cursor: pointer;
	}

	.button-secondary:hover,
	.button-secondary:focus {
		background: var(--fg);
		color: var(--bg);
	}

	.button-secondary.dangerous {
		border-color: var(--mushroom);
		background-color: var(--mushroom);
		color: #fff;
	}

	.button-secondary.dangerous:hover,
	.button-secondary.dangerous:focus {
		background-color: var(--blood);
		border-color: var(--blood);
	}

	.icon {
		height: 1em;
		width: 1em;
	}
</style>
