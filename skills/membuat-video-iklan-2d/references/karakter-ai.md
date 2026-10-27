# Karakter AI: lembar pose, potong, kedip

## Alur
**Aturan owner (2026-10-26): SEMUA generate = 1 gambar berisi 4 panel**, bukan hanya lembar pose: varian desain (4 varian/tokoh), line-up (4 tokoh), latar (4 latar dalam grid 2x2, lalu dipotong), benda (4 benda). Hitung jumlah gambar = jumlah lembar 4 panel.
1. Sepakati desain dulu (pakaian, warna hex kontras dengan latar, rambut, aksesoris). "Model/gaya" kata owner = varian desain, bukan model AI.
2. Generate lembar pose (4 pose sejajar, latar polos) memakai gambar acuan yang sudah disetujui → jaga wajah & warna sama.
3. Potong: `REMBG=1 py scripts/potong_pose.py lembar.png nama1,nama2,nama3,nama4 [skala]` (hasil ke `POSE_DIR`, default `video-3d/public/uji/`). Jika pemisahan pose salah, beri potongan paksa (argumen ke-4, x-koordinat dipisah koma).
4. `py scripts/deteksi_mata.py` → mata.json (kedip otomatis). Buka gambar cek (`CEK_JPG`): elips merah harus tepat di mata; pose mata tertutup dilewati.
5. Catat ukuran pose ke `pose-ukuran.json` (w,h per nama).
6. Tampilkan galeri semua potongan ke owner, tunggu setuju.

## Frame animasi per gerakan (owner 2026-10-27, Shorts terowongan)
Gerakan penting (menggali, menuang, kaget, lompat, membuka koper) JANGAN satu pose: buat 1 lembar 4 panel = 4 keyframe berurutan dari satu gerakan, lalu kode yang menukar/menghaluskan (lebih murah dari video AI).
- Prompt: "Animation keyframe sheet: four sequential FRAMES of one continuous action… FIXED CAMERA: same size, same view, feet on the same baseline; only the moving parts change" + aksi per frame. Gambar 2K 2:1, acuan = varian karakter terpilih.
- Potong: `py scripts/potong_frame.py lembar-bersih.png awalan FOLDER ukuran.json` → awalan-1..4 berukuran sama, dipisah lewat celah kolom (pose lebar melewati seperempat lembar), disejajarkan pada titik tengah sepatu, tinggi asli dipertahankan (lompatan tetap naik).
- Tokoh baru (mis. orang kaya misterius) boleh langsung dibuat sebagai lembar frame dengan acuan gaya saja.
- Benda/hiasan 2x2 → `scripts/potong_grid.py`. Galeri flipbook (frame diputar 350 ms) untuk owner menilai gerakan sebelum animasi.

## Model & biaya (koneksi `elevenlabs-hosted`, cek ulang sebelum dipakai)
| Model | Biaya ±kredit | Catatan |
|---|---|---|
| GPT Image 2.5 Flare 1K | 190 / gambar | pose kecil, perlu upscale |
| GPT Image 2.5 Flare 2K | ±275 tanpa acuan · ±518 dengan 1 acuan · ±760 dengan 2 acuan · ±1.245 dengan 4 acuan (diukur 2026-10-26) | dipakai Variasi 7 & video diet |
| Flare custom 3840x1728 (latar 4 panel vertikal) | ±433 / lembar | tiap panel ±960x1728, cukup untuk 1080x1920 |
| Nano Banana 2.1 2K (`gemini-nano-banana-2.1`) | 458 / lembar 4 panel | pilihan owner saat kredit tipis |
| Gemini 3.1 Flash 2K | 918 | lebih mahal, hindari |
| Veo 3.1 Fast 720p | 4 dtk 2.424 · 6 dtk 3.636 · 8 dtk 4.848 | klip video pendek saja |
Unggah acuan: `creative_create_asset_upload` → PUT bytes → `creative_finalize_asset_upload`. Jangan ulang generate untuk "coba lagi".

## Template prompt lembar pose
```
Character model sheet: four NEW poses of exactly the same [deskripsi tokoh] shown in the reference image (same face, same [rambut], same [kulit], same [pakaian + warna hex], same proportions and colors).

Style (identical to the reference image): flat 2D storybook illustration like a modern children's picture book. Simple rounded shapes, clean silhouettes, NO black outlines (shapes separated by color, with only a slightly darker same-hue edge), one soft cel-shadow tone on the right side of every form, a subtle light rim on the left. Big expressive eyes with brown irises, two white highlights and short upper lashes, small curved nose line, rosy cheeks. Hands: large, clear, graceful cartoon hands with a thumb and four rounded fingers, visible wrists, natural elbows — no thin noodle arms.
Layout: four poses in one horizontal row on a plain flat off-white background (#F7F4EE), each framed from the waist up, evenly spaced, not overlapping, clear empty space between poses. No text, no labels, no frames, no floor shadows, no extra characters.

Pose 1 (left): [emosi + tangan + mata + mulut]
Pose 2: ...
Pose 3: ...
Pose 4 (right): ...
```
Tokoh BARU dengan gaya sama: "Character model sheet for a NEW character drawn in exactly the same art style as the reference image (use the reference only for style, not for the character): …".
Tips: mata terbuka di sebagian besar pose (supaya kedip terdeteksi); benda yang dipegang tanpa tulisan ("blank paper, no readable text"); hindari baju putih besar di latar putih (pakai REMBG); jangan minta grain.

## Tokoh yang sudah ada (Variasi 7, `video-3d/public/uji/`)
- Bunda (narator): bob cokelat tua, jepit kuning, anting mutiara, blus mawar — `bunda-p1..p4`, `b-*`.
- Dimas (7 thn): `dimas-p1..p4`, `d-*`.
- Peneliti psikologi anak: kacamata bulat, sanggul + pensil kuning, jas lab putih di atas kemeja teal — `p-*` (p-kaca, p-kaget…).
- Video lama: anak baju merah-oranye + Bunda blus kuning (`coding-worksheet/video-cara-berpikir/aset`), Kenzo (kacamata, rompi hijau), Bu Melati (blus magenta).
- Robo = robot kepala bertunas dari aplikasi Robo Coder.

## Masalah potong yang pernah terjadi
- Floodfill bolong di jas lab putih & kertas → pakai `REMBG=1` (BiRefNet-general, lokal, gratis).
- Putih mata ikut hilang karena isi-lubang → jalankan ulang tanpa `TANPA_LUBANG` atau naikkan/turunkan `AMBANG`.
- Kedip digambar ulang satu badan → tidak sejajar; tempel kelopak saja (cara di `Pose`).

## Pelajaran video diet (2026-10-26)
- Akun ElevenLabs gratis/rendah kena 429 kalau >1 generate sekaligus; akun Pro bisa 11 sekaligus.
- Acuan = potong varian terpilih dari lembar varian (py + PIL), unggah, sambungkan ke node (connect_from). Wajah & baju konsisten di semua lembar.
- Lembar BENDA tanpa acuan gaya jadi semi-realistis (tidak flat storybook) → beri acuan gaya (lembar pose) saat generate benda.
- Pose duduk berdua: sofa digambar bersama tokoh; latar ruang tamu dikosongkan di tengah.
- Lembar LATAR tanpa acuan gaya jadi anime semi-realistis (pantulan lantai mengilap, logam berkilau, toples detail, cahaya foto) → tokoh flat terlihat seperti tempelan; blur tidak menolong (owner menolak, 2026-10-26). Latar WAJIB diberi acuan gaya (lembar pose tokoh) + prompt "same flat storybook rendering as the characters: flat color areas, one soft shadow tone, no glossy reflections, no metallic shine, no photographic lighting, simplified objects, low detail". Sebelum generate semua latar, tempel 1 pose ke latar (PIL) dan cek apakah tokoh terlihat menyatu.

## Desain maskot merek (riset 2026-10-26, maskot Little Wins)
- Siluet dulu: Valve (GDC 2008, *Team Fortress 2*) — siluet = fondasi, harus dikenali sekilas lewat proporsi khas & benda khas. https://cdn.steamstatic.com/apps/valve/2008/GDC2008_StylizationWithAPurpose_TF2.pdf
- Bahasa bentuk (Disney/Pixar): lingkaran = hangat, kotak = bisa diandalkan (Carl di *Up*), segitiga = licik/jahat. Uji siluet hitam. https://blog.cg-wire.com/character-shape-language/
- Minimalis ikonik: Miffy (Dick Bruna) — bentuk geometris dasar, sedikit garis, 1–2 warna; Hello Kitty lebih ekstrem (tanpa mulut). https://grapheine.com/en/magazine/dick-bruna-minimalist-graphic-designer-and-father-of-the-most-famous-rabbit/
- Ken Sugimori (Pokémon): "keep the balance" — tambahkan satu unsur berlawanan (lucu ke yang serius, dsb.); ulangi proporsi berkali-kali; desain harus terbaca di layar kecil. https://gonintendo.com/stories/314573-ken-sugimori-on-making-sure-pokemon-aren-t-too-cute-or-cool
- Duolingo: bisa digambar dari satu lingkaran, detail paling sedikit, eksagerasi (lihat memori duolingo-design-lessons).
- Riset merek: karakter = aset merek paling unik & dikenal (Romaniuk); kampanye dengan karakter tetap lebih sering menaikkan pangsa pasar (System1/IPA); karakter animasi lebih dikenali dari maskot manusia (survei Crestline). Kepercayaan = hangat + kompeten (Kervyn, Fiske & Malone 2012).
- Hasil: maskot Little Wins = mama beruang biru (#4F6FD0) + anak kuning (#F6C453), kacamata bingkai navy tebal; 3 konsep bentuk di `brand-little-wins/maskot/`.
