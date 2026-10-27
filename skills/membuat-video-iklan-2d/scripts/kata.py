# Transkrip lokal (gratis) dengan faster-whisper → waktu tiap kata.
# Pakai: py scripts/kata.py audio.mp3 hasil.json [model]
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

audio, keluar = sys.argv[1], sys.argv[2]
model = WhisperModel(sys.argv[3] if len(sys.argv) > 3 else "medium", device="cpu", compute_type="int8")
# decode lewat ffmpeg (PyAV di laptop ini tidak cocok dengan faster-whisper)
pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", audio, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
suara = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
segs, _ = model.transcribe(suara, language=__import__("os").environ.get("BAHASA", "id"), word_timestamps=True, vad_filter=False, beam_size=5)
kata = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words if w.word.strip()]
json.dump(kata, open(keluar, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
print(len(kata), "kata;", " ".join(k["w"] for k in kata))
