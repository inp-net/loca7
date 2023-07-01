<script lang="ts">
	import InputField from '$lib/InputField.svelte';
	import Fuse from 'fuse.js';
	import type { PageData } from './$types';
	import InputEmail from '$lib/InputEmail.svelte';
	import InputText from '$lib/InputText.svelte';
	import InputRichText from '$lib/InputRichText.svelte';
	import BaseInputText from '$lib/BaseInputText.svelte';
	import { z } from 'zod';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import InputCheckbox from '$lib/InputCheckbox.svelte';

	export let data: PageData;
	let { allEmails } = data;
	let recipients: string = '';
	let subject: string = '';
	let body: string = '';

	const emailSearcher = new Fuse(allEmails, {
		shouldSort: true,
		distance: Math.max(...allEmails.map((e) => e.length)),
		useExtendedSearch: true
	});

	let emailSuggestions: string[] = [];
	$: {
		const emails = recipients
			.split(',')
			.map((e) => e.trim())
			.filter((e) => e !== '');
		if (emails.length === 0) emailSuggestions = [];
		else if (recipients.trim().endsWith(',')) emailSuggestions = [];
		else {
			console.log(emails);
			const lastEmail = emails[emails.length - 1];
			emailSuggestions = emailSearcher
				.search(lastEmail)
				.map((r) => [...emails.slice(0, emails.length - 1), r.item].join(', '));
		}
	}
</script>

<main>
	<h1>Envoyer un mail</h1>
	<form method="post" action="?/send">
		<InputField label="Email">
			<BaseInputText
				type="text"
				schema={z.string()}
				suggestions={emailSuggestions}
				name="email"
				bind:value={recipients}
				unit={recipients === ''
					? ''
					: recipients.split(',').every((email) => allEmails.includes(email.trim()))
					? ''
					: 'inconnus'}
			/>
		</InputField>

		<p class="hint">L'e-mail est envoyé séparément à chaque destinataire.</p>

		<InputCheckbox
			tristate={false}
			value={false}
			name="bypassAuthKeyCheck"
			label="Comptes non activés"
			labelFalse="Ne pas envoyer"
			labelTrue="Envoyer"
		/>

		<InputField label="Objet">
			<InputText name="subject" bind:value={subject} />
		</InputField>

		<InputField label="Message">
			<InputRichText name="body" bind:value={body} />
		</InputField>
		<section class="submit">
			<ButtonPrimary submits>Envoyer</ButtonPrimary>
		</section>
	</form>
</main>

<style>
	main {
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		margin-bottom: 3rem;
	}

	form {
		max-width: 600px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex-wrap: wrap;
	}

	section.submit {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
	}
</style>
