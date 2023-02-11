<script lang="ts">
	export let label: string;
	export let id: string | null = null;
</script>

<div class="field">
	<svelte:element this={id === null ? 'p' : 'label'} for={id}
		><span class="typo-field-label">{label}</span>
	</svelte:element>
	<slot />
</div>
