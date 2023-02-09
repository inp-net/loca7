<script lang="ts">
	export let color: string = 'currentColor';
 export let strokeWidth: string = '5';
</script>

<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect x="4" y="3.5" width="42" height="42" fill="#D62525" />
	<path d="M12.08 11.96L37.54 37.42" stroke={color} stroke-width={strokeWidth} />
	<path d="M37.5399 11.96L12.0799 37.42" stroke={color} stroke-width={strokeWidth} />
</svg>
