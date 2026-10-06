"""Make the compact mobile encode and poster from the rendered EPP process film."""

import argparse
from pathlib import Path
import shutil
import subprocess


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--ffmpeg', help='FFmpeg path; defaults to PATH or imageio-ffmpeg')
    args = parser.parse_args()
    ffmpeg = args.ffmpeg or shutil.which('ffmpeg')
    if not ffmpeg:
        import imageio_ffmpeg
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

    root = Path(__file__).resolve().parents[1]
    source = root / 'public/videos/park-epp-manufacturing.mp4'
    if not source.is_file():
        raise SystemExit('Render EppManufacturingHero with Remotion first; see video/epp-banner/MEDIA.md.')

    common = [ffmpeg, '-y', '-hide_banner', '-loglevel', 'error']
    subprocess.run([
        *common, '-i', str(source), '-vf', 'scale=960:540', '-an',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '25',
        '-movflags', '+faststart', '-threads', '4',
        str(source.with_name('park-epp-manufacturing-mobile.mp4')),
    ], check=True)
    subprocess.run([
        *common, '-ss', '20', '-i', str(source), '-frames:v', '1',
        '-c:v', 'libwebp', '-quality', '84',
        str(root / 'public/images/epp-manufacturing-poster.webp'),
    ], check=True)
    print('Prepared mobile film and matching EPP moulding poster.')


if __name__ == '__main__':
    main()
