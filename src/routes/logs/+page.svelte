<script lang="ts">
	import InputField from '$lib/InputField.svelte';
	import InputSelectMultiple from '$lib/InputSelectMultiple.svelte';
	import { tooltip } from '$lib/tooltip';
	import xss from 'xss';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;

	let shown: string[] = ['I', 'W', 'E', 'F'];
	let expandedRow: string = '';
	let highlightLog: string = '';
	$: highlightLog = $page.url.hash.replace('#', '');

	function formatMessage(message: string): string {
		try {
			return JSON.stringify(JSON.parse(message), null, 2);
		} catch (error) {
			if (message.endsWith('}')) {
				const [plaintext, ...json] = message.split('{');
				return plaintext + formatMessage('{' + json.join('{'));
			}
			return message;
		}
	}

	function id<T>(t: T): T {
		return t;
	}
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
			.reverse() as log (log.id)}
			<tr
				id={log.createdAt.toISOString()}
				style:--fg="var(--{['muted', 'fg', 'safran', 'blood', 'white'][log.level]}, #fff)"
				style:--bg="var(--{['muted-bg', 'bg', 'plaster', 'rose', 'mushroom'][log.level]})"
				class:expanded={expandedRow === log.id}
				class:highlighted={highlightLog === log.createdAt.toISOString()}
				on:click={(e) => {
					if (e.ctrlKey) {
						expandedRow = expandedRow === log.id ? '' : log.id;
					}
				}}
			>
				<td>{log.createdAt.toISOString()}</td>
				<td>{['T', 'I', 'W', 'E', 'F'][log.level]}</td>
				<td>{log.user?.email || 'unknown'}</td>
				<td>{log.action}</td>
				<td
					>{@html (expandedRow === log.id ? formatMessage : id)(
						xss(log.message)
					).replaceAll(
						'&lt;redacted&gt;',
						'<span class="redacted">&lt;redacted&gt;</span>'
					)}</td
				>
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
	tr.highlighted {
		border-top: 3px solid var(--fg);
		border-bottom: 3px solid var(--fg);
	}
	tr:not(.highlighted) td:first-child::before {
		content: '  ';
	}
	tr.highlighted td:first-child::before {
		content: '• ';
		/* font-size: 2rem; */
		font-weight: bold;
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
		vertical-align: top;
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
	:global(span.redacted) {
		color: var(--blood);
		font-weight: bold;
	}
</style>
