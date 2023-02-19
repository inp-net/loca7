<script lang="ts">
    export let color: string = 'currentColor';
    export let strokeWidth: number = 5;
    export let flip: boolean = false;
            </script>

<svg style:transform={flip ? "scaleX(-1)" : ""} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M44 47C44 36.5066 35.4934 28 25 28C14.5066 28 6 36.5066 6 47"
		stroke={color}
		stroke-width={strokeWidth}
	/>
	<circle cx="25" cy="15.5" r="11" stroke={color} stroke-width={strokeWidth} />
</svg>
