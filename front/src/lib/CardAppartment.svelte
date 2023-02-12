<script lang="ts">
	import CarouselImages from './CarouselImages.svelte';
	import Icon from './Icon.svelte';
	import type { AppartmentKind } from './types';
	import { durationDisplay } from './utils';

	export let images: string[];
	export let id: string;
	export let rent: number;
	export let charges: number;
	export let surface: number;
	export let kind: AppartmentKind;
	export let roomsCount: number;
	export let availableAt: string;
	export let address: string;
	export let distanceToN7: number;
	export let hasFurniture: boolean;
	export let hasParking: boolean;

	let distanceDisplay: string = Intl.NumberFormat('fr-FR', {
		style: 'unit',
		unit: distanceToN7 < 0.5 ? 'meter' : 'kilometer'
	}).format(distanceToN7 < 0.5 ? distanceToN7 * 1e3 : distanceToN7);

	let secondsAvailableSince = (Date.now() - Date.parse(availableAt)) * 1e-3;

	let currentImage = images[0];
</script>

<article>
	<section class="photos">
		<CarouselImages cover {images} current={currentImage} />
	</section>
	<a href="/appartements/{id}">
		<div class="content">
			<section class="figures">
				<section class="price">
					<p class="typo-big-figure rent">{rent + charges}€</p>
					<p class="charges">dont {charges}€ de charges</p>
				</section>
				<section class="space">
					<p class="typo-big-figure surface">{surface}m²</p>
					<p class="type">
						{kind}
						{#if kind === 'Colocation'}de {roomsCount} chambres{/if}
					</p>
				</section>
			</section>
			<section class="situation">
				<span class="icon"><Icon name="calendar" /></span>
				<p class="when">
					{#if secondsAvailableSince > 0}
						Libéré depuis le
					{:else if secondsAvailableSince < 0}
						Se libère le
					{:else}
						Se libère aujourd'hui
					{/if}
					{#if secondsAvailableSince !== 0}
						{new Intl.DateTimeFormat('fr-FR', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						}).format(new Date(availableAt))}
					{/if}
					{#if secondsAvailableSince !== 0}
						<span class="muted"
							>{#if secondsAvailableSince > 0}il y a{:else}dans{/if}
							{durationDisplay(Math.abs(secondsAvailableSince))}</span
						>
					{/if}
				</p>
				<span class="icon"><Icon name="location" /></span>
				<p class="where">
					{address}
					<span class="muted">à {distanceDisplay}</span>
				</p>
			</section>
			<section class="aspects">
				<p class="furniture">
					<span class="icon"><Icon name="furniture" cancel={!hasFurniture} /></span>
					{hasFurniture ? 'Meublé' : 'Non meublé'}
				</p>
				<p class="parking">
					<span class="icon"><Icon name="parking" cancel={!hasParking} /></span>
					{hasParking ? 'Place de parking' : 'Pas de place de parking'}
				</p>
			</section>
		</div>
	</a>
</article>

<style>
	article {
		display: flex;
		flex-direction: column;

		box-shadow: -0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.25);

		background: var(--bg);
		border-radius: 1rem;
		width: 400px;
		overflow: hidden;
	}

	.content {
		padding: 1.5rem;
		transition: all 0.25s ease;
	}

	section.photos {
		position: relative;
		width: 100%;
		height: 300px;
	}

	section.figures {
		display: flex;
		justify-content: space-between;
		margin-bottom: 2rem;
	}

	section.space {
		display: flex;
		flex-direction: column;
		align-items: end;
		text-align: right;
	}

	section.figures section {
		width: 50%;
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

	section.aspects {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	section.aspects p {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	section.aspects .icon {
		display: inline-block;
		height: 1.2em;
	}

	.content:hover,
	.content:focus {
		background: var(--ice);
	}
</style>
