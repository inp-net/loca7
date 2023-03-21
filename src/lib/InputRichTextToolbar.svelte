<script lang="ts">
	import ButtonSecondary from './ButtonSecondary.svelte';
	import type { LexicalEditor, TextFormatType } from 'lexical';
	import { createEditor, FORMAT_TEXT_COMMAND, UNDO_COMMAND } from 'lexical';
	import { INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';

	export let editor: LexicalEditor;

	const format = (value: TextFormatType) => () => {
		editor.dispatchCommand(FORMAT_TEXT_COMMAND, value);
		editor.focus();
	};

	const bulletList = () => {
		editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, void 0);
		editor.focus();
	};
</script>

<ul class="toolbar">
	<li>
		<ButtonSecondary on:click={format('bold')}>G</ButtonSecondary>
	</li>
	<li>
		<ButtonSecondary on:click={format('italic')}>I</ButtonSecondary>
	</li>
	<li>
		<ButtonSecondary on:click={bulletList} icon="editor-list">liste</ButtonSecondary>
	</li>
	<li>
		<ButtonSecondary icon="editor-link">lien</ButtonSecondary>
	</li>
</ul>

<style>
	.toolbar {
		background: var(--bg);
		border-bottom: var(--border-width) solid var(--fg);
		display: flex;
		list-style: none;
		padding: 0.75rem;
		gap: 0.5rem;
	}
</style>
