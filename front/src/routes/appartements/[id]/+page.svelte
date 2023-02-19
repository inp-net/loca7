<script lang="ts">
	import CarouselImages from '$lib/CarouselImages.svelte';
	import Icon from '$lib/Icon.svelte';
	import InputField from '$lib/InputField.svelte';
	import type { PageData } from './$types';
	import { durationDisplay, distanceDisplay, availableAtSentence, readableOn } from '$lib/utils';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import {
		DISPLAY_PUBLIC_TRANSPORT_TYPE,
		type Appartment,
		type PublicTransportStation
	} from '$lib/types';
	import publicTransportColor from '$lib/publicTransportColors';

	export let data: PageData;
	let appart: Appartment = data.appartement;
	let secondsAvailableSince = (Date.now() - Date.parse(appart.availableAt)) * 1e-3;

	function publicTransportStationSentence(station: PublicTransportStation) {
		return `${station.type === 'metro' ? 'Station' : 'Arrêt'} «${station.name}» du ${
			DISPLAY_PUBLIC_TRANSPORT_TYPE[station.type]
		} ${station.line}`;
	}
</script>

{#if appart.id === 'tr'}
	<h1>La TR</h1>
	<p class="typo-details">Pour les gros rats qui dorment en TR pendant les H24</p>
{:else}
	<h1>Appartement #{appart.id}</h1>
{/if}

<section class="carousel">
	<CarouselImages contain images={appart.images} current={appart.images[0]} />
</section>

<div class="side-by-side">
	<div class="column">
		<section class="figures">
			<div class="row">
				<InputField label="Type de logement">
					<p class="typo-big-figure">{appart.kind}</p>
				</InputField>
				<InputField label="Surface">
					<p class="typo-big-figure">{appart.surface}m²</p>
				</InputField>
			</div>
			<div class="row">
				<InputField label="Loyer">
					<p class="typo-big-figure">{appart.rent}€</p>
				</InputField>
				<InputField label="Charges">
					<p class="typo-big-figure">{appart.charges}€</p>
				</InputField>
				<InputField label="Caution">
					<p class="typo-big-figure">{appart.deposit}€</p>
				</InputField>
			</div>
		</section>
		<section class="situation">
			<div class="row">
				<span class="icon"><Icon name="calendar" /></span>
				<p class="when">
					{availableAtSentence(secondsAvailableSince, appart.availableAt)}<wbr />
					{#if secondsAvailableSince !== 0}
						<span class="muted"
							>{#if secondsAvailableSince > 0}il y a{:else}dans{/if}
							{durationDisplay(Math.abs(secondsAvailableSince))}</span
						>
					{/if}
				</p>
				<ButtonSecondary icon="open-outside">Calendrier</ButtonSecondary>
			</div>
			<div class="row">
				<span class="icon"><Icon name="location" /></span>
				<p class="where">
					{appart.address}<wbr />
					<span class="muted">à {distanceDisplay(appart.distanceToN7)} de l'école</span>
				</p>
				<ButtonSecondary icon="open-outside">Maps</ButtonSecondary>
			</div>
			{#if Object.values(appart.travelTimeToN7).some((v) => v !== null)}
				<div class="row">
					<span class="icon"><Icon name="travel" /></span>
					<p class="traveltime typo-tabular-figures">
						L'école est à
						<br />
						{#if appart.travelTimeToN7.byFoot !== null}
							{durationDisplay(appart.travelTimeToN7.byFoot)} à pied
						{/if}<br />
						{#if appart.travelTimeToN7.byBike !== null}
							{durationDisplay(appart.travelTimeToN7.byBike)} à vélo
							{#if appart.velotoulouse}
								<wbr />
								<span class="muted">station VélÔToulouse à proximité</span>
							{/if}
						{/if}<br />
						{#if appart.travelTimeToN7.byPublicTransport !== null}
							{durationDisplay(appart.travelTimeToN7.byPublicTransport)} en transports<wbr />
							<span class="muted">
								{#each appart.nearbyStations as station}
									<span
										title={publicTransportStationSentence(station)}
										class="transport-line"
										style:--color={station.color ||
											publicTransportColor(station.line, station.type) ||
											'#000'}
										style:--text-color={readableOn(
											station.color || publicTransportColor(station.line, station.type) || '#000'
										)}>{station.line}</span
									>
								{/each}
								à proximité
							</span>
						{/if}
					</p>
				</div>
			{/if}
		</section>
	</div>

	<div class="column">
		<section class="aspects">
			<!-- <h2>Caractéristiques</h2> -->
			<ul>
				{#if appart.hasFurniture}
					<li class="aspect">
						<div class="icon">
							<Icon name="furniture" />
						</div>
						<p class="typo-paragraph">Meublé</p>
					</li>
				{:else}
					<li class="aspect">
						<div class="icon">
							<Icon name="furniture-cancel" />
						</div>
						<p class="typo-paragraph">Non-meublé</p>
					</li>
				{/if}
				{#if appart.hasParking}
					<li class="aspect">
						<div class="icon">
							<Icon name="parking" />
						</div>
						<p class="typo-paragraph">Parking</p>
					</li>
				{/if}
			</ul>
		</section>
		<section class="description">
			<h2>Description</h2>
			<p>{appart.description}</p>
		</section>
		<section class="owner">
			<h2 class="typo-field-label">Propriétaire</h2>
			<p class="name typo-title">
				{appart.owner.name}
				<ButtonSecondary icon="open-outside">Contacts</ButtonSecondary>
			</p>
			{#if appart.owner.email}
				<div class="row">
					<div class="icon">
						<Icon name="email" />
					</div>
					{appart.owner.email}
				</div>
			{/if}
			{#if appart.owner.phone}
				<div class="row">
					<div class="icon"><Icon name="phone" /></div>
					{appart.owner.phone}
				</div>
			{/if}
		</section>
	</div>
</div>

<section class="actions">
	<ButtonSecondary icon="report" dangerous>Signaler</ButtonSecondary>
</section>

<style>
	.carousel {
		width: 100%;
		max-width: 1000px;
		margin: 0 auto;
		height: 60vh;
		max-height: 400px;
	}

	.side-by-side,
	section.actions {
		max-width: 1200px;
		margin: 0 auto;
	}

	.side-by-side {
		display: grid;
		grid-template-columns: 1fr;
		gap: 3rem;
		padding: 0 1rem 2rem;
	}

	@media (min-width: 600px) {
		.side-by-side {
			grid-template-columns: 1fr 1.5fr;
		}
	}

	h1,
	h1 + p {
		text-align: center;
	}

	section:not(.carousel) {
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: start;
	}

	section:not(:last-of-type) {
		margin-bottom: 3rem;
	}

	section.situation {
		grid-area: left;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	section .row {
		display: grid;
		grid-template-columns: 1.2em auto min-content;
		align-items: start;
		gap: 0.5rem;
	}

	section .row .icon {
		display: inline-block;
		height: 1.2em;
	}

	.transport-line {
		background: var(--color);
		color: var(--text-color);
		padding: 0.0625em 0.5em;
		margin: 1em 0;
		margin-right: 0.5em;
	}

	p .muted {
		color: var(--muted);
	}

	section.figures {
		grid-area: left;
		display: flex;
		flex-direction: column;
	}

	section.figures .row {
		display: flex;
		justify-content: space-between;
	}

	section.figures .row :global(.field:last-child > p) {
		text-align: right;
	}

	section.aspects {
		grid-area: left;
	}

	section.aspects ul {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding-left: 0;
	}

	section.aspects .aspect {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	section.description {
		grid-area: right;
	}

	section h2 {
		margin-bottom: 0.5rem;
	}

	section.owner {
		grid-area: right;
	}

	section.owner .name {
		display: flex;
		justify-content: space-between;
	}

	section.actions {
		display: flex;
		align-items: center;
	}

	section.actions :global(button) {
		width: fit-content;
	}
</style>
