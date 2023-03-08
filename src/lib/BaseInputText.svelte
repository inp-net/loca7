<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from './Icon.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import InputWithSuggestions from './InputWithSuggestions.svelte';
	const emit = createEventDispatcher();

	export let type: HTMLInputElement['type'];
	export let value: string | number | undefined;
	export let id: string = `input-${uuidv4()}`;
	export let autocomplete: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let initial: string | number | undefined = undefined;
	export let unit: string = '';
	export let placeholder: string = '';
	export let actionIcon: string = '';
	export let suggestions: string[] | undefined = undefined;
	export let required: boolean = false;

	export let errorMessage: string = '';
	export let messageIsWarning: boolean = false;

	let errored = false;
	$: errored = errorMessage !== '';

	let resettable = false;
	$: resettable = typeof initial !== 'undefined' && value !== initial;

	let focused = false;

	let inputContainer: HTMLDivElement;
</script>

<div
	class="wrapper typo-paragraph"
	class:errored
	class:focused
	style:--intense="var(--{messageIsWarning ? 'safran' : 'blood'})"
	style:--pale="var(--{messageIsWarning ? 'plaster' : 'rose'})"
>
	<div class="input-area" bind:this={inputContainer}>
		{#if suggestions}
			<InputWithSuggestions
				on:close-suggestions
				on:select
				on:input
				{inputContainer}
				{autocomplete}
				items={suggestions}
				{id}
				{required}
				{name}
				bind:text={value}
				{placeholder}
				on:focus={() => (focused = true)}
				on:blur={() => (focused = false)}
			/>
		{:else}
			<input
				{type}
				{name}
				{id}
				{value}
				{required}
				{autocomplete}
				{placeholder}
				on:input={(e) => {
					value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value;
					emit('input', e);
				}}
				on:focus={() => (focused = true)}
				on:blur={() => (focused = false)}
			/>
		{/if}
		{#if actionIcon}
			<button type="button" class="action" on:click={() => emit('action')}>
				<Icon name={actionIcon} color="fg" />
			</button>
		{/if}
		{#if resettable}
			<button type="button" class="reset" on:click={() => (value = initial)}>
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
		position: relative;
	}

	input {
		border: none;
		-moz-appearance: textfield;
		appearance: textfield;
		width: 100%;
		outline: none;
		background-color: var(--bg);
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
		border-color: var(--intense);
	}

	.wrapper.errored .unit {
		color: var(--intense);
	}
	.error-area {
		background-color: var(--intense);
	}
	.error-area p {
		color: #fff;
	}

	/** Both */
	.wrapper.errored.focused,
	.wrapper.errored.focused input {
		background-color: var(--pale);
	}
</style>
