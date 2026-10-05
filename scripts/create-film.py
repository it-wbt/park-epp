"""Create an original 12-second, silent material study from project-owned imagery."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import subprocess
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public' / 'videos'
DEST.mkdir(parents=True, exist_ok=True)
W, H, FPS = 1280, 720, 24
scenes = [('hero', 'LESS WEIGHT. MORE POSSIBILITY.'), ('packaging', 'PROTECTION, CONSIDERED.'), ('technical', 'IDEAS, MADE TANGIBLE.'), ('food', 'PACKAGING WITH PURPOSE.')]
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 26)
small = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 16)
frames = []
for asset, caption in scenes:
    image = Image.open(ROOT / 'public' / 'images' / f'{asset}.webp').convert('RGB')
    factor = max(W / image.width, H / image.height)
    image = image.resize((int(image.width * factor), int(image.height * factor)), Image.Resampling.LANCZOS)
    x, y = (image.width - W) // 2, (image.height - H) // 2
    frames.append((image.crop((x, y, x + W, y + H)), caption))
cmd = [imageio_ffmpeg.get_ffmpeg_exe(), '-y', '-f', 'rawvideo', '-vcodec', 'rawvideo', '-s', f'{W}x{H}', '-pix_fmt', 'rgb24', '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(DEST / 'material-story.mp4')]
proc = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
for n in range(12 * FPS):
    scene = n // (3 * FPS)
    local = n % (3 * FPS)
    base, caption = frames[scene]
    zoom = 1 + 0.04 * local / (3 * FPS)
    ww, hh = int(W * zoom), int(H * zoom)
    image = base.resize((ww, hh), Image.Resampling.BICUBIC).crop(((ww-W)//2, (hh-H)//2, (ww-W)//2+W, (hh-H)//2+H))
    if local < 12 and scene > 0:
        image = Image.blend(frames[scene-1][0], image, local / 12)
    overlay = Image.new('RGBA', (W, H))
    draw = ImageDraw.Draw(overlay)
    draw.rectangle((0, H-110, W, H), fill=(6, 55, 79, 235))
    draw.text((45, H-87), 'AERON / MATERIAL THINKING', font=small, fill=(132, 204, 234, 255))
    draw.text((45, H-57), caption, font=font, fill='white')
    image = Image.alpha_composite(image.convert('RGBA'), overlay).convert('RGB')
    proc.stdin.write(image.tobytes())
proc.stdin.close()
err = proc.stderr.read()
if proc.wait() != 0:
    raise RuntimeError(err.decode(errors='replace')[-2000:])
print('Created public/videos/material-story.mp4 — 12 seconds, 1280×720, silent')
