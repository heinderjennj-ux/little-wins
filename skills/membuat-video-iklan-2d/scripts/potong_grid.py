# Potong lembar grid 2x2 yang latarnya sudah transparan (hasil birefnet) → PNG per kuadran (dipangkas ke isi) + catat ukuran.
# Urutan nama: kiri-atas, kanan-atas, kiri-bawah, kanan-bawah.
# Pakai: py potong_grid.py lembar-bersih.png nama1,nama2,nama3,nama4 FOLDER_KELUAR UKURAN_JSON
import sys, json, os
import numpy as np
from PIL import Image

src, nama, out, ukf = sys.argv[1], sys.argv[2].split(','), sys.argv[3], sys.argv[4]
a = np.array(Image.open(src).convert('RGBA'))
H, W = a.shape[:2]
uk = json.load(open(ukf)) if os.path.exists(ukf) else {}
for k, n in enumerate(nama):
    x0, y0 = (k % 2) * W // 2, (k // 2) * H // 2
    part = a[y0:y0 + H // 2, x0:x0 + W // 2]
    ys, xs = np.nonzero(part[:, :, 3] > 40)
    c = Image.fromarray(part).crop((max(0, xs.min() - 4), max(0, ys.min() - 4), xs.max() + 5, ys.max() + 5))
    c.save(os.path.join(out, n + '.png')); uk[n] = list(c.size)
json.dump(uk, open(ukf, 'w'), indent=0)
print({n: uk[n] for n in nama})
