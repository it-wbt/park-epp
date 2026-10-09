"""Rebuild web-friendly banner films; preserves originals. Requires ffmpeg."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, os, shutil, subprocess
ffmpeg = os.environ.get('FFMPEG_PATH') or shutil.which('ffmpeg')
if not ffmpeg:
    bundled = Path.home() / 'AppData/Roaming/Python/Python312/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
    if bundled.exists(): ffmpeg = str(bundled)
if not ffmpeg: raise SystemExit('Set FFMPEG_PATH to your ffmpeg executable.')
def optimize(source):
    output = source.with_name(source.stem + '-fast-v1.mp4')
    width = 640 if 'mobile' in source.stem else 1280
    subprocess.run([ffmpeg, '-y', '-i', str(source), '-vf', f'scale=min({width}\\,iw):-2,fps=24', '-c:v', 'libx264', '-preset', 'medium', '-crf', '28', '-an', '-movflags', '+faststart', str(output)], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return dict(source=str(source), output=str(output), before=source.stat().st_size, after=output.stat().st_size)
sources = [p for p in Path('public/videos').glob('use-*.mp4') if '-fast-' not in p.stem]
with ThreadPoolExecutor(max_workers=2) as pool: results = list(pool.map(optimize, sources))
Path('research/video-optimization.json').write_text(json.dumps(results, indent=2), encoding='utf-8')
print(f'{len(results)} films optimized.')
