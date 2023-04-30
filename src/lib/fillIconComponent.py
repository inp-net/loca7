#!/usr/bin/env python
import json
from pathlib import Path

root_folder = Path(__file__).parent


while not (root_folder / ".git").exists() and root_folder.parent != root_folder:
    root_folder = root_folder.parent

icons_svg_map = {}


for file in (root_folder / "public/icons").glob("*.svg"):
    if file.name.startswith("icone_ "):
        file = file.rename(file.with_name(file.name.replace("icone_ ", "")))
    icons_svg_map[file.stem] = (
        file.read_text()
        .replace("<svg", '<svg style:transform={flip ? "scaleX(-1)" : ""}')
        .replace('"black"', "{_color}")
        .replace('stroke-width="5"', "stroke-width={strokeWidth}")
    )


all_file_stems = list(icons_svg_map.keys())
all_file_stems.sort()

print(f"Sveltified {', '.join(all_file_stems)}")

(root_folder / "src/lib/icons/types.ts").write_text(
    f"""
export const NAMES = {json.dumps(all_file_stems)} as const;
export type Name = typeof NAMES[number];
"""
)


def replace_between(start: str, end: str, contents: str, replace_with: str) -> str:
    inside = False
    replaced = False
    lines = contents.splitlines()
    output_lines = []
    for line in lines:
        if line.strip() == end and inside:
            inside = False

        if inside and not replaced:
            output_lines += replace_with.splitlines()
            replaced = True
        elif not inside:
            output_lines.append(line)

        if line.strip() == start:
            inside = True

    return "\n".join(output_lines)


(root_folder / "src/lib/Icon.svelte").write_text(
    replace_between(
        "<!-- generate cases -->",
        "<!-- end generate -->",
        (root_folder / "src/lib/Icon.svelte").read_text(),
        "\n".join(
            [
                f"{{{'#if' if i == 0 else ':else if'} name === {name!r}}}\n{icons_svg_map[name]}"
                for (i, name) in enumerate(all_file_stems)
            ]
        )
        + '\n{:else} <span style="color: red;">unknown icon {name}</span> {/if}',
    )
)
