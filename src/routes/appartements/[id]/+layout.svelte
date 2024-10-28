<script lang="ts">
	import { photoURL } from '$lib/photos';
	import { appartmentShortDescription, appartmentTitle } from '$lib/types';
	import type { LayoutData } from './$types';
	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	const appartment = data.appartment;
</script>

<svelte:head>
	<meta name="og:type" content="website" />
	<meta name="og:title" content="Loca7: {appartmentTitle(appartment)}" />
	<meta name="description" content={appartmentShortDescription(appartment)} />
	<meta name="og:description" content={appartmentShortDescription(appartment)} />
	<meta
		name="og:image"
		content={'https://loca7.fr/' +
			(appartment.photos.length > 0 ? photoURL(appartment.photos[0]) : '/missing-photo.png')}
	/>
</svelte:head>

{@render children?.()}
