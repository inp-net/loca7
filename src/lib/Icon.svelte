<script lang="ts">
	import type { Name as IconName } from '$lib/icons/types';

	export let name: IconName;
	export let strokeWidth: string = '5';
	export let color = 'icon-color';
	export let flip = false;
	let _color =
		color === 'currentColor'
			? color
			: color.startsWith('#')
			? color
			: `var(--${color}, var(--fg))`;
</script>

<!-- generate cases -->
{#if name === 'add'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M3 25.25H46.5" stroke={_color} stroke-width={strokeWidth} />
		<path d="M24.75 3.5L24.75 47" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'back'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M46.5 25H6.5M6.5 25L24.1812 7.5M6.5 25L24.1812 42.5"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
	</svg>
{:else if name === 'bike'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="12" cy="33" r="9" stroke={_color} stroke-width={strokeWidth} />
		<circle cx="38.5" cy="33.5" r="8.5" stroke={_color} stroke-width={strokeWidth} />
		<path d="M7 7H20" stroke={_color} stroke-width={strokeWidth} />
		<path d="M35 14.5C36.5 13.5 38.6 8.6 35 5" stroke={_color} stroke-width={strokeWidth} />
		<path d="M39 34L34 15H17L12 34" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'bike-cancel'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M13.6951 44.3759C18.6895 43.6381 22.6381 39.6895 23.3759 34.6951L13.6951 44.3759ZM26.4289 17.5H18.9272L17.5058 22.9012C18.2506 23.3081 18.9454 23.795 19.5786 24.3503L10.3604 33.5685L9.58231 33.3638L11.3809 26.5291C8.08145 26.8408 5.5 29.619 5.5 33C5.5 34.522 6.02313 35.9219 6.89939 37.0295L3.35028 40.5786C1.57571 38.5549 0.5 35.9031 0.5 33C0.5 26.6487 5.64873 21.5 12 21.5C12.2347 21.5 12.4677 21.507 12.6989 21.5209L14.5823 14.3638L15.0728 12.5H17H31.4289L26.4289 17.5ZM28.0672 30.0038C27.6993 31.1022 27.5 32.2778 27.5 33.5C27.5 39.5751 32.4249 44.5 38.5 44.5C44.5751 44.5 49.5 39.5751 49.5 33.5C49.5 27.4445 44.6069 22.5318 38.5588 22.5002L37.9364 20.1347L28.0672 30.0038ZM38.4468 5.48209C38.0339 4.70581 37.4829 3.94734 36.7678 3.23223L33.2322 6.76777C34.0849 7.62046 34.4297 8.55046 34.4815 9.44743L38.4468 5.48209ZM36.5823 34.6362L35.0006 28.6256C33.4862 29.7148 32.5 31.4922 32.5 33.5C32.5 36.8137 35.1863 39.5 38.5 39.5C41.8137 39.5 44.5 36.8137 44.5 33.5C44.5 30.6752 42.5478 28.3063 39.919 27.6688L41.4177 33.3638L36.5823 34.6362ZM20 9.5H7V4.5H20V9.5Z"
			fill={_color}
		/>
		<path d="M47.5 3.5L4.5 46.5" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'calendar'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect
			x="7"
			y="18.8286"
			width="36"
			height="25.4571"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<rect
			x="6.98929"
			y="8.86075"
			width="36.0214"
			height="4.97857"
			fill={_color}
			stroke={_color}
			stroke-width="4.97857"
		/>
		<path d="M12.1143 6.37146V2.85718" stroke={_color} stroke-width={strokeWidth} />
		<path d="M37.8857 6.37146V2.85718" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'checkmark'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M5 24L19.5 38.5L45 13" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'close'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M8 8.5L41.5 42" stroke={_color} stroke-width={strokeWidth} />
		<path d="M41.5 8.5L8 42" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'delete'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M15 16V43.5H34.5V16" stroke={_color} stroke-width={strokeWidth} />
		<path d="M9 11H41" stroke={_color} stroke-width={strokeWidth} />
		<path d="M19 6H31" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'drag-handle'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M45 30H5" stroke={_color} stroke-width={strokeWidth} />
		<path d="M45 20H5" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'edit'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M43 15.3692L33.9848 7L8 32.6308V41H17.0152L43 15.3692Z"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
	</svg>
{:else if name === 'editor-link'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M22.4131 16.6263L28.7164 10.323C30.3665 8.43758 34.7961 5.79606 39.3132 10.3132C43.8303 14.8303 41.1888 19.2599 39.3034 20.91L33.0001 27.2133"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path d="M32.5956 17.0308L15.9786 33.6478" stroke={_color} stroke-width={strokeWidth} />
		<path
			d="M15.9179 23.1018L10.3217 28.698C8.43604 30.3479 5.79618 34.7791 10.3217 39.3046C14.8471 43.8301 19.2783 41.1902 20.9283 39.3046L26.5245 33.7084"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
	</svg>
{:else if name === 'editor-list'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="8" cy="38" r="4" fill={_color} />
		<path d="M45 38H15" stroke={_color} stroke-width={strokeWidth} />
		<circle cx="8" cy="25" r="4" fill={_color} />
		<path d="M45 25H15" stroke={_color} stroke-width={strokeWidth} />
		<circle cx="8" cy="12" r="4" fill={_color} />
		<path d="M45 12H15" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'elevator'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M24.5 15H20H8V36H24.5M24.5 15H41V36H24.5M24.5 15V36"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path d="M24.5 49L14.5407 40.75L34.4593 40.75L24.5 49Z" fill={_color} />
		<path d="M24.5 1L34.4593 10L14.5407 10L24.5 1Z" fill={_color} />
	</svg>
{:else if name === 'elevator-cancel'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16.0614 42.0097L24.5 49L34.4593 40.75H17.3211L16.0614 42.0097ZM19.5711 38.5H24.5H41H43.5V36V15V14.5711L38.5 19.5711V33.5H27V31.0711L19.5711 38.5ZM34.1807 9.74824L33.9289 10H14.5407L24.5 1L34.1807 9.74824ZM31.4289 12.5L22 21.9289V17.5H20H10.5V33.4289L5.5 38.4289V36V15V12.5H8H20H24.5H31.4289Z"
			fill={_color}
		/>
		<path d="M47.5 3.5L4.5 46.5" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'email'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="6.5" y="11.5" width="37" height="27" stroke={_color} stroke-width={strokeWidth} />
		<path d="M6 11.5L25.5 24.5L44 11.5" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'eye-cancel'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M19.3255 38.7456C21.2068 39.1788 23.2458 39.4259 25.4444 39.4259C38.6224 39.4259 45.7544 30.549 47.7422 25.9107L48.1643 24.9259L47.7422 23.9411C46.8397 21.8353 44.8807 18.8843 41.7874 16.2837L38.2362 19.8349C40.3664 21.5389 41.8241 23.4391 42.6574 24.9273C41.7476 26.5598 40.0978 28.6883 37.6448 30.5166C38.5136 28.6938 39 26.6537 39 24.5C39 22.8732 38.7225 21.3112 38.2123 19.8587L33.9904 24.0807C33.9967 24.2196 34 24.3594 34 24.5C34 29.4706 29.9705 33.5 25 33.5C24.8594 33.5 24.7196 33.4968 24.5806 33.4904L19.3255 38.7456ZM27.9383 15.9906C27.0661 15.6895 26.1331 15.5186 25.1627 15.5014C24.8733 15.5046 24.5874 15.513 24.305 15.5264C19.6592 15.8812 16 19.7633 16 24.5C16 25.5289 16.1726 26.5175 16.4905 27.4384L9.6923 34.2366C6.06857 31.4891 3.75817 28.2279 2.71389 25.9787L2.2251 24.9259L2.71389 23.8731C4.77872 19.4258 11.7516 11.1316 24.0146 10.5341C24.3401 10.5115 24.6687 10.5 25 10.5C25.0583 10.5 25.1166 10.5004 25.1747 10.5011C25.2582 10.5004 25.3419 10.5 25.4259 10.5C28.0165 10.5 30.3745 10.8403 32.5064 11.4225L27.9383 15.9906ZM11.9902 29.6817C10.0415 28.0705 8.65468 26.3255 7.81364 24.9266C8.59125 23.636 9.8363 22.0528 11.5635 20.555C11.1967 21.8063 11 23.1302 11 24.5C11 26.3306 11.3513 28.0791 11.9902 29.6817Z"
			fill={_color}
		/>
		<path d="M44 7L6.5 44.5" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'eye-closed'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4.98145 24V24.9259C6.82712 28.9012 13.5185 36.9259 25.4444 36.9259C37.3703 36.9259 43.7407 28.9012 45.4444 24.9259V24"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path d="M10 31L5 36" stroke={_color} stroke-width={strokeWidth} />
		<path d="M17 35L14 42" stroke={_color} stroke-width={strokeWidth} />
		<path d="M41 31L46 36" stroke={_color} stroke-width={strokeWidth} />
		<path d="M34 35L37 42" stroke={_color} stroke-width={strokeWidth} />
		<path d="M26 37V45" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'eye-open'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="25" cy="24.5" r="9" stroke={_color} stroke-width={strokeWidth} />
		<path
			d="M25.4259 13C13.5 13 6.82712 20.9506 4.98145 24.9259C6.82712 28.9012 13.5185 36.9259 25.4444 36.9259C37.3703 36.9259 43.7407 28.9012 45.4444 24.9259C43.7407 20.9506 37.3518 13 25.4259 13Z"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
	</svg>
{:else if name === 'fiber-internet'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M43.5 28C43.5 29.2718 42.3672 31.1326 38.8996 32.8241C35.5997 34.4339 30.8654 35.5 25.5 35.5C20.1346 35.5 15.4003 34.4339 12.1004 32.8241C8.63276 31.1326 7.5 29.2718 7.5 28C7.5 26.7282 8.63276 24.8674 12.1004 23.1759C15.4003 21.5661 20.1346 20.5 25.5 20.5C30.8654 20.5 35.5997 21.5661 38.8996 23.1759C42.3672 24.8674 43.5 26.7282 43.5 28Z"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path d="M7.5 28V50" stroke={_color} stroke-width={strokeWidth} />
		<path d="M43.5 28V50" stroke={_color} stroke-width={strokeWidth} />
		<path
			d="M19.5 33.5C18.1667 26.8333 14.3 11.1 9.5 7.5"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path d="M26 33L25 3" stroke={_color} stroke-width={strokeWidth} />
		<path
			d="M32.6344 32.9619C31.8597 25.6525 32.6101 10.8332 41.8099 10.0314"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
	</svg>
{:else if name === 'fiber-internet-cancel'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clip-path="url(#clip0_247_3162)">
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M5 47V50H8.00003L5 47ZM8.07103 50H10V48.0711L8.07103 50ZM20.3848 37.6862C22.0199 37.8911 23.7339 38 25.5 38C31.6911 38 37.2411 36.6613 41 34.5449V50H46V28C46 24.772 42.8645 21.9012 37.9982 20.0729L29.9053 28.1658C29.8973 29.8243 29.9735 31.3741 30.0974 32.712C29.5763 32.7789 29.0426 32.8351 28.4974 32.8795L28.3907 29.6803L20.3848 37.6862ZM27.9345 15.9944L27.4986 2.91675L22.5014 3.08332L23.0011 18.0736C21.3313 18.1726 19.7235 18.3695 18.2025 18.6522L18.1725 18.5617C17.2851 15.8911 16.2652 13.2506 15.1293 11.0124C14.0304 8.84691 12.6767 6.75757 11 5.50004L8 9.50004C8.72329 10.0425 9.65296 11.2698 10.6707 13.2752C11.626 15.1577 12.5333 17.469 13.3616 19.9407C8.29056 21.7612 5 24.6931 5 28V38.9289L13.3011 30.6278C13.266 30.611 13.2311 30.5942 13.1964 30.5773C10.4792 29.2518 10.0717 28.1759 10.0107 28C10.0717 27.8241 10.4792 26.7483 13.1964 25.4228C13.6967 25.1788 14.2406 24.9466 14.8242 24.7295C15.1556 25.9146 15.4612 27.0793 15.7385 28.1905L19.8358 24.0932C19.7793 23.8866 19.7221 23.6792 19.664 23.4712C19.9712 23.4197 20.2835 23.372 20.6006 23.3283L27.9345 15.9944ZM35.0956 24.3597C34.8427 26.9538 34.8638 29.5416 35.0263 31.662C36.0569 31.3413 36.9881 30.9751 37.8036 30.5773C40.5208 29.2518 40.9283 28.176 40.9893 28C40.9283 27.8241 40.5208 26.7483 37.8036 25.4228C37.0064 25.034 36.0987 24.6753 35.0956 24.3597ZM27.3185 32.9561C26.9458 32.9742 26.5683 32.9869 26.1864 32.9938L27.3185 32.9561Z"
				fill={_color}
			/>
			<path d="M47.5 3.5L4.5 46.5" stroke={_color} stroke-width={strokeWidth} />
		</g>
		<defs>
			<clipPath id="clip0_247_3162">
				<rect width="50" height="50" fill="white" />
			</clipPath>
		</defs>
	</svg>
{:else if name === 'furniture'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M20.9627 21.5704H18.4627V24.0704V34.5H6V5.5H33.5V21.5704H20.9627Z"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path
			d="M27.9264 47.0153V31.0951H46.5M46.5 31.0951V47.0153M46.5 31.0951V4.29602"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
	</svg>
{:else if name === 'furniture-cancel'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M1 47V47.0153H1.01534L1 47ZM10.3338 33.5951H6V37.9289L1 42.9289V4.29601H6V28.5951H15.3338L10.3338 33.5951ZM19.5736 38.4974V47.0153H24.5736V33.4974L19.5736 38.4974ZM29.0373 29.0338V37H46.5V11.5711L41.5 16.5711V32H34.0373V24.0338L29.0373 29.0338ZM35.9289 8H19V19.0704H24.8585L19.8585 24.0704H14V3H40.9289L35.9289 8Z"
			fill={_color}
		/>
		<path d="M46 5L4 47" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'information'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="25" cy="24.5" r="18.5" stroke={_color} stroke-width={strokeWidth} />
		<path
			d="M22.7388 37.5V19.644H27.2748V37.5H22.7388ZM25.0068 17.556C24.1908 17.556 23.4948 17.292 22.9188 16.764C22.3668 16.236 22.0908 15.54 22.0908 14.676C22.0908 13.812 22.3668 13.116 22.9188 12.588C23.4948 12.06 24.1908 11.796 25.0068 11.796C25.8468 11.796 26.5428 12.06 27.0948 12.588C27.6468 13.116 27.9228 13.812 27.9228 14.676C27.9228 15.54 27.6468 16.236 27.0948 16.764C26.5428 17.292 25.8468 17.556 25.0068 17.556Z"
			fill={_color}
		/>
	</svg>
{:else if name === 'location'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clip-path="url(#clip0_1_329)">
			<path
				d="M24.3571 46.5C15.3572 37.5 11.5 28.8214 11.5 18.5357C11.5 13.7143 15.0357 3.75 24.3571 3.75C31.75 3.75 38.5 7.28572 38.5 18.5357C38.5 32.9357 29.1786 41.6785 24.3571 46.5Z"
				stroke={_color}
				stroke-width={strokeWidth}
			/>
			<circle cx="25.3215" cy="18.2142" r="4.5" fill={_color} />
		</g>
		<defs>
			<clipPath id="clip0_1_329">
				<rect width="50" height="50" fill="white" />
			</clipPath>
		</defs>
	</svg>
{:else if name === 'location-chambre'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z"
			fill={_color}
		/>
		<path d="M8 34.5V22H41.5V34.5" stroke={_color} stroke-width={strokeWidth} />
		<path
			d="M11.5 19.5V12.5H25M25 12.5V19.5M25 12.5H38.5V19.5"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
	</svg>
{:else if name === 'location-colocation'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z"
			fill={_color}
		/>
		<path
			d="M45.8 34C45.8 28.4035 41.2631 23.8667 35.6667 23.8667C34.7438 23.8667 33.8497 23.9901 33 24.2212"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<circle cx="35.6667" cy="17.2" r="4.7" stroke={_color} stroke-width={strokeWidth} />
		<path
			d="M32 34.342C32 26.3339 25.5081 19.842 17.5 19.842C9.49187 19.842 3 26.3339 3 34.342"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<circle cx="17.5" cy="10.3026" r="7.80263" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'location-enseeiht'}
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
				stroke={_color}
				stroke-width={strokeWidth}
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z"
				fill={_color}
			/>
		</g>
		<defs>
			<clipPath id="clip0_194_3263">
				<rect width="50" height="50" fill="white" />
			</clipPath>
		</defs>
	</svg>
{:else if name === 'location-enseeiht-alt'}
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
				stroke={_color}
				stroke-width={strokeWidth}
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M16 36C18.0219 39.5274 20.7501 42.9893 24.2608 46.5C24.435 46.3259 24.615 46.1466 24.8002 45.9622C27.1996 43.5728 30.4748 40.3113 33.2103 36H16Z"
				fill={_color}
			/>
		</g>
		<defs>
			<clipPath id="clip0_212_3109">
				<rect width="50" height="50" fill="white" />
			</clipPath>
		</defs>
	</svg>
{:else if name === 'location-enseeiht-color'}
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
				stroke={_color}
				stroke-width={strokeWidth}
			/>
		</g>
		<defs>
			<clipPath id="clip0_212_3109">
				<rect width="50" height="50" fill="white" />
			</clipPath>
		</defs>
	</svg>
{:else if name === 'location-enseeiht-color-alt'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M24.3571 45.5C15.3572 36.5 11.5 27.8214 11.5 17.5357C11.5 12.7143 15.0357 2.75 24.3571 2.75C31.75 2.75 38.5 6.28572 38.5 17.5357C38.5 31.9357 29.1786 40.6785 24.3571 45.5Z"
			fill="#25C9FF"
			stroke="#25C9FF"
			stroke-width={strokeWidth}
		/>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M12.9761 17.9953V41.3208H9.86604C9.24403 41.2171 8 40.6988 8 39.4547V4.31101H11.4211C11.7321 4.31101 12.4163 4.49761 12.6651 5.24403C12.9139 5.99044 19.8182 19.8613 23.2393 26.7035V4H26.3494C27.0751 4.10367 28.5264 4.62201 28.5264 5.86604V40.0768C28.5264 40.4914 28.3398 41.3208 27.5934 41.3208H25.1054C24.587 41.2171 23.5503 40.761 23.5503 39.7657C23.0527 39.0193 16.2935 24.9411 12.9761 17.9953ZM31.853 4V8.35409H40.5612V12.3972C38.2805 18.099 33.7812 31.804 34.03 41.0098H38.6951C39.0061 36.863 40.7478 25.4594 45.2263 13.0192V4H31.853Z"
			fill={_color}
		/>
	</svg>
{:else if name === 'location-studio'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z"
			fill={_color}
		/>
		<path d="M8 35V4H20M41 35V4H20M20 4V14" stroke={_color} stroke-width={strokeWidth} />
		<path d="M41 27H29V35" stroke={_color} stroke-width={strokeWidth} />
		<circle cx="20" cy="17" r="3.5" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'location-t1'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z"
			fill={_color}
		/>
		<path
			d="M14.4873 30V9.12H7.1433V4.8H26.5833V9.12H19.2393V30H14.4873ZM36.7314 30V8.184H36.0834L32.6994 16.176H27.8754L33.0234 4.8H41.3394V30H36.7314Z"
			fill={_color}
		/>
	</svg>
{:else if name === 'location-t1bis'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z"
			fill={_color}
		/>
		<path
			d="M7.80052 30V10.28H0.864515V6.2H19.2245V10.28H12.2885V30H7.80052ZM25.2388 30V9.396H24.6268L21.4308 16.944H16.8748L21.7368 6.2H29.5908V30H25.2388ZM40.7818 30.476C39.2632 30.476 38.0958 30.2153 37.2798 29.694C36.4638 29.1727 35.8632 28.5947 35.4778 27.96H34.8658V30H30.6498V6.2H34.9338V15.074H35.5458C35.7952 14.666 36.1238 14.2807 36.5318 13.918C36.9625 13.5553 37.5178 13.2607 38.1978 13.034C38.9005 12.7847 39.7618 12.66 40.7818 12.66C42.1418 12.66 43.3998 13 44.5558 13.68C45.7118 14.3373 46.6412 15.312 47.3438 16.604C48.0465 17.896 48.3978 19.46 48.3978 21.296V21.84C48.3978 23.676 48.0465 25.24 47.3438 26.532C46.6412 27.824 45.7118 28.81 44.5558 29.49C43.3998 30.1473 42.1418 30.476 40.7818 30.476ZM39.4898 26.736C40.8045 26.736 41.9038 26.3167 42.7878 25.478C43.6718 24.6167 44.1138 23.37 44.1138 21.738V21.398C44.1138 19.766 43.6718 18.5307 42.7878 17.692C41.9265 16.8307 40.8272 16.4 39.4898 16.4C38.1752 16.4 37.0758 16.8307 36.1918 17.692C35.3078 18.5307 34.8658 19.766 34.8658 21.398V21.738C34.8658 23.37 35.3078 24.6167 36.1918 25.478C37.0758 26.3167 38.1752 26.736 39.4898 26.736Z"
			fill={_color}
		/>
	</svg>
{:else if name === 'location-t2'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z"
			fill={_color}
		/>
		<path
			d="M11.9385 30V9.12H4.59447V4.8H24.0345V9.12H16.6905V30H11.9385ZM26.4065 30V26.976C26.4065 25.224 26.6945 23.772 27.2705 22.62C27.8465 21.444 28.6745 20.484 29.7545 19.74C30.8585 18.972 32.2025 18.348 33.7865 17.868L36.1985 17.112C37.0865 16.824 37.8305 16.476 38.4305 16.068C39.0305 15.636 39.4865 15.12 39.7985 14.52C40.1345 13.92 40.3025 13.236 40.3025 12.468V12.324C40.3025 11.124 39.8945 10.176 39.0785 9.48C38.2625 8.76 37.1465 8.4 35.7305 8.4C34.3385 8.4 33.2105 8.784 32.3465 9.552C31.5065 10.296 31.0865 11.376 31.0865 12.792V13.44H26.4785V12.864C26.4785 11.04 26.8865 9.492 27.7025 8.22C28.5185 6.948 29.6225 5.976 31.0145 5.304C32.4305 4.632 34.0025 4.296 35.7305 4.296C37.4585 4.296 39.0185 4.632 40.4105 5.304C41.8025 5.952 42.8945 6.876 43.6865 8.076C44.5025 9.252 44.9105 10.644 44.9105 12.252V12.612C44.9105 14.22 44.5745 15.588 43.9025 16.716C43.2545 17.82 42.3665 18.732 41.2385 19.452C40.1105 20.148 38.8265 20.724 37.3865 21.18L35.0825 21.9C34.0505 22.212 33.2465 22.56 32.6705 22.944C32.0945 23.304 31.6865 23.712 31.4465 24.168C31.2305 24.6 31.1225 25.128 31.1225 25.752V25.896H44.6945V30H26.4065Z"
			fill={_color}
		/>
	</svg>
{:else if name === 'location-t3etplus'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M16.0963 36C18.1182 39.5274 20.8464 42.9893 24.3571 46.5C24.5312 46.3259 24.7112 46.1466 24.8964 45.9622C27.2959 43.5728 30.5711 40.3113 33.3065 36H16.0963Z"
			fill={_color}
		/>
		<path
			d="M7.1687 29V11.02H0.844704V7.3H17.5847V11.02H11.2607V29H7.1687ZM24.4943 29.434C22.8616 29.434 21.415 29.1447 20.1543 28.566C18.8936 27.9873 17.9016 27.1607 17.1783 26.086C16.4756 24.9907 16.1243 23.699 16.1243 22.211V21.653H20.0923V22.087C20.0923 23.2443 20.4953 24.1743 21.3013 24.877C22.1073 25.559 23.1716 25.9 24.4943 25.9C25.8376 25.9 26.871 25.5797 27.5943 24.939C28.3383 24.2983 28.7103 23.4923 28.7103 22.521V22.211C28.7103 21.5497 28.545 21.0123 28.2143 20.599C27.8836 20.1857 27.4393 19.886 26.8813 19.7C26.3233 19.4933 25.693 19.39 24.9903 19.39H20.6503V15.05L27.6563 11.33V10.834H16.6823V7.3H32.0583V12.57L25.5173 16.042V16.538H26.6643C27.6356 16.538 28.576 16.7343 29.4853 17.127C30.4153 17.5197 31.18 18.1293 31.7793 18.956C32.3786 19.762 32.6783 20.816 32.6783 22.118V22.49C32.6783 23.8953 32.3373 25.125 31.6553 26.179C30.9733 27.2123 30.0123 28.0183 28.7723 28.597C27.553 29.155 26.127 29.434 24.4943 29.434ZM38.4567 24.629V19.917H33.8067V16.383H38.4567V11.671H42.1147V16.383H46.7647V19.917H42.1147V24.629H38.4567Z"
			fill={_color}
		/>
	</svg>
{:else if name === 'location-white-background'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clip-path="url(#clip0_1_329)">
			<path
				d="M24.3571 46.5C15.3572 37.5 11.5 28.8214 11.5 18.5357C11.5 13.7143 15.0357 3.75 24.3571 3.75C31.75 3.75 38.5 7.28572 38.5 18.5357C38.5 32.9357 29.1786 41.6785 24.3571 46.5Z"
				stroke={_color}
				fill="white"
				stroke-width={strokeWidth}
			/>
			<circle cx="25.3215" cy="18.2142" r="4.5" fill={_color} />
		</g>
		<defs>
			<clipPath id="clip0_1_329">
				<rect width="50" height="50" fill="white" />
			</clipPath>
		</defs>
	</svg>
{:else if name === 'lock'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect
			x="13.2983"
			y="24.4993"
			width="22.8492"
			height="20.122"
			stroke={_color}
			stroke-width="4.09091"
		/>
		<path
			d="M35.6984 24.782C35.6984 15.9349 36.1973 5.69104 25.2217 5.69104C14.2461 5.69104 13.7472 12.6755 13.7472 15.9349"
			stroke={_color}
			stroke-width="4.09091"
		/>
		<ellipse cx="24.9723" cy="33.8618" rx="2.7439" ry="2.56098" fill={_color} />
	</svg>
{:else if name === 'logout'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M43.75 25H16M16 25L25.25 15.75M16 25L25.25 34.25"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path d="M21.75 7.5H7.5V42.5H21.75" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'map'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clip-path="url(#clip0_1_297)">
			<path
				d="M26.4999 37.75C19.5 30.75 16.5 24 16.5 16C16.5 12.25 19.25 4.5 26.4999 4.5C32.25 4.5 37.5 7.25 37.5 16C37.5 27.2 30.25 33.9999 26.4999 37.75Z"
				stroke={_color}
				stroke-width={strokeWidth}
			/>
			<path
				d="M11.25 14.75L5.5 9V45.5H44.5L35.5 36.5"
				stroke={_color}
				stroke-width={strokeWidth}
			/>
			<circle cx="27.25" cy="15.75" r="3.5" fill={_color} />
		</g>
		<defs>
			<clipPath id="clip0_1_297">
				<rect width="50" height="50" fill="white" />
			</clipPath>
		</defs>
	</svg>
{:else if name === 'menu'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M45 25H5" stroke={_color} stroke-width={strokeWidth} />
		<path d="M45 37.5H5" stroke={_color} stroke-width={strokeWidth} />
		<path d="M45 12.5H5" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'minus'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M3 25.25H46.5" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'next'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M19 5.5L31.4415 24.9028L19 44.75" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'open-outside'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M16.7037 33.0001L42.163 7.54081M42.163 7.54081V20.6223M42.163 7.54081H29.0815"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path d="M21.75 7.5H7.5V42.5H42.5V27.5" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'parking'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M12.5688 43.8519V6H31.0252C33.4044 6 35.4953 6.48667 37.2978 7.46C39.1363 8.39728 40.5602 9.73111 41.5696 11.4615C42.6151 13.1919 43.1378 15.2467 43.1378 17.6259V24.883C43.1378 27.2262 42.597 29.281 41.5156 31.0474C40.4701 32.7778 39.0282 34.1296 37.1896 35.103C35.3872 36.0403 33.3323 36.5089 31.0252 36.5089H19.7066V43.8519H12.5688ZM19.7066 30.02H30.3222C32.0165 30.02 33.3864 29.5514 34.4319 28.6141C35.4773 27.6768 36 26.5052 36 24.883V17.7341C36 16.1119 35.4773 14.8321 34.4319 13.8948C33.3864 12.9575 32.0165 12.4889 30.3222 12.4889H19.7066V30.02Z"
			fill={_color}
		/>
	</svg>
{:else if name === 'parking-cancel'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			fill-rule="evenodd"
			clip-rule="evenodd"
			d="M14.2192 43.8519H19.7066V38.3644L14.2192 43.8519ZM21.5622 36.5089H31.0252C33.3323 36.5089 35.3872 36.0403 37.1896 35.103C39.0282 34.1296 40.4701 32.7778 41.5156 31.0474C42.597 29.281 43.1378 27.2262 43.1378 24.883V17.6259C43.1378 16.755 43.0677 15.9275 42.9276 15.1434L36 22.0711V24.883C36 26.5052 35.4773 27.6768 34.4319 28.6141C33.3864 29.5514 32.0165 30.02 30.3222 30.02H28.0511L21.5622 36.5089ZM31.3745 12.5545C31.0389 12.5107 30.6881 12.4889 30.3222 12.4889H19.7066V24.2223L12.5688 31.3601V6H31.0252C33.1659 6 35.0732 6.39398 36.747 7.18194L31.3745 12.5545Z"
			fill={_color}
		/>
		<path d="M47.5 3.5L4.5 46.5" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'password-strength-dangerous'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="4" y="3.5" width="42" height="42" fill="#D62525" />
		<path d="M12.08 11.96L37.54 37.42" stroke={_color} stroke-width={strokeWidth} />
		<path d="M37.5399 11.96L12.0799 37.42" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'password-strength-good'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="25" cy="24.5" r="21" fill="#59ED79" />
		<path d="M11.4 23.82L21.26 33.68L38.6 16.34" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'password-strength-weak'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path d="M25 3.5L46.6506 41H3.34937L25 3.5Z" fill="#E6B024" />
		<path
			d="M23.0354 28.4317V13.9878H26.9691V28.4317H23.0354ZM25.0022 35.9302C24.1827 35.9302 23.4861 35.6639 22.9125 35.1312C22.3593 34.578 22.0827 33.8712 22.0827 33.0107C22.0827 32.1502 22.3593 31.4537 22.9125 30.921C23.4861 30.3678 24.1827 30.0912 25.0022 30.0912C25.8422 30.0912 26.5388 30.3678 27.092 30.921C27.6452 31.4537 27.9217 32.1502 27.9217 33.0107C27.9217 33.8712 27.6452 34.578 27.092 35.1312C26.5388 35.6639 25.8422 35.9302 25.0022 35.9302Z"
			fill={_color}
		/>
		<path
			d="M23.0354 28.4317H22.8854V28.5817H23.0354V28.4317ZM23.0354 13.9878V13.8378H22.8854V13.9878H23.0354ZM26.9691 13.9878H27.1191V13.8378H26.9691V13.9878ZM26.9691 28.4317V28.5817H27.1191V28.4317H26.9691ZM22.9125 35.1312L22.8063 35.2374L22.8104 35.2411L22.9125 35.1312ZM22.9125 30.921L23.0165 31.029L23.0166 31.029L22.9125 30.921ZM27.092 30.921L26.9859 31.0271L26.9879 31.029L27.092 30.921ZM27.092 35.1312L27.1961 35.2393L27.1981 35.2373L27.092 35.1312ZM23.1854 28.4317V13.9878H22.8854V28.4317H23.1854ZM23.0354 14.1378H26.9691V13.8378H23.0354V14.1378ZM26.8191 13.9878V28.4317H27.1191V13.9878H26.8191ZM26.9691 28.2817H23.0354V28.5817H26.9691V28.2817ZM25.0022 35.7802C24.2186 35.7802 23.5591 35.5269 23.0145 35.0213L22.8104 35.2411C23.4132 35.8009 24.1468 36.0802 25.0022 36.0802V35.7802ZM23.0185 35.0252C22.4964 34.5031 22.2327 33.8358 22.2327 33.0107H21.9327C21.9327 33.9066 22.2222 34.653 22.8064 35.2373L23.0185 35.0252ZM22.2327 33.0107C22.2327 32.1856 22.4964 31.5299 23.0165 31.029L22.8084 30.8129C22.2222 31.3774 21.9327 32.1149 21.9327 33.0107H22.2327ZM23.0166 31.029C23.5614 30.5036 24.2203 30.2412 25.0022 30.2412V29.9412C24.1451 29.9412 23.4108 30.232 22.8084 30.813L23.0166 31.029ZM25.0022 30.2412C25.8057 30.2412 26.4631 30.5042 26.9859 31.027L27.1981 30.8149C26.6145 30.2314 25.8788 29.9412 25.0022 29.9412V30.2412ZM26.9879 31.029C27.5081 31.5299 27.7717 32.1856 27.7717 33.0107H28.0717C28.0717 32.1149 27.7822 31.3774 27.196 30.8129L26.9879 31.029ZM27.7717 33.0107C27.7717 33.8358 27.508 34.5031 26.9859 35.0252L27.1981 35.2373C27.7823 34.653 28.0717 33.9066 28.0717 33.0107H27.7717ZM26.9879 35.0232C26.4655 35.5263 25.8074 35.7802 25.0022 35.7802V36.0802C25.8771 36.0802 26.6122 35.8015 27.196 35.2393L26.9879 35.0232Z"
			fill={_color}
		/>
	</svg>
{:else if name === 'phone'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M39.5676 37.048C34.6228 41.9928 24.4453 39.8324 16.8356 32.2227C9.22586 24.613 7.06547 14.4355 12.0103 9.49072"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<rect
			x="13.752"
			y="4.21655"
			width="11.7566"
			height="5"
			transform="rotate(45 13.752 4.21655)"
			fill={_color}
		/>
		<rect
			x="36.5355"
			y="27"
			width="11.7443"
			height="5"
			transform="rotate(45 36.5355 27)"
			fill={_color}
		/>
	</svg>
{:else if name === 'question'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="25" cy="24.5" r="18.5" stroke={_color} stroke-width={strokeWidth} />
		<path
			d="M22.1178 29.22V28.356C22.1178 27.132 22.3578 26.124 22.8378 25.332C23.3418 24.54 24.1458 23.88 25.2498 23.352L25.8618 23.064C26.9418 22.56 27.7698 22.02 28.3458 21.444C28.9218 20.868 29.2098 20.1 29.2098 19.14C29.2098 18.444 29.0298 17.856 28.6698 17.376C28.3338 16.872 27.8538 16.488 27.2298 16.224C26.6058 15.96 25.8738 15.828 25.0338 15.828C24.1698 15.828 23.3898 15.972 22.6938 16.26C22.0218 16.548 21.4818 16.98 21.0738 17.556C20.6898 18.132 20.4978 18.852 20.4978 19.716V20.508H15.8178V19.788C15.8178 18.132 16.2258 16.704 17.0418 15.504C17.8578 14.304 18.9618 13.392 20.3538 12.768C21.7458 12.12 23.3058 11.796 25.0338 11.796C26.7378 11.796 28.2498 12.108 29.5698 12.732C30.9138 13.356 31.9698 14.22 32.7378 15.324C33.5058 16.428 33.8898 17.7 33.8898 19.14C33.8898 20.58 33.6258 21.768 33.0977 22.704C32.5698 23.616 31.8978 24.36 31.0818 24.936C30.2898 25.488 29.4738 25.968 28.6338 26.376L28.0218 26.664C27.5898 26.856 27.2898 27.096 27.1218 27.384C26.9538 27.648 26.8698 28.044 26.8698 28.572V29.22H22.1178ZM24.6378 38.004C23.6778 38.004 22.8618 37.692 22.1898 37.068C21.5418 36.42 21.2178 35.592 21.2178 34.584C21.2178 33.576 21.5418 32.76 22.1898 32.136C22.8618 31.488 23.6778 31.164 24.6378 31.164C25.6218 31.164 26.4378 31.488 27.0858 32.136C27.7338 32.76 28.0578 33.576 28.0578 34.584C28.0578 35.592 27.7338 36.42 27.0858 37.068C26.4378 37.692 25.6218 38.004 24.6378 38.004Z"
			fill={_color}
		/>
	</svg>
{:else if name === 'report'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M17 5L5 17V33.5L17 45.5H33.5L45.5 33.5V17L33.5 5H17Z"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path
			d="M22.6987 29.72V12.8H27.3067V29.72H22.6987ZM25.0027 38.504C24.0427 38.504 23.2267 38.192 22.5547 37.568C21.9067 36.92 21.5827 36.092 21.5827 35.084C21.5827 34.076 21.9067 33.26 22.5547 32.636C23.2267 31.988 24.0427 31.664 25.0027 31.664C25.9867 31.664 26.8027 31.988 27.4507 32.636C28.0987 33.26 28.4227 34.076 28.4227 35.084C28.4227 36.092 28.0987 36.92 27.4507 37.568C26.8027 38.192 25.9867 38.504 25.0027 38.504Z"
			fill={_color}
		/>
	</svg>
{:else if name === 'reset'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M11 18.5835C6.58172 26.2362 9.20372 36.0217 16.8564 40.4399C24.5091 44.8582 34.2945 42.2362 38.7128 34.5835C43.1311 26.9309 40.5091 17.1454 32.8564 12.7271C30.8295 11.594 28.2303 11.0148 25.5 11.0254"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path
			d="M26.9593 21.8875L23 8.75001L36.7093 5"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
	</svg>
{:else if name === 'search'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<circle cx="28" cy="22" r="14.5" stroke={_color} stroke-width={strokeWidth} />
		<path d="M16 34L6 44" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else if name === 'sortby-down'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M14.5 19L25.25 29.75L36 19L14.5 19Z"
			fill={_color}
			stroke={_color}
			stroke-width="5.81081"
		/>
	</svg>
{:else if name === 'sortby-up'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M14.5 29.75L25.25 19L36 29.75L14.5 29.75Z"
			fill={_color}
			stroke={_color}
			stroke-width="5.81081"
		/>
	</svg>
{:else if name === 'travel'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M11.4285 46.375C6.92858 41.875 4.99999 37.5357 5 32.3929C4.99998 29.9821 6.76786 25 11.4285 25C15.125 25 18.5 26.7679 18.5 32.3929C18.5 39.5929 13.8393 43.9643 11.4285 46.375Z"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<path
			d="M43.5 23L41.1618 23.8847L43.5 23ZM5.83642 4.00533C4.45867 4.09568 3.41501 5.2858 3.50536 6.66356C3.5957 8.04131 4.78583 9.08496 6.16358 8.99462L5.83642 4.00533ZM6.19636 8.99266C7.57476 8.91275 8.62739 7.73055 8.54748 6.35216C8.46757 4.97376 7.28537 3.92113 5.90698 4.00104L6.19636 8.99266ZM17.1051 4.4511C15.7344 4.28528 14.4888 5.26205 14.323 6.63277C14.1572 8.00349 15.1339 9.2491 16.5047 9.41491L17.1051 4.4511ZM16.6336 9.43065C18.004 9.59929 19.2516 8.62509 19.4203 7.25471C19.5889 5.88434 18.6147 4.63672 17.2443 4.46808L16.6336 9.43065ZM28.2406 6.88649C26.9321 6.44582 25.5141 7.14933 25.0734 8.45783C24.6327 9.76633 25.3363 11.1843 26.6448 11.625L28.2406 6.88649ZM26.7646 11.6656C28.0717 12.1104 29.4919 11.4114 29.9367 10.1043C30.3816 8.79725 29.6826 7.37703 28.3755 6.93218L26.7646 11.6656ZM38.6114 12.3369C37.5325 11.4753 35.9594 11.6515 35.0978 12.7304C34.2362 13.8093 34.4124 15.3824 35.4913 16.244L38.6114 12.3369ZM35.5852 16.3194C36.6592 17.1871 38.2333 17.0198 39.1009 15.9457C39.9686 14.8717 39.8013 13.2977 38.7273 12.43L35.5852 16.3194ZM45.8109 22.0434C45.3179 20.7538 43.8727 20.1079 42.583 20.6009C41.2933 21.094 40.6475 22.5391 41.1405 23.8288L45.8109 22.0434ZM41.1768 23.9252C41.6502 25.2222 43.0854 25.8899 44.3825 25.4165C45.6795 24.9431 46.3471 23.5079 45.8737 22.2108L41.1768 23.9252ZM41.9682 35.1043C42.8549 34.046 42.7158 32.4692 41.6575 31.5825C40.5992 30.6957 39.0224 30.8348 38.1356 31.8932L41.9682 35.1043ZM38.0497 31.9952C37.1579 33.0492 37.2893 34.6266 38.3433 35.5185C39.3973 36.4104 40.9748 36.2789 41.8666 35.2249L38.0497 31.9952ZM32.9108 43.3115C34.0238 42.4944 34.2637 40.9298 33.4466 39.8168C32.6295 38.7038 31.0648 38.4639 29.9519 39.281L32.9108 43.3115ZM29.8398 39.3631C28.7252 40.178 28.4823 41.7421 29.2972 42.8567C30.1121 43.9713 31.6762 44.2143 32.7908 43.3994L29.8398 39.3631ZM22.725 49.6805C23.9475 49.0386 24.4181 47.5272 23.7762 46.3048C23.1343 45.0824 21.6229 44.6118 20.4005 45.2537L22.725 49.6805ZM6 6.49997C6.16358 8.99462 6.16356 8.99462 6.16354 8.99462C6.16354 8.99462 6.16352 8.99462 6.16351 8.99462C6.16349 8.99462 6.16346 8.99462 6.16344 8.99463C6.16339 8.99463 6.16335 8.99463 6.1633 8.99464C6.16322 8.99464 6.16313 8.99465 6.16305 8.99465C6.1629 8.99466 6.16275 8.99467 6.16263 8.99468C6.16238 8.9947 6.1622 8.99471 6.16208 8.99471C6.16185 8.99473 6.16189 8.99473 6.1622 8.99471C6.16282 8.99467 6.1645 8.99456 6.16725 8.99439C6.17274 8.99405 6.18248 8.99346 6.19636 8.99266L5.90698 4.00104C5.88666 4.00222 5.87056 4.00319 5.85877 4.00392C5.85287 4.00428 5.84806 4.00458 5.84433 4.00482C5.84246 4.00494 5.84087 4.00504 5.83955 4.00513C5.83889 4.00517 5.8383 4.00521 5.83778 4.00524C5.83752 4.00526 5.83728 4.00528 5.83705 4.00529C5.83694 4.0053 5.83683 4.00531 5.83672 4.00531C5.83667 4.00532 5.83662 4.00532 5.83657 4.00532C5.83654 4.00532 5.83652 4.00533 5.83649 4.00533C5.83648 4.00533 5.83646 4.00533 5.83646 4.00533C5.83644 4.00533 5.83642 4.00533 6 6.49997ZM16.5047 9.41491C16.5476 9.4201 16.5906 9.42535 16.6336 9.43065L17.2443 4.46808C17.1979 4.46236 17.1515 4.4567 17.1051 4.4511L16.5047 9.41491ZM26.6448 11.625C26.6847 11.6384 26.7247 11.652 26.7646 11.6656L28.3755 6.93218C28.3305 6.91687 28.2856 6.90164 28.2406 6.88649L26.6448 11.625ZM35.4913 16.244C35.5227 16.269 35.554 16.2942 35.5852 16.3194L38.7273 12.43C38.6887 12.3989 38.6501 12.3678 38.6114 12.3369L35.4913 16.244ZM41.1405 23.8288C41.1476 23.8474 41.1547 23.8661 41.1618 23.8847L45.8382 22.1153C45.8291 22.0913 45.82 22.0674 45.8109 22.0434L41.1405 23.8288ZM41.1618 23.8847C41.1669 23.8982 41.1719 23.9117 41.1768 23.9252L45.8737 22.2108C45.8621 22.1789 45.8503 22.1471 45.8382 22.1153L41.1618 23.8847ZM38.1356 31.8932C38.1072 31.9271 38.0785 31.9612 38.0497 31.9952L41.8666 35.2249C41.9006 35.1848 41.9345 35.1446 41.9682 35.1043L38.1356 31.8932ZM29.9519 39.281C29.9145 39.3084 29.8772 39.3358 29.8398 39.3631L32.7908 43.3994C32.8308 43.3701 32.8708 43.3408 32.9108 43.3115L29.9519 39.281ZM20.4005 45.2537C20.3803 45.2643 20.3602 45.2749 20.34 45.2854L22.66 49.7146C22.6817 49.7032 22.7033 49.6919 22.725 49.6805L20.4005 45.2537Z"
			fill={_color}
		/>
		<circle cx="21.5" cy="47.5" r="2.5" fill={_color} />
	</svg>
{:else if name === 'user'}
	<svg
		style:transform={flip ? 'scaleX(-1)' : ''}
		width="50"
		height="50"
		viewBox="0 0 50 50"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M44 47C44 36.5066 35.4934 28 25 28C14.5066 28 6 36.5066 6 47"
			stroke={_color}
			stroke-width={strokeWidth}
		/>
		<circle cx="25" cy="15.5" r="11" stroke={_color} stroke-width={strokeWidth} />
	</svg>
{:else}
	<span style="color: red;">unknown icon {name}</span>
{/if}

<!-- end generate -->

<style>
	:global(svg) {
		height: 100%;
		width: 100%;
		object-fit: contain;
	}
</style>
