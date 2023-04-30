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
	<meta
		name="og:image"
		content={appartment.photos.length > 0
			? photoURL(appartment.photos[0])
			: '/missing-photo.png'}
	/>
</svelte:head>

<slot />
