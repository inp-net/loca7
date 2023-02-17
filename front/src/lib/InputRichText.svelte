<script lang="ts">
	import type { LexicalEditor } from 'lexical';
	import { createEditor } from 'lexical';
	import { onMount } from 'svelte';
	import InputRichTextToolbar from './InputRichTextToolbar.svelte';
	import { registerRichText } from '@lexical/rich-text';
	import { registerMarkdownShortcuts } from '@lexical/markdown';
	import { ListNode, ListItemNode } from '@lexical/list';
	import { LinkNode, AutoLinkNode } from '@lexical/link';
	import lexical from 'lexical';

	const editor: LexicalEditor = createEditor({
		namespace: 'editor',
		nodes: [LinkNode, AutoLinkNode, ListNode, ListItemNode],
		onError: console.error,
		editable: true
	});

	onMount(() => {
		editor.setRootElement(domEditor);
		editor.update(() => {
			let root = lexical['$getRoot']();
			root.append(lexical['$createParagraphNode']().append(lexical['$createTextNode'](value)));
		});
		registerRichText(editor);
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
