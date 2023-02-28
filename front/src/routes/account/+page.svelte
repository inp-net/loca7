<script lang="ts">
	import InputEmail from '$lib/InputEmail.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputText from '$lib/InputText.svelte';
	import InputPhone from '$lib/InputPhone.svelte';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import { user } from '$lib/stores';
	import InputPassword from '$lib/InputPassword.svelte';
</script>

<h2>Mon compte</h2>

<form action="">
	<InputField label="Nom complet">
		<InputText bind:value={$user.name} />
	</InputField>

	<InputField label="Adresse e-mail">
		<InputEmail bind:value={$user.email} />
	</InputField>
	<InputField label="Téléphone">
		<InputPhone bind:value={$user.phone} />
	</InputField>

	<ButtonPrimary submits>Enregistrer</ButtonPrimary>
</form>

<form class="password">
	<h3>Changer le mot de passe</h3>

	<InputPassword required label="Mot de passe actuel" />
	<InputPassword required label="Nouveau mot de passe" feedback />
</form>
