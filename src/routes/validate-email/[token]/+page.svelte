<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
</script>

<main>
	<h1>Votre adresse e-mail a bien été vérifiée.</h1>

	<ButtonPrimary href="/">Retour à l'accueil</ButtonPrimary>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	h1 {
		margin-bottom: 1rem;
	}
</style>
