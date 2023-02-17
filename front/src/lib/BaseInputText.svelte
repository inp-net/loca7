<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from './Icon.svelte';
	import { v4 as uuidv4 } from 'uuid';
	const emit = createEventDispatcher();

	export let type: HTMLInputTypeAttribute;
	export let value: string | number;
	export let id: string = `input-${uuidv4()}`;
	export let name: string | undefined = undefined;
	export let initial: string | number | undefined = undefined;
	export let unit: string = '';
	export let placeholder: string = '';
	export let actionIcon: string = '';
	export let suggestions: string[] | undefined = undefined;

	export let errorMessage: string = '';
	$: console.log('initial', typeof initial, JSON.stringify(initial));

	let errored = false;
	$: errored = errorMessage !== '';

	let resettable = false;
	$: resettable = typeof initial !== 'undefined' && value !== initial;

	let focused = false;
</script>

<div class="wrapper typo-paragraph" class:errored class:focused>
	<div class="input-area">
		<input
			{type}
			{name}
			{id}
			{value}
			{placeholder}
			on:input={(e) => (value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value)}
			on:focus={() => (focused = true)}
			on:blur={() => (focused = false)}
		/>
		{#if suggestions}
			<datalist {id}>
				{#each suggestions as suggestion}
					<option value={suggestion} />
				{/each}
			</datalist>
		{/if}
		{#if actionIcon}
			<button class="action" on:click={() => emit('action')}>
				<Icon name={actionIcon} color="fg" />
			</button>
		{/if}
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

	button.reset,
	button.action {
		background-color: transparent;
		border: none;
		padding: 0;
		width: 1.5rem;
		height: 1.25rem;
		cursor: pointer;
	}

	.unit {
		color: var(--sky);
	}

	/** Focused */
	.wrapper:hover,
	.wrapper.focused {
		border-color: var(--sky);
	}

	.wrapper.focused,
	.wrapper.focused input {
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
	}
	.error-area p {
		color: #fff;
	}

	/** Both */
	.wrapper.errored.focused,
	.wrapper.errored.focused input {
		background-color: var(--rose);
	}
</style>
