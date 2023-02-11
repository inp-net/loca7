<script lang="ts">
	export let name: string;
	export let strokeWidth: string = "5";
	export let color = 'currentColor';
</script>

{#await import(`./icons/${name}.svelte`) then iconSVG}
	<svelte:component
		this={iconSVG.default}
		color={color.startsWith('#') ? color : `var(--${color})`}
		{strokeWidth}
	/>
{:catch error}
	<span style="color: red;">{error}</span>
{/await}

<style>
	:global(svg) {
		height: 100%;
		width: 100%;
		object-fit: contain;
	}
</style>
