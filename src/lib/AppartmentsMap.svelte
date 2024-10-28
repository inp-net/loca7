<script lang="ts">
	import { run } from 'svelte/legacy';

	import { onMount } from 'svelte';
	import CardAppartment from './CardAppartment.svelte';
	import CarouselImages from './CarouselImages.svelte';
	import publicTransportColor from './publicTransportColors';
	import type { GeographicPoint } from './types';
	import { ENSEEIHT, readableOn } from './utils';
	import ButtonCircle from './ButtonCircle.svelte';
	import type { Appartment, Photo } from '@prisma/client';

	interface Props {
		appartments: (Appartment & { photos: Photo[] })[];
		center?: GeographicPoint;
		scrollIsZoom?: boolean;
		publicTransportStations?: boolean;
	}

	let {
		appartments,
		center = ENSEEIHT,
		scrollIsZoom = false,
		publicTransportStations = false
	}: Props = $props();

	let leaflet = $state();
	let map;
	let appartmentsLayer;
	const markerSize = 40;
	const boundsPadding = 0.001;

	function locationTuple(point: GeographicPoint) {
		return [point.longitude, point.latitude];
	}

	function updatePopupCloseButtonColor() {
		document.querySelectorAll('.leaflet-popup').forEach((popup) => {
			console.log(popup.querySelector('.missing-photo'));
			if (popup.querySelector('.missing-photo')) {
				popup.querySelector('.leaflet-popup-close-button span').style.color = 'black';
			}
		});
	}

	function updateMarkers(appartments: Appartment[]) {
		if (!map || !appartmentsLayer) return;
		appartmentsLayer.clearLayers();
		setTimeout(() => {
			// XXX timeout to make sure the popups have been updated before binding them to the markers
			appartments.forEach((appart) => {
				if (appart.latitude === null || appart.longitude === null) return;
				L.marker(locationTuple(appart), {
					icon: L.icon({
						iconUrl: '/icons/location-white-background.svg',
						// appartments.length === 1
						// 	? `/icons/location.svg`
						// 	: `/icons/location-${appart.kind
						// 			.toLowerCase()
						// 			.replaceAll(' ', '-')}.svg`,
						iconSize: [markerSize, markerSize],
						iconAnchor: [markerSize / 2, markerSize]
					}),
					alt: 'Appartement'
				})
					.addTo(appartmentsLayer)
					.bindPopup(
						document.querySelector(`.map-appartment-popup[data-id="${appart.id}"]`)
					);

				if (publicTransportStations) {
					[
						...new Set(appart.nearbyStations.map((s) => s.latitude + ',' + s.longitude))
					].forEach((encodedStationLocation) => {
						const [latitude, longitude] = encodedStationLocation
							.split(',')
							.map(parseFloat);
						const stations = appart.nearbyStations.filter(
							(s) => s.latitude === latitude && s.longitude === longitude
						);
						let icon = L.divIcon({
							className: `public-transport-marker-wrapper location-${latitude}-${longitude}`,
							html: stations
								.map(
									(station) =>
										`<div class="public-transport-marker" style="background-color: ${publicTransportColor(
											station
										)}; color: ${readableOn(
											publicTransportColor(station) || '#000'
										)}">${station.line}</div>`
								)
								.join(''),
							iconSize: [45 + (45 + 8) * stations.length, 23] // XXX baked in values
						});

						L.marker(locationTuple({ latitude, longitude }), { icon }).addTo(
							appartmentsLayer
						);
					});
				}
			}, 20);
		});
	}

	onMount(async () => {
		map = L.map('map', { gestureHandling: !scrollIsZoom, zoomControl: false }).setView(
			locationTuple(center),
			15
		);
		map.addControl(L.control.zoom({ position: 'bottomright' }));
		map.on('zoomend', () => {
			document.querySelectorAll('.public-transport-marker-wrapper').forEach((marker) => {
				marker.style.opacity = map.getZoom() > 15 ? '1' : '0';
			});
		});
		appartmentsLayer = L.layerGroup().addTo(map);
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution:
				'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
		}).addTo(map);

		L.marker(locationTuple(ENSEEIHT), {
			icon: L.icon({
				iconUrl: '/icons/location-enseeiht-color-alt.svg',
				iconSize: [markerSize, markerSize],
				iconAnchor: [markerSize / 2, markerSize],
				className: 'enseeiht-icon'
			}),
			alt: 'Ton école'
		})
			.addTo(map)
			.bindPopup(document.querySelector('#map + .map-marker-popups .map-enseeiht-popup'));

		const longitudes = [
			...(appartments.map((a) => a.longitude).filter((l) => l === 0 || !!l) as number[]),
			ENSEEIHT.longitude
		];
		const latitudes = [
			...(appartments.map((a) => a.latitude).filter((l) => l === 0 || !!l) as number[]),
			ENSEEIHT.latitude
		];
		map.fitBounds([
			locationTuple({
				longitude: Math.min(...longitudes) - boundsPadding,
				latitude: Math.min(...latitudes) - boundsPadding
			}),
			locationTuple({
				longitude: Math.max(...longitudes) + boundsPadding,
				latitude: Math.max(...latitudes) + boundsPadding
			})
		]);
		updateMarkers(appartments);
	});

	run(() => {
		updateMarkers(appartments);
	});
</script>

<div id="map" class="map" bind:this={leaflet}></div>

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
		{#if appart.latitude && appart.longitude}
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
		border-radius: var(--border-radius, 1rem);
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

	:global(.public-transport-marker-wrapper) {
		width: unset !important;
		transition: opacity 0.2s ease-in-out;
		display: flex;
		gap: 0.5rem;
	}

	:global(.public-transport-marker) {
		padding: 0.75em;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 15px;
	}

	:global(.leaflet-container [class^='leaflet-control-zoom']) {
		background: var(--bg);
	}
	:global(.leaflet-container [class^='leaflet-control-zoom'] span) {
		color: var(--fg);
	}
	:global(.leaflet-container [class^='leaflet-control-zoom']:hover),
	:global(.leaflet-container [class^='leaflet-control-zoom']:focus) {
		background: var(--fg);
	}
	:global(.leaflet-container [class^='leaflet-control-zoom']:hover span),
	:global(.leaflet-container [class^='leaflet-control-zoom']:focus span) {
		color: var(--bg);
	}
	:global(.leaflet-container .leaflet-control-attribution) {
		background: var(--bg);
		color: var(--fg);
	}
	:global(.leaflet-container .leaflet-control-attribution a) {
		color: var(--sky);
	}

	:global(.leaflet-container .leaflet-popup-close-button) {
		z-index: 100000;
		top: 0.5rem !important;
		right: 0.5rem !important;
		padding: 0.25rem;
		background-color: white !important;
		border-radius: 100000px;
	}
	:global(.leaflet-container .leaflet-popup-close-button span) {
		color: black;
		font-size: 2rem;
	}

	:global(.leaflet-container .leaflet-popup-close-button:hover span),
	:global(.leaflet-container .leaflet-popup-close-button:focus span) {
		color: white;
	}
	:global(.leaflet-container .leaflet-popup-close-button:hover),
	:global(.leaflet-container .leaflet-popup-close-button:focus) {
		background-color: black !important;
	}
</style>
