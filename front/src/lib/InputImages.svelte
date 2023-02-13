<script lang="ts">
	import SortableList from './SortableList.svelte';
	import ButtonCircle from './ButtonCircle.svelte';
	import Icon from './Icon.svelte';

	export let filesWithPreview: { file: File; previewURL: string; id: string }[] = [];
	$: updateFiles(inputDom, filesWithPreview);

	let empty: boolean;
	$: empty = filesWithPreview.length === 0;

	let dragging: boolean = false;
	let draggingOverDropzone: boolean = false;
	let inputDom: HTMLInputElement;

	function fileListOf(files: File[]): FileList {
		const filelist = new DataTransfer();
		files.forEach((file) => filelist.items.add(file));
		return filelist.files;
	}

	function updateFilePreviews(files: FileList) {
		[...files].forEach((file) => {
			if (!filesWithPreview.find((f) => f.file.name === file.name)) {
				readAndPreview(file);
			}
		});
	}

	function updateFiles(target: HTMLInputElement, filesWithPreview) {
		if (!target) return;
		console.log("updating <input>'s files");
		target.files = fileListOf(filesWithPreview.map((f) => f.file));
	}

	function readAndPreview(file: File) {
		const reader = new FileReader();
		reader.addEventListener('load', () => {
			filesWithPreview = [
				...filesWithPreview,
				{
					file,
					previewURL: reader.result as string,
					id: file.name
				}
			];
		});
		reader.readAsDataURL(file);
	}
</script>

<!-- TODO styles when dragging file -->

<label
	class="dropzone"
	class:empty
	class:dragging
	class:dragging-over-dropzone={draggingOverDropzone}
	on:dragstart={() => console.log('dragstart')}
	on:dragenter={() => console.log('dragenter')}
	on:dragleave={() => console.log('dragleave')}
	on:dragend={() => console.log('dragend')}
	on:dragover={() => console.log('dragover')}
>
	<input
		type="file"
		multiple
		bind:this={inputDom}
		on:change={(e) => {
			console.log('on change fired');
			updateFilePreviews(e.target.files);
			updateFiles(e.target);
		}}
		accept="image/*"
	/>

	{#if empty}
		<p>
			Glissez-déposer vos fichiers ici<br />Ou cliquez dans cette zone
		</p>
	{:else}
		<SortableList bind:list={filesWithPreview} key="id" let:item={file}>
			<li class="item">
				<button class="drag" title="Glissez pour réordonner les images">
					<Icon name="drag-handle" />
				</button>
				<img src={file.previewURL} />
				<span class="name typo-paragraph">
					{file.file.name}
				</span>
				<ButtonCircle
					on:click={() =>
						(filesWithPreview = filesWithPreview.filter((f) => f.file.name !== file.file.name))}
					icon="delete"
				/>
			</li>
		</SortableList>
	{/if}
	<div class="icon">
		<svg
			width="133"
			height="158"
			viewBox="0 0 133 158"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path d="M29.5 100.21H5.5V5.71045H127.5V100.21H110" stroke="black" stroke-width="10" />
			<path
				d="M66.5 157.29L66.5 42.1953M66.5 42.1953L101.5 77.5576M66.5 42.1953L31.5 77.5576"
				stroke="black"
				stroke-width="10"
			/>
		</svg>
	</div>
</label>

<style>
	.dropzone {
		min-height: 10rem;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		padding: 2rem;
	}

	.dropzone.empty {
		border: var(--border-width) dashed var(--fg);
		text-align: center;
	}

	.dropzone.empty .icon {
		height: 3rem;
	}

	.dropzone:not(.empty) {
		border: var(--border-width) solid var(--fg);
	}

	input {
		height: 100%;
		width: 100%;
		position: absolute;
		overflow: hidden;
		opacity: 0;
		cursor: pointer;
	}

	.icon {
		transition: all 0.25s ease;
	}

	.icon svg {
		height: 100%;
		width: 100%;
	}

	.item {
		display: grid;
		grid-template-columns: 2rem 5rem auto 3rem;
		align-items: center;
		gap: 0.5rem;
		position: relative;
		z-index: 10;
		margin-bottom: 1rem;
	}

	.item span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item img {
		height: 4rem;
		width: 5rem;
		object-fit: cover;
		border-radius: 0.75rem;
		border: var(--border-width) solid var(--fg);
	}

	.item button.drag {
		border: none;
		background-color: transparent;
		height: 2rem;
		width: 2rem;
		cursor: pointer;
	}

	.dropzone:not(.empty) .icon {
		height: 2rem;
	}

	/** Dragging somewhere */
	.dropzone.dragging {
		border-style: solid;
	}

	.dropzone.dragging-over-dropzone {
		border-color: var(--sky);
	}
</style>
