# Remotion: struktur, komponen, render

## Daftar isi
1. Proyek & Studio
2. Peta file acuan (Variasi 7)
3. Struktur adegan
4. Komponen yang bisa dipakai ulang
5. Render penuh & pratinjau
6. Tambal sebagian (revisi kecil)
7. Error yang pernah terjadi

## 1. Proyek & Studio
- Proyek: `D:/PythonProjects/video-3d` (Remotion 4.0.538, entry `src/index.ts`, root `src/Root.tsx`).
- Studio: `npx remotion studio --port 3000 --no-open` (jalankan di latar; jangan jalankan dua kali).
- Skill Remotion resmi tersedia: `remotion:remotion-best-practices` (baca untuk API).
- Komposisi didaftarkan di folder Studio per variasi (mis. "V7-Prototipe-Triad": V7-Animatic, P01–P31, V7-Animasi).

## 2. Peta file acuan `src/v7/`
| File | Isi |
|---|---|
| `Prototipe.tsx` | `AnimasiV7` (video final), `PrototipeV7` (animatic), `GambarAdegan` (still per P), `Judul`, `Subtitle` karaoke, `Catatan` (nomor P + sumber) |
| `adegan.tsx` | `ADEGAN[]`, `fr(i)` (frame kata ke-i), `pop`, `Panggung` (latar buram + fokus bergaris + cahaya + vinyet) |
| `aset.tsx` | `Pose` (karakter AI + napas + kedip + `tukar`), `IklanHP`, `LampuBelajar`, `Halaman`, `Kantor`, `Robo`, `Batu`, `Baterai`, `Jari` |
| `soal.tsx` | `KartuSoal`: kartu soal gaya worksheet (bar oranye, kotak panah, grid A–E/1–5), benda muncul satu-satu, Robo melompat dengan jejak titik oranye, menabrak batu, jejak jari, hapus panah |
| `aplikasi.tsx` | `APPS` (16 aplikasi bernama + glyph), `AppIcon` |
| `alat.tsx` | `tema()`, latar ruang, meja, HP, bintang, gelembung bicara, label, lembar PR, produk |
| `hook/` | adegan hook (peneliti di balik meja, HP dari atas dengan jari asli), waktu via `naskahHook.ts` (`cari(kata, ke)`) |
| `kata.json`, `mata.json`, `pose-ukuran.json` | data waktu kata, mata, ukuran pose |
| `../gaya/tema.ts`, `../storybook/kit.tsx` | palet, `campur`, `Lapis` (lapisan parallax + wobble) |
Video baru: salin `src/v7` → `src/v<N>`, ganti data & adegan; jangan ubah v7 (acuan).

## 3. Struktur adegan
```ts
type Adegan = {
  mulai: number;                    // indeks kata di kata.json saat adegan mulai
  nama: string;                     // label prototipe
  intens?: boolean;                 // pakai palet intens
  judul: [teks, indeksKata, sorot?][]; // sorot: "biru"→kuning, "merah", "koral"
  isi: (f: number) => ReactNode;    // gambar adegan pada frame absolut f
  sumber?: boolean;                 // tampilkan sumber riset kecil
  sfx?: [frame, namaFile, volume][];
  hook?: boolean;
};
```
Semua waktu = `fr(indeksKata)`, bukan detik tetap, supaya mengikuti suara. Adegan lanjutan (tempat sama) tanpa crossfade.

## 4. Pola komponen
- Karakter: `<Pose n="bunda-p2" x={540} bawah={1420} tinggi={760} tukar={fr(12)} />`.
- Benda muncul: `<Pop f={f} i={indeks} x y>…</Pop>`.
- Layer depan (mis. meja) digambar SETELAH karakter kalau karakter harus di belakang.
- Kartu soal: definisikan `robo`, `batu`, `baterai`, dan jadwal panah/jalan dari indeks kata.
- Gambar asli di `public/` dipanggil via `staticFile()`; tambahkan `?v=N` kalau gambar diganti (cache).

## 5. Render & pratinjau
- Render saat Studio menyala wajib port lain:
  `npx remotion render src/index.ts V7-Animasi out/koder-cilik-v7.mp4 --port=3157`
  (±30 menit di laptop owner, 232 dtk).
- Still untuk cek: `npx remotion still src/index.ts P05 out/p05.png --port=3157` atau `--frame=N`.
- Pratinjau ringan untuk owner: render setengah resolusi (`--scale=0.5`) → `out/v7-pratinjau.mp4`, buka `out/index.html` via `py -m http.server 8766` dari `out/`.
- Cek loudness hasil: `ffmpeg -i x.mp4 -af loudnorm=print_format=summary -f null -` (target ±−13 LUFS).

## 6. Tambal sebagian (revisi kecil) — wajib untuk revisi kecil
1. Tentukan rentang frame yang berubah saja (A–B).
2. `npx remotion render src/index.ts V7-Animasi out/tambal.mp4 --frames=A-B --port=3157`
3. Sambung video (re-encode stream video) dan salin audio lama. Ganti `A` dan `B+1` dengan angka frame sebenarnya:
```
ffmpeg -i lama.mp4 -i tambal.mp4 -filter_complex "[0:v]trim=end_frame=A,setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[0:v]trim=start_frame=B+1,setpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=1[v]" -map "[v]" -map 0:a -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a copy baru.mp4
```
4. Cek sambungan: nilai di kedua sisi harus sama (mis. penghitung skor tidak boleh melompat). Jika audio berubah (SFX), mix ulang audio saja dan mux.

## 7. Error yang pernah terjadi
- `Cannot find module` saat render → beri entry `src/index.ts` eksplisit.
- Port bentrok → `--port=3157`.
- `interpolate` dengan Infinity/undefined (indeks berikutnya tidak ada) → beri penjaga.
- Indeks negatif di array (frame sebelum adegan mulai) → `Math.max(0, f)`.
- `<Freeze>` tidak bekerja di still → pakai prop `beku`.
- Studio crash karena error kompilasi sesaat → restart Studio.

## 8. Prototipe still banyak sekaligus (2026-10-26)
- `node scripts/render_stills.mjs <awalan id> <folder> [id1,id2]` (di `video-3d/scripts/`): satu kali bundle, semua Still dirender (30 still ±beberapa menit).
- Acuan prototipe latar-kode: `video-3d/src/diet/` (warna.ts palet per suasana, latar.tsx benda ruangan, grafis.tsx kartu/lingkaran/kalender/CTA, Prototipe.tsx adegan). Folder Studio "Diet-V3-Prototipe" (D01–D30).
- Tokoh tanpa benda di depan: `bawah` ≥ 1990 supaya garis potong gambar tidak terlihat; kalau ada meja/konter depan, tokoh boleh berhenti di belakangnya.
- Jangan pakai emoji untuk ikon (gaya mengilap, beda dengan gambar); gambar ikon sederhana dengan SVG.
- Teks putih di tengah grafis: beri pil gelap di belakangnya, karena latar bisa terang.
- Subtitle maks ±32 karakter per baris (lebih panjang terpotong).
- **Jangan taruh `?v=N` DI DALAM `staticFile()`** (Remotion 4 meng-encode "?" → `%3Fv%3D`, file 404, audio/gambar hening tanpa error). Benar: `` `${staticFile("x.wav")}?v=3` ``. Cek: `curl localhost:3000/x.wav?v=3` harus 200. (2026-10-27, musik Shorts terowongan sempat bisu.)
