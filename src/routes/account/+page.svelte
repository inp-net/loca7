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
	export let data: PageData;
	$: ({ user } = data);

	let oldPassword: string = '';
	let oldPasswordIsInvalid: boolean = $page.url.hash === '#invalidCredentials';
	let wrongCredentialsWhenConfirmingAccountDeletion =
		$page.url.hash === '#invalidCredentialsDeleteAccount';
	let newPassword: string = '';
	let confirmingDeletion = false;

	onMount(() => {
		if (wrongCredentialsWhenConfirmingAccountDeletion) {
			addToast('error', 'E-mail ou mot de passe incorrect');
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
			<InputField label="Prénom" required>
				<InputText required name="firstName" bind:value={user.firstName} />
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
		<h2>Changer de mot de passe</h2>

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
		<InputPassword
			bind:value={newPassword}
			name="newPassword"
			required
			label="Nouveau mot de passe"
			feedback
		/>
		<section class="submit">
			<ButtonSecondary submits icon="checkmark">Enregistrer</ButtonSecondary>
		</section>
	</form>

	<form
		action="?/deleteAccount"
		method="post"
		class="delete-account"
		id="invalidCredentialsDeleteAccount"
	>
		<h2>Supprimer mon compte</h2>
		<p class="explain typo-paragraph">
			{#if confirmingDeletion}
				Pour confirmer, saisissez de nouveau votre mot de passe et email
			{:else}
				Cette action est irréversible. Vos annonces seront supprimées.
			{/if}
		</p>
		<section class="submit">
			{#if confirmingDeletion}
				<InputField required label="email" id="email">
					<InputEmail value="" required name="email" />
				</InputField>
				<InputPassword label="Mot de passe" value="" required name="password" />
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
