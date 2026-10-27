// Waktu iklan Little Wins v4 ("You're a parent"): semua animasi mengikuti kata VO Lauren (kata.json).
// FrameCtx dipinjam dari video diet supaya komponen latar diet ikut membeku di gambar diam.
import { useContext } from "react";
import { useCurrentFrame } from "remotion";
import { FrameCtx } from "../diet/waktu";
import K from "./kata.json";

export { FrameCtx };
export const FPS = 30;
export const KATA = K as { w: string; s: number; e: number }[];
export const fr = (i: number) => Math.round(KATA[Math.min(i, KATA.length - 1)].s * FPS);
export const akhirKata = (i: number) => Math.round(KATA[Math.min(i, KATA.length - 1)].e * FPS);
export const DURASI_LW2 = Math.ceil((KATA[KATA.length - 1].e + 2) * FPS);

export const useF = () => {
  const f = useCurrentFrame();
  const paksa = useContext(FrameCtx);
  return paksa ?? f;
};

// muncul halus 0,9 → 1 dalam ±7 frame, 0 sebelum kata ke-i
export const pop = (f: number, i: number, lama = 7) => {
  const x = Math.max(0, Math.min(1, (f - fr(i) + 3) / lama));
  return x === 0 ? 0 : 0.9 + 0.1 * (1 - Math.pow(1 - x, 3));
};
