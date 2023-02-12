<script lang="ts">
	import CardAppartment from '$lib/CardAppartment.svelte';
	import CarouselImages from '$lib/CarouselImages.svelte';

	const images = [
		'https://www.bde.enseeiht.fr/media/photos_logements/100093730_3557455170948364_7501580383020908544_n_500x500.jpg',
		'https://www.bde.enseeiht.fr/media/photos_logements/100810891_3557455314281683_8923839815040892928_n_500x500.jpg',
		'https://www.bde.enseeiht.fr/media/photos_logements/101461387_3557455157615032_7534340903201144832_n_500x500.jpg',
		'https://www.bde.enseeiht.fr/media/photos_logements/101023176_3557455150948366_3755935955320569856_n_500x500.jpg'
	];
</script>

<section class="card">
	<CardAppartment
		id="d217afc8-a1de-4e16-bca8-f2be002e5b27"
		address="Rue du Poit de Guilheméry, Toulouse"
		surface={27}
		hasFurniture
		availableAt="2023-03-03"
		rent={650}
		charges={30}
		kind="T1"
		roomsCount={0}
		{images}
		distanceToN7={0.19}
		hasParking={false}
	/>

</section>


<section class="carousel">

	<CarouselImages contain {images} current={images[0]} />
</section>

<style>
	.carousel {
		height: 500px;
	}
</style>
