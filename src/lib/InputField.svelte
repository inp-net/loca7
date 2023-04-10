<script lang="ts">
	export let label: string;
	export let id: string | null = null;
	export let required: boolean = false;
</script>

<div class="field">
	<svelte:element this={id === null ? 'p' : 'label'} for={id}
		><span class="label typo-field-label"
			>{label}{#if required} <span class="required-indicator">*</span> {/if}</span
		>
	</svelte:element>
	<slot />
</div>

<style>
	.field {
		flex-grow: 1;
	}

	.label {
		display: inline-flex;
		justify-content: center;
	}

	.required-indicator {
		color: var(--diamond);
		font-size: 1.2em;
		margin-left: 0.125rem;
	}
</style>
