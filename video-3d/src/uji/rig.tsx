// Karakter versi KODE dengan rig ala animasi potong (cut-out) profesional:
// - tiap sendi (bahu, siku, pergelangan) = lingkaran bertumpuk dengan titik putar di pusatnya → tidak pernah "putus"
// - lengan baju menutupi sambungan bahu (Dimas) / bahu+siku (Bunda)
// - tangan "kacang" besar (telapak + jempol + jari), panjang ±setengah tinggi wajah
// Pose = sudut sendi; animasi = interpolasi sudut (lihat lerpPose).
import React from "react";
import { Blush, Eye, Mouth, W } from "../storybook/kit";

export type Bentuk = "buka" | "kepal" | "tunjuk";
export type Lengan = { u: number; e: number; h: number; bentuk: Bentuk };
export type Wajah = { open: number; alisNaik: number; alisMiring: number; mulut: number; senyum: number; pupil: number; lihatX: number; lihatY: number; tutup: boolean };
export type PoseRig = { kepala: number; badan: number; ki: Lengan; ka: Lengan; wajah: Wajah };

export const WAJAH: Record<string, Wajah> = {
  fokus: { open: 0.85, alisNaik: 0.1, alisMiring: 0.2, mulut: 0, senyum: 0.25, pupil: 1, lihatX: 0.2, lihatY: 0.75, tutup: false },
  kesal: { open: 0.75, alisNaik: -0.2, alisMiring: 1, mulut: 0, senyum: -0.7, pupil: 0.9, lihatX: -0.5, lihatY: 0, tutup: false },
  kaget: { open: 1, alisNaik: 1, alisMiring: 0, mulut: 0.6, senyum: 0, pupil: 0.7, lihatX: 0, lihatY: 0, tutup: false },
  sorak: { open: 0.1, alisNaik: 0.6, alisMiring: 0, mulut: 0.85, senyum: 1, pupil: 1, lihatX: 0, lihatY: 0, tutup: true },
  cemas: { open: 0.9, alisNaik: 0.4, alisMiring: -1, mulut: 0, senyum: -0.5, pupil: 1, lihatX: 0.6, lihatY: 0.2, tutup: false },
  ramah: { open: 0.95, alisNaik: 0.3, alisMiring: 0, mulut: 0, senyum: 1, pupil: 1, lihatX: 0.5, lihatY: 0.5, tutup: false },
  bangga: { open: 0.1, alisNaik: 0.4, alisMiring: 0, mulut: 0.5, senyum: 1, pupil: 1, lihatX: 0, lihatY: 0, tutup: true },
};

const L = (u: number, e: number, h: number, bentuk: Bentuk): Lengan => ({ u, e, h, bentuk });
export const POSE = {
  dimasFokus: { kepala: 7, badan: 2, ki: L(12, 72, -20, "kepal"), ka: L(24, 52, -25, "tunjuk"), wajah: WAJAH.fokus },
  dimasSilang: { kepala: -6, badan: -2, ki: L(8, 100, 0, "kepal"), ka: L(8, 106, 0, "kepal"), wajah: WAJAH.kesal },
  dimasSorak: { kepala: 0, badan: 0, ki: L(158, -12, 0, "buka"), ka: L(158, -12, 0, "buka"), wajah: WAJAH.sorak },
  bundaCemas: { kepala: 4, badan: 2, ki: L(6, 112, 25, "kepal"), ka: L(6, 108, 25, "kepal"), wajah: WAJAH.cemas },
  bundaTunjuk: { kepala: 8, badan: 4, ki: L(6, 30, -10, "kepal"), ka: L(32, 38, -20, "tunjuk"), wajah: WAJAH.ramah },
  bundaBangga: { kepala: 0, badan: 0, ki: L(2, 150, 40, "kepal"), ka: L(2, 146, 40, "kepal"), wajah: WAJAH.bangga },
} satisfies Record<string, PoseRig>;

const mix = (a: number, b: number, k: number) => a + (b - a) * k;
const mixL = (a: Lengan, b: Lengan, k: number): Lengan => ({ u: mix(a.u, b.u, k), e: mix(a.e, b.e, k), h: mix(a.h, b.h, k), bentuk: k < 0.5 ? a.bentuk : b.bentuk });
export const lerpPose = (a: PoseRig, b: PoseRig, k: number): PoseRig => ({
  kepala: mix(a.kepala, b.kepala, k),
  badan: mix(a.badan, b.badan, k),
  ki: mixL(a.ki, b.ki, k),
  ka: mixL(a.ka, b.ka, k),
  wajah: {
    open: mix(a.wajah.open, b.wajah.open, k), alisNaik: mix(a.wajah.alisNaik, b.wajah.alisNaik, k), alisMiring: mix(a.wajah.alisMiring, b.wajah.alisMiring, k),
    mulut: mix(a.wajah.mulut, b.wajah.mulut, k), senyum: mix(a.wajah.senyum, b.wajah.senyum, k), pupil: mix(a.wajah.pupil, b.wajah.pupil, k),
    lihatX: mix(a.wajah.lihatX, b.wajah.lihatX, k), lihatY: mix(a.wajah.lihatY, b.wajah.lihatY, k), tutup: k < 0.5 ? a.wajah.tutup : b.wajah.tutup,
  },
});

// ---------- tangan kacang (menghadap ke +y dari pergelangan; jempol ke arah badan) ----------
const Tangan: React.FC<{ bentuk: Bentuk }> = ({ bentuk }) => {
  const k = W.kulit, b = W.kulitBayang;
  if (bentuk === "buka")
    return (
      <g>
        {[-26, -9, 8, 25].map((x, i) => (
          <rect key={x} x={x - 10} y={58} width={21} height={i === 0 || i === 3 ? 46 : 54} rx={10.5} fill={k} transform={`rotate(${(i - 1.5) * 7} ${x} 60)`} />
        ))}
        <ellipse cx={0} cy={44} rx={40} ry={40} fill={k} />
        <ellipse cx={14} cy={50} rx={22} ry={30} fill={b} opacity={0.35} />
        <rect x={-50} y={12} width={22} height={52} rx={11} fill={k} transform="rotate(28 -39 20)" />
        <ellipse cx={0} cy={4} rx={26} ry={14} fill={k} />
      </g>
    );
  return (
    <g>
      <rect x={-38} y={12} width={76} height={68} rx={30} fill={k} />
      <ellipse cx={14} cy={50} rx={20} ry={28} fill={b} opacity={0.35} />
      {[-18, 0, 18].map((x) => <path key={x} d={`M${x - 8} 72 q8 6 16 0`} stroke={b} strokeWidth={4} fill="none" strokeLinecap="round" />)}
      {bentuk === "tunjuk" && <rect x={4} y={56} width={23} height={78} rx={11.5} fill={k} />}
      {bentuk === "tunjuk" && <ellipse cx={15.5} cy={126} rx={8} ry={6} fill="#F6D2BC" />}
      <rect x={-46} y={30} width={50} height={24} rx={12} fill={k} transform="rotate(-18 -21 42)" />
      <path d="M-40 46 q14 8 30 2" stroke={b} strokeWidth={3} fill="none" opacity={0.6} />
      <ellipse cx={0} cy={6} rx={26} ry={14} fill={k} />
    </g>
  );
};

// ---------- satu lengan: bahu → siku → pergelangan ----------
const SatuLengan: React.FC<{ s: 1 | -1; l: Lengan; bahu: [number, number]; p1: number; p2: number; baju: string; bajuGelap: string; lenganPanjang?: boolean }> = ({ s, l, bahu, p1, p2, baju, bajuGelap, lenganPanjang }) => (
  <g transform={`translate(${bahu[0]} ${bahu[1]}) rotate(${-s * l.u})`}>
    {/* lengan atas */}
    <rect x={-32} y={-10} width={64} height={p1 + 20} rx={32} fill={W.kulit} />
    <rect x={s * 8 - 8} y={0} width={16} height={p1} rx={8} fill={W.kulitBayang} opacity={0.35} />
    {/* lengan baju menutupi bahu */}
    <path d={`M-42 -30 Q-46 ${lenganPanjang ? p1 + 10 : 70} -34 ${lenganPanjang ? p1 + 18 : 84} L34 ${lenganPanjang ? p1 + 18 : 84} Q46 ${lenganPanjang ? p1 + 10 : 70} 42 -30 Z`} fill={baju} />
    <rect x={-36} y={lenganPanjang ? p1 + 8 : 72} width={72} height={14} rx={7} fill={bajuGelap} opacity={0.45} />
    <g transform={`translate(0 ${p1}) rotate(${s * l.e})`}>
      {/* siku: lingkaran bertumpuk */}
      <circle r={31} fill={W.kulit} />
      <rect x={-29} y={0} width={58} height={p2} rx={29} fill={W.kulit} />
      <rect x={s * 8 - 7} y={6} width={14} height={p2 - 12} rx={7} fill={W.kulitBayang} opacity={0.35} />
      {lenganPanjang && (
        <g>
          <rect x={-38} y={-36} width={76} height={70} rx={34} fill={baju} />
          <rect x={-39} y={22} width={78} height={24} rx={12} fill="#F7B0C6" />
        </g>
      )}
      <g transform={`translate(0 ${p2 - 6}) rotate(${s * l.h}) scale(${s * 1.35} 1.35)`}>
        <Tangan bentuk={l.bentuk} />
      </g>
    </g>
  </g>
);

// ---------- kepala (wajah dari parameter) ----------
const Kepala: React.FC<{ w: Wajah; kedip: number; bicara: number; rambutBelakang?: React.ReactNode; rambutDepan: React.ReactNode; anting?: boolean; id: string }> = ({ w, kedip, bicara, rambutBelakang, rambutDepan, anting, id }) => {
  const open = w.tutup ? 0.1 : Math.min(w.open, kedip);
  return (
    <g>
      {rambutBelakang}
      <ellipse cx={-117} cy={12} rx={24} ry={32} fill={W.kulit} />
      <ellipse cx={117} cy={12} rx={24} ry={32} fill={W.kulitBayang} />
      <path d="M-122 4 q8 -10 14 4" stroke={W.kulitBayang} strokeWidth={5} fill="none" />
      {anting && [-122, 122].map((x) => <circle key={x} cx={x} cy={48} r={9} fill="#FFFDF5" />)}
      <clipPath id={id}>
        <ellipse rx={120} ry={128} />
      </clipPath>
      <ellipse rx={120} ry={128} fill={W.kulit} />
      <g clipPath={`url(#${id})`}>
        <ellipse cx={92} cy={30} rx={86} ry={150} fill={W.kulitBayang} opacity={0.4} />
        <ellipse cx={0} cy={150} rx={140} ry={40} fill={W.kulitBayang} opacity={0.32} />
      </g>
      {rambutDepan}
      <Eye x={-46} y={16} r={28} open={open} look={w.lihatX} lookY={w.lihatY} pupil={w.pupil} lash={!!anting} />
      <Eye x={46} y={16} r={28} open={open} look={w.lihatX} lookY={w.lihatY} pupil={w.pupil} lash={!!anting} />
      {[-1, 1].map((s) => (
        <path key={s} d={`M${s * 20} ${-34 - w.alisNaik * 14 + w.alisMiring * 10} Q${s * 46} ${-48 - w.alisNaik * 16} ${s * 72} ${-36 - w.alisNaik * 14 - w.alisMiring * 6}`} stroke={W.rambut} strokeWidth={9} fill="none" strokeLinecap="round" />
      ))}
      <path d="M4 46 Q14 60 0 64" stroke={W.kulitBayang} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Blush x={-76} y={66} r={24} />
      <Blush x={76} y={66} r={24} />
      <Mouth x={0} y={92} w={46} t={Math.max(w.mulut, bicara)} smile={w.senyum} />
    </g>
  );
};

// ---------- badan + rakit ----------
type RakitProps = { pose: PoseRig; kedip: number; bicara?: number; x: number; y: number; s: number; flip?: number; squash?: number };

export const DimasRig: React.FC<RakitProps> = ({ pose, kedip, bicara = 0, x, y, s, flip = 1, squash = 1 }) => {
  const baju = "#F5B83D", gelap = "#C98A1A";
  const rambut = (
    <g>
      <path d="M-128 6 C-140 -120 -60 -160 10 -152 C90 -146 140 -100 128 4 C116 -40 96 -60 76 -64 L64 -36 L42 -72 L14 -42 L-6 -78 L-34 -46 L-56 -80 C-96 -70 -118 -40 -128 6Z" fill={W.rambut} />
      <path d="M20 -150 q-6 -34 22 -46" stroke={W.rambut} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d="M-50 -130 Q0 -146 60 -130" stroke="#4A3428" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s * flip} ${s * squash}) rotate(${pose.badan})`}>
      {/* badan */}
      <clipPath id="badanDR">
        <path d="M-150 600 L-150 250 C-150 200 -105 170 0 166 C105 170 150 200 150 250 L150 600Z" />
      </clipPath>
      <rect x={-34} y={110} width={68} height={70} rx={26} fill={W.kulitBayang} />
      <path d="M-150 600 L-150 250 C-150 200 -105 170 0 166 C105 170 150 200 150 250 L150 600Z" fill={baju} />
      <g clipPath="url(#badanDR)">
        {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={-200} y={214 + i * 58} width={400} height={22} fill="#FFF4D8" opacity={0.8} />)}
        <path d="M80 170 C150 190 165 230 165 280 L165 600 L100 600 C120 420 120 260 80 170Z" fill={gelap} opacity={0.3} />
      </g>
      <path d="M-56 170 Q0 210 56 170" stroke="#E09A20" strokeWidth={14} fill="none" strokeLinecap="round" />
      <SatuLengan s={-1} l={pose.ki} bahu={[-118, 214]} p1={165} p2={150} baju={baju} bajuGelap={gelap} />
      <SatuLengan s={1} l={pose.ka} bahu={[118, 214]} p1={165} p2={150} baju={baju} bajuGelap={gelap} />
      <g transform={`rotate(${pose.kepala} 0 120)`}>
        <Kepala w={pose.wajah} kedip={kedip} bicara={bicara} rambutDepan={rambut} id="kpDR" />
      </g>
    </g>
  );
};

export const BundaRig: React.FC<RakitProps> = ({ pose, kedip, bicara = 0, x, y, s, flip = 1, squash = 1 }) => {
  const baju = "#E86A92", gelap = "#B8476E";
  const belakang = <path d="M-152 -20 C-162 -150 -60 -178 0 -175 C70 -173 162 -142 152 -20 C156 60 160 140 128 190 L-128 190 C-160 140 -156 60 -152 -20Z" fill="#3B2418" />;
  const depan = (
    <g>
      <path d="M-130 12 C-138 -112 -40 -152 20 -148 C100 -142 142 -92 130 2 C112 -62 72 -98 10 -94 C-20 -82 -62 -42 -130 12Z" fill="#3B2418" />
      <path d="M40 -122 Q90 -92 96 -32" stroke="#5A3A2A" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
      <rect x={60} y={-114} width={40} height={11} rx={5} fill={W.kuning} transform="rotate(-25 80 -109)" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s * flip} ${s * squash}) rotate(${pose.badan})`}>
      <clipPath id="badanBR">
        <path d="M-166 640 L-166 262 C-166 204 -116 174 0 168 C116 174 166 204 166 262 L166 640Z" />
      </clipPath>
      <rect x={-32} y={110} width={64} height={70} rx={24} fill={W.kulitBayang} />
      <path d="M-166 640 L-166 262 C-166 204 -116 174 0 168 C116 174 166 204 166 262 L166 640Z" fill={baju} />
      <g clipPath="url(#badanBR)">
        <path d="M90 172 C160 192 182 232 182 290 L182 640 L110 640 C130 450 130 270 90 172Z" fill={gelap} opacity={0.3} />
      </g>
      <path d="M-70 176 Q-40 222 0 196 Q40 222 70 176 L60 168 L-60 168Z" fill="#F7B0C6" />
      {[260, 320].map((yy) => <circle key={yy} cx={0} cy={yy} r={7} fill="#F7B0C6" />)}
      <SatuLengan s={-1} l={pose.ki} bahu={[-132, 224]} p1={185} p2={170} baju={baju} bajuGelap={gelap} lenganPanjang />
      <SatuLengan s={1} l={pose.ka} bahu={[132, 224]} p1={185} p2={170} baju={baju} bajuGelap={gelap} lenganPanjang />
      <g transform={`rotate(${pose.kepala} 0 120)`}>
        <Kepala w={pose.wajah} kedip={kedip} bicara={bicara} rambutBelakang={belakang} rambutDepan={depan} anting id="kpBR" />
      </g>
    </g>
  );
};
