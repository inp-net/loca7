<script lang="ts">
	import InputCheckbox from '$lib/InputCheckbox.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputNumber from '$lib/InputNumber.svelte';
	import InputSelectMultiple from '$lib/InputSelectMultiple.svelte';

	let surface: number = 650;
	let counter: number = -4294967295;
	let teo: number = 1_000_000_000;

	let tristate: boolean | null = null;
</script>

<h1>Inputs</h1>

<section class="numbers">
	<InputField label="Surface">
		<InputNumber bind:value={surface} positive unit="m²" />
	</InputField>

	<InputField label="ewen.works counter">
		<InputNumber bind:value={counter} positive integer />
	</InputField>

	<InputField label="Volume sonore de Téo">
		<InputNumber bind:value={teo} positive unit="dB" initial={1_000_000} />
	</InputField>
</section>

<section class="choices">
	<InputField label="multiple choices">
		<InputSelectMultiple
			name="multiple-choices"
			options={['Lorem', 'Ipsum', 'Dolor', 'Sit amet']}
		/>
	</InputField>
</section>

<section class="checkbox">
	<InputField label="Thing">
		<InputCheckbox label="Thing1" bind:value={tristate} />
	</InputField>
</section>

<style>
	h1 {
		margin-bottom: 3rem;
	}

	.numbers {
		display: flex;
		gap: 1rem;
	}
</style>
