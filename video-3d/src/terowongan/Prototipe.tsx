// YouTube Shorts US "Undersea Tunnel" (naskah v2: src/terowongan/naskah.md): prototipe still TW01–TW26, digambar kode (tanpa AI).
// Visual meniru video acuan "Stack of Bricks → Skyscraper": satu dunia penampang, benda tumbuh bertahap, potongan + panah gaya,
// label istilah kuning kapital. Style bible (riset-warna-gaya.md §4, §8, §10):
//  - 3 kelompok nilai (Fowkes): TERANG = langit & tebing kapur, SEDANG = laut & batu kapur, GELAP = batu dalam & lorong.
//  - Tiap lapis bawah air beda nilai + beda rona supaya penonton langsung tahu "di mana": langit pucat → laut biru jenuh
//    (makin gelap ke bawah) → garis pasir terang (pemisah) → kapur terang → marl sedang → lempung gelap → lorong paling gelap.
//  - Fokus hangat bergaris navy (mesin kuning, "kamu" oranye); bahaya = air cyan menyala; solusi = lumpur coklat hangat.
//  - Lapisan kedalaman: langit/awan jauh buram → laut + berkas cahaya + ikan + kapal → dasar laut + rumput laut → strata batu
//    + nodul flint + fosil → benda fokus tajam + bayangan kontak → batu depan buram → vinyet.
//  - Peta kemajuan kecil di atas: jalur terowongan + posisi mesin, supaya penonton tidak perlu berpikir "sudah sampai mana".
import React, { createContext, useContext } from "react";

// frame animasi untuk benda latar yang hidup (ikan berenang, kapal berlayar); still prototipe = 0
export const FrameCtx = createContext(0);
import { AbsoluteFill, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import UKURAN_AI from "../../public/terowongan/ai/ukuran.json";

loadFont({ family: "Baloo2", url: staticFile("font/Baloo2-800.woff2"), weight: "800" });
loadFont({ family: "Baloo2", url: staticFile("font/Baloo2-700.woff2"), weight: "700" });

export const W = 1080;
export const H = 1920;
export const NAVY = "#1E2A44";

export type Palet = {
  id: string;
  langitAtas: string; langitBawah: string; awan: string; matahari: string;
  lautAtas: string; lautBawah: string; sinar: string; ikan: string;
  pasir: string; pasirGaris: string; rumputLaut: string;
  kapur: string; kapurGaris: string; marl: string; marlGaris: string; lempung: string; lempungGaris: string; flint: string;
  tebing: string; tebingGaris: string; rumput: string; rumputTua: string; rumah: string; atap: string; jendela: string;
  lorong: string; lorongTerang: string; depan: string; gelap: boolean;
};
export const TERANG: Palet = {
  id: "t",
  langitAtas: "#E8F4FB", langitBawah: "#C6E2F3", awan: "#FFFFFF", matahari: "rgba(255,236,190,.75)",
  lautAtas: "#5DAEDB", lautBawah: "#285F98", sinar: "rgba(255,255,255,.16)", ikan: "#1F4F80",
  pasir: "#E9DFC6", pasirGaris: "#CDBE9C", rumputLaut: "#2E7A70",
  kapur: "#DEE2ED", kapurGaris: "#C3CADB", marl: "#8F9BBB", marlGaris: "#7A86A8", lempung: "#56628A", lempungGaris: "#48537A", flint: "#6E799A",
  tebing: "#F1F3F7", tebingGaris: "#D2D8E5", rumput: "#8FCB8E", rumputTua: "#679F76", rumah: "#F4EFE6", atap: "#B78E86", jendela: "#7FA6C9",
  lorong: "#26304F", lorongTerang: "#36436A", depan: "#323C5E", gelap: false,
};
export const INTENS: Palet = {
  id: "i",
  langitAtas: "#121A3A", langitBawah: "#25305E", awan: "#2E3A68", matahari: "rgba(233,226,196,.35)",
  lautAtas: "#1E4778", lautBawah: "#0C1D40", sinar: "rgba(170,195,255,.07)", ikan: "#0A1834",
  pasir: "#5E6178", pasirGaris: "#4C4F66", rumputLaut: "#173844",
  kapur: "#4A5480", kapurGaris: "#3F4874", marl: "#364068", marlGaris: "#2D365D", lempung: "#232B4F", lempungGaris: "#1C2344", flint: "#2A3258",
  tebing: "#4A5480", tebingGaris: "#3F4874", rumput: "#2D5652", rumputTua: "#224444", rumah: "#3A4470", atap: "#2C3866", jendela: "#FFD27A",
  lorong: "#0F1530", lorongTerang: "#1A2246", depan: "#0B1028", gelap: true,
};
// kenangan di sumur: hangat-sepia (color script: masa lalu = hangat)
export const KENANGAN: Palet = {
  ...TERANG,
  id: "k",
  langitAtas: "#FBEBD0", langitBawah: "#F2D6AA", awan: "#FFF6E6", matahari: "rgba(255,220,150,.7)",
  pasir: "#EBD3A6", pasirGaris: "#D9BC88", kapur: "#E2C79B", kapurGaris: "#D2B383", marl: "#C49E72", marlGaris: "#B08B60",
  lempung: "#9C7752", lempungGaris: "#8A6745", flint: "#8E6C4C", rumput: "#B9C47A", rumputTua: "#98A35E",
  lorong: "#4A3526", lorongTerang: "#5E4532", depan: "#5A4232",
};

export const F = {
  kuning: "#FFC23D", kuningTua: "#E09412", kuningMuda: "#FFE08A", sorotKuning: "#FFF0B8", oranye: "#FF8A3D", oranyeTua: "#E0682A",
  merah: "#E8453C", kulit: "#F5C9A0", kulitTua: "#E2A97C", biru: "#3567C9", biruTua: "#264E9E",
  beton: "#F2D8A7", betonTua: "#D9B77A", baja: "#C9D3E3", bajaTua: "#97A3BB", hijau: "#4ADE80",
  air: "#3FD0FF", busa: "#E8FBFF", lumpur: "#9A5B2E", lumpurMuda: "#C07A45", asap: "#5A5F70", laser: "#FF2E4D", kayu: "#C98B4A",
};

export const LAUT_Y = 720;
export const DASAR_Y = 1010;
export const RUTE_Y = 1275;
export const X_KIRI = 124;
export const X_KANAN = 956;

// angka acak tetap (still selalu sama)
export const acak = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
// garis bergelombang selebar layar
export const gel = (y: number, amp = 18, f = 0) => `M0 ${y} C180 ${y + amp} 360 ${y - amp * 0.6 + f} 540 ${y + f * 0.3} S900 ${y + amp} 1080 ${y - amp * 0.4}`;
export const pita = (y: number, amp = 18, f = 0) => `${gel(y, amp, f)} V${H} H0 Z`;

// ---------- defs ----------
export const Defs: React.FC<{ P: Palet }> = ({ P }) => (
  <defs>
    <filter id="buram"><feGaussianBlur stdDeviation={1.4} /></filter>
    <filter id="jauh"><feGaussianBlur stdDeviation={4} /></filter>
    <filter id="depan"><feGaussianBlur stdDeviation={10} /></filter>
    <filter id="cahaya"><feGaussianBlur stdDeviation={14} /></filter>
    <filter id="malam"><feColorMatrix type="matrix" values="0.42 0 0 0 0.03  0 0.48 0 0 0.05  0 0 0.68 0 0.13  0 0 0 1 0" /></filter>
    <filter id="tokohMalam"><feColorMatrix type="matrix" values="0.8 0 0 0 0.02  0 0.8 0 0 0.03  0 0 0.92 0 0.07  0 0 0 1 0" /></filter>
    <filter id="kenangan"><feColorMatrix type="matrix" values="0.85 0.18 0.05 0 0.04  0.12 0.78 0.08 0 0.03  0.08 0.12 0.6 0 0.0  0 0 0 1 0" /></filter>
    <linearGradient id={"gLangit" + P.id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={P.langitAtas} />
      <stop offset="100%" stopColor={P.langitBawah} />
    </linearGradient>
    <linearGradient id={"gLaut" + P.id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={P.lautAtas} />
      <stop offset="100%" stopColor={P.lautBawah} />
    </linearGradient>
    <linearGradient id={"gLorong" + P.id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={P.lorongTerang} />
      <stop offset="55%" stopColor={P.lorong} />
      <stop offset="100%" stopColor={P.lorongTerang} />
    </linearGradient>
    <linearGradient id="gAir" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#7FE3FF" />
      <stop offset="100%" stopColor="#1FA6E0" />
    </linearGradient>
    <radialGradient id={"sorot" + P.id} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={P.gelap ? "rgba(255,206,140,.5)" : "rgba(255,226,160,.6)"} />
      <stop offset="100%" stopColor="rgba(255,214,150,0)" />
    </radialGradient>
    <radialGradient id="sorotBulan" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="rgba(190,210,255,.42)" />
      <stop offset="100%" stopColor="rgba(190,210,255,0)" />
    </radialGradient>
    <radialGradient id={"vinyet" + P.id} cx="50%" cy="45%" r="75%">
      <stop offset="58%" stopColor="rgba(12,16,40,0)" />
      <stop offset="100%" stopColor={P.gelap ? "rgba(6,8,24,.6)" : "rgba(20,24,50,.32)"} />
    </radialGradient>
  </defs>
);

// ---------- latar: langit & laut ----------
export const Awan: React.FC<{ x: number; y: number; s: number; warna: string }> = ({ x, y, s, warna }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={warna}>
    <ellipse cx={0} cy={10} rx={120} ry={38} />
    <ellipse cx={-62} cy={4} rx={66} ry={40} />
    <ellipse cx={46} cy={-18} rx={74} ry={54} />
    <ellipse cx={-10} cy={-30} rx={50} ry={40} />
  </g>
);

export const Langit: React.FC<{ P: Palet; bawah: number }> = ({ P, bawah }) => (
  <g>
    <rect width={W} height={bawah} fill={`url(#gLangit${P.id})`} />
    <circle cx={P.gelap ? 820 : 860} cy={210} r={P.gelap ? 60 : 110} fill={P.matahari} filter="url(#cahaya)" />
    {P.gelap && <circle cx={820} cy={210} r={40} fill="#E9E2C4" />}
    {P.gelap && Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={acak(i) * W} cy={60 + acak(i + 50) * (bawah - 200)} r={1.5 + acak(i + 9) * 2} fill="#E9E2C4" opacity={0.8} />)}
    {/* awan jauh (kecil, buram, pucat) lalu awan dekat */}
    <g filter="url(#jauh)" opacity={P.gelap ? 0.5 : 0.75}>
      <Awan x={140} y={420} s={0.55} warna={P.awan} />
      <Awan x={620} y={500} s={0.45} warna={P.awan} />
      <Awan x={980} y={440} s={0.5} warna={P.awan} />
    </g>
    <g opacity={P.gelap ? 0.55 : 1}>
      <Awan x={220} y={250} s={1} warna={P.awan} />
      <Awan x={700} y={320} s={0.85} warna={P.awan} />
    </g>
  </g>
);

// ikan berenang menyeberang layar (muncul lagi dari sisi seberang), naik-turun pelan, ekor mengibas
export const Ikan: React.FC<{ x: number; y: number; s: number; warna: string; kiri?: boolean }> = ({ x, y, s, warna, kiri }) => {
  const f = useContext(FrameCtx);
  const arah = kiri ? -1 : 1;
  const lebar = W + 160;
  const xx = ((((x + arah * (1.2 + s) * f) % lebar) + lebar) % lebar) - 80;
  const yy = y + 6 * Math.sin(f / 14 + x);
  const ekor = 1 + 0.35 * Math.sin(f / 2.5 + x);
  return (
    <g transform={`translate(${xx} ${yy}) scale(${arah * s} ${s})`} fill={warna}>
      <ellipse cx={0} cy={0} rx={26} ry={11} />
      <path d={`M-22 0 L-42 ${-12 * ekor} L-42 ${12 * ekor} Z`} />
    </g>
  );
};

export const Laut: React.FC<{ P: Palet; y0: number; y1: number; ikan?: boolean }> = ({ P, y0, y1, ikan = true }) => (
  <g>
    <rect y={y0} width={W} height={y1 - y0} fill={`url(#gLaut${P.id})`} />
    {/* berkas cahaya dari permukaan */}
    {[120, 380, 640, 900].map((x, i) => (
      <path key={i} d={`M${x} ${y0} L${x + 70} ${y0} L${x + 150} ${y1} L${x + 30} ${y1} Z`} fill={P.sinar} />
    ))}
    {/* permukaan: garis terang + riak */}
    <rect y={y0} width={W} height={10} fill={P.gelap ? "#3A5E92" : "#BFE6FA"} />
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={i} d={`M${i * 95 + 10} ${y0 + 4} q24 -14 48 0`} stroke={P.gelap ? "#5A7AB0" : "#FFFFFF"} strokeWidth={4} fill="none" opacity={0.8} />
    ))}
    {ikan && [
      [180, y0 + 120, 1, false],
      [240, y0 + 150, 0.7, false],
      [760, y0 + 90, 0.9, true],
      [820, y0 + 210, 0.6, true],
      [470, y0 + 230, 0.8, false],
    ].map(([x, y, s, k], i) => <Ikan key={i} x={x as number} y={y as number} s={s as number} warna={P.ikan} kiri={k as boolean} />)}
    {ikan && Array.from({ length: 10 }).map((_, i) => (
      <circle key={i} cx={acak(i + 3) * W} cy={y0 + 40 + acak(i + 31) * (y1 - y0 - 60)} r={3 + acak(i) * 5} fill="none" stroke={P.gelap ? "#5A7AB0" : "#E3F4FF"} strokeWidth={2.5} opacity={0.7} />
    ))}
  </g>
);

export const RumputLaut: React.FC<{ x: number; y: number; s?: number; warna: string }> = ({ x, y, s = 1, warna }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={warna} strokeWidth={9} strokeLinecap="round" fill="none">
    <path d="M0 0 C-14 -30 14 -55 -4 -90" />
    <path d="M14 0 C4 -24 30 -40 18 -66" />
    <path d="M-14 0 C-26 -20 -6 -36 -20 -58" />
  </g>
);

// dasar laut + 3 lapis batu dengan strata, nodul flint, fosil
export const Lapisan: React.FC<{ P: Palet; dasar: number; batasMarl?: number; batasLempung?: number; benih?: number }> = ({ P, dasar, batasMarl = 1160, batasLempung = 1430, benih = 0 }) => (
  <g>
    <path d={pita(dasar, 22, 6)} fill={P.pasir} />
    <path d={gel(dasar + 16, 18, 4)} stroke={P.pasirGaris} strokeWidth={5} fill="none" />
    <path d={pita(dasar + 30, 18, 4)} fill={P.kapur} />
    {[46, 80].map((d, i) => <path key={i} d={gel(dasar + 30 + d, 14, 3 + i)} stroke={P.kapurGaris} strokeWidth={4} fill="none" />)}
    <path d={pita(batasMarl, 20, -6)} fill={P.marl} />
    <path d={gel(batasMarl, 20, -6)} stroke={P.kapurGaris} strokeWidth={6} fill="none" />
    {[70, 150, 220].map((d, i) => <path key={i} d={gel(batasMarl + d, 16, -4 + i * 3)} stroke={P.marlGaris} strokeWidth={4} fill="none" />)}
    <path d={pita(batasLempung, 24, 8)} fill={P.lempung} />
    <path d={gel(batasLempung, 24, 8)} stroke={P.marlGaris} strokeWidth={6} fill="none" />
    {[90, 200, 320].map((d, i) => <path key={i} d={gel(batasLempung + d, 18, 5 - i * 2)} stroke={P.lempungGaris} strokeWidth={4} fill="none" />)}
    {/* nodul flint di kapur, kerikil di marl */}
    {Array.from({ length: 14 }).map((_, i) => (
      <ellipse key={i} cx={acak(i + benih) * W} cy={dasar + 60 + acak(i + 40 + benih) * (batasMarl - dasar - 70)} rx={9 + acak(i + 7) * 10} ry={6 + acak(i + 8) * 5} fill={P.flint} opacity={0.7} />
    ))}
    {Array.from({ length: 18 }).map((_, i) => (
      <ellipse key={`m${i}`} cx={acak(i + 90 + benih) * W} cy={batasMarl + 30 + acak(i + 120 + benih) * (batasLempung - batasMarl - 40)} rx={6 + acak(i + 3) * 8} ry={4 + acak(i + 4) * 4} fill={P.marlGaris} opacity={0.8} />
    ))}
    {/* fosil kerang kecil */}
    {[0.2, 0.7].map((t, i) => (
      <path key={i} d={`M${t * W} ${dasar + 90} a14 14 0 1 1 14 14 a9 9 0 1 1 -9 -9 a5 5 0 1 1 5 5`} stroke={P.kapurGaris} strokeWidth={4} fill="none" />
    ))}
    {/* rumput laut di dasar */}
    {[60, 300, 520, 700, 1000].map((x, i) => <RumputLaut key={i} x={x} y={dasar + 6} s={0.6 + acak(i) * 0.5} warna={P.rumputLaut} />)}
  </g>
);

export const Rumah: React.FC<{ P: Palet; x: number; y: number; s?: number }> = ({ P, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-30} y={-42} width={60} height={42} rx={4} fill={P.rumah} />
    <path d="M-38 -40 L0 -70 L38 -40 Z" fill={P.atap} />
    <rect x={-16} y={-30} width={12} height={12} rx={2} fill={P.jendela} />
    <rect x={6} y={-30} width={12} height={12} rx={2} fill={P.jendela} />
  </g>
);
export const Pohon: React.FC<{ P: Palet; x: number; y: number; s?: number }> = ({ P, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-5} y={-30} width={10} height={30} fill={P.rumputTua} />
    <circle cx={0} cy={-46} r={26} fill={P.rumputTua} />
    <circle cx={-8} cy={-52} r={16} fill={P.rumput} />
  </g>
);

// tebing kapur putih + rumput + rumah; kanan = cermin kiri (+ mercusuar)
export const Tebing: React.FC<{ P: Palet; kanan?: boolean }> = ({ P, kanan }) => (
  <g transform={kanan ? `translate(${W} 0) scale(-1 1)` : undefined}>
    <path d={`M0 628 L178 628 Q196 640 210 700 L248 ${LAUT_Y + 40} L298 ${DASAR_Y + 30} L0 ${DASAR_Y + 30} Z`} fill={P.tebing} />
    {[40, 90, 140, 190, 230].map((x, i) => <path key={i} d={`M${x} 650 L${x + 20} ${LAUT_Y + 70 + i * 30}`} stroke={P.tebingGaris} strokeWidth={6} />)}
    <path d={`M${210} 700 L248 ${LAUT_Y + 40} L298 ${DASAR_Y + 30}`} stroke={P.tebingGaris} strokeWidth={10} fill="none" />
    <path d="M0 606 L188 606 Q206 616 192 640 L0 640 Z" fill={P.rumput} />
    <path d="M0 632 L192 632 L186 642 L0 642 Z" fill={P.rumputTua} />
    <Rumah P={P} x={48} y={608} />
    <Rumah P={P} x={118} y={608} s={0.82} />
    <Pohon P={P} x={168} y={608} s={0.8} />
    {kanan && (
      <g transform="translate(80 608) scale(-1 1)">
        <rect x={-12} y={-110} width={24} height={110} fill={P.rumah} />
        <rect x={-12} y={-80} width={24} height={16} fill={F.merah} opacity={0.6} />
        <rect x={-16} y={-126} width={32} height={18} fill={P.atap} />
      </g>
    )}
  </g>
);

// kapal berlayar pelan; `batas` = rentang putar ulang di balik tebing (dunia lebar), tanpa batas = hanyut pelan saja
export const Kapal: React.FC<{ P: Palet; x: number; y: number; batas?: [number, number] }> = ({ P, x, y, batas }) => {
  const f = useContext(FrameCtx);
  const xx = batas ? batas[0] + ((((x - batas[0] + 0.45 * f) % (batas[1] - batas[0])) + (batas[1] - batas[0])) % (batas[1] - batas[0])) : x + 0.15 * f;
  const yy = y + 2.5 * Math.sin(f / 18);
  return (
  <g transform={`translate(${xx} ${yy}) rotate(${0.8 * Math.sin(f / 22)})`} opacity={0.9}>
    <path d="M-90 -6 L90 -6 L70 18 L-74 18 Z" fill={P.gelap ? "#2A3460" : "#4B5A80"} />
    <rect x={-60} y={-30} width={40} height={24} fill={P.gelap ? "#36406E" : "#E9EDF5"} />
    <rect x={-14} y={-30} width={30} height={24} fill={P.gelap ? "#36406E" : "#C98A7A"} />
    <rect x={22} y={-30} width={30} height={24} fill={P.gelap ? "#36406E" : "#8FB4D6"} />
    <rect x={56} y={-48} width={14} height={42} fill={P.gelap ? "#36406E" : "#E9EDF5"} />
  </g>
  );
};

// batu depan buram (lapisan paling depan)
export const Depan: React.FC<{ P: Palet }> = ({ P }) => (
  <g filter="url(#depan)" fill={P.depan}>
    <path d="M-40 1920 L-40 1560 Q60 1500 150 1580 Q230 1520 300 1640 L330 1920 Z" />
    <path d="M1120 1920 L1120 1520 Q1020 1470 940 1560 Q880 1520 820 1660 L800 1920 Z" />
  </g>
);

// ---------- galian di dunia lebar ----------
export type Gali = { a?: number; b?: number; meleset?: boolean; mesin?: boolean; laser?: boolean; mobil?: boolean };
export const PANJANG = X_KANAN - X_KIRI;
export const Galian: React.FC<{ P: Palet; g: Gali }> = ({ P, g }) => {
  const a = g.a ?? 0;
  const b = g.b ?? 0;
  const tinggi = 46;
  const lorong = (x0: number, x1: number, y: number) => (
    <g>
      <rect x={x0} y={y - tinggi / 2 - 8} width={x1 - x0} height={tinggi + 16} rx={8} fill={F.beton} stroke={NAVY} strokeWidth={5} />
      <rect x={x0} y={y - tinggi / 2} width={x1 - x0} height={tinggi} fill={`url(#gLorong${P.id})`} />
      {Array.from({ length: Math.max(0, Math.floor((x1 - x0) / 40)) }).map((_, i) => (
        <circle key={i} cx={x0 + 20 + i * 40} cy={y - 12} r={3.5} fill="#FFD27A" />
      ))}
    </g>
  );
  const ya = g.meleset ? RUTE_Y - 52 : RUTE_Y;
  const yb = g.meleset ? RUTE_Y + 52 : RUTE_Y;
  return (
    <g>
      {/* sumur masuk di tiap pantai (seperti sumur — dunia si penggali) */}
      {(a > 0 || g.mesin) && <rect x={X_KIRI - 16} y={612} width={32} height={RUTE_Y - 612} fill={`url(#gLorong${P.id})`} stroke={NAVY} strokeWidth={5} />}
      {(b > 0 || a >= 1 || (g.mesin && g.b !== undefined)) && <rect x={X_KANAN - 16} y={612} width={32} height={RUTE_Y - 612} fill={`url(#gLorong${P.id})`} stroke={NAVY} strokeWidth={5} />}
      {a > 0 && lorong(X_KIRI, X_KIRI + a * PANJANG, ya)}
      {b > 0 && lorong(X_KANAN - b * PANJANG, X_KANAN, yb)}
      {g.laser && <line x1={X_KIRI} x2={X_KANAN} y1={RUTE_Y} y2={RUTE_Y} stroke={F.laser} strokeWidth={5} strokeDasharray="2 0" opacity={0.95} />}
      {g.mesin && a > 0 && (a + b < 1 || g.meleset) && <TBM x={X_KIRI + a * PANJANG} y={ya} s={0.3} />}
      {g.mesin && b > 0 && (a + b < 1 || g.meleset) && <TBM x={X_KANAN - b * PANJANG} y={yb} s={0.3} arah={-1} />}
      {g.mobil && <AI n="mobil-jet" x={560} bawah={RUTE_Y + 20} tinggi={42} bayang={false} />}
    </g>
  );
};

export const Dunia: React.FC<{ P: Palet; g?: Gali; kapal?: boolean }> = ({ P, g, kapal = true }) => (
  <g>
    <g filter="url(#buram)">
      <Langit P={P} bawah={LAUT_Y + 10} />
      <Laut P={P} y0={LAUT_Y} y1={DASAR_Y + 40} />
      <Lapisan P={P} dasar={DASAR_Y} />
      <HiasDasar P={P} y={DASAR_Y + 4} t={64} xs={[350, 430, 520, 610, 690]} />
      <Tebing P={P} />
      <Tebing P={P} kanan />
    </g>
    {kapal && <Kapal P={P} x={560} y={LAUT_Y} batas={[110, 970]} />}
    {g && <Galian P={P} g={g} />}
    <Depan P={P} />
  </g>
);

// close-up bawah tanah; `laut` = y dasar laut kalau laut terlihat di atas
export const Batu: React.FC<{ P: Palet; laut?: number; benih?: number }> = ({ P, laut, benih = 0 }) => (
  <g>
    <g filter="url(#buram)">
      {laut !== undefined ? (
        <>
          <Laut P={P} y0={-20} y1={laut + 40} />
          <Lapisan P={P} dasar={laut} batasMarl={laut + 220} batasLempung={1560} benih={benih} />
          <HiasDasar P={P} y={laut + 6} t={150} xs={[90, 300, 520, 760, 980].map((x) => (x + benih * 37) % 1080)} />
        </>
      ) : (
        <>
          <rect width={W} height={H} fill={P.marl} />
          {Array.from({ length: 11 }).map((_, i) => <path key={i} d={gel(120 + i * 130, 16, (i % 3) * 5)} stroke={P.marlGaris} strokeWidth={5} fill="none" />)}
          {Array.from({ length: 30 }).map((_, i) => (
            <ellipse key={i} cx={acak(i + benih) * W} cy={60 + acak(i + 70 + benih) * 1500} rx={8 + acak(i + 5) * 14} ry={5 + acak(i + 6) * 6} fill={P.flint} opacity={0.75} />
          ))}
          <path d={pita(1560, 22, 6)} fill={P.lempung} />
          <path d={gel(1560, 22, 6)} stroke={P.marlGaris} strokeWidth={6} fill="none" />
        </>
      )}
    </g>
    <Depan P={P} />
  </g>
);

// lorong tampak samping: lapisan cincin (atas & bawah) + lampu + rel
export const LorongSamping: React.FC<{ P: Palet; x0: number; x1: number; cy: number; h: number }> = ({ P, x0, x1, cy, h }) => {
  const n = Math.floor((x1 - x0) / 70);
  return (
    <g>
      <rect x={x0} y={cy - h / 2} width={x1 - x0} height={h} fill={`url(#gLorong${P.id})`} />
      {[cy - h / 2 - 24, cy + h / 2].map((y, k) => (
        <g key={k}>
          <rect x={x0} y={y} width={x1 - x0} height={24} fill={F.beton} stroke={NAVY} strokeWidth={4} />
          {Array.from({ length: n }).map((_, i) => (
            <g key={i}>
              <line x1={x0 + i * 70} x2={x0 + i * 70} y1={y} y2={y + 24} stroke={F.betonTua} strokeWidth={4} />
              <circle cx={x0 + i * 70 + 35} cy={y + 12} r={3} fill={F.betonTua} />
            </g>
          ))}
        </g>
      ))}
      {Array.from({ length: n }).map((_, i) => (
        <g key={i}>
          <circle cx={x0 + 35 + i * 70} cy={cy - h / 2 + 16} r={14} fill="rgba(255,210,122,.35)" />
          <circle cx={x0 + 35 + i * 70} cy={cy - h / 2 + 16} r={5} fill="#FFD27A" />
        </g>
      ))}
      <rect x={x0} y={cy + h / 2 - 22} width={x1 - x0} height={6} fill={F.bajaTua} />
      <rect x={x0} y={cy + h / 2 - 12} width={x1 - x0} height={6} fill={F.bajaTua} />
    </g>
  );
};

// ---------- gambar AI (gpt-image-2.5-flare, latar dihapus birefnet) ----------
// x = tengah, bawah = garis kaki; filter: "malam" (latar malam), "tokohMalam" (fokus malam, sedikit redup), "kenangan" (sepia)
export const AI: React.FC<{ n: string; x: number; bawah: number; tinggi: number; flip?: boolean; filter?: string; bayang?: boolean; putar?: number }> = ({ n, x, bawah, tinggi, flip, filter, bayang = true, putar = 0 }) => {
  const [w, h] = (UKURAN_AI as Record<string, number[]>)[n];
  const lebar = (w / h) * tinggi;
  return (
    <g transform={`translate(${x} ${bawah}) rotate(${putar}) scale(${flip ? -1 : 1} 1)`}>
      {bayang && <ellipse cx={0} cy={-4} rx={lebar * 0.42} ry={Math.max(8, tinggi * 0.025)} fill="rgba(10,14,34,.3)" />}
      <image href={staticFile(`terowongan/ai/${n}.png`)} x={-lebar / 2} y={-tinggi} width={lebar} height={tinggi} filter={filter ? `url(#${filter})` : undefined} />
    </g>
  );
};

// hiasan dasar laut warna-warni (AI) di sepanjang dasar laut; jauh = kecil & sedikit buram, malam = diredam
export const HiasDasar: React.FC<{ P: Palet; y: number; t: number; xs: number[] }> = ({ P, y, t, xs }) => {
  const urut = ["karang", "tanaman-laut", "bintang-laut", "anemon", "karang", "tanaman-laut"];
  const skala: Record<string, number> = { karang: 1, "tanaman-laut": 1.25, "bintang-laut": 0.7, anemon: 0.85 };
  return (
    <g filter={P.gelap ? "url(#malam)" : undefined}>
      {xs.map((x, i) => {
        const n = urut[i % urut.length];
        return <AI key={i} n={n} x={x} bawah={y + 8} tinggi={t * skala[n]} flip={i % 2 === 1} bayang={false} />;
      })}
    </g>
  );
};

// ---------- benda fokus ----------
export const Panah: React.FC<{ x1: number; y1: number; x2: number; y2: number; w?: number; warna?: string }> = ({ x1, y1, x2, y2, w = 16, warna = F.oranye }) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = w * 2.6;
  const bx = x2 - h * Math.cos(a);
  const by = y2 - h * Math.sin(a);
  const sx = h * 0.62 * Math.sin(a);
  const sy = h * 0.62 * Math.cos(a);
  const ujung = `${x2},${y2} ${bx + sx},${by - sy} ${bx - sx},${by + sy}`;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={NAVY} strokeWidth={w + 10} />
      <polygon points={ujung} fill={NAVY} stroke={NAVY} strokeWidth={10} />
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={warna} strokeWidth={w} />
      <polygon points={ujung} fill={warna} />
    </g>
  );
};

// mesin bor tampak samping; x,y = ujung kepala bor & garis tengah; arah 1 = ke kanan
export const TBM: React.FC<{ x: number; y: number; s?: number; arah?: 1 | -1; miring?: number; lumpur?: boolean }> = ({ x, y, s = 1, arah = 1, miring = 0, lumpur }) => (
  <g transform={`translate(${x} ${y}) rotate(${miring}) scale(${s * arah} ${s})`} strokeLinejoin="round">
    <ellipse cx={-320} cy={112} rx={340} ry={14} fill="rgba(10,14,34,.35)" />
    {/* gerbong belakang: kabin + ban berjalan */}
    <g stroke={NAVY} strokeWidth={6}>
      <rect x={-660} y={-50} width={320} height={100} rx={14} fill={F.kuningMuda} />
      <rect x={-640} y={-36} width={70} height={40} rx={8} fill="#8FD0F0" />
      <rect x={-560} y={-20} width={190} height={14} rx={7} fill={F.bajaTua} />
      {[-610, -520, -430].map((gx) => <circle key={gx} cx={gx} cy={54} r={16} fill={NAVY} />)}
      {[-600, -540, -480, -420].map((mx) => <circle key={mx} cx={mx} cy={-26} r={10} fill={F.lumpurMuda} strokeWidth={4} />)}
    </g>
    {/* silinder pendorong */}
    <g stroke={NAVY} strokeWidth={5}>
      {[-50, 0, 50].map((cy) => <rect key={cy} x={-410} y={cy - 9} width={80} height={18} rx={8} fill={F.baja} />)}
    </g>
    {/* perisai */}
    <g stroke={NAVY} strokeWidth={6}>
      <rect x={-350} y={-84} width={330} height={168} rx={28} fill={F.kuning} />
    </g>
    <rect x={-344} y={-78} width={318} height={26} rx={12} fill={F.sorotKuning} opacity={0.75} />
    <rect x={-344} y={50} width={318} height={28} rx={12} fill={F.kuningTua} opacity={0.75} />
    {[-290, -200, -110].map((px) => <line key={px} x1={px} x2={px} y1={-84} y2={84} stroke={F.kuningTua} strokeWidth={6} />)}
    {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={-330 + i * 36} cy={-60} r={4} fill={F.kuningTua} />)}
    <rect x={-270} y={-30} width={120} height={36} rx={8} fill={NAVY} opacity={0.85} />
    <text x={-210} y={-4} fontFamily="Baloo2" fontWeight={800} fontSize={22} fill={F.kuningMuda} textAnchor="middle" transform={arah === -1 ? "scale(-1 1) translate(420 0)" : undefined}>TBM</text>
    {/* ruang depan (diisi lumpur saat slurry shield) */}
    {lumpur && <path d="M-20 -82 L40 -100 L40 100 L-20 82 Z" fill={F.lumpur} stroke={NAVY} strokeWidth={5} />}
    {/* kepala bor */}
    <g stroke={NAVY} strokeWidth={6}>
      <rect x={-22} y={-104} width={36} height={208} rx={12} fill={F.oranye} />
      <rect x={-16} y={-98} width={10} height={196} rx={5} fill="#FFB27A" strokeWidth={0} />
      {[-84, -50, -16, 18, 52].map((ty) => <path key={ty} d={`M14 ${ty} L40 ${ty + 16} L14 ${ty + 32} Z`} fill={F.baja} />)}
    </g>
  </g>
);

// kepala bor tampak depan
export const KepalaBor: React.FC<{ cx: number; cy: number; r: number }> = ({ cx, cy, r }) => (
  <g strokeLinejoin="round">
    <circle cx={cx} cy={cy + 30} r={r + 30} fill="rgba(10,14,34,.3)" filter="url(#jauh)" />
    <circle cx={cx} cy={cy} r={r + 30} fill={F.kuningTua} stroke={NAVY} strokeWidth={8} />
    {Array.from({ length: 24 }).map((_, i) => {
      const a = (i * Math.PI) / 12;
      return <circle key={i} cx={cx + (r + 15) * Math.cos(a)} cy={cy + (r + 15) * Math.sin(a)} r={5} fill={NAVY} />;
    })}
    <circle cx={cx} cy={cy} r={r} fill={F.kuning} stroke={NAVY} strokeWidth={8} />
    <path d={`M${cx - r * 0.8} ${cy - r * 0.45} A${r} ${r} 0 0 1 ${cx + r * 0.45} ${cy - r * 0.8}`} stroke={F.sorotKuning} strokeWidth={18} fill="none" strokeLinecap="round" opacity={0.8} />
    {Array.from({ length: 6 }).map((_, i) => {
      const a = (i * Math.PI) / 3 + 0.3;
      const b = a + Math.PI / 6;
      return (
        <g key={i}>
          {/* celah masuk lumpur */}
          <path d={`M${cx + r * 0.3 * Math.cos(b - 0.12)} ${cy + r * 0.3 * Math.sin(b - 0.12)} L${cx + r * 0.85 * Math.cos(b - 0.05)} ${cy + r * 0.85 * Math.sin(b - 0.05)} L${cx + r * 0.85 * Math.cos(b + 0.05)} ${cy + r * 0.85 * Math.sin(b + 0.05)} L${cx + r * 0.3 * Math.cos(b + 0.12)} ${cy + r * 0.3 * Math.sin(b + 0.12)} Z`} fill={F.lumpur} opacity={0.85} />
          <line x1={cx} y1={cy} x2={cx + r * 0.96 * Math.cos(a)} y2={cy + r * 0.96 * Math.sin(a)} stroke={NAVY} strokeWidth={58} strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={cx + r * 0.96 * Math.cos(a)} y2={cy + r * 0.96 * Math.sin(a)} stroke={F.kuningTua} strokeWidth={46} strokeLinecap="round" />
          {[0.32, 0.5, 0.68, 0.86].map((t) => (
            <g key={t}>
              <circle cx={cx + r * t * Math.cos(a)} cy={cy + r * t * Math.sin(a)} r={17} fill={F.baja} stroke={NAVY} strokeWidth={5} />
              <circle cx={cx + r * t * Math.cos(a) - 5} cy={cy + r * t * Math.sin(a) - 5} r={5} fill="#FFFFFF" opacity={0.8} />
            </g>
          ))}
        </g>
      );
    })}
    <circle cx={cx} cy={cy} r={r * 0.2} fill={F.oranye} stroke={NAVY} strokeWidth={7} />
    <circle cx={cx - r * 0.05} cy={cy - r * 0.05} r={r * 0.07} fill="#FFB27A" />
  </g>
);

export const busur = (cx: number, cy: number, r1: number, r2: number, a0: number, a1: number) => {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x1, y1] = p(r2, a0);
  const [x2, y2] = p(r2, a1);
  const [x3, y3] = p(r1, a1);
  const [x4, y4] = p(r1, a0);
  const L = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x1} ${y1} A${r2} ${r2} 0 ${L} 1 ${x2} ${y2} L${x3} ${y3} A${r1} ${r1} 0 ${L} 0 ${x4} ${y4} Z`;
};

// cincin beton tampak depan: 6 segmen + lubang baut + sorot tepi dalam
export const Cincin: React.FC<{ cx: number; cy: number; r: number; tebal?: number; kosong?: number; warna?: string }> = ({ cx, cy, r, tebal = 56, kosong, warna = F.beton }) => (
  <g>
    {Array.from({ length: 6 }).map((_, i) => {
      if (i === kosong) return null;
      const a0 = (i * Math.PI) / 3 + 0.03;
      const a1 = ((i + 1) * Math.PI) / 3 - 0.03;
      const tengah = (a0 + a1) / 2;
      return (
        <g key={i}>
          <path d={busur(cx, cy, r - tebal, r, a0, a1)} fill={warna} stroke={NAVY} strokeWidth={6} />
          <path d={busur(cx, cy, r - tebal, r - tebal + 10, a0 + 0.02, a1 - 0.02)} fill={F.betonTua} />
          {[-0.28, 0.28].map((d) => (
            <rect key={d} x={cx + (r - tebal / 2) * Math.cos(tengah + d) - 6} y={cy + (r - tebal / 2) * Math.sin(tengah + d) - 6} width={12} height={12} rx={3} fill={F.betonTua} />
          ))}
        </g>
      );
    })}
  </g>
);

// semburan air cyan dari retakan
export const Semburan: React.FC<{ x: number; y: number; arah?: number; s?: number }> = ({ x, y, arah = 180, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${arah}) scale(${s})`}>
    {[-26, 0, 26].map((d, i) => (
      <path key={i} d={`M0 ${d * 0.3} Q120 ${d} 260 ${d * 2.4} L260 ${d * 2.4 + 26} Q120 ${d + 22} 0 ${d * 0.3 + 14} Z`} fill="url(#gAir)" stroke={NAVY} strokeWidth={4} />
    ))}
    {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={200 + acak(i) * 110} cy={-60 + acak(i + 9) * 130} r={6 + acak(i + 2) * 10} fill={F.busa} />)}
  </g>
);

// retakan zig-zag
// p = progres gambar 0–1 (retakan menjalar di animasi)
export const Retak: React.FC<{ d: string; lebar?: number; warna?: string; p?: number }> = ({ d, lebar = 14, warna = "#0A1030", p = 1 }) => (
  <g strokeLinejoin="round" strokeLinecap="round" fill="none">
    <path d={d} stroke={NAVY} strokeWidth={lebar + 8} pathLength={1} strokeDasharray={`${p} 1`} />
    <path d={d} stroke={warna} strokeWidth={lebar} pathLength={1} strokeDasharray={`${p} 1`} />
  </g>
);

// ---------- teks ----------
export const gayaStroke = (tebal: number): React.CSSProperties => ({
  fontFamily: "Baloo2",
  fontWeight: 800,
  WebkitTextStroke: `${tebal}px ${NAVY}`,
  paintOrder: "stroke fill",
  textShadow: "0 8px 0 rgba(20,28,50,.35)",
  textAlign: "center",
  lineHeight: 1.05,
});
export const Istilah: React.FC<{ teks: string }> = ({ teks }) => (
  <div style={{ position: "absolute", top: 280, left: 60, right: 60, fontSize: 100, color: "#FFD23F", textTransform: "uppercase", ...gayaStroke(12) }}>{teks}</div>
);
// uang: `sisa` (0–1) = animasi hitung mundur saat krisis; di video angka turun terus dari 10 miliar sampai ±0
// mengikuti kalimat "You pump. You patch. It keeps coming… every single dollar" (turun makin cepat, retak di "dollar").
export const formatDolar = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
export const Uang: React.FC<{ top?: number; merah?: boolean; sisa?: number }> = ({ top = 420, merah, sisa = 1 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, fontSize: 104, color: merah ? "#FF4D4D" : F.hijau, fontVariantNumeric: "tabular-nums", ...gayaStroke(12) }}>
    {formatDolar(10_000_000_000 * sisa)}
    {merah && (
      <div style={{ fontSize: 60, color: "#FF4D4D", marginTop: -6 }}>▼ ▼ ▼</div>
    )}
    {merah && sisa < 0.05 && (
      <svg width={W} height={140} style={{ position: "absolute", left: 0, top: -10 }}>
        <path d="M250 20 L330 70 L300 90 L420 120 M560 10 L600 60 L660 50 L720 130" stroke={NAVY} strokeWidth={14} fill="none" strokeLinejoin="round" />
        <path d="M250 20 L330 70 L300 90 L420 120 M560 10 L600 60 L660 50 L720 130" stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinejoin="round" />
      </svg>
    )}
  </div>
);
export const Tulisan: React.FC<{ teks: string; x: number; y: number; ukuran?: number; warna?: string }> = ({ teks, x, y, ukuran = 56, warna = "#FFFFFF" }) => (
  <div style={{ position: "absolute", left: x - 300, top: y, width: 600, fontSize: ukuran, color: warna, ...gayaStroke(8) }}>{teks}</div>
);
export const Subtitle: React.FC<{ teks: string }> = ({ teks }) => (
  <div style={{ position: "absolute", top: 1445, left: 40, right: 40, fontSize: 72, color: "#FFFFFF", ...gayaStroke(11) }}>{teks}</div>
);
const Catatan: React.FC<{ id: string; nama: string; vo: string }> = ({ id, nama, vo }) => (
  <>
    <div style={{ position: "absolute", top: 36, left: 40, padding: "6px 18px", borderRadius: 14, background: "rgba(255,255,255,.9)", color: NAVY, fontFamily: "Baloo2", fontWeight: 800, fontSize: 34 }}>
      {id} · {nama}
    </div>
    <div style={{ position: "absolute", top: 1600, left: 40, right: 40, padding: "18px 24px", borderRadius: 20, background: "rgba(30,42,68,.88)", color: "#F4F8FC", fontFamily: "Baloo2", fontWeight: 700, fontSize: 34, lineHeight: 1.25 }}>
      VO: “{vo}”
    </div>
  </>
);

// peta kemajuan: dua pantai, laut, jalur, bagian yang sudah digali (kuning), posisi mesin
export const Peta: React.FC<{ g: Gali; bahaya?: boolean }> = ({ g, bahaya }) => {
  const x0 = 70, x1 = 530, y = 66;
  const a = g.a ?? 0;
  const b = g.b ?? 0;
  const ya = g.meleset ? y - 9 : y;
  const yb = g.meleset ? y + 9 : y;
  const selesai = a + b >= 1 && !g.meleset;
  return (
    <svg width={600} height={120} style={{ position: "absolute", left: 240, top: 130 }}>
      <rect x={4} y={4} width={592} height={112} rx={22} fill="rgba(20,28,52,.82)" stroke="#FFFFFF" strokeWidth={4} />
      <rect x={60} y={28} width={480} height={22} fill="#3E86C4" />
      <path d="M20 18 L84 18 L100 50 L100 100 L20 100 Z" fill="#E8ECF4" />
      <path d="M580 18 L516 18 L500 50 L500 100 L580 100 Z" fill="#E8ECF4" />
      <rect x={20} y={14} width={64} height={8} fill="#8FCB8E" />
      <rect x={516} y={14} width={64} height={8} fill="#8FCB8E" />
      <line x1={x0} x2={x1} y1={y} y2={y} stroke="#FFFFFF" strokeWidth={4} strokeDasharray="8 8" opacity={0.7} />
      {a > 0 && <line x1={x0} x2={x0 + a * (x1 - x0)} y1={ya} y2={ya} stroke={F.kuning} strokeWidth={10} strokeLinecap="round" />}
      {b > 0 && <line x1={x1 - b * (x1 - x0)} x2={x1} y1={yb} y2={yb} stroke={F.kuning} strokeWidth={10} strokeLinecap="round" />}
      {a > 0 && !selesai && <circle cx={x0 + a * (x1 - x0)} cy={ya} r={11} fill={bahaya ? F.air : F.oranye} stroke="#FFFFFF" strokeWidth={4} />}
      {b > 0 && !selesai && <circle cx={x1 - b * (x1 - x0)} cy={yb} r={11} fill={F.oranye} stroke="#FFFFFF" strokeWidth={4} />}
      {selesai && <circle cx={x0 + a * (x1 - x0)} cy={y} r={13} fill={F.hijau} stroke="#FFFFFF" strokeWidth={4} />}
      <text x={300} y={104} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={26} fill="#FFFFFF">
        {selesai ? "20 / 20 MILES" : g.meleset ? "MISSED!" : `${Math.round((a + b) * 20)} / 20 MILES`}
      </text>
    </svg>
  );
};

// latar darat dekat (siang / malam / kenangan): langit, laut di cakrawala, tebing seberang, rumput, tanah berlapis
export const Darat: React.FC<{ P: Palet }> = ({ P }) => (
  <g>
    <g filter="url(#buram)">
      <Langit P={P} bawah={1240} />
      <rect y={960} width={W} height={300} fill={`url(#gLaut${P.id})`} />
      <rect y={960} width={W} height={8} fill={P.gelap ? "#3A5E92" : "#BFE6FA"} />
      <g filter="url(#jauh)">
        <path d="M640 962 Q780 900 1080 912 V962 Z" fill={P.tebing} />
        <rect x={640} y={955} width={440} height={10} fill={P.rumputTua} />
      </g>
      <Kapal P={P} x={380} y={962} />
      <path d={pita(1200, 14, 4)} fill={P.rumput} />
      <path d={gel(1200, 14, 4)} stroke={P.rumputTua} strokeWidth={6} fill="none" />
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M${acak(i) * W} ${1230 + acak(i + 3) * 120} l8 -22 l8 22`} stroke={P.rumputTua} strokeWidth={5} fill="none" />)}
      <path d={pita(1400, 16, -4)} fill={P.kapur} />
      <path d={gel(1400, 16, -4)} stroke={P.kapurGaris} strokeWidth={6} fill="none" />
      <path d={pita(1560, 18, 4)} fill={P.marl} />
      <Pohon P={P} x={90} y={1210} s={1.6} />
      <Pohon P={P} x={1000} y={1215} s={1.3} />
    </g>
    <Depan P={P} />
  </g>
);

// bingkai kenangan: sudut membulat + tepi hangat buram
export const BingkaiKenangan: React.FC = () => (
  <g>
    <rect x={-60} y={-60} width={W + 120} height={H + 120} rx={160} fill="none" stroke="rgba(120,80,40,.55)" strokeWidth={170} filter="url(#depan)" />
  </g>
);

// ---------- adegan ----------
type Adegan = { nama: string; vo: string; sub: string; istilah?: string; P: Palet; peta?: Gali; bahaya?: boolean; gambar: (P: Palet) => React.ReactNode; teks?: React.ReactNode };

const DUNIA_GALI = (g: Gali) => (P: Palet) => <Dunia P={P} g={g} />;

const ADEGAN: Adegan[] = [
  // ===== BABAK 1 =====
  {
    nama: "Hook — penggali sumur",
    vo: "You're a well digger,",
    sub: "WELL DIGGER",
    P: TERANG,
    gambar: (P) => (
      <>
        <Darat P={P} />
        <ellipse cx={520} cy={1020} rx={430} ry={430} fill={`url(#sorot${P.id})`} />
        <AI n="sumur" x={800} bawah={1330} tinggi={470} />
        <AI n="kaget-1" x={390} bawah={1340} tinggi={740} />
      </>
    ),
  },
  {
    nama: "Orang kaya misterius membuka koper",
    vo: "and you've just been offered ten billion dollars",
    sub: "TEN BILLION DOLLARS",
    P: TERANG,
    gambar: (P) => (
      <>
        <Darat P={P} />
        <ellipse cx={520} cy={1020} rx={430} ry={430} fill={`url(#sorot${P.id})`} />
        <ellipse cx={300} cy={1000} rx={300} ry={360} fill={`url(#sorot${P.id})`} />
        <AI n="kaget-3" x={760} bawah={1340} tinggi={700} flip />
        <AI n="orangkaya-4" x={300} bawah={1340} tinggi={760} />
      </>
    ),
    teks: <Uang top={360} />,
  },
  {
    nama: "Jalan bawah laut, 20 mil",
    vo: "to build a road under the sea. Twenty miles long.",
    sub: "UNDER THE SEA",
    P: TERANG,
    peta: { a: 0 },
    gambar: (P) => (
      <>
        <Dunia P={P} />
        <line x1={X_KIRI} x2={X_KANAN} y1={RUTE_Y} y2={RUTE_Y} stroke="#FFFFFF" strokeWidth={10} strokeDasharray="28 20" />
        <Panah x1={540} y1={RUTE_Y - 80} x2={X_KANAN - 20} y2={RUTE_Y - 80} w={12} warna={F.kuning} />
        <Panah x1={540} y1={RUTE_Y - 80} x2={X_KIRI + 20} y2={RUTE_Y - 80} w={12} warna={F.kuning} />
      </>
    ),
    teks: <Tulisan teks="20 MILES" x={540} y={RUTE_Y - 200} ukuran={70} warna="#FFD23F" />,
  },
  {
    nama: "Dibayar hanya kalau selesai",
    vo: "But you only get paid if it's finished.",
    sub: "ONLY IF IT'S FINISHED",
    P: TERANG,
    gambar: (P) => (
      <>
        <Darat P={P} />
        <ellipse cx={540} cy={960} rx={460} ry={460} fill={`url(#sorot${P.id})`} />
        <g transform="rotate(-4 540 960)" strokeLinejoin="round">
          <rect x={250} y={600} width={580} height={720} rx={20} fill="rgba(10,14,34,.25)" transform="translate(14 18)" />
          <rect x={250} y={600} width={580} height={720} rx={20} fill="#FFFBF2" stroke={NAVY} strokeWidth={7} />
          <text x={540} y={690} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={58} fill={NAVY}>CONTRACT</text>
          {[750, 790, 830, 870].map((y) => <rect key={y} x={300} y={y} width={480 - (y % 3) * 40} height={14} rx={7} fill="#D7DCE8" />)}
          <text x={540} y={970} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={52} fill="#2BB765">$10,000,000,000</text>
          <rect x={300} y={1040} width={70} height={70} rx={10} fill="#FFFFFF" stroke={NAVY} strokeWidth={6} />
          <text x={400} y={1092} fontFamily="Baloo2" fontWeight={800} fontSize={44} fill={NAVY}>TUNNEL FINISHED</text>
          <path d="M300 1200 Q360 1160 420 1200 T540 1196" stroke={NAVY} strokeWidth={5} fill="none" />
        </g>
      </>
    ),
  },
  {
    nama: "Cuma pernah gali sumur",
    vo: "The problem is, you've never dug anything wider than a well.",
    sub: "WIDER THAN A WELL",
    P: TERANG,
    gambar: (P) => (
      <>
        <Batu P={P} benih={3} />
        <ellipse cx={600} cy={980} rx={460} ry={460} fill={`url(#sorot${P.id})`} />
        <circle cx={600} cy={980} r={400} fill="rgba(38,48,79,.35)" stroke="#FFFFFF" strokeWidth={12} strokeDasharray="34 26" />
        {/* lubang sumur (lebar sebenarnya kecil) */}
        <circle cx={600} cy={1260} r={58} fill={`url(#gLorong${P.id})`} stroke={NAVY} strokeWidth={6} />
        <AI n="berdiri" x={400} bawah={1380} tinggi={430} />
      </>
    ),
    teks: (
      <>
        <Tulisan teks="TUNNEL" x={600} y={620} ukuran={64} />
        <Tulisan teks="YOUR WELL" x={760} y={1240} ukuran={40} warna="#FFD23F" />
      </>
    ),
  },
  {
    nama: "Mobil sport bermesin jet",
    vo: "But you really want a jet-powered sports car. So here's how you get the money.",
    sub: "JET-POWERED",
    P: TERANG,
    gambar: (P) => (
      <>
        <Darat P={P} />
        <ellipse cx={600} cy={880} rx={480} ry={320} fill={`url(#sorot${P.id})`} />
        <g stroke={NAVY} strokeWidth={6}>
          <ellipse cx={620} cy={860} rx={430} ry={220} fill="#FFFFFF" />
          <circle cx={300} cy={1120} r={28} fill="#FFFFFF" />
          <circle cx={250} cy={1180} r={17} fill="#FFFFFF" />
        </g>
        <path d={`M260 ${930} H980`} stroke="#D7DCE8" strokeWidth={10} strokeLinecap="round" />
        <AI n="mobil-jet" x={640} bawah={990} tinggi={250} bayang={false} />
        <AI n="melamun" x={230} bawah={1430} tinggi={640} />
      </>
    ),
  },
  // ===== BABAK 2 =====
  {
    nama: "Sekop — seumur hidup",
    vo: "First, you grab a shovel. But one shovel would take your whole life.",
    sub: "YOUR WHOLE LIFE",
    P: TERANG,
    peta: { a: 0.002 },
    gambar: (P) => (
      <>
        <Batu P={P} benih={5} />
        <rect x={0} y={880} width={300} height={500} fill={`url(#gLorong${P.id})`} />
        <rect x={0} y={1380} width={300} height={10} fill={F.bajaTua} />
        <ellipse cx={200} cy={1100} rx={260} ry={300} fill={`url(#sorot${P.id})`} />
        <AI n="menggali-2" x={230} bawah={1390} tinggi={560} />
      </>
    ),
  },
  {
    nama: "Mesin bor raksasa",
    vo: "So you build a giant spinning drill with steel teeth that grinds rock into mud. This is called a tunnel boring machine.",
    sub: "GRINDS ROCK INTO MUD",
    istilah: "Tunnel Boring Machine",
    P: TERANG,
    peta: { a: 0.05 },
    gambar: (P) => (
      <>
        <Batu P={P} benih={7} />
        <ellipse cx={540} cy={1010} rx={500} ry={500} fill={`url(#sorot${P.id})`} />
        <KepalaBor cx={540} cy={1010} r={330} />
        {[0.4, 2.5, 4.6].map((a, i) => (
          <Panah key={i} x1={540 + 372 * Math.cos(a)} y1={1010 + 372 * Math.sin(a)} x2={540 + 372 * Math.cos(a + 0.8)} y2={1010 + 372 * Math.sin(a + 0.8)} w={14} warna="#FFFFFF" />
        ))}
      </>
    ),
  },
  {
    nama: "Dinding runtuh (intens)",
    vo: "But the second you dig, the walls fall in.",
    sub: "THE WALLS FALL IN",
    P: INTENS,
    peta: { a: 0.08 },
    gambar: (P) => (
      <>
        <Batu P={P} benih={9} />
        <rect x={0} y={860} width={720} height={300} fill={`url(#gLorong${P.id})`} />
        <ellipse cx={520} cy={980} rx={440} ry={340} fill={`url(#sorot${P.id})`} />
        <TBM x={1000} y={1010} s={1.05} />
        <Retak d="M80 860 L140 800 L120 740 L190 680" lebar={10} />
        <Retak d="M420 860 L460 790 L430 730" lebar={10} />
        <g stroke={NAVY} strokeWidth={6} strokeLinejoin="round">
          {[
            [170, 930, 48],
            [330, 1040, 62],
            [470, 950, 42],
            [110, 1110, 36],
            [560, 1100, 40],
          ].map(([x, y, r], i) => (
            <g key={i}>
              <path d={`M${x - r} ${y} L${x - r * 0.3} ${y - r} L${x + r} ${y - r * 0.4} L${x + r * 0.6} ${y + r * 0.8} L${x - r * 0.5} ${y + r * 0.7} Z`} fill="#7D88AC" />
              <path d={`M${x - r * 0.6} ${y - r * 0.3} L${x - r * 0.2} ${y - r * 0.8} L${x + r * 0.5} ${y - r * 0.4}`} stroke="#A9B3D0" strokeWidth={5} fill="none" />
            </g>
          ))}
        </g>
        {[170, 330, 470].map((x) => <line key={x} x1={x} x2={x} y1={760} y2={850} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />)}
      </>
    ),
  },
  {
    nama: "Cincin beton",
    vo: "So a robot arm bolts concrete blocks into a ring behind the drill. Ring after ring. This is called a segment lining.",
    sub: "RING AFTER RING",
    istilah: "Segment Lining",
    P: TERANG,
    peta: { a: 0.15 },
    gambar: (P) => (
      <>
        <Batu P={P} benih={11} />
        <ellipse cx={540} cy={1010} rx={500} ry={500} fill={`url(#sorot${P.id})`} />
        <circle cx={540} cy={1010} r={360} fill={P.marlGaris} stroke={NAVY} strokeWidth={6} />
        <circle cx={540} cy={1010} r={290} fill={`url(#gLorong${P.id})`} />
        <Cincin cx={540} cy={1010} r={350} kosong={4} />
        {/* lengan robot memasang segmen ke-5 */}
        <g stroke={NAVY} strokeWidth={6} strokeLinejoin="round">
          <rect x={520} y={790} width={40} height={220} rx={18} fill={F.kuning} />
          <rect x={500} y={770} width={80} height={36} rx={12} fill={F.kuningTua} />
          <circle cx={540} cy={1010} r={50} fill={F.kuning} />
          <circle cx={540} cy={1010} r={20} fill={F.kuningTua} />
          <path d={busur(540, 1010, 236, 292, (4 * Math.PI) / 3 + 0.03, (5 * Math.PI) / 3 - 0.03)} fill={F.beton} />
        </g>
        <Panah x1={540} y1={700} x2={540} y2={660} w={12} warna={F.oranye} />
      </>
    ),
  },
  {
    nama: "Air menekan (intens)",
    vo: "But three hundred feet under the sea, water presses on every inch.",
    sub: "300 FEET UNDER THE SEA",
    P: INTENS,
    peta: { a: 0.3 },
    gambar: (P) => (
      <>
        <Batu P={P} laut={440} benih={13} />
        <ellipse cx={600} cy={1080} rx={420} ry={420} fill={`url(#sorot${P.id})`} />
        <circle cx={600} cy={1080} r={196} fill={`url(#gLorong${P.id})`} />
        <Cincin cx={600} cy={1080} r={232} tebal={40} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return <Panah key={i} x1={600 + 410 * Math.cos(a)} y1={1080 + 410 * Math.sin(a)} x2={600 + 262 * Math.cos(a)} y2={1080 + 262 * Math.sin(a)} w={14} warna={F.air} />;
        })}
        <g stroke="#FFFFFF" strokeWidth={5}>
          <line x1={110} x2={110} y1={20} y2={1080} strokeDasharray="14 10" />
          <line x1={90} x2={130} y1={1080} y2={1080} />
        </g>
      </>
    ),
    teks: <Tulisan teks="300 FT" x={190} y={1110} ukuran={58} warna="#FFD23F" />,
  },
  {
    nama: "Grouting",
    vo: "So you pump liquid concrete behind every ring and seal it tight. This is called grouting.",
    sub: "SEAL IT TIGHT",
    istilah: "Grouting",
    P: TERANG,
    peta: { a: 0.4 },
    gambar: (P) => (
      <>
        <Batu P={P} laut={440} benih={15} />
        <ellipse cx={540} cy={1080} rx={460} ry={460} fill={`url(#sorot${P.id})`} />
        <circle cx={540} cy={1080} r={370} fill="#9AA3B5" stroke={NAVY} strokeWidth={6} />
        {Array.from({ length: 20 }).map((_, i) => {
          const a = (i * Math.PI) / 10;
          return <circle key={i} cx={540 + 350 * Math.cos(a)} cy={1080 + 350 * Math.sin(a)} r={7} fill="#7E879B" />;
        })}
        <circle cx={540} cy={1080} r={250} fill={`url(#gLorong${P.id})`} />
        <Cincin cx={540} cy={1080} r={330} tebal={80} />
        <Panah x1={540} y1={640} x2={540} y2={700} w={12} warna="#FFFFFF" />
        {[0.8, 2.3].map((a, i) => (
          <g key={i} transform={`translate(${540 + 440 * Math.cos(a)} ${1080 + 440 * Math.sin(a)})`}>
            <path d="M0 -40 Q24 -6 24 12 A24 24 0 0 1 -24 12 Q-24 -6 0 -40 Z" fill={F.air} stroke={NAVY} strokeWidth={5} />
            <path d="M-34 -34 L34 40 M34 -34 L-34 40" stroke={F.merah} strokeWidth={12} strokeLinecap="round" />
          </g>
        ))}
      </>
    ),
    teks: <Tulisan teks="CONCRETE" x={540} y={570} ukuran={50} />,
  },
  {
    nama: "KRISIS — retakan menyembur",
    vo: "Then, halfway under the sea, your drill hits a crack in the rock. A crack full of seawater. It blasts in. Thousands of gallons a minute.",
    sub: "IT BLASTS IN",
    P: INTENS,
    peta: { a: 0.5 },
    bahaya: true,
    gambar: (P) => (
      <>
        <Batu P={P} laut={420} benih={17} />
        <LorongSamping P={P} x0={0} x1={760} cy={1080} h={300} />
        <ellipse cx={700} cy={1060} rx={420} ry={380} fill={`url(#sorot${P.id})`} />
        <TBM x={820} y={1080} s={0.95} />
        {/* retakan dari dasar laut turun ke muka bor */}
        <Retak d="M980 470 L940 600 L1000 720 L930 860 L990 980 L900 1080" lebar={16} warna={F.air} />
        <Semburan x={880} y={1000} arah={190} s={1.25} />
        <Semburan x={900} y={1130} arah={170} s={1} />
      </>
    ),
  },
  {
    nama: "KRISIS — banjir, uang hilang",
    vo: "You pump. You patch. It keeps coming. If the tunnel floods, you lose the machine, the tunnel, and every single dollar.",
    sub: "EVERY SINGLE DOLLAR",
    P: INTENS,
    peta: { a: 0.5 },
    bahaya: true,
    gambar: (P) => (
      <>
        <Batu P={P} benih={19} />
        <LorongSamping P={P} x0={0} x1={1080} cy={1060} h={380} />
        {/* air naik di dalam lorong */}
        <rect x={0} y={1010} width={1080} height={236} fill="url(#gAir)" opacity={0.92} />
        <path d="M0 1010 Q60 994 120 1010 T240 1010 T360 1010 T480 1010 T600 1010 T720 1010 T840 1010 T960 1010 T1080 1010" stroke={F.busa} strokeWidth={8} fill="none" />
        <ellipse cx={420} cy={1000} rx={340} ry={300} fill={`url(#sorot${P.id})`} />
        <TBM x={1040} y={1060} s={0.9} />
        <AI n="pompa" x={720} bawah={1200} tinggi={150} bayang={false} />
        <AI n="menimba-2" x={330} bawah={1215} tinggi={520} bayang={false} />
        <rect x={0} y={1090} width={1080} height={156} fill="url(#gAir)" opacity={0.6} />
      </>
    ),
    teks: <Uang top={420} merah sisa={0.3482917} />,
  },
  {
    nama: "Hampir menyerah — di sumur",
    vo: "So you go home. You sit against the very first well you ever dug… and you think about quitting.",
    sub: "THINK ABOUT QUITTING",
    P: { ...INTENS, rumput: "#2A4A4E", rumputTua: "#1F3A40" },
    gambar: (P) => (
      <>
        <Darat P={P} />
        <ellipse cx={560} cy={1120} rx={420} ry={360} fill="url(#sorotBulan)" />
        <AI n="sumur" x={330} bawah={1350} tinggi={560} filter="malam" />
        <AI n="ide-1" x={770} bawah={1360} tinggi={500} filter="tokohMalam" />
      </>
    ),
  },
  {
    nama: "Teringat — dapat ide",
    vo: "And then you remember.",
    sub: "THEN YOU REMEMBER",
    P: { ...INTENS, rumput: "#2A4A4E", rumputTua: "#1F3A40" },
    gambar: (P) => (
      <>
        <Darat P={P} />
        <ellipse cx={560} cy={1100} rx={460} ry={400} fill={`url(#sorot${P.id})`} />
        <AI n="sumur" x={330} bawah={1350} tinggi={560} filter="malam" />
        <AI n="ide-4" x={770} bawah={1360} tinggi={500} />
      </>
    ),
  },
  {
    nama: "Kenangan — sumur kebanjiran",
    vo: "When you drilled this well, water burst in too.",
    sub: "WATER BURST IN TOO",
    P: KENANGAN,
    gambar: (P) => (
      <>
        <g filter="url(#buram)">
          <Langit P={P} bawah={560} />
          <path d={pita(540, 10, 2)} fill={P.rumput} />
          <Lapisan P={P} dasar={600} batasMarl={900} batasLempung={1300} benih={21} />
        </g>
        {/* lubang sumur tampak potong */}
        <rect x={430} y={540} width={220} height={900} fill={`url(#gLorong${P.id})`} stroke={NAVY} strokeWidth={6} />
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={i}>
            <rect x={414} y={560 + i * 72} width={22} height={64} rx={6} fill={F.baja} stroke={NAVY} strokeWidth={4} />
            <rect x={644} y={560 + i * 72} width={22} height={64} rx={6} fill={F.baja} stroke={NAVY} strokeWidth={4} />
          </g>
        ))}
        <ellipse cx={540} cy={1180} rx={220} ry={240} fill={`url(#sorot${P.id})`} />
        <rect x={436} y={1260} width={208} height={176} fill="url(#gAir)" />
        <Semburan x={660} y={1150} arah={175} s={0.8} />
        <AI n="panik" x={540} bawah={1300} tinggi={300} filter="kenangan" bayang={false} />
        <BingkaiKenangan />
      </>
    ),
    teks: <Tulisan teks="YEARS AGO" x={540} y={300} ukuran={56} warna="#FFE7B0" />,
  },
  {
    nama: "Kenangan — lumpur tanah liat",
    vo: "So you poured in thick clay mud, heavier than water. It pushed the water back, and stuck to the walls like plaster.",
    sub: "STUCK LIKE PLASTER",
    P: KENANGAN,
    gambar: (P) => (
      <>
        <g filter="url(#buram)">
          <Langit P={P} bawah={560} />
          <path d={pita(540, 10, 2)} fill={P.rumput} />
          <Lapisan P={P} dasar={600} batasMarl={900} batasLempung={1300} benih={21} />
        </g>
        <rect x={430} y={540} width={220} height={900} fill={`url(#gLorong${P.id})`} stroke={NAVY} strokeWidth={6} />
        {/* lumpur coklat mengisi lubang & melapisi dinding */}
        <rect x={436} y={820} width={208} height={616} fill={F.lumpur} />
        {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={460 + acak(i) * 160} cy={860 + acak(i + 7) * 540} r={8 + acak(i + 2) * 10} fill={F.lumpurMuda} />)}
        <rect x={420} y={820} width={16} height={616} fill={F.lumpurMuda} stroke={NAVY} strokeWidth={4} />
        <rect x={644} y={820} width={16} height={616} fill={F.lumpurMuda} stroke={NAVY} strokeWidth={4} />
        <rect x={436} y={540} width={44} height={290} rx={18} fill={F.lumpur} />
        <AI n="menuang-3" x={410} bawah={548} tinggi={420} filter="kenangan" bayang={false} />
        {[900, 1060, 1220].map((y) => <Panah key={y} x1={660} y1={y} x2={760} y2={y} w={14} warna={F.lumpurMuda} />)}
        {[900, 1060, 1220].map((y) => <Panah key={`a${y}`} x1={900} y1={y + 30} x2={800} y2={y + 30} w={10} warna={F.air} />)}
        <BingkaiKenangan />
      </>
    ),
    teks: <Tulisan teks="CLAY MUD" x={540} y={1180} ukuran={50} warna="#FFE7B0" />,
  },
  {
    nama: "Slurry shield",
    vo: "So you go back down. You seal the front of the drill, and fill it with that same clay mud, pumped in hard. It pushes the sea back, and plugs the crack. This is called a slurry shield.",
    sub: "PLUGS THE CRACK",
    istilah: "Slurry Shield",
    P: TERANG,
    peta: { a: 0.5 },
    gambar: (P) => (
      <>
        <Batu P={P} laut={420} benih={17} />
        <LorongSamping P={P} x0={0} x1={500} cy={1080} h={300} />
        <ellipse cx={720} cy={1060} rx={420} ry={380} fill={`url(#sorot${P.id})`} />
        <TBM x={760} y={1080} s={0.95} lumpur />
        {/* retakan tersumbat lumpur */}
        <Retak d="M980 470 L940 600 L1000 720 L930 860 L990 980 L880 1080" lebar={16} warna={F.lumpur} />
        <circle cx={880} cy={1080} r={40} fill={F.lumpur} stroke={NAVY} strokeWidth={5} />
        {[960, 1080, 1200].map((y) => <Panah key={y} x1={820} y1={y} x2={930} y2={y} w={14} warna={F.lumpurMuda} />)}
        <Panah x1={1000} y1={600} x2={1000} y2={500} w={14} warna={F.air} />
      </>
    ),
  },
  {
    nama: "Tokyo Bay",
    vo: "The tunnel under Tokyo Bay was dug with machines just like it.",
    sub: "TOKYO BAY",
    P: TERANG,
    gambar: (P) => (
      <>
        <Batu P={P} laut={380} benih={23} />
        <ellipse cx={540} cy={1060} rx={520} ry={520} fill={`url(#sorot${P.id})`} />
        <KepalaBor cx={540} cy={1060} r={360} />
        <AI n="berdiri" x={540} bawah={1480} tinggi={150} />
        <Panah x1={150} y1={1500} x2={150} y2={640} w={10} warna="#FFFFFF" />
      </>
    ),
    teks: <Tulisan teks="46 FT" x={150} y={560} ukuran={52} warna="#FFD23F" />,
  },
  // ===== BABAK 3 =====
  {
    nama: "Gali dari dua negara",
    vo: "But now you're months behind. So you dig from both countries at once, toward each other, in the dark.",
    sub: "BOTH COUNTRIES",
    P: TERANG,
    peta: { a: 0.55, b: 0.2 },
    gambar: DUNIA_GALI({ a: 0.55, b: 0.2, mesin: true }),
  },
  {
    nama: "Meleset = dua lubang mahal (intens)",
    vo: "Miss by a few feet, and you've built two very expensive holes.",
    sub: "TWO EXPENSIVE HOLES",
    P: INTENS,
    peta: { a: 0.62, b: 0.45, meleset: true },
    gambar: (P) => (
      <>
        <Dunia P={P} g={{ a: 0.62, b: 0.45, meleset: true, mesin: true }} />
        <path d="M480 1180 L600 1300 M600 1180 L480 1300" stroke={F.merah} strokeWidth={22} strokeLinecap="round" />
      </>
    ),
  },
  {
    nama: "Laser memandu",
    vo: "So lasers guide both machines.",
    sub: "LASERS GUIDE THEM",
    P: TERANG,
    peta: { a: 0.6, b: 0.33 },
    gambar: DUNIA_GALI({ a: 0.6, b: 0.33, mesin: true, laser: true }),
  },
  {
    nama: "Breakthrough",
    vo: "And they meet. Less than two feet apart. This is called the breakthrough.",
    sub: "THEY MEET",
    istilah: "Breakthrough",
    P: TERANG,
    peta: { a: 0.62, b: 0.38 },
    gambar: (P) => (
      <>
        <Batu P={P} benih={25} />
        <LorongSamping P={P} x0={0} x1={330} cy={1060} h={260} />
        <LorongSamping P={P} x0={750} x1={1080} cy={1060} h={260} />
        <ellipse cx={540} cy={1060} rx={300} ry={300} fill={`url(#sorot${P.id})`} />
        <ellipse cx={540} cy={1060} rx={100} ry={170} fill="#FFF3C4" filter="url(#jauh)" />
        <TBM x={505} y={1060} s={0.85} />
        <TBM x={575} y={1060} s={0.85} arah={-1} />
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx={540 + (acak(i) - 0.5) * 160} cy={880 + acak(i + 4) * 60} r={10 + acak(i + 1) * 12} fill="#8F9DBB" stroke={NAVY} strokeWidth={4} />
        ))}
      </>
    ),
    teks: <Tulisan teks="< 2 FT" x={540} y={1250} ukuran={58} warna="#FFD23F" />,
  },
  {
    nama: "Dapat uang + mobil jet",
    vo: "You get your ten billion dollars, and you buy the jet-powered sports car.",
    sub: "YOU GET THE MONEY",
    P: TERANG,
    peta: { a: 1 },
    gambar: (P) => (
      <>
        <Dunia P={P} g={{ a: 1, mobil: true }} />
        <AI n="lompat-3" x={985} bawah={600} tinggi={250} bayang={false} />
      </>
    ),
    teks: <Uang top={262} />,
  },
  {
    nama: "Mesin bor tak bisa mundur",
    vo: "Just one problem: your giant drill can't back out.",
    sub: "CAN'T BACK OUT",
    P: TERANG,
    peta: { a: 1 },
    gambar: (P) => (
      <>
        <Batu P={P} benih={27} />
        <LorongSamping P={P} x0={0} x1={1080} cy={1040} h={300} />
        <ellipse cx={600} cy={1040} rx={400} ry={300} fill={`url(#sorot${P.id})`} />
        <TBM x={900} y={1040} s={1} />
        <path d="M300 900 L230 900" stroke={F.merah} strokeWidth={0} />
        <g transform="translate(260 1040)">
          <Panah x1={60} y1={0} x2={-80} y2={0} w={16} warna="#FFFFFF" />
          <path d="M-60 -60 L40 60 M40 -60 L-60 60" stroke={F.merah} strokeWidth={18} strokeLinecap="round" />
        </g>
      </>
    ),
  },
  {
    nama: "Dikubur — masih di sana",
    vo: "So you bury it under the sea. It's still down there.",
    sub: "IT'S STILL DOWN THERE",
    P: TERANG,
    peta: { a: 1 },
    gambar: (P) => (
      <>
        <Batu P={P} laut={300} benih={29} />
        <LorongSamping P={P} x0={0} x1={1080} cy={760} h={240} />
        <path d="M620 880 L1000 1240 L900 1390 L540 1000 Z" fill={`url(#gLorong${P.id})`} opacity={0.85} />
        <ellipse cx={830} cy={1250} rx={300} ry={260} fill={`url(#sorot${P.id})`} />
        <TBM x={950} y={1330} s={0.72} miring={42} />
        <Panah x1={480} y1={1060} x2={660} y2={1230} w={14} warna="#FFFFFF" />
      </>
    ),
  },
];

export const JUMLAH_TW = ADEGAN.length;

export const GambarTW: React.FC<{ n: number }> = ({ n }) => {
  const a = ADEGAN[n];
  const id = `TW${String(n + 1).padStart(2, "0")}`;
  return (
    <AbsoluteFill style={{ background: a.P.langitAtas }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <Defs P={a.P} />
        {a.gambar(a.P)}
        <rect width={W} height={H} fill={`url(#vinyet${a.P.id})`} />
      </svg>
      {a.peta && <Peta g={a.peta} bahaya={a.bahaya} />}
      {a.teks}
      {a.istilah && <Istilah teks={a.istilah} />}
      <Subtitle teks={a.sub} />
      <Catatan id={id} nama={a.nama} vo={a.vo} />
    </AbsoluteFill>
  );
};
