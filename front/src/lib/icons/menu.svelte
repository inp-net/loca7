<script lang="ts">
	export let color: string = 'currentColor';
 export let strokeWidth: string = '5';
</script>

<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M45 25H5" stroke={color} stroke-width={strokeWidth} />
	<path d="M45 37.5H5" stroke={color} stroke-width={strokeWidth} />
	<path d="M45 12.5H5" stroke={color} stroke-width={strokeWidth} />
</svg>
