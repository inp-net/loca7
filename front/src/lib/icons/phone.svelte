<script lang="ts">
    export let color: string = 'currentColor';
    export let strokeWidth: number = 5;
    export let flip: boolean = false;
            </script>

<svg style:transform={flip ? "scaleX(-1)" : ""} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path
		d="M39.5676 37.048C34.6228 41.9928 24.4453 39.8324 16.8356 32.2227C9.22586 24.613 7.06547 14.4355 12.0103 9.49072"
		stroke={color}
		stroke-width={strokeWidth}
	/>
	<rect
		x="13.752"
		y="4.21655"
		width="11.7566"
		height="5"
		transform="rotate(45 13.752 4.21655)"
		fill={color}
	/>
	<rect
		x="36.5355"
		y="27"
		width="11.7443"
		height="5"
		transform="rotate(45 36.5355 27)"
		fill={color}
	/>
</svg>
