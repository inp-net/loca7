<script lang="ts">
	import { tooltip } from './tooltip';

	interface Props {
		label: string;
		id?: string | null;
		required?: boolean;
		children?: import('svelte').Snippet;
	}

	let { label, id = null, required = false, children }: Props = $props();
</script>

<div class="field">
	<svelte:element this={id === null ? 'p' : 'label'} for={id}
		><span class="label typo-field-label"
			>{label}{#if required}
				<span use:tooltip={'Ce champ est requis'} class="required-indicator">*</span>
			{/if}</span
		>
	</svelte:element>
	{@render children?.()}
</div>

<style>
	.field {
		flex-grow: 1;
	}

	.label {
		display: inline-flex;
		justify-content: center;
		margin-bottom: 0.25rem;
	}

	.required-indicator {
		color: var(--sky);
		margin-left: 0.125rem;
		transform: scale(1.2) translateY(0.1em);
	}
</style>
