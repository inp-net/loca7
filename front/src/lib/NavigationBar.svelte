<script lang="ts">
	import ButtonNavigation from './ButtonNavigation.svelte';
	import ButtonSecondary from './ButtonSecondary.svelte';
	import { user } from './stores';
	import { page } from '$app/stores';
</script>

<nav>
	<img src="/loca7-wordmark.png" alt="loca7" class="logo" />
	{#if $user}
		<ul class="links">
			<li>
				<ButtonNavigation current={$page.url.toString() === '/'} href="/"
					>recherche</ButtonNavigation
				>
			</li>
			<li>
				<ButtonNavigation
					current={$page.url.toString() === '/appartements/gerer'}
					href="/appartements/gerer">mes annonces</ButtonNavigation
				>
			</li>
		</ul>
	{/if}

	<ul class="actions">
		{#if $user}
			<li>
				<ButtonSecondary href="/login">Connexion</ButtonSecondary>
			</li>
			<li>
				<ButtonSecondary href="/appartements/ajouter">Déposer une annonce</ButtonSecondary>
			</li>
		{:else}
			<li>
				<ButtonSecondary href="/account" icon="user">Mon compte</ButtonSecondary>
			</li>
		{/if}
	</ul>
</nav>

<style>
	nav {
		display: flex;
		padding: 2rem 4rem;
		justify-content: space-between;
	}

	.logo {
		max-height: 2rem;
	}

	ul {
		padding: 0;
		list-style: none;
		display: flex;
		gap: 1rem;
	}
</style>
