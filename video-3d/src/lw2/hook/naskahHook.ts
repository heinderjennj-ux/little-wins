// Penyesuai adegan riset (salinan hook Little Wins) untuk suara v4: kunci `cari` tetap nama Indonesia, PETA = indeks kata v4.
import { interpolate } from "remotion";
import K from "../kata.json";

export const KATA = K.map((k) => ({ w: k.w, at: Math.round(k.s * 30), akhir: Math.round(k.e * 30) }));
const PETA: Record<string, number[]> = {
  hasilnya: [50], // "ones." (gulir monitor berhenti)
  kebanyakan: [51], // "Most of them"
  rendah: [55], // "low,"
  seratus: [45], // "124"
  aplikasi: [50], // akhir hitungan 124
  mengetuk: [57], // "kids" (+4 frame = ketukan pertama)
  tap: [59, 60, 61], // "tap, tap, tap"
  bintang: [64], // "star pops up"
  hadiah: [79], // "prize."
  suara: [269], // v4 tidak menyebut suara heboh: speaker tidak muncul di adegan ini
  heboh: [269],
  padahal: [89], // "Guess first" → meredup
  belum: [91], // "think"
  berpikir: [92], // "later."
};
export const cari = (w: string, ke = 0) => KATA[PETA[w][ke]];

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const kRuang = (f: number) => interpolate(f, [cari("kebanyakan").at - 4, cari("rendah").at], [0, 1], cl);
export const kAnak = (f: number) => interpolate(f, [cari("padahal").at - 2, cari("padahal").at + 12], [0, 1], cl);
