# Riset warna, kontras & gerak

## Daftar isi
1. Keputusan gaya yang berlaku
2. Palet Triad E (hex)
3. Sumber warna & emosi
4. Kontras untuk titik fokus
5. Skema harmoni & color script
6. Gerak tidak alay
7. Yang sudah dicoba dan ditolak

## 1. Keputusan gaya yang berlaku
- 2D storybook: bentuk bulat padat, tanpa garis hitam pada karakter AI, bayangan 1 nada + cahaya tepi, mata besar berkilau, pipi merona.
- Dunia terang (pagi/siang). Palet **Triad E**: biru dominan + emas + mawar; versi TENANG untuk cerita biasa, INTENS (indigo gelap + kolam cahaya hangat) untuk momen tegang; berpindah halus dengan `campur(tenang, intens, k)`.
- Latar: satu keluarga warna dingin, `blur(2px)`, kontras kecil. Fokus: hangat, detail paling banyak, garis tepi tegas (`#2E2A48`, intens `#1A1626`), cahaya radial hangat di belakang + vinyet lembut.
- Tanpa grain/bintik (owner: "gak ada fungsinya"); tepi kertas boleh bergoyang halus.

## 2. Palet Triad E
TENANG: latar/dinding `#DDE3F6`, langit `#BFCDF0`, kusen `#F4F1E6`, tirai `#E3B8C4`, rak `#9AA2D0`, meja `#E9DDBE`, kertas `#FBF7EC`, cahaya `rgba(255,214,150,.5)`, vinyet `rgba(80,80,140,.25)`, lengan anak `#FF7A59`.
INTENS: latar `#262C58`, dinding `#2F3566`, langit `#46508A`, meja `#5A5240`, cahaya `rgba(255,206,140,.42)`, vinyet `rgba(12,12,32,.5)`.
Sorotan teks judul: kuning `#FFD23F`, merah `#FF6B6B`, koral `#FFB04A`. Navy `#1E2A44`.
Kode: `D:/PythonProjects/video-3d/src/gaya/tema.ts` (`PASANGAN.E`, `campur`).

## 3. Warna & emosi
- **Valdez & Mehrabian 1994** — emosi lebih ditentukan kecerahan & kejenuhan daripada hue; senang ≈ .69 × kecerahan + .22 × kejenuhan. https://pubmed.ncbi.nlm.nih.gov/7996122/
- **Wilms & Oberfeld 2018** — jenuh & terang = perhatian/gairah lebih tinggi; ketiga dimensi berpengaruh. https://pubmed.ncbi.nlm.nih.gov/28612080/
- **Labrecque & Milne 2012** — "exciting red, competent blue": warna menggeser kepribadian merek & niat beli (isi lengkap belum dibaca).
- **Headspace** (Anna Charity) — kepribadian merek dibawa tokoh: bentuk padat + warna berani, mata/mulut khas konsisten.
- **Kurzgesagt** — bentuk bulat + warna cerah berani (sumber sekunder).
- Aturan owner: warna tokoh kontras dengan latar (mis. latar hijau → tokoh merah-oranye `#F2542D` + kuning `#FFC93C`), mata paling cepat menangkap merah/kuning.

## 4. Kontras untuk titik fokus
- **Itten, 7 kontras warna** (1961) — dipakai: hangat-dingin + luas. Kontras kejenuhan (campur abu-abu) DITOLAK owner.
- **Bruce Block, *The Visual Story*** — kontras di titik fokus, afinitas di sekitarnya; kuning jenuh menarik mata pertama.
- **James Gurney, gamut mask "Dominant Hue With Accent"** (*Color and Light*).
- **Perspektif udara** — jauh = lebih terang, kebiruan, kontras kecil, tepi lembut.
- **Itti, Koch & Niebur 1998** — mata ditarik oleh PERBEDAAN warna/terang/arah (uji pelacak mata).
Penerapan: hanya 1–2 titik fokus terang; sisanya diwarnai ULANG (bukan ditimpa lapisan transparan) dalam satu keluarga warna dingin.

## 5. Skema harmoni & color script
- **Eggleston / Pixar color script** — seluruh film dipetakan dalam potongan warna; intensitas naik saat emosi naik.
- Color script per video: hook riset = cerah & penasaran → masalah anak = sedikit lebih kusam/intens → solusi produk = paling cerah & jenuh → CTA = warna merek.
- Triad (Gurney gamut segitiga: tiga primer subjektif, satu dominan dua aksen). Oranye–teal komplementer juga diuji (GayaD) tapi owner pilih Triad.
- Analisis harmoni Pixar/Disney = praktik industri/blog, bukan studi akademik.

## 6. Gerak tidak alay
- **Thomas & Johnston, *The Illusion of Life*** — utamakan pose; aksi sekunder tidak bersaing dengan aksi utama; eksagerasi dikurangi.
- **Material motion** — transisi 200–300 ms; >400 ms terasa lambat.
- Penerapan: muncul 0,9→1 dalam ±7 frame (`pop`), crossfade adegan 6 frame, push-in kamera 4% per 6 dtk, karakter napas 0,8% + goyang 0,45°, kedip 4 frame tiap ±3 dtk, ganti pose dengan squash kecil (`tukar`). Judul pakai spring (damping 14; sorotan 9).
- Satu aksi per momen. Tanpa kipas sinar, ledakan "TAP!", pantulan besar.

## 7. Sudah dicoba & ditolak
- 3D Three.js (berantakan, laptop RAM 12 GB patah-patah).
- Palet malam-hujan, letterbox, Poppins.
- Lapisan abu-abu / biru tempelan untuk meredam latar.
- Grain di seluruh layar; kotak warna di belakang judul (menyatu dengan latar).
- Karakter digambar kode (kalah dari karakter AI).
- Garis jalur saja untuk soal (harus seperti kartu soal worksheet asli).

## 8. Latar digambar kode (riset 2026-10-26, video diet)
Kenapa: latar AI tanpa acuan gaya jadi semi-realistis dan tokoh flat terlihat seperti stiker (diuji: tempel Bonita ke latar AI). Hook Variasi 7 (latar kode + tokoh AI) disukai owner.
Sumber profesional:
- **Catriona Drummond**, art director utama Bluey musim 1 (Ludo Studio; serial anak paling ditonton di Australia/AS). https://www.itsnicethat.com/features/how-we-built-bluey-s-world-cartoon-background-scenery-art-director-catriona-drummond-animation-090725 · https://goodsniff.substack.com/p/creating-bluey-tales-from-the-art
  1. Latar didesain SETELAH tokoh dikunci, untuk mendukung tampilan tokoh.
  2. Ruang datar & grafis: buang sudut kamera & efek cahaya; kebanyakan shot lurus dari depan dengan lantai rata untuk "panggung akting".
  3. Perspektif dua titik terbalik: titik hilang di sisi berlawanan dinding belakang → ruangan terasa lega, sisi yang menghadap kamera tetap datar.
  4. Bahasa bentuk: persegi bulat besar yang ramah untuk bangunan, perabot, detail; proporsi "rumah boneka" (gemuk, sederhana) agar cocok dengan tokoh.
  5. Tanpa garis hitam: warna garis diambil dari warna benda + cahayanya.
  6. Bayangan tidak pernah netral/abu: didorong lebih dingin atau lebih hangat dari bendanya; sorotan keemasan + bayangan biru.
  7. "Style bible": aturan gaya ditulis supaya semua latar konsisten.
- **Nathan Fowkes** (DreamWorks, pengajar Schoolism) — "value grouping": satukan bentuk bersebelahan yang nilainya mirip menjadi 3 kelompok besar (terang, sedang, gelap); detail ditambahkan tanpa merusak kelompok besar. Fokus = bentuk terang dikelilingi nilai sedang. https://zoungyart.substack.com/p/sketching-the-view-from-the-woodshed (ringkasan pihak ketiga, bukan kata Fowkes langsung)
- Hans Bacher (*Dream Worlds*, *Vision*): bab komposisi, staging, nilai & warna — isi belum dibaca langsung.
Penerapan: latar dari persegi bulat, lurus dari depan, lantai rata di 1/3 bawah, dinding satu keluarga warna dingin dengan 3 kelompok nilai, garis tepi berwarna (bukan hitam), bayangan kebiruan/hangat, detail kecil seminimal mungkin di area tokoh (area kosong di tengah), benda cerita (panci, kulkas) boleh lebih jenuh karena jadi fokus kedua.

## 9. Triad + kontras untuk produk lain (riset 2026-10-26, video diet)
Owner: patokan = konsep triad ala Pixar/Disney seperti Koder Cilik V7 (tenang ↔ sorotan cahaya di momen tegang); warna BOLEH beda dari V7, asal hal penting lebih kontras.
- **James Gurney, gamut masking** (*Color and Light*; blog Part 2): pilih 3 "primer subjektif" = sudut segitiga di roda warna; pakai hanya warna di dalam segitiga ("what's outside the gamut are the colors you want to leave out"); segitiga makin kecil = makin harmonis/monokrom; segitiga tidak harus sama sisi. https://gurneyjourney.blogspot.com/2011/09/part-2-gamut-masking-method.html · https://docs.krita.org/user_manual/gamut_masks.html
- **Csillag & Sabao 2022**, *Color Culture and Science Journal* 14(2), analisis color script 4 film Pixar (Nemo, Up, Cars, Wall-E): kontras yang PALING sering = hangat-dingin atau terang-gelap untuk memisahkan tokoh/benda dari latar; kontras kejenuhan menciptakan titik fokus (telur Nemo oranye jenuh vs sirip Marlin oranye kusam); kontras komplementer dipakai di semua film untuk "getaran" yang cocok untuk anak. doi 10.23738/CCSJ.140203
- **Bruce Block**: kontras di fokus, afinitas (kemiripan) di sekitarnya; kuning jenuh menarik mata pertama (parafrase pembaca).
- Triad tidak terbukti dipakai di film Pixar tertentu (analisis blog saling bertentangan) → perlakukan sebagai praktik desain, bukan klaim "Pixar pakai triad".
Penerapan video diet (`video-3d/src/diet/warna.ts`): dominan biru-periwinkle pucat (latar) + aksen merah-koral (Bonita, benda cerita) + aksen emas (cahaya, makanan, buku, CTA); hanya fokus yang jenuh; momen tegang/malam = palet intens V7 (indigo + kolam cahaya hangat + vinyet); tempat kedua (warung Rini) digeser ke mawar pucat supaya kaus teal Rini kontras komplementer dan tempatnya beda.

## 10. Kekayaan visual — bedah video acuan HN1 (`Downloads/Hn1VfpfK.mp4`, owner suka, 2026-10-26)
Tanpa gambar AI, tapi terasa kaya karena:
1. Lapisan kedalaman 4–5 (depan gelap: pagar/semak → rumah → gedung kota berjendela menyala → awan/langit), tiap lapis beda nilai + kabut.
2. Sumber cahaya terlihat & bercahaya: jendela kuning, lampu teras, lampu jalan, bokeh bulat buram, berkas cahaya tegak (light shaft) di wajah tokoh.
3. Efek suasana bergerak: hujan miring, tetes di kaca, genangan memantul.
4. Frame di dalam frame: adegan dilihat lewat celah pintu gelap (sudut "menguping" = cerita lewat komposisi); hangat di dalam vs dingin di luar.
5. Benda kecil bercerita: lukisan berbingkai, lampu berdiri, tirai + pengikat, bantal sofa bermotif titik, teko & cangkir di meja, karpet dengan jahitan putus-putus, gagang pintu, foto pasangan di dinding, lampu hias di pohon, anting & jepit rambut.
6. Motif/pola di kain & permukaan (titik, jahitan, garis).
7. Transisi larut (dissolve) yang menyambung: jendela rumah → isi ruangan.
8. Siluet di jendela sebelum wajah ditunjukkan (penasaran dulu).
Catatan: HN1 memakai grain kasar — owner sudah menolak grain di V7; jangan ditiru kecuali diminta.

## 11. Bedah video robot (rekaman layar `Videos/Screen Recordings/Screen Recording 2026-10-25 120346.mp4`, acuan owner)
Tambahan dari HN1: variasi jarak kamera (tokoh kecil di kota → close-up wajah → tampak samping), benda depan buram (fokus kamera), genangan dengan riak & pantulan, hujan berlapis (dekat besar-buram, jauh tipis), kerucut cahaya lampu jalan, benda bercahaya (mata robot).
Kode siap pakai: `video-3d/src/diet/suasana.tsx` (Hujan, Bokeh, Sinar, Debu, Genangan) dan `detail.tsx` (benda kecil, RumahMalam, RuangHangat, CelahPintu, Pagar, DepanToples). `Panggung` punya slot `efek` & `buram` (lapisan depan blur 9px).

## 12. Gerak kecil dari bedah HN1 per 0,1 dtk (2026-10-26) — wajib di video berikutnya
- Kamera terus maju pelan; adegan pembuka masuk ke jendela lalu LARUT ±0,5 dtk (double exposure, gambar lama tetap terlihat) ke adegan berikut yang posisinya cocok (jendela → celah pintu).
- Tokoh yang bicara: kepala naik-turun mengikuti ritme suku kata; pasangan bergantian bicara; pendengar mengangguk pelan. Implementasi: `Pose` memotong gambar AI jadi kepala (di atas garis leher) & badan; kepala hanya digeser ke bawah 0–6 px (tidak ada celah). Gambar berdua (sofa) dibagi dua kolom.
- Pintu "terbuka" pelan (celah melebar), berkas cahaya mengintip melebar-menyempit + terang-redup + kedip halus sesekali.
- Gestur kecil sesuai emosi: nampan gemetar, bahu terisak saat menangis/lesu, sentakan kecil saat kaget.
- Grafis siklus: garis putus-putus & panah terus berjalan memutar, titik cahaya mengelilingi.
