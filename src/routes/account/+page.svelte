<script lang="ts">
	import InputEmail from '$lib/InputEmail.svelte';
	import InputField from '$lib/InputField.svelte';
	import InputText from '$lib/InputText.svelte';
	import InputPhone from '$lib/InputPhone.svelte';
	import InputPassword from '$lib/InputPassword.svelte';
	import type { PageData } from './$types';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import { page } from '$app/stores';
	import { addToast, toasts } from '$lib/toasts';
	import { onMount } from 'svelte';
	import { darkMode } from '$lib/stores';
	import InputCheckbox from '$lib/InputCheckbox.svelte';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let { user, userHasNoEmailKey } = $derived(data);

	let oldPassword: string = $state('');
	let oldPasswordIsInvalid: boolean = $state($page.url.hash === '#invalid-credentials');
	let wrongCredentialsWhenConfirmingAccountDeletion =
		$page.url.hash === '#invalid-credentials-delete-account';
	let emailAlreadyInUse = $page.url.hash === '#email-already-in-use';
	let newPassword: string = $state('');
	let confirmingDeletion = $state(false);

	onMount(() => {
		if (wrongCredentialsWhenConfirmingAccountDeletion) {
			addToast('error', 'E-mail ou mot de passe incorrect');
		}
		if (emailAlreadyInUse) {
			addToast(
				'error',
				"Cette adresse e-mail est déjà utilisée. Impossible de changer l'adresse e-mail."
			);
		}
	});
</script>

<svelte:head>
	<title>Loca7 · Mon compte</title>
</svelte:head>

<main>
	<section class="header">
		<h1>Mon compte</h1>
		{#if user.admin || user.god}
			<p class="status">
				Vous êtes {#if user.god}Dieu{:else}administrateur{/if}.
			</p>
		{/if}
	</section>

	{#if user.god}
		<section class="godmode">
			<p>currently: {user.admin}</p>
			<form method="post" action="?/toggleAdmin">
				<ButtonSecondary submits>Toggle admin</ButtonSecondary>
			</form>
		</section>
	{/if}

	<form method="post" action="?/updateProfile">
		<h2>Profil</h2>
		<p class="explain typo-paragraph">
			Ces informations apparaîtront publiquement sur vos annonces.
		</p>
		<div class="side-by-side">
			<InputField label="Prénom">
				<InputText name="firstName" bind:value={user.firstName} />
			</InputField>
			<InputField label="Nom de famille" required>
				<InputText required name="lastName" bind:value={user.lastName} />
			</InputField>
		</div>

		<InputField label="Adresse e-mail" required>
			<InputEmail required name="email" bind:value={user.email} />
		</InputField>
		<InputField label="Téléphone">
			<InputPhone name="phone" bind:value={user.phone} />
		</InputField>

		<div class="title-and-explain">
			<h3>Vous représentez une agence ?</h3>
			<p>Votre nom ne sera pas affiché sur vos annonces.</p>
		</div>
		<div class="side-by-side">
			<InputField label="Nom de l'agence">
				<InputText
					autocomplete="organization"
					name="agencyName"
					bind:value={user.agencyName}
				/>
			</InputField>
			<InputField label="Site internet">
				<InputText
					autocomplete="url"
					name="agencyWebsite"
					bind:value={user.agencyWebsite}
				/>
			</InputField>
		</div>

		<section class="submit">
			<ButtonSecondary submits icon="checkmark">Enregistrer</ButtonSecondary>
		</section>
	</form>

	<form method="post" action="?/changePassword" class="password">
		<h2>
			{#if userHasNoEmailKey}Définir un{:else}Changer de{/if} mot de passe
		</h2>
		{#if !userHasNoEmailKey}
			<InputPassword
				bind:value={oldPassword}
				on:input={() => {
					oldPasswordIsInvalid = false;
				}}
				name="oldPassword"
				required
				label="Mot de passe actuel"
				errorMessage={oldPasswordIsInvalid ? 'Mot de passe invalide' : ''}
			/>
		{/if}
		<InputPassword
			bind:value={newPassword}
			name="newPassword"
			required
			label="Nouveau mot de passe"
			feedback
			userInputs={Object.values(user).filter((v) => v && typeof v === 'string')}
		/>
		<section class="submit">
			<ButtonSecondary submits icon="checkmark">Enregistrer</ButtonSecondary>
		</section>
	</form>

	<section class="theme">
		<h2>Thème</h2>
		<InputCheckbox bind:value={$darkMode} label="Thème sombre" labelNull="Suivre le système" />
	</section>

	<form
		action="?/deleteAccount"
		method="post"
		class="delete-account"
		id="invalid-credentials-delete-account"
	>
		<h2>Supprimer mon compte</h2>
		<p class="explain typo-paragraph">
			{#if confirmingDeletion}
				{#if userHasNoEmailKey}
					Veuillez confirmer.
				{:else}
					Pour confirmer, saisissez de nouveau votre mot de passe et email.
				{/if}
			{:else}
				Cette action est irréversible. Vos annonces seront supprimées.
			{/if}
		</p>
		<section class="submit">
			{#if confirmingDeletion}
				{#if !userHasNoEmailKey}
					<InputField required label="email" id="email">
						<InputEmail value="" required name="email" />
					</InputField>
					<InputPassword label="Mot de passe" value="" required name="password" />
				{/if}
				<div class="submit-button">
					<ButtonSecondary submits dangerous
						>Je confirme la suppression de mon compte</ButtonSecondary
					>
				</div>
			{:else}
				<div class="submit-button">
					<ButtonSecondary on:click={() => (confirmingDeletion = true)} dangerous
						>Supprimer mon compte</ButtonSecondary
					>
				</div>
			{/if}
		</section>
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

	.godmode {
		display: flex;
		justify-content: space-between;
	}

	h1 {
		text-align: center;
		margin-bottom: 0.5rem;
	}

	.status {
		text-align: center;
	}

	form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
	}

	section.theme h2 {
		margin-bottom: 1rem;
	}

	section.submit {
		display: flex;
		justify-content: center;
	}

	.side-by-side {
		display: flex;
		gap: 1rem;
	}

	form.delete-account {
		padding: 2rem;
		border-radius: 1rem;
		--bg: var(--rose);
		--fg: var(--blood);
		background-color: var(--bg);
	}

	form.delete-account section.submit {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}
</style>
