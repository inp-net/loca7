<script lang="ts">
	import { dev } from '$app/environment';
	import ButtonCircle from '$lib/ButtonCircle.svelte';
	import Icon from '$lib/Icon.svelte';
	import LogoLoca7 from '$lib/LogoLoca7.svelte';
	import LogoNet7 from '$lib/LogoNet7.svelte';
	import NavigationBar from '$lib/NavigationBar.svelte';
	import { closeToast, toasts } from '$lib/toasts';
	import { fly } from 'svelte/transition';
	import xss from 'xss';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<link rel="stylesheet" href="/vendor/leaflet.css" />
	<link rel="stylesheet" href="/vendor/leaflet-gesture-handling.min.css" />
	<script src="/vendor/leaflet.js"></script>
	<script src="/vendor/leaflet-gesture-handling.js"></script>
</svelte:head>

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
			Ceci est une bêta. Le site est encore en développement.
		</div>
	{/if}
	<NavigationBar user={data.user} noticeBarAbove={dev || data.beta} />
</header>

<slot />

<footer>
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

			<dt>design, code</dt>
			<dd><a href="https://ewen.works">Ewen Le Bihan</a></dd>

			<dt>logo, administration</dt>
			<dd>Lubin Gauthier</dd>
		</dl>
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
		padding-top: 170px;
	}

	.notice {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 40px;
		text-align: center;
		z-index: 100000;
		background-color: var(--ice);
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
		justify-content: center;
		gap: 4rem;
		flex-wrap: wrap;
		text-align: center;
	}

	footer dl {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.25rem 1rem;
	}

	footer dl dt {
		text-align: right;
	}

	footer dl dd {
		text-align: left;
		margin: 0;
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
</style>
