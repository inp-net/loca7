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
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="M14.2192 43.8519H19.7066V38.3644L14.2192 43.8519ZM21.5622 36.5089H31.0252C33.3323 36.5089 35.3872 36.0403 37.1896 35.103C39.0282 34.1296 40.4701 32.7778 41.5156 31.0474C42.597 29.281 43.1378 27.2262 43.1378 24.883V17.6259C43.1378 16.755 43.0677 15.9275 42.9276 15.1434L36 22.0711V24.883C36 26.5052 35.4773 27.6768 34.4319 28.6141C33.3864 29.5514 32.0165 30.02 30.3222 30.02H28.0511L21.5622 36.5089ZM31.3745 12.5545C31.0389 12.5107 30.6881 12.4889 30.3222 12.4889H19.7066V24.2223L12.5688 31.3601V6H31.0252C33.1659 6 35.0732 6.39398 36.747 7.18194L31.3745 12.5545Z"
		fill={color}
	/>
	<path d="M47.5 3.5L4.5 46.5" stroke={color} stroke-width={strokeWidth} />
</svg>
