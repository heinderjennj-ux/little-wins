// Penyesuai: adegan hook (RuangHook/AnakHook) memakai waktu kata ASLI dari suara (kata.json), bukan tempo kira-kira.
import { interpolate } from "remotion";
import K from "../kata.json";

const norm = (w: string) => w.replace(/[.,?!"“”…]/g, "").toLowerCase();
export const KATA = K.map((k) => ({ w: k.w, tampil: norm(k.w), at: Math.round(k.s * 30), akhir: Math.round(k.e * 30) }));
export const cari = (w: string, ke = 0) => KATA.filter((k) => norm(k.w) === w)[ke];

const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const kRuang = (f: number) => interpolate(f, [cari("kebanyakan").at - 4, cari("rendah").at], [0, 1], cl);
export const kAnak = (f: number) => interpolate(f, [cari("padahal").at - 2, cari("padahal").at + 12], [0, 1], cl);
