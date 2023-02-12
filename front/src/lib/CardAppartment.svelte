<script lang="ts">
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
		<div class="image-gradient-overlay" />
		<nav>
			<button
				aria-hidden={images.findIndex((src) => src === currentImage) === 0}
				class="prev arrow"
				on:click={() =>
					(currentImage = images[images.findIndex((src) => src === currentImage) - 1])}
				><Icon color="#fff" name="next" flip /></button
			>
			<ul class="dots">
				{#each images as src}
					<li>
						<button
							aria-current={currentImage === src}
							on:click={() => {
								currentImage = src;
							}}
						/>
					</li>
				{/each}
			</ul>
			<button
				aria-hidden={images.findIndex((src) => src === currentImage) === images.length - 1}
				class="next arrow"
				on:click={() =>
					(currentImage = images[images.findIndex((src) => src === currentImage) + 1])}
				><Icon color="#fff" name="next" /></button
			>
		</nav>
		<ul>
			{#each images as src}
				<li><img aria-hidden={currentImage !== src} {src} /></li>
			{/each}
		</ul>
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
	}

	.content {
		padding: 1.5rem;
		border-bottom-left-radius: 1rem;
		border-bottom-right-radius: 1rem;
	}

	section.photos {
		position: relative;
		width: 100%;
		height: 300px;
	}

	section.photos .image-gradient-overlay {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 2;
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.3333) 0%, rgba(0, 0, 0, 0) 20%),
			linear-gradient(-90deg, rgba(173, 101, 101, 0.33333) 0%, rgba(0, 0, 0, 0) 20%),
			linear-gradient(0deg, rgba(0, 0, 0, 0.33333) 0%, rgba(0, 0, 0, 0) 20%);
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
	}

	section.photos img {
		position: absolute;
		top: 0;
		width: 100%;
		height: 300px;
		object-fit: cover;
		object-position: center;
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
	}

	section.photos img[aria-hidden='true'] {
		display: none;
	}

	section.photos nav {
		display: flex;
		position: absolute;
		justify-content: space-between;
		align-items: center;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		z-index: 10;
		height: 100%;
		width: 100%;
	}

	section.photos nav button {
		cursor: pointer;
	}

	section.photos .dots {
		list-style: none;
		padding: 0;
		display: flex;
		flex-direction: row;
		align-items: end;
		justify-content: center;
		gap: 1rem;
		height: 100%;
		transition: all 0.25s ease;
		margin-bottom: 2rem;
	}

	section.photos .dots button {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 10000px;
		background: var(--bg);
		border: none;
		transition: all 0.25s ease;
	}

	section.photos .dots button[aria-current='true'] {
		width: 2rem;
	}

	section.photos button.arrow {
		z-index: 10;
		height: 5rem;
		width: 5rem;
		background: transparent;
		border: none;
		transition: all 0.25s ease;
		height: 100%;
	}

	section.photos button.arrow[aria-hidden='true'] {
		opacity: 0;
		pointer-events: none;
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
