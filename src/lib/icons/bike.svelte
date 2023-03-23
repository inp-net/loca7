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
	<circle cx="12" cy="33" r="9" stroke={color} stroke-width={strokeWidth} />
	<circle cx="38.5" cy="33.5" r="8.5" stroke={color} stroke-width={strokeWidth} />
	<path d="M7 7H20" stroke={color} stroke-width={strokeWidth} />
	<path d="M35 14.5C36.5 13.5 38.6 8.6 35 5" stroke={color} stroke-width={strokeWidth} />
	<path d="M39 34L34 15H17L12 34" stroke={color} stroke-width={strokeWidth} />
</svg>
