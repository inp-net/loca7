<script lang="ts">
	import CardAppartment from '$lib/CardAppartment.svelte';
	import CarouselImages from '$lib/CarouselImages.svelte';

	const images = [
		'https://www.bde.enseeiht.fr/media/photos_logements/100093730_3557455170948364_7501580383020908544_n_500x500.jpg',
		'https://www.bde.enseeiht.fr/media/photos_logements/100810891_3557455314281683_8923839815040892928_n_500x500.jpg',
		'https://www.bde.enseeiht.fr/media/photos_logements/101461387_3557455157615032_7534340903201144832_n_500x500.jpg',
		'https://www.bde.enseeiht.fr/media/photos_logements/101023176_3557455150948366_3755935955320569856_n_500x500.jpg'
	];

	const images2 = [
		'https://www.bde.enseeiht.fr/media/photos_logements/Salon_rue_dipont.jpg',
		'https://www.bde.enseeiht.fr/media/photos_logements/Salon_3_rue_dupont.jpg',
		'https://www.bde.enseeiht.fr/media/photos_logements/chambre_1_rue_dupont.jpg'
	];
</script>

<section class="card">
	<CardAppartment
		number={4}
		address="Rue du Poit de Guilheméry, Toulouse"
		surface={27}
		hasFurniture
		availableAt={new Date(Date.parse('2021-03-03'))}
		rent={650}
		charges={30}
		kind="t1"
		roomsCount={0}
		{images}
		latitude={1.456849}
		longitude={43.600965}
		hasParking={false}
	/>
	<CardAppartment
		number={5}
		address="Rue Dupont, 31500 Toulouse"
		surface={67}
		hasFurniture
		availableAt={new Date(Date.parse('2021-03-03'))}
		rent={900}
		charges={50}
		kind="t3etplus"
		roomsCount={0}
		images={images2}
		latitude={1.460059}
		longitude={43.604359}
		hasParking
		editable
	/>
</section>

<section class="carousel">
	<CarouselImages contain {images} currentIndex={images[0]} />
</section>

<style>
	.card {
		display: flex;
		gap: 5rem;
		margin-bottom: 5rem;
	}
	.carousel {
		height: 500px;
	}
</style>
