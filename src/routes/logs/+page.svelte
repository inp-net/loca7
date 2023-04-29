<script lang="ts">
	import InputField from '$lib/InputField.svelte';
	import InputSelectMultiple from '$lib/InputSelectMultiple.svelte';
	import { tooltip } from '$lib/tooltip';
	import type { PageData } from './$types';

	export let data: PageData;

	let shown: string[] = ['I', 'W', 'E', 'F'];
</script>

<main>
	<h1>Logs</h1>
	<p>Good luck.</p>

	<section class="filter">
		<InputField label="Levels">
			<InputSelectMultiple bind:selection={shown} options={['T', 'I', 'W', 'E', 'F']} />
		</InputField>
	</section>

	<table>
		<tr>
			<th>date</th>
			<th use:tooltip={'levels: [T]race, [I]nfo, [W]arn, [E]rror, [F]atal'}>L</th>
			<th>user</th>
			<th>action</th>
			<th>message</th>
		</tr>
		{#each data.logs
			.filter((l) => shown.includes(['T', 'I', 'W', 'E', 'F'][l.level]))
			.reverse() as log}
			<tr
				id={log.createdAt.toISOString()}
				style:--fg="var(--{['muted', 'fg', 'safran', 'blood', 'white'][log.level]}, #fff)"
				style:--bg="var(--{['muted-bg', 'bg', 'plaster', 'rose', 'mushroom'][log.level]})"
			>
				<td>{log.createdAt.toISOString()}</td>
				<td>{['T', 'I', 'W', 'E', 'F'][log.level]}</td>
				<td>{log.user?.email || 'unknown'}</td>
				<td>{log.action}</td>
				<td>{log.message}</td>
			</tr>
		{/each}
	</table>
</main>

<style>
	h1,
	p {
		text-align: center;
	}
	main {
		display: flex;
		flex-direction: column;
	}
	table {
		margin-top: 3rem;
		border-collapse: collapse;
		width: 100%;
		max-width: 1000px;
		/* table-layout: fixed; */
	}
	tr {
		background-color: var(--bg);
	}
	th {
		text-align: left;
		padding: 0.5rem;
	}
	td {
		border: none;
		padding: 0.5rem;
		white-space: pre;
		overflow: scroll;
	}
	td:nth-child(2),
	th:nth-child(2) {
		text-align: center;
	}
	section.filter {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
