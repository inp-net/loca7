<script lang="ts">
	import Icon from './Icon.svelte';

	export let name: string = '';
	export let options: string[];
	export let selection: string[] = [];
</script>

<fieldset>
	{#each options as option}
		<label aria-checked={selection.includes(option)}>
			<div class="icon" aria-hidden={!selection.includes(option)}>
				<Icon name="checkmark" color="bg" />
			</div>
			<input type="checkbox" {name} bind:group={selection} value={option} />
			{option}
		</label>
	{/each}
</fieldset>

<style>
	fieldset {
		display: flex;
		border: none;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		flex-wrap: wrap;
	}
	label {
		background-color: transparent;
		padding: 0.25rem 1rem;
		border-radius: 10000px;

		border: var(--border-width) solid var(--fg);

		cursor: pointer;

		display: flex;
		align-items: center;
		gap: 0;

		transition: all 0.25s ease;
	}

	label[aria-checked='true'] {
		background-color: var(--fg);
		color: var(--bg);

		gap: 0.5rem;
	}

	.icon {
		height: 1em;

		transition: all 0.25s ease;
	}

	.icon[aria-hidden='true'] {
		transform: scale(0);
		width: 0;
		opacity: 0;
	}

	input {
		display: none;
	}
</style>
