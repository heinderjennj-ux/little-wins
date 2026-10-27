// Grafis penjelas (lingkaran lapar, tebakan dicoret, kalender, buku, CTA) — gaya sama: persegi membulat, garis berwarna.
import React from "react";
import { staticFile } from "remotion";
import { fr as frMulai, pop, useF } from "./waktu";

// muncul halus mengikuti kata ke-i (tanpa i = selalu tampil)
const Tampil: React.FC<{ i?: number; x: number; y: number; children: React.ReactNode }> = ({ i, x, y, children }) => {
  const f = useF();
  const s = i === undefined ? 1 : pop(f, i);
  if (!s) return null;
  return <g opacity={Math.min(1, (s - 0.9) * 14)} transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>{children}</g>;
};
// garis coret yang "ditarik" dari kiri ke kanan dalam ±8 frame sejak kata ke-i
const useTarik = (i?: number) => {
  const f = useF();
  return i === undefined ? 1 : Math.max(0, Math.min(1, (f - frMulai(i)) / 8));
};
import { MEREK, NAVY } from "./warna";

const R: React.FC<React.SVGProps<SVGRectElement> & { r?: number }> = ({ r = 18, ...p }) => <rect rx={r} ry={r} {...p} />;
const T: React.FC<{ x: number; y: number; s?: number; w?: number; c?: string; a?: "start" | "middle" | "end"; children: React.ReactNode }> = ({ x, y, s = 44, w = 800, c = NAVY, a = "middle", children }) => (
  <text x={x} y={y} textAnchor={a} fontFamily="Baloo2" fontWeight={w} fontSize={s} fill={c}>
    {children}
  </text>
);

// gelembung dialog: diletakkan TEPAT di atas kepala pembicara, ekor lancip lurus ke BAWAH menunjuk mulutnya (audit A10)
export const Gelembung: React.FC<{ x: number; y: number; w: number; teks: string[]; ekorX?: number; ekorPanjang?: number; s?: number }> = ({ x, y, w, teks, ekorX, ekorPanjang = 70, s = 46 }) => {
  const h = teks.length * s * 1.18 + 50;
  const ex = Math.min(x + w - 70, Math.max(x + 70, ekorX ?? x + w / 2));
  return (
    <g>
      <R x={x} y={y} width={w} height={h} r={40} fill="#FFFDF8" stroke={NAVY} strokeWidth={6} />
      <path d={`M${ex - 34} ${y + h - 3} L${ex} ${y + h + ekorPanjang} L${ex + 34} ${y + h - 3} Z`} fill="#FFFDF8" stroke={NAVY} strokeWidth={6} strokeLinejoin="round" />
      <rect x={ex - 30} y={y + h - 9} width={60} height={12} fill="#FFFDF8" />
      {teks.map((t, i) => (
        <T key={i} x={x + w / 2} y={y + 58 + i * s * 1.18} s={s} w={700}>
          {t}
        </T>
      ))}
    </g>
  );
};


// ikon sederhana bergaya sama (tanpa emoji, karena emoji mengilap & beda gaya)
export const Ikon: React.FC<{ n: "mangkuk" | "bulan" | "jam" | "perut" | "piring"; x: number; y: number; s?: number; c?: string }> = ({ n, x, y, s = 1, c = "#FFFDF8" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={NAVY} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
    {n === "mangkuk" && <g><path d="M-52 -6 h104 q-6 52 -52 52 q-46 0 -52 -52 Z" fill={c} /><path d="M-30 -24 q8 -14 0 -26 M0 -24 q8 -14 0 -26 M30 -24 q8 -14 0 -26" fill="none" opacity={0.0} /></g>}
    {n === "bulan" && <path d="M18 -50 a52 52 0 1 0 30 84 a42 42 0 1 1 -30 -84 Z" fill={c} />}
    {n === "jam" && <g><circle r={48} fill={c} /><path d="M0 -28 V0 L20 14" fill="none" /></g>}
    {n === "perut" && <g><circle r={48} fill={c} /><path d="M-18 -10 h0 M18 -10 h0" strokeWidth={12} /><path d="M-20 26 q20 -18 40 0" fill="none" /></g>}
    {n === "piring" && <g><ellipse rx={58} ry={40} fill={c} /><ellipse rx={32} ry={20} fill="none" /></g>}
  </g>
);

// lingkaran 4 langkah: nahan laper → kalap malam → puasa nebus → laper lagi
const LANGKAH = [
  { t: "Nahan laper", ikon: "mangkuk", warna: "#7C8CD0" },
  { t: "Kalap malam", ikon: "bulan", warna: "#E2694A" },
  { t: "Puasa nebus", ikon: "jam", warna: "#B783B8" },
  { t: "Laper lagi", ikon: "perut", warna: "#E3A13A" },
];
export const Lingkaran: React.FC<{ cx: number; cy: number; r?: number; coretLemah?: boolean; langkah?: number[]; coretDi?: number }> = ({ cx, cy, r = 280, coretLemah, langkah, coretDi }) => {
  const tarik = useTarik(coretDi);
  const f = useF();
  return (
  <g>
    {/* jalur berjalan memutar terus: garis putus-putus bergerak + titik cahaya mengelilingi lingkaran */}
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#FFFDF8" strokeWidth={22} strokeDasharray="34 26" strokeDashoffset={-f * 2.2} opacity={0.85} />
    {[0, 1].map((k) => {
      const a = (f * 1.1 + k * 180 - 90) * (Math.PI / 180);
      return <circle key={k} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={16} fill="#FFD23F" stroke={NAVY} strokeWidth={4} />;
    })}
    {LANGKAH.map((l, i) => {
      const a = (i * 90 - 90) * (Math.PI / 180);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      return (
        <Tampil key={i} i={langkah?.[i]} x={x} y={y}>
          <circle cx={x} cy={y} r={112} fill={l.warna} stroke={NAVY} strokeWidth={7} />
          <Ikon n={l.ikon as "jam"} x={x} y={y - 14} s={1.1} />
          <R x={x - 150} y={y + 70} width={300} height={66} r={33} fill="#FFFDF8" stroke={NAVY} strokeWidth={5} />
          <T x={x} y={y + 117} s={42}>
            {l.t}
          </T>
        </Tampil>
      );
    })}
    {[45, 135, 225, 315].map((d0) => {
      const d = d0 + ((f * 1.1) % 90) - 45 * 0; // panah berjalan searah jarum jam
      const a = (d - 90) * (Math.PI / 180);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      const jarak = Math.min(d % 90, 90 - (d % 90)); // jarak ke ikon terdekat (derajat)
      return <Tampil key={d0} i={langkah?.[Math.min(3, Math.round((d0 - 45) / 90) + 1)]} x={x} y={y}><path opacity={Math.max(0, Math.min(1, (jarak - 20) / 12))} d="M-26 -22 L18 0 L-26 22 Z" fill="#FFFDF8" stroke={NAVY} strokeWidth={5} strokeLinejoin="round" transform={`translate(${x} ${y}) rotate(${d})`} /></Tampil>;
    })}
    <Tampil i={langkah?.[3]} x={cx} y={cy}>
    <rect x={cx - 170} y={cy - 46} width={340} height={88} rx={44} fill={NAVY} />
    {coretLemah ? (
      <g>
        <T x={cx} y={cy + 20} s={56} c="#FFFDF8">
          "Aku lemah"
        </T>
        {tarik > 0 && <line x1={cx - 130} y1={cy} x2={cx - 130 + 260 * tarik} y2={cy} stroke="#FF6B6B" strokeWidth={14} strokeLinecap="round" />}
      </g>
    ) : (
      <T x={cx} y={cy + 20} s={54} c="#FFFDF8">
        terus muter
      </T>
    )}
    </Tampil>
  </g>
  );
};

export const Coret: React.FC<{ x: number; y: number; w: number; teks: string; jawab: string; coretDi?: number }> = ({ x, y, w, teks, jawab, coretDi }) => {
  const tarik = useTarik(coretDi);
  return (
  <g>
    <R x={x} y={y} width={w} height={130} r={34} fill="#FFFDF8" stroke={NAVY} strokeWidth={6} />
    <T x={x + 40} y={y + 82} s={50} w={700} a="start">
      {teks}
    </T>
    {tarik > 0 && <line x1={x + 34} y1={y + 66} x2={x + 34 + (w - 244) * tarik} y2={y + 66} stroke="#FF6B6B" strokeWidth={12} strokeLinecap="round" />}
    <Tampil i={coretDi} x={x + w - 105} y={y + 65}>
      <R x={x + w - 180} y={y + 28} width={150} height={74} r={37} fill="#FF6B6B" />
      <T x={x + w - 105} y={y + 80} s={46} c="#fff">
        {jawab}
      </T>
    </Tampil>
  </g>
  );
};

export const Kalender: React.FC<{ x: number; y: number; w: number; sorot?: number; label?: string }> = ({ x, y, w, sorot, label = "Menu 30 hari" }) => {
  // polos & mudah dibaca (audit A13): 6 kolom x 5 baris, angka besar, tanpa titik; baris minggu yang disorot kunyit penuh
  const k = w / 6;
  return (
    <g>
      <R x={x} y={y} width={w} height={k * 5 + 124} r={30} fill="#FFFDF8" stroke={NAVY} strokeWidth={6} />
      <R x={x} y={y} width={w} height={100} r={30} fill={MEREK.bata} />
      <rect x={x} y={y + 60} width={w} height={40} fill={MEREK.bata} />
      <T x={x + w / 2} y={y + 68} s={52} c="#fff">
        {label}
      </T>
      {Array.from({ length: 30 }).map((_, i) => {
        const cx = x + k * (i % 6) + k / 2;
        const cy = y + 112 + k * Math.floor(i / 6) + k / 2;
        const aktif = sorot !== undefined && Math.floor(i / 6) === sorot;
        return (
          <g key={i}>
            <R x={cx - k / 2 + 6} y={cy - k / 2 + 6} width={k - 12} height={k - 12} r={12} fill={aktif ? MEREK.kunyit : "#F4EEE2"} />
            <T x={cx} y={cy + k * 0.17} s={k * 0.46} c={aktif ? "#fff" : MEREK.tinta}>
              {i + 1}
            </T>
          </g>
        );
      })}
    </g>
  );
};

// HP berisi ebook (sampul ASLI) — layar penuh tanpa terpotong, bezel tipis seperti iPhone terbaru (owner 2026-10-26)
export const HPEbook: React.FC<{ x: number; y: number; w: number; rot?: number }> = ({ x, y, w, rot = 0 }) => {
  const t = w * 0.032; // bezel tipis
  const lw = w - 2 * t;
  const lh = lw / (570 / 1045); // rasio sampul → tidak ada bagian terpotong
  const h = lh + 2 * t;
  const id = `layar${Math.round(x)}${Math.round(y)}`;
  return (
    <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
      <R x={x + 12} y={y + 16} width={w} height={h} r={w * 0.15} fill="rgba(30,20,40,.25)" />
      <R x={x - 3} y={y - 3} width={w + 6} height={h + 6} r={w * 0.155} fill="#8E93A6" />
      <R x={x} y={y} width={w} height={h} r={w * 0.15} fill="#15171F" />
      <clipPath id={id}><rect x={x + t} y={y + t} width={lw} height={lh} rx={w * 0.12} /></clipPath>
      <image href={staticFile("diet/asli/sampul.png")} x={x + t} y={y + t} width={lw} height={lh} preserveAspectRatio="none" clipPath={`url(#${id})`} />
      <R x={x + w * 0.37} y={y + t + w * 0.03} width={w * 0.26} height={w * 0.075} r={w * 0.0375} fill="#0B0C12" />
      <R x={x + w + 1} y={y + h * 0.22} width={5} height={h * 0.1} r={2} fill="#6E7386" />
    </g>
  );
};

// sampul sementara (owner belum punya gambar sampul final)
export const Buku: React.FC<{ x: number; y: number; w: number; rot?: number }> = ({ x, y, w, rot = 0 }) => {
  const h = w * 1.414;
  return (
    <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
      <R x={x + 16} y={y + 18} width={w} height={h} r={18} fill="rgba(30,20,40,.25)" />
      <R x={x} y={y} width={w} height={h} r={18} fill={MEREK.kertas} stroke={MEREK.tinta} strokeWidth={6} />
      <rect x={x} y={y} width={w * 0.07} height={h} fill={MEREK.bata} />
      <R x={x + w * 0.14} y={y + h * 0.08} width={w * 0.76} height={h * 0.07} r={10} fill={MEREK.kunyit} />
      <T x={x + w * 0.52} y={y + h * 0.13} s={w * 0.07} c="#fff">
        BUGAR
      </T>
      <T x={x + w * 0.52} y={y + h * 0.3} s={w * 0.15} c={MEREK.bata}>
        Diet
      </T>
      <T x={x + w * 0.52} y={y + h * 0.43} s={w * 0.12} c={MEREK.tinta}>
        Tanpa
      </T>
      <T x={x + w * 0.52} y={y + h * 0.56} s={w * 0.13} c={MEREK.bata}>
        Tersiksa
      </T>
      <ellipse cx={x + w * 0.52} cy={y + h * 0.78} rx={w * 0.28} ry={w * 0.12} fill="#F3E6CF" stroke={MEREK.tinta} strokeWidth={4} />
      <ellipse cx={x + w * 0.45} cy={y + h * 0.765} rx={w * 0.1} ry={w * 0.06} fill="#fff" />
      <ellipse cx={x + w * 0.62} cy={y + h * 0.775} rx={w * 0.1} ry={w * 0.055} fill="#E6B54A" />
      <T x={x + w * 0.52} y={y + h * 0.93} s={w * 0.05} w={700} c={MEREK.tinta}>
        Menu 30 hari · 45 resep
      </T>
    </g>
  );
};

export const TombolCTA: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <g>
    <R x={x} y={y + 12} width={w} height={130} r={65} fill={MEREK.bataTua} />
    <R x={x} y={y} width={w} height={130} r={65} fill={MEREK.cta} stroke={MEREK.tinta} strokeWidth={6} />
    <T x={x + w / 2} y={y + 86} s={62} c={MEREK.tinta}>
      LIHAT DETAIL ↓
    </T>
  </g>
);

// rantai sebab-akibat: kotak bersambung panah
export const Rantai: React.FC<{ x: number; y: number; w: number; baris: string[]; langkah?: number[] }> = ({ x, y, w, baris, langkah }) => (
  <g>
    {baris.map((b, i) => (
      <Tampil key={i} i={langkah?.[i]} x={x + w / 2} y={y + i * 200 + 65}>
        <R x={x} y={y + i * 200} width={w} height={130} r={40} fill={i === baris.length - 1 ? MEREK.kunyit : "#FFFDF8"} stroke={NAVY} strokeWidth={6} />
        <T x={x + w / 2} y={y + i * 200 + 84} s={50}>
          {b}
        </T>
        {i < baris.length - 1 && <path d={`M${x + w / 2 - 26} ${y + i * 200 + 142} h52 l-26 46 Z`} fill="#FFFDF8" stroke={NAVY} strokeWidth={5} strokeLinejoin="round" />}
      </Tampil>
    ))}
  </g>
);

export const IkonCoret: React.FC<{ x: number; y: number; ikon: "jam" | "piring"; label: string }> = ({ x, y, ikon, label }) => (
  <g>
    <circle cx={x} cy={y} r={150} fill="#FFFDF8" stroke={NAVY} strokeWidth={7} />
    <Ikon n={ikon} x={x} y={y} s={1.9} c="#F3EAD9" />
    <line x1={x - 106} y1={y + 106} x2={x + 106} y2={y - 106} stroke="#FF6B6B" strokeWidth={22} strokeLinecap="round" />
    <R x={x - 200} y={y + 175} width={400} height={80} r={40} fill="#FFFDF8" stroke={NAVY} strokeWidth={5} />
    <T x={x} y={y + 230} s={46}>
      {label}
    </T>
  </g>
);
