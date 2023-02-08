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
>
	<Icon name={icon} color={hoverOrFocus ? 'muted' : 'fg'} />
</button>

<style>
	button {
		background: var(--bg);
		color: var(--fg);
		border-color: transparent;
		box-shadow: -0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.25);

		border-radius: 50%;
		height: 4rem;
		width: 4rem;
		padding: 1rem;

		cursor: pointer;
	}
</style>
