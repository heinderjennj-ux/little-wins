"""Skor kualitas & estetika per frame dengan pyiqa (unduh bobot model saat pertama jalan).
Pakai: python 07_kualitas.py hasil/frames hasil/kualitas.csv [--metrik musiq,nima,clipiqa,laion_aes]
Gunanya: bandingkan render Blender Anda vs referensi dengan angka yang sama."""
import argparse, csv, glob, os
import pyiqa, torch

ap = argparse.ArgumentParser(); ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--metrik", default="musiq,nima,clipiqa,laion_aes"); ap.add_argument("--tiap", type=int, default=5, help="ambil 1 dari N frame")
a = ap.parse_args()
dev = "cuda" if torch.cuda.is_available() else ("mps" if torch.backends.mps.is_available() else "cpu")
ms = {}
for m in a.metrik.split(","):
    try:
        ms[m] = pyiqa.create_metric(m, device=dev)
    except Exception as e:
        print("lewati", m, e)
fs = sorted(glob.glob(os.path.join(a.src, "f_*.jpg")))[:: a.tiap]
with open(a.out, "w", newline="") as fh:
    w = csv.DictWriter(fh, fieldnames=["frame", *ms]); w.writeheader()
    for f in fs:
        w.writerow({"frame": os.path.basename(f), **{k: round(float(m(f)), 4) for k, m in ms.items()}})
print(len(fs), "frame ->", a.out)
