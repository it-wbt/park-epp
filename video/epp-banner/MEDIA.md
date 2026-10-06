PARK EPP manufacturing film
==========================

The homepage uses `public/videos/park-epp-manufacturing.mp4`, an original 24-second, 1600 x 900, 30 fps, silent 3D process illustration. It shows expanded EPP beads being pneumatically fed into a closed mould, steam fusion, cooling in the closed tool, opening, ejection, and mechanical transfer of the moulded tray to an outfeed conveyor. A transparent cutaway exposes the cavity during filling. The sequence is condensed, and the machine is conceptual; it is not filmed footage of a PARK facility or an exact production-cycle specification.

The machine geometry and deterministic motion are authored in `src/EppManufacturingStage.ts`. `src/EppManufacturingFilm.tsx` wraps the scene in Remotion ThreeCanvas. Both the website and the optional labelled composition use `src/lib/epp-process.ts` in the website project for stage timings. A short fade joins the end of one demonstration to the next.

From this folder:

```powershell
npm install
npx remotion studio --no-open
npx remotion render src/index.ts EppManufacturingHero ../../public/videos/park-epp-manufacturing.mp4 --codec=h264 --crf=22 --pixel-format=yuv420p --gl=angle --concurrency=2
```

Then, from the website root:

```powershell
python scripts/prepare-manufacturing-hero.py
node scripts/verify-banner.mjs
```

The preparation script creates a 960 x 540 mobile encode and a WebP poster. It uses system FFmpeg or `imageio-ffmpeg`. Headlines, stage names, timeline controls, and the pause control remain HTML for responsive sizing and accessibility. Reduced-motion preference disables autoplay. `EppManufacturingProcess` is the same film with explanatory labels for standalone preview.

Process references and limitations are recorded in `research/epp-manufacturing-video.json`. The foam texture is the earlier generated `public/epp-foam-albedo.webp`, mapped onto original geometry.

Earlier stock footage and the `EppBanner` / `EppProductMotion` compositions remain as inactive assets. Their source record is `research/hero-stock-footage.json`; they are not used by the homepage manufacturing banner.
