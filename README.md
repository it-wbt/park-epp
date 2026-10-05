# Parknonwoven EPP

Original Next.js industrial website, inspired by the blue-and-white visual direction and industry taxonomy of Knauf Industries. The website uses the Parknonwoven EPP name supplied by the owner.

## Run

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run check
```

The Next.js App Router exports static HTML to `out/`. This can be hosted on any static service. Set `NEXT_PUBLIC_SITE_URL` to the final origin before rebuilding if the domain changes. Native Sites identity and static output are declared in `.openai/hosting.json`.

## Content and assets

- Catalogue data: `src/lib/catalog.ts`. It includes 13 industries, general product families, six material guides, nine development/process guides, seven solution guides and four original articles.
- Research coverage: `research/catalogue-mapping.json` maps the 39 reference shop items to generic product families. Reference catalogue pages 4–5 were inaccessible; the alternate shop index was used. This is family coverage, not an exact reproduction of the manufacturer’s specifications or complete inventory.
- Generated image sources: `public/images/*.png`; compressed website assets: `public/images/*.webp`.
- Original silent 12-second film: `public/videos/material-story.mp4`; captions: `material-story.vtt`. Regenerate with `python scripts/create-film.py` (Pillow and imageio-ffmpeg required).
- Original vector logo, UI icons and circular design graphic are created in SVG/CSS.

## Before adopting for a real business

Replace the concept brand, company description and privacy contact details. Verify the actual product range, approved technical descriptions and application claims with the business. Product visuals are illustrative concepts, not exact product photographs.

The enquiry form deliberately generates a local downloadable brief. It has no configured supplier email or backend. Add a verified destination and server submission handling if live lead capture is required. There are no invented customer logos, certifications, locations, sales statistics or contact details.

## Image generation briefs

Built-in imagegen was used for four original photographs; no source-site asset was supplied to the generator.

1. Hero: a pale-blue studio arrangement of white bead-foam protective packaging, charcoal EPP chassis, translucent food tray and blue moulded component, landscape composition with negative space for a headline; no logos or text.
2. Packaging: white and charcoal insulated transport boxes and a blue reusable logistics bin, pale-blue seamless studio, realistic bead textures, soft daylight; no logos or text.
3. Technical: charcoal EPP HVAC chassis with duct opening, white insulation blocks and blue injection-moulded housing, pale-blue studio and realistic textures; generic concept geometry, no logos or text.
4. Food: clear PET tray, black rigid food tray, white fish shipping box and blue reusable container on a pale-blue studio surface; empty generic concept objects, no logos or text.

Full generation prompts and built-in results are retained in the conversation. The film is authored from these generated assets with slow camera motion, transitions and original title overlays.
