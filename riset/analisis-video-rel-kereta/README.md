# Analisis video referensi "Why Perfect Railroads Don't Work" → resep Blender

Tujuan: melatih AI (Claude yang menulis kode Blender) supaya hasilnya sedetail video referensi. Fokusnya dunia, gerak tokoh, ekspresi wajah, detail kecil, kedalaman, dan **transisi lewat gerak kamera**.

## Isi folder
| File | Isi |
|---|---|
| `01-analisis-frame.md` | Hasil memeriksa **326 frame (tiap 0,2 dtk)**: ringkasan gaya, desain tokoh, kamus ekspresi, timeline per ketukan narasi (kamera, ekspresi, dunia, detail mikro), pola transisi, prinsip yang bisa ditiru |
| `02-alat-profesional.md` | Alat apa mengukur apa (FFmpeg, PySceneDetect, OpenCV, Depth Anything, Dark Channel Prior, scopes DaVinci, pyiqa, Whisper, Blender Motion Tracking, fSpy, BlenderMCP…) + hasil pencarian skill/plugin + sumber |
| `03-panduan-blender.md` | Menerjemahkan temuan ke **resep bpy**: render, dunia, tokoh 2D di 3D, ekspresi, kamera, warna, ritme, cara membandingkan render vs referensi |
| `04-checklist-detail.md` | **Metode 3 pass** supaya detail kecil tidak terlewat (mis. tokoh jatuh & topi terbang saat kereta lewat), checklist per shot, langkah kerja di localhost, pertanyaan yang belum terjawab |
| `05-catatan-perbaikan-buku-gaya.md` | **Audit `BUKU_GAYA.md`** (repo youtube, branch `claude/sharp-clarke-irc3u0`): lapisan yang belum ada (katalog peristiwa, alur emosi per tokoh, gerak sebagai animasi, sinkron narasi, kepadatan detail, transisi kamera), format CSV, protokol 6 pass untuk AI |
| `alat/` | Toolkit analisis yang bisa dijalankan di localhost |
| `blender/gaya_dasar.py` | Scene uji Blender yang menerapkan resep (strata, kerikil, rel termal, kabut jurang, tokoh kartu + ekspresi, kamera dorong → whip → orbit → crane) |

## Menjalankan di localhost
Prasyarat: Python 3.10+, FFmpeg di PATH. (Opsional: GPU, Blender 4.2+.)

```bash
cd riset/analisis-video-rel-kereta/alat
python -m venv .venv && source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
mkdir -p input && cp /path/ke/video.mp4 input/video.mp4

./jalankan_semua.sh input/video.mp4 hasil                 # inti: frame, lembar kontak, adegan, kamera/warna/kabut, palet, audio
pip install -r requirements-ai.txt                        # opsional (unduh model dari HuggingFace/GitHub)
./jalankan_semua.sh input/video.mp4 hasil --ai            # + kedalaman Depth Anything V2, skor estetika pyiqa, transkrip per kata
```
Windows tanpa bash: jalankan perintah di `jalankan_semua.sh` satu per satu (semuanya `python …` biasa, kecuali `01`/`03` yang memanggil `ffmpeg`/`scenedetect`).

Hasil di `alat/hasil/` (diabaikan git):
- `lembar/s_XX.jpg`: lembar kontak 2 dtk. Kirim ke Claude untuk analisis visual seperti di `01-analisis-frame.md`
- `ringkasan.md`: % kamera diam / pan / tilt / dolly / roll / whip, kandidat dissolve, saturasi, kabut, saliency, tabel segmen gerak kamera
- `detail/peristiwa.csv` + `detail/p_*.jpg`: **pass 2**, momen singkat yang bergerak sendiri (bukan karena kamera), dengan lembar 30 fps per momen
- `ukur.csv`: data mentah per frame (30 fps)
- `palet/palet.md` + `color_script.png`: HEX per 2 dtk untuk material Blender
- `audio/`: RMS, onset, `kata.csv` (cap waktu per kata, dengan `--ai`)
- `kedalaman/`: peta kedalaman + `kedalaman.csv` (dengan `--ai`)

### Blender
```bash
blender -b -P ../blender/gaya_dasar.py -- --render hasil_blender/
```
Atau buka Blender + BlenderMCP, lalu minta Claude menjalankan isi `gaya_dasar.py` lewat `execute_blender_code`.
Setelah render, jalankan `./jalankan_semua.sh` pada render Anda dan bandingkan `ringkasan.md` render vs referensi.

## Status (jujur)
- ✅ Sudah dikerjakan di sesi cloud: 326 frame diperiksa visual, PySceneDetect (1 potongan keras di 44,03 dtk; 34 perubahan konten), pencarian skill/plugin/connector.
- ✅ `10_detail_pass2.py` diuji pada 8 dtk pertama: menemukan topi terangkat (3,23), tokoh jatuh (3,57), dan ayunan crane + palu terlepas (7,13). Detail ini terlewat di pass 1.
- ✅ Skrip inti (01, 02, 03, 04, 06, 08, 09) diuji pada potongan 3 dtk dan berjalan. Ambang gerak kamera di `09_ringkas.py` dikalibrasi pada 3 dtk itu saja: hasilnya cocok dengan pengamatan (dorong maju → whip pan 1,8 dtk → orbit). Untuk akurasi lebih, cek beberapa segmen lain dengan lembar kontak lalu setel ambangnya.
- ⏳ Belum dijalankan: pengukuran penuh 65 dtk (dihentikan), `05_kedalaman.py`, `07_kualitas.py`, transkrip whisper (model diblokir di cloud), dan `blender/gaya_dasar.py` (belum diuji di Blender; versi-spesifik dibungkus try/except).
- Video referensi tidak disimpan di repo (hak cipta).
