<script lang="ts">
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
</script>

<main>
	<section class="ajouter">
		<ButtonPrimary href="/appartements/ajouter">Poster une nouvelle annonce</ButtonPrimary>
	</section>
</main>

<style>
	.ajouter {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-wrap: wrap;
	}
</style>
