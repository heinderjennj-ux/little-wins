// Tokoh Variasi 7 (gaya storybook): Bunda (narator) dan Dimas (7 thn). Setengah badan, menghadap depan.
// Titik (0,0) = pusat kepala. Kepala r≈120, bahu di y≈+165, badan sampai y≈+520.
import React from "react";
import { Blush, Eye, Mouth, useHidup, W } from "../storybook/kit";

export type Ekspresi = "senang" | "bangga" | "kesal" | "kaget" | "sedih" | "tekad" | "datar" | "mikir";
export type Pose = "turun" | "silang" | "angkat" | "tunjuk" | "pegang" | "dagu" | "tolak";

const WAJAH: Record<Ekspresi, { open: number; alisNaik: number; alisMiring: number; mulut: number; senyum: number; pupil: number; lihatY: number }> = {
  senang: { open: 1, alisNaik: 0.3, alisMiring: 0, mulut: 0, senyum: 1, pupil: 1, lihatY: 0 },
  bangga: { open: 0.1, alisNaik: 0.4, alisMiring: 0, mulut: 0.55, senyum: 1, pupil: 1, lihatY: 0 },
  kesal: { open: 0.75, alisNaik: -0.2, alisMiring: 1, mulut: 0, senyum: -0.7, pupil: 0.9, lihatY: 0 },
  kaget: { open: 1, alisNaik: 1, alisMiring: 0, mulut: 0.65, senyum: 0, pupil: 0.7, lihatY: 0 },
  sedih: { open: 0.85, alisNaik: 0.3, alisMiring: -1, mulut: 0, senyum: -0.6, pupil: 1, lihatY: 0.5 },
  tekad: { open: 0.9, alisNaik: -0.1, alisMiring: 0.6, mulut: 0, senyum: 0.3, pupil: 1, lihatY: 0 },
  datar: { open: 1, alisNaik: 0, alisMiring: 0, mulut: 0, senyum: 0.15, pupil: 1, lihatY: 0 },
  mikir: { open: 0.9, alisNaik: 0.5, alisMiring: -0.4, mulut: 0, senyum: -0.1, pupil: 1, lihatY: -0.6 },
};

const Kepala: React.FC<{ e: Ekspresi; lirik?: number; rambut: React.ReactNode; rambutDepan: React.ReactNode; anting?: boolean; geser: number; skala?: number }> = ({ e, lirik = 0, rambut, rambutDepan, anting, geser, skala = 1 }) => {
  const { kedip } = useHidup(geser);
  const w = WAJAH[e];
  const open = w.open < 0.2 ? w.open : Math.min(w.open, kedip);
  const id = `kp${geser}`;
  return (
    <g transform={`scale(${skala})`}>
      {rambut}
      <ellipse cx={-118} cy={10} rx={22} ry={30} fill={W.kulit} />
      <ellipse cx={118} cy={10} rx={22} ry={30} fill={W.kulitBayang} />
      {anting && [-120, 120].map((x) => <circle key={x} cx={x} cy={44} r={9} fill="#FFFDF5" />)}
      <clipPath id={id}>
        <ellipse rx={120} ry={128} />
      </clipPath>
      <ellipse rx={120} ry={128} fill={W.kulit} />
      <g clipPath={`url(#${id})`}>
        <ellipse cx={92} cy={30} rx={86} ry={150} fill={W.kulitBayang} opacity={0.42} />
        <ellipse cx={0} cy={150} rx={140} ry={40} fill={W.kulitBayang} opacity={0.32} />
      </g>
      <path d="M-114 -30 Q-124 40 -90 92" stroke="#FFF1DE" strokeWidth={6} fill="none" opacity={0.55} strokeLinecap="round" />
      {rambutDepan}
      <Eye x={-46} y={14} r={27} open={open} look={lirik} lookY={w.lihatY} pupil={w.pupil} lash={!!anting} />
      <Eye x={46} y={14} r={27} open={open} look={lirik} lookY={w.lihatY} pupil={w.pupil} lash={!!anting} />
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={`M${s * 20} ${-34 - w.alisNaik * 14 + w.alisMiring * 10} Q${s * 46} ${-46 - w.alisNaik * 16} ${s * 72} ${-36 - w.alisNaik * 14 - w.alisMiring * 6}`}
          stroke={W.rambut}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
        />
      ))}
      <path d="M4 44 Q14 58 0 62" stroke={W.kulitBayang} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Blush x={-74} y={64} r={24} />
      <Blush x={74} y={64} r={24} />
      <Mouth x={0} y={90} w={44} t={w.mulut} smile={w.senyum} />
    </g>
  );
};

// lengan: dari bahu ke titik tangan (relatif pusat kepala)
const TANGAN: Record<Pose, [[number, number], [number, number]]> = {
  turun: [[-170, 470], [170, 470]],
  silang: [[60, 330], [-60, 350]],
  angkat: [[-210, -150], [210, -150]],
  tunjuk: [[-170, 470], [250, 120]],
  pegang: [[-70, 330], [70, 330]],
  dagu: [[-170, 470], [30, 150]],
  tolak: [[-230, 260], [230, 260]],
};

const Lengan: React.FC<{ pose: Pose; baju: string; bayang: string }> = ({ pose, baju, bayang }) => {
  const [ki, ka] = TANGAN[pose];
  const satu = (b: [number, number], t: [number, number], s: number) => {
    const siku = pose === "silang" ? [b[0] + s * 40, b[1] + 150] : pose === "angkat" ? [b[0] + s * 70, b[1] - 60] : pose === "tolak" ? [b[0] + s * 40, b[1] + 130] : [b[0] + s * 30, b[1] + 160];
    return (
      <g key={s}>
        <path d={`M${b[0]} ${b[1]} Q${siku[0]} ${siku[1]} ${t[0]} ${t[1]}`} stroke={baju} strokeWidth={62} fill="none" strokeLinecap="round" />
        <path d={`M${b[0] + s * 10} ${b[1] + 20} Q${siku[0] + s * 10} ${siku[1]} ${t[0] + s * 6} ${t[1] - 20}`} stroke={bayang} strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.35} />
        <circle cx={t[0]} cy={t[1]} r={34} fill={W.kulit} />
        {pose === "tunjuk" && s === 1 && <rect x={t[0] - 6} y={t[1] - 82} width={24} height={62} rx={12} fill={W.kulit} transform={`rotate(35 ${t[0]} ${t[1]})`} />}
        {pose === "tolak" && <rect x={t[0] - 30} y={t[1] - 62} width={60} height={50} rx={22} fill={W.kulit} />}
      </g>
    );
  };
  return <g>{[satu([-140, 190], ki, -1), satu([140, 190], ka, 1)]}</g>;
};

const Badan: React.FC<{ baju: string; bayang: string; motif?: "garis" | "polos"; kerah?: string }> = ({ baju, bayang, motif = "polos", kerah }) => (
  <g>
    <clipPath id={`bd${baju}`}>
      <path d="M-200 560 L-200 260 C-200 190 -130 160 0 156 C130 160 200 190 200 260 L200 560Z" />
    </clipPath>
    <path d="M-200 560 L-200 260 C-200 190 -130 160 0 156 C130 160 200 190 200 260 L200 560Z" fill={baju} />
    <g clipPath={`url(#bd${baju})`}>
      {motif === "garis" && Array.from({ length: 7 }).map((_, i) => <rect key={i} x={-220} y={200 + i * 56} width={440} height={20} fill="#FFF4D8" opacity={0.75} />)}
      <path d="M90 160 C170 180 200 220 200 280 L200 560 L120 560 C140 400 140 250 90 160Z" fill={bayang} opacity={0.35} />
    </g>
    <rect x={-34} y={110} width={68} height={60} rx={24} fill={W.kulitBayang} />
    {kerah && <path d="M-60 158 Q0 200 60 158" stroke={kerah} strokeWidth={14} fill="none" strokeLinecap="round" />}
  </g>
);

export const Bunda: React.FC<{ x: number; y: number; s?: number; e?: Ekspresi; pose?: Pose; lirik?: number; putar?: number }> = ({ x, y, s = 1, e = "datar", pose = "turun", lirik = 0, putar = 0 }) => {
  const { napas } = useHidup(5);
  const rambut = (
    <g>
      <path d="M-150 -20 C-160 -150 -60 -175 0 -172 C70 -170 160 -140 150 -20 C152 40 150 110 120 150 L-120 150 C-150 110 -152 40 -150 -20Z" fill="#3B2418" />
    </g>
  );
  const depan = (
    <g>
      <path d="M-128 10 C-136 -110 -40 -150 20 -146 C100 -140 140 -90 128 0 C110 -60 70 -96 10 -92 C-20 -80 -60 -40 -128 10Z" fill="#3B2418" />
      <path d="M40 -120 Q90 -90 96 -30" stroke="#5A3A2A" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
      <rect x={60} y={-112} width={38} height={10} rx={5} fill={W.kuning} transform="rotate(-25 79 -107)" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y + napas}) scale(${s}) rotate(${putar})`}>
      <Badan baju="#E86A92" bayang="#B8476E" kerah="#F7B0C6" />
      <circle cx={0} cy={250} r={7} fill="#F7B0C6" />
      <circle cx={0} cy={300} r={7} fill="#F7B0C6" />
      <Lengan pose={pose} baju="#E86A92" bayang="#B8476E" />
      <Kepala e={e} lirik={lirik} rambut={rambut} rambutDepan={depan} anting geser={5} />
    </g>
  );
};

export const Dimas: React.FC<{ x: number; y: number; s?: number; e?: Ekspresi; pose?: Pose; lirik?: number; putar?: number }> = ({ x, y, s = 1, e = "datar", pose = "turun", lirik = 0, putar = 0 }) => {
  const { napas } = useHidup(8);
  const depan = (
    <g>
      <path d="M-128 6 C-140 -120 -60 -160 10 -152 C90 -146 140 -100 128 4 C116 -40 96 -60 76 -64 L64 -36 L42 -72 L14 -42 L-6 -78 L-34 -46 L-56 -80 C-96 -70 -118 -40 -128 6Z" fill={W.rambut} />
      <path d="M20 -150 q-6 -34 22 -46" stroke={W.rambut} strokeWidth={11} fill="none" strokeLinecap="round" />
      <path d="M-50 -130 Q0 -146 60 -130" stroke="#4A3428" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y + napas}) scale(${s}) rotate(${putar})`}>
      <Badan baju="#F5B83D" bayang="#C98A1A" motif="garis" kerah="#E09A20" />
      <Lengan pose={pose} baju="#F5B83D" bayang="#C98A1A" />
      <Kepala e={e} lirik={lirik} rambut={null} rambutDepan={depan} geser={8} skala={1.02} />
    </g>
  );
};
