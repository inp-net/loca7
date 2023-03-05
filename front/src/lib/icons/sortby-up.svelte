<script lang="ts">
	export let color: string = 'currentColor';
	export let strokeWidth: number = 5;
	export let flip: boolean = false;
</script>

<svg
	style:transform={flip ? 'scaleX(-1)' : ''}
	width="50"
	height="50"
	viewBox="0 0 50 50"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M14.5 29.75L25.25 19L36 29.75L14.5 29.75Z"
		fill={color}
		stroke={color}
		stroke-width="5.81081"
	/>
</svg>
