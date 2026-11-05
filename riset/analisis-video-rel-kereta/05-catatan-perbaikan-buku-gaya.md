# Catatan perbaikan BUKU GAYA visual (audit 2026-11-05)

Yang diaudit: repo `heinderjennj-ux/youtube`, branch `claude/sharp-clarke-irc3u0`, folder `docs/belajar-visual/`
(`BUKU_GAYA.md`, `agen_bingkai.py`, `agen_gerak.py`, `agen_kamera_transisi.py`, `agen_lapisan.py`, `agen_transisi.py`, `hasil/`).
Pembanding: analisis frame demi frame video railroad di repo `little-wins` (`riset/analisis-video-rel-kereta/01-analisis-frame.md`).

**Untuk AI yang menjalankan analisis berikutnya:** baca seluruh catatan ini dulu. Tugasnya bukan mengulang angka yang sudah ada,
tapi **mengisi lapisan yang belum ada**: apa yang terjadi di dalam bingkai (peristiwa, benda, emosi, aksi), bukan hanya bagaimana bingkai terlihat.
Kerjakan untuk ke-5 video acuan (jar, burglar, railroad, button, draw). Hasil ditulis ke `hasil/<kode>/` dan diringkas sebagai bab baru di `BUKU_GAYA.md`.

---

## 0. Ringkasan masalah utama

| # | Kekurangan | Akibatnya pada video buatan AI |
|---|---|---|
| 1 | Buku gaya hanya berisi **statistik bingkai** (ukuran kepala, % kamera diam, saturasi, % buram). Tidak ada **katalog peristiwa** | AI tahu "kamera harus bergerak", tapi tidak tahu **apa yang harus terjadi**: tidak ada topi terbang, benda jatuh, tokoh terjengkang |
| 2 | Sampling 0,2 dtk dan agen gerak hanya melihat kotak kepala/badan tokoh utama | Peristiwa < 0,2 dtk dan gerak **benda** di luar tokoh tidak tercatat |
| 3 | Emosi hanya diukur sebagai "ganti ekspresi per 10 dtk", dan diakui kasar (0,2–6,8) | Tidak ada **alur emosi per tokoh**, sehingga tokoh buatan AI datar atau berganti emosi tanpa sebab |
| 4 | Tidak disinkronkan dengan narasi ("menunggu VO") | Aturan terkuat acuan (**1 kalimat = 1 bukti fisik terlihat**) tidak terukur |
| 5 | Transisi dihentikan, aturan hanya potong/pudar/zoom | Teknik yang paling dikagumi owner (pindah tempat **lewat gerak kamera**) tidak dipelajari |
| 6 | Gerak tokoh tidak dibedah sebagai animasi (antisipasi, overshoot, tahan pose, pop) | Gerak tokoh kaku atau "membeku" (sudah terjadi di Video 04 v01) |
| 7 | Tidak ada **angka kepadatan detail** (properti per tempat, benda bergerak per 10 dtk, tulisan di dunia) | Tidak ada patokan lulus/gagal untuk "cukup detail atau belum" |
| 8 | Bagian "Agen 10" hanya 6 poin umum | Pengetahuan "kenapa terasa wow" tidak cukup spesifik untuk ditiru |

**Contoh nyata yang lolos dari metode sekarang (railroad):**
- 3,20 dtk: angin kereta yang lewat **mengangkat topi** insinyur; 3,57 dtk tokoh **jatuh terjengkang** keluar bawah frame.
- 6,9–7,2 dtk: **beban balok di crane berayun** di kabelnya.
- 7,40–7,7 dtk: pekerja di ujung papan menunduk, **palu terlepas dari tangan**, berputar, jatuh ke jurang berkabut.
- 24,0 dtk: **kelereng menggelinding** di rel mulus (bukti "perfectly smooth").
- 29,6 dtk: guncangan gerbong, **kopi tumpah ke kumis** bos, lalu tetes keringat.
- 34,0 dtk: **koran terbang** jatuh ke lantai; 35 dtk **tumbleweed** lewat (lelucon "sepi").
- 38–43 dtk: **jangka sorong** mengukur celah, **koin** lalu **selembar kertas** diselipkan, **lembar kalender terbang** Mei → Juni → Juli.
- 52,6 dtk: **paku rel melompat** keluar dari bantalan.
- 54,0 dtk: **topi tinggi taipan terbang**; 64,8 dtk **topi bowler bos terbang** oleh ledakan.

Semua ini tidak muncul di `BUKU_GAYA.md` maupun di `hasil/railroad/*.json`.

---

## 1. Lapisan baru: KATALOG PERISTIWA (paling penting)

### Yang harus dibuat
Agen baru `agen_peristiwa.py`:
1. Baca video di **fps asli** (bukan 0,2 dtk).
2. Hilangkan gerak kamera (affine LK/ORB + RANSAC, sudah ada di `agen_gerak.py`), lalu hitung sisa beda **di seluruh bingkai**, bukan hanya di kotak tokoh.
3. Puncak sisa beda (relatif terhadap median bergulir 1 dtk) = kandidat peristiwa. Jarak minimal antar peristiwa 0,3 dtk.
4. Untuk tiap kandidat, buat **lembar 30 fps** (±0,5 dtk) dan **lingkari area gerak**.
5. Claude (atau manusia) **melihat lembar itu** dan mengisi label. Tidak boleh hanya mengandalkan angka.

Contoh yang sudah berjalan: `riset/analisis-video-rel-kereta/alat/10_detail_pass2.py` di repo little-wins (di 8 dtk pertama railroad menemukan topi terangkat, tokoh jatuh, crane berayun, dan palu terlepas).

### Format hasil: `hasil/<kode>/peristiwa.csv`
| kolom | isi |
|---|---|
| `mulai`, `selesai` | detik (presisi 1 frame) |
| `pelaku` | tokoh / benda / lingkungan / kamera |
| `objek` | nama benda (topi, palu, kelereng, koran…) |
| `kategori` | lihat tabel kategori di bawah |
| `pemicu` | apa yang menyebabkan (angin kereta, guncangan, panas, ledakan, tangan tokoh, kata narasi) |
| `lintasan` | naik / jatuh / berputar / menggelinding / berayun / melompat / meletup |
| `durasi_frame` | berapa frame gerakan berlangsung |
| `kata_narasi` | kata yang sedang diucapkan saat itu |
| `ada_sfx` | ya/tidak, dan apakah tepat di frame peristiwa |
| `fungsi` | bukti narasi / lelucon / reaksi / suasana / transisi |
| `catatan` | detail yang bisa ditiru (mis. "topi miring dulu 2 frame sebelum lepas") |

### Kategori peristiwa (wajib dipakai, boleh ditambah)
| Kategori | Contoh di acuan |
|---|---|
| Reaksi fisik tokoh terhadap gaya luar | jatuh karena angin kereta, terdorong ledakan, guncangan gerbong |
| Aksesori lepas / terbang | topi masinis, top hat, bowler |
| Benda jatuh / menggelinding / berayun | palu ke jurang, kelereng, beban crane, paku melompat |
| Benda kertas / ringan | koran terbang, lembar kalender, kertas di celah |
| Cairan | kopi tumpah ke kumis |
| Partikel | percikan gergaji, percikan paku emas, uap panas rel, debu |
| Alat ukur / bukti | jangka sorong, termometer, koin, kertas, kalender, tulisan kapur "39FT" |
| Perubahan material | rel berganti warna sesuai suhu, rel melengkung jadi S |
| Lingkungan hidup | burung, tumbleweed, asap cerobong, bendera, kabut |
| Aksi tokoh latar | pekerja minum dari mug, melirik skeptis, antre, membaca koran |
| Simbol emosi | tetes keringat, uap kepala, wajah terisi ungu, noda kopi |
| Payoff besar | rel melengkung, kereta jatuh, ledakan, awan jamur |

### Angka yang harus masuk ke buku gaya
- Peristiwa per 10 dtk (total dan per kategori).
- Jarak terpanjang tanpa peristiwa sama sekali (detik).
- Porsi peristiwa yang **dipicu oleh** sesuatu yang terlihat (sebab-akibat jelas) vs muncul begitu saja.
- Porsi peristiwa yang punya SFX tepat di frame.
- Durasi tipikal per lintasan (jatuh, terbang, menggelinding) dalam frame → langsung jadi patokan keyframe.

---

## 2. Lapisan baru: ALUR EMOSI per tokoh

### Masalah sekarang
`agen_gerak.py` menghitung "ganti ekspresi" dari lonjakan beda piksel di kotak wajah. Ini menangkap kedipan, blur kamera, dan perubahan cahaya juga, sehingga angkanya tidak bisa dipakai. Emosi juga tidak dicatat **per tokoh** dan **alasannya**.

### Yang harus dibuat: `hasil/<kode>/emosi.csv`
Satu baris per pergantian ekspresi, per tokoh, dilihat pada lembar 30 fps di sekitar wajah (crop wajah, bukan bingkai penuh).

| kolom | isi |
|---|---|
| `tokoh` | nama/peran (insinyur, bos, taipan, petugas, figuran-1…) |
| `mulai`, `selesai` | detik |
| `emosi` | kamus tetap: netral, smug, bahagia, kaget, meringis, marah, curiga, cemas, puas jahil, bingung, takut, sedih, lega |
| `intensitas` | 1–3 |
| `mata` | bentuk (titik, O O, ^ ^, > <, setengah kelopak, sipit) + arah lirik |
| `alis` | datar / naik / turun ke tengah / miring cemas / asimetris |
| `mulut` | garis, senyum miring, gigi grid, "o", terbuka teriak, bergelombang |
| `simbol` | keringat, uap, warna wajah, garis kaget, tidak ada |
| `pemicu` | apa yang membuat emosinya berubah (kata narasi, kejadian, tokoh lain) |
| `transisi_frame` | berapa frame dari ekspresi lama ke baru (pop langsung = 0–1, bertahap = >3) |
| `tubuh` | apa yang dilakukan badan/tangan bersamaan (menunjuk, bertolak pinggang, membungkuk, melambai) |

### Angka yang harus masuk ke buku gaya
- Pergantian ekspresi per 10 dtk **per tokoh utama** (diukur dari tabel ini, bukan dari piksel).
- Durasi tahan ekspresi: median, minimum, maksimum.
- Porsi pergantian yang punya **pemicu terlihat** atau tepat di kata kunci narasi.
- Rata-rata selisih (frame) antara kata kunci narasi dan pergantian ekspresi.
- **Kurva emosi per tokoh** sepanjang video (grafik: waktu vs emosi/intensitas). Contoh railroad, bos: cemberut → kaget → curiga → marah → wajah ungu → teriak → ungu surut → kaget → … → senang di akhir → kaget saat ledakan.
- Pola **reaksi berpasangan**: saat tokoh A berubah emosi, berapa frame sampai tokoh B bereaksi.
- Kamus ekspresi visual per video (gambar crop wajah per emosi), disimpan di `hasil/<kode>/wajah/`.

---

## 3. Lapisan baru: GERAK TOKOH sebagai animasi

### Yang harus diukur (per aksi tokoh, dari lembar 30 fps)
| Ukuran | Kenapa |
|---|---|
| Antisipasi: ada ancang-ancang sebelum aksi? berapa frame? | Tanpa antisipasi gerak terasa robotik |
| Overshoot / settle: bablas lalu kembali? berapa frame? | Membuat gerak terasa berbobot |
| Tahan pose (hold): berapa frame pose ditahan sebelum aksi berikutnya | Ritme pose-to-pose |
| Frame identik berturut-turut (animasi "on twos" = berganti tiap 2 frame?) | Gaya "patah-patah" vs halus |
| Gerak susulan: topi/rambut/baju/tongkat ikut bergerak setelah badan berhenti? | Detail yang membuat tokoh hidup |
| Bagian tubuh yang bergerak bersamaan (kepala + tangan + badan) vs satu bagian saja | Video 04 v01: "hanya kamera yang bermain" |
| Pose khas per emosi (bertolak pinggang, menunjuk dengan tongkat, menggaruk kepala) | Bahan perpustakaan pose |
| Tokoh dari samping saat kamera orbit: digambar ulang per sudut atau kartu berputar? | Menentukan cara membangun tokoh |

Hasil: `hasil/<kode>/aksi_tokoh.csv` (tokoh, mulai, selesai, aksi, antisipasi_f, aksi_f, overshoot_f, hold_f, susulan, catatan).

---

## 4. Sinkron dengan NARASI

Sekarang tertulis "menunggu VO". Video acuan sudah punya suara, jadi bisa dikerjakan sekarang:
1. Transkrip per kata dengan Whisper (`scripts/audio/kata_lang.py` sudah ada).
2. Untuk **tiap kalimat**: catat bukti fisik yang terlihat (benda/aksi), kapan muncul relatif terhadap kata kuncinya, dan apakah ada pergantian emosi.
3. Hasil: `hasil/<kode>/narasi.csv` (kalimat, mulai, selesai, kata_kunci, bukti_visual, selisih_frame, emosi_berubah, peristiwa_terkait).

Angka untuk buku gaya:
- Porsi kalimat yang punya **bukti fisik terlihat** (target dari acuan).
- Rata-rata selisih bukti visual vs kata kunci (frame; negatif = visual mendahului suara).
- Kata per menit narasi dan jumlah ketukan visual per kalimat.

---

## 5. Kepadatan DETAIL dunia

Belum ada sama sekali. Untuk tiap tempat/shot:
| Ukuran | Cara |
|---|---|
| Jumlah properti khas yang bisa disebut namanya dalam 1 detik | Daftar manual dari lembar kontak, per tempat |
| Jumlah benda yang **bergerak sendiri** per 10 dtk | dari `peristiwa.csv` |
| Jumlah tulisan di dalam dunia (koran, spanduk, label, kapur, papan) dan fungsinya | Daftar manual + isi teksnya |
| Animasi lingkungan yang selalu jalan (asap, burung, bendera, kabut) | Daftar per tempat |
| Benda depan (foreground) yang lewat/membingkai | Sudah sebagian di `agen_lapisan.py` → tambahkan nama bendanya |
| "Kacamata ahli": benda yang pasti ada di tempat nyata itu | Bandingkan dengan aturan di `CLAUDE.md` |

Hasil: `hasil/<kode>/detail_tempat.md` (per tempat: daftar properti, tulisan, animasi lingkungan, foto crop).

---

## 6. TRANSISI lewat gerak kamera

Transisi dihentikan atas permintaan owner, tetapi owner (2026-11-05) menyatakan yang paling keren di railroad justru **pindah tempat lewat gerak kamera**. Ini perlu dipelajari terpisah dari aturan "potong/pudar/zoom":

| Jenis | Contoh railroad | Yang harus dicatat |
|---|---|---|
| Whip pan | 1,8 dtk | durasi frame, sudut, blur, di frame ke berapa lokasi berganti |
| Orbit | 2,4 dtk; 16,4 dtk | derajat, durasi, titik pusat |
| Crane naik melewati bibir tebing | 3,6 dtk | ketinggian, tilt |
| Tilt vertikal cepat | 8,4 dtk | — |
| Terbang FPV antar lokasi | 9,0–10,6 dtk | jalur, tinggi, lensa |
| Menukik ke tanah lalu muncul di tempat lain | 21,2 dtk | benda apa yang menutup layar saat ganti |
| Tembus jendela | 26,4 dtk; 29,2 dtk | — |
| Dissolve pendek (lompatan waktu) | 11,6; 13,4; 26,2; 28,4; 31,2; 36,0; 47,8; 54,4; 59,4 dtk | durasi frame |

Catatan: **PySceneDetect `detect-adaptive` hanya menemukan 1 potongan keras** di 65 dtk railroad (44,03 dtk). Artinya hampir semua perpindahan adalah gerak kamera atau dissolve.
Keputusan "transisi hanya potong/pudar/zoom" di `STYLE.md` sebaiknya ditinjau ulang oleh owner setelah data ini ada.

---

## 7. Perbaikan teknis pada agen yang sudah ada

| Agen | Masalah | Perbaikan |
|---|---|---|
| semua | Sampling 0,2 dtk | Tetap untuk gambaran besar, tapi **wajib** ditambah pass fps asli untuk peristiwa & emosi |
| `agen_bingkai.py` | Deteksi kepala hanya kepala putih bulat bergaris gelap → gagal di tampak samping, kepala bertopi lebar, wajah berwarna (ungu), tokoh kecil/jauh | Catat porsi frame "ada tokoh tapi kepala tak terdeteksi" (cek manual sampel); jangan simpulkan "tanpa tokoh 25–60%" sebelum dicek |
| `agen_gerak.py` | Hanya kotak kepala + badan tokoh utama; tokoh kedua dan benda diabaikan | Hitung di seluruh bingkai dan per komponen yang bergerak (lihat §1) |
| `agen_gerak.py` | "Ganti ekspresi" dari beda piksel wajah = kasar | Ganti dengan `emosi.csv` berbasis lihat (§2) |
| `agen_kamera_transisi.py` | Whip pan (blur tinggi, titik fitur sedikit) bisa terbaca sebagai potongan | Bedakan potongan vs whip: whip = flow besar searah + blur naik bertahap 2–4 frame |
| `agen_lapisan.py` | Lapisan diukur, tapi isi lapisannya tidak dinamai | Tambahkan nama benda depan/tengah/belakang pada sampel frame |
| `BUKU_GAYA.md` §8 | 6 poin umum | Ganti dengan contoh spesifik bertimestamp dari `peristiwa.csv` per video |

---

## 8. Protokol kerja untuk AI (urutan wajib)

1. **Pass 1 (sudah ada):** lembar 0,2 dtk + agen statistik. Jangan diulang kecuali ada perbaikan §7.
2. **Pass 2, peristiwa:** `agen_peristiwa.py` di fps asli → lembar 30 fps per kandidat → **lihat setiap lembar** → isi `peristiwa.csv`.
3. **Pass 3, emosi & aksi:** crop wajah dan badan tiap tokoh, lembar 30 fps di sekitar setiap pergantian → isi `emosi.csv` dan `aksi_tokoh.csv`.
4. **Pass 4, narasi:** Whisper per kata → `narasi.csv`.
5. **Pass 5, detail tempat:** `detail_tempat.md` per tempat.
6. **Pass 6, transisi kamera:** tabel §6 per video.
7. **Cek silang:** bandingkan hasil railroad dengan daftar contoh di §0. **Kalau ada contoh dari §0 yang tidak tertangkap, metode belum cukup teliti.** Turunkan ambang, ulangi.
8. Tulis bab baru di `BUKU_GAYA.md`:
   - §9 Kepadatan peristiwa & detail (angka + 10 contoh terbaik per video, bertimestamp)
   - §10 Alur emosi per tokoh (angka + kurva + kamus ekspresi)
   - §11 Gerak tokoh sebagai animasi (antisipasi, hold, overshoot, susulan)
   - §12 Sinkron narasi (bukti fisik per kalimat)
   - §13 Transisi lewat kamera
   - §14 "Akibat untuk video berikutnya": aturan yang bisa dicek lulus/gagal
9. **Jangan menebak.** Setiap baris di CSV harus berasal dari frame yang dilihat. Kalau ragu, tulis `ragu` di kolom catatan.

---

## 9. Aturan produksi yang diharapkan keluar dari analisis ini (contoh bentuk, angka diisi setelah diukur)

- Minimal **X peristiwa benda/fisik per 10 dtk**; tidak boleh lebih dari **Y dtk** tanpa peristiwa.
- Setiap kalimat narasi punya **≥1 bukti fisik** yang terlihat, muncul dalam **±Z frame** dari kata kuncinya.
- Setiap tokoh utama berganti ekspresi **A–B kali per 10 dtk**, selalu dengan pemicu yang terlihat atau terdengar.
- Setiap aksi tokoh punya antisipasi **≥N frame** dan gerak susulan pada aksesori.
- Setiap tempat punya **≥M properti khas** dan **≥1 animasi lingkungan** yang terus berjalan.
- Setiap kejadian besar diikuti **reaksi fisik** tokoh/benda di sekitarnya (angin → topi, ledakan → topi terbang, guncangan → cairan tumpah).

Pemeriksa render (lulus/gagal) membandingkan video buatan AI dengan angka-angka ini.
