# Riset struktur naskah iklan video (2026-10-23)

Catatan riset supaya tidak perlu diulang. Naskah final ada di chat / file naskah terpisah.

## 1. Video referensi (Pitch Trainer, 49,7 dtk, 720x1280, VO dibuat AI)

Transkrip dibaca dari teks di layar (ElevenLabs gagal: kredit 0).

| Detik | Kalimat | Fungsi |
|---|---|---|
| 0–3 | Quick. What note is this? | Hook: kuis, penonton ikut menjawab |
| 3–5 | If you had to guess, you're not alone. | Validasi: "wajar kalau salah" |
| 5–10 | Most of us learn music with our eyes. Tabs. Sheet music. | Masalah dibingkai ulang (bukan salah penonton, salah caranya) |
| 10–15 | So the ear never gets trained. Every new song means looking it up again. | Akibat masalah |
| 15–17 | Pitch Trainer fixes that. | Produk muncul (logo) |
| 17–30 | It starts simple, and builds from there. Then come intervals, with tricks you'll remember. Twinkle Twinkle opens on a perfect fifth. Then chords, progressions, and scales. | Cara kerja: tangga materi, 1 contoh konkret |
| 30–36 | Piano or guitar sounds. Sharps, flats, or solfege. Your stats track every rep. | Fitur cepat |
| 36–42 | One parent wrote: "...my 7-year-old daughter... She actually enjoys practicing with it too!" 4.7 ★, 427 ratings on the App Store. | Bukti sosial (testimoni asli + angka) |
| 42–45 | 8 minutes a day. Seriously. | Usaha kecil, hambatan rendah |
| 45–47 | Pitch Trainer. Get it on the App Store. | CTA |
| 47–50 | Oh, and that note? It was an A. | Jawaban kuis dibuka di akhir (penutup loop) |

## 2. Sumber dan apa yang bisa dipakai

- **Google/YouTube ABCD** (lebih dari 5.000 iklan TrueView, metrik Brand Lift; diulas Nielsen Neuro & Kantar; Google sendiri menyebut datanya korelasional). Attract: visual mengejutkan + framing ketat di awal, lebih dari 2 frame dalam 5 detik pertama. Brand: produk/merek dalam 5 detik pertama; maskot terbukti membantu awareness & consideration. Connect: pesan sederhana dan konkret bisa bekerja tanpa unsur emosi. Direct: CTA spesifik ("beli sekarang"), terlihat **dan** terdengar; kata "terbatas" bekerja.
  https://services.google.com/fh/files/misc/youtube_google_abcd_reference_guide_en.pdf · https://support.google.com/google-ads/answer/14783551 (angka "+30% short-term sales" dari Google/Kantar 2021 belum dicek di studi aslinya)
- **TikTok** (resmi): hook, pesan inti, CTA. Jendela hook 3–6 detik, dan hook harus terkait produk. Tunjukkan produk di layar.
  https://ads.tiktok.com/business/en-CA/blog/creative-best-practices-top-performing-ads
- **Meta/Facebook**: buat agar tetap jelas tanpa suara (teks di layar). Klaim lama Facebook: caption menambah waktu tonton rata-rata 12%. Sumbernya sekunder dan berasal dari periode 2016–2019, jadi lemah.
  https://www.smartcompany.com.au/marketing/create-convert-four-tips-optimise-mobile-content-facebook-client-partner-phil-bonanno/
- **Loewenstein 1994, information-gap theory**: rasa ingin tahu muncul dari pertanyaan spesifik yang belum terjawab dan terasa bisa dijawab. Inilah dasar hook kuis + jawaban di akhir.
  https://www.cmu.edu/dietrich/sds/docs/golman/golman_loewenstein_curiosity.pdf
- **Brod & Breitwieser 2019** (npj Science of Learning): menebak dulu sebelum tahu jawabannya menaikkan rasa ingin tahu dan ingatan atas jawabannya. Hollins dkk. 2022 membatasinya: efeknya spesifik pada jawaban itu, tidak membuat penonton lebih ingat materi lain.
  https://www.pedocs.de/volltexte/2022/25224/pdf/NPJ_2019_4_Brod_et_al_Lighting_the_wick_in_the_candle_of_learning_A.pdf · https://pearl.plymouth.ac.uk/handle/10026.1/20003
- **Eugene Schwartz, Breakthrough Advertising (1966)**: 5 tingkat kesadaran pembeli. Iklan dingin di feed menyasar orang yang belum sadar masalahnya atau baru sadar masalah, jadi masalahnya diperkenalkan dulu sebelum produk.
  https://optimizesmart.com/blog/schwartz-five-stages-of-awareness-in-marketing/
- **Kerangka praktisi iklan langsung** (Dara Denney, lewat ringkasan pihak ketiga): hook, masalah, solusi, manfaat, testimoni, CTA. Uji banyak versi hook.
  https://ugcads.beehiiv.com/p/ugc-ad-examples-97 · https://motionapp.com/blog/how-to-write-ugc-ad-scripts
- **Kahneman dkk. 1993, peak-end rule**: pengalaman diingat dari puncak dan akhirnya. Penerapannya ke iklan masih ekstrapolasi praktisi, belum diuji khusus pada iklan.
  https://business.linkedin.com/marketing-solutions/b2b-institute/b2b-research/trends/peak-end-rule
- **Cialdini, social proof**: testimoni dari orang yang mirip penonton (sesama orang tua) lebih kuat.
  https://www.nngroup.com/articles/social-proof-ux/
- **Coding tanpa komputer (unplugged)**: ada studi SD, misalnya Brackmann dkk. 2017 (hasilnya belum dibaca) dan studi 33 siswa kelas 3–4 yang rata-rata mencapai ≥82% target. Jangan dijadikan klaim angka di iklan.
  https://portalcientifico.uned.es/documentos/5ed31f832999526aa7412643 · https://pl.cs.uni-tuebingen.de/publications/leifheit2018unplugged/

## 2b. Cara menulis naskah untuk suara ElevenLabs (dokumen resmi, dicek 2026-10-23)

Sumber: https://elevenlabs.io/docs/best-practices/prompting/eleven-v3 · https://elevenlabs.io/docs/best-practices/prompting/controls · https://elevenlabs.io/docs/overview/models · https://elevenlabs.io/docs/best-practices/prompting

- Bahasa Indonesia (id) didukung Eleven v4, v3, Multilingual v2, Flash v2.5.
- **Audio tag** ditulis dalam kurung siku `[excited]`, `[whispers]`, `[laughs]` dan hanya berlaku di v3/v4. Tag boleh digabung. Tag yang menggambarkan suara ditulis jelas supaya tidak dibaca sebagai efek bunyi. Tag harus cocok dengan karakter suaranya. Petunjuk emosi kadang ikut terbaca, jadi potong saat editing.
- **Kurung kurawal `{}` tidak ada di dokumen resmi.** Jangan dipakai.
- **HURUF KAPITAL = penekanan** ("Capitalization increases emphasis"). Dokumen tidak menyebut perilakunya untuk bahasa Indonesia, jadi perlu diuji.
- **Elipsis `...`** memberi jeda dan bobot. Tanda pisah `-` atau `--` memberi jeda pendek. Tanda tanya dan seru membentuk intonasi.
- **`<break time="1.0s" />` TIDAK didukung v3/v4.** Hanya untuk model lain, maksimal 3 detik, dan terlalu banyak membuat suara tidak stabil.
- **Angka, simbol, singkatan ditulis sebagai kata** ("lima sampai sembilan", bukan "5–9"; "ha-pe", bukan "HP").
- **Stability di v3:** Creative = paling ekspresif tapi bisa ngawur; Natural = paling dekat suara asli; Robust = stabil tapi kurang menuruti tag. Untuk audio tag pakai Creative atau Natural.
- **Speed:** 0,7–1,2 (default 1,0). Nilai ekstrem menurunkan kualitas.
- Pilih suara yang gaya bawaannya sudah mirip kebutuhan (v4 disarankan untuk suara dari Voice Library).

## 3. Aturan yang dipakai untuk naskah Koder Cilik

1. Hook = kuis dari soal asli. Jawabannya baru dibuka di detik terakhir (Loewenstein, Brod, video referensi).
2. Produk dan maskot (Robo) terlihat sejak detik 0 (ABCD Brand).
3. Masalah dibingkai ulang sebelum produk muncul, karena penonton belum sadar masalahnya (Schwartz).
4. Cara kerja ditunjukkan sebagai tangga Level 1→4, masing-masing dengan 1 contoh konkret di layar (referensi, TikTok).
5. Semua harus jelas tanpa suara (Meta). Voice-over opsional.
6. Testimoni harus asli. Jangan dikarang.
7. CTA spesifik, tampil di layar dan disuarakan (ABCD Direct).
