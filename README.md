# Parknonwoven EPP

Next.js industrial website using the owner's PARK filtration visual system: forest-film hero, PARK logo, blue/navy/green palette and three-column nested mega menus. Industry and product-family coverage was researched from Knauf Industries; all editorial copy and generated visuals are original. The website uses the Parknonwoven EPP name supplied by the owner.

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

- Catalogue data: `src/lib/catalog.ts`. It includes 13 industries, general product families, seven material guides, nine development/process guides, seven solution guides and four original articles.
- Research coverage: `research/catalogue-mapping.json` maps the 39 reference shop items to generic product families. Reference catalogue pages 4–5 were inaccessible; the alternate shop index was used. This is family coverage, not an exact reproduction of the manufacturer’s specifications or complete inventory.
- Generated image sources: `public/images/*.png`; compressed website assets: `public/images/*.webp`.
- Original silent 12-second film: `public/videos/material-story.mp4`; captions: `material-story.vtt`. Regenerate with `python scripts/create-film.py` (Pillow and imageio-ffmpeg required).
- Owner-authorized PARK logo is from the existing park-filtration project; all UI icons are original SVG.
- 14 newly generated forest/industry images and 8 product-format images are in public/images/markets and public/images/products (PNG masters and optimized WebP).
- Forest hero film and 2 original PDF downloads: regenerate using scripts/create-redesign-media.py (Pillow, reportlab, imageio-ffmpeg).
- Seven resource categories, three about/support pages, custom parts guidance and 77 detailed product pages.

## Enquiries and product data

Contact email uses the owner's existing PARK address, sales@parknonwoven.com. The enquiry form creates a local downloadable brief; users email that file themselves. No server submission or delivery success is implied. Grade-specific properties, certifications, dimensions, production capacity and job vacancies are not invented. Product imagery is generated visualization, not exact supplied-product photography.

## Image generation briefs

Built-in imagegen was used for four original photographs; no source-site asset was supplied to the generator.

1. Hero: a pale-blue studio arrangement of white bead-foam protective packaging, charcoal EPP chassis, translucent food tray and blue moulded component, landscape composition with negative space for a headline; no logos or text.
2. Packaging: white and charcoal insulated transport boxes and a blue reusable logistics bin, pale-blue seamless studio, realistic bead textures, soft daylight; no logos or text.
3. Technical: charcoal EPP HVAC chassis with duct opening, white insulation blocks and blue injection-moulded housing, pale-blue studio and realistic textures; generic concept geometry, no logos or text.
4. Food: clear PET tray, black rigid food tray, white fish shipping box and blue reusable container on a pale-blue studio surface; empty generic concept objects, no logos or text.

Full generation prompts and built-in results are retained in the conversation. The film is authored from these generated assets with slow camera motion, transitions and original title overlays.

## Redesign asset briefs

Additional imagegen scenes: a lush cinematic forest; HVAC lab with EPP duct; aircraft cabin with foam insert; furniture workshop with foam chair core; EV component workbench; appliance with fitted foam corners; warehouse with bins/pallets/insulated packs; gym with foam jump box; playroom with rounded blocks; fresh food with trays and foam fish box; building insulation; pharma shipping pack; planted roof drainage; pool EPS construction blocks. All have no source logos, labels or text. Product studio images cover corners, sheets, pallets, insulated boxes, trays, drainage panels, pool forms and play forms. The forest film is a text-free slow camera move authored from the generated forest image.

## Product menu

The rounded catalogue menu follows the owner's PARK filtration product-menu layout. It keeps all EPP categories, uses product-format thumbnails with short material labels, and updates the white product preview on hover or keyboard focus. The preview button opens that specific product. `src/app/menu.css` supplies the compact menu layout, and `scripts/verify-menu.mjs` checks desktop/mobile interaction.
