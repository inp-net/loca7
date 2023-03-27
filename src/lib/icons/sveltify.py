#!/usr/bin/env python
import json
from pathlib import Path

root_folder = Path(__file__).parent

all_file_stems = list()


while not (root_folder / ".git").exists() and root_folder.parent != root_folder:
    root_folder = root_folder.parent

for file in (root_folder / "public/icons").glob("*.svg"):
    (root_folder / "src/lib/icons" / file.with_suffix(".svelte").name).write_text(
        """<script lang="ts">
    export let color: string = 'currentColor';
    export let strokeWidth: number = 5;
    export let flip: boolean = false;
            </script>"""
        + file.read_text()
        .replace("<svg", '<svg style:transform={flip ? "scaleX(-1)" : ""}')
        .replace('"black"', "{color}")
        .replace('stroke-width="5"', "stroke-width={strokeWidth}")
    )

    all_file_stems.append(file.stem)

all_file_stems.sort()

(root_folder / "src/lib/icons/types.ts").write_text(
    f"""
export const NAMES = {json.dumps(all_file_stems)} as const;
export type Name = typeof NAMES[number];
"""
)
