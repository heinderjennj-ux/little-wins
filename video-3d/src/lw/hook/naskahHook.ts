// Penyesuai hook Little Wins (suara Inggris, Lauren): adegan memakai waktu kata ASLI dari kata.json.
// Kunci `cari` tetap nama Indonesia (sama dengan hook V7) supaya kode adegan tidak berubah; PETA = indeks kata Inggris.
import { interpolate } from "remotion";
import K from "../kata.json";

export const KATA = K.map((k) => ({ w: k.w, at: Math.round(k.s * 30), akhir: Math.round(k.e * 30) }));
const PETA: Record<string, number[]> = {
  hasilnya: [12], // "The result?"
  kebanyakan: [14], // "Most of them"
  rendah: [18], // "low."
  seratus: [3], // "124"
  aplikasi: [9], // "apps" (akhir hitungan)
  mengetuk: [25], // "tap the screen"
  tap: [28, 29, 30], // "Tap, tap, tap."
  bintang: [36], // "stars"
  hadiah: [37], // "prizes"
  suara: [39], // "loud"
  heboh: [40], // "sounds."
  padahal: [41], // "But..."
  belum: [44], // "hasn't"
  berpikir: [49], // "think."
};
export const cari = (w: string, ke = 0) => KATA[PETA[w][ke]];

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const kRuang = (f: number) => interpolate(f, [cari("kebanyakan").at - 4, cari("rendah").at], [0, 1], cl);
export const kAnak = (f: number) => interpolate(f, [cari("padahal").at - 2, cari("padahal").at + 12], [0, 1], cl);
