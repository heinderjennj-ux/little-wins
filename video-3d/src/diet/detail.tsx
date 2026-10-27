// Benda kecil bercerita + tempat hook (rumah kontrakan malam, ruang tamu hangat lewat celah pintu, lorong gelap).
// Aturan: bentuk persegi membulat, garis warna benda (bukan hitam), detail kecil di pinggir — tengah tetap untuk tokoh.
import React from "react";
import { Palet } from "./warna";
import { useF } from "./waktu";

const R: React.FC<React.SVGProps<SVGRectElement> & { r?: number }> = ({ r = 14, ...p }) => <rect rx={r} ry={r} {...p} />;
type P = { P: Palet };

// ---------- benda kecil ----------
export const KalenderDinding: React.FC<P & { x: number; y: number; s?: number }> = ({ P, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={60} cy={-6} r={6} fill={P.garis} />
    <R width={120} height={160} r={8} fill="#FBF7EC" stroke={P.garis} strokeWidth={4} />
    <R x={8} y={8} width={104} height={56} r={6} fill={P.luar} />
    <path d="M8 64 L40 30 L64 50 L84 36 L112 64 Z" fill={P.luarTua} />
    <rect x={8} y={68} width={104} height={14} fill="#D9534F" opacity={0.85} />
    {Array.from({ length: 20 }).map((_, i) => (
      <rect key={i} x={12 + (i % 5) * 20} y={88 + Math.floor(i / 5) * 16} width={12} height={9} rx={2} fill={i === 13 ? "#D9534F" : P.perabotTua} opacity={0.55} />
    ))}
  </g>
);

export const KipasDinding: React.FC<P & { x: number; y: number; s?: number }> = ({ P, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <R x={-14} y={-10} width={28} height={70} r={10} fill={P.perabotMuda} stroke={P.garis} strokeWidth={4} />
    <circle cx={0} cy={-40} r={70} fill={P.perabotMuda} opacity={0.35} stroke={P.garis} strokeWidth={4} />
    {Array.from({ length: 7 }).map((_, i) => (
      <line key={i} x1={0} y1={-40} x2={Math.cos((i * Math.PI) / 3.5) * 70} y2={-40 + Math.sin((i * Math.PI) / 3.5) * 70} stroke={P.garis} strokeWidth={2} opacity={0.6} />
    ))}
    {[0, 120, 240].map((a) => (
      <ellipse key={a} cx={0} cy={-62} rx={16} ry={26} fill={P.aksen} transform={`rotate(${a} 0 -40)`} />
    ))}
    <circle cx={0} cy={-40} r={14} fill={P.aksen2} stroke={P.garis} strokeWidth={3} />
  </g>
);

// gantungan sutil & wajan
export const Gantungan: React.FC<P & { x: number; y: number; w: number }> = ({ P, x, y, w }) => (
  <g>
    <R x={x} y={y} width={w} height={12} r={6} fill={P.logamTua} />
    {[0, 1, 2, 3].map((i) => {
      const gx = x + 40 + i * ((w - 80) / 3);
      return (
        <g key={i}>
          <line x1={gx} y1={y + 6} x2={gx} y2={y + 34} stroke={P.garis} strokeWidth={4} />
          {i === 1 ? (
            <g>
              <circle cx={gx} cy={y + 100} r={60} fill={P.perabotTua} stroke={P.garis} strokeWidth={4} />
              <circle cx={gx} cy={y + 100} r={44} fill={P.perabot} />
            </g>
          ) : (
            <g>
              <R x={gx - 6} y={y + 30} width={12} height={90} r={6} fill={P.kayuTua} />
              <R x={gx - 20} y={y + 112} width={40} height={i === 2 ? 50 : 34} r={i === 2 ? 20 : 8} fill={P.logam} stroke={P.garis} strokeWidth={3} />
            </g>
          )}
        </g>
      );
    })}
  </g>
);

export const Termos: React.FC<P & { x: number; y: number; s?: number }> = ({ P, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <R x={-36} y={-150} width={72} height={150} r={22} fill="#D9534F" stroke={P.garis} strokeWidth={4} opacity={0.9} />
    <R x={-30} y={-170} width={60} height={30} r={10} fill={P.perabotMuda} stroke={P.garis} strokeWidth={4} />
    <rect x={-36} y={-100} width={72} height={16} fill="#F2E4C4" opacity={0.8} />
  </g>
);

export const Bakul: React.FC<P & { x: number; y: number; s?: number }> = ({ P, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70 -80 h140 l-16 80 h-108 Z" fill="#C9A46A" stroke={P.garis} strokeWidth={4} strokeLinejoin="round" />
    {[0, 1, 2, 3].map((i) => (
      <line key={i} x1={-66 + i * 4} y1={-62 + i * 18} x2={66 - i * 4} y2={-62 + i * 18} stroke="#A9844E" strokeWidth={3} />
    ))}
    <ellipse cx={0} cy={-82} rx={72} ry={18} fill="#F7F3EA" stroke={P.garis} strokeWidth={4} />
  </g>
);

export const Cobek: React.FC<P & { x: number; y: number }> = ({ P, x, y }) => (
  <g>
    <ellipse cx={x} cy={y - 18} rx={80} ry={26} fill={P.perabotTua} stroke={P.garis} strokeWidth={4} />
    <ellipse cx={x} cy={y - 24} rx={60} ry={16} fill="#C7473A" opacity={0.8} />
    <R x={x + 20} y={y - 80} width={26} height={70} r={13} fill={P.perabotTua} stroke={P.garis} strokeWidth={4} transform={`rotate(30 ${x + 33} ${y - 45})`} />
  </g>
);

export const LapKotak: React.FC<P & { x: number; y: number; w?: number; h?: number }> = ({ P, x, y, w = 90, h = 130 }) => (
  <g>
    <R x={x} y={y} width={w} height={h} r={8} fill="#F4EFF8" stroke={P.garis} strokeWidth={4} />
    {[1, 2, 3].map((i) => (
      <rect key={i} x={x + (w / 4) * i - 5} y={y} width={10} height={h} fill={P.perabot} opacity={0.6} />
    ))}
    {[1, 2, 3, 4].map((i) => (
      <rect key={`h${i}`} x={x} y={y + (h / 5) * i - 5} width={w} height={10} fill={P.perabot} opacity={0.45} />
    ))}
  </g>
);

export const Galon: React.FC<P & { x: number; y: number; s?: number }> = ({ P, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <R x={-70} y={-120} width={140} height={120} r={18} fill={P.perabotTua} stroke={P.garis} strokeWidth={4} />
    <R x={-64} y={-330} width={128} height={210} r={40} fill="rgba(170,200,240,.55)" stroke={P.garis} strokeWidth={4} />
    <rect x={-64} y={-260} width={128} height={10} fill={P.garis} opacity={0.25} />
    <R x={-22} y={-352} width={44} height={30} r={8} fill="#5B8BD9" />
  </g>
);

export const FotoNikah: React.FC<P & { x: number; y: number; s?: number; redup?: boolean }> = ({ P, x, y, s = 1, redup }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={redup ? 0.75 : 1}>
    <R width={170} height={210} r={10} fill="#C9A35A" stroke={P.garis} strokeWidth={4} />
    <R x={16} y={16} width={138} height={178} r={6} fill={P.kaca} />
    <circle cx={60} cy={86} r={24} fill="#C68E62" />
    <path d="M36 82 q24 -40 48 0" fill="#2A1A12" />
    <circle cx={110} cy={90} r={24} fill="#C68E62" />
    <path d="M86 92 q24 -44 48 0 v30 h-48 Z" fill="#2A1A12" />
    <path d="M28 194 q32 -84 64 0 Z" fill="#2E3A66" />
    <path d="M78 194 q32 -84 64 0 Z" fill="#F4EEE2" />
  </g>
);

export const Saklar: React.FC<P & { x: number; y: number }> = ({ P, x, y }) => (
  <g>
    <R x={x} y={y} width={46} height={70} r={8} fill={P.perabotMuda} stroke={P.garis} strokeWidth={3} />
    <R x={x + 15} y={y + 16} width={16} height={26} r={5} fill={P.perabot} />
  </g>
);

export const Magnet: React.FC<{ x: number; y: number; w: number; h: number; c: string; rot?: number }> = ({ x, y, w, h, c, rot = 0 }) => (
  <g transform={`rotate(${rot} ${x + w / 2} ${y + h / 2})`}>
    <rect x={x} y={y} width={w} height={h} rx={4} fill={c} />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={x + 10} y={y + 16 + i * 16} width={w - 20} height={5} rx={2} fill="rgba(60,50,80,.35)" />
    ))}
  </g>
);

export const TudungSaji: React.FC<P & { x: number; y: number; s?: number }> = ({ P, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-110 0 Q-100 -110 0 -120 Q100 -110 110 0 Z" fill="#D9A441" stroke={P.garis} strokeWidth={4} opacity={0.92} />
    {[-70, -35, 0, 35, 70].map((dx) => (
      <line key={dx} x1={dx * 0.3} y1={-118} x2={dx * 1.45} y2={0} stroke="#B9862E" strokeWidth={3} />
    ))}
    <circle cx={0} cy={-124} r={12} fill="#B9862E" />
  </g>
);

// ---------- lapisan depan (DOF): siluet buram di tepi layar ----------
export const DepanToples: React.FC<{ x: number; y: number; s?: number; warna?: string }> = ({ x, y, s = 1, warna = "#3A3F6E" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-300} width={240} height={300} rx={50} fill={warna} />
    <rect x={-130} y={-340} width={260} height={60} rx={20} fill={warna} opacity={0.9} />
  </g>
);
export const DepanDaun: React.FC<{ x: number; y: number; s?: number; warna?: string; flip?: boolean }> = ({ x, y, s = 1, warna = "#2E4A4A", flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {[-40, -10, 20].map((a, i) => (
      <ellipse key={i} cx={i * 40} cy={-160} rx={46} ry={190} fill={warna} transform={`rotate(${a} ${i * 40} 0)`} />
    ))}
  </g>
);

// ---------- hook: rumah kontrakan malam (gerimis) ----------
export const RumahMalam: React.FC = () => {
  const f = useF();
  const jendela = "#F2B65A";
  // lampu redup-nyala pelan (bukan kedip cepat); tiap sumber cahaya beda fase
  const nyala = (fase: number, cepat = 1) => 0.78 + 0.22 * Math.sin(f / (19 * cepat) + fase) * Math.sin(f / (47 * cepat) + fase * 2);
  // siluet di jendela bicara bergantian: kepala naik-turun (terlihat dari luar)
  const bicara = (fase: number) => (Math.sin(f / 30 + fase) > 0 ? 4 + 4 * Math.sin(f / 2.7 + fase) : 2 * Math.sin(f / 23 + fase));
  return (
    <g>
      <defs>
        <linearGradient id="langitMalam" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#161B40" />
          <stop offset="1" stopColor="#2E3568" />
        </linearGradient>
        <radialGradient id="jendelaG">
          <stop offset="0" stopColor="#FFD892" />
          <stop offset="1" stopColor="#E59A44" />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#langitMalam)" />
      {/* awan */}
      {[[200, 330, 340], [760, 270, 420], [520, 440, 300]].map(([x, y, w], i) => (
        <rect key={i} x={x - w / 2} y={y} width={w} height={90} rx={45} fill="#2A3166" />
      ))}
      <circle cx={860} cy={560} r={46} fill="#E9E2C4" opacity={0.85} />
      {/* seluruh rumah & lingkungannya dinaikkan supaya detail (anjing, rumput, kotak surat) di atas subtitle */}
      <g transform="translate(0 -230)">
      {/* lapisan jauh: deretan rumah kampung, jendela menyala */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <path d={`M${i * 200 - 40} 1000 l110 -90 l110 90 Z`} fill="#22285A" />
          <rect x={i * 200 - 30} y={1000} width={200} height={180} fill="#262D60" />
          {i % 2 === 0 && <rect x={i * 200 + 30} y={1040} width={46} height={40} rx={4} fill={jendela} opacity={0.75 * nyala(i * 1.3)} />}
          {i % 3 === 1 && <rect x={i * 200 + 100} y={1050} width={40} height={36} rx={4} fill={jendela} opacity={0.6 * nyala(i * 2.1)} />}
        </g>
      ))}
      {/* lapisan paling jauh: blok bangunan tinggi di kiri-kanan, jendela menyala */}
      {[[-40, 640, 220], [200, 760, 150], [780, 700, 170], [930, 600, 200]].map(([x, y, w], i) => (
        <g key={`b${i}`}>
          <rect x={x} y={y} width={w} height={1100 - y} fill="#1F2552" />
          {Array.from({ length: 12 }).map((_, k) => (
            <rect key={k} x={x + 20 + (k % 3) * (w / 3.4)} y={y + 30 + Math.floor(k / 3) * 70} width={26} height={30} rx={3} fill="#F2B65A" opacity={(i * 7 + k * 5) % 3 === 0 ? 0.8 * nyala(i * 1.7 + k, 0.9) : 0.12} />
          ))}
        </g>
      ))}
      {/* tiang listrik & kabel */}
      <rect x={960} y={640} width={18} height={900} fill="#1B2048" />
      <rect x={910} y={690} width={120} height={12} rx={6} fill="#1B2048" />
      <path d="M-20 760 Q480 860 1000 700" stroke="#151A3C" strokeWidth={4} fill="none" />
      <path d="M-20 800 Q480 900 1000 730" stroke="#151A3C" strokeWidth={3} fill="none" />
      {/* rumah kontrakan */}
      <path d="M90 1080 L540 860 L990 1080 Z" fill="#5A3E56" stroke="#3A2840" strokeWidth={6} strokeLinejoin="round" />
      {Array.from({ length: 6 }).map((_, i) => (
        <line key={i} x1={150 + i * 10} y1={1060 - i * 32} x2={930 - i * 10} y2={1060 - i * 32} stroke="#4A3248" strokeWidth={4} opacity={0.7} />
      ))}
      <rect x={130} y={1080} width={820} height={420} fill="#9C98B8" />
      <rect x={130} y={1080} width={820} height={26} fill="#7E7AA0" />
      {/* jendela besar: tirai merah + siluet suami & mertua */}
      <R x={200} y={1150} width={420} height={260} r={10} fill="#3A2A30" stroke="#4A3A40" strokeWidth={8} />
      <R x={200} y={1150} width={420} height={260} r={10} fill="url(#jendelaG)" opacity={nyala(0.4, 0.8)} />
      <path d="M204 1154 h70 q-20 120 10 252 h-80 Z" fill="#B0443E" />
      <path d="M616 1154 h-70 q20 120 -10 252 h80 Z" fill="#B0443E" />
      <g transform={`translate(0 ${bicara(0)})`}><circle cx={360} cy={1260} r={40} fill="#6A3A2A" /></g>
      <path d="M300 1410 q60 -130 120 0 Z" fill="#6A3A2A" />
      <g transform={`translate(0 ${bicara(Math.PI)})`}>
        <circle cx={470} cy={1268} r={36} fill="#6A3A2A" />
        <circle cx={492} cy={1236} r={18} fill="#6A3A2A" />
      </g>
      <path d="M418 1410 q52 -120 104 0 Z" fill="#6A3A2A" />
      <rect x={408} y={1150} width={8} height={260} fill="#4A3A40" />
      {/* pintu + lampu teras */}
      <R x={700} y={1170} width={170} height={330} r={8} fill="#4A3E5E" stroke="#2E2640" strokeWidth={6} />
      <circle cx={845} cy={1340} r={9} fill="#C9A35A" />
      <g opacity={nyala(2.2, 0.6)}>
        <circle cx={660} cy={1130} r={16} fill="#FFE0A0" />
        <circle cx={660} cy={1130} r={60} fill="rgba(255,214,150,.25)" />
      </g>
      {/* detail bangunan (audit A1): roster ventilasi, talang, nomor rumah, kotak surat, kanopi, AC */}
      {Array.from({ length: 6 }).map((_, i) => <rect key={`v${i}`} x={250 + i * 56} y={1112} width={40} height={24} rx={4} fill="#7E7AA0" stroke="#6A6690" strokeWidth={3} />)}
      <rect x={110} y={1076} width={860} height={10} fill="#6A6690" />
      <rect x={950} y={1080} width={12} height={420} fill="#6A6690" />
      <R x={890} y={1180} width={60} height={40} r={6} fill="#E9E2C4" />
      <text x={920} y={1210} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={26} fill="#3A2840">12</text>
      <R x={150} y={1300} width={30} height={10} r={4} fill="#6A6690" />
      <R x={660} y={1418} width={90} height={60} r={8} fill="#B0443E" stroke="#6E2828" strokeWidth={4} />
      <path d="M680 1418 v-14 h50 v14" stroke="#6E2828" strokeWidth={4} fill="none" />
      <path d="M680 1150 h220 l-20 40 h-180 Z" fill="#4A3E5E" />
      <R x={150} y={1420} width={130} height={70} r={8} fill="#C9C5DC" stroke="#7E7AA0" strokeWidth={4} />
      <circle cx={190} cy={1455} r={22} fill="none" stroke="#7E7AA0" strokeWidth={4} />
      {/* teras, pot, semak */}
      <rect x={100} y={1500} width={880} height={40} fill="#6E6A8E" />
      <path d="M150 1500 h70 l-10 70 h-50 Z" fill="#A85A3E" />
      <ellipse cx={940} cy={1470} rx={90} ry={60} fill="#34504A" />
      {[[520, 1500], [600, 1500]].map(([x, y], i) => <path key={`p${i}`} d={`M${x} ${y} h50 l-8 44 h-34 Z`} fill="#A85A3E" />)}
      <circle cx={545} cy={1480} r={34} fill="#3E6A50" /><circle cx={625} cy={1478} r={30} fill="#4A7A58" />
      <circle cx={535} cy={1470} r={7} fill="#E9A0B0" /><circle cx={632} cy={1466} r={7} fill="#F2D27A" />
      {/* keset + sandal */}
      <R x={730} y={1500} width={110} height={18} r={6} fill="#8A5A4A" />
      <ellipse cx={870} cy={1514} rx={18} ry={8} fill="#5E8AD0" /><ellipse cx={896} cy={1516} rx={18} ry={8} fill="#5E8AD0" />
      {/* anjing tidur di teras (audit A1) */}
      <g transform="translate(330 1478)">
        <ellipse cx={0} cy={10} rx={70} ry={30} fill="#C98F5A" />
        <ellipse cx={-62} cy={2} rx={34} ry={28} fill="#D9A06A" />
        <path d="M-84 -14 q-14 26 -2 40 q10 -10 8 -36 Z" fill="#8E5A36" />
        <path d="M-74 4 q8 6 16 0" stroke="#3A2416" strokeWidth={4} fill="none" strokeLinecap="round" />
        <ellipse cx={-92} cy={10} rx={8} ry={6} fill="#3A2416" />
        <path d="M66 10 q40 -10 34 24" stroke="#C98F5A" strokeWidth={14} fill="none" strokeLinecap="round" />
        <ellipse cx={-10} cy={36} rx={70} ry={8} fill="rgba(10,10,30,.25)" />
      </g>
      {/* rumput (audit A1) */}
      <rect x={0} y={1532} width={1080} height={22} fill="#2E4A44" />
      {Array.from({ length: 70 }).map((_, i) => <path key={`r${i}`} d={`M${i * 16} 1540 l${4 + (i % 3) * 3} -${16 + (i % 4) * 7} l${4 + (i % 2) * 3} ${16 + (i % 4) * 7}`} fill={i % 2 ? "#3A5E50" : "#2F5246"} />)}
      {/* jalan basah + pantulan jendela */}
      <rect y={1540} width={1080} height={640} fill="#232A58" />
      <rect x={220} y={1560} width={380} height={160} fill="rgba(242,182,90,.18)" />
      <rect x={250} y={1600} width={320} height={10} fill="rgba(242,182,90,.25)" />
      </g>
    </g>
  );
};

// pagar besi di depan (lapisan depan, gelap)
export const Pagar: React.FC<{ y: number }> = ({ y }) => (
  <g fill="#0E1230">
    <rect y={y} width={1080} height={16} />
    <rect y={y + 120} width={1080} height={14} />
    {Array.from({ length: 22 }).map((_, i) => (
      <g key={i}>
        <rect x={i * 50 + 10} y={y - 40} width={12} height={240} />
        <path d={`M${i * 50 + 4} ${y - 38} l12 -26 l12 26 Z`} />
      </g>
    ))}
  </g>
);

// ruang tamu hangat (dilihat lewat celah pintu)
export const HANGAT = { dinding: "#F2D7AE", garis2: "#EBCB9C", kayu: "#9C6B45", kayuTua: "#7A5034", karpet: "#9E3B3B", emas: "#D9A441", garis: "#6E4A32" };
export const RuangHangat: React.FC<{ foto?: React.ReactNode }> = ({ foto }) => {
  const H = HANGAT;
  return (
    <g>
      <rect width={1080} height={1920} fill={H.dinding} />
      {Array.from({ length: 19 }).map((_, i) => <rect key={i} x={i * 60} width={24} height={1400} fill={H.garis2} />)}
      <rect y={1400} width={1080} height={520} fill={H.kayu} />
      {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={0} x2={1080} y1={1430 + i * 60} y2={1430 + i * 60} stroke={H.kayuTua} strokeWidth={4} />)}
      {/* lukisan */}
      <R x={340} y={560} width={360} height={250} r={8} fill={H.emas} stroke={H.garis} strokeWidth={5} />
      <defs>
        <linearGradient id="langitLukis" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#F4B97A" /><stop offset="0.55" stopColor="#F7D9A6" /><stop offset="1" stopColor="#CFE3D2" />
        </linearGradient>
        <clipPath id="kanvas"><rect x={360} y={580} width={320} height={210} /></clipPath>
      </defs>
      <g clipPath="url(#kanvas)">
        <rect x={360} y={580} width={320} height={210} fill="url(#langitLukis)" />
        <circle cx={600} cy={650} r={24} fill="#FBE7B0" />
        <path d="M360 700 L430 640 L490 690 L560 620 L640 690 L680 670 V790 H360 Z" fill="#8FA7B5" />
        <path d="M360 720 L420 680 L500 715 L580 670 L680 720 V790 H360 Z" fill="#6E9A86" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M360 ${735 + i * 14} Q520 ${722 + i * 14} 680 ${738 + i * 14} V${750 + i * 14} Q520 ${734 + i * 14} 360 ${747 + i * 14} Z`} fill={i % 2 ? "#9CC46A" : "#B5D27A"} />)}
        <rect x={360} y={770} width={320} height={20} fill="#7FA85A" />
        <path d="M410 790 q4 -60 -4 -96" stroke="#6A4A32" strokeWidth={5} fill="none" />
        {[-60, -20, 20, 60].map((a) => <ellipse key={a} cx={406} cy={694} rx={26} ry={7} fill="#3E6E4A" transform={`rotate(${a} 406 694)`} />)}
        <path d="M640 790 q-4 -48 4 -78" stroke="#6A4A32" strokeWidth={4} fill="none" />
        {[-60, -20, 20, 60].map((a) => <ellipse key={`b${a}`} cx={644} cy={712} rx={22} ry={6} fill="#3E6E4A" transform={`rotate(${a} 644 712)`} />)}
      </g>
      {/* foto nikah kecil */}
      {foto ?? <FotoNikah P={{ garis: H.garis, kaca: "#F4E6CF" } as Palet} x={140} y={620} s={0.8} />}
      {/* lampu berdiri menyala */}
      <circle cx={210} cy={930} r={180} fill="rgba(255,226,160,.35)" />
      <path d="M150 960 h120 l-20 -90 h-80 Z" fill="#FBEFD6" stroke={H.garis} strokeWidth={5} strokeLinejoin="round" />
      <rect x={204} y={960} width={12} height={440} fill={H.garis} />
      <ellipse cx={210} cy={1400} rx={60} ry={14} fill={H.garis} />
      {/* tirai merah + pengikat */}
      <path d="M840 480 h200 v1000 h-120 q-40 -380 -80 -520 q-20 -200 0 -480 Z" fill="#9E3B3B" stroke="#6E2828" strokeWidth={5} />
      <R x={860} y={980} width={90} height={22} r={11} fill={H.emas} />
      <R x={800} y={460} width={280} height={26} r={13} fill={H.kayuTua} />
      {/* karpet bulat dengan jahitan */}
      <ellipse cx={540} cy={1760} rx={520} ry={150} fill={H.karpet} />
      <ellipse cx={540} cy={1760} rx={470} ry={122} fill="none" stroke={H.emas} strokeWidth={6} strokeDasharray="26 18" />
    </g>
  );
};

export const MejaTeh: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const H = HANGAT;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <R x={-200} y={-30} width={400} height={34} r={14} fill="#F7F1E4" stroke={H.garis} strokeWidth={5} />
      <rect x={-170} y={4} width={12} height={130} fill={H.emas} />
      <rect x={158} y={4} width={12} height={130} fill={H.emas} />
      {/* teko + 2 cangkir */}
      <path d="M-60 -30 q0 -80 60 -80 q60 0 60 80 Z" fill="#FBF7EE" stroke={H.garis} strokeWidth={4} />
      <path d="M58 -70 q40 -10 50 -40" stroke="#FBF7EE" strokeWidth={14} fill="none" strokeLinecap="round" />
      <circle cx={0} cy={-114} r={10} fill={H.emas} />
      {[-140, 120].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy={-30} rx={34} ry={8} fill="#E9E1D2" />
          <path d={`M${cx - 22} -32 v-30 h44 v30 Z`} fill="#FBF7EE" stroke={H.garis} strokeWidth={3} />
          <rect x={cx - 18} y={-60} width={36} height={8} fill="#C9823A" />
        </g>
      ))}
    </g>
  );
};

// daun pintu kayu gelap berpanel (dilihat dari sisi gelap, sedikit cahaya hangat di tepi celah)
export const DaunPintu: React.FC<{ x: number; w: number; gagang: "kiri" | "kanan" }> = ({ x, w, gagang }) => {
  const kayu = "#2A2440", panel = "#231E38", tepi = "#3A3256";
  const gx = gagang === "kanan" ? x + w - 70 : x + 30;
  return (
    <g>
      <rect x={x} width={w} height={1920} fill={kayu} />
      {Array.from({ length: Math.max(1, Math.floor(w / 46)) }).map((_, i) => <line key={i} x1={x + 20 + i * 46} x2={x + 26 + i * 46} y1={0} y2={1920} stroke="#30294A" strokeWidth={3} />)}
      {w > 160 && <>
        <R x={x + 34} y={260} width={w - 68} height={560} r={10} fill={panel} stroke={tepi} strokeWidth={6} />
        <R x={x + 34} y={900} width={w - 68} height={760} r={10} fill={panel} stroke={tepi} strokeWidth={6} />
      </>}
      {/* engsel */}
      {[400, 1400].map((y) => <R key={y} x={gagang === "kanan" ? x + 4 : x + w - 22} y={y} width={18} height={70} r={4} fill="#6E6280" />)}
      {/* gagang + lubang kunci */}
      <R x={gx} y={1010} width={44} height={110} r={10} fill="#8A7A5A" stroke="#4A3E2A" strokeWidth={4} />
      <R x={gx - (gagang === "kanan" ? 40 : -4)} y={1030} width={80} height={22} r={11} fill="#C9A35A" stroke="#6E5A30" strokeWidth={3} />
      <circle cx={gx + 22} cy={1090} r={7} fill="#2A2018" />
      <rect x={gx + 19} y={1090} width={6} height={16} fill="#2A2018" />
    </g>
  );
};
// celah pintu: dua daun pintu di kiri-kanan, tepi celah kena cahaya hangat
export const CelahPintu: React.FC<{ kiri: number; kanan: number }> = ({ kiri, kanan }) => (
  <g>
    <DaunPintu x={0} w={kiri} gagang="kanan" />
    {kanan < 1080 && <DaunPintu x={kanan} w={1080 - kanan} gagang="kiri" />}
    <rect x={kiri - 10} width={10} height={1920} fill="rgba(255,206,140,.55)" />
    {kanan < 1080 && <rect x={kanan} width={10} height={1920} fill="rgba(255,206,140,.55)" />}
  </g>
);
