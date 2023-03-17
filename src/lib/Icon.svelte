<script lang="ts">
	import { dev } from '$app/environment';

	export let name: string;
	export let strokeWidth: string = '5';
	export let color = 'fg';
	export let flip = false;
	export let cancel = false;
</script>

{#await import(`./icons/${name}${cancel ? '-cancel' : ''}.svelte`)}
	<svg class="loading-icon" height="50" width="50" viewBox="0 0 50 50" />
{:then iconSVG}
	<svelte:component
		this={iconSVG.default}
		color={color.startsWith('#') ? color : `var(--${color})`}
		{strokeWidth}
		{flip}
	/>
{:catch error}
	{#if dev}
		<span style="color: red;">{error}</span>
	{/if}
{/await}

<style>
	:global(svg) {
		height: 100%;
		width: 100%;
		object-fit: contain;
	}
</style>
