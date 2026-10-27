# Potong lembar 4 FRAME animasi (latar sudah transparan, hasil birefnet) jadi 4 PNG BERUKURAN SAMA yang sudah sejajar,
# supaya tokoh tidak meloncat saat frame ditukar.
# - Tiap frame dipisah lewat kolom kosong di antara tokoh (bukan dibagi 4 rata: pose lebar sering melewati seperempat lembar).
# - Mendatar: disejajarkan pada titik tengah sepatu (pita alfa paling bawah milik tokoh). Tegak: posisi asli di lembar dipertahankan
#   (AI sudah menggambar di garis dasar yang sama), jadi lompatan tetap terlihat naik.
# Pakai: py potong_frame.py lembar-bersih.png awalan FOLDER_KELUAR UKURAN_JSON [kaki_px=40]
# Hasil: awalan-1.png … awalan-4.png
import sys, json, os
import numpy as np
from PIL import Image

src, awalan, out, ukf = sys.argv[1:5]
kaki_px = int(sys.argv[5]) if len(sys.argv) > 5 else 40
a = np.array(Image.open(src).convert('RGBA'))
H, W = a.shape[:2]
al = a[:, :, 3] > 40
kol = al.sum(0)

seg, x = [], 0
while x < W:
    if kol[x] > 0:
        s = x
        while x < W and kol[x] > 0: x += 1
        if x - s > 3: seg.append([s, x])
    x += 1
while len(seg) > 4:  # gabung serpihan (tetes lumpur, cipratan) ke tetangga terdekat
    gaps = [seg[i + 1][0] - seg[i][1] for i in range(len(seg) - 1)]
    i = int(np.argmin(gaps)); seg[i] = [seg[i][0], seg[i + 1][1]]; seg.pop(i + 1)
while len(seg) < 4:  # dua frame menempel: belah di kolom paling tipis dalam segmen terlebar
    i = int(np.argmax([b - a_ for a_, b in seg])); s0, s1 = seg[i]
    mid = s0 + (s1 - s0) // 4 + int(np.argmin(kol[s0 + (s1 - s0) // 4: s1 - (s1 - s0) // 4]))
    seg[i:i + 1] = [[s0, mid], [mid, s1]]

frame = []
for s0, s1 in seg:
    m = np.zeros_like(al); m[:, s0:s1] = al[:, s0:s1]
    ys = np.nonzero(m.any(1))[0]
    # titik tengah sepatu: pita bawah tokoh, abaikan benda tipis (sekop/tetes) dengan mengambil kolom yang cukup padat
    pita = m[max(0, ys.max() - kaki_px):ys.max() + 1]
    padat = pita.sum(0)
    xs = np.nonzero(padat >= max(2, padat.max() * 0.35))[0]
    fx = (xs.min() + xs.max()) / 2
    frame.append((s0, s1, fx, ys.min(), ys.max()))

kiri = max(fx - s0 for s0, s1, fx, _, _ in frame)
kanan = max(s1 - fx for s0, s1, fx, _, _ in frame)
atas = min(f[3] for f in frame); bawah = max(f[4] for f in frame)
lebar = int(np.ceil(kiri + kanan)) + 12; tinggi = int(bawah - atas + 13); atas = int(atas); bawah = int(bawah)
uk = json.load(open(ukf)) if os.path.exists(ukf) else {}
for i, (s0, s1, fx, _, _) in enumerate(frame):
    kanvas = Image.new('RGBA', (lebar, tinggi), (0, 0, 0, 0))
    bagian = a.copy(); bagian[:, :s0, 3] = 0; bagian[:, s1:, 3] = 0
    potong = Image.fromarray(bagian[atas - 6 if atas >= 6 else 0: bawah + 7, s0:s1])
    kanvas.paste(potong, (int(round(6 + kiri - (fx - s0))), 0), potong)
    n = f'{awalan}-{i + 1}'
    kanvas.save(os.path.join(out, n + '.png')); uk[n] = [int(lebar), int(tinggi)]
json.dump(uk, open(ukf, 'w'), indent=0)
print(awalan, seg, (lebar, tinggi))
