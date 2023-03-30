<script lang="ts">
	export let value: string | null = null;
	export let options: string[] | Record<string, string> = {};
	export let name: string | undefined = undefined;
	export let required: boolean = false;

	let errorMessage: string = '';
	let showEmptyErrors: boolean = false;
	$: if (required && value === null && showEmptyErrors) {
		errorMessage = 'Ce champ est requis';
	} else {
		errorMessage = '';
	}

	let edited: boolean = false;

	let errored: boolean = false;
	$: errored = errorMessage !== '';

	let optionsWithDisplay: Record<string, string> = {};
	$: optionsWithDisplay = Array.isArray(options)
		? Object.fromEntries(options.map((option) => [option, option]))
		: options;
</script>

<div class="wrapper" class:errored>
	<fieldset>
		{#each Object.entries(optionsWithDisplay) as [option, display]}
			<label aria-current={option === value}>
				<input type="radio" {name} bind:group={value} value={option} />
				{display}
			</label>
		{/each}
	</fieldset>

	{#if errored}
		<div class="error-area">
			<p class="typo-details error-message">{errorMessage}</p>
		</div>
	{/if}
</div>

<style>
	input {
		display: none;
	}

	label {
		background: var(--bg);
		color: var(--fg);
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	label[aria-current='true'] {
		background: var(--diamond);
		color: black;
	}

	fieldset {
		border: var(--border-width) solid var(--fg);
		display: inline-flex;
		gap: var(--border-width);
		padding: 0;
		flex-wrap: wrap;
		margin: 0;
        background: var(--fg);
	}

	.error-area {
		padding: 0.5rem 0.75rem;
	}

	.wrapper.errored fieldset {
		border-color: var(--blood);
	}
	.wrapper.errored label[aria-current='true'] {
		background: var(--blood);
		color: #fff;
	}
	.wrapper.errored .error-area {
		background: var(--blood);
	}

	.wrapper.errored .error-area p {
		color: #fff;
	}
</style>
