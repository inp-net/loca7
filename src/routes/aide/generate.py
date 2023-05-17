#!/usr/bin/env python
import base64
from PIL import Image
from typing import NamedTuple
from rich import print
from pathlib import Path
from bs4 import BeautifulSoup

class Step(NamedTuple):
    content: str
    picture_path: Path
    marker_style: str
    step_number: int
    has_picture: bool

    def to_svelte(self) -> str:
        picture = ""
        if self.has_picture:
            picture = f"""
                    <picture>
                        <img src="{self.picture_path.relative_to(Path(__file__).parent.parent)}" />
                        <div class="cursor" style="{self.marker_style}"></div>
                    </picture>
            """
        return f"""
            <li class="step">
                <div class="content">
                    <span class="step-number">{self.step_number}.</span>
                    <p>{self.content}</p>
                </div>
                {picture}
            </li>
        """


source_raw = (Path(__file__).parent / "source.html").read_text()

steps_html = BeautifulSoup(source_raw, "html.parser").select("section.steps div.step")

steps: list[Step] = []

for i, step_html in enumerate(steps_html):
    picture = step_html.select_one("picture")
    text_content = step_html.select_one("p .text-content .content").decode_contents().replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&').replace('&quot;', '"').replace('&apos;', "'")
    picture_path = Path(__file__).parent / f"step-{i}.png"
    # Save image to file from base64-encoded string
    if picture:
        (Path(__file__).parent.parent.parent.parent / "public" / picture_path.relative_to(Path(__file__).parent.parent)).write_bytes(
            base64.b64decode(
                picture.select_one("img").get("src").split("base64,")[1]
            )
        )
    steps.append(Step(content=text_content, picture_path=picture_path, marker_style=picture.select_one(".cursor").get("style") if picture else "", has_picture=bool(picture), step_number=i+1))

generated_svelte = " ".join([step.to_svelte() for step in steps])

page_file = (Path(__file__).parent / "+page.svelte")

# Replace content between <!-- START STEPS --> and <!-- END STEPS --> in page_file with generated_svelte
page_file.write_text(
    page_file.read_text().replace(
        page_file.read_text().split("<!-- START STEPS -->")[1].split("<!-- END STEPS -->")[0],
        generated_svelte,
    )
)
