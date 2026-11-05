# Checklist anti-terlewat + langkah analisis lanjutan

Pelajaran dari pass 1: sampling tiap 0,2 dtk (5 fps) **melewatkan peristiwa yang lebih singkat dari 0,2 dtk**.
Contoh: tokoh jatuh terjengkang & topi terbang tertiup angin kereta (3,2–3,7 dtk), lalu palu terlepas dari tangan pekerja (7,4 dtk).
Jadi analisis dianggap selesai hanya jika **ketiga pass** di bawah sudah dijalankan.

## Metode 3 pass
| Pass | Cara | Menangkap |
|---|---|---|
| 1. Gambaran besar | Lembar kontak tiap 0,2 dtk (`02_lembar_kontak.py`) | Alur cerita, lokasi, ekspresi utama, gerak kamera kasar |
| 2. Peristiwa singkat | `10_detail_pass2.py`: gerak kamera dikompensasi, lalu dicari benda yang bergerak **sendiri**. Tiap puncak dibuatkan lembar **30 fps (semua frame)** | Jatuh, topi terbang, benda terlepas/jatuh, percikan, partikel, kedipan, ekspresi kilat |
| 3. Per objek | Untuk tiap shot, jawab checklist di bawah sambil memutar video **0,25× kecepatan** (VLC / mpv: tombol `[`) atau frame-by-frame (mpv: tombol `.` dan `,`) | Aksi sekunder, latar belakang, detail tekstur, sinkron suara |

Uji di sesi ini: pada 8 detik pertama, pass 2 menemukan 4 peristiwa, dan **dua di antaranya terlewat di pass 1** (3,23 dtk topi terangkat; 3,57 dtk tokoh jatuh; plus ayunan beban crane dan palu terlepas di 7,13 dtk).

## Checklist per shot (pass 3)
**Tokoh utama**
- [ ] Reaksi tubuh terhadap gaya luar: angin, guncangan, benturan, ledakan (jatuh? terdorong? topi/rambut/baju bergerak?)
- [ ] Aksesori: topi, tongkat, kacamata, koran, cangkir. Apakah lepas, terbang, tumpah, berayun?
- [ ] Mata, alis, mulut: catat **setiap** pergantian beserta waktunya (bukan hanya ekspresi utama)
- [ ] Simbol kartun: keringat, uap, warna wajah, garis kaget, bintang
- [ ] Tangan: menunjuk, memegang, melambai, menggaruk kepala
- [ ] Posisi kaki/berat badan: jongkok, membungkuk, berjinjit, bersandar

**Tokoh latar**
- [ ] Apa yang dilakukan figuran (minum, makan, melirik, berjalan)?
- [ ] Apakah mereka bereaksi terhadap tokoh utama?

**Benda & fisika**
- [ ] Benda yang jatuh, menggelinding, terbang, berayun (palu, kelereng, koran, tumbleweed, beban crane, paku)
- [ ] Partikel: percikan, debu, uap, serpihan, asap (warna & arah)
- [ ] Alat ukur/bukti visual: jangka sorong, koin, kertas, termometer, kalender

**Dunia**
- [ ] Animasi lingkungan: burung, bendera, awan, asap cerobong, kabut bergerak
- [ ] Teks di dunia: spanduk, papan, koran, nama gerbong, kapur di bantalan
- [ ] Cahaya: lens flare, god rays, kilau bergerak di logam, lampu menyala
- [ ] Bayangan tokoh di tanah/dinding

**Kamera & transisi**
- [ ] Jenis gerak (dorong, whip, orbit, crane, terbang, tembus jendela) dan arahnya
- [ ] Bagaimana pindah ke shot berikutnya (gerak kamera? dissolve? benda menutupi layar?)
- [ ] Lensa (lebar/sempit) dan tinggi kamera (setinggi tanah? setinggi mata? udara?)

**Suara** (dengan `08_audio.py --whisper`)
- [ ] SFX di tiap peristiwa (deru kereta, gergaji, palu, koin, ledakan): apakah tepat di frame peristiwa?
- [ ] Kata kunci narasi vs pergantian ekspresi: berapa frame jaraknya?

## Langkah di localhost (urutan kerja)
1. **Siapkan** (sekali saja):
   ```bash
   git pull
   cd riset/analisis-video-rel-kereta/alat
   python -m venv .venv && source .venv/bin/activate
   pip install -r requirements.txt -r requirements-ai.txt
   mkdir -p input && cp /path/video.mp4 input/video.mp4
   ```
   FFmpeg harus terpasang (`ffmpeg -version`). Mac: `brew install ffmpeg`. Windows: `winget install ffmpeg`.
2. **Jalankan semua pengukuran:** `./jalankan_semua.sh input/video.mp4 hasil --ai` (sudah termasuk pass 2).
3. **Buka Claude Code di folder repo** (di localhost), lalu minta:
   - "Baca `hasil/ringkasan.md`, `hasil/detail/peristiwa.csv`, dan lihat semua `hasil/detail/p_*.jpg`. Bandingkan dengan `01-analisis-frame.md`, lalu tambahkan semua detail yang belum tercatat."
   - "Isi checklist `04-checklist-detail.md` per shot dengan melihat `hasil/lembar/`."
   - "Perbarui `03-panduan-blender.md` dengan angka nyata: % kamera diam, durasi whip pan, palet HEX, kekuatan kabut, kata/menit."
4. **Blender:** pasang BlenderMCP (`claude mcp add blender uvx blender-mcp` + add-on di Blender), lalu minta Claude menjalankan `blender/gaya_dasar.py` dan memperbaiki error.
5. **Ulangi untuk render Anda:** `./jalankan_semua.sh render_saya.mp4 hasil_render`, lalu bandingkan dengan referensi. Yang angkanya paling jauh, itu yang diperbaiki duluan.
6. **(Opsional) Kamera nyata:** di Blender, buka video referensi di Movie Clip Editor → Track → Solve Camera. Dapatkan jalur kamera & focal length asli untuk 1–2 shot penting (whip pan 1,8 dtk; terbang ke stasiun 9–10,6 dtk).

## Pertanyaan yang belum terjawab (target analisis berikutnya)
- Berapa frame tepatnya durasi whip pan, dissolve, dan "pop" ekspresi? (pass 2 + `ukur.csv`)
- Apakah tokoh 2D benar-benar billboard, atau digambar ulang per sudut (lihat orbit 2,4 dtk & 16,4 dtk pada 30 fps)?
- Apakah animasi tubuh tokoh berjalan "on twos" (berganti tiap 2 frame, 12 fps) sementara kamera 30 fps? Cek di lembar 30 fps: berapa frame berurutan yang tokohnya identik.
- Seberapa sering SFX muncul per detik, dan apakah selalu jatuh di frame peristiwa?
- Berapa tinggi kamera rata-rata (setinggi tanah vs setinggi mata) per jenis adegan?
- Palet per adegan (color script) dan perubahannya dari siang ke senja.
