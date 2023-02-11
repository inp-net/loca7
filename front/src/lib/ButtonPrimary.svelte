<script lang="ts">
	export let id: string;
</script>

<button {id} class="typo-big-button" on:click>
	<slot />
</button>

<style>
	button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem 2rem;

		background: var(--diamond);
		color: #000;

        border: none;
        border-radius: 1000px;

        cursor: pointer;
	}

    button:hover, button:focus {
        background: var(--sky); /* TODO check contrast */
    }
</style>
