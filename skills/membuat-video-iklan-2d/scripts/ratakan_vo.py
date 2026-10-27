# Ratakan volume VO per kalimat (aturan owner 2026-10-27): ganti nada (serious/calm/curious/excited) boleh,
# tapi KERAS SUARA antar kalimat tidak boleh beda jauh — penonton tidak boleh harus menaikkan volume di tengah video.
# Cara: potong per kalimat (dari kata.json), ukur RMS bagian bersuara, beri gain supaya semua kalimat mendekati median,
# sambung dengan ramp 40 ms (tanpa klik), lalu kompresor ringan + loudnorm ke target.
# Pakai: py scripts/ratakan_vo.py vo-asli.mp3 kata.json vo.wav [target_LUFS=-15]
import json, subprocess, sys
import numpy as np

src, kataf, out = sys.argv[1], sys.argv[2], sys.argv[3]
target = sys.argv[4] if len(sys.argv) > 4 else "-15"
SR = 48000
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
x = np.frombuffer(pcm, np.float32).copy()
K = json.load(open(kataf, encoding="utf-8"))

# kalimat = kata sampai tanda baca akhir . ? ! … atau jeda > 0,35 dtk
seg, mulai = [], 0
for i, k in enumerate(K):
    akhir = k["w"].rstrip('"”').endswith((".", "?", "!", "…", ":")) or (i + 1 < len(K) and K[i + 1]["s"] - k["e"] > 0.35)
    if akhir or i == len(K) - 1:
        seg.append((K[mulai]["s"], k["e"])); mulai = i + 1

def db(a):
    # RMS hanya bagian bersuara (blok 20 ms di atas -45 dBFS) supaya jeda tidak menurunkan ukuran
    b = a[: len(a) // 960 * 960].reshape(-1, 960)
    r = np.sqrt((b ** 2).mean(1) + 1e-12)
    v = r[20 * np.log10(r) > -45]
    return 20 * np.log10(np.sqrt((v ** 2).mean())) if len(v) else -90

lv = [db(x[int(s * SR): int(e * SR)]) for s, e in seg]
med = float(np.median(lv))
gain = np.ones_like(x)
for (s, e), l in zip(seg, lv):
    g = 10 ** (np.clip(med - l, -9, 9) / 20)
    a, b = int(max(0, s - 0.08) * SR), int(min(len(x) / SR, e + 0.12) * SR)
    gain[a:b] = g
# haluskan perubahan gain (ramp ±40 ms)
w = int(0.04 * SR); ker = np.ones(w) / w
gain = np.convolve(gain, ker, mode="same")
y = x * gain
# jeda antar kata diredam 14 dB (ramp 30 ms) supaya desis rekaman tidak terdengar "kresek seperti radio ganti saluran"
# (owner 2026-10-27: loudnorm dinamis menaikkan desis di setiap jeda)
bicara = np.zeros_like(x)
for k in K:
    bicara[int(max(0, k["s"] - 0.06) * SR): int(min(len(x) / SR, k["e"] + 0.1) * SR)] = 1
r = int(0.03 * SR)
bicara = np.convolve(bicara, np.ones(r) / r, mode="same")
y = y * (10 ** (-14 / 20) + (1 - 10 ** (-14 / 20)) * bicara)
sesudah = [db(y[int(s * SR): int(e * SR)]) for s, e in seg]
print(f"{len(seg)} kalimat · sebelum: rentang {max(lv) - min(lv):.1f} dB (sd {np.std(lv):.1f}) · sesudah: rentang {max(sesudah) - min(sesudah):.1f} dB (sd {np.std(sesudah):.1f})")
tmp = out + ".tmp.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", tmp], input=y.astype(np.float32).tobytes(), check=True)
# kompresor ringan + pengurang desis halus, lalu loudnorm DUA LANGKAH mode LINEAR (satu gain tetap — mode dinamis
# menaikkan desis di jeda → bunyi radio). Ukur dulu, lalu terapkan dengan measured_* + linear=true.
pra = "afftdn=nr=8:nf=-50,acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2"
ukur = subprocess.run(["ffmpeg", "-v", "info", "-y", "-i", tmp, "-af", f"{pra},loudnorm=I={target}:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], capture_output=True, text=True).stderr
m = json.loads(ukur[ukur.rindex("{"): ukur.rindex("}") + 1])
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af",
                f"{pra},loudnorm=I={target}:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true",
                "-ar", str(SR), out], check=True)
import os; os.remove(tmp)
