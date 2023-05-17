<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ButtonColored from './ButtonColored.svelte';
	import CarouselImages from './CarouselImages.svelte';
	import Icon from './Icon.svelte';
	import {
		DISPLAY_APPARTMENT_KIND,
		type GeographicPoint,
		type AppartmentKind,
		type Photo
	} from './types';
	import type { Like, TravelTimeToN7, User } from '@prisma/client';
	import { photoURL } from './photos';
	import {
		availableAtSentence,
		distanceBetween,
		distanceDisplay,
		durationDisplay,
		ENSEEIHT,
		isToday
	} from './utils';
	import { tooltip } from './tooltip';
	const emit = createEventDispatcher();

	export let photos: Photo[] | null;
	export let archived: boolean;
	export let id: string;
	export let rent: number;
	export let charges: number;
	export let surface: number;
	export let kind: AppartmentKind;
	export let roomsCount: number;
	export let travelTimeToN7: TravelTimeToN7 | null;
	export let availableAt: Date;
	export let address: string;
	export let latitude: number | null;
	export let longitude: number | null;
	export let hasFurniture: boolean | null;
	export let hasParking: boolean | null;
	export let hasBicycleParking: boolean | null;
	export let hasFiberInternet: boolean | null;
	export let hasElevator: boolean | null;
	export let editable: boolean = false;
	export let small: boolean = false;
	export let likes: Like[] = [];

	let secondsAvailableSince = (Date.now() - availableAt.valueOf()) * 1e-3;
</script>

<article class:editable class:small class:photo-is-clickable={photos?.length < 2}>
	<section class="photos">
		<svelte:element
			this={photos?.length < 2 ? 'a' : 'div'}
			href={photos?.length < 2 ? `/appartements/${id}` : undefined}
			class="photo-maybe-link"
		>
			<CarouselImages
				cover
				images={photos?.length > 0 ? photos?.map(photoURL) : ['/missing-photo.png']}
			/>
		</svelte:element>
	</section>
	<a class="content" href="/appartements/{id}">
		<section class="figures">
			<section class="price">
				<p class="typo-big-figure rent">{rent + charges}€</p>
				<p class="charges">
					{#if !small}
						dont {charges}€ de charges<br />
					{/if}
					{#if surface > 0}
						soit {Math.round((rent + charges) / surface)} €/m²
					{/if}
				</p>
			</section>
			{#if surface}
				<section class="space">
					<p class="typo-big-figure surface">{surface}m²</p>
					<p class="type">
						{DISPLAY_APPARTMENT_KIND[kind]}
						{#if roomsCount && kind === 'colocation'}<br />de {roomsCount} chambres{/if}
					</p>
				</section>
			{/if}
		</section>
		{#if !small}
			<section class="situation">
				{#if availableAt.valueOf() >= Date.now()}
					<span class="icon"><Icon name="calendar" /></span>
					<p class="when">
						{availableAtSentence(secondsAvailableSince, availableAt)}
						{#if !isToday(availableAt)}
							<span class="muted"
								>{#if secondsAvailableSince > 0}il y a{:else}dans{/if}
								{durationDisplay(Math.abs(secondsAvailableSince))}</span
							>
						{/if}
					</p>
				{/if}
				<span class="icon"><Icon name="location" /></span>
				<p class="where">
					{address}
					{#if latitude && longitude}
						<span class="muted"
							>à {distanceDisplay(
								distanceBetween({ latitude, longitude }, ENSEEIHT)
							)}</span
						>
					{/if}
				</p>
				{#if travelTimeToN7?.byBike || travelTimeToN7?.byFoot || travelTimeToN7?.byPublicTransport}
					<span
						class="icon"
						use:tooltip={"Temps de trajet entre l'école et cet appartement"}
						><Icon name="travel" /></span
					>
					<p class="travel">
						{#if travelTimeToN7.byFoot !== null}
							{durationDisplay(travelTimeToN7.byFoot)} à pied
						{/if}
						{#if travelTimeToN7.byBike !== null}
							, {durationDisplay(travelTimeToN7.byBike)} à vélo
						{/if}
						{#if travelTimeToN7.byPublicTransport !== null}
							, {durationDisplay(travelTimeToN7.byPublicTransport)} en transports<wbr
							/>
						{/if}
					</p>
				{/if}
			</section>
			<section class="criteria">
				{#if hasFurniture !== null}
					<p class="furniture">
						<span class="icon"
							><Icon name="furniture{!hasFurniture ? '-cancel' : ''}" /></span
						>
						{hasFurniture ? 'Meublé' : 'Non meublé'}
					</p>
				{/if}
				{#if hasParking !== null}
					<p class="parking">
						<span class="icon"
							><Icon name="parking{!hasParking ? '-cancel' : ''}" /></span
						>
						{hasParking ? 'Place de parking' : 'Pas de place de parking'}
					</p>
				{/if}
				{#if hasBicycleParking !== null}
					<p class="bicycle-parking">
						<span class="icon"
							><Icon name="bike{!hasBicycleParking ? '-cancel' : ''}" /></span
						>
						{hasBicycleParking ? 'Place pour vélo' : 'Pas de place pour vélo'}
					</p>
				{/if}
				{#if hasFiberInternet !== null}
					<p class="fiber-internet">
						<span class="icon"
							><Icon
								name="fiber-internet{!hasFiberInternet ? '-cancel' : ''}"
							/></span
						>
						{hasFiberInternet ? 'Fibre optique' : 'Pas de fibre optique'}
					</p>
				{/if}
				{#if hasElevator !== null}
					<p class="elevator">
						<span class="icon"
							><Icon name="elevator{!hasElevator ? '-cancel' : ''}" /></span
						>
						{hasElevator ? 'Ascenseur' : "Pas d'ascenseur"}
					</p>
				{/if}
				{#if likes.length > 0}
					<p
						class="likes"
						use:tooltip={(likes.length > 1
							? `${likes.length} personnes sont intéréssées`
							: `Une personne est intéréssée`) + ` par cette annonce`}
					>
						<span class="icon">
							<Icon name="heart" />
						</span>
						{likes.length}
					</p>
				{/if}
			</section>
		{/if}
	</a>
	{#if editable}
		<section class="editable">
			<ButtonColored href="/appartements/{id}/modifier">Modifier</ButtonColored>
			{#if !archived}
				<ButtonColored
					on:click={async () => {
						await fetch(`/appartements/${id}/archiver`, { method: 'POST' });
						window.location.reload();
					}}>Archiver</ButtonColored
				>
			{:else}
				<ButtonColored
					on:click={async () => {
						await fetch(`/appartements/${id}/publier`, { method: 'POST' });
						window.location.reload();
					}}>Publier</ButtonColored
				>
			{/if}
			<ButtonColored dangerous href="/appartements/{id}/supprimer">Supprimer</ButtonColored>
		</section>
	{/if}
</article>

<style>
	article {
		display: flex;
		flex-direction: column;

		box-shadow: -0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.25);

		background: var(--card-bg, var(--bg));
		border-radius: 1rem;
		/* width: 600px; */
		max-width: 400px;
		overflow: hidden;
	}

	.content {
		padding: 1.5em;
		transition: all 0.25s ease;
	}

	section.photos {
		position: relative;
		/* width: 300px; */
		height: 200px;
		flex-grow: 1;
		flex-shrink: 0;
	}

	section.photos .photo-maybe-link {
		display: block;
		height: 100%;
	}

	article.small section.photos {
		height: 150px;
	}

	section.figures {
		display: flex;
		justify-content: space-between;
		margin-bottom: 2em;
		gap: 2rem;
		flex-wrap: wrap;
	}

	section.space {
		display: flex;
		flex-direction: column;
		align-items: end;
		text-align: right;
	}

	section.situation {
		display: grid;
		grid-template-columns: 1.2em 1fr;
		gap: 0.5rem;
		align-items: center;
	}

	section.situation .icon {
		display: inline-block;
		height: 1.2em;
	}

	p .muted {
		color: var(--muted);
	}

	section.criteria {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
		flex-wrap: wrap;
	}

	section.criteria p {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	section.criteria .icon {
		display: inline-block;
		height: 1.2em;
	}

	article .content:hover,
	article .content:focus,
	article.photo-is-clickable section.photos:hover + .content,
	article.photo-is-clickable section.photos:focus + .content {
		background: var(--ice);
	}

	section.editable {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		/* margin-top: 2rem; */
		padding: 1.5em;
		/* padding-top: em; */
	}
</style>
