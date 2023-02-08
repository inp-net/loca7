<script lang="ts">
	import Icon from './Icon.svelte';

	export let unit: string = '';
	export let value: number;
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let initial: number | undefined = undefined;

	export let positive: boolean = false;
	export let integer: boolean = false;

	let errorMessage: string = '';
	$: {
		if (value === null) {
			errorMessage = 'Entrez un nombre';
		} else if (integer && Math.ceil(value) !== value) {
			errorMessage = 'Entrez un nombre entier';
		} else if (positive && value < 0) {
			errorMessage = 'Entrez un nombre positif';
		} else {
			errorMessage = '';
		}
	}

	let errored = false;
	$: errored = errorMessage !== '';

	let resettable = false;
	$: resettable = initial !== undefined && value !== initial;

	let focused = false;
</script>

<div class="wrapper typo-paragraph" class:errored class:focused>
	<div class="input-area">
		<input
			type="number"
			{name}
			{id}
			bind:value
			on:focus={() => (focused = true)}
			on:blur={() => (focused = false)}
		/>
		{#if resettable}
			<button class="reset" on:click={() => (value = initial)}>
				<Icon name="reset" color="fg" />
			</button>
		{:else}
			<span class="unit">{unit}</span>
		{/if}
	</div>
	{#if errored}
		<div class="error-area">
			<p class="typo-details error-message">{errorMessage}</p>
		</div>
	{/if}
</div>

<style>
	.wrapper {
		border: var(--border-width) solid var(--fg);
		display: flex;
		flex-direction: column;
	}

	.wrapper > div {
		padding: 0.5rem 0.75rem;
	}

	.input-area {
		display: flex;
		align-items: center;
	}

	.unit {
		color: var(--sky);
		width: 1.5rem;
		text-align: right;
	}

	input {
		border: none;
		-moz-appearance: textfield;
		appearance: textfield;
		width: 100%;
	}

	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		appearance: none;
		margin: 0;
	}

	button.reset {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 1.5rem;
		height: 1.25rem;
		cursor: pointer;
	}

	/** Focused */
	.wrapper:hover, .wrapper.focused {
		border-color: var(--sky);
	}

	.wrapper.focused, .wrapper.focused input {
		outline: none;
		background: var(--ice);
	}

	/** Errored */

	.wrapper.errored {
		border-color: var(--blood);
	}

	.wrapper.errored .unit {
		color: var(--blood);
	}
	.error-area {
		background-color: var(--blood);
		color: #fff;
	}

	/** Both */
	.wrapper.errored.focused, .wrapper.errored.focused input {
		background-color: var(--rose);
	}
</style>
