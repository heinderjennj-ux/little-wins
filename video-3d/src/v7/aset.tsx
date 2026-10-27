// Aset "asli" Variasi 7: pose karakter AI (GPT Image 2.5 Flare, latar dihapus BiRefNet), papan soal bergaya halaman PDF
// Koder Cilik (huruf A–E, angka 1–5, ikon robot/batu/baterai), jari, halaman asli, lampu belajar, iklan HP yang realistis.
import React from "react";
import { interpolate, staticFile, useCurrentFrame } from "remotion";
import { bintangPath, W } from "../storybook/kit";
import UKURAN from "./pose-ukuran.json";
import MATA from "./mata.json";

// ---------- pose AI: (x, bawah) = titik tengah bawah gambar ----------
// hidup: napas pelan + goyang sangat kecil; tukar = frame pose berganti → ancang-ancang halus (mengkerut lalu menetap)
export const Pose: React.FC<{ n: string; x: number; bawah: number; tinggi: number; flip?: boolean; rot?: number; sq?: number; tukar?: number }> = ({ n, x, bawah, tinggi, flip, rot = 0, sq = 1, tukar }) => {
  const fl = useCurrentFrame();
  const [w, h] = (UKURAN as Record<string, number[]>)[n];
  const s = tinggi / h;
  const fa = fl;
  const benih = (x % 97) / 10;
  let tk = 1;
  if (tukar !== undefined) {
    tk = interpolate(fa, [tukar - 4, tukar, tukar + 5, tukar + 10], [1, 0.965, 1.015, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }
  sq = sq * tk * (1 + 0.008 * Math.sin(fa / 15 + benih));
  // kedip: tiap ±3 detik (berbeda per tokoh), 4 frame
  const mata = (MATA as Record<string, { mata: { cx: number; cy: number; rx: number; ry: number }[]; kulit: string }>)[n];
  const fase = Math.floor(fa + benih * 31) % 97;
  const tutup = fase < 4 ? [0.55, 1, 1, 0.5][fase] : 0;
  rot = rot + 0.45 * Math.sin(fa / 37 + benih);
  return (
    <g transform={`translate(${x} ${bawah}) rotate(${rot}) scale(${(flip ? -1 : 1) * s * (2 - sq)} ${s * sq}) translate(${-w / 2} ${-h})`}>
      <image href={staticFile(`uji/${n}.png`)} width={w} height={h} />
      {tutup > 0.05 && mata && mata.mata.map((m, i) => (
        <g key={i}>
          <clipPath id={`kd${n}${Math.round(x)}${i}`}>
            <ellipse cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry} />
          </clipPath>
          <rect x={m.cx - m.rx} y={m.cy - m.ry} width={m.rx * 2} height={m.ry * 2 * tutup} fill={mata.kulit} clipPath={`url(#kd${n}${Math.round(x)}${i})`} />
          <path d={`M${m.cx - m.rx * 0.85} ${m.cy - m.ry + m.ry * 2 * tutup} Q${m.cx} ${m.cy - m.ry + m.ry * 2 * tutup + m.ry * 0.25} ${m.cx + m.rx * 0.85} ${m.cy - m.ry + m.ry * 2 * tutup}`} stroke="#3A2416" strokeWidth={Math.max(4, m.rx * 0.14)} fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
};

// ---------- ikon soal (gaya halaman PDF) ----------
const GARIS = "#3A3D4F";
export const Batu: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-38 26 L-30 -12 L-8 -30 L22 -24 L38 4 L32 26 Z" fill="#B8BBC6" stroke={GARIS} strokeWidth={6} strokeLinejoin="round" />
    <path d="M-12 -8 L0 -2 M8 12 L22 6" stroke="#8E91A0" strokeWidth={5} strokeLinecap="round" />
  </g>
);
export const Baterai: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-10} y={-40} width={20} height={10} rx={3} fill={GARIS} />
    <rect x={-22} y={-32} width={44} height={66} rx={9} fill="#5BBE76" stroke={GARIS} strokeWidth={6} />
    <path d="M4 -22 L-10 4 L0 4 L-4 24 L12 -4 L2 -4 Z" fill="#fff" />
  </g>
);
export const Robo: React.FC<{ x: number; y: number; s: number; rot?: number }> = ({ x, y, s, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <image href={staticFile("v7/asli/robo.png")} x={-40} y={-50} width={80} height={98} />
  </g>
);

export type Sel = [number, number]; // [kolom 0..4 (A–E), baris 0..4 (1–5)]
type Langkah = "kanan" | "kiri" | "atas" | "bawah";
const ARAH: Record<Langkah, Sel> = { kanan: [1, 0], kiri: [-1, 0], atas: [0, -1], bawah: [0, 1] };
export const jalankan = (awal: Sel, kode: Langkah[]) => {
  const out: Sel[] = [awal];
  for (const k of kode) {
    const p = out[out.length - 1];
    out.push([p[0] + ARAH[k][0], p[1] + ARAH[k][1]]);
  }
  return out;
};

// papan 5×5 persis gaya halaman PDF; jalur = garis putus oranye seperti di sampul
export const PapanSoal: React.FC<{
  x: number; y: number; s: number; robo: Sel | [number, number]; batu: Sel[]; baterai: Sel; jalur?: Sel[]; jalurSalah?: Sel[]; tanda?: { sel: Sel; ok: boolean }; judul?: string; nomor?: number; roboRot?: number;
}> = ({ x, y, s, robo, batu, baterai, jalur = [], jalurSalah = [], tanda, judul, nomor, roboRot = 0 }) => {
  const u = 110, x0 = 60, y0 = 70;
  const p = (c: number, r: number) => [x0 + c * u + u / 2, y0 + r * u + u / 2];
  const garis = (j: Sel[], warna: string) => (j.length > 1 ? <path d={"M" + j.map(([c, r]) => p(c, r).join(" ")).join(" L")} stroke={warna} strokeWidth={8} fill="none" strokeDasharray="16 12" strokeLinecap="round" strokeLinejoin="round" /> : null);
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(-345 -345)`}>
      <rect x={-20} y={-60} width={730} height={770} rx={28} fill="#FFFDF8" />
      {judul && (
        <g>
          <circle cx={22} cy={-18} r={26} fill="#F28C38" />
          <text x={22} y={-8} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={30} fill="#fff">{nomor ?? 1}</text>
          <text x={62} y={-6} fontFamily="Fredoka" fontWeight={700} fontSize={34} fill={GARIS}>{judul}</text>
        </g>
      )}
      {["A", "B", "C", "D", "E"].map((h, i) => <text key={h} x={x0 + i * u + u / 2} y={y0 - 14} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={26} fill="#5A5D70">{h}</text>)}
      {[1, 2, 3, 4, 5].map((n, i) => <text key={n} x={x0 - 26} y={y0 + i * u + u / 2 + 9} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={26} fill="#5A5D70">{n}</text>)}
      {Array.from({ length: 25 }).map((_, i) => {
        const c = i % 5, r = Math.floor(i / 5);
        const awal = jalur.length ? jalur[0] : (robo as Sel);
        const isi = c === baterai[0] && r === baterai[1] ? "#FFF3C8" : c === Math.round(awal[0]) && r === Math.round(awal[1]) ? "#E3F3E6" : "#FFFFFF";
        return <rect key={i} x={x0 + c * u} y={y0 + r * u} width={u} height={u} fill={isi} stroke="#9A9CB0" strokeWidth={3} />;
      })}
      {garis(jalur, "#F28C38")}
      {garis(jalurSalah, W.merah)}
      {batu.map(([c, r], i) => <Batu key={i} x={p(c, r)[0]} y={p(c, r)[1] + 4} s={1.2} />)}
      <Baterai x={p(...baterai)[0]} y={p(...baterai)[1] + 4} s={1.15} />
      <Robo x={p(robo[0], robo[1])[0]} y={p(robo[0], robo[1])[1] + 2} s={1.0} rot={roboRot} />
      {tanda && (
        <g transform={`translate(${p(...tanda.sel)[0] + 36} ${p(...tanda.sel)[1] - 36})`}>
          <circle r={24} fill={tanda.ok ? "#2FB36B" : W.merah} />
          {tanda.ok ? <path d="M-11 0 l7 8 l15 -16" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M-9 -9 l18 18 m0 -18 l-18 18" stroke="#fff" strokeWidth={6} strokeLinecap="round" />}
        </g>
      )}
    </g>
  );
};
// posisi layar dari sel papan (untuk menaruh jari)
export const posSel = (x: number, y: number, s: number, c: number, r: number) => [x + s * (60 + c * 110 + 55 - 345), y + s * (70 + r * 110 + 55 - 345)];

// jari asli (ujung telunjuk di titik x,y)
export const Jari: React.FC<{ x: number; y: number; tinggi?: number }> = ({ x, y, tinggi = 320 }) => {
  const s = tinggi / 829;
  return <image href={staticFile("v7/asli/jari.png")} x={x - 217 * s} y={y - 790 * s} width={641 * s} height={829 * s} />;
};

// halaman asli dari PDF (contoh, level 1, kunci)
export const Halaman: React.FC<{ n: "contoh-l1" | "l1" | "kunci"; x: number; y: number; lebar: number; rot?: number }> = ({ n, x, y, lebar, rot = 0 }) => {
  const t = lebar * (1650 / 1275);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-lebar / 2 + 8} y={-t / 2 + 10} width={lebar} height={t} fill="#000" opacity={0.15} rx={6} />
      <image href={staticFile(`v7/asli/${n}.png`)} x={-lebar / 2} y={-t / 2} width={lebar} height={t} />
    </g>
  );
};

// lampu belajar yang jelas: kaki, dua lengan bersendi, kap kerucut, bohlam & cahaya lembut ke bawah
export const LampuBelajar: React.FC<{ x: number; y: number; s?: number; nyala?: boolean }> = ({ x, y, s = 1, nyala = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {nyala && <path d="M150 -238 L60 30 L330 30 L240 -238 Z" fill="#FFE7A8" opacity={0.28} />}
    <ellipse cx={0} cy={18} rx={78} ry={18} fill="#3F4E8C" />
    <rect x={-60} y={4} width={120} height={18} rx={9} fill="#4D5FA8" />
    <path d="M0 10 L-40 -150" stroke="#4D5FA8" strokeWidth={16} strokeLinecap="round" />
    <path d="M-40 -150 L110 -250" stroke="#4D5FA8" strokeWidth={14} strokeLinecap="round" />
    <circle cx={-40} cy={-150} r={14} fill="#3F4E8C" />
    <circle cx={110} cy={-250} r={12} fill="#3F4E8C" />
    <g transform="translate(150 -244) rotate(28)">
      <path d="M-62 40 L-30 -40 L30 -40 L62 40 Z" fill="#5B6FC0" />
      <path d="M-62 40 L62 40" stroke="#3F4E8C" strokeWidth={8} strokeLinecap="round" />
      {nyala && <ellipse cx={0} cy={44} rx={30} ry={12} fill="#FFF3C4" />}
    </g>
  </g>
);

// iklan di dalam HP: banner bawah + iklan layar penuh yang berganti-ganti (seperti iklan sungguhan)
const IKLAN = [
  { judul: "Balap Mobil 3D", sub: "Main gratis sekarang!", warna: "#E8455B", ikon: "#FFC93C", tombol: "Pasang" },
  { judul: "Permen Pop!", sub: "Level 1–500 menunggu", warna: "#8E5BFF", ikon: "#FF8BD0", tombol: "Main" },
  { judul: "Kartun Seru TV", sub: "Tonton episode baru", warna: "#00A3C4", ikon: "#7CE0F0", tombol: "Buka" },
];
export const IklanHP: React.FC<{ f: number; ganti?: number }> = ({ f, ganti = 24 }) => {
  const fp = Math.max(0, f), k = Math.floor(fp / ganti) % IKLAN.length, a = IKLAN[k], b = IKLAN[(k + 1) % IKLAN.length];
  const hitung = 5 - (Math.floor(fp / 30) % 5);
  return (
    <g>
      {/* iklan layar penuh */}
      <rect x={-116} y={-212} width={232} height={340} fill={a.warna} />
      <circle cx={0} cy={-90} r={56} fill={a.ikon} />
      <path d={bintangPath(0, -90, 34, 15)} fill="#fff" />
      <text y={-6} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={26} fill="#fff">{a.judul}</text>
      <text y={22} textAnchor="middle" fontFamily="Fredoka" fontWeight={500} fontSize={16} fill="#fff" opacity={0.9}>{a.sub}</text>
      <rect x={-70} y={40} width={140} height={40} rx={20} fill="#fff" />
      <text y={67} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={20} fill={a.warna}>{a.tombol}</text>
      <rect x={-108} y={-204} width={46} height={22} rx={5} fill="#000" opacity={0.45} />
      <text x={-85} y={-188} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={14} fill="#fff">Iklan</text>
      <rect x={34} y={-204} width={76} height={24} rx={12} fill="#000" opacity={0.45} />
      <text x={72} y={-187} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={13} fill="#fff">Lewati {hitung} ›</text>
      {/* banner iklan bawah */}
      <rect x={-116} y={128} width={232} height={84} fill="#F4F4F6" />
      <rect x={-104} y={140} width={56} height={56} rx={14} fill={b.warna} />
      <text x={-38} y={164} fontFamily="Fredoka" fontWeight={700} fontSize={16} fill="#22324A">{b.judul}</text>
      <text x={-38} y={184} fontFamily="Fredoka" fontWeight={500} fontSize={12} fill="#6B7080">Bersponsor</text>
      <rect x={52} y={154} width={56} height={28} rx={14} fill="#2F80ED" />
      <text x={80} y={173} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={13} fill="#fff">{b.tombol}</text>
      <rect x={-112} y={132} width={22} height={13} rx={3} fill="#F2B33D" />
      <text x={-101} y={142} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={10} fill="#fff">Ad</text>
    </g>
  );
};

// latar kantor peneliti (warna dari palet triad)
import { Tema } from "../gaya/tema";
export const Kantor: React.FC<{ T: Tema; f: number }> = ({ T, f }) => (
  <g>
    <rect width={1080} height={1920} fill={T.dinding} />
    {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={i * 90} y={0} width={38} height={1920} fill={T.garisDinding} />)}
    <rect x={640} y={560} width={360} height={260} rx={14} fill={T.kusen} />
    <rect x={656} y={576} width={328} height={228} rx={6} fill={T.langit} />
    <rect x={656} y={700} width={328} height={104} fill={T.langitBawah} />
    <ellipse cx={720 + ((f * 0.5) % 220)} cy={630} rx={40} ry={14} fill="#fff" opacity={0.8} />
    <rect x={815} y={576} width={10} height={228} fill={T.kusen} />
    <rect x={60} y={560} width={260} height={760} rx={8} fill={T.rakLuar} />
    <rect x={74} y={574} width={232} height={732} fill={T.rakDalam} />
    {[0, 1, 2, 3, 4].map((r) => (
      <g key={r}>
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={84 + i * 27} y={700 + r * 145 - 90 - ((i * 13) % 3) * 8} width={22} height={90 + ((i * 13) % 3) * 8} rx={3} fill={T.buku[(i + r) % T.buku.length]} />)}
        <rect x={66} y={700 + r * 145} width={248} height={12} fill={T.papanRak} />
      </g>
    ))}
    <rect x={-20} y={1300} width={1120} height={40} fill={T.mejaAtas} />
    <rect x={-20} y={1340} width={1120} height={600} fill={T.mejaDepan} />
  </g>
);
