# Pindahkan waktu kata hasil whisper ke kata-kata NASKAH ASLI (ejaan & tanda baca naskah dipakai untuk subtitle).
# Pakai: py scripts/sejajar.py naskah.txt kata-mentah.json kata.json
import difflib, json, re, sys

SATUAN = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"]


def angka(n):
    if n < 12: return [SATUAN[n]]
    if n < 20: return [SATUAN[n - 10], "belas"]
    if n < 100: return ([SATUAN[n // 10], "puluh"] if n // 10 > 1 else ["sepuluh"]) + (angka(n % 10) if n % 10 else [])
    return (["seratus"] if n // 100 == 1 else [SATUAN[n // 100], "ratus"]) + (angka(n % 100) if n % 100 else [])


def norm(t):
    return re.sub(r"[^a-z0-9]", "", t.lower())


naskah = open(sys.argv[1], encoding="utf-8").read().split()
mentah = json.load(open(sys.argv[2], encoding="utf-8"))
# pecah token whisper: angka → kata, "tap-tap-tap"/"-sedikit" → potongan
W = []
for k in mentah:
    bagian = [p for p in re.split(r"[-\s]+", k["w"]) if p]
    pecah = []
    for p in bagian:
        n = norm(p)
        pecah += angka(int(n)) if n.isdigit() else [n]
    for i, p in enumerate(pecah):
        d = (k["e"] - k["s"]) / len(pecah)
        W.append({"t": p, "s": k["s"] + i * d, "e": k["s"] + (i + 1) * d})
# kata naskah juga dipecah di tanda hubung, tapi waktunya digabung lagi ke kata aslinya
N = []
for i, w in enumerate(naskah):
    for p in [x for x in re.split(r"-", w) if x]:
        N.append((i, norm(p)))

sm = difflib.SequenceMatcher(a=[n for _, n in N], b=[w["t"] for w in W], autojunk=False)
waktu = [None] * len(N)
for a, b, size in sm.get_matching_blocks():
    for k in range(size):
        waktu[a + k] = (W[b + k]["s"], W[b + k]["e"])
# isi yang tidak cocok dengan interpolasi di antara tetangga
for i in range(len(N)):
    if waktu[i] is None:
        kiri = next((waktu[j][1] for j in range(i - 1, -1, -1) if waktu[j]), 0)
        kanan_j = next((j for j in range(i + 1, len(N)) if waktu[j]), None)
        kanan = waktu[kanan_j][0] if kanan_j is not None else kiri + 0.4
        celah = (kanan_j - i + 1) if kanan_j is not None else 1
        waktu[i] = (kiri, kiri + (kanan - kiri) / celah)
hasil = []
for i, w in enumerate(naskah):
    t = [waktu[j] for j, (idx, _) in enumerate(N) if idx == i]
    hasil.append({"w": w, "s": round(t[0][0], 3), "e": round(t[-1][1], 3)})
json.dump(hasil, open(sys.argv[3], "w", encoding="utf-8"), ensure_ascii=False, indent=0)
cocok = sum(1 for x in waktu if x) - sum(1 for i in range(len(N)) if False)
print(len(hasil), "kata naskah;", sum(size for _, _, size in sm.get_matching_blocks()), "dari", len(N), "potongan cocok langsung")
