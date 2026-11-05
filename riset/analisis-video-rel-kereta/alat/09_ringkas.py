"""Ringkas ukur.csv -> ringkasan.md: label gerak kamera per jendela 0,2 dtk, segmen, statistik, dissolve.
Pakai: python 09_ringkas.py hasil/ukur.csv hasil/ringkasan.md [--jendela 6]
Ambang batas di bawah bisa disetel; cek beberapa segmen dengan lembar kontak untuk kalibrasi."""
import argparse, csv, math, statistics as st

ap = argparse.ArgumentParser(); ap.add_argument("csv"); ap.add_argument("out")
ap.add_argument("--jendela", type=int, default=6, help="frame per jendela (6 = 0,2 dtk di 30 fps)")
a = ap.parse_args()
R = list(csv.DictReader(open(a.csv)))
FPS = round(1 / (float(R[1]["t"]) - float(R[0]["t"]))) if len(R) > 1 else 30
f = lambda r, k: float(r[k]) if r.get(k) not in (None, "") else None

# Ambang per frame (dikalibrasi pada 0-3 dtk referensi; median per jendela supaya tahan noise)
PAN, ZOOM, ROLL, WHIP_FLOW, MIN_INLIER = 0.004, 0.004, 0.35, 6.0, 0.4

def label(win):
    ok = [r for r in win if (f(r, "inlier") or 0) >= MIN_INLIER]
    med = lambda k, d=0.0: st.median([f(r, k) if f(r, k) is not None else d for r in ok]) if ok else d
    tx, ty, rot = med("tx"), med("ty"), med("rot")
    sc = math.log(med("scale", 1.0))
    flow = st.mean([f(r, "flow") or 0 for r in win]); out = []
    if flow > WHIP_FLOW:
        out.append("WHIP/terbang cepat")
    if abs(tx) > PAN: out.append("pan kiri" if tx > 0 else "pan kanan")
    if abs(ty) > PAN: out.append("tilt atas" if ty > 0 else "tilt bawah")
    if abs(sc) > ZOOM: out.append("maju (dolly/zoom in)" if sc > 0 else "mundur (dolly/zoom out)")
    if abs(rot) > ROLL: out.append("roll")
    if not out:
        out.append("drift halus" if flow > 0.6 else "diam")
    return " + ".join(out), flow

wins = [R[i:i + a.jendela] for i in range(1, len(R), a.jendela)]
lab = [(float(w[0]["t"]), *label(w)) for w in wins if w]
seg = []
for t, l, fl in lab:
    if seg and seg[-1][2] == l:
        seg[-1][1] = t
    else:
        seg.append([t, t, l])
dis = [float(r["t"]) for r in R if r.get("dissolve")]
dis_grp = []
for t in dis:
    if dis_grp and t - dis_grp[-1][-1] < 0.2: dis_grp[-1].append(t)
    else: dis_grp.append([t])

N = len(lab); hit = lambda s: sum(1 for x in lab if s in x[1]) / max(N, 1) * 100
def rata(k):
    v = [f(r, k) for r in R if f(r, k) is not None]; return st.mean(v) if v else float("nan")

L = ["# Ringkasan pengukuran", "", f"Frame: {len(R)} · jendela {a.jendela} frame", "",
     "## Statistik kamera (persen jendela 0,2 dtk)", "",
     f"- Diam: {hit('diam'):.1f}% · drift halus: {hit('drift'):.1f}%",
     f"- Pan: {hit('pan'):.1f}% · tilt: {hit('tilt'):.1f}% · dolly/zoom: {hit('maju')+hit('mundur'):.1f}% · roll: {hit('roll'):.1f}% · whip/terbang cepat: {hit('WHIP'):.1f}%",
     f"- Kandidat dissolve: {len(dis_grp)} → " + ", ".join(f"{g[0]:.2f}s" for g in dis_grp), "",
     "## Rata-rata visual", "",
     f"- Saturasi {rata('sat'):.3f} · kecerahan {rata('val'):.3f} · kontras {rata('contrast'):.3f}",
     f"- Piksel hangat {rata('hangat')*100:.1f}% · dingin {rata('dingin')*100:.1f}%",
     f"- Kabut (dark channel) atas/tengah/bawah: {rata('haze_atas'):.3f} / {rata('haze_tengah'):.3f} / {rata('haze_bawah'):.3f}",
     f"- Ketajaman (Laplacian var) median: {st.median([f(r,'sharp') for r in R]):.1f}",
     f"- Pusat saliency rata-rata: x={rata('sal_x'):.2f}, y={rata('sal_y'):.2f} (0,5 = tengah; 0,33/0,67 = garis sepertiga)", "",
     "## Segmen gerak kamera", "", "| Mulai | Selesai | Gerak |", "|---|---|---|"]
L += [f"| {s:.1f} | {e + a.jendela / FPS:.1f} | {l} |" for s, e, l in seg]
open(a.out, "w").write("\n".join(L) + "\n")
print("->", a.out)
