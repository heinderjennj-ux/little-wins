// Kartu soal ala video Koder Cilik sebelumnya (video-hook): kertas putih bergaris oranye, deret kotak panah di atas papan,
// papan A–E × 1–5, batu & baterai & Robo muncul satu per satu, panah dimasukkan satu per satu, Robo melompat per kotak
// dengan jejak titik oranye. Semua digerakkan oleh frame (f = frame absolut).
import React from "react";
import { Easing, interpolate, staticFile } from "remotion";
import { W } from "../storybook/kit";

export type Sel = [number, number];
export type Arah = "kanan" | "kiri" | "atas" | "bawah";
const GERAK: Record<Arah, Sel> = { kanan: [1, 0], kiri: [-1, 0], atas: [0, -1], bawah: [0, 1] };
const SUDUT: Record<Arah, number> = { atas: 0, kanan: 90, bawah: 180, kiri: 270 };
const GELAP = "#3b3b4f";
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// muncul: sedikit memantul (seperti video sebelumnya), 0 sebelum mulai
const muncul = (f: number, mulai: number, lama = 8) => {
  const x = interpolate(f, [mulai, mulai + lama], [0, 1], cl);
  if (x === 0) return 0;
  const c = 1.3;
  return 0.4 + 0.6 * (1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2));
};

const Batu: React.FC<{ s: number }> = ({ s }) => (
  <g transform={`scale(${s})`}>
    <polygon points="-17,12 -13,-6 -3,-14 9,-11 17,2 14,12" fill="#B8BBC6" stroke={GELAP} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-6,-4 l5,3 M4,3 l5,-2" stroke="#8c8fa0" strokeWidth={2} strokeLinecap="round" />
  </g>
);
const Baterai: React.FC<{ s: number }> = ({ s }) => (
  <g transform={`scale(${s})`}>
    <rect x={-9} y={-13} width={18} height={26} rx={4} fill="#5BBE76" stroke={GELAP} strokeWidth={3.5} />
    <rect x={-4} y={-17} width={8} height={5} rx={1.5} fill={GELAP} />
    <polygon points="2,-8 -5,2 -1,2 -2,9 5,-1 1,-1" fill="#fff" />
  </g>
);
const Panah: React.FC<{ arah: Arah; ukuran: number; warna?: string }> = ({ arah, ukuran, warna = "#2f2f45" }) => (
  <g transform={`scale(${ukuran / 56}) rotate(${SUDUT[arah]})`}>
    <path d="M0,-22 L0,22 M-14,-8 L0,-22 L14,-8" fill="none" stroke={warna} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

export type JadwalSoal = {
  kartu?: number; // frame kartu muncul (kosongkan = sudah ada)
  robo?: number;
  batu?: number[]; // frame muncul tiap batu
  baterai?: number;
  panah?: { arah: Arah; f: number; hapus?: number; salah?: boolean }[]; // kotak panah di atas papan
  lompat?: number[]; // frame mulai tiap lompatan Robo (mengikuti panah yang tidak dihapus, berurutan)
  jari?: { jalur: Sel[]; f: number[] }; // jari menelusuri kotak (tanpa Robo bergerak)
};

export const KartuSoal: React.FC<{ f: number; x: number; y: number; s: number; robo: Sel; batu: Sel[]; baterai: Sel; j: JadwalSoal; kodeLabel?: boolean }> = ({ f, x, y, s, robo, batu, baterai, j }) => {
  const cs = 120, ML = 56, MT = 186, W5 = 5 * cs;
  const lebar = ML + W5 + 40, tinggi = MT + W5 + 36;
  const pos = (c: number, r: number) => [ML + c * cs + cs / 2, MT + r * cs + cs / 2];
  const kartu = j.kartu === undefined ? 1 : muncul(f, j.kartu, 9);
  if (kartu === 0) return null;

  // jalur Robo dari panah yang berlaku (yang belum dihapus)
  const urut = (j.panah ?? []).filter((p) => !(p.hapus !== undefined));
  const jalur: Sel[] = [robo];
  for (const p of urut) {
    const a = jalur[jalur.length - 1];
    jalur.push([a[0] + GERAK[p.arah][0], a[1] + GERAK[p.arah][1]]);
  }
  // posisi Robo
  const DUR = 8;
  let rx = pos(...robo)[0], ry = pos(...robo)[1], angkat = 0, sq = 1, jarak = 0, langkahKe = -1, nabrak = false;
  (j.lompat ?? []).forEach((t, i) => {
    const k = interpolate(f, [t, t + DUR], [0, 1], cl);
    if (k <= 0 || i + 1 >= jalur.length) return;
    const [ax, ay] = pos(...jalur[i]), [bx, by] = pos(...jalur[i + 1]);
    const keBatu = batu.some(([c, r]) => c === jalur[i + 1][0] && r === jalur[i + 1][1]);
    const e = Easing.inOut(Easing.cubic)(k);
    const maju = keBatu ? Math.sin(Math.PI * Math.min(1, k * 1.2)) * 0.38 : e; // ke batu: maju sedikit lalu terpental balik
    rx = ax + (bx - ax) * maju;
    ry = ay + (by - ay) * maju;
    angkat = Math.sin(Math.PI * k) * cs * (keBatu ? 0.12 : 0.26);
    if (!keBatu) jarak += Math.hypot(bx - ax, by - ay) * e;
    const darat = interpolate(f, [t + DUR, t + DUR + 4], [0, 1], cl);
    sq = k >= 1 ? 1 - 0.08 * Math.sin(Math.PI * darat) : 1;
    langkahKe = i;
    if (keBatu && k > 0.3) nabrak = true;
  });
  // jejak titik oranye sepanjang jarak tempuh
  const titik: React.ReactNode[] = [];
  let d = 0;
  for (let i = 1; i < jalur.length; i++) {
    const [ax, ay] = pos(...jalur[i - 1]), [bx, by] = pos(...jalur[i]), L = Math.hypot(bx - ax, by - ay);
    for (let t = 30; t < L + 1; t += 30) if (d + t <= jarak + 4) titik.push(<circle key={`${i}-${t}`} cx={ax + ((bx - ax) * t) / L} cy={ay + ((by - ay) * t) / L} r={7} fill="#F28C38" opacity={0.9} />);
    d += L;
  }
  // jari menelusuri
  let jari: React.ReactNode = null;
  if (j.jari && f >= j.jari.f[0] - 6) {
    let k = 0;
    j.jari.f.forEach((t, i) => { if (f >= t) k = i; });
    const tNext = j.jari.f[k + 1];
    const geser = tNext === undefined ? 0 : interpolate(f, [tNext - 8, tNext], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
    const a = j.jari.jalur[k], b = j.jari.jalur[Math.min(k + 1, j.jari.jalur.length - 1)];
    const [ax, ay] = pos(...a), [bx, by] = pos(...b);
    const jx = ax + (bx - ax) * geser, jy = ay + (by - ay) * geser;
    const jejakJari = j.jari.jalur.slice(0, k + 1).map((c) => pos(...c));
    jari = (
      <g>
        {jejakJari.length > 1 && <path d={"M" + jejakJari.map((p) => p.join(" ")).join(" L")} stroke="#F28C38" strokeWidth={8} strokeDasharray="2 20" strokeLinecap="round" fill="none" opacity={0.9} />}
        <image href={staticFile("v7/asli/jari.png")} x={jx - 217 * 0.4} y={jy - 790 * 0.4 + 10} width={641 * 0.4} height={829 * 0.4} />
      </g>
    );
  }
  // deret kotak panah
  const tampil = (j.panah ?? []).filter((p) => f >= p.f - 1);
  const n = Math.max(4, (j.panah ?? []).filter((p) => p.hapus === undefined).length);
  const kotak = Math.min(92, (W5 - 20) / n - 12), jarakK = kotak + 12;
  const x0 = ML + (W5 - (n * jarakK - 12)) / 2;
  let slot = 0;
  const robSkala = cs * 0.92 / 451;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * kartu}) translate(${-lebar / 2} ${-tinggi / 2})`}>
      <rect x={0} y={0} width={lebar} height={tinggi} rx={26} fill="#FFFFFF" />
      <rect x={0} y={0} width={lebar} height={16} rx={8} fill="#F28C38" />
      <rect x={0} y={8} width={lebar} height={10} fill="#F28C38" />
      {/* deret panah */}
      {tampil.map((p, i) => {
        const hilang = p.hapus !== undefined ? interpolate(f, [p.hapus, p.hapus + 8], [1, 0], cl) : 1;
        if (hilang <= 0) return null;
        const ini = p.hapus === undefined ? slot++ : slot;
        const px = x0 + ini * jarakK + kotak / 2, py = 100;
        const m = muncul(f, p.f, 7) * hilang;
        const jalan = p.hapus === undefined && langkahKe === (j.panah ?? []).filter((q) => q.hapus === undefined).indexOf(p) && f < (j.lompat?.[langkahKe] ?? 0) + DUR + 6;
        return (
          <g key={i} transform={`translate(${px} ${py}) scale(${m})`} opacity={hilang}>
            <rect x={-kotak / 2} y={-kotak / 2} width={kotak} height={kotak} rx={14} fill={jalan ? "#FFF1E3" : "#F3F8FF"} stroke={p.salah ? W.merah : jalan ? "#F28C38" : "#8FB8EA"} strokeWidth={5} />
            <Panah arah={p.arah} ukuran={kotak * 0.62} warna={p.salah ? W.merah : "#2f2f45"} />
          </g>
        );
      })}
      {(j.panah ?? []).length === 0 && <text x={lebar / 2} y={110} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={30} fill="#9A9CB0">Robot code: ☐ ☐ ☐ ☐</text>}
      {/* papan */}
      {["A", "B", "C", "D", "E"].map((h, i) => <text key={h} x={ML + i * cs + cs / 2} y={MT - 14} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={34} fill="#5d5d75">{h}</text>)}
      {[1, 2, 3, 4, 5].map((h, i) => <text key={h} x={24} y={MT + i * cs + cs / 2 + 12} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={34} fill="#5d5d75">{h}</text>)}
      <rect x={pos(...robo)[0] - cs / 2} y={pos(...robo)[1] - cs / 2} width={cs} height={cs} fill="#CDEFD8" />
      <rect x={pos(...baterai)[0] - cs / 2} y={pos(...baterai)[1] - cs / 2} width={cs} height={cs} fill="#FFF3C4" opacity={j.baterai === undefined || f >= j.baterai ? 1 : 0} />
      {Array.from({ length: 6 }).map((_, i) => <line key={`v${i}`} x1={ML + i * cs} y1={MT} x2={ML + i * cs} y2={MT + W5} stroke="#A9A9BF" strokeWidth={3} />)}
      {Array.from({ length: 6 }).map((_, i) => <line key={`h${i}`} x1={ML} y1={MT + i * cs} x2={ML + W5} y2={MT + i * cs} stroke="#A9A9BF" strokeWidth={3} />)}
      {titik}
      {batu.map(([c, r], i) => {
        const m = j.batu ? muncul(f, j.batu[i] ?? j.batu[0]) : 1;
        if (m === 0) return null;
        const [bx, by] = pos(c, r);
        const goyang = nabrak && jalur[langkahKe + 1] && jalur[langkahKe + 1][0] === c && jalur[langkahKe + 1][1] === r ? Math.sin(f * 2.2) * 3 : 0;
        return <g key={i} transform={`translate(${bx + goyang} ${by + 6}) scale(${m})`}><Batu s={cs / 58} /></g>;
      })}
      {(() => {
        const m = j.baterai === undefined ? 1 : muncul(f, j.baterai);
        if (m === 0) return null;
        const [bx, by] = pos(...baterai);
        return <g transform={`translate(${bx} ${by + 4}) scale(${m})`}><Baterai s={cs / 36} /></g>;
      })()}
      {(() => {
        const m = j.robo === undefined ? 1 : muncul(f, j.robo);
        if (m === 0) return null;
        return (
          <g transform={`translate(${rx} ${ry - angkat + cs * 0.44}) scale(${m * (2 - sq)} ${m * sq}) rotate(${nabrak ? Math.sin(f * 1.6) * 6 : 0})`}>
            <image href={staticFile("v7/robo.png")} x={-225.5 * robSkala} y={-434 * robSkala} width={451 * robSkala} height={434 * robSkala} />
          </g>
        );
      })()}
      {nabrak && (() => {
        const [cx, cy] = pos(...jalur[langkahKe + 1]);
        const m = muncul(f, (j.lompat ?? [])[langkahKe] + 3, 6);
        return <g transform={`translate(${cx + 34} ${cy - 34}) scale(${m})`}><circle r={24} fill={W.merah} /><path d="M-9 -9 l18 18 m0 -18 l-18 18" stroke="#fff" strokeWidth={6} strokeLinecap="round" /></g>;
      })()}
      {jari}
    </g>
  );
};
