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
		d="M24.5 15H20H8V36H24.5M24.5 15H41V36H24.5M24.5 15V36"
		stroke={color}
		stroke-width={strokeWidth}
	/>
	<path d="M24.5 49L14.5407 40.75L34.4593 40.75L24.5 49Z" fill={color} />
	<path d="M24.5 1L34.4593 10L14.5407 10L24.5 1Z" fill={color} />
</svg>
