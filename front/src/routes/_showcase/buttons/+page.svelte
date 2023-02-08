<script lang="ts">
	import ButtonCircle from '$lib/ButtonCircle.svelte';
	import ButtonColored from '$lib/ButtonColored.svelte';
	import ButtonFloating from '$lib/ButtonFloating.svelte';
	import ButtonNavigation from '$lib/ButtonNavigation.svelte';
	import ButtonPrimary from '$lib/ButtonPrimary.svelte';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
</script>

<h1>Buttons</h1>

<main>
	<label for="primary">Primary</label>
	<ButtonPrimary id="primary">Label</ButtonPrimary>

	<label for="secondary">Secondary</label>
	<ButtonSecondary id="secondary" icon="map">Label</ButtonSecondary>

	<label for="secondary-dangerous">Secondary, dangerous</label>
	<ButtonSecondary id="secondary-dangerous" icon="map" dangerous>Label</ButtonSecondary>

	<label for="floating">Floating</label>
	<ButtonFloating id="floating" icon="map" />

	<label for="circle">Circle</label>
	<ButtonCircle id="circle" icon="map" />

	<label for="colored">Colored</label>
	<ButtonColored id="colored">Label</ButtonColored>

	<label for="colored-dangerous">Colored, dangerous</label>
	<ButtonColored id="colored-dangerous" dangerous>Label</ButtonColored>

	<label for="colored-warns">Colored, warns</label>
	<ButtonColored id="colored-warns" warns>Label</ButtonColored>

	<label for="colored-successful">Colored, successful</label>
	<ButtonColored id="colored-successful" successful>Label</ButtonColored>

	<label for="navigation">Navigation</label>
	<ButtonNavigation href="test" id="navigation">Label</ButtonNavigation>

	<label for="navigation-current">Navigation, current</label>
	<ButtonNavigation current href="test" id="navigation-current">Label</ButtonNavigation>
</main>

<style>
	:global(body) {
		margin: 0 auto;
		max-width: 1200px;
		display: flex;
		align-items: center;
		flex-direction: column;
	}

	main {
		display: grid;
		grid-template-columns: min-content min-content;
		gap: 3rem;
	}
</style>
