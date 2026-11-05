# Analisis frame demi frame — "Why Perfect Railroads Don't Work" (2026-11-05)

Sumber: file unggahan owner `vidssave.com_Why_Perfect_Railroads_Dont_Work_480P.mp4`.
Data teknis (ffprobe): 480×854 (9:16, versi unduhan 480p), 30 fps, 65,17 detik, ada audio (narasi + SFX).
Cara melihat: frame diambil tiap 0,2 detik (`ffmpeg -vf fps=5`) → 326 frame → 33 lembar kontak (10 frame / 2 detik per lembar), lalu diperiksa satu per satu.
Video **tidak** disimpan di repo (hak cipta). Taruh sendiri di `alat/input/video.mp4` untuk menjalankan ulang.

> Catatan jujur: bagian ini adalah **pengamatan visual** (mata, frame per frame). Angka gerak kamera, warna, kedalaman, dan audio
> belum diukur di sesi ini karena prosesnya dihentikan. Skrip pengukurnya ada di `alat/`. Jalankan di localhost untuk mendapat angka pasti.

---

## 1. Ringkasan gaya (yang membuat video ini "terasa mahal")

| Lapisan | Apa yang terlihat | Kenapa berhasil |
|---|---|---|
| **Dunia** | 3D bergaya (stylized), tekstur seperti dilukis tangan, warna sangat jenuh: tebing ngarai bergaris (strata) merah-oranye-ungu, langit biru dengan awan lembut, batu kerikil (ballast) berbentuk faset/low-poly yang tetap terlihat "real". | Dunia 3D memberi kedalaman & gerak kamera bebas; gaya lukis membuatnya serasi dengan tokoh 2D. |
| **Tokoh** | 2D datar: kepala bulat putih, garis tepi hitam tebal, kaki/tangan = garis hitam (stick), badan bentuk kacang dengan pakaian berdetail (jahitan, kancing, saku, suspender, rantai jam). Tokoh **ditempel di dunia 3D** (seperti kartu/billboard), dan **menghasilkan bayangan** di tanah/tebing. | Kontras 2D-di-3D = ciri khas. Bayangan membuat tokoh terasa "berdiri" di dunia, bukan stiker. |
| **Wajah** | Ekspresi berganti sangat cepat (sering tiap 0,2–0,4 dtk), selalu sesuai kata yang diucap. Banyak "simbol kartun": tetes keringat, uap kepala, wajah terisi ungu seperti cairan, noda kopi di kumis. | Wajah adalah "aktor" utama. Penonton membaca emosi dari mata/alis/mulut, bukan dari tubuh. |
| **Kamera** | Hampir **tidak pernah diam**. Perpindahan tempat dilakukan dengan gerak kamera (whip pan, terbang FPV, orbit, crane naik/turun, masuk lewat jendela, menukik ke tanah), bukan potongan. PySceneDetect `detect-adaptive` hanya menemukan **1 potongan keras** di 65 detik (di 44,03 dtk). | Kesan satu tarikan napas ("one-take"). Mata penonton terus diajak, tidak ada jeda mati. |
| **Kedalaman** | Kabut atmosfer kuat: dasar ngarai hilang dalam biru pekat; mesa di kejauhan pucat lavender. Asap kereta volumetrik (hitam di siang hari, cokelat di senja), ledakan volumetrik besar. Objek kecil jatuh ke jurang untuk "menjual" kedalaman. | Kabut = skala. Benda jatuh = bukti fisik bahwa jurangnya dalam. |
| **Detail mikro** | Gergaji besi + percikan api, kapur "39FT" di bantalan, jangka sorong (caliper) mengukur celah, koin & selembar kertas diselipkan ke celah, kelereng menggelinding di rel mulus, kalender "MAY 1880" yang lembarnya terbang (Mei→Juni→Juli), termometer, bendera biru, tumbleweed, koran "The Red Mesa Herald", paku rel yang melompat keluar. | Setiap kalimat narasi punya **bukti visual fisik**. Konsep abstrak (pemuaian termal) jadi benda yang bisa dilihat. |
| **Caption** | 1–2 kata per tampilan, putih tebal + garis hitam, tengah layar (±70% tinggi). Berganti mengikuti kata yang diucapkan. | Retensi Shorts. Posisinya tetap sehingga tidak bentrok dengan gerak kamera. |

### Tokoh (desain)
- **Insinyur muda (tokoh utama):** topi masinis bergaris biru-putih, rambut cokelat, rompi teal + suspender, bandana merah bertitik putih, jahitan kuning. Ekspresi dasar: **smug / setengah kelopak** (percaya diri).
- **Bos:** topi bowler hitam mengilap, uban abu di samping kepala, rompi kuning mustard bertekstur, kancing emas, rantai jam, dasi kupu-kupu, tongkat berkepala emas. Ekspresi dasar: alis turun, cemberut.
- **Taipan rival (Vandergold):** topi tinggi (top hat) hitam berpita emas, mantel hitam dengan kancing emas, wink & seringai.
- **Pekerja/penumpang:** variasi topi (fedora cokelat, flat cap), jenggot putih, kemeja kotak-kotak. Pakai badan yang sama dengan aksesori berbeda (hemat produksi).
- **Petugas berseragam biru** (topi berlencana emas): memeriksa sambungan rel.

### Kamus ekspresi (yang muncul di video)
| Ekspresi | Mata | Alis | Mulut | Kapan dipakai |
|---|---|---|---|---|
| Smug | setengah kelopak, pupil titik | datar / satu naik | senyum miring | tokoh utama yakin |
| Bahagia | busur terbalik (^ ^) tertutup | — | senyum lebar | menikmati (gergaji, teh) |
| Kaget | lingkaran besar O O + pupil titik | naik | "o" kecil / datar | bos melihat celah, taipan topinya terbang |
| Meringis | > < (dijepit) | — | gigi grid | kereta lewat dekat sekali |
| Marah | sipit | diagonal turun ke tengah | gigi dikatup (grid) → teriak (mulut terbuka) | bos "You're wrecking my railroad" |
| Curiga | sipit, satu alis naik | asimetris | garis datar | bos membungkuk ke celah |
| Cemas | O O | miring ke atas | bergelombang + **tetes keringat** | kopi tumpah, koran |
| Puas jahil | setengah kelopak | — | seringai gigi | bos senang di akhir, rival dengan papan "ALL ABOARD!" |

Efek di atas wajah: **ungu mengisi wajah dari dagu ke atas seperti cairan** (dengan gelembung kilau) lalu **surut ke bawah** saat marah reda. **Gumpalan uap** muncul di kiri-kanan topi. **Tetes keringat** biru. **Noda kopi** menempel di kumis.

---

## 2. Timeline (per ketukan narasi)

Format: waktu — narasi (caption) — **kamera** — tokoh/ekspresi — dunia & detail.

| Waktu | Narasi | Kamera | Tokoh & ekspresi | Dunia & detail kecil |
|---|---|---|---|---|
| 0,0–1,8 | "He sawed gaps into a railroad every 39 feet." | Rendah, dekat rel (lensa lebar), dorong pelan maju & naik | Insinyur jongkok menggergaji rel. Smug → mata ^^ bahagia saat gergaji kena (0,6) → seringai | Percikan api di titik gergaji. Lokomotif uap datang dari kejauhan, lampu depan bersinar, asap hitam; tebing merah, kaktus, tiang telegraf |
| 1,8–2,4 | "every 39 feet" | **Whip pan** ke kanan menyapu tebing (blur gerak) | Tokoh berdiri, tangan di pinggang, smug | Bayangan tokoh jatuh di tebing |
| 2,4–3,0 | "feet." | **Orbit** ±90° mengelilingi tokoh, sekarang menatap sepanjang rel | Tokoh terlihat dari samping (kartu 2D berputar) | Rel lurus panjang menyusuri tebing, jembatan di kejauhan |
| 3,2–3,4 | "You see," | Kamera diam, kereta melintas sangat dekat di depan kiri | Meringis > < gigi grid | Badan lokomotif detail (dome, pipa, lampu) |
| 3,6–4,0 | "two" | **Crane naik** mengikuti asap lalu **terbang melewati bibir tebing** | — | Pertama kali terlihat kedalaman ngarai biru |
| 4,0–6,0 | "companies are racing to build railroad" | Turun & maju ke perancah trestle (drone) | Pekerja kecil di atas | Trestle kayu/besi, crane, kabut biru pekat di dasar |
| 6,0–8,2 | "along a canyon so deep you can't see the bottom." | Melewati crane → kamera **menunduk** ke papan yang menjorok di atas jurang | Pekerja (kemeja kotak merah) di ujung papan | **Palu/paku jatuh ke jurang** (7,6) dan hilang dalam kabut. Cangkir di papan |
| 8,4–9,0 | "And whoever" | **Crane/tilt naik vertikal cepat** menyusuri dinding tebing (blur) | — | Garis-garis strata jadi garis horizontal karena blur |
| 9,0–10,4 | "finishes first gets the whole" | **Terbang FPV** rendah di atas gurun menuju kota | — | Rumput gurun, mesa di cakrawala, kota & stasiun berkubah. Blur tepi kuat |
| 10,4–11,4 | "country's business." | Terbang masuk ke dalam stasiun, berhenti di depan panggung | Taipan: **wink** (11,2), seringai | Spanduk "FIRST LINE IN GETS IT ALL!", huruf "UNION", gunung koin emas, kantong uang "$", karpet merah, kubah kaca |
| 11,6 | "He's" | **Cross-dissolve** ±0,3 dtk | — | — |
| 11,8–13,4 | "the youngest engineer on the job." | Kamera rendah melihat ke atas, drift pelan | 4 pekerja duduk di balok di atas jurang (makan siang). Insinyur melambai, mata O O senang, lalu senyum lebar; pekerja lain melirik skeptis | Pak tua berjenggot minum dari mug, kotak bekal |
| 13,4–13,6 | "when" | Dissolve + kilau cahaya | — | — |
| 13,6–14,0 | "his boss" | Medium, rendah | Bos cemberut, tongkat | Matahari & lens flare, burung terbang |
| 14,0–15,4 | "sees a finger wide gap between every" | **Kamera turun ke tanah** mengikuti bos yang membungkuk | Kaget O O → curiga (satu alis) | Kerikil besar di latar depan (lensa lebar), penanda putih kecil di celah |
| 15,6–16,2 | "every single" | Mundur sedikit | Bos tegak, tangan di pinggang, marah. Insinyur di latar belakang (staging kedalaman) | — |
| 16,4–17,0 | "rail, face" | **Orbit** mengelilingi bos (latar berganti langit → tebing) | Marah makin kuat → gigi dikatup | Tiang telegraf, tebing berlapis |
| 17,2–17,8 | "goes purple." | Drift pelan | **Ungu mengisi wajah dari bawah** + gumpalan uap muncul di kiri-kanan topi | — |
| 18,0–19,0 | "You're wrecking my railroad." | Dolly/orbit pelan → mundur jadi two-shot | Teriak (mulut terbuka), menunjuk dengan tongkat | — |
| 19,2–21,0 | "But he won't close a single one." | Two-shot, drift | Insinyur tenang/smug, isyarat menolak. **Ungu surut ke bawah** (20,0–20,2) lalu bos kaget O O | Rel, kerikil, tebing ungu di belakang |
| 21,2–21,6 | "one." | **Pan kanan lalu menukik ke tanah** (blur) = transisi | — | Kerikil memenuhi layar |
| 21,8–23,0 | "The other company lays their rails" | Rendah menyusuri rel di dek trestle kayu | Taipan di panggung dekat crane kuning beruap. Petugas biru membungkuk merapatkan rel | Bunting/bendera segitiga, lampu jalan, rel dan dek kayu |
| 23,2–24,0 | "end to end," | Close-up petugas, kamera menggeser | Petugas menilai (mata setengah) | Lampu jalan biru |
| 24,0–24,8 | "perfectly smooth" | **Makro** sambungan rel | — | **Kelereng kaca menggelinding** di rel mulus, kerucut oranye |
| 25,0–26,0 | "and finishes first." | Rendah sepanjang rel | Taipan memukul **paku emas** dengan palu besar | **Percikan api** saat dipukul, kerumunan pekerja kecil di belakang |
| 26,2 | "Their trains" | Dissolve | — | — |
| 26,4–27,0 | "glide" | **Dolly masuk lewat jendela gerbong** (transisi tembus jendela) | Taipan di dalam | Gerbong mewah "VANDERGOLD", lis emas |
| 27,0–28,2 | "across the canyon without a sound" | Drift sangat pelan | Taipan minum teh, mata ^^, kaki disilang | Kursi beludru merah, lampu gantung hangat, meja kecil |
| 28,4–29,0 | "while his go" | Dissolve → kereta di trestle dari samping | Wajah-wajah di jendela | Tulisan "RED CANYON SHORT LINE" |
| 29,2–31,0 | "clickety-clack over every gap." | **Push-in ke jendela** | Bos memegang kopi. Guncangan → **kopi tumpah ke kumis** (29,6–29,8), O O, tetes keringat, mulut bergelombang | Gerbong kayu merah, jendela lengkung |
| 31,2–33,4 | "Newspapers start calling it the clickety-clack line" | Dissolve → push-in pelan ke koran | Pembaca tertutup koran | Koran "The Red Mesa Herald – THE CLICKETY CLACK LINE!" dengan gambar kereta, lantai kayu, kubah kaca |
| 33,6–34,6 | "and everyone switches" | Kamera berputar, pembaca berjalan pergi | Keringat, kaget, lalu jengkel | **Koran terbang & jatuh** ke lantai, menara jam, tumpukan koper |
| 34,8–35,8 | "to the quiet trains." | Drift | Agen rival (rompi kuning) dengan papan "ALL ABOARD!", senyum puas | Antrean penumpang, **tumbleweed menggelinding** (lelucon "sepi") |
| 36,0–36,4 | "Then summer comes" | Dissolve dengan wipe beku | — | **Termometer + kalender "MAY 1880"** di peti hijau |
| 36,6–38,0 | "and something weird" | Kamera turun ke tanah lalu menemukan tokoh | Insinyur jongkok menggaruk kepala, keringat, bingung → O O | **Tulisan kapur "39FT"** di bantalan, bendera biru di tongkat |
| 38,2–40,4 | "happens. His gaps start shrinking in May." | **Makro** sambungan rel | — | **Jangka sorong mengukur celah**; warna rel bergeser **biru → ungu → magenta → pink → oranye → kuning** (visualisasi panas); celah menyempit |
| 40,8–41,8 | "You can fit a coin in them by" | Makro diam | — | **Koin diselipkan** di celah, di antara rahang jangka sorong |
| 42,0–42,4 | "July." | — | — | **Lembar kalender terbang** (Mei → Juni → Juli) |
| 42,6–43,8 | "Barely a sheet of paper" | Makro, kaki bos masuk frame | — | **Selembar kertas** diselipkan ke celah, koin tergeletak di rel |
| 44,0–45,6 | "and his boss is thrilled." | Crane naik dari rel (yang membara kuning) ke two-shot | Bos menyeringai, mengacungkan tongkat. Insinyur datar | Rel bercahaya dengan ujung gradasi magenta |
| 45,8–47,6 | "See, even your gaps know you were wrong." | Two-shot, push-in pelan | Insinyur deadpan + keringat, melirik. Bos bicara | — |
| 47,8–50,0 | "Meanwhile, on the perfect railroad," | Dissolve → **terbang rendah di atas rel** (perspektif satu titik) menuju taipan | Taipan bersantai di kursi pantai di bawah payung bergaris | Dek trestle panjang, lampu jalan, mesa |
| 50,0–51,8 | "the rails have started groaning in the afternoon sun," | Sangat rendah di samping rel | — | Kilau spekular di rel → rel memanas ungu → oranye → putih; **garis-garis tegang & percikan** di sambungan |
| 52,0–53,8 | "pushing against each other like they want to get out." | Dolly maju ke taipan | Taipan tersenyum mata ^^ → **tetes keringat** muncul | **Paku rel melompat keluar** dari bantalan, rel lurus berwarna pink |
| 54,0–54,2 | "out. On" | — | Taipan kaget O O, **topi tingginya terbang** | Meja kecil, botol |
| 54,4–56,2 | "the hottest day anyone can remember," | Dissolve → medium | Insinyur menyeringai, mata O O senang | **Uap/hawa panas naik dari rel**, rel ungu di latar depan |
| 56,4–57,6 | "his gaps finally close." | **Dolly rendah menyusuri rel yang membara** ke cakrawala | — | Rel putih-kuning panas, **berkas cahaya (god rays)** dari langit |
| 57,8–59,2 | "Rail touching rail." | Tokoh berjalan menjauh, kamera mengikuti | Mata ^^ puas | Kilau bergerak di sepanjang rel |
| 59,4–61,4 | "And halfway across the canyon, the perfect railroad" | Dissolve → **golden hour**. Terbang mendekati jembatan lengkung lalu sejajar dengan rel | — | Jembatan baja lengkung, asap cokelat, langit krem-oranye |
| 61,6–62,8 | "kicks sideways like a snake," | Menghadap kereta | — | **Rel melengkung jadi huruf S** (sun kink), percikan, serpihan bantalan |
| 63,0–64,2 | "right as a train rolls onto it." | Wide dari samping | — | Kereta **anjlok dari jembatan & jatuh** dengan jejak asap |
| 64,2–64,6 | (ledakan) | Flash putih | — | **Bola api volumetrik besar** |
| 64,6–65,1 | "it." | Medium di dek pandang | Insinyur & bos O O mulut terbuka. **Topi bowler bos terbang** | Awan jamur, percikan |

### Pola transisi yang terlihat
- **Gerak kamera sebagai transisi (dominan):** whip pan (1,8), orbit (2,4; 16,4), crane naik melewati bibir tebing (3,6), tilt vertikal cepat (8,4), terbang FPV antar lokasi (9,0–10,6), menukik ke tanah (21,2), masuk lewat jendela (26,4), push-in ke jendela (29,2).
- **Cross-dissolve singkat (±0,2–0,4 dtk)** untuk lompatan waktu/tempat: 11,6 · 13,4 · 26,2 · 28,4 · 31,2 · 36,0 · 47,8 · 54,4 · 59,4.
- `scenedetect detect-content -t 20` mencatat 34 perubahan visual (rata-rata 1 ketukan visual tiap ±1,9 dtk). Sebagian besar adalah whip/blur, bukan potongan.

### Prinsip yang bisa ditiru
1. **Satu kalimat narasi = satu aksi fisik yang terlihat** (gergaji, ukur, selip koin, kertas, kalender terbang, paku melompat).
2. **Ekspresi berganti tiap 0,2–0,6 dtk**, mengikuti kata kunci (bukan per kalimat).
3. **Kamera selalu bergerak**. Saat dialog pun ada drift/orbit pelan.
4. **Pindah lokasi = kamera terbang**, bukan potongan. Dissolve hanya untuk lompatan waktu.
5. **Kedalaman dijual dengan 3 cara:** kabut atmosfer, benda jatuh/menjauh, dan objek latar depan besar (kerikil) pada lensa lebar.
6. **Konsep abstrak divisualkan dengan warna** (rel berubah warna sesuai suhu = "false color").
7. **Payoff visual besar di akhir** (rel melengkung → kereta jatuh → ledakan → reaksi tokoh + topi terbang).
