<script lang="ts">
	export let value: string | null = null;
	export let options: string[];
</script>

<fieldset>
	{#each options as option}
		<label aria-current={option === value}>
			<input type="radio" name="input" bind:group={value} value={option} />
			{option}
		</label>
	{/each}
</fieldset>

<style>
	input {
		display: none;
	}

	label {
		background: var(--fg);
		color:var(--bg);
		padding: 0.25rem 0.5rem;
		cursor: pointer;
	}

	label[aria-current=true] {
		background: var(--diamond);
		color: var(--fg);
	}

	fieldset {
		border: var(--border-width) solid var(--fg);
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		width: max-content;
	}
</style>
