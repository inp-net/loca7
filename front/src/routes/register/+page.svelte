<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import InputEmail from '$lib/InputEmail.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputPassword from '$lib/InputPassword.svelte';
	import InputPhone from '$lib/InputPhone.svelte';
	import InputText from '$lib/InputText.svelte';
</script>

<svelte:head>
	<title>Loca7 · Inscription</title>
</svelte:head>

<main>
	<h1>Inscription</h1>
	<p>Déjà un compte? <ButtonSecondary href="/login">Connectez-vous</ButtonSecondary></p>

	<form method="post">
		<InputField label="Email">
			<InputEmail required name="email" value="" />
		</InputField>

		<InputField label="Nom complet">
			<InputText required name="fullName" value="" />
		</InputField>

		<InputField label="Téléphone (optionel)">
			<InputPhone name="phone" value="" />
		</InputField>

		<InputPassword feedback required label="Mot de passe" name="password" value="" />

		<section class="submit">
			<ButtonPrimary submits>Créer un compte</ButtonPrimary>
		</section>
	</form>
</main>

<style>
	main {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	h1,
	main > p {
		text-align: center;
	}

	form {
		max-width: 400px;
		margin: 2rem auto;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	form .submit {
		margin-top: 2rem;
		display: flex;
		justify-content: center;
	}
</style>
