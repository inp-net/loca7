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
		d="M43.5 28C43.5 29.2718 42.3672 31.1326 38.8996 32.8241C35.5997 34.4339 30.8654 35.5 25.5 35.5C20.1346 35.5 15.4003 34.4339 12.1004 32.8241C8.63276 31.1326 7.5 29.2718 7.5 28C7.5 26.7282 8.63276 24.8674 12.1004 23.1759C15.4003 21.5661 20.1346 20.5 25.5 20.5C30.8654 20.5 35.5997 21.5661 38.8996 23.1759C42.3672 24.8674 43.5 26.7282 43.5 28Z"
		stroke={color}
		stroke-width={strokeWidth}
	/>
	<path d="M7.5 28V50" stroke={color} stroke-width={strokeWidth} />
	<path d="M43.5 28V50" stroke={color} stroke-width={strokeWidth} />
	<path
		d="M19.5 33.5C18.1667 26.8333 14.3 11.1 9.5 7.5"
		stroke={color}
		stroke-width={strokeWidth}
	/>
	<path d="M26 33L25 3" stroke={color} stroke-width={strokeWidth} />
	<path
		d="M32.6344 32.9619C31.8597 25.6525 32.6101 10.8332 41.8099 10.0314"
		stroke={color}
		stroke-width={strokeWidth}
	/>
</svg>
