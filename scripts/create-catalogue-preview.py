"""Render lightweight website previews directly from the current PARK catalogue.

Run manually after updating the PDF:
    python scripts/create-catalogue-preview.py

Requires PyMuPDF and Pillow. These are PDF derivatives, not replacement artwork.
"""

from pathlib import Path

import fitz
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/downloads/park-nonwoven-epp-catalogue.pdf"
OUTPUT = ROOT / "public/images/catalogue-preview"
PREVIEWS = (("cover", 0), ("products", 7), ("project-brief", 11))
WIDTH = 1050


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with fitz.open(SOURCE) as document:
        for name, page_index in PREVIEWS:
            if page_index >= len(document):
                raise ValueError(f"Catalogue has no page {page_index + 1}: {name}")
            page = document[page_index]
            scale = WIDTH / page.rect.width
            pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
            image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
            target = OUTPUT / f"{name}.webp"
            image.save(target, "WEBP", quality=88, method=6)
            print(
                f"{target.relative_to(ROOT)}: page {page_index + 1}/{len(document)}, "
                f"{image.width} x {image.height}, {target.stat().st_size:,} bytes"
            )


if __name__ == "__main__":
    main()
