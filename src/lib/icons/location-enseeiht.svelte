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
	<g clip-path="url(#clip0_194_3263)">
		<path
			d="M-6 17.357L15.4575 11.2936C18.0044 10.3404 19.4816 11.0789 19.4816 11.0789C19.4816 11.0789 20.1322 15.3349 20.0419 16.2491M17.2658 26.5895C19.1123 23.2658 19.62 20.5212 20.0419 16.2491M20.0419 16.2491C23.5439 16.6184 23.1236 12.5561 24.6518 12.5561C25.0211 14.4026 25.0211 8.12456 26.8675 19.5728C27.3558 22.5997 45.7018 15.5105 50.1333 12.5561M24.6518 3.69298C27.3684 4.03653 37.9338 2.47344 42.0088 0C38.2733 5.84007 33.1456 29.5267 33.1456 33.2368"
			stroke={color}
			stroke-width={strokeWidth}
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z"
			fill={color}
		/>
	</g>
	<defs>
		<clipPath id="clip0_194_3263">
			<rect width="50" height="50" fill="white" />
		</clipPath>
	</defs>
</svg>
