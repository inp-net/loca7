<script lang="ts">
    export let color: string = 'currentColor';
    export let strokeWidth: number = 5;
    export let flip: boolean = false;
            </script>

<svg style:transform={flip ? "scaleX(-1)" : ""} width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path d="M17 5L5 17V33.5L17 45.5H33.5L45.5 33.5V17L33.5 5H17Z" stroke={color} stroke-width={strokeWidth} />
	<path
		d="M22.6987 29.72V12.8H27.3067V29.72H22.6987ZM25.0027 38.504C24.0427 38.504 23.2267 38.192 22.5547 37.568C21.9067 36.92 21.5827 36.092 21.5827 35.084C21.5827 34.076 21.9067 33.26 22.5547 32.636C23.2267 31.988 24.0427 31.664 25.0027 31.664C25.9867 31.664 26.8027 31.988 27.4507 32.636C28.0987 33.26 28.4227 34.076 28.4227 35.084C28.4227 36.092 28.0987 36.92 27.4507 37.568C26.8027 38.192 25.9867 38.504 25.0027 38.504Z"
		fill={color}
	/>
</svg>
