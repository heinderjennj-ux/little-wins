"""Audio: kekerasan (RMS), onset (hit SFX / suku kata), dan transkrip per kata (faster-whisper, opsional).
Pakai: python 08_audio.py hasil/audio.wav hasil/audio [--whisper small]
Hasil: audio.csv (per 0,1 dtk), onset.txt, kata.csv (kata, mulai, selesai) -> sinkron ekspresi & caption."""
import argparse, csv, os
import librosa, numpy as np

ap = argparse.ArgumentParser(); ap.add_argument("wav"); ap.add_argument("dst")
ap.add_argument("--whisper", default="", help="ukuran model faster-whisper (tiny/base/small/medium); kosong = lewati")
a = ap.parse_args(); os.makedirs(a.dst, exist_ok=True)
y, sr = librosa.load(a.wav, sr=16000, mono=True)
hop = 1600
rms = librosa.feature.rms(y=y, hop_length=hop)[0]
cent = librosa.feature.spectral_centroid(y=y, sr=sr, hop_length=hop)[0]
with open(os.path.join(a.dst, "audio.csv"), "w", newline="") as fh:
    w = csv.writer(fh); w.writerow(["t", "rms_db", "centroid_hz"])
    for i, (r, c) in enumerate(zip(rms, cent)):
        w.writerow([round(i * hop / sr, 2), round(float(librosa.amplitude_to_db([r])[0]), 1), round(float(c))])
on = librosa.onset.onset_detect(y=y, sr=sr, units="time")
open(os.path.join(a.dst, "onset.txt"), "w").write("\n".join(f"{t:.2f}" for t in on) + "\n")
tempo = librosa.feature.tempo(y=y, sr=sr)[0] if hasattr(librosa.feature, "tempo") else librosa.beat.tempo(y=y, sr=sr)[0]
print(f"durasi {len(y)/sr:.1f}s · onset {len(on)} ({len(on)/(len(y)/sr):.2f}/dtk) · tempo ~{float(tempo):.0f} BPM")
if a.whisper:
    from faster_whisper import WhisperModel
    model = WhisperModel(a.whisper, device="auto", compute_type="int8")
    segs, info = model.transcribe(a.wav, word_timestamps=True)
    n = 0
    with open(os.path.join(a.dst, "kata.csv"), "w", newline="") as fh:
        w = csv.writer(fh); w.writerow(["kata", "mulai", "selesai"])
        for s in segs:
            for wd in s.words:
                w.writerow([wd.word.strip(), round(wd.start, 2), round(wd.end, 2)]); n += 1
    print(f"{n} kata ({n/(len(y)/sr)*60:.0f} kata/menit) -> kata.csv")
