# Potong lembar 4 pose yang latarnya sudah transparan (hasil birefnet) → PNG per pose + catat ukuran.
# Pakai: py potong_bersih.py lembar-bersih.png nama1,nama2,nama3,nama4 FOLDER_KELUAR UKURAN_JSON
import sys, json, os
import numpy as np
from PIL import Image

src, nama, out, ukf = sys.argv[1], sys.argv[2].split(','), sys.argv[3], sys.argv[4]
im = Image.open(src); a = np.array(im); al = a[:, :, 3]
kol = (al > 40).sum(0)
seg = []; x = 0; W = len(kol)
while x < W:
    if kol[x] > 0:
        s = x
        while x < W and kol[x] > 0: x += 1
        if x - s > 3: seg.append([s, x])
    x += 1
while len(seg) > 4:  # gabung serpihan kecil ke tetangga terdekat
    gaps = [seg[i + 1][0] - seg[i][1] for i in range(len(seg) - 1)]
    i = int(np.argmin(gaps)); seg[i] = [seg[i][0], seg[i + 1][1]]; seg.pop(i + 1)
while len(seg) < 4:  # dua pose menempel: belah di kolom paling tipis dalam segmen terlebar
    i = int(np.argmax([b - a_ for a_, b in seg])); s0, s1 = seg[i]
    mid = s0 + (s1 - s0) // 4 + int(np.argmin(kol[s0 + (s1 - s0) // 4: s1 - (s1 - s0) // 4]))
    seg[i:i + 1] = [[s0, mid], [mid, s1]]
uk = json.load(open(ukf)) if os.path.exists(ukf) else {}
for (x0, x1), n in zip(seg, nama):
    part = a.copy(); part[:, :x0, 3] = 0; part[:, x1:, 3] = 0
    ys, xs = np.nonzero(part[:, :, 3] > 40)
    c = Image.fromarray(part).crop((max(0, xs.min() - 4), max(0, ys.min() - 4), min(W, xs.max() + 5), min(a.shape[0], ys.max() + 5)))
    c.save(os.path.join(out, n + '.png')); uk[n] = list(c.size)
json.dump(uk, open(ukf, 'w'), indent=0)
print(seg)
