# Dari analisis ke Blender: resep yang bisa ditulis Claude dalam kode (bpy)

Asumsi alur: Claude menulis skrip Python `bpy` (lewat **BlenderMCP** saat Blender terbuka, atau dijalankan headless:
`blender -b -P skrip.py`). Caption & audio ditempel belakangan di **Remotion** (`video-3d/`) atau FFmpeg, jadi Blender cukup merender gambar.

Skrip awal yang menerapkan sebagian besar resep di bawah: `blender/gaya_dasar.py`.

---

## 1. Pengaturan render (meniru "rasa" referensi)
| Item | Nilai awal | Alasan dari analisis |
|---|---|---|
| Resolusi / fps | 1080×1920, 30 fps | Referensi 9:16, 30 fps |
| Engine | EEVEE (`BLENDER_EEVEE_NEXT` di 4.2–4.x, `BLENDER_EEVEE` di 5.x) | Cepat. Volumetrik, bayangan lembut, dan motion blur cukup |
| Color management | `Standard` atau `AgX` + look *Punchy* | Referensi sangat jenuh. AgX polos cenderung memudarkan warna terang. Uji keduanya |
| Motion blur | ON, shutter 0,5 | Whip pan & terbang FPV di referensi blur kuat |
| Volumetrik | Kabut dunia + kabut tebal di dasar ngarai | Kedalaman ngarai "hilang ke biru" |
| Ambient occlusion / bayangan | Bayangan matahari lembut (angle 2–5°) | Batu dan bantalan rel punya bayangan kontak |

## 2. Dunia
| Yang terlihat | Cara di Blender (kode) |
|---|---|
| Tebing bergaris strata merah-oranye-ungu | Material: `Wave Texture` (BANDS, arah Z) + `Noise Texture` sebagai distorsi → `ColorRamp` (merah tua, oranye, merah, ungu). Tambah `Displacement`/modifier Displace untuk tonjolan |
| Kabut biru pekat di dasar ngarai | Kubus besar dengan `Principled Volume`. Density = `Map Range(Z)`: tebal di bawah, tipis di atas. Warna biru jenuh (#1f3dbf ± ) |
| Mesa jauh pucat lavender | Kabut dunia (`World > Volume Scatter`, density kecil) dan/atau **Mist pass** + compositor mix ke lavender |
| Kerikil ballast low-poly | Geometry Nodes `Distribute Points on Faces` → `Instance on Points` (ico sphere subdiv 1, skala & rotasi acak, warna acak dari palet). Atau loop Python (lihat skrip) |
| Bantalan & rel | Kubus + modifier Array. Rel = profil I-beam sederhana, material logam |
| Asap kereta & ledakan | Stylized: volume prosedural (sphere + `Noise Texture` ke density, dianimasikan). Realistis: Mantaflow (Quick Smoke), bake dulu |
| Detail mikro (kelereng, koin, kertas, jangka sorong, kalender, termometer) | Model sederhana. **Wajib ada satu benda fisik per kalimat narasi** (lihat timeline). Kalender: tumpukan plane + animasi lembar terbang (rotasi + lokasi + ease) |
| Rel berubah warna karena panas | Custom property `suhu` (0–1) dikeyframe → driver ke `ColorRamp` (biru → ungu → magenta → pink → oranye → kuning → putih) + Emission strength naik. Ada di skrip |
| Rel melengkung jadi S | Modifier `Curve` atau `Simple Deform (Bend)`, dengan keyframe pada faktor deformasi |

## 3. Tokoh 2D di dunia 3D
Ciri referensi: tokoh datar dengan garis tebal, **berdiri di dunia dan menghasilkan bayangan**, terkadang terlihat dari samping.

| Kebutuhan | Cara |
|---|---|
| Tokoh sebagai kartu | Plane berdiri (image PNG transparan). Material: `Image Texture` → Base Color + Alpha (atau Emission supaya warna tetap datar tak terpengaruh cahaya) |
| Selalu menghadap kamera | Constraint `Locked Track` (lock Z, track −Y) ke kamera. Hanya berputar di sumbu Z agar tidak miring |
| Bayangan di tanah | Object tetap terlihat oleh bayangan (visible shadow ON). Alpha dari tekstur ikut membentuk bayangan |
| Tampak samping | Siapkan gambar tampak depan + samping, ganti sesuai sudut kamera |
| Ekspresi berganti tiap 0,2–0,6 dtk | **Lapisan terpisah:** badan, mata, alis, mulut sebagai plane berbeda (jarak 1–2 mm di depan kepala). Tiap varian = plane sendiri. Keyframe `hide_render`/`hide_viewport` dengan interpolasi **CONSTANT** (ada fungsi `pasang_ekspresi()` di skrip) |
| Wajah terisi ungu seperti cairan | Di material kepala: `Texture Coordinate (UV).Y` < `isi` → ungu. Tepi diberi `Noise` supaya bergelombang. Keyframe `isi` 0→1 (17,2 dtk) lalu 1→0 (20,0 dtk) |
| Tetes keringat, uap, noda kopi | Plane kecil terpisah, muncul/hilang dengan *pop* (skala 0 → 1,15 → 1 dalam 4–6 frame) |
| Topi terbang | Topi plane terpisah, keyframe lokasi naik + rotasi, ease-out |
| Alternatif | **Grease Pencil** (gambar langsung di 3D) cocok untuk garis tebal, tapi lebih sulit dihasilkan otomatis oleh kode |

> Sumber gambar tokoh: generator gambar AI (lihat `skills/membuat-video-iklan-2d/references/karakter-ai.md`), lalu dipotong
> per bagian (badan / mata / mulut) dengan skrip potong yang sudah ada di `skills/membuat-video-iklan-2d/scripts/`.

## 4. Kamera (bagian terpenting)
Referensi hampir tidak pernah diam, dan pindah tempat dengan **gerak kamera**. Daftar gerak yang terlihat dan resepnya:

| Gerak | Durasi di referensi | Resep bpy |
|---|---|---|
| Drift/dorong pelan saat dialog | sepanjang dialog | Keyframe lokasi maju 2–5% jarak per detik + F-curve modifier `NOISE` (strength kecil, scale ±40) untuk "napas kamera" |
| Whip pan | 4–8 frame | Rotasi Z 60–90° dalam 6 frame, interpolasi BEZIER ease in-out, motion blur ON. Ganti lokasi saat blur paling tinggi |
| Orbit mengelilingi tokoh | 0,6–1 dtk | Kamera di-parent ke Empty di posisi tokoh, putar Empty Z 60–120° |
| Crane naik melewati bibir tebing | ±0,5 dtk | Keyframe Z naik + tilt X turun (melihat ke jurang) |
| Tilt/crane vertikal cepat | ±0,5 dtk | Seperti whip, tapi pada sumbu X / Z |
| Terbang FPV antar lokasi | 1–2 dtk | Curve (Bezier) + constraint `Follow Path`, keyframe `offset_factor` 0→1, ketinggian rendah, lensa 16–20 mm |
| Masuk lewat jendela | ±0,6 dtk | Dolly lurus menembus bukaan jendela, `clip_start` kecil (0,01) |
| Menukik ke tanah sebagai transisi | ±0,4 dtk | Tilt ke bawah sampai kerikil memenuhi frame → ganti lokasi saat blur → tilt naik di lokasi baru |
| Dissolve (lompatan waktu) | 6–12 frame | Render per segmen, lalu Cross di VSE (API 5.x memakai `strips`, versi lama `sequences`) atau di Remotion |
| Lensa | 16–24 mm untuk ground-level & terbang; 35–50 mm untuk dialog | Ground-level dengan lensa lebar membuat kerikil depan tampak besar = kedalaman |

**Ukur kamera referensi secara nyata:** buka video di Blender → Movie Clip Editor → *Detect Features* → *Track* → *Solve Camera Motion* → *Setup Tracking Scene*.
Hasilnya kamera Blender dengan jalur & focal length mendekati referensi, bisa dijadikan contoh angka untuk Claude (kecepatan, easing, tinggi kamera).
Untuk satu frame diam: **fSpy** (titik hilang rel = garis paralel yang ideal) → importer fSpy di Blender.

## 5. Cahaya & warna (color script)
- Siang: matahari kuat sedikit dari samping, langit biru jenuh, bayangan biru-ungu.
- Interior gerbong mewah: lampu gantung hangat (2700 K), kursi merah, lantai biru gelap = kontras hangat/dingin.
- Akhir (59–65 dtk): **golden hour** (langit krem-oranye, asap cokelat), lalu flash putih + bola api.
- Jalankan `alat/06_palet.py` untuk mendapat HEX per segmen, lalu pakai di material.

## 6. Ritme (aturan untuk penulis skrip Claude)
1. Ketukan visual baru setiap **±2 dtk** (34 perubahan visual / 65 dtk).
2. Ekspresi berganti setiap **0,2–0,6 dtk**, mengikuti kata kunci (gunakan cap waktu per kata dari `alat/08_audio.py`).
3. Satu kalimat = satu bukti visual fisik.
4. Kamera tidak boleh benar-benar diam lebih dari ±1 dtk.
5. Pindah lokasi = gerak kamera. Dissolve hanya untuk lompatan waktu.

## 7. Cek hasil render Anda dengan alat yang sama
Jalankan `alat/jalankan_semua.sh` pada render Blender Anda, lalu bandingkan `ringkasan.md` render vs referensi:
frekuensi gerak kamera, porsi frame "diam", saturasi rata-rata, kekuatan kabut, dan skor estetika (pyiqa).
Jika angka render jauh di bawah referensi (mis. kamera diam 40% vs 5%), itu yang diperbaiki duluan.
