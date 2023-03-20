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
	<g clip-path="url(#clip0_212_3109)">
		<path
			d="M24.3571 45.5C15.3572 36.5 11.5 27.8214 11.5 17.5357C11.5 12.7143 15.0357 2.75 24.3571 2.75C31.75 2.75 38.5 6.28572 38.5 17.5357C38.5 31.9357 29.1786 40.6785 24.3571 45.5Z"
			fill="#25C9FF"
			stroke="#25C9FF"
			stroke-width={strokeWidth}
		/>
		<path
			d="M-9 22.357L12.4575 16.2936C15.0044 15.3404 16.4816 16.0789 16.4816 16.0789C16.4816 16.0789 17.1322 20.3349 17.0419 21.2491M14.2658 31.5895C16.1123 28.2658 16.62 25.5212 17.0419 21.2491M17.0419 21.2491C20.5439 21.6184 20.1236 17.5561 21.6518 17.5561C22.0211 19.4026 22.0211 13.1246 23.8675 24.5728C24.3558 27.5997 42.7018 20.5105 47.1333 17.5561M21.6518 8.69298C24.3684 9.03653 34.9338 7.47344 39.0088 5C35.2733 10.8401 30.1456 34.5267 30.1456 38.2368"
			stroke={color}
			stroke-width={strokeWidth}
		/>
	</g>
	<defs>
		<clipPath id="clip0_212_3109">
			<rect width="50" height="50" fill="white" />
		</clipPath>
	</defs>
</svg>
