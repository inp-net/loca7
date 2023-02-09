<script lang="ts">
	export let color: string = 'currentColor';
 export let strokeWidth: string = '5';
</script>

<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="25" cy="24.5" r="18.5" stroke={color} stroke-width={strokeWidth} />
	<path
		d="M22.7388 37.5V19.644H27.2748V37.5H22.7388ZM25.0068 17.556C24.1908 17.556 23.4948 17.292 22.9188 16.764C22.3668 16.236 22.0908 15.54 22.0908 14.676C22.0908 13.812 22.3668 13.116 22.9188 12.588C23.4948 12.06 24.1908 11.796 25.0068 11.796C25.8468 11.796 26.5428 12.06 27.0948 12.588C27.6468 13.116 27.9228 13.812 27.9228 14.676C27.9228 15.54 27.6468 16.236 27.0948 16.764C26.5428 17.292 25.8468 17.556 25.0068 17.556Z"
		fill={color}
	/>
</svg>
