"""Peta kedalaman per frame dengan Depth Anything V2 (butuh internet ke HuggingFace saat pertama jalan).
Pakai: python 05_kedalaman.py hasil/frames hasil/kedalaman [--model depth-anything/Depth-Anything-V2-Small-hf]
Hasil: PNG peta kedalaman berwarna (dekat = terang) + kedalaman.csv berisi:
  rentang  = seberapa jauh beda dekat vs jauh (komposisi berlapis = tinggi)
  depan/tengah/belakang = porsi piksel di 3 lapisan kedalaman (latar depan-tengah-belakang)"""
import argparse, csv, glob, os
import numpy as np
from PIL import Image
from transformers import pipeline

ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("dst")
ap.add_argument("--model", default="depth-anything/Depth-Anything-V2-Small-hf")
a = ap.parse_args(); os.makedirs(a.dst, exist_ok=True)
pipe = pipeline("depth-estimation", model=a.model)
rows = []
for p in sorted(glob.glob(os.path.join(a.src, "f_*.jpg"))):
    d = np.array(pipe(Image.open(p))["depth"], dtype=np.float32)   # nilai besar = dekat
    n = (d - d.min()) / (d.max() - d.min() + 1e-9)
    q = np.percentile(n, [5, 50, 95])
    rows.append({"frame": os.path.basename(p), "rentang": round(float(q[2] - q[0]), 4),
                 "depan": round(float((n > 0.66).mean()), 4), "tengah": round(float(((n > 0.33) & (n <= 0.66)).mean()), 4),
                 "belakang": round(float((n <= 0.33).mean()), 4)})
    Image.fromarray((n * 255).astype(np.uint8)).convert("L").save(os.path.join(a.dst, os.path.basename(p).replace(".jpg", ".png")))
with open(os.path.join(a.dst, "kedalaman.csv"), "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
print(len(rows), "frame ->", a.dst)
