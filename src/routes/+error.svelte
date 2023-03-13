<script lang="ts">
	import { page } from '$app/stores';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
</script>

<main>
	{#if $page.status == 404}
		<h1>Page introuvable</h1>
		<p>
			{@html $page?.error?.message ??
				"On n'a pas trouvé cette page, par contre, on peut vous trouver un appart."}
		</p>
		<section class="actions">
			<ButtonPrimary href="/">Accueil</ButtonPrimary>
		</section>
	{:else}
		<h1>Oops!</h1>
		<p>
			{@html $page?.error?.message === 'Internal Error'
				? 'Erreur interne'
				: $page.error?.message ?? "Quelque chose s'est mal passé."}
		</p>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	p {
		margin-top: 0.5rem;
	}

	section.actions {
		margin-top: 2rem;
	}
</style>
