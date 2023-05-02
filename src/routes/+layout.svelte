<script lang="ts">
	import { dev } from '$app/environment';
	import { navigating, page } from '$app/stores';
	import ButtonCircle from '$lib/ButtonCircle.svelte';
	import Icon from '$lib/Icon.svelte';
	import LogoLoca7 from '$lib/LogoLoca7.svelte';
	import LogoNet7 from '$lib/LogoNet7.svelte';
	import NavigationBar from '$lib/NavigationBar.svelte';
	import { darkMode, dismissedN7ienOnlyWarning } from '$lib/stores';
	import { closeToast, toasts } from '$lib/toasts';
	import { dedent } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import xss from 'xss';
	import type { PageData } from './$types';
	import { tooltip } from '$lib/tooltip';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import { CONTACT_EMAIL } from '$lib/constants';
	import { onMount } from 'svelte';
	export let data: PageData;

	let ready = false;

	onMount(() => {
		const html = document.querySelector('html')!;
		darkMode.subscribe((value) => {
			html.dataset.darkMode = JSON.stringify(value);
		});
		ready = true;
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="/vendor/leaflet.css" />
	<link rel="stylesheet" href="/vendor/leaflet-gesture-handling.min.css" />
	<script src="/vendor/leaflet.js"></script>
	<script src="/vendor/leaflet-gesture-handling.js"></script>
	<script src="/vendor/polyfills/inert.min.js"></script>
</svelte:head>

{#if !ready || $navigating}
	<aside class="loading">
		<div class="content">
			<h1>Chargement en cours…</h1>
		</div>
	</aside>
{:else if !$dismissedN7ienOnlyWarning && !data.user}
	<aside class="n7ien-warning">
		<div class="content">
			<h1>Ce site est réservé aux (futur·e·s) élève·e·s de l'ENSEEIHT</h1>
			<section class="options">
				<ButtonSecondary
					on:click={() => {
						$dismissedN7ienOnlyWarning = true;
						window.location.href = '/appartements/ajouter';
					}}
					icon="add">Je veux déposer une annonce</ButtonSecondary
				>
				<ButtonSecondary
					on:click={() => {
						$dismissedN7ienOnlyWarning = true;
					}}
					icon="checkmark">J'en suis un·e</ButtonSecondary
				>
			</section>
		</div>
	</aside>
{/if}

<section class="toasts">
	{#each $toasts as toast (toast.id)}
		<article transition:fly class="toast" data-type={toast.type}>
			<Icon
				color={{ error: '#fff', info: 'cobalt' }[toast.type]}
				name={{ error: 'report', info: 'information' }[toast.type]}
			/>
			{@html xss(toast.message)}
			{#if toast.closable}
				<ButtonCircle icon="close" on:click={() => closeToast(toast.id)} />
			{/if}
		</article>
	{/each}
</section>

<header>
	{#if dev}
		<div class="notice notice-dev">Hey, t'es en dev.</div>
	{:else if data.beta}
		<div class="notice notice-beta">
			<p>
				Ceci est une bêta. Vous pouvez <a
					class="in-body"
					href="https://git.inpt.fr/inp-net/loca7/-/issues/new?issue[description]={encodeURIComponent(
						dedent(
							`
                Décrivez votre problème ici.
                
                /label ~bug ~from:beta
                Submitted-From: ${$page.url}`
						)
					)}">signaler un bug</a
				>
				ou
				<a
					class="in-body"
					href="https://git.inpt.fr/inp-net/loca7/-/issues/new?issue[description]={encodeURIComponent(
						dedent(
							`
                Décrivez votre idée ici.
                
                /label ~feature ~from:beta
                Submitted-From: ${$page.url}`
						)
					)}">proposer une fonctionnalité</a
				>
			</p>
		</div>
	{/if}
	<NavigationBar
		user={data.user}
		noticeBarAbove={dev || data.beta}
		numberOfManagedAppartments={data.appartments?.filter(
			(a) => a.owner.id === data.user?.id && !a.approved && !a.archived
		).length ?? 0}
	/>
</header>

<slot />

<footer>
	<section class="help">
		<ButtonSecondary icon="question" href="mailto:{CONTACT_EMAIL}">Aide</ButtonSecondary>
	</section>
	<div class="side-by-side">
		<section class="about">
			<LogoLoca7 />
			<p class="tagline">Le site de recherche de logement pour les n7iens</p>
		</section>
		<section class="net7">
			<p>Site réalisé par</p>
			<a href="https://bde.enseeiht.fr/clubs/net7"><LogoNet7 /></a>
		</section>
		<section class="credits">
			<dl>
				<dt>code source</dt>
				<dd><a href="https://git.inpt.fr/INP-net/loca7">git.inpt.fr/inp-net/loca7</a></dd>
				<dt use:tooltip={'Pour les amatteurs de <code>jq</code> et <code>wget</code> ❤️'}>
					API
				</dt>
				<dd><a href="/appartements.json">/appartements.json</a></dd>
				<dd>en savoir plus</dd>
				<dd><a href="/à-propos">crédits</a></dd>
			</dl>
		</section>
	</div>

	<section class="technical">
		loca7 v{data.currentVersion} &bull;
		<a href="https://git.inpt.fr/inp-net/loca7/-/commits/{data.currentCommit}"
			>{data.currentCommit?.slice(0, 16)}</a
		>
	</section>
</footer>

<style>
	:global(body) {
		height: 100vh;
		flex-direction: column;
		display: flex;
		padding: 0 1rem;
	}
	:global(main) {
		flex-grow: 1;
		padding-top: 150px;
	}

	@media (max-width: 1100px) {
		:global(main) {
			padding-top: 130px;
		}
	}

	.notice {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.75rem;
		text-align: center;
		z-index: 100000;
		background-color: var(--ice);
	}

	.notice * {
		color: var(--cobalt);
	}

	.notice-dev {
		background: var(--rose);
		color: var(--blood);
	}

	footer {
		margin: 10rem 0 0;
		padding: 0 2rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
		text-align: center;
	}

	footer .side-by-side {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 6rem;
		flex-wrap: wrap;
		text-align: center;
		width: 100%;
	}

	footer section.technical {
		font-family: var(--font-mono);
		font-size: 0.75em;
	}

	footer dl {
		display: grid;
		grid-template-columns: repeat(2, max-content);
		gap: 0.25rem 1rem;
	}

	footer dl dt {
		text-align: right;
	}

	footer dl dd {
		text-align: left;
		margin: 0;
	}

	footer dl dt,
	footer dl dd {
		max-width: 45vw;
	}

	footer .net7 p {
		margin-bottom: 1rem;
	}

	.toasts {
		--inset: 1rem;
		position: fixed;
		left: var(--inset);
		right: var(--inset);
		bottom: calc(1.5 * var(--inset));
		z-index: 1000;
		display: flex;
		flex-direction: column-reverse;
		gap: 1rem;
	}

	.toasts article {
		display: grid;
		align-items: center;
		grid-template-columns: 1.5rem 1fr min-content;
		padding: 0.75rem 1rem;
		border-radius: 1rem;
		gap: 1rem;
	}

	.toasts article[data-type='error'] {
		background: var(--mushroom);
		color: #fff;
	}

	.toasts article[data-type='info'] {
		background: var(--ice);
		color: var(--cobalt);
	}

	aside {
		position: fixed;
		inset: 0;
		background-color: rgba(255, 255, 255, 0.8);
		display: flex;
		justify-content: center;
		align-items: start;
		z-index: 10000000000;
		backdrop-filter: blur(15px);
	}

	@media (prefers-color-scheme: dark) {
		:global(html[data-dark-mode='null']) aside {
			background: rgba(0, 0, 0, 0.75);
		}
	}
	:global(html[data-dark-mode='true']) aside {
		background: rgba(0, 0, 0, 0.75);
	}

	aside .content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		height: 100%;
		width: 100%;
		padding: 2rem;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		text-align: center;
	}

	aside h1 {
		line-height: 1.3;
	}

	aside .options {
		margin-top: 1rem;
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}
</style>
