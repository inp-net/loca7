<script lang="ts">
	import { CONTACT_EMAIL } from '$lib/constants';
</script>

<main>
	<h1>Comment ajouter une annonce sur Loca7 ?</h1>
	<h2 class="contact">Vous voulez nous contacter?</h2>
	<p>
		Pas de soucis. Vous pouvez envoyer un mail à <a href="mailto:{CONTACT_EMAIL}"
			>{CONTACT_EMAIL}</a
		>
	</p>

	<ul class="steps">
		<!-- START STEPS -->
		<li class="step">
			<div class="content">
				<span class="step-number">1.</span>
				<p>Cliquez sur "Déposer une annonce"</p>
			</div>

			<picture>
				<img src="aide/step-0.png" />
				<div class="cursor" style="top: -36.25%;"></div>
			</picture>
		</li>

		<li class="step">
			<div class="content">
				<span class="step-number">2.</span>
				<p>Créez un compte.</p>
			</div>

			<picture>
				<img src="aide/step-1.png" />
				<div class="cursor" style="top: -12.083333333333334%;"></div>
			</picture>
		</li>

		<li class="step">
			<div class="content">
				<span class="step-number">3.</span>
				<p>Une fois le compte créé, connectez-vous.</p>
			</div>

			<picture>
				<img src="aide/step-2.png" />
				<div class="cursor" style="bottom: -15%;"></div>
			</picture>
		</li>

		<li class="step">
			<div class="content">
				<span class="step-number">4.</span>
				<p>Envoyez un mail de vérification</p>
			</div>

			<picture>
				<img src="aide/step-3.png" />
				<div class="cursor" style=""></div>
			</picture>
		</li>

		<li class="step">
			<div class="content">
				<span class="step-number">5.</span>
				<p>Trouvez le mail dans votre boîte de réception.</p>
			</div>

			<picture>
				<img src="aide/step-4.png" />
				<div class="cursor" style="top: -10.208333333333334%;"></div>
			</picture>
		</li>

		<li class="step">
			<div class="content">
				<span class="step-number">6.</span>
				<p>Vérifiez votre adresse e-mail</p>
			</div>

			<picture>
				<img src="aide/step-5.png" />
				<div class="cursor" style=""></div>
			</picture>
		</li>
		<!-- END STEPS -->
		<li class="step final">
			<div class="content">
				<span class="step-number">Et voilà!</span>
				<p>
					Vous pouvez maintenant remplir les informations de votre annonce et la
					soumettre.
				</p>
			</div>
			<picture></picture>
		</li>
	</ul>
</main>

<style>
	main {
		flex-direction: column;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	h1 {
		margin-bottom: 3rem;
	}
	ul.steps {
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		gap: 4rem;
	}
	.steps li {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1rem;
	}
	.steps li.final picture {
		width: 300px;
	}
	picture {
		max-width: calc(min(100%, 300px));
		display: grid;
		aspect-ratio: 1;
		grid-column: 3;
		grid-row: 1;
	}
	.step .content {
		width: 300px;
	}
	img {
		width: 100%;
		flex: 1;
		grid-column: 1;
		grid-row: 1;
	}
	.cursor {
		position: relative;
		grid-row: 1;
		grid-column: 1;
		height: 50px;
		margin: auto;
		width: 50px;
		border-radius: 50%;
		background-color: var(--diamond-transparent);
		border: 3px solid var(--diamond);
	}
	.step-number {
		font-size: 3rem;
	}
	h2.contact {
		margin-top: 3rem;
	}
</style>
