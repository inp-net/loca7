import { writable, type Writable } from 'svelte/store';
export type Toast = {
	id: string;
	type: 'error' | 'info';
	closable: boolean;
	message: string;
};

export const toasts: Writable<Toast[]> = writable([]);

/**
 * Append a new toast to the stack.
 * @param type
 * @param message What message to use. Can be HTML. Will be sanitized.
 * @param options
 * @returns The ID of the toast. Can be used to close it.
 */
export function addToast(
	type: Toast['type'],
	message: Toast['message'],
	options: { closable: boolean; timeout: number } = { closable: true, timeout: 3000 }
) {
	const id = Math.floor(Math.random() * 1000000).toString();
	toasts.update((toasts) => [
		...toasts,
		{
			...options,
			type,
			message,
			id
		}
	]);

	if (options.timeout > 0) {
		setTimeout(() => {
			closeToast(id);
		}, options.timeout);
	}

	return id;
}

export function closeToast(id: string) {
	toasts.update((toasts) => toasts.filter((toast) => toast.id !== id));
}
