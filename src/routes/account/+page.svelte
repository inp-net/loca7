<script lang="ts">
	import InputEmail from '$lib/InputEmail.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputText from '$lib/InputText.svelte';
	import InputPhone from '$lib/InputPhone.svelte';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import InputPassword from '$lib/InputPassword.svelte';
	import type { PageData } from './$types';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';

	export let data: PageData;
	$: ({ user } = data);

	let oldPassword: string = '';
	let newPassword: string = '';
</script>

<main>
	<h1>Mon compte</h1>

	<form action="/update-profile">
		<h2>Profil</h2>
		<InputField label="Nom complet">
			<InputText name="name" bind:value={user.name} />
		</InputField>

		<InputField label="Adresse e-mail">
			<InputEmail name="email" bind:value={user.email} />
		</InputField>
		<InputField label="Téléphone">
			<InputPhone name="phone" bind:value={user.phone} />
		</InputField>

		<ButtonSecondary submits icon="checkmark">Enregistrer</ButtonSecondary>
	</form>

	<form class="password">
		<h2>Changer de mot de passe</h2>

		<form action="/change-password">
			<InputPassword
				bind:value={oldPassword}
				name="oldPassword"
				required
				label="Mot de passe actuel"
			/>
			<InputPassword
				bind:value={newPassword}
				name="newPassword"
				required
				label="Nouveau mot de passe"
				feedback
			/>
			<ButtonSecondary submits icon="checkmark">Enregistrer</ButtonSecondary>
		</form>
	</form>
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;

		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 3rem;
	}

	h1 {
		text-align: center;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
	}
</style>
