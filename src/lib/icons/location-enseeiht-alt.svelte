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
			fill="white"
		/>
		<path
			d="M-4 23.357L17.4575 17.2936C20.0044 16.3404 21.4816 17.0789 21.4816 17.0789C21.4816 17.0789 22.1322 21.3349 22.0419 22.2491M19.2658 32.5895C21.1123 29.2658 21.62 26.5212 22.0419 22.2491M22.0419 22.2491C25.5439 22.6184 25.1236 18.5561 26.6518 18.5561C27.0211 20.4026 27.0211 14.1246 28.8675 25.5728C29.3558 28.5997 47.7018 21.5105 52.1333 18.5561M26.6518 9.69298C29.3684 10.0365 39.9338 8.47344 44.0088 6C40.2733 11.8401 35.1456 35.5267 35.1456 39.2368"
			stroke={color}
			stroke-width={strokeWidth}
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16 36C18.0219 39.5274 20.7501 42.9893 24.2608 46.5C24.435 46.3259 24.615 46.1466 24.8002 45.9622C27.1996 43.5728 30.4748 40.3113 33.2103 36H16Z"
			fill={color}
		/>
	</g>
	<defs>
		<clipPath id="clip0_212_3109">
			<rect width="50" height="50" fill="white" />
		</clipPath>
	</defs>
</svg>
