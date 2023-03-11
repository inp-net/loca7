<script lang="ts">
	import { dev } from '$app/environment';
	import LogoLoca7 from '$lib/LogoLoca7.svelte';
	import LogoNet7 from '$lib/LogoNet7.svelte';
	import NavigationBar from '$lib/NavigationBar.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<link rel="stylesheet" href="/vendor/leaflet.css" />
	<link rel="stylesheet" href="/vendor/leaflet-gesture-handling.min.css" />
	<script src="/vendor/leaflet.js"></script>
	<script src="/vendor/leaflet-gesture-handling.js"></script>
</svelte:head>

<header>
	{#if dev}
		<div class="notice notice-dev">Hey, t'es en dev.</div>
	{:else if data.beta}
		<div class="notice notice-beta">Ceci est une bêta. Le site est encore en développement.</div>
	{/if}
	<NavigationBar user={data.user} />
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
</style>
