<script lang="ts">
	import ButtonNavigation from './ButtonNavigation.svelte';
	import ButtonSecondary from './ButtonSecondary.svelte';
	import { page } from '$app/stores';
	import type { User } from './types';
	import { afterUpdate, onMount } from 'svelte';
	import { browser } from '$app/environment';
	import LogoLoca7 from './LogoLoca7.svelte';
	import ButtonPrimary from './ButtonPrimary.svelte';
	import { CONTACT_EMAIL } from './constants';
	import { tooltip } from './tooltip';

	export let user: User | null = null;
	export let noticeBarAbove: boolean = false;
	export let numberOfManagedOnlineAppartments: number = 0;

	let topbarElement: HTMLElement;
	let sidebarOpen: boolean = false;
	let currentPage: 'recherche' | 'administration' | 'mes annonces' | 'mon compte' = 'recherche';

	function getCurrentPage(url: URL): typeof currentPage {
		if (url.pathname.startsWith('/validate-email') && url.searchParams.has('go')) {
			const goto = new URL(url.protocol + '//' + url.host + url.searchParams.get('go')!);
			return getCurrentPage(goto);
		}
		if (url.pathname.startsWith('/administration')) return 'administration';
		if (
			url.pathname.startsWith('/appartements/gerer') ||
			url.pathname.startsWith('/appartements/ajouter') ||
			/^\/appartements\/[^\/]+\/modifier/.test(url.pathname)
		)
			return 'mes annonces';
		if (url.pathname.startsWith('/account')) return 'mon compte';
		return 'recherche';
	}

	$: currentPage = getCurrentPage($page.url);

	onMount(() => {
		if (browser) {
			window.addEventListener('scroll', () => {
				scrolled = window.scrollY > 0;
			});
		}
	});

	afterUpdate(() => {
		const setPadding = () => {
			const main = document.body.querySelector('main');
			const html = document.querySelector('html');
			if (!main || !html || !topbarElement) return;
			const padding =
				topbarElement.offsetTop + topbarElement.getBoundingClientRect().height + 30;
			main.style.paddingTop = padding + 'px';
			html.style.scrollPaddingTop = padding + 'px';
		};

		setPadding();
		window.addEventListener('resize', setPadding);
	});

	let scrolled: boolean = false;
</script>

<nav
	class:scrolled
	class:noticeBarAbove
	class="topbar"
	bind:this={topbarElement}
	class:logged-in={user !== null}
>
	<a href="/">
		<LogoLoca7 />
	</a>
	{#if user}
		<ButtonSecondary id="open-menu" on:click={() => (sidebarOpen = !sidebarOpen)} icon="menu"
			>Menu</ButtonSecondary
		>
		<ul class="links">
			<li>
				<ButtonNavigation current={currentPage === 'recherche'} href="/"
					>Recherche</ButtonNavigation
				>
			</li>
			{#if user?.admin}
				<li>
					<ButtonNavigation
						current={currentPage === 'administration'}
						href="/administration">Administration</ButtonNavigation
					>
				</li>
			{/if}
			<li>
				<ButtonNavigation
					current={currentPage === 'mes annonces'}
					href="/appartements/gerer"
					>Mes annonces
				</ButtonNavigation>
				{#if numberOfManagedOnlineAppartments > 0}
					<div
						class="pill"
						title={`Vous avez ${
							numberOfManagedOnlineAppartments === 1
								? 'une annonce'
								: numberOfManagedOnlineAppartments + ' annonces'
						} en ligne`}
						use:tooltip={`Vous avez ${
							numberOfManagedOnlineAppartments === 1
								? 'une annonce'
								: numberOfManagedOnlineAppartments + ' annonces'
						} en ligne`}
					>
						{numberOfManagedOnlineAppartments}
					</div>
				{/if}
			</li>
			<li>
				<ButtonNavigation current={currentPage === 'mon compte'} href="/account"
					>Mon compte</ButtonNavigation
				>
			</li>
		</ul>
	{/if}

	<ul class="actions">
		{#if user}
			<li>
				<ButtonSecondary href="/aide" icon="question">Aide</ButtonSecondary>
			</li>
			<li>
				<form method="post" action="/logout">
					<ButtonSecondary submits icon="logout">Se déconnecter</ButtonSecondary>
				</form>
			</li>
		{:else}
			<li>
				<ButtonSecondary icon="user" href="/login">Connexion</ButtonSecondary>
			</li>
			<li class="post">
				<ButtonPrimary smaller icon="add" href="/appartements/ajouter"
					>Déposer une annonce</ButtonPrimary
				>
			</li>
		{/if}
	</ul>
</nav>

<nav
	class="sidebar"
	aria-expanded={sidebarOpen ? 'true' : 'false'}
	inert={!sidebarOpen || undefined}
>
	<ul>
		<li class="logo">
			<LogoLoca7 />
		</li>
		<li>
			<ButtonNavigation current={currentPage === 'recherche'} href="/"
				>Recherche</ButtonNavigation
			>
		</li>
		{#if user?.admin}
			<li>
				<ButtonNavigation current={currentPage === 'administration'} href="/administration"
					>Administration</ButtonNavigation
				>
			</li>
		{/if}
		<li>
			<ButtonNavigation current={currentPage === 'mes annonces'} href="/appartements/gerer"
				>Mes annonces</ButtonNavigation
			>
			{#if numberOfManagedOnlineAppartments > 0}
				<span class="pill">{numberOfManagedOnlineAppartments}</span>
			{/if}
		</li>

		<li>
			<ButtonNavigation current={currentPage === 'mon compte'} href="/account"
				>Mon compte</ButtonNavigation
			>
		</li>
		<li>
			<ButtonSecondary icon="add" href="/appartements/ajouter"
				>Déposer une annonce</ButtonSecondary
			>
		</li>
		<li>
			<form method="post" action="/logout">
				<ButtonSecondary submits icon="logout">Se déconnecter</ButtonSecondary>
			</form>
		</li>
		<li>
			<ButtonSecondary icon="question" href="/aide">Aide</ButtonSecondary>
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
						el === document.querySelector('.sidebar') ||
						el === document.querySelector('#open-menu')
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
		align-items: center;
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

	nav.topbar.noticeBarAbove {
		top: 40px;
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
		align-items: center;
	}

	:global(#open-menu) {
		display: none;
	}

	@media (max-width: 1350px) {
		.logo {
			/* height: 5rem; */
			max-height: 3rem;
			margin-bottom: 0.5rem;
		}
		nav.topbar {
			align-items: center;
			text-align: center;
			padding: 1.5rem 2rem;
		}
		nav.topbar .post {
			display: none;
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

	@media (min-width: 1350px) {
		:global(#post-appartment-cta) {
			display: none;
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

	nav.sidebar:not([aria-expanded='true']) {
		left: -200vw;
		box-shadow: 0 0 0 100vw transparent;
		pointer-events: none;
	}

	nav.sidebar ul {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	nav.sidebar li.logo :global(svg) {
		max-height: 1.5rem;
		max-width: 100%;
	}

	.pill {
		display: inline-block;
		border-radius: 1000px;
		padding: 0.125rem 0.5rem;
		background: var(--ice);
		color: var(--cobalt);
		font-family: var(--font-mono);
		font-weight: bold;
	}
</style>
