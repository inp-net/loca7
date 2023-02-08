<script lang="ts">
	export let id: string;
	export let dangerous = false;
	export let warns = false;
	export let successful = false;

	const backgroundColor = dangerous ? 'rose' : warns ? 'plaster' : successful ? 'moss' : 'ice';
	const foregroundColor = dangerous ? 'blood' : warns ? 'safran' : successful ? 'cactus' : 'cobalt';
	const pressedBackgroundColor = dangerous
		? 'mushroom'
		: warns
		? 'gold'
		: successful
		? 'acid'
		: 'sky';
</script>

<button
	{id}
	class="typo-paragraph"
	style:--foreground={`var(--${foregroundColor})`}
	style:--background={`var(--${backgroundColor})`}
	style:--pressed-background={`var(--${pressedBackgroundColor})`}
	style:--pressed-foreground={successful ? '#000' : '#fff'}
>
	<slot />
</button>

<style>
	button {
		background-color: var(--background);
		color: var(--foreground);

		border: none;

		border-radius: 1em;

		padding: 0.5rem 1rem;

		cursor: pointer;
	}

	button:hover,
	button:focus {
		background-color: var(--pressed-background);
		color: var(--pressed-foreground);
	}
</style>
