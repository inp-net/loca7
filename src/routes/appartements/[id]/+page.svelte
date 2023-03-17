<script lang="ts">
	import CarouselImages from '$lib/CarouselImages.svelte';
	import Icon from '$lib/Icon.svelte';
	import InputField from '$lib/InputField.svelte';
	import type { LayoutData, PageData } from './$types';
	import xss from 'xss';
	import {
		durationDisplay,
		distanceDisplay,
		availableAtSentence,
		readableOn,
		distanceBetween,
		ENSEEIHT
	} from '$lib/utils';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import {
		appartmentPhotoURL,
		DISPLAY_APPARTMENT_KIND,
		DISPLAY_PUBLIC_TRANSPORT_TYPE,
		type Appartment,
		type PublicTransportStation,
		type GeographicPoint,
		DISPLAY_REPORT_REASON,
		type User
	} from '$lib/types';
	import publicTransportColor from '$lib/publicTransportColors';
	import AppartmentsMap from '$lib/AppartmentsMap.svelte';
	import type { Report } from '$lib/types';
	import { onMount, onDestroy } from 'svelte';

	export let data: LayoutData;
	let user: User | null = data.user;
	let reports: Report[] = data.appartment.reports;
	let appart: Appartment = data.appartment;
	let secondsAvailableSince = (Date.now() - appart.availableAt.valueOf()) * 1e-3;

	function publicTransportStationSentence(station: PublicTransportStation) {
		return `${station.type === 'metro' ? 'Station' : 'Arrêt'} «${station.name}» du ${
			DISPLAY_PUBLIC_TRANSPORT_TYPE[station.type]
		} ${station.line}`;
	}

	function middleOf(...points: GeographicPoint[]): GeographicPoint {
		return {
			latitude: points.reduce((acc, p) => acc + p.latitude, 0) / points.length,
			longitude: points.reduce((acc, p) => acc + p.longitude, 0) / points.length
		};
	}
</script>

<svelte:head>
	<title>Loca7 · {appart.kind} de {appart.surface} m² à {appart.rent + appart.charges}€</title>
</svelte:head>

<main>
	{#if appart.archived || !appart.approved}
		<section class="archived">
			<p class="typo-paragraph">
				{#if appart.archived}
					Cette annonce est archivée
				{:else}
					Cette annonce n'a pas encore été approuvée
				{/if}
			</p>
			{#if appart.archived || user?.admin}
				<div class="actions">
					<ButtonSecondary icon="delete" href="/appartements/{appart.id}/supprimer"
						>Supprimer</ButtonSecondary
					>
					<ButtonSecondary
						icon={appart.archived ? 'eye-open' : 'checkmark'}
						on:click={async () => {
							await fetch(`/appartements/${appart.id}/publier`, { method: 'POST' });
						}}
						>{#if appart.archived}Publier{:else}Approuver{/if}</ButtonSecondary
					>
				</div>
			{/if}
		</section>
	{/if}

	<section class="carousel">
		<CarouselImages contain images={appart.photos.map(appartmentPhotoURL)} />
	</section>

	<div class="side-by-side">
		<div class="column">
			<section class="figures">
				<div class="row">
					<InputField label="Type de logement">
						<p class="typo-big-figure">{DISPLAY_APPARTMENT_KIND[appart.kind]}</p>
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
						{#if appart.location}
							<span class="muted"
								>à {distanceDisplay(distanceBetween(appart.location, ENSEEIHT))} de l'école</span
							>
						{/if}
					</p>
					<ButtonSecondary icon="open-outside">Maps</ButtonSecondary>
				</div>
				{#if Object.entries(appart.travelTimeToN7).some(([k, v]) => k !== 'id' && v !== null)}
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
								<!-- {#if appart.velotoulouse}
									<wbr />
									<span class="muted">station VélÔToulouse à proximité</span>
								{/if} -->
							{/if}<br />
							{#if appart.travelTimeToN7.byPublicTransport !== null}
								{durationDisplay(appart.travelTimeToN7.byPublicTransport)} en transports<wbr
								/>
								<span class="muted">
									{#each appart.nearbyStations as station}
										<span
											title={publicTransportStationSentence(station)}
											class="transport-line"
											style:--color={station.color ||
												publicTransportColor(station.line, station.type) ||
												'#000'}
											style:--text-color={readableOn(
												station.color ||
													publicTransportColor(
														station.line,
														station.type
													) ||
													'#000'
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
					{#if appart.kind === 'colocation'}
						<li class="aspect">
							<span class="iconlike">
								{appart.roomsCount}
							</span>
							<p class="typo-paragraph">Chambres</p>
						</li>
					{/if}
				</ul>
			</section>
			{#if xss(appart.description)}
				<section class="description">
					<h2>Description</h2>
					<p>{@html xss(appart.description)}</p>
				</section>
			{/if}
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
		{#if user?.admin || appart.owner.id === user?.id}
			<ButtonSecondary icon="edit" href="/appartements/{appart.id}/modifier"
				>Modifier</ButtonSecondary
			>
			<ButtonSecondary icon="delete" href="/appartements/{appart.id}/supprimer"
				>Supprimer</ButtonSecondary
			>
			{#if !appart.approved}
				{#if user?.admin}
					<ButtonSecondary
						icon="checkmark"
						on:click={async () => {
							await fetch(`/appartements/${appart.id}/approuver`, {
								method: 'post'
							});
							window.location.reload();
						}}>Approuver</ButtonSecondary
					>
				{/if}
			{:else if appart.archived}
				<ButtonSecondary
					icon="eye-open"
					on:click={async () => {
						await fetch(`/appartements/${appart.id}/publier`, {
							method: 'post'
						});
					}}>Publier</ButtonSecondary
				>
			{:else}
				<ButtonSecondary
					icon="eye-cancel"
					on:click={async () => {
						await fetch(`/appartements/${appart.id}/archiver`, {
							method: 'post'
						});
						window.location.reload();
					}}>Archiver</ButtonSecondary
				>
			{/if}
		{:else}
			<ButtonSecondary icon="report" dangerous href="/appartements/{appart.id}/signaler"
				>Signaler</ButtonSecondary
			>
		{/if}
	</section>

	<section class="reports">
		<h2>Signalements</h2>
		<ul>
			{#each reports as report}
				<li class="report">
					<span class="reason typo-field-label"
						>{DISPLAY_REPORT_REASON[report.reason]}</span
					>
					{#if report.message.length}
						<div class="body">{@html report.message}</div>
					{:else}
						<div class="body empty">Aucun message</div>
					{/if}
					<div class="actions">
						<ButtonSecondary
							on:click={async () => {
								await fetch(`/signalements/${report.id}/supprimer`, {
									method: 'post'
								});
								reports = reports.filter((r) => r.id === report.id);
							}}
							dangerous
							icon="delete">Supprimer</ButtonSecondary
						>
					</div>
				</li>
			{:else}
				<li>Aucun signalement.</li>
			{/each}
		</ul>
	</section>

	{#if appart?.location}
		<section class="map">
			<AppartmentsMap appartments={[appart]} center={middleOf(appart.location, ENSEEIHT)} />
		</section>
	{/if}
</main>

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

	@media (min-width: 800px) {
		.side-by-side {
			grid-template-columns: 1fr 1.5fr;
		}
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
		justify-content: space-between;
		align-items: center;
	}

	section.aspects .iconlike {
		--size: 50px;
		font-size: var(--size);
		font-weight: bold;
		line-height: var(--size);
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
		gap: 1rem;
		flex-direction: row;
		justify-content: center;
	}

	section.actions :global(button) {
		width: fit-content;
	}

	section.map {
		width: 100%;
		height: 600px;
	}

	section.reports {
		max-width: 1000px;
		word-break: break-all;
	}

	section.reports h2 {
		margin-bottom: 2rem;
		text-align: center;
	}

	section.reports ul {
		list-style: none;
		padding-left: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.report {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem;
		border-radius: 1rem;
		max-width: 300px;
		min-height: 300px;
		border: var(--border-width) solid var(--muted);
	}

	.report .actions {
		margin-top: auto;
	}
	.report .body.empty {
		font-style: italic;
		color: var(--muted);
	}

	.report .actions {
		display: flex;
		flex-direction: row;
	}

	section.archived {
		background: var(--ice);
		padding: 0.5rem 1rem;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 3rem;
	}

	section.archived .actions {
		display: flex;
		gap: 1rem;
	}
</style>
