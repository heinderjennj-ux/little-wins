"""Lembar kontak: 10 frame (2 dtk) per gambar, 5x2, dengan cap waktu.
Pakai: python 02_lembar_kontak.py hasil/frames hasil/lembar [--interval 0.2]
Lembar ini yang dibaca Claude/manusia untuk analisis visual frame per frame."""
import argparse, glob, os
from PIL import Image, ImageDraw
ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("dst")
ap.add_argument("--interval", type=float, default=0.2); ap.add_argument("--lebar", type=int, default=300)
a = ap.parse_args(); os.makedirs(a.dst, exist_ok=True)
fs = sorted(glob.glob(os.path.join(a.src, "f_*.jpg")))
if not fs: raise SystemExit("tidak ada frame")
w0, h0 = Image.open(fs[0]).size; W = a.lebar; H = round(W * h0 / w0); per = 10
for s in range(0, len(fs), per):
    sheet = Image.new("RGB", (W * 5, H * 2), "black"); d = ImageDraw.Draw(sheet)
    for i, f in enumerate(fs[s:s + per]):
        x, y = (i % 5) * W, (i // 5) * H
        sheet.paste(Image.open(f).resize((W, H)), (x, y))
        t = (int(os.path.basename(f)[2:6]) - 1) * a.interval
        d.rectangle([x, y, x + 70, y + 18], fill="black"); d.text((x + 3, y + 3), f"{t:05.1f}s", fill="yellow")
    sheet.save(os.path.join(a.dst, f"s_{s // per:02d}.jpg"), quality=88)
print("lembar:", (len(fs) + per - 1) // per, "->", a.dst)
