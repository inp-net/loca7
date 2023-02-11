<script lang="ts">
	const pages = ['buttons', 'colors', 'icons', 'typography', 'inputs'];
</script>

<main>
	{#each pages as page}
		<a href="/_showcase/{page}">{page}</a>
	{/each}
</main>

<style>
	main {
		display: flex;
		gap: 2rem;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
</style>
