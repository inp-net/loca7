<script lang="ts">
	import Icon from '$lib/Icon.svelte';
	import iconNames from './all_icon_stems';
</script>

<h1>Icons</h1>

<main>
	{#each iconNames as name}
		<div class="item">
			<div class="icon">
				<Icon {name} color="fg" />
			</div>
			<p class="typo-field-label">{name.replaceAll('-', ' ')}</p>
		</div>
	{/each}
</main>

<style>
	:global(body) {
		margin: 0 auto;
		max-width: 1000px;
	}

	main {
		display: flex;
		flex-wrap: wrap;
        align-self: center;
		width: 100%;
		row-gap: 3rem;
        column-gap: 5rem;
	}

	.item {
		display: flex;
		flex-direction: column;
        align-items: center;
		width: 3rem;
	}

	.icon {
		width: 3rem;
	}
</style>
