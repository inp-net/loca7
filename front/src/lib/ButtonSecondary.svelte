<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from './Icon.svelte';

	export let icon: string = "";
	export let id: string = "";
	export let dangerous: boolean = false;

	let hoverOrFocus = false;
</script>

<button
	class="typo-paragraph"
	class:dangerous
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
</button>

<style>
	button {
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.5rem 1rem;

		background: transparent;
		border: var(--border-width) solid var(--fg);
		border-radius: 1000px;

		cursor: pointer;
	}

	button:hover,
	button:focus {
		background: var(--fg);
		color: var(--bg);
	}

	button.dangerous {
		border-color: var(--mushroom);
		background-color: var(--mushroom);
		color: #fff;
	}

	button.dangerous:hover,
	button.dangerous:focus {
		background-color: var(--blood);
		border-color: var(--blood);
	}

	.icon {
		height: 1em;
	}
</style>
