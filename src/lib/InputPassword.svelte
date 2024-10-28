<script lang="ts">
	import BaseInputText from './BaseInputText.svelte';
	import zxcvbn from 'zxcvbn';
	import Icon from './Icon.svelte';
	import InputField from './InputField.svelte';
	import { durationDisplay } from './utils';
	import { z } from 'zod';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { tooltip } from './tooltip';

	interface Props {
		value: string;
		placeholder?: string;
		id?: string | undefined;
		name?: string | undefined;
		shown?: boolean;
		label: string;
		feedback?: boolean;
		required?: boolean;
		schema?: Zod.ZodString;
		showEmptyErrors?: boolean;
		errorMessage?: string | undefined;
		userInputs?: string[];
	}

	let {
		value = $bindable(),
		placeholder = '',
		id = undefined,
		name = undefined,
		shown = $bindable(false),
		label,
		feedback = false,
		required = false,
		schema = z.string(),
		showEmptyErrors = true,
		errorMessage = undefined,
		userInputs = []
	}: Props = $props();

	let analysis = $derived(zxcvbn(value, userInputs));
	let strength: 'dangerous' | 'weak' | 'good' = $derived(
		analysis.score <= 1 ? 'dangerous' : analysis.score <= 2 ? 'weak' : 'good'
	);
	let crackTimeDisplay: string = $derived(
		durationDisplay(analysis.crack_times_seconds.offline_slow_hashing_1e4_per_second)
	);

	let currentPage: string = $state('');

	onMount(() => {
		if (browser) {
			currentPage = window.location.pathname + window.location.search + window.location.hash;
		}
	});

	let strengthDisplay = $derived(
		{
			dangerous: 'dangereuse',
			weak: 'faible',
			good: 'suffisante'
		}[strength]
	);
</script>

<div class="password-with-feedback">
	<InputField {required} {label}>
		<BaseInputText
			on:input
			on:action={() => (shown = !shown)}
			type={shown ? 'text' : 'password'}
			bind:value
			{placeholder}
			{required}
			{id}
			{name}
			{schema}
			{errorMessage}
			autocomplete={feedback ? 'new-password' : 'current-password'}
			actionIcon={shown ? 'eye-cancel' : 'eye-open'}
		/>
	</InputField>

	{#if feedback}
		<div class="feedback" class:empty={value === ''}>
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
				<a
					use:tooltip={'En savoir plus sur la complexité des mots de passe'}
					class="about"
					href="/à-propos/mots-de-passe?from={encodeURIComponent(currentPage)}"
				>
					<span class="icon">
						<Icon name="question" />
					</span>
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.colored[data-strength='dangerous'] {
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
	.feedback.empty {
		opacity: 0;
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

	.cracktime .about {
		transition: opacity 250ms ease;
	}

	.cracktime .about:not(:hover):not(:focus) {
		opacity: 0.75;
	}
</style>
