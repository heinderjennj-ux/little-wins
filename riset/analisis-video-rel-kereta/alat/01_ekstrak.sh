#!/usr/bin/env bash
# Pakai: ./01_ekstrak.sh input/video.mp4 hasil
# Hasil: hasil/frames/f_0001.jpg (tiap 0,2 dtk), hasil/audio.wav, hasil/info.json
set -euo pipefail
V="$1"; O="${2:-hasil}"
mkdir -p "$O/frames"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of json "$V" > "$O/info.json"
ffmpeg -v error -y -i "$V" -vf fps=5 -q:v 2 "$O/frames/f_%04d.jpg"
ffmpeg -v error -y -i "$V" -vn -ac 1 -ar 16000 "$O/audio.wav" || echo "(tidak ada audio)"
echo "frame: $(ls "$O/frames" | wc -l)  -> $O/frames"
