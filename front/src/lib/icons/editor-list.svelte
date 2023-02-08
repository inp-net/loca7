<script lang="ts">
	export let color: string = 'currentColor';
</script>

<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="8" cy="38" r="4" fill={color} />
	<path d="M45 38H15" stroke={color} stroke-width="5" />
	<circle cx="8" cy="25" r="4" fill={color} />
	<path d="M45 25H15" stroke={color} stroke-width="5" />
	<circle cx="8" cy="12" r="4" fill={color} />
	<path d="M45 12H15" stroke={color} stroke-width="5" />
</svg>
