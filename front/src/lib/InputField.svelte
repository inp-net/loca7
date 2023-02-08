<script lang="ts">
	export let label: string;
</script>

<div class="field">
	<label
		><span class="typo-field-label">{label}</span>
		<slot />
	</label>
</div>
