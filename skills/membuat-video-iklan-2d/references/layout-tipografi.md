# Layout & tipografi (1080x1920, 30 fps)

Diukur dari iklan referensi (720x1280 × 1,5), owner menilai sudah pas dan aman dari UI Reels/Facebook.

| Zona | Posisi |
|---|---|
| Judul | top ±270–305, kiri 66–72, kanan 50; maks 2 baris |
| Isi/visual | y ±585–1430 (fokus di sekitar tengah, ±53% tinggi) |
| Subtitle | kotak mulai y 1441 (sampai ±1537), di tengah |
| Sumber riset kecil | y ±1545, 26 px |
| Bawah y 1540–1920 (±20%) | kosong — tertutup UI aplikasi |
| **Kanan x >950, y ±850–1750** | **zona tombol Shorts/Reels (like, komentar, share)** — owner 2026-10-27: jangan taruh aksi penting (retakan, semburan, panah dorong, sumbatan) di sini; geser ke tengah atau buat simetris di kiri. Cek dengan arsiran merah di still periksa. Ingat kamera zoom: hitung posisi LAYAR `(x−cx)·s+540`. |

## Judul
- Font Baloo 2 800 (`public/font/Baloo2-*.woff2`), 98 px, line-height 1.1.
- Putih + `WebkitTextStroke: 11px #1E2A44`, `paintOrder: stroke fill`, bayangan `0 8px 0 rgba(20,28,50,.35)`.
- Kata sorotan = warna teks (`#FFD23F` / `#FF6B6B` / `#FFB04A`), BUKAN kotak warna.
- Muncul per baris mengikuti kata yang diucapkan (spring); tetap tampil ≥1 dtk setelah kata terakhirnya.

## Subtitle karaoke
- Pil navy, Baloo 2 700 52 px, maks 3 kata per kelompok, potong setelah tanda baca; kata aktif kuning.
- Ejaan layar: "HP" (bukan HAPE), angka sebagai angka ("124"), nama berhuruf besar.
- Kata yang sudah tampil sebagai judul hook boleh dikosongkan dari subtitle.

## Lain-lain
- Teks di layar ditulis sama persis dengan CTA yang diucapkan.
- Label/nomor P hanya di prototipe (`final` menyembunyikannya). Tanpa label "Ilustrasi cerita".
- Font lain yang tersedia: Fredoka (label kecil).

## Aturan dari audit owner (2026-10-26)
- Tokoh jangan kecil: bagian yang terlihat di atas zona aman (±y 1540) harus cukup besar; kalau terpotong setengah, tokoh terlihat pendek.
- Gelembung dialog: letakkan tepat di atas kepala pembicara (tokoh di bawah, kata di atasnya), ekor lancip lurus ke BAWAH ke arah mulut; jangan jauh dari orangnya, jangan ekor miring ke samping.
- Konsistensi benda: benda yang ada di satu sudut ruangan (mis. kipas di bawah jendela) harus tetap ada di adegan lain di ruangan yang sama; tidak boleh ada benda dobel (panci) atau melayang (kompor tanpa meja).
- Benda depan buram (DOF) yang tidak jelas bentuknya lebih baik dihapus; jangan pernah menutup visual utama (terutama di sisi kanan).
- Grafis (kalender dll.) harus polos: angka besar, satu warna sorot tegas, tanpa hiasan kecil.
- Foto di dinding pakai wajah asli tokoh (potong dari pose AI), bukan bentuk kepala polos.
