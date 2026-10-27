# Potong lembar pose AI (4 pose sejajar di latar krem polos) → PNG transparan per pose.
# Latar dihapus dengan floodfill dari tepi; lubang latar yang tertutup (celah lengan-badan) ikut dihapus
# kalau areanya besar & warnanya hampir persis latar (putih mata/kertas aman karena warnanya beda).
# Pakai: py scripts/potong_pose.py lembar.png nama1,nama2,nama3,nama4 [skala]
import os, sys
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

sumber, nama = sys.argv[1], sys.argv[2].split(",")
skala = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
OUT = os.environ.get("POSE_DIR", "D:/PythonProjects/video-3d/public/uji/")

im = Image.open(sumber).convert("RGB")
W, H = im.size
a = np.array(im).astype(int)
bg = np.median(np.concatenate([a[:6].reshape(-1, 3), a[-6:].reshape(-1, 3)]), 0)

# 1) latar dari tepi
w = im.copy()
for s in [(x, 0) for x in range(0, W, 12)] + [(0, y) for y in range(0, H, 12)] + [(W - 1, y) for y in range(0, H, 12)]:
    if w.getpixel(s) != (255, 0, 255):
        ImageDraw.floodfill(w, s, (255, 0, 255), thresh=int(__import__("os").environ.get("AMBANG", 24)))
m = np.array(w)
latar = (m[:, :, 0] == 255) & (m[:, :, 1] == 0) & (m[:, :, 2] == 255)

# 2) lubang tertutup: cari piksel hampir-latar yang belum terhapus, isi per wilayah, hapus yang besar
# TANPA_LUBANG=1 untuk lembar yang punya benda putih besar (jas lab, kertas)
import os
dekat = (np.abs(a - bg).sum(2) < 14) & ~latar
if os.environ.get("TANPA_LUBANG"):
    dekat[:] = False
ys, xs = np.nonzero(dekat)
batas = 1500 * (W / 2048) ** 2
w2 = im.copy()
sudah = np.zeros((H, W), bool)
for y, x in zip(ys[::7], xs[::7]):
    if sudah[y, x]:
        continue
    t = w2.copy()
    ImageDraw.floodfill(t, (int(x), int(y)), (0, 255, 0), thresh=14)
    tt = np.array(t)
    wil = (tt[:, :, 0] == 0) & (tt[:, :, 1] == 255) & (tt[:, :, 2] == 0) & ~latar
    sudah |= wil
    if wil.sum() > batas:
        latar |= wil

alpha = Image.fromarray(((~latar) * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
# REMBG=1: alpha dari model AI BiRefNet (rembg, lokal & gratis) — untuk benda yang warnanya mirip latar (jas lab, kertas)
if os.environ.get("REMBG"):
    from rembg import new_session, remove
    hasil = remove(im, session=new_session(os.environ.get("REMBG_MODEL", "birefnet-general")))
    alpha = hasil.getchannel("A")
    latar = np.array(alpha) < 128
rgba = im.convert("RGBA")
rgba.putalpha(alpha)

# 3) kolom pose: gabungkan potongan yang berdekatan, ambil 4 terlebar
kol = (~latar).sum(0) > 2
runs, mulai = [], None
for x, v in enumerate(list(kol) + [False]):
    if v and mulai is None:
        mulai = x
    if not v and mulai is not None:
        runs.append([mulai, x])
        mulai = None
gabung = []
for r in runs:
    if gabung and r[0] - gabung[-1][1] < 25 * W / 2048:
        gabung[-1][1] = r[1]
    else:
        gabung.append(r)
# potongan paksa (pose yang saling menempel): py ... lembar nama skala x1,x2
for c in ([int(v) for v in sys.argv[4].split(",")] if len(sys.argv) > 4 else []):
    for r in list(gabung):
        if r[0] < c < r[1]:
            gabung.remove(r)
            gabung += [[r[0], c], [c, r[1]]]
gabung = sorted(sorted(gabung, key=lambda r: r[1] - r[0], reverse=True)[:4])
for (x0, x1), n in zip(gabung, nama):
    sub = rgba.crop((max(0, x0 - 6), 0, min(W, x1 + 6), H))
    sub = sub.crop(sub.getbbox())
    if skala != 1:
        sub = sub.resize((round(sub.width * skala), round(sub.height * skala)), Image.LANCZOS)
    sub.save(OUT + n + ".png")
    print(n, sub.size)
