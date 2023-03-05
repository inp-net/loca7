<script lang="ts">
	import { onMount } from 'svelte';
	import CardAppartment from './CardAppartment.svelte';
	import CarouselImages from './CarouselImages.svelte';
	import type { Appartment } from './types';
	import { ENSEEIHT, type GeographicPoint } from './utils';
	export let appartments: Appartment[];

	export let center: GeographicPoint = ENSEEIHT;
	export let scrollIsZoom: boolean = false;

	let leaflet;
	let map;
	let appartmentsLayer;
	const markerSize = 40;

	function updateMarkers(appartments: Appartment[]) {
		if (!map || !appartmentsLayer) return;
		appartmentsLayer.clearLayers();
		setTimeout(() => {
			// XXX timeout to make sure the popups have been updated before binding them to the markers
			appartments.forEach((appart) => {
				if (appart.location === null) return;
				L.marker(appart.location.tuple(), {
					icon: L.icon({
						iconUrl:
							appartments.length === 1
								? `/icons/location.svg`
								: `/icons/location-${appart.kind.toLowerCase().replaceAll(' ', '-')}.svg`,
						iconSize: [markerSize, markerSize],
						iconAnchor: [markerSize / 2, markerSize]
					}),
					alt: 'Appartement'
				})
					.addTo(appartmentsLayer)
					.bindPopup(document.querySelector(`.map-appartment-popup[data-id="${appart.id}"]`));
			});
		}, 20);
	}

	onMount(async () => {
		map = L.map('map', { gestureHandling: !scrollIsZoom }).setView(center.tuple(), 15);
		appartmentsLayer = L.layerGroup().addTo(map);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
		}).addTo(map);
		L.marker(ENSEEIHT.tuple(), {
			icon: L.icon({
				iconUrl: '/icons/location-enseeiht.svg',
				iconSize: [markerSize, markerSize],
				iconAnchor: [markerSize / 2, markerSize],
				className: 'enseeiht-icon'
			}),
			alt: 'Ton école'
		})
			.addTo(map)
			.bindPopup(document.querySelector('#map + .map-marker-popups .map-enseeiht-popup'));
		updateMarkers(appartments);
	});

	$: updateMarkers(appartments);
</script>

<div id="map" class="map" bind:this={leaflet} />

<aside class="map-marker-popups">
	<div class="map-enseeiht-popup">
		<div class="photos">
			<CarouselImages
				images={[
					'/photos/enseeiht-entrée.png',
					'/photos/enseeiht-cour.png',
					'/photos/enseeiht-bâtiment-chercheurs.png'
				]}
			/>
		</div>
		<div class="text">
			<p class="typo-big-figure">ENSEEIHT</p>
			<p class="typo-paragraph">Ton école!</p>
		</div>
	</div>
	{#each appartments as appart (appart.id)}
		{#if appart.location}
			<div class="map-appartment-popup" data-id={appart.id}>
				<CardAppartment {...appart} small />
			</div>
		{/if}
	{/each}
</aside>

<style>
	#map {
		height: 100%;
		width: 100%;
	}

	aside {
		display: none;
	}

	:global(#map .leaflet-popup-content-wrapper, #map .leaflet-popup-tip) {
		background: var(--bg);
	}

	:global(#map .leaflet-popup-content) {
		margin: 0;
		padding: 0;
		line-height: unset;
		width: 100% !important;
	}

	.map-enseeiht-popup {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.map-enseeiht-popup .text {
		padding: 1rem 2rem;
	}

	.map-enseeiht-popup .photos {
		width: 100%;
		max-width: 300px;
		height: 150px;
		overflow: hidden;
	}

	.map-appartment-popup {
		width: 300px;
	}

	:global(#map .leaflet-popup-content p) {
		margin: unset;
	}

	:global(#map .enseeiht-icon) {
		/* source: https://codepen.io/sosuke/pen/Pjoqqp */
		filter: invert(52%) sepia(64%) saturate(3673%) hue-rotate(167deg) brightness(94%) contrast(101%);
	}
</style>
