<script lang="ts">
	import CarouselImages from '$lib/CarouselImages.svelte';
	import Icon from '$lib/Icon.svelte';
	import InputField from '$lib/InputField.svelte';
	import type { PageData } from './$types';
	import { durationDisplay, distanceDisplay, availableAtSentence } from '$lib/utils';
	import ButtonSecondary from '$lib/ButtonSecondary.svelte';
	import type { Appartment } from '$lib/types';

	export let data: PageData;
	let appart: Appartment = data.appartement;
	let secondsAvailableSince = (Date.now() - Date.parse(data.appartement.availableAt)) * 1e-3;
</script>

{#if data.appartement.id === 'tr'}
	<h1>La TR</h1>
	<p class="typo-details">Pour les gros rats qui dorment en TR pendant les H24</p>
{:else}
	<h1>Appartement #{data.appartement.id}</h1>
{/if}

<section class="carousel">
	<CarouselImages contain images={data.appartement.images} current={data.appartement.images[0]} />
</section>

<div class="side-by-side">
	<div class="column">
		<section class="figures">
			<div class="row">
				<InputField label="Type de logement">
					<p class="typo-big-figure">{data.appartement.kind}</p>
				</InputField>
				<InputField label="Surface">
					<p class="typo-big-figure">{data.appartement.surface}m²</p>
				</InputField>
			</div>
			<div class="row">
				<InputField label="Loyer">
					<p class="typo-big-figure">{data.appartement.rent}€</p>
				</InputField>
				<InputField label="Charges">
					<p class="typo-big-figure">{data.appartement.charges}€</p>
				</InputField>
				<InputField label="Caution">
					<p class="typo-big-figure">{data.appartement.deposit}€</p>
				</InputField>
			</div>
		</section>
		<section class="situation">
			<div class="row">
				<span class="icon"><Icon name="calendar" /></span>
				<p class="when">
					{availableAtSentence(secondsAvailableSince, data.appartement.availableAt)}
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
					{data.appartement.address}
					<span class="muted">à {distanceDisplay(data.appartement.distanceToN7)}</span>
				</p>
				<ButtonSecondary icon="open-outside">Maps</ButtonSecondary>
			</div>
		</section>
		<section class="aspects">
			<!-- <h2>Aspects</h2> -->
			<ul>
				{#if data.appartement.hasFurniture}
					<li class="aspect">
						<div class="icon">
							<Icon name="furniture" />
						</div>
						<p class="typo-field-label">Meublé</p>
					</li>
				{/if}
				{#if data.appartement.hasParking}
					<li class="aspect">
						<div class="icon">
							<Icon name="parking" />
						</div>
						<p class="typo-field-label">Parking</p>
					</li>
				{/if}
			</ul>
		</section>
	</div>

	<div class="column">
		<section class="description">
			<h2>Description</h2>
			<p>{data.appartement.description}</p>
		</section>
		<section class="owner">
			<h2 class="typo-field-label">Propriétaire</h2>
			<p class="name typo-title">
				{data.appartement.owner.name}
				<ButtonSecondary icon="open-outside">Contacts</ButtonSecondary>
			</p>
			{#if data.appartement.owner.email}
				<div class="row">
					<div class="icon">
						<Icon name="email" />
					</div>
					{data.appartement.owner.email}
				</div>
			{/if}
			{#if data.appartement.owner.phone}
				<div class="row">
					<div class="icon"><Icon name="phone" /></div>
					{data.appartement.owner.phone}
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

	section.aspects {
		grid-area: left;
	}

	section.aspects ul {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
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
