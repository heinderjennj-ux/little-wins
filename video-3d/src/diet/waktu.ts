// Waktu video diet: semua animasi mengikuti kata VO (kata.json). Gambar diam (Still) memakai FrameCtx supaya
// komponen beranimasi tetap bisa ditampilkan di frame tertentu tanpa <Freeze>.
import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import K from "./kata.json";

export const FPS = 30;
export const KATA = K as { w: string; s: number; e: number }[];
export const fr = (i: number) => Math.round(KATA[Math.min(i, KATA.length - 1)].s * FPS);
export const DURASI_DIET = Math.ceil((KATA[KATA.length - 1].e + 3.2) * FPS);

export const FrameCtx = createContext<number | null>(null);
export const useF = () => {
  const f = useCurrentFrame();
  const paksa = useContext(FrameCtx);
  return paksa ?? f;
};

// muncul halus 0,9 → 1 dalam ±7 frame (tanpa pantulan besar), 0 sebelum kata ke-i
export const pop = (f: number, i: number, lama = 7) => {
  const x = Math.max(0, Math.min(1, (f - fr(i) + 3) / lama));
  return x === 0 ? 0 : 0.9 + 0.1 * (1 - Math.pow(1 - x, 3));
};
