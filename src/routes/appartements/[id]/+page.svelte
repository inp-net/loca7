<script lang="ts">
	import { appartmentTitle, editBefore, EMPTY_APPARTMENT, type Report } from '$lib/types';
	import {
		durationDisplay,
		distanceDisplay,
		availableAtSentence,
		readableOn,
		distanceBetween,
		ENSEEIHT,
		hexToHsl
	} from '$lib/utils';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import {
		DISPLAY_APPARTMENT_KIND,
		DISPLAY_PUBLIC_TRANSPORT_TYPE,
		type Appartment,
		type GeographicPoint,
		type PublicTransportStation,
		DISPLAY_REPORT_REASON,
		type User
	} from '$lib/types';
	import { photoURL } from '$lib/photos';
	import publicTransportColor from '$lib/publicTransportColors';
	import AppartmentsMap from '$lib/AppartmentsMap.svelte';
	import { ics } from '$lib/ics';
	import { page } from '$app/stores';
	import { vcard } from '$lib/vcard';
	import { onMount } from 'svelte';
	import type { LayoutData } from './$types';
	import CarouselImages from '$lib/CarouselImages.svelte';
	import InputField from '$lib/InputField.svelte';
	import Icon from '$lib/Icon.svelte';
	import { tooltip } from '$lib/tooltip';
	import xss from 'xss';
	import AppartmentEditItem from '$lib/AppartmentEditItem.svelte';

	export let data: LayoutData;
	let user: User | null = data.user;
	let reports: Report[] = data.appartment.reports;
	let appart: Appartment = data.appartment;
	let calendarICSEvent: { url: string; filename: string } = { url: '', filename: '' };
	let contactVCard: { url: string; filename: string } = vcard(appart.owner);
	let secondsAvailableSince = (Date.now() - appart.availableAt.valueOf()) * 1e-3;

	function publicTransportStationSentence(station: PublicTransportStation) {
		return (
			`${station.type === 'metro' ? 'Station' : 'Arrêt'} «${station.name}» du ${
				DISPLAY_PUBLIC_TRANSPORT_TYPE[station.type]
			} ${station.line}` +
			(appart.latitude && appart.longitude
				? ` (à ${distanceDisplay(distanceBetween(station, appart))})`
				: '')
		);
	}

	function middleOf(...points: GeographicPoint[]): GeographicPoint {
		return {
			latitude: points.reduce((acc, p) => acc + p.latitude, 0) / points.length,
			longitude: points.reduce((acc, p) => acc + p.longitude, 0) / points.length
		};
	}
	onMount(async () => {
		calendarICSEvent = await ics({
			start: appart.availableAt,
			duration: { days: 1 },
			attendees: user ? [user, appart.owner] : [appart.owner],
			organizer: {
				name: 'Loca7',
				email: 'contact@loca7.enseeiht.fr'
			},
			busy: 'TENTATIVE',
			status: 'TENTATIVE',
			location: appart.latitude && appart.longitude ? appart : null,
			description: `${appartmentTitle(
				appart
			)}\n\nPlus d'informations: ${$page.url.toString()}`,
			title: `Visite d'un appartement Loca7`,
			url: $page.url.toString()
		});
	});
</script>

<svelte:head>
	<title>Loca7 · {appartmentTitle(appart)}</title>
</svelte:head>

<main>
	{#if appart.archived || !appart.approved}
		<section class="notice notice-archived">
			<p class="typo-paragraph">
				{#if appart.archived}
					Cette annonce est archivée
				{:else}
					Cette annonce n'a pas encore été approuvée
				{/if}
			</p>
			{#if appart.archived || (!appart.approved && user?.admin)}
				<div class="actions">
					<ButtonSecondary icon="delete" href="/appartements/{appart.id}/supprimer"
						>Supprimer</ButtonSecondary
					>
					<ButtonSecondary
						icon={appart.archived ? 'eye-open' : 'checkmark'}
						on:click={async () => {
							await fetch(`/appartements/${appart.id}/publier`, { method: 'POST' });
							appart.archived = false;
							appart.approved = true;
						}}
						>{#if appart.archived}Publier{:else}Approuver{/if}</ButtonSecondary
					>
				</div>
			{/if}
		</section>
	{/if}

	{#if (appart?.history ?? []).filter((h) => !h.applied).length > 0}
		<section class="notice notice-pending-modifications">
			<p class="typo-paragraph">Cette annonce a des modifications en attente</p>
			<div class="actions">
				<ButtonSecondary icon="add" href="#modifications">Voir</ButtonSecondary>
			</div>
		</section>
	{/if}

	<section class="carousel">
		<CarouselImages
			contain
			images={appart.photos.length > 1 ? appart.photos.map(photoURL) : ['/missing-photo.png']}
		/>
	</section>

	<div class="side-by-side">
		<div class="column">
			<section class="figures">
				<div class="row">
					<InputField label="Type de logement">
						<p class="typo-big-figure">{DISPLAY_APPARTMENT_KIND[appart.kind]}</p>
					</InputField>
					{#if appart.surface}
						<InputField label="Surface">
							<p class="typo-big-figure">{appart.surface}m²</p>
						</InputField>
					{/if}
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
					<ButtonSecondary
						icon="open-outside"
						href={calendarICSEvent?.url}
						download={calendarICSEvent?.filename}>Calendrier</ButtonSecondary
					>
				</div>
				<div class="row">
					<span class="icon"><Icon name="location" /></span>
					<p class="where">
						{appart.address}<wbr />
						{#if appart.latitude && appart.longitude}
							<span class="muted"
								>à {distanceDisplay(distanceBetween(appart, ENSEEIHT))} de l'école</span
							>
						{/if}
					</p>
					<!-- TODO make it platform agnostic (Maps on iOS, default maps app on Android) -->
					<ButtonSecondary
						icon="open-outside"
						href="https://google.com/maps/place/{encodeURIComponent(appart.address)}"
						>Maps</ButtonSecondary
					>
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
							{/if}
							{#if appart.nearbyStations.length > 0}
								<span class="muted stations">
									{#each appart.nearbyStations.sort((a, b) => hexToHsl(a?.color ?? '#000').hue - hexToHsl(b?.color ?? '#000').hue) as station (station.id)}
										<span
											use:tooltip={publicTransportStationSentence(station)}
											class="transport-line"
											style:--color={publicTransportColor(station) || '#000'}
											style:--text-color={readableOn(
												publicTransportColor(station) || '#000'
											)}>{station.line}</span
										><wbr />
									{/each}
									à proximité
								</span>
							{/if}
						</p>
					</div>
				{/if}
			</section>
			<section class="aspects">
				<!-- <h2>Caractéristiques</h2> -->
				<ul>
					{#if appart.hasFurniture !== null}
						<li class="aspect">
							<div class="icon">
								<Icon
									name={appart.hasFurniture ? 'furniture' : 'furniture-cancel'}
								/>
							</div>
							<p class="typo-paragraph">Meublé</p>
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
					{#if appart.hasBicycleParking}
						<li
							class="aspect"
							use:tooltip={'Local/parking à vélo ou assez de place pour le ranger'}
						>
							<span class="icon">
								<Icon name="bike" />
							</span>
							<p class="typo-paragraph">Place pour vélo</p>
						</li>
					{/if}
				</ul>
			</section>
		</div>

		<div class="column">
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
					<ButtonSecondary
						icon="open-outside"
						download={contactVCard.filename}
						href={contactVCard.url}>Contacts</ButtonSecondary
					>
				</p>
				{#if appart.owner.email && !appart.owner.email.match(/^ghost\.\w+@loca7.enseeiht.fr$/)}
					<div class="row">
						<div class="icon">
							<Icon name="email" />
						</div>
						{appart.owner.email}

						<ButtonSecondary
							icon="email"
							href="mailto:{encodeURIComponent(appart.owner.email)}"
							>Envoyer un mail</ButtonSecondary
						>
					</div>
				{/if}
				{#if appart.owner.phone}
					<div class="row">
						<div class="icon"><Icon name="phone" /></div>
						{appart.owner.phone}
						<ButtonSecondary
							icon="phone"
							href="tel:{encodeURIComponent(appart.owner.phone)}"
							>Appeler</ButtonSecondary
						>
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
							appart.approved = true;
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
						appart.archived = false;
					}}>Publier</ButtonSecondary
				>
			{:else}
				<ButtonSecondary
					icon="eye-cancel"
					on:click={async () => {
						await fetch(`/appartements/${appart.id}/archiver`, {
							method: 'post'
						});
						appart.archived = true;
					}}>Archiver</ButtonSecondary
				>
			{/if}
		{:else}
			<ButtonSecondary icon="report" dangerous href="/appartements/{appart.id}/signaler"
				>Signaler</ButtonSecondary
			>
		{/if}
	</section>

	{#if user?.admin}
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
	{/if}

	{#if user?.admin || appart.owner.id === user?.id}
		<section class="history" id="modifications">
			<h2>Modifications</h2>
			<h3>En attente de validation</h3>
			<ul>
				{#each appart.history
					.filter((a) => !a.applied)
					.sort((a, b) => -(a.createdAt.valueOf() - b.createdAt.valueOf())) as edit (edit.id)}
					<AppartmentEditItem {user} {edit} current={appart} />
				{:else}
					<li class="empty">Aucune modification.</li>
				{/each}
			</ul>
			<h3>Appliquées</h3>
			<ul>
				{#each appart.history
					.filter((a) => a.applied)
					.sort((a, b) => -(a.createdAt.valueOf() - b.createdAt.valueOf())) as edit (edit.id)}
					<AppartmentEditItem
						{user}
						{edit}
						current={editBefore(appart.history, edit) ?? EMPTY_APPARTMENT}
					/>
				{:else}
					<li class="empty">Aucune modification.</li>
				{/each}
			</ul>
		</section>
	{/if}
	{#if appart?.latitude && appart?.longitude}
		<section class="map">
			<AppartmentsMap
				publicTransportStations
				appartments={[appart]}
				center={middleOf(appart, ENSEEIHT)}
			/>
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

	p.traveltime {
		max-width: 400px;
	}

	.transport-line {
		display: inline-block;
		background: var(--color);
		color: var(--text-color);
		padding: 0.0625em 0.5em;
		margin: 0.25em 0;
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

	section.description :global(p) {
		font-size: 1.05em;
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

	section.owner .row:first-of-type {
		margin-top: 1rem;
	}

	section.owner .row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 0.5rem;
		line-height: 0.95;
	}

	section.owner .row :global(:last-child) {
		margin-left: auto;
	}

	section.actions {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-direction: row;
		justify-content: center;
		flex-wrap: wrap;
	}

	section.actions :global(button) {
		width: fit-content;
	}

	section.map {
		max-width: 1000px;
		height: 600px;
		margin-top: 4rem;
	}

	section.reports {
		max-width: 1200px;
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
		gap: 1rem;
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

	section.history {
		max-width: 600px;
		margin: 0 auto;
	}

	section.history h2 {
		text-align: center;
		margin-bottom: 1rem;
	}

	section.history h3 {
		text-align: center;
		margin-bottom: 2rem;
	}

	section.history ul {
		list-style: none;
		padding-left: 0;
		display: flex;
		flex-wrap: wrap;
		flex-direction: column;
		justify-content: center;
		gap: 3rem;
		flex: 1 1 0;
		margin-bottom: 3rem;
	}

	section.history li.empty {
		text-align: center;
	}

	section.history ul :global(> li) {
		flex-basis: 0;
	}

	section.notice {
		background: var(--ice);
		padding: 0.5rem 1rem;
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 3rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	section.notice .actions {
		display: flex;
		gap: 1rem;
	}
</style>
