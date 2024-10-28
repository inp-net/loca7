<script lang="ts">
	import { run, createBubbler, stopPropagation } from 'svelte/legacy';

	const bubble = createBubbler();
	import { createEventDispatcher, onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import InputWithSuggestions from './InputWithSuggestions.svelte';
	import type { Name as IconName } from '$lib/icons/types';
	import type { ZodSchema } from 'zod';
	const emit = createEventDispatcher();

	let _errorMessage: string = $state('');
	interface Props {
		type: HTMLInputElement['type'];
		value: string | number | Date | null | undefined;
		id?: string;
		autocomplete?: string | undefined;
		name?: string | undefined;
		initial?: string | number | Date | null | undefined;
		unit?: string;
		placeholder?: string;
		actionIcon?: IconName | '';
		suggestions?: string[] | undefined;
		required?: boolean;
		schema: ZodSchema;
		leftIcon?: IconName | '';
		closeKeyboardOnEnter?: boolean;
		errorMessage?: string;
		messageIsWarning?: boolean;
	}

	let {
		type,
		value = $bindable(),
		id = `input-${uuidv4()}`,
		autocomplete = undefined,
		name = undefined,
		initial = undefined,
		unit = '',
		placeholder = '',
		actionIcon = '',
		suggestions = undefined,
		required = false,
		schema,
		leftIcon = '',
		closeKeyboardOnEnter = false,
		errorMessage = '',
		messageIsWarning = false
	}: Props = $props();

	let showEmptyErrors: boolean = $state(false);
	let valueString: string = $state(
		type === 'date' && value instanceof Date
			? value?.toISOString()?.split('T')[0]
			: (value?.toString() ?? '')
	);

	let errored = $state(false);

	let resettable = $state(false);

	let focused = $state(false);

	let inputContainer: HTMLDivElement | undefined = $state();

	onMount(() => {
		inputContainer
			?.closest('form')
			?.querySelector('button[type=submit]')
			?.addEventListener('click', () => {
				showEmptyErrors = true;
			});
	});
	run(() => {
		switch (type) {
			case 'number':
				value = +valueString.replace(',', '.');
				break;
			case 'date':
				value = new Date(valueString);
				if (!value.valueOf()) {
					value = null;
					valueString = '';
				}
				break;
			default:
				value = valueString;
		}
	});
	run(() => {
		if (valueString === '' && !showEmptyErrors) {
			_errorMessage = '';
		} else if (errorMessage !== '') {
			_errorMessage = errorMessage;
		} else {
			if (valueString === '' && showEmptyErrors && required) {
				_errorMessage = 'Ce champ est requis';
			} else {
				// Validate string conversion first
				if (type === 'number' && valueString === '' && required) {
					_errorMessage = 'Ce champ doit être un nombre';
				} else {
					if (type === 'date' && value === null) {
						_errorMessage = '';
					} else {
						let parseResult = schema.safeParse(value);
						_errorMessage = parseResult.success
							? ''
							: parseResult.error.issues.map((e) => e.message).join(', ');
					}
				}
			}
		}
	});
	run(() => {
		errored = _errorMessage !== '';
	});
	run(() => {
		resettable = typeof initial !== 'undefined' && value !== initial;
	});
</script>

<div
	class="wrapper base-input typo-paragraph"
	class:errored
	class:focused
	style:--intense="var(--{messageIsWarning ? 'safran' : 'blood'})"
	style:--pale="var(--{messageIsWarning ? 'plaster' : 'rose'})"
>
	<div class="input-area" bind:this={inputContainer}>
		{#if leftIcon}
			<div class="left-icon">
				<Icon name={leftIcon} color="fg" />
			</div>
		{/if}
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
				bind:text={valueString}
				{placeholder}
				on:keypress={(e) => {
					if (e.key === 'Enter' && closeKeyboardOnEnter) {
						e.target.blur();
					}
				}}
				on:focus={() => (focused = true)}
				on:blur={() => (focused = false)}
				on:input={(e) => {
					if (valueString !== '') showEmptyErrors = true;
					emit('input', e);
				}}
			/>
		{:else}
			<input
				onkeyup={bubble('keyup')}
				onkeypress={(e) => {
					if (e.key === 'Enter' && closeKeyboardOnEnter) {
						e.target.blur();
					}
				}}
				{type}
				{name}
				{id}
				value={valueString}
				{required}
				{autocomplete}
				{placeholder}
				oninput={(e) => {
					valueString = e.target?.value;
					if (valueString === undefined) valueString = '';
					if (valueString !== '') showEmptyErrors = true;
					emit('input', e);
				}}
				onfocus={() => (focused = true)}
				onblur={() => (focused = false)}
			/>
		{/if}
		{#if actionIcon}
			<button type="button" class="action" onclick={() => emit('action')}>
				<Icon name={actionIcon} color="fg" />
			</button>
		{/if}
		{#if resettable}
			<button
				type="button"
				class="reset"
				onclick={stopPropagation(() => {
					value = initial;
					valueString =
						type === 'date' && value instanceof Date
							? value?.toISOString()?.split('T')[0]
							: (value?.toString() ?? '');
				})}
			>
				<Icon name="reset" color="fg" />
			</button>
		{:else}
			<span class="unit">{unit}</span>
		{/if}
	</div>
	{#if errored}
		<div class="error-area">
			<p class="typo-details error-message">{_errorMessage}</p>
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

	.left-icon {
		height: 1.5rem;
		width: 1.5rem;
		margin-right: 0.5rem;
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
