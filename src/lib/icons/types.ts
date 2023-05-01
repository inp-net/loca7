export const NAMES = [
	'add',
	'back',
	'bike',
	'bike-cancel',
	'calendar',
	'checkmark',
	'close',
	'delete',
	'drag-handle',
	'edit',
	'editor-link',
	'editor-list',
	'elevator',
	'elevator-cancel',
	'email',
	'eye-cancel',
	'eye-closed',
	'eye-open',
	'fiber-internet',
	'fiber-internet-cancel',
	'furniture',
	'furniture-cancel',
	'heart',
	'heart-filled',
	'information',
	'location',
	'location-chambre',
	'location-colocation',
	'location-enseeiht',
	'location-enseeiht-alt',
	'location-enseeiht-color',
	'location-enseeiht-color-alt',
	'location-studio',
	'location-t1',
	'location-t1bis',
	'location-t2',
	'location-t3etplus',
	'location-white-background',
	'lock',
	'logout',
	'map',
	'menu',
	'minus',
	'next',
	'open-outside',
	'parking',
	'parking-cancel',
	'password-strength-dangerous',
	'password-strength-good',
	'password-strength-weak',
	'phone',
	'question',
	'report',
	'reset',
	'search',
	'sortby-down',
	'sortby-up',
	'travel',
	'user'
] as const;
export type Name = (typeof NAMES)[number];
