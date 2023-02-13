<script lang="ts">
	import Icon from './Icon.svelte';

	export let id: string;
	export let icon: string;

	let hoverOrFocus = false;
</script>

<button
	{id}
	on:focus={() => (hoverOrFocus = true)}
	on:blur={() => (hoverOrFocus = false)}
	on:mouseenter={() => (hoverOrFocus = true)}
	on:mouseleave={() => (hoverOrFocus = false)}
	on:click
>
	<Icon name={icon} color={hoverOrFocus ? '#fffa' : 'bg'} />
</button>

<style>
	button {
		background: var(--fg);
		color: var(--bg);
		border-color: transparent;

		border-radius: 50%;
		height: 2.5rem;
		width: 2.5rem;
		padding: 0.5rem;

		cursor: pointer;
	}
</style>
