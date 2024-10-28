<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';

	const getTriState = (target: HTMLInputElement) => {
		return target.indeterminate ? null : target.checked;
	};

	const setTriState = (target: HTMLInputElement, value: boolean | null) => {
		if (value === null) {
			target.indeterminate = true;
			target.checked = false;
		} else {
			target.indeterminate = false;
			target.checked = value;
		}
		previousValue = value;
	};

	interface Props {
		tristate?: boolean;
		value?: boolean | null;
		name?: string | undefined;
		labelTrue?: string;
		labelFalse?: string;
		labelNull?: string;
		label: string;
	}

	let {
		tristate = true,
		value = $bindable(null),
		name = undefined,
		labelTrue = 'Oui',
		labelFalse = 'Non',
		labelNull = 'Inconnu',
		label
	}: Props = $props();

	let previousValue: boolean | null = $state(value);
	let checkboxElement: HTMLInputElement | undefined = $state();

	onMount(async () => {
		previousValue = value;
		if (checkboxElement) setTriState(checkboxElement, value);
	});
</script>

<label class="input-checkbox" class:tristate>
	<input
		type="checkbox"
		bind:this={checkboxElement}
		onchange={(event) => {
			event.preventDefault();
			if (!(event.target instanceof HTMLInputElement)) return;
			if (previousValue === null) {
				setTriState(event.target, true);
			} else if (previousValue === true) {
				setTriState(event.target, false);
			} else {
				setTriState(event.target, tristate ? null : true);
			}
			value = getTriState(event.target);
			previousValue = value;
		}}
	/>
	<input type="hidden" {name} value={value === null ? 'indeterminate' : value ? 'on' : 'off'} />
	<div class="checkbox" data-state={JSON.stringify(value)}>
		{#if value !== null}
			<Icon
				name={value ? 'checkmark' : 'close'}
				color="icon-color"
				strokeWidth="calc(var(--border-width) * 2)"
			/>
		{/if}
	</div>
	<div class="labels">
		<span class="label typo-paragraph">{label}</span>
		<span class="label-value typo-details">
			{#if value === null}
				{labelNull}
			{:else if value}
				{labelTrue}
			{:else}
				{labelFalse}
			{/if}
		</span>
	</div>
</label>

<style>
	.label-value {
		color: var(--sky);
		grid-area: value;
	}

	.label {
		grid-area: label;
	}

	input {
		display: none;
	}
	.checkbox {
		--icon-color: var(--fg);
		grid-area: box;
		display: inline-block;
		width: 2rem;
		height: 2rem;
		border: var(--border-width) solid var(--fg);
		position: relative;
	}
	.checkbox[data-state='null']::after {
		content: '';
		width: var(--border-width);
		height: 2rem;
		transform: rotate(45deg);
		background: var(--fg);
		position: absolute;
		left: calc(2rem / 2 - var(--border-width) / 2);
	}
	.checkbox[data-state='true'],
	.tristate .checkbox[data-state='false'] {
		--icon-color: var(--bg);
		background: var(--fg);
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 120px
			/* XXX: based on width of input when the label is smaller than "Peu importe" */;
		cursor: pointer;
	}
	.labels {
		display: flex;
		flex-direction: column;
	}
</style>
