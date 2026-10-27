// Komponen gaya "storybook": tekstur kertas, mata, mulut, pipi, bintang. Semua digambar dengan SVG.
import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const W = {
  krem: "#FFF8EC",
  krem2: "#FBEBD2",
  biruMuda: "#DDEFFF",
  biru: "#2F80ED",
  biruTua: "#1F5FB8",
  kuning: "#FFC93C",
  koral: "#FF7A59",
  mint: "#3FBF8F",
  navy: "#22324A",
  merah: "#EF5B5B",
  kulit: "#EDBB94",
  kulitBayang: "#D99C74",
  rambut: "#2A1A12",
  pipi: "#F08A7A",
  garis: "#2A1A14",
  kayu: "#C98B55",
  kayuTua: "#A86E3E",
};

export const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
export const halus = Easing.bezier(0.45, 0, 0.2, 1);

// tekstur kertas: tepi bergoyang (ganti tiap 4 frame) + bintik terang/gelap di dalam bentuk
export const Paper: React.FC<{ id: string; wobble?: number }> = ({ id, wobble = 3.5 }) => {
  const f = useCurrentFrame();
  const boil = Math.floor(f / 4) % 3;
  return (
    <filter id={id} x="-3%" y="-3%" width="106%" height="106%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={boil + 1} result="warp" />
      <feDisplacementMap in="SourceGraphic" in2="warp" scale={wobble} xChannelSelector="R" yChannelSelector="G" result="wob" />
      {/* bintik tekstur kertas dihapus (owner 2026-10-25): hanya tepi yang sedikit bergoyang */}
    </filter>
  );
};

// satu lapisan svg penuh dengan tekstur kertas + parallax (k: 0.3 jauh .. 1.35 dekat)
// garis: warna garis tepi tegas di sekeliling bentuk (dipakai hanya untuk titik fokus — prinsip kontras Bruce Block)
export const Lapis: React.FC<{ id: string; zoom: number; k: number; asal?: string; children: React.ReactNode; wobble?: number; style?: React.CSSProperties; garis?: string }> = ({ id, zoom, k, asal = "50% 55%", children, wobble, style, garis }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, scale: String(1 + (zoom - 1) * k), transformOrigin: asal, ...style }}>
    <defs>
      <Paper id={id} wobble={wobble} />
      {garis && (
        <filter id={`${id}g`} x="-5%" y="-5%" width="110%" height="110%">
          <feMorphology in="SourceAlpha" operator="dilate" radius={4} result="tebal" />
          <feFlood floodColor={garis} />
          <feComposite in2="tebal" operator="in" result="tepi" />
          <feMerge>
            <feMergeNode in="tepi" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      )}
    </defs>
    <g filter={garis ? `url(#${id}g)` : undefined}>
      <g filter={`url(#${id})`}>{children}</g>
    </g>
  </svg>
);

// lapisan warna di atas latar: "color" memberi satu keluarga warna (afinitas), kabut menurunkan kontras (perspektif udara)
export const Kabut: React.FC<{ warna: string; kabut: string; kabutO: number; zoom?: number }> = ({ warna, kabut, kabutO }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: warna, mixBlendMode: "color" }} />
    <div style={{ position: "absolute", inset: 0, background: kabut, opacity: kabutO }} />
  </>
);

// mata kartun besar, 2 kilau. open 1 buka, <0.2 garis kedip. look -1..1 kiri-kanan, lookY -1..1 atas-bawah
export const Eye: React.FC<{ x: number; y: number; r: number; open?: number; look?: number; lookY?: number; iris?: string; pupil?: number; lash?: boolean; bintang?: number }> = ({
  x, y, r, open = 1, look = 0, lookY = 0, iris = "#5B3A22", pupil = 1, lash = false, bintang = 0,
}) => {
  if (open < 0.2)
    return <path d={`M${x - r} ${y} Q${x} ${y + r * 0.45} ${x + r} ${y}`} stroke={W.garis} strokeWidth={r * 0.18} fill="none" strokeLinecap="round" />;
  const ix = look * r * 0.25, iy = r * 0.05 + lookY * r * 0.25;
  return (
    <g transform={`translate(${x} ${y}) scale(1 ${open})`}>
      <ellipse cx={0} cy={0} rx={r} ry={r * 1.05} fill="#FFFDF8" />
      <circle cx={ix} cy={iy} r={r * 0.68} fill={iris} />
      <circle cx={ix} cy={iy + r * 0.07} r={r * 0.36 * pupil} fill="#1A0F0A" />
      {bintang > 0 ? (
        <path d={bintangPath(ix + r * 0.05, iy - r * 0.05, r * 0.42 * bintang, r * 0.17 * bintang)} fill="#FFF3B0" />
      ) : null}
      <circle cx={ix + r * 0.25} cy={iy - r * 0.25} r={r * 0.2} fill="#FFFFFF" />
      <circle cx={ix - r * 0.2} cy={iy + r * 0.25} r={r * 0.09} fill="#FFFFFF" />
      <path d={`M${-r * 1.05} ${-r * 0.15} Q0 ${-r * 1.35} ${r * 1.05} ${-r * 0.15}`} stroke={W.garis} strokeWidth={r * 0.16} fill="none" strokeLinecap="round" />
      {lash && <path d={`M${r * 0.95} ${-r * 0.35} L${r * 1.3} ${-r * 0.6}`} stroke={W.garis} strokeWidth={r * 0.12} strokeLinecap="round" />}
    </g>
  );
};

// mulut: t 0 tertutup (smile = senyum), 1 terbuka lebar
export const Mouth: React.FC<{ x: number; y: number; w: number; t: number; smile?: number }> = ({ x, y, w, t, smile = 0 }) =>
  t < 0.12 ? (
    <path d={`M${x - w / 2} ${y} Q${x} ${y + w * 0.25 * smile} ${x + w / 2} ${y}`} stroke="#6B2A22" strokeWidth={w * 0.14} fill="none" strokeLinecap="round" />
  ) : (
    <g>
      <ellipse cx={x} cy={y} rx={w * (0.42 - t * 0.08)} ry={w * 0.12 + t * w * 0.32} fill="#5A1D1A" />
      <ellipse cx={x} cy={y + w * 0.1 + t * w * 0.16} rx={w * 0.22} ry={w * 0.08 + t * w * 0.08} fill="#C9575A" />
    </g>
  );

export const Blush: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 0.5 }) => (
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.7} fill={W.pipi} opacity={o} />
);

export const bintangPath = (cx: number, cy: number, R: number, r: number, n = 5) => {
  let d = "";
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 ? r : R;
    d += `${i ? "L" : "M"}${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr}`;
  }
  return d + "Z";
};

// napas & kedip standar untuk makhluk hidup
export const useHidup = (geser = 0) => {
  const f = useCurrentFrame();
  const napas = Math.sin((f + geser * 13) / 14) * 3.5;
  const siklus = (f + geser * 17) % 62;
  const kedip = siklus < 3 ? [0.6, 0.1, 0.6][siklus] : 1;
  return { napas, kedip, f };
};

// muncul memantul
export const usePop = (mulaiFrame: number, damping = 10) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - mulaiFrame, fps, config: { damping, stiffness: 170 } });
};

export const lerp = (f: number, a: number, b: number, x: number, y: number, ease = halus) => interpolate(f, [a, b], [x, y], { ...cl, easing: ease });
