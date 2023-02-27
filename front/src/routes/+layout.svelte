<script>
	import NavigationBar from '$lib/NavigationBar.svelte';
</script>

<header>
	<NavigationBar />
</header>

<slot />

<footer>
	<section class="about">
		<img src="/loca7-wordmark.png" alt="loca7" class="logo" />
		<p class="tagline">Le site de recherche de logement pour les n7iens</p>
	</section>

	<section class="net7">
		<p>Site réalisé par</p>
		<a href="https://bde.enseeiht.fr/clubs/net7"
			><img src="/net7-wordmark.png" alt="net7" class="logo" /></a
		>
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
	}
	img.logo {
		max-width: 500px;
		max-height: 50px;
		display: flex;
		margin: 0 auto;
		margin-bottom: 1rem;
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
