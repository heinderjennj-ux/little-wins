// Efek suasana beranimasi (dari bedah video acuan HN1 & video robot): hujan berlapis, bokeh, berkas cahaya, debu, genangan.
// Semua bergerak pelan (tidak alay): hujan jatuh terus, bokeh & cahaya "bernapas", debu melayang, riak genangan berulang.
import React from "react";
import { random } from "remotion";
import { useF } from "./waktu";

// hujan berlapis: jauh = tipis & pendek, dekat = tebal, panjang, sedikit
export const Hujan: React.FC<{ seed: string; jumlah?: number; dekat?: boolean; warna?: string }> = ({ seed, jumlah = 90, dekat, warna = "rgba(200,215,255,.55)" }) => {
  const f = useF();
  return (
    <g>
      {Array.from({ length: jumlah }).map((_, i) => {
        const x0 = random(`${seed}x${i}`) * 1280 - 100;
        const y0 = random(`${seed}y${i}`) * 2100;
        const cepat = dekat ? 64 : 34 + random(`${seed}v${i}`) * 14;
        const p = dekat ? 120 + random(`${seed}p${i}`) * 90 : 40 + random(`${seed}p${i}`) * 40;
        const y = ((y0 + f * cepat) % 2100) - 100;
        const x = x0 - (y + 100) * 0.22;
        return <line key={i} x1={x} y1={y} x2={x - p * 0.22} y2={y + p} stroke={warna} strokeWidth={dekat ? 5 : 2.2} strokeLinecap="round" opacity={dekat ? 0.5 : 0.8} />;
      })}
    </g>
  );
};

export const Bokeh: React.FC<{ titik: [number, number, number, string?][] }> = ({ titik }) => {
  const f = useF();
  return (
    <g>
      {titik.map(([x, y, r, c = "rgba(255,210,140,.75)"], i) => {
        const napas = 0.82 + 0.18 * Math.sin(f / (22 + i * 7) + i * 1.7);
        return (
          <g key={i} opacity={napas}>
            <circle cx={x} cy={y} r={r * 2.2} fill={c} opacity={0.25} />
            <circle cx={x} cy={y} r={r} fill={c} />
          </g>
        );
      })}
    </g>
  );
};

// berkas cahaya tegak / miring (light shaft) lewat celah pintu & jendela, kecerahannya bernapas pelan
export const Sinar: React.FC<{ x: number; y?: number; w: number; h?: number; miring?: number; warna?: string; id: string }> = ({ x: x0, y = 0, w: w0, h = 1920, miring = 0, warna = "255,214,150", id }) => {
  let w = w0;
  let x = x0;
  const f = useF();
  // berkas cahaya "bernapas": melebar-menyempit & terang-redup, sesekali berkedip halus (acuan HN1 detik 5,0–5,3)
  const lebar = 1 + 0.16 * Math.sin(f / 21) + 0.06 * Math.sin(f / 7.3);
  const kedip = 1 + 0.25 * Math.max(0, Math.sin(f / 53)) ** 12;
  w = w0 * lebar;
  x = x0 - (w - w0) / 2;
  return (
    <g opacity={Math.min(1, (0.72 + 0.2 * Math.sin(f / 17)) * kedip)}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={`rgba(${warna},.55)`} />
          <stop offset="0.7" stopColor={`rgba(${warna},.22)`} />
          <stop offset="1" stopColor={`rgba(${warna},0)`} />
        </linearGradient>
      </defs>
      <path d={`M${x} ${y} h${w} l${miring + w * 0.25} ${h} h-${w * 1.5} Z`} fill={`url(#${id})`} />
    </g>
  );
};

// debu di dalam berkas cahaya: melayang naik pelan & sedikit bergoyang
export const Debu: React.FC<{ seed: string; x: number; y: number; w: number; h: number; n?: number }> = ({ seed, x, y, w, h, n = 26 }) => {
  const f = useF();
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const dy = (random(`${seed}b${i}`) * h - f * (0.35 + random(`${seed}s${i}`) * 0.4) + h * 10) % h;
        const dx = random(`${seed}a${i}`) * w + Math.sin(f / 30 + i) * 8;
        return <circle key={i} cx={x + dx} cy={y + dy} r={2 + random(`${seed}c${i}`) * 4} fill="rgba(255,236,190,.7)" opacity={0.5 + 0.5 * Math.sin(f / 18 + i * 2)} />;
      })}
    </g>
  );
};

// genangan: tetes air jatuh terus → riak melebar & memudar (berulang, tiap tetes beda waktu)
export const Genangan: React.FC<{ x: number; y: number; w: number; warna?: string }> = ({ x, y, w, warna = "rgba(255,214,150,.55)" }) => {
  const f = useF();
  const tetes = [0, 13, 27, 41].map((t, i) => {
    const k = ((f + t) % 54) / 54;
    const ox = x + [-0.18, 0.12, -0.05, 0.22][i] * w;
    return (
      <g key={i} opacity={1 - k}>
        <ellipse cx={ox} cy={y} rx={w * 0.04 + k * w * 0.22} ry={(w * 0.04 + k * w * 0.22) * 0.18} fill="none" stroke={warna} strokeWidth={3} />
        {k < 0.15 && <line x1={ox} y1={y - 40 + k * 260} x2={ox} y2={y - 14 + k * 260} stroke={warna} strokeWidth={3} strokeLinecap="round" />}
      </g>
    );
  });
  return (
    <g>
      <ellipse cx={x} cy={y} rx={w / 2} ry={w * 0.09} fill="rgba(20,26,60,.45)" />
      <ellipse cx={x} cy={y + 6} rx={w * 0.3} ry={w * 0.03} fill="rgba(242,182,90,.18)" />
      {tetes}
    </g>
  );
};
