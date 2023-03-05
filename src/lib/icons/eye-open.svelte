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
	<circle cx="25" cy="24.5" r="9" stroke={color} stroke-width={strokeWidth} />
	<path
		d="M25.4259 13C13.5 13 6.82712 20.9506 4.98145 24.9259C6.82712 28.9012 13.5185 36.9259 25.4444 36.9259C37.3703 36.9259 43.7407 28.9012 45.4444 24.9259C43.7407 20.9506 37.3518 13 25.4259 13Z"
		stroke={color}
		stroke-width={strokeWidth}
	/>
</svg>
