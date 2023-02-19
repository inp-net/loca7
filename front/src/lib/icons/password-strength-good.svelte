<script lang="ts">
    export let color: string = 'currentColor';
    export let strokeWidth: number = 5;
    export let flip: boolean = false;
            </script>

<svg style:transform={flip ? "scaleX(-1)" : ""} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
	<circle cx="25" cy="24.5" r="21" fill="#59ED79" />
	<path d="M11.4 23.82L21.26 33.68L38.6 16.34" stroke={color} stroke-width={strokeWidth} />
</svg>
