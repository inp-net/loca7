<script lang="ts">
	import InputField from '$lib/InputField.svelte';
	import InputNumber from '$lib/InputNumber.svelte';

	let surface: number = 650;
	let counter: number = -4294967295;
	let teo: number = 1_000_000_000;
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

<style>
	h1 {
		margin-bottom: 3rem;
	}
	.numbers {
		display: flex;
		gap: 1rem;
	}
</style>
