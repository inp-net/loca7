<script lang="ts">
	import ButtonNavigation from './ButtonNavigation.svelte';
	import ButtonSecondary from './ButtonSecondary.svelte';
	import { page } from '$app/stores';
	import type { User } from './types';
	import { afterUpdate, onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let user: User | null = null;
	let topbarElement: HTMLElement;
	let sidebarOpen: boolean = false;
	export const isCurrentPage = (page: typeof $page, path: string) => page.url.pathname === path;

	onMount(() => {
		if (browser) {
			window.addEventListener('scroll', () => {
				scrolled = window.scrollY > 0;
			});
		}
	});

	afterUpdate(() => {
		document.body.querySelector('main').style.paddingTop = `${
			topbarElement.getBoundingClientRect().height + 30
		}px`;
	});

	let scrolled: boolean = false;
</script>

<nav class:scrolled class="topbar" bind:this={topbarElement} class:logged-in={user !== null}>
	<a href="/"><img src="/loca7-wordmark.png" alt="loca7" class="logo" /></a>
	{#if user}
		<ButtonSecondary id="open-menu" on:click={() => (sidebarOpen = !sidebarOpen)} icon="menu"
			>Menu</ButtonSecondary
		>
		<ul class="links">
			<li>
				<ButtonNavigation current={isCurrentPage($page, '/')} href="/">recherche</ButtonNavigation>
			</li>
			<li>
				<ButtonNavigation
					current={isCurrentPage($page, '/appartements/gerer')}
					href="/appartements/gerer">mes annonces</ButtonNavigation
				>
			</li>
			<li>
				<ButtonNavigation current={isCurrentPage($page, '/account')} href="/account"
					>mon compte</ButtonNavigation
				>
			</li>
		</ul>
	{/if}

	<ul class="actions">
		<li>
			<ButtonSecondary icon="add" href="/appartements/ajouter">Déposer une annonce</ButtonSecondary>
		</li>
		{#if user}
			<li>
				<ButtonSecondary href="/account" icon="user">Mon compte</ButtonSecondary>
			</li>
			<li>
				<form method="post">
					<ButtonSecondary formaction="/logout" icon="logout">Se déconnecter</ButtonSecondary>
				</form>
			</li>
		{:else}
			<li>
				<ButtonSecondary href="/login">Connexion</ButtonSecondary>
			</li>
		{/if}
	</ul>
</nav>

<nav class="sidebar" class:open={sidebarOpen}>
	<ul>
		<li class="logo">
			<img src="/loca7-wordmark.png" alt="loca7" />
		</li>
		<li>
			<ButtonNavigation current={isCurrentPage($page, '/')} href="/">recherche</ButtonNavigation>
		</li>
		<li>
			<ButtonNavigation
				current={isCurrentPage($page, '/appartements/gerer')}
				href="/appartements/gerer">mes annonces</ButtonNavigation
			>
		</li>

		<li>
			<ButtonNavigation current={isCurrentPage($page, '/account')} href="/account"
				>mon compte</ButtonNavigation
			>
		</li>
		<li>
			<ButtonSecondary icon="add" href="/appartements/ajouter">Déposer une annonce</ButtonSecondary>
		</li>
		<li>
			<form method="post">
				<ButtonSecondary formaction="/logout" icon="logout">Se déconnecter</ButtonSecondary>
			</form>
		</li>
	</ul>
</nav>

<svelte:body
	on:click={(e) => {
		if (
			sidebarOpen &&
			(!e
				.composedPath()
				.some(
					(el) =>
						el === document.querySelector('.sidebar') || el === document.querySelector('#open-menu')
				) ||
				(e.composedPath().some((el) => el === document.querySelector('.sidebar')) &&
					e.composedPath().some((el) => el.tagName === 'A')))
		) {
			sidebarOpen = false;
		}
	}}
/>

<style>
	nav.topbar {
		display: flex;
		padding: 2rem 4rem;
		justify-content: space-between;
		flex-wrap: wrap;
		position: fixed;
		z-index: 10000;
		top: 0;
		left: 0;
		right: 0;
		background: var(--bg);
		flex-wrap: wrap;
		gap: 1rem;
		box-shadow: transparent;
		transition: all 0.25s ease;
	}

	nav.topbar.scrolled {
		box-shadow: -0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.25);
	}

	.logo {
		max-height: 2rem;
	}

	nav.topbar ul {
		padding: 0;
		list-style: none;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	:global(#open-menu) {
		display: none;
	}

	@media (max-width: 1100px) {
		.logo {
			/* height: 5rem; */
			max-height: 3rem;
			margin-bottom: 0.5rem;
		}
		nav.topbar {
			flex-direction: column;
			align-items: center;
			text-align: center;
		}
		.logged-in .links,
		.logged-in .actions {
			display: none;
		}
		.actions {
			align-items: center;
			display: flex;
		}
		:global(#open-menu) {
			display: flex;
		}
	}

	nav.sidebar {
		position: fixed;
		display: flex;
		flex-direction: column;
		top: 0;
		left: 0;
		bottom: 0;
		width: 60vw;
		background: var(--bg);
		padding: 2rem;
		z-index: 100;
		overflow-y: auto;
		box-shadow: 0 0 0 300vw rgba(0, 0, 0, 0.25);
		transition: all 0.25s ease;
		z-index: 11000;
	}

	nav.sidebar:not(.open) {
		left: -200vw;
		box-shadow: 0 0 0 100vw transparent;
	}

	nav.sidebar ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	nav.sidebar li.logo img {
		max-height: 1.5rem;
		max-width: 100%;
	}
</style>
