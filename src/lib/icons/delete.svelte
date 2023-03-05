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
	<path d="M15 16V43.5H34.5V16" stroke={color} stroke-width={strokeWidth} />
	<path d="M9 11H41" stroke={color} stroke-width={strokeWidth} />
	<path d="M19 6H31" stroke={color} stroke-width={strokeWidth} />
</svg>
