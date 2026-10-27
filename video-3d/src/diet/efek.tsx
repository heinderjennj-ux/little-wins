// Overlay & efek cerita (katalog: skill references/efek-kamera.md). Intensitas mengikuti Bruce Block:
// hook menarik → setelahnya tenang → PUNCAK di tengah (momen "MINYAKNYA") → hangat & lega → produk.
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { fr, useF } from "./waktu";

const antara = (f: number, a: number, b: number) => f >= a && f <= b;

// O1 vinyet berdenyut seperti detak jantung (dag-dug, jeda)
export const VinyetDenyut: React.FC<{ dari: number; sampai: number }> = ({ dari, sampai }) => {
  const f = useF();
  const a = fr(dari), b = fr(sampai);
  if (!antara(f, a - 10, b + 10)) return null;
  const masuk = Math.min(1, (f - a + 10) / 20) * Math.min(1, (b + 10 - f) / 20);
  const t = (f - a) % 30;
  const detak = Math.exp(-((t - 2) ** 2) / 6) + 0.7 * Math.exp(-((t - 9) ** 2) / 6);
  const o = masuk * (0.35 + 0.4 * detak);
  return <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(0,0,0,0) 45%, rgba(10,6,30,${o}) 100%)` }} />;
};

// O2 kilat putih singkat (impact frame)
export const Kilat: React.FC<{ di: number }> = ({ di }) => {
  const f = useF();
  const d = f - fr(di);
  if (d < 0 || d > 14) return null;
  return <AbsoluteFill style={{ background: "#FFF8E8", opacity: 0.7 * Math.exp(-d / 3.5) }} />;
};

// O3 garis kecepatan radial (anime) — tipis & singkat, untuk kaget
export const GarisKecepatan: React.FC<{ di: number; cx?: number; cy?: number }> = ({ di, cx = 540, cy = 900 }) => {
  const f = useF();
  const d = f - fr(di);
  if (d < 0 || d > 18) return null;
  const o = Math.min(1, d / 3) * (1 - d / 18);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: o * 0.8 }}>
      {Array.from({ length: 46 }).map((_, i) => {
        const a = (i / 46) * Math.PI * 2 + random(`gk${i}`) * 0.08;
        const r0 = 430 + random(`gr${i}`) * 220 + d * 6;
        return <line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * 1500} y2={cy + Math.sin(a) * 1500} stroke="#FFFDF8" strokeWidth={3 + random(`gw${i}`) * 7} strokeLinecap="round" opacity={0.75} />;
      })}
    </svg>
  );
};

// O4 cahaya hangat menyapu diagonal (lega/bahagia)
export const SapuanCahaya: React.FC<{ di: number; lama?: number }> = ({ di, lama = 46 }) => {
  const f = useF();
  const d = f - fr(di);
  if (d < 0 || d > lama + 30) return null;
  const k = Math.min(1, d / lama);
  const pos = -40 + 180 * (1 - Math.pow(1 - k, 2));
  const hangat = Math.min(1, d / 15) * Math.max(0, 1 - (d - lama) / 30);
  return (
    <>
      <AbsoluteFill style={{ background: `linear-gradient(115deg, rgba(255,220,150,0) ${pos - 18}%, rgba(255,226,170,.42) ${pos}%, rgba(255,220,150,0) ${pos + 18}%)`, mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "rgba(255,190,110,.10)", opacity: hangat, mixBlendMode: "screen" }} />
    </>
  );
};

// O7 tepi buram & kebiruan saat menangis (mata berkaca)
export const TepiBuram: React.FC<{ dari: number; sampai: number }> = ({ dari, sampai }) => {
  const f = useF();
  const a = fr(dari), b = fr(sampai);
  if (!antara(f, a, b)) return null;
  const k = Math.min(1, (f - a) / 24) * Math.min(1, (b - f) / 18);
  const napas = 0.85 + 0.15 * Math.sin(f / 13);
  return (
    <>
      <AbsoluteFill style={{ backdropFilter: `blur(${7 * k * napas}px)`, WebkitMaskImage: "radial-gradient(ellipse 52% 46% at 55% 50%, transparent 55%, black 100%)", maskImage: "radial-gradient(ellipse 52% 46% at 55% 50%, transparent 55%, black 100%)" }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 50% at 55% 50%, rgba(0,0,0,0) 55%, rgba(40,60,140,${0.3 * k}) 100%)` }} />
    </>
  );
};

// O8 kilau produk: bintang 4 sudut berkelip di sekitar benda (koordinat panggung SVG)
export const Kilau: React.FC<{ dari: number; titik: [number, number, number][] }> = ({ dari, titik }) => {
  const f = useF();
  const d = f - fr(dari);
  if (d < 0) return null;
  return (
    <g>
      {titik.map(([x, y, r], i) => {
        const k = Math.max(0, Math.sin((d - i * 7) / 9));
        if (k <= 0.02) return null;
        const s = r * k;
        return <path key={i} d={`M${x} ${y - s} Q${x} ${y} ${x + s} ${y} Q${x} ${y} ${x} ${y + s} Q${x} ${y} ${x - s} ${y} Q${x} ${y} ${x} ${y - s} Z`} fill="#FFF6D8" opacity={0.95} stroke="#FFD23F" strokeWidth={2} />;
      })}
    </g>
  );
};
