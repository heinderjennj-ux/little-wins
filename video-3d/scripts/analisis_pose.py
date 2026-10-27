# Bersihkan sisa latar di dalam pose AI (celah lengan-kepala) lalu deteksi mata (bagian putih) & mulut untuk animasi kedip/bicara.
# Hasil: public/uji/pose.json
import json, sys
from PIL import Image, ImageDraw
import numpy as np

DIR = "D:/PythonProjects/video-3d/public/uji/"
BG = np.array([245, 240, 231])


def komponen(mask):
    """label komponen terhubung (4-arah) tanpa scipy."""
    h, w = mask.shape
    lab = np.zeros((h, w), np.int32)
    n = 0
    for y0 in range(h):
        for x0 in np.nonzero(mask[y0] & (lab[y0] == 0))[0]:
            if lab[y0, x0]:
                continue
            n += 1
            st = [(y0, x0)]
            lab[y0, x0] = n
            while st:
                y, x = st.pop()
                for yy, xx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
                    if 0 <= yy < h and 0 <= xx < w and mask[yy, xx] and not lab[yy, xx]:
                        lab[yy, xx] = n
                        st.append((yy, xx))
    return lab, n


hasil = {}
for nama in sys.argv[1:]:
    im = Image.open(DIR + nama + ".png").convert("RGBA")
    a = np.array(im).astype(int)
    rgb, al = a[:, :, :3], a[:, :, 3]
    # 1) lubang latar yang tertutup: warna sangat dekat latar & area besar → transparan
    dekat = (np.abs(rgb - BG).sum(2) < 20) & (al > 0)
    lab, n = komponen(dekat)
    for i in range(1, n + 1):
        m = lab == i
        if m.sum() > 400:
            al[m] = 0
    im2 = Image.fromarray(np.dstack([rgb, al]).astype(np.uint8), "RGBA")
    im2.save(DIR + nama + ".png")
    h, w = al.shape
    # 2) mata: piksel putih (sklera) di 60% atas gambar, dua komponen terbesar
    lum = rgb.mean(2)
    sat = rgb.max(2) - rgb.min(2)
    putih = (lum > 225) & (sat < 30) & (al > 200)
    putih[int(h * 0.62):] = False
    lab, n = komponen(putih)
    blob = []
    for i in range(1, n + 1):
        ys, xs = np.nonzero(lab == i)
        if len(ys) > 60:
            blob.append((len(ys), xs.min(), xs.max(), ys.min(), ys.max()))
    blob = sorted(blob, reverse=True)[:2]
    mata = []
    for _, x0, x1, y0, y1 in sorted(blob, key=lambda b: b[1]):
        # perluas sedikit: kotak mata mencakup iris di atas/bawah sklera
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        mata.append({"cx": round(cx), "cy": round(cy), "rx": round((x1 - x0) / 2 * 1.25 + 6), "ry": round((y1 - y0) / 2 * 1.35 + 8)})
    # 3) warna kulit: median piksel di bawah-tengah antara kedua mata
    if len(mata) == 2:
        mx = (mata[0]["cx"] + mata[1]["cx"]) // 2
        my = max(m["cy"] for m in mata)
        patch = rgb[my + 30:my + 50, mx - 70:mx - 40].reshape(-1, 3)
        kulit = [int(v) for v in np.median(patch, 0)]
    else:
        mx, kulit = w // 2, [237, 187, 148]
    # 4) mulut: piksel merah gelap di bawah mata
    merah = (rgb[:, :, 0] > 90) & (rgb[:, :, 0] - rgb[:, :, 2] > 60) & (lum < 140) & (al > 200)
    y_mulai = (max(m["cy"] for m in mata) + 40) if mata else int(h * 0.3)
    merah[:y_mulai] = False
    merah[int(h * 0.62):] = False
    ys, xs = np.nonzero(merah)
    mulut = {"cx": int(np.median(xs)), "cy": int(np.median(ys))} if len(xs) else {"cx": mx, "cy": y_mulai + 60}
    hasil[nama] = {"w": w, "h": h, "mata": mata, "kulit": kulit, "mulut": mulut}
    print(nama, hasil[nama])
json.dump(hasil, open(DIR + "pose.json", "w"), indent=1)
