<script lang="ts">
	import { photoURL } from '$lib/photos';
	import { appartmentShortDescription, appartmentTitle } from '$lib/types';
	import type { LayoutData } from './$types';
	export let data: LayoutData;
	const appartment = data.appartment;
</script>

<svelte:head>
	<meta name="og:type" content="website" />
	<meta name="og:title" content="Loca7: {appartmentTitle(appartment)}" />
	<meta name="description" content={appartmentShortDescription(appartment)} />
	<meta name="og:description" content={appartmentShortDescription(appartment)} />
	{#if appartment.photos.length > 0}
		<meta name="og:image" content={photoURL(appartment.photos[0])} />
	{/if}
</svelte:head>

<slot />
