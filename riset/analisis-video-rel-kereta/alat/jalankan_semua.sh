#!/usr/bin/env bash
# Jalankan seluruh analisis. Pakai: ./jalankan_semua.sh input/video.mp4 [hasil] [--ai]
#   --ai  juga menjalankan kedalaman (Depth Anything V2), kualitas (pyiqa), dan transkrip (faster-whisper)
set -euo pipefail
cd "$(dirname "$0")"
V="$1"; O="${2:-hasil}"; AI="${3:-}"
./01_ekstrak.sh "$V" "$O"
python 02_lembar_kontak.py "$O/frames" "$O/lembar"
./03_adegan.sh "$V" "$O"
python 04_ukur.py "$V" "$O/ukur.csv"
python 06_palet.py "$O/frames" "$O/palet"
python 08_audio.py "$O/audio.wav" "$O/audio" ${AI:+--whisper small}
python 09_ringkas.py "$O/ukur.csv" "$O/ringkasan.md"
if [ "$AI" = "--ai" ]; then
  python 05_kedalaman.py "$O/frames" "$O/kedalaman"
  python 07_kualitas.py "$O/frames" "$O/kualitas.csv"
fi
echo "Selesai. Buka $O/ringkasan.md, $O/palet/palet.md, $O/lembar/"
