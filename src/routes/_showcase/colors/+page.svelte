<script lang="ts">
	const names = [
		['fg', 'muted', 'bg'],
		['ice', 'diamond', 'sky', 'cobalt'],
		['moss', 'acid', 'cactus'],
		['plaster', 'gold', 'safran'],
		['rose', 'mushroom', 'blood']
	];
</script>

<h1>Colors</h1>

<main>
	{#each names as row}
		<div class="row">
			{#each row as name}
				<div class="item">
					<div class="swatch" style="background-color: var(--{name})"></div>
					<p class="typo-field-label">{name}</p>
				</div>
			{/each}
		</div>
	{/each}
</main>

<style>
	:global(body) {
		margin: 0 auto;
		max-width: 1000px;
	}

	h1 {
		margin-bottom: 5rem;
	}

	main {
		display: flex;
		flex-wrap: wrap;
		align-self: center;
		flex-direction: column;
		width: 100%;
		row-gap: 2rem;
	}

	.row {
		display: flex;
		flex-direction: row;
		gap: 5rem;
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 6rem;
	}

	.swatch {
		width: 6rem;
		height: 6rem;
		margin-bottom: 1rem;
	}
</style>
