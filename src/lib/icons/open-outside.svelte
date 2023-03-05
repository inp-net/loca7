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
		d="M16.7037 33.0001L42.163 7.54081M42.163 7.54081V20.6223M42.163 7.54081H29.0815"
		stroke={color}
		stroke-width={strokeWidth}
	/>
	<path d="M21.75 7.5H7.5V42.5H42.5V27.5" stroke={color} stroke-width={strokeWidth} />
</svg>
