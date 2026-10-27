---
name: membuat-video-iklan-2d
description: Membuat video iklan/konten animasi 2D vertikal (1080x1920) — iklan IG/TikTok/FB maupun YouTube Shorts — untuk produk apa pun milik owner (produk diet, Koder Cilik, Robo Coder/Little Wins, dll.), dari copywriting → naskah → suara ElevenLabs → karakter AI → animasi Remotion → render. Gunakan skill ini setiap kali owner minta bikin video iklan, naskah VO, meniru copywriting yang convert, ganti angle, storyboard, karakter pose, revisi video, render, atau versi TikTok/IG — walaupun owner tidak menyebut "skill" atau "2D". Berisi aturan umum owner, cara membedah copywriting acuan (avatar, mass desire, UMP, UMS, surface design, angle), langkah kerja, dan bank riset.
---

# Membuat Video Iklan Animasi 2D

Cara kerja ini terbukti di video Koder Cilik (Variasi 7 & 8), Robo Coder US (Little Wins, 100 dtk), dan Diet Tanpa Tersiksa; berlaku juga untuk YouTube Shorts. Owner bukan ahli video; dia ingin hasil profesional dan tidak mau menjelaskan ulang aturan yang sama.

Bahasa dengan owner: Indonesia, kalimat sederhana. Jawaban/usulan ditulis di chat, bukan file MD (file hanya untuk naskah, riset, dan produk).

## Langkah 0: tentukan produknya
Aturan khusus produk (sapaan, CTA, kata yang dilarang, tokoh, palet, folder) ada di profil produk. Baca profil yang cocok sebelum menulis apa pun:

| Produk | Profil |
|---|---|
| Koder Cilik (worksheet coding anak) | references/produk-koder-cilik.md |
| Diet Tanpa Tersiksa (Bugar) | references/produk-diet.md |
| Robo Coder (luar negeri, akun Little Wins) | references/produk-robo-coder.md |
| Produk baru | buat `references/produk-<nama>.md` dari templat di references/produk-templat.md |

Jangan membawa aturan satu produk ke produk lain (mis. "HAPE/HP" dan "LIHAT DETAIL empat level" hanya untuk Koder Cilik).

## Aturan umum owner (semua produk)

Naskah
- Kalimat harus nyambung (lalu, karena, jadi, tapi, akibatnya). Kenalkan tokoh/benda sebelum dipakai. Bahasa sederhana untuk penonton awam (IQ ±90).
- Tulis kata yang sulit dibaca TTS sesuai ucapannya; angka ditulis sebagai kata di naskah suara.
- Jangan sebut "Amerika" untuk pasar Indonesia; sebut otoritas lewat keahlian & tempat terbit.
- Klaim jujur: testimoni tidak dikarang, cerita tokoh = dramatisasi, batasan riset ditulis. Untuk produk kesehatan/diet: jangan janji angka hasil yang tidak bisa dibuktikan.
- Kalau owner memberi copywriting yang convert, tiru strukturnya (lihat "Meniru copywriting acuan").
- Struktur andalan untuk iklan/Shorts: "Kamu <peran>, dan kamu punya masalah… Begini cara memperbaikinya" → penyebab singkat → langkah demi langkah → reveal produk di akhir (references/naskah-masalah-solusi.md). Jangan buka dengan data tanpa taruhan; jangan kalimat yang memberi izin pergi.
- Sapaan orang tua: "kamu/anakmu/orang tua", JANGAN "Ibu/Bunda". Akun merek tanpa narator "saya".

Suara
- Tanpa tag bisik/pelan (`[whispers]`, `[quiet]`, `[softly]`, `[soft]`, `[hushed]`); pakai emosi bersuara penuh.
- **Volume antar kalimat harus rata** walau nadanya berganti: setiap VO lewat `scripts/ratakan_vo.py` (rentang antar kalimat ≤ ~5 dB).
- **Hasil akhir = −14 LUFS, true peak −1 dBFS, LRA ±2–3 LU** (diukur dari video viral acuan: −14,1 LUFS / LRA 2,4 / −1,0 dBFS). Ukur dengan `ffmpeg -i x.mp4 -af ebur128=peak=true -f null -`. Preview Studio memang lebih pelan sebelum normalisasi akhir.
- SFX banyak dan tepat makna (aturan rinci di references/efek-kamera.md bagian "Aturan owner"); musik pelan (±0,13) memudar di akhir.

Visual
- 2D storybook, palet terang. Hanya 1–2 titik fokus yang hangat/terang/bergaris tegas; sekitarnya diwarnai ulang dalam satu keluarga warna dingin + sedikit buram (bukan lapisan abu-abu/tempelan transparan).
- Tanpa bintik/grain. Judul tebal putih + garis tepi gelap (tanpa kotak warna). Tanpa glow pada angka.
- Warna tokoh/benda kontras dengan latar (tulis hex di prompt).
- Karakter = gambar AI. Produk = aset asli, digambar ulang rapi kalau aslinya buram.
- Gerak tidak alay: satu aksi per momen, muncul 0,9→1 dalam ±7 frame, tanpa pantulan besar/sinar berputar/ledakan teks. Semua tokoh hidup (napas, goyang kecil, kedip).
- **Tunjukkan apa yang diucapkan** (tiap frasa VO punya visual yang persis sama) dan **tidak ada adegan statis** — selalu ada yang bergerak/menyala.
- **Panggung berlapis ala video Bugar**: latar buram → cahaya hangat di belakang fokus → tokoh bergaris tepi per benda (bukan satu garis untuk semua) → bayangan kontak tipis di bawah tokoh/benda → benda depan tajam → lapisan depan buram (daun/toples) → vinyet.
- **Transisi default fade**; zoom tembus + whoosh hanya 2–3 momen cepat. **Momen intens** = punch-in + warna bergeser ke palet malam dengan sorotan (tanpa kedip gelap/kilat). Momen hangat untuk orang tua = tenang.
- Benda produk/teka-teki = tata letak asli produk digambar ulang dengan kode, aturan produk dipatuhi (mis. soal Koder Cilik/Robo Coder hanya 4 kotak panah — panah tidak boleh lebih dari isi soal; robot berhenti setelah menabrak). Mockup produk harus sesuai angka di VO (mis. Complete Pack 80 soal, bukan Starter 50).

Proses
- Riset = alat bantu, bukan kewajiban: cari riset terbit saat buntu atau untuk memperakurat. Hook riset hanya salah satu angle. Kalau dipakai: sumber jelas, sebut yang lemah, simpan ke file riset.
- Tunjukkan dulu: naskah → setuju → suara; gambar AI → galeri → setuju → animasi; prototipe still per adegan → setuju → animasi penuh.
- Render HANYA kalau owner minta. Revisi kecil = render frame yang berubah saja lalu sambung (references/remotion-teknik.md).
- Hemat kredit: jangan ulang generate untuk "coba lagi"; cek kredit sebelum generate besar.
- Cepat > hemat untuk pekerjaan rutin: hapus latar lembar pose pakai ElevenLabs `birefnet-v2-bg-removal` (±30 kredit/lembar, detik-an) lalu `scripts/potong_bersih.py`; rembg lokal sering kehabisan RAM. Laptop RAM tipis → transkrip whisper pakai model `small`/`base`.
- Versi bahasa lain = duplikat folder proyek + peta indeks kata lama→baru (lihat src/v8 dari src/lw2), ganti teks layar, tokoh, warna produk, CTA.

## Meniru copywriting acuan (yang sudah convert)

Owner bisa memberi satu atau dua copy acuan, misalnya: "tiru semuanya dari copy A, kecuali angle; angle ambil dari copy B". Bedah dulu tiap acuan menjadi lapisan berikut, tunjukkan hasil bedahnya di chat, lalu tulis naskah setelah owner setuju:

| Lapisan | Arti | Yang dicatat dari acuan |
|---|---|---|
| Avatar | siapa pembacanya | usia, peran, situasi hidup, rasa sakit, bahasa yang dia pakai, keberatan |
| Mass desire | keinginan besar yang sudah ada di pasar (Schwartz) | keinginan yang dituju dan cara menyebutnya |
| UMP (unique mechanism of the problem) | alasan "baru" kenapa masalahnya terjadi, bukan salah pembaca | nama/penjelasan mekanisme masalahnya |
| UMS (unique mechanism of the solution) | cara kerja produk yang menjawab UMP | nama/penjelasan mekanisme solusinya + bukti |
| Surface design | bentuk luar copy | urutan bagian, panjang paragraf, ritme kalimat, sudut pandang (aku/kamu), gaya bicara, posisi bukti & CTA, transisi |
| Angle | pintu masuk cerita | mis. "mengintip / tidak sengaja dengar", riset, kuis, pengakuan |

Aturan meniru:
- Yang ditiru = struktur, urutan, ritme, dan fungsi tiap bagian; kalimat ditulis baru untuk produk ini (jangan menyalin kalimat acuan kata demi kata).
- Simpan bedah acuan ke `references/copy-acuan.md` (dengan tanggal dan nama acuan), supaya percakapan lain bisa memakainya lagi.
- Cek akhir: buat tabel per bagian (acuan → naskah baru) supaya owner bisa melihat bahwa strukturnya sama dan hanya angle yang berganti.

## Alur kerja

Salin daftar ini ke chat dan centang sambil jalan:

```
- [ ] 0. Tentukan produk → baca profil produk
- [ ] 1. Brief: angle, avatar, durasi, platform; copy acuan (kalau ada) → bedah → owner setuju
- [ ] 2. Riset (opsional) bersumber
- [ ] 3. Naskah + teks layar + catatan klaim → owner setuju
- [ ] 4. Suara ElevenLabs → transkrip kata (kata.py → sejajar.py)
- [ ] 5. Prototipe: 1 still per adegan (P01…Pnn) + animatic → owner revisi per nomor P
- [ ] 6. Karakter AI: lembar pose → potong (REMBG=1) → deteksi mata → galeri → owner setuju
- [ ] 7. Animasi penuh di Remotion + SFX + musik
- [ ] 8. Cek sendiri (still, waktu teks, sambungan) → pratinjau MP4 setengah resolusi
- [ ] 9. Render final hanya atas permintaan → simpan ke folder kumpulan produk
```

Detail per langkah:
- **Naskah:** struktur default 3 babak di references/riset-naskah-copywriting.md, kecuali owner memberi copy acuan (struktur acuan menang). Label babak tidak ikut ditempel ke ElevenLabs.
- **Suara:** references/suara-sfx.md, lalu
  `py scripts/kata.py vo.wav kata-mentah.json small` → `py scripts/sejajar.py naskah-polos.txt kata-mentah.json src/<proyek>/kata.json`. Semua waktu animasi diambil dari kata.json.
- **Karakter AI:** references/karakter-ai.md.
- **Animasi:** mulai dari acuan terbaru `D:/PythonProjects/video-3d/src/lw2/` (EN) atau `src/v8/` (ID) — panggung berlapis, transisi, GantiSorot, SFX, kartu soal robo.tsx (salin ke folder baru, ganti kata.json, adegan, pose, palet). Acuan lama: `src/v7/`. Layout: references/layout-tipografi.md. Warna & gerak: references/riset-warna-gaya.md.
- **Cek:** render 4–6 still dan lihat sendiri (teks terbaca, fokus jelas, karakter tanpa lubang, subtitle tidak tertutup); judul tampil ≥1 dtk setelah kata terakhirnya; SFX tepat di aksinya. Laptop owner patah-patah di Studio → beri MP4 setengah resolusi di `out/index.html` (port 8766).

## Bank riset (baca sesuai kebutuhan)

| Kebutuhan | File |
|---|---|
| Struktur naskah, hook, CTA, copywriting | references/riset-naskah-copywriting.md |
| Bedah copy acuan owner yang convert | references/copy-acuan.md (dibuat saat acuan pertama diberikan) |
| Warna, kontras, fokus, harmoni, color script, gerak | references/riset-warna-gaya.md |
| Prompt karakter AI, model & biaya, potong latar, kedip | references/karakter-ai.md |
| Remotion: struktur, komponen, render, tambal sebagian | references/remotion-teknik.md |
| ElevenLabs, tag suara, musik, SFX, volume rata | references/suara-sfx.md |
| Struktur "kamu punya masalah" + pelajaran retensi | references/naskah-masalah-solusi.md |
| Transisi, efek, aturan SFX & momen intens | references/efek-kamera.md |
| Ukuran judul/isi/subtitle, font, zona aman | references/layout-tipografi.md |

Aturan atau riset baru dari owner → tambahkan ke file yang sesuai (dengan sumber + tanggal). Aturan khusus satu produk → ke profil produknya.

## Skrip bawaan (`scripts/`)

| Skrip | Fungsi |
|---|---|
| `kata.py audio out.json [model]` | faster-whisper lokal (gratis) → waktu tiap kata |
| `sejajar.py naskah.txt mentah.json kata.json` | pindahkan waktu whisper ke ejaan naskah asli (untuk subtitle) |
| `potong_pose.py lembar.png n1,n2,n3,n4 [skala] [potong-paksa]` | potong lembar pose → PNG transparan; `REMBG=1` pakai BiRefNet; folder hasil `POSE_DIR` |
| `deteksi_mata.py` | cari mata tiap pose → mata.json untuk kedip; env `POSE_DIR`, `MATA_JSON`, `CEK_JPG` |
| `ratakan_vo.py vo-asli.mp3 kata.json vo.wav [LUFS]` | ratakan volume VO per kalimat + kompresor + loudnorm (wajib untuk setiap VO) |
| `potong_bersih.py lembar-bersih.png n1,n2,n3,n4 folder ukuran.json` | potong lembar pose yang latarnya sudah transparan (hasil birefnet) |

`kata.py` memakai bahasa dari env `BAHASA` (default `id`; `BAHASA=en` untuk VO Inggris).

Jalankan dengan `py` (Windows). Butuh: ffmpeg, faster-whisper, Pillow, numpy, scipy, rembg.
