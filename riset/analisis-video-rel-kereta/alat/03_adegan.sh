#!/usr/bin/env bash
# Deteksi potongan & transisi dengan PySceneDetect (3 detektor).
# Pakai: ./03_adegan.sh input/video.mp4 hasil
set -euo pipefail
V="$1"; O="${2:-hasil}"; mkdir -p "$O/adegan"
scenedetect -i "$V" -q detect-adaptive list-scenes -o "$O/adegan" -f adaptive.csv
scenedetect -i "$V" -q detect-content -t 20 list-scenes -o "$O/adegan" -f content.csv
scenedetect -i "$V" -q detect-threshold -t 12 list-scenes -o "$O/adegan" -f fade.csv
echo "adaptive = potongan keras | content = semua perubahan visual (termasuk whip pan) | fade = ke/dari hitam"
for f in "$O"/adegan/*.csv; do echo "$f: $(($(wc -l < "$f") - 2)) adegan"; done
