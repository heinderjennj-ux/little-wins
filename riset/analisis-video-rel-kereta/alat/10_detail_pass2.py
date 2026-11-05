"""PASS 2 — mencari detail kecil yang lolos dari sampling 0,2 dtk.

Ide: gerak kamera dikompensasi (frame sebelumnya di-warp dengan affine ORB+RANSAC), lalu dihitung selisihnya.
Yang tersisa = benda yang bergerak SENDIRI: tokoh jatuh, topi terbang, percikan, benda jatuh ke jurang,
koran melayang, ekspresi berganti, partikel, uap. Puncak skor ini = "peristiwa".
Tiap peristiwa dibuatkan lembar 30 fps (SEMUA frame, ±0,5 dtk) untuk diperiksa Claude/manusia.

Pakai: python 10_detail_pass2.py input/video.mp4 hasil/detail [--sens 3.0] [--jendela 0.5]
Hasil: peristiwa.csv (waktu, skor, posisi area gerak) + p_XXX_t.jpg (lembar 30 fps per peristiwa) + skor.png
Catatan: ambang `--sens` makin kecil = makin banyak peristiwa (lebih teliti, lebih banyak dicek)."""
import argparse, csv, os
import cv2
import numpy as np

ap = argparse.ArgumentParser(); ap.add_argument("video"); ap.add_argument("dst")
ap.add_argument("--sens", type=float, default=3.0, help="ambang = median + sens * MAD")
ap.add_argument("--jendela", type=float, default=0.5, help="detik sebelum/sesudah peristiwa di lembar")
ap.add_argument("--caption", default="0.62,0.78")
a = ap.parse_args(); os.makedirs(a.dst, exist_ok=True)

cap = cv2.VideoCapture(a.video); fps = cap.get(cv2.CAP_PROP_FPS) or 30
c0, c1 = (float(x) for x in a.caption.split(","))
orb = cv2.ORB_create(800); bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
frames, skor, pusat = [], [], []
prev = None
while True:
    ok, f = cap.read()
    if not ok: break
    small = cv2.resize(f, (240, int(240 * f.shape[0] / f.shape[1])))
    g = cv2.cvtColor(small, cv2.COLOR_BGR2GRAY); h, w = g.shape
    m = np.full((h, w), 255, np.uint8); m[int(h * c0):int(h * c1)] = 0
    s, c = 0.0, (np.nan, np.nan)
    if prev is not None:
        k1, d1 = orb.detectAndCompute(prev, m); k2, d2 = orb.detectAndCompute(g, m)
        warp = prev
        if d1 is not None and d2 is not None and len(k1) > 12 and len(k2) > 12:
            mt = bf.match(d1, d2)
            if len(mt) > 10:
                p1 = np.float32([k1[x.queryIdx].pt for x in mt]); p2 = np.float32([k2[x.trainIdx].pt for x in mt])
                M, _ = cv2.estimateAffinePartial2D(p1, p2, method=cv2.RANSAC, ransacReprojThreshold=2)
                if M is not None:
                    warp = cv2.warpAffine(prev, M, (w, h), borderMode=cv2.BORDER_REPLICATE)
        res = cv2.absdiff(warp, g).astype(np.float32); res[m == 0] = 0
        res = cv2.GaussianBlur(res, (5, 5), 0)
        thr = np.percentile(res, 98); s = float(res[res >= thr].mean())
        ys, xs = np.nonzero(res >= thr)
        if len(xs): c = (xs.mean() / w, ys.mean() / h)
    frames.append(small); skor.append(s); pusat.append(c); prev = g

sk = np.array(skor)
# buang tren (gerak kamera cepat menaikkan semua skor): bandingkan dengan median bergulir 1 dtk
win = int(fps)
base = np.array([np.median(sk[max(0, i - win):i + win + 1]) for i in range(len(sk))])
rel = sk - base
mad = np.median(np.abs(rel - np.median(rel))) + 1e-6
th = np.median(rel) + a.sens * mad
puncak, i = [], 1
while i < len(rel) - 1:
    if rel[i] > th and rel[i] >= rel[i - 1] and rel[i] >= rel[i + 1]:
        puncak.append(i); i += int(fps * 0.3)  # jarak minimal antar peristiwa 0,3 dtk
    else:
        i += 1

J = int(a.jendela * fps)
with open(os.path.join(a.dst, "peristiwa.csv"), "w", newline="") as fh:
    wr = csv.writer(fh); wr.writerow(["no", "detik", "skor_relatif", "area_x", "area_y", "lembar"])
    for n, p in enumerate(puncak):
        idx = list(range(max(0, p - J), min(len(frames), p + J + 1)))
        cols = 8; rows_ = (len(idx) + cols - 1) // cols; fh_, fw_ = frames[0].shape[:2]
        sheet = np.zeros((rows_ * fh_, cols * fw_, 3), np.uint8)
        for j, fi in enumerate(idx):
            im = frames[fi].copy()
            cv2.putText(im, f"{fi / fps:.2f}", (3, 14), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1)
            if fi == p: cv2.rectangle(im, (0, 0), (fw_ - 1, fh_ - 1), (0, 0, 255), 3)
            if not np.isnan(pusat[fi][0]):
                cv2.circle(im, (int(pusat[fi][0] * fw_), int(pusat[fi][1] * fh_)), 10, (0, 255, 0), 1)
            sheet[(j // cols) * fh_:(j // cols + 1) * fh_, (j % cols) * fw_:(j % cols + 1) * fw_] = im
        nama = f"p_{n:03d}_{p / fps:06.2f}s.jpg"; cv2.imwrite(os.path.join(a.dst, nama), sheet, [cv2.IMWRITE_JPEG_QUALITY, 85])
        wr.writerow([n, round(p / fps, 2), round(float(rel[p] / mad), 1), round(pusat[p][0], 2), round(pusat[p][1], 2), nama])

# grafik skor
H, W = 200, max(600, len(rel)); gr = np.full((H, W, 3), 255, np.uint8); mx = max(rel.max(), th) + 1e-6
for x in range(len(rel) - 1):
    cv2.line(gr, (x, H - int(max(rel[x], 0) / mx * H)), (x + 1, H - int(max(rel[x + 1], 0) / mx * H)), (80, 80, 80), 1)
cv2.line(gr, (0, H - int(th / mx * H)), (W, H - int(th / mx * H)), (0, 0, 255), 1)
for p in puncak: cv2.circle(gr, (p, H - int(rel[p] / mx * H)), 3, (0, 0, 255), -1)
cv2.imwrite(os.path.join(a.dst, "skor.png"), gr)
print(f"{len(puncak)} peristiwa -> {a.dst}/peristiwa.csv (lembar 30 fps per peristiwa)")
