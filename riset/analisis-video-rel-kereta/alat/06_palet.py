"""Palet warna dominan per segmen (color script) dengan k-means di ruang Lab.
Pakai: python 06_palet.py hasil/frames hasil/palet [--detik 2] [--k 6]
Hasil: palet.md (HEX + persen) dan color_script.png (satu baris per segmen) untuk material Blender."""
import argparse, glob, os
import numpy as np
from PIL import Image, ImageDraw
import cv2
from sklearn.cluster import KMeans

ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("dst")
ap.add_argument("--detik", type=float, default=2.0); ap.add_argument("--k", type=int, default=6)
ap.add_argument("--interval", type=float, default=0.2)
a = ap.parse_args(); os.makedirs(a.dst, exist_ok=True)
fs = sorted(glob.glob(os.path.join(a.src, "f_*.jpg"))); per = max(1, round(a.detik / a.interval))
baris, md = [], ["# Palet per segmen", "", "| Segmen | Warna (HEX, % luas) |", "|---|---|"]
for s in range(0, len(fs), per):
    px = []
    for f in fs[s:s + per]:
        im = cv2.imread(f); im = cv2.resize(im, (96, 170))
        px.append(cv2.cvtColor(im, cv2.COLOR_BGR2LAB).reshape(-1, 3))
    X = np.concatenate(px).astype(np.float32)
    km = KMeans(n_clusters=a.k, n_init=4, random_state=0).fit(X)
    porsi = np.bincount(km.labels_, minlength=a.k) / len(X); urut = np.argsort(-porsi)
    lab = km.cluster_centers_[urut].clip(0, 255).astype(np.uint8).reshape(1, -1, 3)
    rgb = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)[0]
    warna = [("#%02x%02x%02x" % tuple(int(v) for v in c), porsi[urut[j]]) for j, c in enumerate(rgb)]
    baris.append(warna)
    md.append(f"| {s * a.interval:.1f}-{(s + per) * a.interval:.1f}s | " + " ".join(f"`{h}` {p*100:.0f}%" for h, p in warna) + " |")
W, H = 600, 24; img = Image.new("RGB", (W, H * len(baris)), "black"); d = ImageDraw.Draw(img)
for i, warna in enumerate(baris):
    x = 0
    for h, p in warna:
        x2 = x + p * W; d.rectangle([x, i * H, x2, (i + 1) * H], fill=h); x = x2
img.save(os.path.join(a.dst, "color_script.png"))
open(os.path.join(a.dst, "palet.md"), "w").write("\n".join(md) + "\n")
print(len(baris), "segmen ->", a.dst)
