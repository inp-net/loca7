#!/usr/bin/env python
from pathlib import Path

for file in Path(__file__).parent.glob("*.svg"):
    file.write_text(
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
    file.rename(file.with_suffix(".svelte"))
