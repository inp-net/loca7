<script lang="ts">
	export let id: string = '';
	export let href: string | undefined = undefined;
	export let submits: boolean = false;
</script>

<svelte:element
	this={href ? 'a' : 'button'}
	{id}
	{href}
	class="button-primary typo-big-button"
	on:click
	type={submits ? 'submit' : 'button'}
>
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

		border: none;
		border-radius: 1000px;

		cursor: pointer;
	}

	.button-primary:hover,
	.button-primary:focus {
		background: var(--sky); /* TODO check contrast */
	}
</style>
