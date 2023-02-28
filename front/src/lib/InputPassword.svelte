<script lang="ts">
	import BaseInputText from './BaseInputText.svelte';
	import zxcvbn from 'zxcvbn';
	import Icon from './Icon.svelte';
	import InputField from './InputField.svelte';
	import { durationDisplay } from './utils';

	export let value: string;
	export let placeholder: string = '';
	export let id: string | undefined = undefined;
	export let name: string | undefined = undefined;
	export let shown = false;
	export let label: string;
	export let feedback: boolean = false;
	export let required: boolean = false;

	let analysis;
	let strength: 'insufficient' | 'weak' | 'good';
	let crackTimeDisplay: string;

	$: analysis = zxcvbn(value); // TODO use second argument (user inputs)
	$: strength = analysis.score <= 1 ? 'insufficient' : analysis.score <= 2 ? 'weak' : 'good';
	$: strengthDisplay = {
		insufficient: 'insuffisante',
		weak: 'faible',
		good: 'suffisante'
	}[strength];
	$: crackTimeDisplay = durationDisplay(
		analysis.crack_times_seconds.offline_slow_hashing_1e4_per_second
	);
</script>

<div class="password-with-feedback">
	<InputField {label}>
		<BaseInputText
			on:action={() => (shown = !shown)}
			type={shown ? 'text' : 'password'}
			bind:value
			{placeholder}
			{required}
			{id}
			{name}
			actionIcon={shown ? 'eye-cancel' : 'eye-open'}
		/>
	</InputField>

	{#if feedback}
		<div class="feedback">
			<div class="strength">
				<span class="icon">
					<Icon name="password-strength-{strength}" />
				</span>
				<p class="typo-details">
					Complexité du mot de passe
					<span class="colored" data-strength={strength}>{strengthDisplay}</span>
				</p>
			</div>
			<div class="cracktime">
				<p class="typo-details">
					Pour trouver ce mot de passe, un hacker mettra <span
						class="colored"
						data-strength={strength}>{crackTimeDisplay}</span
					>
				</p>
				<a href="/password-strength">
					<span class="icon">
						<Icon name="question" />
					</span>
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.colored[data-strength='insufficient'] {
		color: var(--blood);
	}

	.colored[data-strength='weak'] {
		color: var(--safran);
	}

	.colored[data-strength='good'] {
		color: var(--cactus);
	}

	.icon {
		display: inline-block;
		height: 1.5em;
		width: 1.5em;
	}

	.cracktime p {
		font-weight: 400;
	}

	.feedback {
		margin-top: 1rem;
		display: flex;
		flex-direction: column;
	}

	.feedback > div {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.cracktime {
		justify-content: space-between;
	}

	.feedback a {
		display: flex;
	}
</style>
