<script lang="ts">
    export let color: string = 'currentColor';
    export let strokeWidth: number = 5;
    export let flip: boolean = false;
            </script>

<svg style:transform={flip ? "scaleX(-1)" : ""} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
	<rect x="6.5" y="11.5" width="37" height="27" stroke={color} stroke-width={strokeWidth} />
	<path d="M6 11.5L25.5 24.5L44 11.5" stroke={color} stroke-width={strokeWidth} />
</svg>
