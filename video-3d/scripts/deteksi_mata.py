# Deteksi mata di pose AI (untuk animasi kedip): cari dua gumpalan putih (bagian putih mata) yang sejajar di separuh atas.
# Hasil: src/v7/mata.json  {pose: {"mata": [{cx,cy,rx,ry}, ...], "kulit": "#rrggbb"}}
import glob, json, os
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

DIR = "D:/PythonProjects/video-3d/public/uji/"
hasil, cek = {}, []
for f in sorted(glob.glob(DIR + "[dbp]-*.png") + glob.glob(DIR + "dimas-p*.png") + glob.glob(DIR + "bunda-p*.png")):
    n = os.path.basename(f)[:-4]
    im = Image.open(f).convert("RGBA")
    a = np.array(im).astype(int)
    h, w = a.shape[:2]
    rgb, al = a[:, :, :3], a[:, :, 3]
    lum, sat = rgb.mean(2), rgb.max(2) - rgb.min(2)
    putih = (lum > 222) & (sat < 40) & (al > 200)
    putih[int(h * 0.55):] = False
    lab, k = ndimage.label(putih)
    blob = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        ys, xs = sl
        ukuran = (lab[sl] == i + 1).sum()
        bw, bh = xs.stop - xs.start, ys.stop - ys.start
        if ukuran > 0.00012 * w * h and bw < 0.2 * w and bh < 0.12 * h:
            blob.append(dict(x=(xs.start + xs.stop) / 2, y=(ys.start + ys.stop) / 2, w=bw, h=bh, n=ukuran))
    pasang = None
    for i in range(len(blob)):
        for j in range(i + 1, len(blob)):
            A, B = sorted([blob[i], blob[j]], key=lambda b: b["x"])
            dx, dy = B["x"] - A["x"], abs(B["y"] - A["y"])
            if 0.1 * w < dx < 0.5 * w and dy < 0.07 * h and 0.4 < A["n"] / B["n"] < 2.5:
                skor = A["n"] + B["n"]
                if pasang is None or skor > pasang[0]:
                    pasang = (skor, A, B)
    if not pasang:
        print(n, "— mata tertutup/tidak terdeteksi (tanpa kedip)")
        continue
    _, A, B = pasang
    mata = [dict(cx=round(b["x"]), cy=round(b["y"]), rx=round(b["w"] / 2 * 1.45 + 5), ry=round(b["h"] / 2 * 1.45 + 7)) for b in (A, B)]
    mx, my = int((A["x"] + B["x"]) / 2), int((A["y"] + B["y"]) / 2)
    kulit = np.median(rgb[my - 8:my + 8, mx - 8:mx + 8].reshape(-1, 3), 0).astype(int)
    hasil[n] = {"mata": mata, "kulit": "#%02x%02x%02x" % tuple(kulit)}
    print(n, mata, hasil[n]["kulit"])
    v = Image.new("RGBA", im.size, (60, 70, 120, 255)); v.alpha_composite(im)
    d = ImageDraw.Draw(v)
    for m in mata:
        d.ellipse([m["cx"] - m["rx"], m["cy"] - m["ry"], m["cx"] + m["rx"], m["cy"] + m["ry"]], outline=(255, 0, 0), width=3)
    v = v.crop((0, 0, w, int(h * 0.6)))
    v.thumbnail((300, 300))
    cek.append(v.convert("RGB"))
json.dump(hasil, open("D:/PythonProjects/video-3d/src/v7/mata.json", "w"), indent=0)
lembar = Image.new("RGB", (8 * 300, ((len(cek) + 7) // 8) * 300), "white")
for i, c in enumerate(cek):
    lembar.paste(c, ((i % 8) * 300, (i // 8) * 300))
lembar.save("C:/Users/lenov/AppData/Local/Temp/claude/d--PythonProjects/553511d8-51ca-4106-bc36-35d4d880665f/scratchpad/mata.jpg", quality=85)
