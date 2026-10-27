# Katalog efek kamera & overlay untuk cerita (riset 2026-10-26)

Owner punya selera, bukan pengalaman panjang di video → tugas Claude: sodorkan menu bernomor, owner memilih kombinasinya.

## Prinsip (dari profesional)
- **Walter Murch, *In the Blink of an Eye*** (editor pemenang Oscar) — Rule of Six: emosi 51%, cerita 23%, ritme 10%; emosi didahulukan di atas segalanya. https://nofilmschool.com/2016/11/6-rules-good-cutting-according-oscar-winning-editor-walter-murch
- **Bruce Block, *The Visual Story*** — simpan intensitas visual (gerak kamera, kontras) untuk puncak; jangan maksimal sejak awal, penonton lelah (ringkasan sekunder).
- **Gerak kamera "termotivasi"** mengikuti kejadian di layar & hampir tak terasa; gerak tak termotivasi lebih mencolok/bergaya. https://practicumfall2018.blogs.bucknell.edu/?p=225
- **Getar kamera** = kaget/kacau/aksi; gerak lambat & stabil = menahan tegang/emosi. https://people.wku.edu/joon.sung/edu/anim/3d/camera/camera.htm · https://brush.ninja/glossary/animation/camera-shake
- **Patrick Lin (DP Pixar, *Inside Out*)** — dunia nyata pakai kamera genggam halus, makin terasa saat kacau; gaya kamera berubah mengikuti perjalanan cerita. https://www.pluralsight.com/resources/blog/software-development/camera-structure-language-within-inside · https://en.wikipedia.org/wiki/Patrick_Lin_(cinematographer)
- **Iklan TikTok** — interupsi pola harus mengubah harapan penonton, bukan zoom/bunyi acak. https://sovran.ai/blog/tik-tok-ad-hook-ideas
- **Transisi** hanya bekerja bila terikat gerak/komposisi/cerita (match cut = rima bentuk; whip pan = lompat tempat/waktu). https://capcut.com/resource/types-of-filmmaking-transitions · https://www.insta360.com/blog/tips/how-to-create-film-transitions.html
- **Multiplane/parallax**: lapisan bergerak beda kecepatan → 2D terasa 3D. https://people.wku.edu/joon.sung/edu/anim/3d/camera/camera.htm

## Menu
| # | Efek | Arti/kapan | Sudah? |
|---|---|---|---|
| K1 | Push-in pelan | tegang, intim | ✔ semua adegan |
| K2 | Punch-in cepat (snap zoom) | penekanan kalimat kunci | |
| K3 | Pull-back reveal | ungkap konteks/ironi (mulai dekat → mundur) | |
| K4 | Getar kamera meluruh | kaget, gemetar | ✔ "ngomongin aku", "gemeter", "MINYAKNYA" |
| K5 | Kamera genggam halus | babak masalah terasa goyah (Pixar *Inside Out*) | |
| K6 | Dolly zoom (vertigo) | momen sadar/terguncang | |
| K7 | Whip pan | pindah tempat/waktu cepat | |
| K8 | Match cut bentuk | rima bentuk antar adegan | ✔ jendela → celah pintu |
| K9 | Rack focus | pindah perhatian depan ↔ belakang | |
| K10 | Pan/tilt reveal | memperkenalkan tokoh/tempat | |
| K11 | Freeze/slow-mo sesaat | menahan detik penting | |
| K12 | Parallax berlapis | kedalaman saat kamera bergerak | |
| O1 | Vinyet berdenyut (detak jantung) | cemas, tertekan | |
| O2 | Kilat putih (impact frame) | sadar/terkejut | |
| O3 | Garis kecepatan radial (anime) | kaget lucu/kuat | |
| O4 | Cahaya hangat menyapu (light leak) | lega, bahagia | |
| O5 | Warna kilas balik (redup/biru) | ingatan "dia lihat aku…" | |
| O6 | Layar terbagi (split screen) | montase kebiasaan | |
| O7 | Buram tepi + mata berkaca | menangis | |
| O8 | Kilau produk + zoom | reveal produk/ebook | |
| O9 | Teks kinetik (kata bergetar/membesar) | kalimat kunci | |

## Aturan owner (2026-10-26/27, iklan Little Wins US & Koder Cilik V8) — BERLAKU, menggantikan menu di atas bila bertentangan
- **Tunjukkan, jangan hanya bicara**: tiap frasa VO punya visual yang sama persis (mis. "If it's wrong, they tap again" = ketuk jawaban salah → merah + TRY AGAIN → ketuk lagi; "they get a prize" = kado keluar).
- **Tidak boleh ada adegan statis/polos**: selalu ada yang hidup (berkas cahaya bernapas, debu, kotak kosong berkedip, baterai berdenyut, benda mengambang, uap cangkir, jarum jam berputar).
- **Transisi: default FADE biasa** (crossfade ±10–14 frame, tanpa bunyi). Transisi heboh (zoom tembus + whoosh) HANYA di 2–3 momen cepat (mis. "6 wrong", masuk ke layar HP, "CRASH!"). Owner menolak geser kiri/kanan, putar, iris, sapu bergantian: "terlalu ramai, tidak efektif". Adegan yang tata letaknya sama = "sambung" (tanpa transisi; kamera dihitung per grup supaya zoom tidak melompat).
- **Momen intens = hentak kamera (punch-in) + warna bergeser ke palet malam dengan sorotan cahaya hangat di fokus, lalu bertahan.** Jangan vinyet berdenyut gelap atau kilat putih berkedip ("risih"). Getar layar boleh di momen kaget (hook "you have a problem", tabrakan).
- **Momen hangat untuk orang tua = tenang**: tanpa sorak penonton, yippee, kilau berlebihan, sapuan cahaya, bokeh ("ini untuk orang tua, ramai untuk apa").
- **SFX banyak tapi tepat makna**: bunyi salah ("tot") di momen nilai rendah/salah; JANGAN bunyi "ting" saat riset/peneliti; menulis panah = goresan pensil pendek per panah; robot berjalan = "tak" per langkah; jeda ≥1 dtk antara selesai menulis dan robot mulai jalan; bunyi jam/timer pendek (percepat & potong supaya tidak menabrak adegan berikut, `[frame, berkas, vol, kecepatan, maksFrame]`); hapus bunyi coretan panjang yang mengganggu. File: video-3d/public/lw2/sfx (ElevenLabs ±3 kredit/bunyi).
- **Benda produk = tata letak asli produk digambar ulang dengan kode** (bukan foto kertas yang bisa buram); HP hanya muncul saat VO memang membahas HP; tempelan ("TRY AGAIN" & bintang dicoret X) lebih halus ditempel DI ATAS benda yang sedang tampil daripada pindah adegan.
- **Hook bertokoh**: tokoh mulai tenang/tersenyum (belum tahu), tepat di kata masalah wajah berubah + getar layar. Buat pose kedua dengan EDIT wajah pose yang sama (gpt-image-2.5-sunburst, ±433 kredit) lalu sejajarkan posisi mata (tidak meloncat saat ganti).
- **Kamera keyframe di DALAM satu dunia (owner 2026-10-27, Shorts terowongan)**: pan/tilt/zoom/pull-back mengikuti aksi ("geser kanan-kiri itu pasti") — beda dengan transisi geser antar-adegan yang tetap ditolak. Kunci kamera = [frame, cx, cy, skala] per adegan, diikat ke indeks kata; adegan satu grup = sambung (kunci awal adegan berikut = kunci akhir sebelumnya). Penjepit wajib: skala ≥1,02 dan cx/cy dijepit supaya pandangan + getar tidak keluar dari dunia 1080×1920 (tepi putih). Gradien SVG beri ID per palet (`gLaut${P.id}`) supaya saat fade siang→malam warna tidak bocor. Acuan: video-3d/src/terowongan/Animasi.tsx + waktu.ts (`kamera`, `getar`, `Flip` flipbook frame AI, zoom tembus `tembus`).
- **Jangan simbol emoji untuk proses fisik** (owner 2026-10-27: tetes air + tanda X "tidak efektif"): tunjukkan prosesnya secara nyata — mis. retakan asli dengan air mengalir (garis cyan putus-putus bergerak) yang terputus saat beton/lumpur lewat, + kilatan kecil di titik tersumbat.
- **Kesinambungan waktu cerita**: kalau VO menyebut "in the dark", seluruh rangkaian itu malam sampai titik balik (breakthrough); pagi datang di momen menang. Benda latar hidup: ikan berenang, kapal berlayar (putar ulang di balik tebing).
- Kode acuan: video-3d/src/lw2/Prototipe.tsx (EN) dan src/v8/Prototipe.tsx (ID) — transisi, GantiSorot, punch, getar, SFX; src/lw2/robo.tsx (kartu soal + 12 prinsip animasi).
