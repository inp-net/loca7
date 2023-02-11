<script lang="ts">
	import InputCheckbox from '$lib/InputCheckbox.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputNumber from '$lib/InputNumber.svelte';
	import InputPassword from '$lib/InputPassword.svelte';
	import InputSelectMultiple from '$lib/InputSelectMultiple.svelte';
	import InputSelectOne from '$lib/InputSelectOne.svelte';

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

<section class="radio">
	<InputField label="Type d'appartement">
		<InputSelectOne
			options={['Chambre', 'Studio', 'T1', 'T1 bis', 'T2', 'T3 et plus', 'Colocation', 'Manoir']}
			value="Manoir"
		/>
	</InputField>
</section>

<section class="password">
	<InputPassword label="Mot de passe" value="tvn7>can7" />
</section>

<style>
	h1 {
		margin-bottom: 3rem;
	}

	.numbers {
		display: flex;
		gap: 1rem;
	}

	.password {
		max-width: 500px;
	}
</style>
