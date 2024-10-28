<script lang="ts">
	import { run } from 'svelte/legacy';

	import BaseInputText from './BaseInputText.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { distanceBetween, ENSEEIHT } from './utils';
	import { throttle } from 'lodash-es';
	import { z } from 'zod';

	interface Props {
		value: string;
		latitude?: number | null;
		longitude?: number | null;
		id?: string;
		name?: string | undefined;
		initial?: string | undefined;
		placeholder?: string;
		required?: boolean;
		showEmptyErrors?: boolean;
		schema?: Zod.ZodString;
	}

	let {
		value = $bindable(),
		latitude = $bindable(null),
		longitude = $bindable(null),
		id = `input-address-${uuidv4()}`,
		name = undefined,
		initial = undefined,
		placeholder = '',
		required = false,
		showEmptyErrors = true,
		schema = z.string()
	}: Props = $props();

	let messageIsWarning = $state(false);
	let errorMessage: string = $state('');
	let suggestions: string[] = $state([]);
	let results: object[] = $state([]);

	let distanceToN7: number | null = $state(null);
	run(() => {
		distanceToN7 =
			latitude && longitude ? distanceBetween({ latitude, longitude }, ENSEEIHT) : null;
	});

	async function updateSuggestions() {
		if (value.length <= 3) {
			results = [];
			return;
		}
		const response = await (
			await fetch(
				`https://api-adresse.data.gouv.fr/search/?q=${value}&lat=${ENSEEIHT.latitude}&lon=${ENSEEIHT.longitude}`
			)
		).json();

		results = response.features.filter(({ properties: { type } }) =>
			['housenumber', 'street'].includes(type)
		);

		// if (results.length === 1) {
		// 	[latitude, longitude] = results[0].geometry.coordinates;
		// }
	}

	run(() => {
		suggestions = results.map(
			({ properties: { name, postcode, city } }) => `${name}, ${postcode} ${city}`
		);
	});

	run(() => {
		if (value === '') {
			latitude = null;
			longitude = null;
		}
	});

	run(() => {
		if (showEmptyErrors && required && !value) {
			errorMessage = 'Ce champ est requis';
			messageIsWarning = false;
		} else if (distanceToN7 !== null && distanceToN7 > 20e3) {
			errorMessage = `L'adresse saisie est très loin de l'ENSEEIHT. Vérifiez l'adresse saisie.`;
			messageIsWarning = true;
		} else {
			errorMessage = '';
		}
	});
</script>

<BaseInputText
	{required}
	{suggestions}
	{placeholder}
	type="text"
	unit={distanceToN7 !== null ? (distanceToN7 * 1e-3).toFixed(2) + 'km' : ''}
	bind:value
	autocomplete="off"
	{id}
	{name}
	{initial}
	{schema}
	{errorMessage}
	{messageIsWarning}
	on:input={throttle(updateSuggestions, 200)}
	on:select={(e) => {
		if (e.detail === null) {
			[latitude, longitude] = [null, null];
			return;
		}
		[latitude, longitude] =
			results[suggestions.findIndex((a) => a === e.detail)]?.geometry.coordinates;
	}}
/>

<input type="hidden" name="{name}Latitude" value={latitude} />
<input type="hidden" name="{name}Longitude" value={longitude} />
