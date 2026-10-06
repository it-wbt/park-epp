"""Prepare the silent homepage film from licensed, live-action stock footage."""

import argparse
import json
from pathlib import Path
import shutil
import subprocess
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / 'artifacts' / 'video-candidates'
SOURCES = [
    {
        'name': 'precision-tooling',
        'creator': 'Daniel Smyth',
        'source': 'https://www.pexels.com/video/a-machine-is-cutting-metal-with-a-metal-cutting-tool-9033891/',
        'download': 'https://videos.pexels.com/video-files/9033891/9033891-hd_3840_2160_24fps.mp4',
        'description': 'CNC machining a metal workpiece; general precision-tooling footage.',
    },
    {
        'name': 'polymer-pellets',
        'creator': 'K',
        'source': 'https://www.pexels.com/video/a-person-is-holding-a-bag-of-sugar-26569058/',
        'download': 'https://videos.pexels.com/video-files/26569058/11965413_3840_2160_24fps.mp4',
        'description': 'Hand handling polymer pellets. Source describes HDPE, not EPP.',
    },
]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', help='FFmpeg executable; otherwise use PATH or imageio-ffmpeg')
    args = parser.parse_args()
    ffmpeg = args.ffmpeg or shutil.which('ffmpeg')
    if not ffmpeg:
        import imageio_ffmpeg
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    CACHE.mkdir(parents=True, exist_ok=True)
    for source in SOURCES:
        path = CACHE / (source['name'] + '.mp4')
        if not path.exists():
            with urlopen(source['download'], timeout=60) as response, path.open('wb') as target:
                shutil.copyfileobj(response, target)

    output = ROOT / 'public' / 'videos' / 'park-materials-film.mp4'
    mobile = output.with_name('park-materials-film-mobile.mp4')
    poster = ROOT / 'public' / 'images' / 'materials-film-poster.webp'
    # Both shots last eight seconds. Blend the last .8 seconds into the opening
    # .8 seconds, then rotate the cut so the end rejoins the same opening frame.
    base = 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1,fps=30,format=yuv420p,hflip,eq=saturation=0.85:contrast=1.03:brightness=-0.015'
    filters = (
        f'[0:v]trim=start=3:duration=8,setpts=PTS-STARTPTS,{base}[tool];'
        f'[1:v]trim=start=1.5:duration=8,setpts=PTS-STARTPTS,{base}[material];'
        '[tool][material]xfade=transition=fade:duration=0.8:offset=7.2,fps=30,split[body][head];'
        '[head]trim=duration=0.8,setpts=PTS-STARTPTS,fps=30[opening];'
        '[body][opening]xfade=transition=fade:duration=0.8:offset=14.4,'
        'trim=start=0.8:end=15.2,setpts=PTS-STARTPTS,format=yuv420p[out]'
    )
    common = [ffmpeg, '-y', '-hide_banner', '-loglevel', 'error']
    subprocess.run([
        *common, '-i', str(CACHE / 'precision-tooling.mp4'),
        '-i', str(CACHE / 'polymer-pellets.mp4'),
        '-filter_complex_threads', '2', '-filter_complex', filters,
        '-map', '[out]', '-an', '-c:v', 'libx264', '-preset', 'medium',
        '-crf', '24', '-maxrate', '3500k', '-bufsize', '7000k',
        '-movflags', '+faststart', '-threads', '4', str(output),
    ], check=True)
    subprocess.run([
        *common, '-i', str(output), '-vf', 'scale=960:540', '-an',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '26',
        '-movflags', '+faststart', '-threads', '4', str(mobile),
    ], check=True)
    subprocess.run([
        *common, '-i', str(output), '-frames:v', '1',
        '-c:v', 'libwebp', '-quality', '82', str(poster),
    ], check=True)

    manifest = {
        'checked': '2026-10-05',
        'license': 'https://www.pexels.com/license/',
        'licenseSummary': 'Free website and marketing use; modification permitted; attribution optional.',
        'context': 'Illustrative stock footage of materials and precision tooling. Not footage of PARK facilities or a verified EPP manufacturing process.',
        'sources': SOURCES,
        'edit': 'Two filmed shots, horizontal framing adjustment, restrained colour grade, .8-second crossfades and a continuous loop. No audio.',
        'desktop': {'file': '/videos/park-materials-film.mp4', 'width': 1920, 'height': 1080, 'fps': 30, 'duration': 14.4, 'bytes': output.stat().st_size},
        'mobile': {'file': '/videos/park-materials-film-mobile.mp4', 'width': 960, 'height': 540, 'fps': 30, 'duration': 14.4, 'bytes': mobile.stat().st_size},
        'poster': '/images/materials-film-poster.webp',
        'reproduce': 'python scripts/prepare-stock-hero.py',
    }
    (ROOT / 'research' / 'hero-stock-footage.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'desktopBytes': output.stat().st_size, 'mobileBytes': mobile.stat().st_size, 'posterBytes': poster.stat().st_size}))


if __name__ == '__main__':
    main()
