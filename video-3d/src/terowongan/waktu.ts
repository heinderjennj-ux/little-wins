// Waktu video terowongan: semua gerak diikat ke kata VO (kata.json, VO dipercepat 1,10×), bukan detik tetap.
import { Easing, interpolate } from "remotion";
import KATA_JSON from "./kata.json";

export type Kata = { w: string; s: number; e: number };
export const KATA = KATA_JSON as Kata[];
export const FPS = 30;
export const fr = (i: number) => Math.round(KATA[Math.min(i, KATA.length - 1)].s * FPS);
export const frE = (i: number) => Math.round(KATA[Math.min(i, KATA.length - 1)].e * FPS);
export const DURASI = Math.ceil((KATA[KATA.length - 1].e + 1.6) * FPS);

const halus = Easing.inOut(Easing.cubic);
// interpolasi terjepit + easing halus
export const iv = (f: number, a: number, b: number, x: number, y: number, ease = halus) =>
  b <= a ? (f >= b ? y : x) : interpolate(f, [a, b], [x, y], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
export const keluar = Easing.out(Easing.cubic);
export const masuk = Easing.in(Easing.quad);

// muncul ala skill: skala 0,9→1 + opasitas dalam ±7 frame
export const munculS = (f: number, t: number) => iv(f, t, t + 7, 0.9, 1, keluar);
export const munculO = (f: number, t: number) => iv(f, t, t + 6, 0, 1);

// kamera: daftar kunci [frame, cx, cy, skala] → transform SVG (titik cx,cy ke tengah layar)
export type Kunci = [number, number, number, number];
export const kamera = (f: number, kunci: Kunci[]) => {
  const k = [...kunci].sort((a, b) => a[0] - b[0]);
  let cx = k[0][1], cy = k[0][2], s = k[0][3];
  for (let i = 0; i < k.length - 1; i++) {
    const [a, x1, y1, s1] = k[i];
    const [b, x2, y2, s2] = k[i + 1];
    if (f >= a) {
      cx = iv(f, a, b, x1, x2);
      cy = iv(f, a, b, y1, y2);
      s = iv(f, a, b, s1, s2);
    }
  }
  if (f >= k[k.length - 1][0]) [, cx, cy, s] = k[k.length - 1];
  return { cx, cy, s };
};
// getar meluruh mulai frame t (kaget/benturan)
export const getar = (f: number, t: number, amp = 12, lama = 18) => {
  if (f < t || f > t + lama) return { x: 0, y: 0 };
  const m = amp * Math.exp(-(f - t) / (lama / 3));
  return { x: m * Math.sin(f * 2.9), y: m * Math.cos(f * 3.7) };
};
