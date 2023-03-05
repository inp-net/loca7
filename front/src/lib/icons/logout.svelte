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
		d="M43.75 25H16M16 25L25.25 15.75M16 25L25.25 34.25"
		stroke={color}
		stroke-width={strokeWidth}
	/>
	<path d="M21.75 7.5H7.5V42.5H21.75" stroke={color} stroke-width={strokeWidth} />
</svg>
