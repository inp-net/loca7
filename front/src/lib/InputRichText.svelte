<script lang="ts">
	import type { LexicalEditor } from 'lexical';
	import { createEditor } from 'lexical';
	import { onMount } from 'svelte';
	import InputRichTextToolbar from './InputRichTextToolbar.svelte';
	import { registerRichText } from '@lexical/rich-text';
	import { registerMarkdownShortcuts } from '@lexical/markdown';
	import lexicalHTML from '@lexical/html';
	import { ListNode, ListItemNode } from '@lexical/list';
	import { LinkNode, AutoLinkNode } from '@lexical/link';
	import lexical from 'lexical';
	import Edit from './icons/edit.svelte';

	const editor: LexicalEditor = createEditor({
		namespace: 'editor',
		nodes: [LinkNode, AutoLinkNode, ListNode, ListItemNode],
		onError: console.error,
		editable: true
	});

	onMount(() => {
		editor.setRootElement(domEditor);
		editor.update(() => {
			lexicalHTML['$generateNodesFromDOM'](
				editor,
				new DOMParser().parseFromString(value, 'text/html')
			);
		});
		registerRichText(editor);
		editor.registerUpdateListener(({ editorState }) => {
			editorState.read(() => {
				value = lexicalHTML['$generateHtmlFromNodes'](editor, null);
			});
		});
	});

	let domEditor: HTMLElement;
	export let placeholder: string = '';
	export let value: string = '';
</script>

<div class="wrapper">
	<InputRichTextToolbar {editor} />
	<div class="editor" bind:this={domEditor} contenteditable="true" />
</div>

<style>
	.wrapper {
		width: 100%;
		border: var(--border-width) solid var(--fg);
	}

	.editor {
		padding: 0.75rem;
	}
</style>
