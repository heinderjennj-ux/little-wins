"""Pengukuran per frame (semua frame, 30 fps):
  - gerak kamera: ORB + RANSAC affine -> tx (pan), ty (tilt), scale (zoom/dolly), rot (roll)
  - energi gerak: optical flow Farneback (rata-rata, atas vs bawah = indikasi paralaks)
  - ketajaman (Laplacian variance) -> blur gerak / whip pan
  - warna: saturasi, kecerahan, kontras, porsi piksel hangat/dingin (Lab b*)
  - kabut/kedalaman: Dark Channel Prior (He et al. 2009) per sepertiga frame (atas/tengah/bawah)
  - komposisi: titik pusat saliency (Spectral Residual)
  - kandidat dissolve: frame t ≈ a*frame(t-k) + (1-a)*frame(t+k)

Pakai: python 04_ukur.py input/video.mp4 hasil/ukur.csv [--maks 0] [--caption 0.62,0.78]
Area caption (proporsi tinggi) di-mask supaya teks yang diam tidak dianggap "kamera diam".
"""
import argparse, csv
import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("video"); ap.add_argument("out")
ap.add_argument("--maks", type=int, default=0, help="batasi jumlah frame (0 = semua)")
ap.add_argument("--caption", default="0.62,0.78", help="pita caption yang di-mask, proporsi tinggi 'atas,bawah'")
a = ap.parse_args()

cap = cv2.VideoCapture(a.video)
fps = cap.get(cv2.CAP_PROP_FPS) or 30
orb = cv2.ORB_create(1500)
bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
sal = cv2.saliency.StaticSaliencySpectralResidual_create()
c0, c1 = (float(x) for x in a.caption.split(","))

rows, kecil = [], []
prevg = prevk = prevd = None
i = 0
while True:
    ok, f = cap.read()
    if not ok or (a.maks and i >= a.maks):
        break
    h, w = f.shape[:2]
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    m = np.full((h, w), 255, np.uint8); m[int(h * c0):int(h * c1), :] = 0
    r = {"frame": i, "t": round(i / fps, 3)}

    r["sharp"] = cv2.Laplacian(g, cv2.CV_64F).var()
    hsv = cv2.cvtColor(f, cv2.COLOR_BGR2HSV)
    r["sat"] = hsv[..., 1].mean() / 255; r["val"] = hsv[..., 2].mean() / 255
    r["contrast"] = g.std() / 255
    bstar = cv2.cvtColor(f, cv2.COLOR_BGR2LAB)[..., 2].astype(np.float32) - 128
    r["hangat"] = (bstar > 8).mean(); r["dingin"] = (bstar < -8).mean()

    # Dark Channel Prior: haze = 1 - transmisi (makin besar = makin berkabut/jauh)
    dc = cv2.erode(f.min(axis=2), np.ones((15, 15), np.uint8)).astype(np.float32)
    A = max(np.percentile(f.max(axis=2), 99.9), 1)
    haze = 0.95 * dc / A
    r["haze_atas"] = haze[: h // 3].mean(); r["haze_tengah"] = haze[h // 3: 2 * h // 3].mean(); r["haze_bawah"] = haze[2 * h // 3:].mean()

    ok2, sm = sal.computeSaliency(f)
    if ok2:
        sm = cv2.resize(sm.astype(np.float32), (w, h)) * (m > 0)
        s = sm.sum() + 1e-9; ys, xs = np.mgrid[0:h, 0:w]
        r["sal_x"] = (sm * xs).sum() / s / w; r["sal_y"] = (sm * ys).sum() / s / h

    k, d = orb.detectAndCompute(g, m)
    if prevg is not None:
        if d is not None and prevd is not None and len(k) > 20 and len(prevk) > 20:
            mt = bf.match(prevd, d)
            if len(mt) > 15:
                p1 = np.float32([prevk[x.queryIdx].pt for x in mt]); p2 = np.float32([k[x.trainIdx].pt for x in mt])
                M, inl = cv2.estimateAffinePartial2D(p1, p2, method=cv2.RANSAC, ransacReprojThreshold=3)
                if M is not None:
                    r["scale"] = float(np.hypot(M[0, 0], M[1, 0]))
                    r["rot"] = float(np.degrees(np.arctan2(M[1, 0], M[0, 0])))
                    c2 = M @ np.array([w / 2, h / 2, 1.0])
                    r["tx"] = (c2[0] - w / 2) / w   # isi gambar bergeser ke kanan (+) = kamera pan ke kiri
                    r["ty"] = (c2[1] - h / 2) / h   # isi gambar turun (+) = kamera tilt ke atas
                    r["inlier"] = float(inl.mean())
        pa = cv2.resize(prevg, (w // 2, h // 2)); pb = cv2.resize(g, (w // 2, h // 2))
        fl = cv2.calcOpticalFlowFarneback(pa, pb, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        mag = np.hypot(fl[..., 0], fl[..., 1]); hh = mag.shape[0]
        r["flow"] = mag.mean(); r["flow_atas"] = mag[: hh // 3].mean(); r["flow_bawah"] = mag[2 * hh // 3:].mean()
        r["selisih"] = cv2.absdiff(prevg, g).mean()
    kecil.append(cv2.resize(g, (64, 114)).astype(np.float32))
    rows.append(r); prevg, prevk, prevd = g, k, d; i += 1

# kandidat dissolve
K = 4
for t in range(K, len(kecil) - K):
    A_, B_, C_ = kecil[t - K], kecil[t + K], kecil[t]
    beda = np.abs(A_ - B_).mean()
    if beda < 12:
        continue
    D = (A_ - B_).ravel()
    al = float(np.dot((C_ - B_).ravel(), D) / (np.dot(D, D) + 1e-9))
    res = np.abs(C_ - (al * A_ + (1 - al) * B_)).mean()
    if 0.15 < al < 0.85 and res < 0.35 * beda:
        rows[t]["dissolve"] = round(al, 2)

kolom = sorted({k for r in rows for k in r}, key=lambda x: (x not in ("frame", "t"), x))
with open(a.out, "w", newline="") as fh:
    wr = csv.DictWriter(fh, fieldnames=kolom); wr.writeheader()
    for r in rows:
        wr.writerow({k: (round(v, 5) if isinstance(v, float) else v) for k, v in r.items()})
print(f"{len(rows)} frame @ {fps:.2f} fps -> {a.out}")
