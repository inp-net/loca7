<script lang="ts">
	import ButtonNavigation from './ButtonNavigation.svelte';
	import ButtonSecondary from './ButtonSecondary.svelte';
	import { page } from '$app/stores';
	import type { User } from './types';
	export let user: User | null;
</script>

<nav>
	<a href="/"><img src="/loca7-wordmark.png" alt="loca7" class="logo" /></a>
	{#if user}
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
		{#if user}
			<li>
				<ButtonSecondary href="/account" icon="user">Mon compte</ButtonSecondary>
			</li>
			<form method="post">
				<li>
					<ButtonSecondary formaction="/logout" icon="logout">Déconnexion</ButtonSecondary>
				</li>
			</form>
		{:else}
			<li>
				<ButtonSecondary href="/login">Connexion</ButtonSecondary>
			</li>
			<li>
				<ButtonSecondary href="/appartements/ajouter">Déposer une annonce</ButtonSecondary>
			</li>
		{/if}
	</ul>
</nav>

<style>
	nav {
		display: flex;
		padding: 2rem 4rem;
		justify-content: space-between;
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		right: 0;
		background: var(--bg);
		flex-wrap: wrap;
		gap: 1rem;
	}

	.logo {
		max-height: 2rem;
	}

	ul {
		padding: 0;
		list-style: none;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>
