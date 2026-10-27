# Suara, musik, SFX

## VO ElevenLabs
- Koneksi: `elevenlabs-hosted` (akun baru). `claude_ai_elevenlabs_FULL` = akun lama, kredit hampir habis. Flow lama bisa hilang saat ganti akun → buat flow baru & unggah ulang acuan.
- Suara narator: **Kennisa** `c470sxKWDq6tA74TL3yB`, model `eleven_v4`. Konfirmasi id lewat `creative_list_voices` bila ragu.
- Biasanya owner merekam/generate sendiri VO penuh; saya generate hanya potongan ganti (mis. bagian yang terdengar berbisik), lalu sambung ke vo.wav (simpan cadangan `vo-sebelum-*.wav`) dan selaraskan ulang kata.json.
- Tag: `[curious] [serious] [excited] [thoughtful] [honest] [calm] [tired] [surprised] [warm] [gentle]`. DILARANG: `[whispers] [quiet] [softly] [soft] [hushed]`.
- Dokumen resmi (eleven v3/v4): tag di kurung siku; `{}` tidak didukung; HURUF KAPITAL = penekanan; `...` jeda; `<break>` tidak didukung v3/v4; angka/singkatan ditulis kata (HAPE); stability Natural/Creative untuk tag; speed 0,7–1,2. https://elevenlabs.io/docs/best-practices/prompting/eleven-v3
- Transkripsi Scribe mahal (±330 kredit/menit) → pakai `scripts/kata.py` lokal.

- Shorts US terowongan (2026-10-27): narator **Alex – Upbeat, Energetic and Clear** (v4); hook & sisa dibuat terpisah lalu disambung (jeda 0,3 dtk); owner minta VO dipercepat **1,10×** (`atempo=1.10`, nada tetap) sebelum kata.py. Kalimat janji hook ("So HERE'S how you get the money!") = paragraf sendiri + tag sendiri `[confident] [excited]`, kalau tidak suaranya lesu.

## SFX cadangan tanpa kredit (2026-10-27)
Kalau ElevenLabs habis kredit/terputus: sintesis dengan ffmpeg lavfi (anoisesrc brown/pink + lowpass/bandpass/tremolo, sine/aevalsrc), normalkan `loudnorm=I=-20`. Contoh di video-3d/public/terowongan/sfx: bor (brown noise lowpass 500 + sine 62 Hz, tremolo 16), air (pink bandpass 1,5 kHz), klunk (sine 130 Hz meluruh + klik), dentang (3 sinus inharmonik meluruh), hitung (klik 2,6 kHz tiap 62 ms), jangkrik, laser (sweep), dengung krisis (brown lowpass 160 + sine 55). Ganti dengan ElevenLabs bila tersedia.

## Musik
- Musik latar "Happy Learning Time" / `public/v7/musik.mp3`, volume 0,16 di Remotion.
- Preferensi owner (iklan pendek): musik ±9 dB di bawah narator, tanpa ducking; total ±−13 LUFS, true peak −1,5 dB. Jelaskan ke owner dengan arah ("di bawah suara narator"), bukan angka dB.

## SFX (`video-3d/public/sfx/`)
| File | Kapan |
|---|---|
| `tek.wav` | HANYA saat Robo melangkah (bukan saat panah ditaruh) |
| `pop.wav` | benda muncul (batu, baterai, ikon) |
| `bonk.wav` | Robo menabrak batu |
| `ding-kc.wav` | jawaban benar di soal |
| `benar-robo.wav`, `selesai-robo.wav` | suara aplikasi Robocoder; momen "heboh" |
| `sorak.wav` | kemenangan besar (klimaks) |
| `page-turn.wav` | ganti halaman/kertas |
| `whoosh.wav`, `mouse-click.wav` | jarang, hati-hati alay |
Aturan: satu bunyi per aksi; jangan menumpuk bunyi berturut-turut (owner: di hook HP cukup satu "ting" di ketukan soal pertama). SFX pendek perlu energi yang cukup agar terdengar di atas narator.

## Musik cerita emosional 3 babak (riset 2026-10-26, video diet V3)
- **Michael Giacchino, "Married Life" (Up, Pixar)**: satu tema sederhana (ala kotak musik/lagu nina bobo, permintaan sutradara Pete Docter) dipakai di seluruh montase; tiap tahap hubungan = variasi tema yang sama; menahan diri, tidak melodramatis. https://en.wikipedia.org/wiki/Up_opening_sequence · https://faroutmagazine.co.uk/up-sound-of-heartbreak/
- **Knoferle dkk. 2012**: ada interaksi tempo × mode; musik minor lambat lebih efektif dari minor cepat (konteks toko). **Bruner 1990** (*J. Marketing* 54(4)) = ulasan: tempo, nada, tekstur memicu emosi berbeda (detail angka belum dicek di naskah asli).
- **ElevenLabs Music (dok. resmi)**: tulis "instrumental only"; sebut BPM & kunci (model mematuhinya); ceritakan bagian berurutan ("start with just…, then…, bring in…"); kata "just" mencegah model mengisi kekosongan; panjang dalam detik. https://elevenlabs.io/docs/overview/capabilities/music/best-practices
Penerapan: 3 cue (satu per babak) dengan SATU motif yang sama, kunci saling berkerabat (D minor → F mayor), ±55–60 dtk tiap cue supaya bisa crossfade; musik di bawah VO harus jarang (ruang untuk suara); momen kunci (mis. "MINYAKNYA") dibuat hening/berhenti saat editing, bukan dari prompt.

## Pelajaran teknis video diet (2026-10-26)
- SFX ElevenLabs (`eleven_text_to_sound_v2`): tulisan "10 seconds" di prompt DIABAIKAN (hasil ±1 dtk). Set parameter `duration_seconds` (0,5–30) dan `loop: true` untuk suasana (hujan) lewat `creative_update_node` → `creative_run_flow_nodes`.
- Normalisasi dulu semua audio (ffmpeg loudnorm): VO −16 LUFS, musik −16, SFX −20; baru atur volume di Remotion (musik ±0,28 = ±11 dB di bawah narator).
- Transisi musik antar babak = pre-lap: lagu berikutnya mulai ±3 dtk sebelum pergantian adegan dengan intro tipisnya, lagu sebelumnya turun ±4–5 dtk (kurva equal-power `sin`), bukan potong/padam tiba-tiba. Musik diturunkan ±60% sesaat di kalimat kunci.
- Mengganti satu kata di VO: generate ulang kalimatnya (Kennisa, eleven_v4), potong hening, samakan volume (volumedetect), sambung dengan jeda 0,08–0,12 dtk, lalu jalankan ulang kata.py + sejajar.py. "e-book" diucapkan TTS sebagai "ibuk" (benar untuk lidah Indonesia).
- Komposisi animasi acuan: `video-3d/src/diet/Prototipe.tsx` → `AnimasiDiet` (Studio: "Diet-Animasi"); waktu = indeks kata; `waktu.ts` FrameCtx supaya Still tetap bisa menampilkan animasi.
- Remotion: JANGAN pakai `loop` + `volume={(x)=>…}` untuk fade — x kembali ke 0 tiap ulangan, suara muncul lagi (hujan terdengar setelah hook). Sambung file jadi panjang (ffmpeg -stream_loop) + bungkus <Sequence durationInFrames> supaya berhenti tegas.

## Volume VO harus rata antar kalimat (aturan owner 2026-10-27)
Tag emosi ElevenLabs ([serious], [calm], [curious], [excited]) membuat keras suara antar kalimat beda sampai ±16 dB → penonton harus menaikkan volume di tengah video. Nada boleh berubah, **keras suara tidak**. Setelah transkrip (kata.json), jalankan `py scripts/ratakan_vo.py vo-asli.mp3 kata.json vo.wav` → gain per kalimat ke median (ramp 40 ms), kompresor ringan, loudnorm −15. Target: rentang antar kalimat ≤ ~5 dB (Variasi 8: 15,8 → 4,5 dB; LRA 4,7 → 1,6 LU).
**Kelompok volume SFX (owner, Shorts kapal selam 2026-10-27: "tentukan besarnya, lalu terapkan; jangan semua standar"):** normalkan tiap berkas dulu (loudnorm −18 LUFS; kelompok BESAR −13), lalu level kelompok di kode: BESAR 1 (puncak: ledakan/remuk/keluar air/emergency) · SEDANG 0,85 (aksi utama) · KECIL 0,55 (aksen: gelembung, centang, kilau, jam) · SUASANA 0,22 (ombak+camar di permukaan, dengung bawah laut, ±150 dtk disambung crossfade). Satu bunyi "turun"/"naik" dipakai ulang untuk semua gerak turun/naik. SFX jangan terlalu pendek (minta 3–4 dtk ke ElevenLabs) supaya tidak terdengar seperti dipercepat.
**Bunyi "radio ganti saluran" (owner, Shorts kapal selam 2026-10-27):** penyebabnya loudnorm mode DINAMIS — tiap jeda gain dinaikkan, desis rekaman ikut mengembang (jeda hanya 8 dB di bawah suara). Skrip sekarang: jeda antar kata diredam 14 dB, afftdn ringan, loudnorm dua langkah `linear=true` → jeda 19 dB di bawah suara. Cek: bandingkan RMS jeda (dari kata.json) vs RMS total sebelum/sesudah. Kalau file bersih tapi masih kresek di localhost = pratinjau Studio tersendat (frame berat), bukan audionya.
