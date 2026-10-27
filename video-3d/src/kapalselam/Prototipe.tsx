// YouTube Shorts US "Submarine" (fisherman): prototipe still KS01–KS27, digambar kode (tokoh nelayan sementara; nanti AI).
// TRIAD ala Disney/Pixar (James Gurney, gamut masking — riset-warna-gaya.md §9):
//   DOMINAN  = biru-teal laut (dingin; terang di permukaan → hampir hitam di dasar)
//   AKSEN 1  = kuning emas #FFC23D (harapan: kapal selam, jas hujan nelayan, cahaya)
//   AKSEN 2  = koral-merah #FF5E5B (bahaya: lampu darurat, zona merah, kebocoran; speedboat, rompi pelampung)
//   Hijau/ungu ditekan (hiasan karang diredam). Color script: cerah → makin gelap → MERAH darurat → kenangan sepia → cerah melompat.
// Lapisan (audit owner 2026-10-27, "layer demi layer"): langit + cakrawala jauh → laut bergradien + berkas cahaya + salju laut
// → siluet jauh buram → fokus tajam bergaris navy + bayangan → air depan (bagian benda di bawah garis air) → benda depan buram → vinyet.
// Detail kapal mengikuti anatomi asli (RISET-DETAIL.md): kapal selam = sirip menara, sirip/kemudi salib belakang, baling-baling,
// tangki ballast di antara lambung luar & lambung tekan, tangki trim depan+belakang, ruang kendali di bawah menara;
// perahu nelayan = ruang kemudi, bibir lambung (gunwale), tiang + tali, tumpukan jaring + pelampung, kotak ikan, ban fender.
// Adegan dengan `kamera` punya beberapa still (KS01, KS01-2 …) = kunci kamera awal → akhir.
import React from "react";
import { AbsoluteFill } from "remotion";
import { AI, Awan, Defs, F, H, HiasDasar, Istilah, Laut, NAVY, Palet, Panah, Retak, Tulisan, Uang, W, TERANG, acak, gayaStroke, gel, pita } from "../terowongan/Prototipe";

export const T = { kuning: "#FFC23D", kuningTua: "#E09412", kuningMuda: "#FFE08A", sorot: "#FFF0B8", koral: "#FF5E5B", koralTua: "#D9433F", koralMuda: "#FF9A8F" };

// palet triad (struktur Palet sama dengan terowongan supaya komponen bisa dipakai ulang)
export const PERMUKAAN: Palet = {
  ...TERANG, id: "kp",
  langitAtas: "#EAF6FB", langitBawah: "#BFE3F2", lautAtas: "#5FB6DE", lautBawah: "#1C5C93", sinar: "rgba(255,255,255,.18)", ikan: "#174A7A",
  pasir: "#D9D6C8", pasirGaris: "#B9B6A6", rumputLaut: "#2C6F86",
};
export const DALAM: Palet = {
  ...PERMUKAAN, id: "kd",
  lautAtas: "#1D5A8C", lautBawah: "#071A35", sinar: "rgba(170,210,255,.08)", ikan: "#0A2346", pasir: "#3E5675", pasirGaris: "#2F4462", rumputLaut: "#173C55", gelap: true,
};
export const DARURAT: Palet = { ...DALAM, id: "kr", lautAtas: "#1A2C55", lautBawah: "#0A0F24" };
export const KENANGAN_LAUT: Palet = {
  ...PERMUKAAN, id: "kk",
  langitAtas: "#FBEBD0", langitBawah: "#F2D2A2", awan: "#FFF6E6", matahari: "rgba(255,220,150,.75)", lautAtas: "#D9A86E", lautBawah: "#8C5A38", sinar: "rgba(255,240,210,.2)", ikan: "#6B4128",
};
export const FAJAR: Palet = { ...PERMUKAAN, id: "kf", langitAtas: "#FFE9C8", langitBawah: "#FFD3A0", matahari: "rgba(255,210,140,.85)" };

export const PERMUKAAN_Y = 560;

// ---------- latar ----------
// laut dari permukaan (atau seluruh layar kalau dalam), salju laut, siluet jauh, dasar laut opsional
export const LautBesar: React.FC<{ P: Palet; permukaan?: number | null; dasar?: number; siluet?: boolean }> = ({ P, permukaan = null, dasar, siluet = true }) => (
  <g>
    <g filter="url(#buram)">
      {permukaan !== null && (
        <>
          <rect x={-200} y={-200} width={W + 400} height={permukaan + 220} fill={`url(#gLangit${P.id})`} />
          <circle cx={860} cy={200} r={110} fill={P.matahari} filter="url(#cahaya)" />
          <Awan x={220} y={230} s={1} warna={P.awan} />
          <Awan x={760} y={320} s={0.8} warna={P.awan} />
        </>
      )}
      <Laut P={P} y0={permukaan ?? -30} y1={H + 20} />
      {dasar !== undefined && (
        <>
          <path d={pita(dasar, 18, 6)} fill={P.pasir} />
          <path d={gel(dasar + 14, 14, 4)} stroke={P.pasirGaris} strokeWidth={5} fill="none" />
        </>
      )}
      {/* salju laut (partikel kecil melayang) */}
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={acak(i + 3) * W} cy={(permukaan ?? 0) + 60 + acak(i + 70) * (H - (permukaan ?? 0))} r={1.5 + acak(i) * 2.5} fill="#FFFFFF" opacity={P.gelap ? 0.35 : 0.25} />
      ))}
    </g>
    {/* siluet jauh: paus & ikan besar, buram, nilai sedang */}
    {siluet && (
      <g filter="url(#jauh)" fill={P.gelap ? "#0E2D52" : "#2E6E9E"} opacity={0.55}>
        <path d="M120 1180 q120 -60 260 -10 q40 -30 70 -10 q-30 20 -10 40 q-120 50 -320 -20 Z" />
        <ellipse cx={880} cy={760} rx={70} ry={22} />
        <path d="M810 760 l-30 -18 l0 36 Z" />
      </g>
    )}
    {dasar !== undefined && (
      <g filter="url(#triadRedam)">
        <HiasDasar P={P} y={dasar + 4} t={120} xs={[90, 330, 600, 860]} />
      </g>
    )}
  </g>
);

// cakrawala jauh: pulau buram nilai rendah, mercusuar kecil, camar — lapisan antara langit & fokus
export const Cakrawala: React.FC<{ y: number; P: Palet }> = ({ y, P }) => (
  <g>
    <g filter="url(#jauh)" fill={P.id === "kk" ? "#C9A57E" : "#86B9D3"} opacity={0.85}>
      <path d={`M-40 ${y} Q60 ${y - 70} 170 ${y - 40} Q240 ${y - 90} 330 ${y} Z`} />
      <path d={`M700 ${y} Q780 ${y - 46} 860 ${y - 30} Q950 ${y - 60} 1120 ${y} Z`} />
    </g>
    <g filter="url(#buram)" stroke={NAVY} strokeWidth={3}>
      <path d={`M142 ${y - 52} L150 ${y - 112} L166 ${y - 112} L174 ${y - 52} Z`} fill="#F4F6FA" />
      <rect x={146} y={y - 92} width={24} height={12} fill={T.koral} />
      <rect x={144} y={y - 128} width={28} height={16} rx={4} fill={T.kuningMuda} />
    </g>
    {[[380, y - 330, 1], [450, y - 300, 0.7], [640, y - 380, 0.85]].map(([x, yy, s], i) => (
      <path key={i} d={`M${x} ${yy} q${12 * s} ${-12 * s} ${24 * s} 0 q${12 * s} ${-12 * s} ${24 * s} 0`} stroke={NAVY} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
    ))}
  </g>
);

// air di depan benda: bagian lambung di bawah garis air tampak tenggelam (lapisan depan transparan)
export const AirDepan: React.FC<{ P: Palet; y0: number }> = ({ P, y0 }) => (
  <g>
    <rect x={-300} y={y0} width={W + 600} height={H - y0 + 400} fill={`url(#gLaut${P.id})`} opacity={0.55} />
    <rect x={-300} y={y0 - 3} width={W + 600} height={7} fill="#FFFFFF" opacity={0.6} />
    {Array.from({ length: 14 }).map((_, i) => (
      <path key={i} d={`M${i * 85 - 20} ${y0 + 18 + (i % 3) * 12} q20 -10 40 0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.55} strokeLinecap="round" />
    ))}
  </g>
);

// benda paling depan (buram, gelap): batu + rumput laut di sudut bawah, gelembung besar tak fokus
export const DepanLaut: React.FC<{ P: Palet }> = ({ P }) => (
  <g>
    <g filter="url(#depan)" fill={P.gelap ? "#030A18" : "#123E66"} opacity={0.92}>
      <path d="M-60 1920 L-60 1600 Q40 1540 120 1610 Q190 1560 250 1680 L280 1920 Z" />
      <path d="M1140 1920 L1140 1640 Q1060 1590 990 1660 Q930 1630 880 1740 L860 1920 Z" />
    </g>
    <g filter="url(#depan)" stroke={P.gelap ? "#06142A" : "#1A4E78"} strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.9}>
      <path d="M40 1700 C10 1560 90 1480 40 1340" />
      <path d="M110 1720 C140 1600 70 1540 110 1430" />
    </g>
    <g filter="url(#depan)" fill="none" stroke="#FFFFFF" strokeWidth={6} opacity={0.22}>
      <circle cx={960} cy={560} r={44} />
      <circle cx={90} cy={720} r={30} />
    </g>
  </g>
);

export const DefsTriad: React.FC = () => (
  <defs>
    {/* hiasan karang diredam ke dalam gamut triad (kejenuhan turun, sedikit kebiruan) */}
    <filter id="triadRedam"><feColorMatrix type="saturate" values="0.45" /></filter>
    {/* detail sekunder diredam: nilai ditekan ke biru-navy menengah (mata hanya bisa fokus ke 1–2 hal; detail tetap terbaca tapi tidak berteriak) */}
    <filter id="detailRedam"><feColorMatrix type="matrix" values="0.5 0 0 0 0.07  0 0.5 0 0 0.1  0 0 0.55 0 0.17  0 0 0 1 0" /></filter>
    <radialGradient id="lampuMerah" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stopColor="rgba(255,94,91,.55)" />
      <stop offset="100%" stopColor="rgba(255,94,91,0)" />
    </radialGradient>
    <radialGradient id="cahayaKuning" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="rgba(255,214,120,.65)" />
      <stop offset="100%" stopColor="rgba(255,214,120,0)" />
    </radialGradient>
    {/* tubuh ikan: punggung gelap → perut terang (countershading ikan asli) */}
    <linearGradient id="gIkan" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#355E92" />
      <stop offset="50%" stopColor="#8FB3D9" />
      <stop offset="100%" stopColor="#EEF4FA" />
    </linearGradient>
    <linearGradient id="gKaca" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#CFF1FF" />
      <stop offset="100%" stopColor="#6FC3E8" />
    </linearGradient>
  </defs>
);

// ---------- tokoh ----------
// awak kapal selam (kecil, tapi berwajah: mata + kilau, alis, hidung, pipi, kerah, kancing, sabuk, sepatu; topi beda-beda)
type PoseAwak = "berdiri" | "duduk" | "lambai" | "sorak";
type Topi = "kupluk" | "topi" | "headset" | "rambut";
export const Awak: React.FC<{ x: number; bawah: number; t?: number; baju?: string; topi?: Topi; janggut?: boolean; pose?: PoseAwak; flip?: boolean }> = ({
  x, bawah, t = 1, baju = "#C9D3E3", topi = "rambut", janggut, pose = "berdiri", flip,
}) => {
  const duduk = pose === "duduk";
  const senang = pose === "lambai" || pose === "sorak";
  const lengan = (bx: number, sudut: number) => (
    <g transform={`rotate(${sudut} ${bx} -124)`}>
      <rect x={bx - 6.5} y={-126} width={13} height={52} rx={6} fill={baju} />
      <circle cx={bx} cy={-70} r={7} fill={F.kulit} />
    </g>
  );
  const sudutKiri = pose === "sorak" ? 150 : duduk ? -20 : 10;
  const sudutKanan = pose === "sorak" || pose === "lambai" ? -150 : duduk ? -40 : -10;
  return (
    <g transform={`translate(${x} ${bawah}) scale(${(flip ? -1 : 1) * t} ${t})`} stroke={NAVY} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx={0} cy={2} rx={34} ry={6} fill="rgba(10,14,34,.25)" stroke="none" />
      {duduk ? (
        <g>
          <rect x={-22} y={-46} width={30} height={46} rx={4} fill="#3A4660" />
          <rect x={-14} y={-62} width={46} height={16} rx={7} fill="#24365E" />
          <rect x={20} y={-58} width={14} height={54} rx={6} fill="#24365E" />
          <ellipse cx={32} cy={-4} rx={12} ry={6} fill="#1A2238" />
        </g>
      ) : (
        <g>
          <rect x={-17} y={-74} width={15} height={70} rx={6} fill="#24365E" />
          <rect x={2} y={-74} width={15} height={70} rx={6} fill="#1C2C4E" />
          <ellipse cx={-12} cy={-4} rx={12} ry={6} fill="#1A2238" />
          <ellipse cx={12} cy={-4} rx={12} ry={6} fill="#1A2238" />
        </g>
      )}
      <g transform={`translate(0 ${duduk ? 14 : 0})`}>
        {lengan(-26, sudutKiri)}
        <path d="M-26 -128 Q0 -136 26 -128 L28 -70 L-28 -70 Z" fill={baju} />
        <path d="M-10 -131 L0 -116 L10 -131 Z" fill="#FFFFFF" strokeWidth={3} />
        <circle cx={0} cy={-104} r={2.5} fill={NAVY} stroke="none" />
        <circle cx={0} cy={-90} r={2.5} fill={NAVY} stroke="none" />
        <rect x={8} y={-120} width={12} height={10} rx={2} fill="none" strokeWidth={2.5} />
        <rect x={-28} y={-80} width={56} height={9} rx={3} fill="#1A2238" strokeWidth={3} />
        <rect x={-5} y={-80} width={10} height={9} rx={2} fill={T.kuning} strokeWidth={2} />
        {lengan(26, sudutKanan)}
        {/* kepala */}
        <rect x={-6} y={-142} width={12} height={12} fill={F.kulit} />
        <circle cx={-24} cy={-158} r={6} fill={F.kulit} />
        <circle cx={24} cy={-158} r={6} fill={F.kulit} />
        <circle cx={0} cy={-160} r={24} fill={F.kulit} />
        {janggut && <path d="M-20 -158 Q-18 -136 0 -134 Q18 -136 20 -158 Q10 -148 0 -148 Q-10 -148 -20 -158 Z" fill="#6B4128" strokeWidth={3} />}
        <g stroke="none">
          <circle cx={-14} cy={-152} r={4} fill={T.koralMuda} opacity={0.55} />
          <circle cx={14} cy={-152} r={4} fill={T.koralMuda} opacity={0.55} />
          <ellipse cx={-8} cy={-161} rx={3.2} ry={4.2} fill={NAVY} />
          <ellipse cx={8} cy={-161} rx={3.2} ry={4.2} fill={NAVY} />
          <circle cx={-7} cy={-163} r={1.3} fill="#FFFFFF" />
          <circle cx={9} cy={-163} r={1.3} fill="#FFFFFF" />
        </g>
        <path d="M-13 -170 q5 -3 9 0 M4 -170 q5 -3 9 0" strokeWidth={2.5} fill="none" />
        <path d="M0 -158 q3 4 -1 6" strokeWidth={2.5} fill="none" />
        {senang ? <path d="M-7 -150 q7 9 14 0 Z" fill="#7A2E2E" strokeWidth={2.5} /> : <path d="M-7 -149 q7 6 14 0" strokeWidth={2.5} fill="none" />}
        {/* rambut / topi */}
        {topi === "kupluk" ? (
          <g>
            <path d="M-26 -164 Q0 -206 26 -164 Z" fill={T.koral} />
            <rect x={-27} y={-172} width={54} height={10} rx={4} fill={T.koralTua} />
            <circle cx={0} cy={-196} r={6} fill={T.koral} />
          </g>
        ) : topi === "topi" ? (
          <g>
            <path d="M-24 -166 Q0 -198 24 -166 Z" fill="#2B4A7A" />
            <path d="M8 -168 L40 -165 L38 -158 L4 -162 Z" fill="#2B4A7A" />
            <circle cx={-4} cy={-178} r={4} fill={T.kuning} strokeWidth={2} />
          </g>
        ) : (
          <g>
            <path d="M-24 -164 Q-22 -190 0 -188 Q22 -190 24 -164 Q12 -176 0 -174 Q-12 -176 -24 -164 Z" fill="#4A3020" />
            {topi === "headset" && (
              <g>
                <path d="M-26 -162 Q0 -198 26 -162" stroke="#3A4660" strokeWidth={5} fill="none" />
                <rect x={-32} y={-168} width={10} height={18} rx={4} fill="#3A4660" />
                <rect x={22} y={-168} width={10} height={18} rx={4} fill="#3A4660" />
                <path d="M-28 -152 Q-22 -140 -8 -142" strokeWidth={2.5} fill="none" />
              </g>
            )}
          </g>
        )}
      </g>
    </g>
  );
};

// nelayan (sementara digambar kode; nanti AI): kupluk koral, jas hujan kuning berkerah + kancing kayu + saku, sarung tangan, sepatu bot,
// janggut pendek. rompi = rompi pelampung koral; pelampung = pelampung lengan (adegan takut air)
type PoseNelayan = "berdiri" | "dorong" | "duduk" | "sorak" | "pancing" | "takut";
export const Nelayan: React.FC<{ x: number; bawah: number; t?: number; pose?: PoseNelayan; flip?: boolean; rompi?: boolean; pelampung?: boolean }> = ({
  x, bawah, t = 1, pose = "berdiri", flip, rompi, pelampung,
}) => {
  const duduk = pose === "duduk";
  const takut = pose === "takut";
  const lengan = (bx: number, by: number, sudut: number, panjang = 150) => (
    <g transform={`rotate(${sudut} ${bx} ${by})`}>
      <rect x={bx - 17} y={by} width={34} height={panjang} rx={16} fill={T.kuning} />
      <rect x={bx - 19} y={by + panjang - 24} width={38} height={16} rx={6} fill={T.kuningTua} />
      <circle cx={bx} cy={by + panjang + 6} r={19} fill="#3A4660" />
      {pelampung && <ellipse cx={bx} cy={by + 44} rx={34} ry={20} fill={T.koralMuda} />}
    </g>
  );
  const [ka, kn] =
    pose === "sorak" ? [160, -160] : pose === "dorong" ? [-70, -80] : takut ? [165, -165] : pose === "pancing" ? [10, -60] : duduk ? [-15, -40] : [10, -10];
  return (
    <g transform={`translate(${x} ${bawah}) scale(${(flip ? -1 : 1) * t} ${t})`} stroke={NAVY} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx={0} cy={4} rx={100} ry={14} fill="rgba(10,14,34,.25)" stroke="none" />
      {duduk ? (
        <g>
          <rect x={-40} y={-70} width={170} height={42} rx={18} fill="#24365E" />
          <rect x={100} y={-70} width={40} height={74} rx={16} fill="#24365E" />
          <rect x={92} y={-24} width={66} height={30} rx={10} fill="#35506E" />
        </g>
      ) : (
        <g>
          <rect x={-46} y={-170} width={40} height={130} rx={16} fill="#24365E" />
          <rect x={8} y={-170} width={40} height={130} rx={16} fill="#1C2C4E" />
          {/* sepatu bot karet */}
          <path d="M-50 -70 L-2 -70 L-2 -4 L-62 -4 Q-64 -20 -50 -24 Z" fill="#35506E" />
          <path d="M4 -70 L52 -70 L52 -24 Q66 -20 64 -4 L4 -4 Z" fill="#35506E" />
          <rect x={-64} y={-12} width={62} height={10} rx={4} fill="#1A2238" />
          <rect x={4} y={-12} width={62} height={10} rx={4} fill="#1A2238" />
        </g>
      )}
      <g transform={duduk ? "translate(0 110)" : undefined}>
        {lengan(-81, -330, ka, takut ? 110 : 150)}
        {/* jas hujan */}
        <path d="M-72 -340 Q0 -362 72 -340 L84 -150 L-84 -150 Z" fill={T.kuning} />
        <path d="M-84 -178 L84 -178 L84 -150 L-84 -150 Z" fill={T.kuningTua} opacity={0.55} stroke="none" />
        <path d="M6 -350 L14 -150" stroke={T.kuningTua} strokeWidth={6} />
        {[-300, -258, -216].map((y) => <rect key={y} x={16} y={y} width={18} height={9} rx={4} fill="#6B4128" strokeWidth={3} />)}
        <rect x={-66} y={-236} width={42} height={34} rx={6} fill="none" stroke={T.kuningTua} strokeWidth={5} />
        <rect x={34} y={-236} width={42} height={34} rx={6} fill="none" stroke={T.kuningTua} strokeWidth={5} />
        <path d="M-44 -348 L0 -318 L44 -348 L34 -360 L0 -336 L-34 -360 Z" fill={T.kuningTua} />
        {rompi && (
          <g>
            <path d="M-74 -338 L-14 -334 L-18 -176 L-80 -182 Z" fill={T.koral} />
            <path d="M74 -338 L14 -334 L18 -176 L80 -182 Z" fill={T.koral} />
            <rect x={-78} y={-284} width={64} height={12} fill="#FFFFFF" strokeWidth={3} />
            <rect x={14} y={-284} width={64} height={12} fill="#FFFFFF" strokeWidth={3} />
            <rect x={-24} y={-232} width={48} height={14} rx={4} fill="#1A2238" strokeWidth={3} />
          </g>
        )}
        {lengan(81, -330, kn, takut ? 110 : 150)}
        {/* kepala */}
        <circle cx={0} cy={-404} r={62} fill={F.kulit} />
        <circle cx={-60} cy={-400} r={14} fill={F.kulit} />
        <circle cx={60} cy={-400} r={14} fill={F.kulit} />
        <path d="M-56 -404 Q-50 -340 0 -336 Q50 -340 56 -404 Q40 -374 0 -374 Q-40 -374 -56 -404 Z" fill="#6B4128" />
        <circle cx={-34} cy={-388} r={9} fill={T.koralMuda} opacity={0.5} stroke="none" />
        <circle cx={34} cy={-388} r={9} fill={T.koralMuda} opacity={0.5} stroke="none" />
        {takut ? (
          <g>
            <ellipse cx={-22} cy={-414} rx={14} ry={16} fill="#FFFFFF" strokeWidth={4} />
            <ellipse cx={22} cy={-414} rx={14} ry={16} fill="#FFFFFF" strokeWidth={4} />
            <circle cx={-22} cy={-412} r={5} fill={NAVY} stroke="none" />
            <circle cx={22} cy={-412} r={5} fill={NAVY} stroke="none" />
            <path d="M-38 -440 L-10 -432 M38 -440 L10 -432" strokeWidth={5} />
            <ellipse cx={0} cy={-358} rx={14} ry={15} fill="#3A1A1A" strokeWidth={4} />
          </g>
        ) : (
          <g>
            <ellipse cx={-20} cy={-412} rx={7} ry={duduk ? 4 : 10} fill={NAVY} stroke="none" />
            <ellipse cx={20} cy={-412} rx={7} ry={duduk ? 4 : 10} fill={NAVY} stroke="none" />
            {!duduk && <circle cx={-17} cy={-416} r={3} fill="#FFFFFF" stroke="none" />}
            {!duduk && <circle cx={23} cy={-416} r={3} fill="#FFFFFF" stroke="none" />}
            <path d={duduk ? "M-34 -428 L-8 -436 M34 -428 L8 -436" : "M-34 -432 Q-20 -442 -8 -434 M34 -432 Q20 -442 8 -434"} strokeWidth={5} fill="none" />
            <path d={duduk ? "M-16 -356 q16 -10 32 0" : pose === "sorak" ? "M-18 -364 q18 18 36 0 Z" : "M-16 -362 q16 10 32 0"} stroke="#3A2216" strokeWidth={5} fill={pose === "sorak" ? "#7A2E2E" : "none"} />
          </g>
        )}
        <ellipse cx={0} cy={-390} rx={11} ry={9} fill={F.kulitTua} stroke="none" />
        {/* kupluk rajut */}
        <path d="M-66 -420 Q0 -500 66 -420 Z" fill={T.koral} />
        {[-36, -12, 12, 36].map((dx) => <path key={dx} d={`M${dx} -424 L${dx * 0.7} -468`} stroke={T.koralTua} strokeWidth={4} />)}
        <rect x={-70} y={-434} width={140} height={22} rx={10} fill={T.koralTua} />
        {takut && (
          <g stroke="none" fill="#9FE0FF">
            <path d="M78 -460 q10 18 0 26 q-10 -8 0 -26 Z" />
            <path d="M-86 -430 q10 18 0 26 q-10 -8 0 -26 Z" />
          </g>
        )}
        {pose === "pancing" && <path d="M120 -470 L320 -620" stroke="#8C5634" strokeWidth={8} />}
      </g>
      {takut && (
        <g stroke={NAVY} strokeWidth={5} fill="none" opacity={0.7}>
          <path d="M-120 -300 q-12 20 0 40 M-140 -290 q-12 20 0 40" />
          <path d="M120 -300 q12 20 0 40 M140 -290 q12 20 0 40" />
        </g>
      )}
    </g>
  );
};

// ---------- benda fokus ----------
// kapal selam tampak samping (anatomi asli: menara + sirip menara + tiang periskop/snorkel/antena, sirip haluan,
// ekor salib + baling-baling 5 daun, lubang limber, ventilasi tangki di atas, lampu sorot haluan, sambungan pelat + paku keling).
// potong = tampak dalam: tangki ballast depan/belakang (di antara lambung luar & lambung tekan), lambung tekan bergading,
// sekat + pintu, ruang mesin (motor + poros), ruang kendali di bawah menara (periskop + konsol), ruang tidur, ruang sonar,
// tangki trim depan+belakang & baterai di bawah lantai, pipa langit-langit + katup, awak berwajah.
// fokus = bagian yang sedang dijelaskan (terang & kontras); semua detail lain lewat filter detailRedam
type Kapal = { x: number; y: number; s?: number; miring?: number; air?: number; trim?: number; potong?: boolean; darurat?: boolean; penyok?: number; awak?: boolean; lampu?: boolean; fokus?: "ballast" | "trim" };
export const KapalSelam: React.FC<Kapal> = ({ x, y, s = 1, miring = 0, air = 0, trim = 0.5, potong = false, darurat = false, penyok = 0, awak = true, lampu = false, fokus = "ballast" }) => {
  const jendela = darurat ? T.koralTua : "#5FA8C9";
  const tangki = (x0: number, w: number) => (
    <g>
      <rect x={x0} y={-62} width={w} height={124} rx={18} fill="#14284A" stroke={NAVY} strokeWidth={5} />
      <rect x={x0 + 4} y={62 - 120 * air} width={w - 8} height={Math.max(0, 120 * air - 4)} rx={12} fill="url(#gAir)" />
      {air > 0.05 && <path d={`M${x0 + 6} ${62 - 120 * air} q${w / 4} -8 ${w / 2 - 6} 0 t${w / 2 - 6} 0`} stroke={F.busa} strokeWidth={4} fill="none" />}
      {/* katup ventilasi atas & lubang banjir bawah */}
      <rect x={x0 + w / 2 - 10} y={-70} width={20} height={10} rx={3} fill="#97A3BB" stroke={NAVY} strokeWidth={3} />
      {[0.25, 0.5, 0.75].map((p) => <rect key={p} x={x0 + w * p - 6} y={58} width={12} height={8} rx={2} fill={NAVY} />)}
    </g>
  );
  const trimTangki = (x0: number) => (
    <g>
      <rect x={x0} y={26} width={62} height={32} rx={8} fill="#14284A" stroke={NAVY} strokeWidth={3} />
      <rect x={x0 + 3} y={56 - 28 * trim} width={56} height={28 * trim} rx={6} fill="url(#gAir)" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) rotate(${miring}) scale(${s})`} strokeLinejoin="round">
      {lampu && <path d="M330 -16 L720 -150 L720 130 Z" fill="url(#cahayaKuning)" />}
      {/* ekor salib: kemudi atas/bawah + sirip datar belakang, poros + baling-baling */}
      <g stroke={NAVY} strokeWidth={6}>
        <path d="M-296 -58 L-362 -132 L-388 -132 L-372 -40 Z" fill={T.kuningTua} />
        <path d="M-296 58 L-362 132 L-388 132 L-372 40 Z" fill={T.kuningTua} />
        <path d="M-300 -8 L-392 -16 L-392 16 L-300 8 Z" fill={T.kuning} />
        <rect x={-412} y={-11} width={44} height={22} rx={6} fill="#97A3BB" />
        {[-44, -22, 0, 22, 44].map((dy) => <ellipse key={dy} cx={-420} cy={dy} rx={9} ry={13} fill="#C9D3E3" strokeWidth={4} />)}
        <circle cx={-420} cy={0} r={11} fill="#6C7690" strokeWidth={4} />
      </g>
      {/* menara (sail) + tiang + sirip menara */}
      <g stroke={NAVY} strokeWidth={6}>
        <rect x={-14} y={-196} width={12} height={64} fill="#C9D3E3" strokeWidth={4} />
        <rect x={-22} y={-206} width={26} height={14} rx={3} fill="#97A3BB" strokeWidth={4} />
        <rect x={26} y={-172} width={14} height={40} fill="#97A3BB" strokeWidth={4} />
        <line x1={70} x2={70} y1={-136} y2={-214} strokeWidth={4} />
        <circle cx={70} cy={-216} r={5} fill={T.koral} strokeWidth={3} />
        <path d="M-70 -80 Q-66 -132 -20 -136 L60 -136 Q92 -132 96 -80 Z" fill={T.kuning} />
        <path d="M-58 -112 L-132 -106 L-132 -94 L-58 -96 Z" fill={T.kuningTua} />
        <rect x={-40} y={-126} width={18} height={12} rx={3} fill={jendela} strokeWidth={3} />
        <rect x={-14} y={-126} width={18} height={12} rx={3} fill={jendela} strokeWidth={3} />
        <text x={50} y={-92} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={28} fill={NAVY} stroke="none">S-5</text>
      </g>
      {/* lambung luar (kapsul) */}
      <path d={`M-330 0 Q-330 -88 -230 -88 L ${240 - penyok * 40} -88 Q330 -88 340 0 Q330 88 240 88 L-230 88 Q-330 88 -330 0 Z`} fill={T.kuning} stroke={NAVY} strokeWidth={7} />
      <path d="M-322 22 Q-300 86 -230 86 L240 86 Q322 86 334 22 Z" fill={T.kuningTua} opacity={0.35} />
      <path d="M-290 -58 Q-200 -78 220 -76" stroke={T.sorot} strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.85} />
      {/* casing dek + ventilasi tangki di atas */}
      <rect x={-210} y={-98} width={420} height={10} rx={4} fill={T.kuningTua} stroke={NAVY} strokeWidth={4} />
      {[-262, -232, 232, 262].map((vx) => <ellipse key={vx} cx={vx} cy={-84} rx={10} ry={4} fill={NAVY} />)}
      {/* sirip haluan + lampu sorot + kubah sonar */}
      <path d="M236 6 L300 14 L300 26 L236 20 Z" fill={T.kuningTua} stroke={NAVY} strokeWidth={4} />
      <circle cx={322} cy={-30} r={11} fill={T.sorot} stroke={NAVY} strokeWidth={4} />
      {penyok > 0 && <path d={`M140 -88 L170 ${-88 + 30 * penyok} L200 -88 M60 88 L90 ${88 - 26 * penyok} L120 88`} stroke={NAVY} strokeWidth={6} fill={T.kuningTua} />}
      {potong ? (
        <g>
          <g filter="url(#detailRedam)">
          {fokus !== "ballast" && tangki(-310, 90)}
          {fokus !== "ballast" && tangki(220, 100)}
          {/* poros baling-baling dari motor ke ekor */}
          <line x1={-330} x2={-170} y1={0} y2={0} stroke="#6C7690" strokeWidth={8} />
          {/* lambung tekan (tabung baja tebal) + gading-gading */}
          <rect x={-212} y={-66} width={424} height={132} rx={66} fill={darurat ? "#3A1A2A" : "#22355C"} stroke="#9FB0C9" strokeWidth={10} />
          {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={-170 + i * 38} x2={-170 + i * 38} y1={-58} y2={20} stroke={darurat ? "#4A2638" : "#2E4672"} strokeWidth={3} />)}
          {/* pipa langit-langit + katup */}
          <line x1={-196} x2={196} y1={-50} y2={-50} stroke="#7E8BA8" strokeWidth={6} />
          <line x1={-190} x2={190} y1={-42} y2={-42} stroke="#C9D3E3" strokeWidth={3} />
          <circle cx={-150} cy={-46} r={6} fill={T.koral} stroke={NAVY} strokeWidth={2} />
          <circle cx={120} cy={-46} r={6} fill={T.koral} stroke={NAVY} strokeWidth={2} />
          {/* lantai, sekat + pintu */}
          <line x1={-204} x2={204} y1={22} y2={22} stroke="#9FB0C9" strokeWidth={4} />
          {[-122, 62, 140].map((bx) => (
            <g key={bx}>
              <rect x={bx - 4} y={-62} width={8} height={84} fill="#9FB0C9" />
              <rect x={bx - 6} y={-26} width={12} height={46} rx={6} fill="#0E1A33" />
            </g>
          ))}
          {/* ruang mesin: motor listrik bersirip */}
          <rect x={-196} y={-22} width={56} height={40} rx={10} fill="#97A3BB" stroke={NAVY} strokeWidth={3} />
          {[0, 1, 2, 3].map((i) => <line key={i} x1={-188 + i * 13} x2={-188 + i * 13} y1={-20} y2={16} stroke="#6C7690" strokeWidth={3} />)}
          {/* ruang kendali di bawah menara: periskop + konsol layar */}
          <rect x={-10} y={-66} width={8} height={56} fill="#C9D3E3" stroke={NAVY} strokeWidth={2} />
          <rect x={-16} y={-14} width={20} height={10} rx={3} fill="#6C7690" stroke={NAVY} strokeWidth={2} />
          <rect x={-112} y={-30} width={34} height={50} rx={4} fill="#1A2238" stroke={NAVY} strokeWidth={2} />
          <rect x={-108} y={-26} width={26} height={14} rx={2} fill={darurat ? T.koral : "#2FA7C9"} />
          {[0, 1, 2].map((i) => <circle key={i} cx={-104 + i * 9} cy={-4} r={2.5} fill={[T.kuning, T.koral, "#2FA7C9"][i]} />)}
          {/* ruang tidur: ranjang susun */}
          {[-36, -4].map((by) => <rect key={by} x={72} y={by} width={58} height={10} rx={3} fill="#C9D3E3" stroke={NAVY} strokeWidth={2} />)}
          {[-36, -4].map((by) => <rect key={by} x={74} y={by - 7} width={14} height={7} rx={3} fill="#FFFFFF" stroke={NAVY} strokeWidth={1.5} />)}
          {/* ruang sonar haluan */}
          <rect x={150} y={-26} width={40} height={44} rx={4} fill="#1A2238" stroke={NAVY} strokeWidth={2} />
          <circle cx={170} cy={-8} r={12} fill="#0E3A4A" stroke="#2FA7C9" strokeWidth={2} />
          <path d="M162 -8 a8 8 0 0 1 16 0" stroke="#7FE3FF" strokeWidth={2} fill="none" />
          {/* bawah lantai: tangki trim depan+belakang, baterai di tengah */}
          {fokus !== "trim" && trimTangki(-196)}
          {fokus !== "trim" && trimTangki(134)}
          {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-120 + i * 26} y={30} width={20} height={24} rx={3} fill="#3A4660" stroke={NAVY} strokeWidth={2} />)}
          {awak && (
            <g>
              <Awak x={-92} bawah={22} t={0.41} pose="duduk" topi="headset" baju="#C9D3E3" />
              <Awak x={-30} bawah={22} t={0.42} topi="topi" baju={T.koral} janggut flip />
              <Awak x={30} bawah={22} t={0.41} topi="kupluk" baju="#9FD6EE" />
              <Awak x={176} bawah={22} t={0.38} pose="duduk" topi="headset" baju="#C9D3E3" flip />
            </g>
          )}
          </g>
          {fokus === "ballast" && tangki(-310, 90)}
          {fokus === "ballast" && tangki(220, 100)}
          {fokus === "trim" && trimTangki(-196)}
          {fokus === "trim" && trimTangki(134)}
          {darurat && <rect x={-206} y={-60} width={412} height={120} rx={60} fill="url(#lampuMerah)" />}
        </g>
      ) : (
        <g>
          {/* sambungan pelat + paku keling + lubang limber */}
          {[-230, -130, -30, 70, 170, 262].map((sx) => (
            <g key={sx}>
              <line x1={sx} x2={sx} y1={-86} y2={86} stroke={T.kuningTua} strokeWidth={3} opacity={0.4} />
              {[-70, -38, 38, 70].map((ry) => <circle key={ry} cx={sx + 8} cy={ry} r={3} fill={T.kuningTua} opacity={0.55} />)}
            </g>
          ))}
          {Array.from({ length: 15 }).map((_, i) => <rect key={i} x={-218 + i * 30} y={62} width={16} height={7} rx={3} fill={NAVY} opacity={0.3} />)}
          {[-200, -120, -40, 40, 120, 200].map((jx) => (
            <g key={jx}>
              <circle cx={jx} cy={-6} r={25} fill={T.kuningTua} stroke={NAVY} strokeWidth={4} />
              {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={jx + 21 * Math.cos((i * Math.PI) / 3)} cy={-6 + 21 * Math.sin((i * Math.PI) / 3)} r={2.2} fill={NAVY} opacity={0.5} />)}
              <circle cx={jx} cy={-6} r={16} fill={jendela} stroke={NAVY} strokeWidth={4} />
              <circle cx={jx - 5} cy={-11} r={4} fill="#FFFFFF" opacity={0.5} />
            </g>
          ))}
        </g>
      )}
    </g>
  );
};

// perahu nelayan kayu (anatomi trawler kecil): haluan naik, papan lambung + paku, bibir lambung, garis air koral,
// nomor registrasi, ban fender, ruang kemudi (jendela berkilau, pintu, pelampung bulat, lampu atap, antena),
// tiang + palang + bendera + tali, tumpukan jaring + pelampung kuning, kotak ikan, gulungan tali, pagar haluan.
// Titik asal = garis air; dek di y = -40.
export const PerahuNelayan: React.FC<{ x: number; y: number; s?: number; miring?: number }> = ({ x, y, s = 1, miring = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${miring}) scale(${s})`} stroke={NAVY} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
    {/* tiang + tali */}
    <line x1={60} x2={60} y1={-40} y2={-300} />
    <line x1={20} x2={100} y1={-250} y2={-250} strokeWidth={5} />
    <path d="M60 -296 L110 -282 L60 -266 Z" fill={T.koral} strokeWidth={4} />
    <path d="M60 -296 L290 -82 M60 -296 L-250 -44" stroke="#97A3BB" strokeWidth={3} />
    {/* ruang kemudi (belakang) */}
    <rect x={-190} y={-196} width={150} height={156} rx={10} fill="#F4EFE6" />
    <path d="M-204 -196 L-26 -196 L-34 -214 L-196 -214 Z" fill="#2B4A7A" />
    <line x1={-160} x2={-160} y1={-214} y2={-262} strokeWidth={4} />
    <circle cx={-80} cy={-224} r={10} fill={T.koral} strokeWidth={4} />
    {[-176, -126, -76].map((wx) => (
      <g key={wx}>
        <rect x={wx} y={-182} width={40} height={36} rx={5} fill="url(#gKaca)" />
        <path d={`M${wx + 8} ${-152} L${wx + 28} ${-178}`} stroke="#FFFFFF" strokeWidth={4} opacity={0.8} />
      </g>
    ))}
    <rect x={-180} y={-132} width={38} height={92} rx={4} fill="#E3D8C6" />
    <circle cx={-150} cy={-88} r={3} fill={NAVY} />
    <circle cx={-82} cy={-100} r={26} fill="#FFFFFF" strokeWidth={5} />
    <circle cx={-82} cy={-100} r={12} fill="#F4EFE6" strokeWidth={4} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-82 + 19 * Math.cos(i * 1.57 + 0.4)} ${-100 + 19 * Math.sin(i * 1.57 + 0.4)} l${4 * Math.cos(i * 1.57 + 0.4)} ${4 * Math.sin(i * 1.57 + 0.4)}`} stroke={T.koral} strokeWidth={10} />)}
    {/* tumpukan jaring + pelampung (buritan) */}
    <path d="M-262 -40 Q-250 -96 -214 -92 Q-200 -110 -192 -40 Z" fill="#3E5B84" />
    <path d="M-256 -60 L-198 -84 M-250 -46 L-204 -98 M-236 -40 L-214 -94" stroke="#2A3F62" strokeWidth={3} />
    {[[-246, -70], [-222, -88], [-206, -58]].map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r={8} fill={T.kuning} strokeWidth={3} />)}
    {/* kotak ikan + gulungan tali (dek depan) */}
    <rect x={110} y={-84} width={56} height={44} rx={5} fill="#5FA8C9" />
    <rect x={120} y={-118} width={46} height={34} rx={5} fill="#7FBEDB" />
    <line x1={110} x2={166} y1={-62} y2={-62} strokeWidth={3} />
    <ellipse cx={210} cy={-50} rx={26} ry={10} fill="#C9A57E" strokeWidth={4} />
    <ellipse cx={210} cy={-50} rx={14} ry={5} fill="none" strokeWidth={3} />
    {/* pagar haluan */}
    <path d="M190 -40 L190 -84 L286 -110 L286 -82" fill="none" strokeWidth={4} />
    {/* lambung: haluan naik, papan + paku, bibir lambung, garis air koral */}
    <path d="M-270 -40 L200 -40 Q262 -44 300 -86 L262 22 Q236 58 180 62 L-212 62 Q-262 56 -270 -40 Z" fill="#B5764A" />
    <path d="M-262 -6 L262 -4 M-252 26 L246 26" stroke="#8C5634" strokeWidth={4} />
    {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={-240 + i * 44} cy={-24} r={3} fill="#5A3A22" stroke="none" />)}
    <path d="M-274 -46 L204 -46 Q266 -50 306 -92" stroke="#6B4128" strokeWidth={12} fill="none" />
    <path d="M-252 40 L254 40 Q236 58 180 62 L-212 62 Q-246 58 -252 40 Z" fill={T.koral} strokeWidth={4} />
    <text x={180} y={18} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={30} fill="#FFFFFF" stroke="none">FN-27</text>
    {[-180, -40].map((fx) => <ellipse key={fx} cx={fx} cy={0} rx={14} ry={22} fill="#2A2F3E" strokeWidth={4} />)}
  </g>
);

// speedboat bermesin jet (aksen koral): lambung putih bergaris, kaca depan + kilau, kursi, setir, mesin jet ber-ring, api berlapis, buih jejak
export const SpeedboatJet: React.FC<{ x: number; y: number; s?: number; api?: boolean; jejak?: boolean }> = ({ x, y, s = 1, api = true, jejak = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={NAVY} strokeWidth={6} strokeLinejoin="round">
    {jejak && (
      <g stroke="none">
        <path d="M-300 26 Q-480 8 -640 36 L-640 66 Q-480 48 -300 50 Z" fill="#FFFFFF" opacity={0.85} />
        {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={-340 - i * 46} cy={38 + (i % 3) * 8} r={10 + (i % 4) * 4} fill="#FFFFFF" opacity={0.9} />)}
      </g>
    )}
    {api && (
      <g stroke="none">
        <path d="M-310 -26 Q-470 -16 -540 -10 Q-470 18 -310 16 Z" fill={T.koral} />
        <path d="M-310 -16 Q-430 -8 -480 -6 Q-430 10 -310 8 Z" fill={T.kuning} />
        <path d="M-310 -8 Q-380 -4 -410 -3 Q-380 4 -310 3 Z" fill="#FFFFFF" />
      </g>
    )}
    <rect x={-316} y={-44} width={72} height={64} rx={14} fill="#C9D3E3" />
    {[-298, -280, -262].map((rx) => <line key={rx} x1={rx} x2={rx} y1={-42} y2={18} stroke="#97A3BB" strokeWidth={4} />)}
    <ellipse cx={-316} cy={-12} rx={8} ry={24} fill="#3A4660" strokeWidth={4} />
    <rect x={-130} y={-74} width={50} height={36} rx={10} fill={T.koralTua} strokeWidth={4} />
    <rect x={-70} y={-74} width={50} height={36} rx={10} fill={T.koralTua} strokeWidth={4} />
    <path d="M-260 -40 L250 -40 Q300 -40 330 -8 L240 40 L-250 40 Z" fill="#F4F6FA" />
    <path d="M-250 14 L300 14 L240 40 L-250 40 Z" fill="#D5DCE8" strokeWidth={4} />
    <path d="M-255 -10 L300 -10 L288 4 L-250 6 Z" fill={T.koral} strokeWidth={4} />
    <line x1={-250} x2={296} y1={-20} y2={-20} stroke={T.kuning} strokeWidth={4} />
    <line x1={-256} x2={250} y1={-42} y2={-42} stroke="#97A3BB" strokeWidth={5} />
    <path d="M-30 -40 Q8 -104 94 -104 L126 -40 Z" fill="url(#gKaca)" />
    <path d="M20 -50 L64 -96" stroke="#FFFFFF" strokeWidth={6} opacity={0.8} strokeLinecap="round" />
    <circle cx={-6} cy={-58} r={13} fill="none" strokeWidth={5} />
    <text x={170} y={36} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={24} fill={NAVY} stroke="none">JET-1</text>
  </g>
);

// ikan detail (gelembung renang terlihat): countershading, sisik, sirip punggung bertulang, sirip dada, ekor bercabang bertulang,
// tutup insang, garis lateral, mata ber-kilau (makin menonjol saat menggembung = lucu & benar: barotrauma)
export const IkanGelembung: React.FC<{ x: number; y: number; s?: number; gembung?: number }> = ({ x, y, s = 1, gembung = 0 }) => {
  const tinggi = 62 + 34 * gembung;
  const sisik: React.ReactNode[] = [];
  for (let sx = -70; sx <= 90; sx += 20) {
    for (let sy = -36; sy <= 36; sy += 18) {
      const rx = 118, ry = tinggi * 0.75;
      if ((sx - 0) ** 2 / rx ** 2 + sy ** 2 / ry ** 2 < 0.8) sisik.push(<path key={`${sx}_${sy}`} d={`M${sx + (sy % 36 ? 10 : 0)} ${sy} q8 9 16 0`} stroke="#4F75A6" strokeWidth={2.5} fill="none" opacity={0.6} />);
    }
  }
  const mata = 14 + 6 * gembung;
  const punggung = tinggi * 0.6; // puncak punggung (lengkung Q mencapai ±setengah titik kendali)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={NAVY} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
      {/* ekor bercabang + tulang sirip */}
      <path d="M100 -6 L168 -60 Q150 0 168 60 L100 6 Z" fill="#5F86B8" />
      {[-40, -20, 20, 40].map((ty) => <line key={ty} x1={108} x2={158} y1={ty * 0.15} y2={ty} stroke="#355E92" strokeWidth={2.5} />)}
      {/* sirip punggung */}
      <path d={`M-56 ${-punggung + 10} Q-40 ${-punggung - 40} -20 ${-punggung - 44} L10 ${-punggung - 34} L40 ${-punggung - 30} Q62 ${-punggung - 10} 74 ${-punggung * 0.55} Z`} fill="#5F86B8" />
      {[-30, 0, 30].map((fx) => <line key={fx} x1={fx} x2={fx + 4} y1={-punggung + 6} y2={-punggung - 30} stroke="#355E92" strokeWidth={2.5} />)}
      {/* tubuh */}
      <path d={`M-140 0 Q-50 ${-tinggi * 1.25} 104 -10 L104 10 Q-50 ${tinggi * 1.25} -140 0 Z`} fill="url(#gIkan)" />
      {sisik}
      <path d="M-80 -6 Q10 -18 100 -2" stroke="#EEF4FA" strokeWidth={3} strokeDasharray="8 7" fill="none" opacity={0.85} />
      {/* gelembung renang (potongan) */}
      <ellipse cx={-6} cy={6} rx={36 + 40 * gembung} ry={16 + 28 * gembung} fill={T.koralMuda} stroke={T.koralTua} strokeWidth={4} strokeDasharray="10 6" />
      <ellipse cx={-18} cy={-2} rx={10 + 8 * gembung} ry={5 + 4 * gembung} fill="#FFFFFF" opacity={0.6} stroke="none" />
      {/* tutup insang, sirip dada, mulut, mata */}
      <path d="M-86 -32 Q-66 0 -86 32" fill="none" stroke="#355E92" strokeWidth={4} />
      <path d="M-70 18 L-30 40 L-40 18 Z" fill="#5F86B8" strokeWidth={4} />
      <path d="M-138 4 q8 6 16 2" fill="none" strokeWidth={4} />
      <circle cx={-108} cy={-12} r={mata} fill="#FFFFFF" strokeWidth={4} />
      <circle cx={-106} cy={-12} r={mata * 0.55} fill={NAVY} stroke="none" />
      <circle cx={-103} cy={-16} r={mata * 0.2} fill="#FFFFFF" stroke="none" />
    </g>
  );
};

// ruang dalam kapal selam (seluruh kanvas): langit-langit melengkung, gading-gading, pelat + paku keling, pintu kedap bundar,
// tangga, panel kontrol (layar + tombol + jarum), pipa + flens + katup, kabel menjuntai, lampu darurat berkurung,
// lantai kisi + genangan, tulisan stensil, benda depan buram. darurat = merah; bocor = pipa pecah menyembur.
// bocor = true/1 penuh, atau 0–1 untuk semburan yang membesar (animasi); getar = denyut semburan per frame (animasi)
export const RuangKapal: React.FC<{ darurat?: boolean; bocor?: boolean | number; genangan?: number; getar?: number }> = ({ darurat = true, bocor = false, genangan = 0, getar = 0 }) => {
  const pb = bocor === true ? 1 : Number(bocor || 0);
  const dinding = darurat ? "#3A1C2C" : "#26365A";
  const rangka = darurat ? "#552838" : "#33497A";
  const logam = darurat ? "#B08A9A" : "#9FB0C9";
  const pipa = darurat ? "#9A7F8C" : "#7E8BA8";
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <rect x={-200} y={-200} width={W + 400} height={H + 400} fill={dinding} />
      <path d={`M-200 -200 L${W + 200} -200 L${W + 200} 560 Q540 430 -200 560 Z`} fill={darurat ? "#24101C" : "#18233F"} />
      {[-30, 120, 270, 420, 570, 720, 870, 1020].map((x) => (
        <g key={x}>
          <path d={`M${x} 500 Q${x + (x < 540 ? -30 : 30)} 900 ${x} 1330`} stroke={rangka} strokeWidth={22} fill="none" />
          <path d={`M${x + 8} 510 Q${x + 8 + (x < 540 ? -30 : 30)} 900 ${x + 8} 1320`} stroke={logam} strokeWidth={3} fill="none" opacity={0.35} />
        </g>
      ))}
      {[760, 940, 1120, 1280].map((y) => (
        <g key={y}>
          <line x1={-200} x2={W + 200} y1={y} y2={y} stroke={rangka} strokeWidth={4} />
          {Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={i * 52 + 10} cy={y - 10} r={3.5} fill={logam} opacity={0.5} />)}
        </g>
      ))}
      <text x={600} y={850} fontFamily="Baloo2" fontWeight={800} fontSize={40} fill={logam} opacity={0.35}>COMPARTMENT 3</text>
      {/* pintu kedap bundar (kiri) */}
      <g stroke={NAVY} strokeWidth={6}>
        <circle cx={220} cy={1020} r={150} fill={logam} />
        <circle cx={220} cy={1020} r={122} fill={rangka} />
        {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={220 + 136 * Math.cos((i * Math.PI) / 6)} cy={1020 + 136 * Math.sin((i * Math.PI) / 6)} r={5} fill={NAVY} strokeWidth={2} />)}
        <circle cx={220} cy={1020} r={52} fill="none" stroke="#C9D3E3" strokeWidth={10} />
        {[0, 1, 2].map((i) => <line key={i} x1={220 + 52 * Math.cos(i * 1.047)} y1={1020 + 52 * Math.sin(i * 1.047)} x2={220 - 52 * Math.cos(i * 1.047)} y2={1020 - 52 * Math.sin(i * 1.047)} stroke="#C9D3E3" strokeWidth={7} />)}
        <rect x={354} y={950} width={24} height={40} rx={6} fill="#6C7690" strokeWidth={4} />
        <rect x={354} y={1050} width={24} height={40} rx={6} fill="#6C7690" strokeWidth={4} />
      </g>
      {/* tangga ke palka atas */}
      <g stroke={NAVY} strokeWidth={5}>
        <rect x={452} y={520} width={12} height={810} fill={logam} />
        <rect x={536} y={520} width={12} height={810} fill={logam} />
        {Array.from({ length: 11 }).map((_, i) => <rect key={i} x={458} y={580 + i * 70} width={84} height={9} rx={3} fill={logam} strokeWidth={3} />)}
      </g>
      {/* panel kontrol */}
      <g stroke={NAVY} strokeWidth={5}>
        <rect x={620} y={930} width={300} height={250} rx={16} fill="#1A2238" />
        <rect x={642} y={952} width={120} height={80} rx={8} fill={darurat ? "#5A1E26" : "#0E3A4A"} />
        <path d="M650 994 l14 0 l8 -22 l10 40 l10 -30 l8 12 l52 0" stroke={darurat ? T.koral : "#7FE3FF"} strokeWidth={4} fill="none" />
        <circle cx={840} cy={992} r={44} fill="#F4F6FA" />
        <path d="M806 992 A34 34 0 0 1 874 992" stroke={T.koral} strokeWidth={8} fill="none" />
        <line x1={840} y1={992} x2={darurat ? 872 : 818} y2={darurat ? 976 : 966} strokeWidth={5} />
        {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={652 + (i % 5) * 26} cy={1070 + Math.floor(i / 5) * 30} r={9} fill={[T.kuning, T.koral, "#2FA7C9", "#C9D3E3", T.koral][i % 5]} strokeWidth={3} />)}
        <rect x={800} y={1070} width={96} height={20} rx={4} fill="#3A4660" strokeWidth={3} />
        <rect x={800} y={1104} width={96} height={20} rx={4} fill="#3A4660" strokeWidth={3} />
        <rect x={660} y={1180} width={20} height={150} fill="#141C30" />
        <rect x={860} y={1180} width={20} height={150} fill="#141C30" />
      </g>
      {/* pipa langit-langit + flens + katup */}
      {[[600, 28], [650, 20], [700, 14]].map(([y, w], i) => <line key={i} x1={-200} x2={W + 200} y1={y} y2={y} stroke={pipa} strokeWidth={w} />)}
      {[160, 420, 700, 960].map((fx) => <rect key={fx} x={fx} y={580} width={16} height={136} rx={4} fill={logam} stroke={NAVY} strokeWidth={3} />)}
      <g stroke={NAVY} strokeWidth={4}>
        <circle cx={320} cy={650} r={28} fill="none" stroke={T.koral} strokeWidth={8} />
        {[0, 1].map((i) => <line key={i} x1={320 + 28 * Math.cos(i * 1.57)} y1={650 + 28 * Math.sin(i * 1.57)} x2={320 - 28 * Math.cos(i * 1.57)} y2={650 - 28 * Math.sin(i * 1.57)} stroke={T.koral} strokeWidth={6} />)}
      </g>
      <line x1={70} x2={70} y1={700} y2={1330} stroke={pipa} strokeWidth={22} />
      {/* kabel menjuntai */}
      <path d="M-20 740 Q260 800 520 744 Q780 800 1100 742" stroke="#141C30" strokeWidth={8} fill="none" />
      <path d="M-20 752 Q260 818 520 758 Q780 816 1100 756" stroke={darurat ? "#6A2A36" : "#2B3F66"} strokeWidth={6} fill="none" />
      {/* lampu darurat berkurung */}
      <ellipse cx={760} cy={600} rx={220} ry={120} fill={darurat ? "url(#lampuMerah)" : "url(#cahayaKuning)"} />
      <g stroke={NAVY} strokeWidth={4}>
        <path d="M720 566 Q760 520 800 566 Z" fill={darurat ? T.koral : T.kuningMuda} />
        <path d="M730 566 Q740 536 760 532 M790 566 Q780 536 760 532 M760 532 L760 566" fill="none" stroke="#3A4660" />
        <rect x={714} y={562} width={92} height={10} rx={3} fill="#3A4660" />
      </g>
      {/* lantai kisi */}
      <rect x={-200} y={1330} width={W + 400} height={800} fill={darurat ? "#1A0E18" : "#141C30"} />
      <line x1={-200} x2={W + 200} y1={1330} y2={1330} stroke={logam} strokeWidth={6} />
      {Array.from({ length: 30 }).map((_, i) => <line key={i} x1={i * 40 - 40} x2={i * 40 - 80} y1={1336} y2={1440} stroke={rangka} strokeWidth={4} />)}
      {[1370, 1410].map((y) => <line key={y} x1={-200} x2={W + 200} y1={y} y2={y} stroke={rangka} strokeWidth={4} />)}
      {genangan > 0 && pb === 0 && (
        <g>
          <ellipse cx={540} cy={1380} rx={420 * genangan} ry={34} fill="url(#gAir)" opacity={0.85} />
          <path d={`M${540 - 200 * genangan} 1372 q40 -8 80 0 M${540 + 60 * genangan} 1386 q40 -8 80 0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.7} />
        </g>
      )}
      {darurat && <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#lampuMerah)" />}
      {pb > 0 && (
        <g>
          {/* semburan: cyan cerah + inti putih + garis navy tebal, di atas cahaya merah → komplementer, paling menonjol */}
          {/* tiap pancaran = baji meruncing dari pipa (sempit) melebar ke ujung, lalu pecah jadi butiran */}
          {[[380, 1040, 30], [480, 1130, 40], [610, 1170, 46], [730, 1100, 38], [830, 1000, 28]].map(([ex0, ey0, w0], i) => {
            const j = 1 + 0.06 * Math.sin(getar * 1.9 + i * 1.7);
            const ex = 640 + (ex0 - 640) * pb * j, ey = 660 + (ey0 - 660) * pb * j, w = w0 * Math.max(0.3, pb);
            const cx = 640 + (ex - 640) * 0.55, cy = 650;
            const d = `M636 662 Q${cx - w * 0.3} ${cy} ${ex - w} ${ey} Q${ex} ${ey + w * 0.6} ${ex + w} ${ey} Q${cx + w * 0.3} ${cy} 646 662 Z`;
            return (
              <g key={i}>
                <path d={d} fill="#5FE0FF" stroke={NAVY} strokeWidth={6} />
                <path d={`M641 666 Q${cx} ${cy + 10} ${ex} ${ey - 8}`} stroke="#FFFFFF" strokeWidth={7} fill="none" opacity={0.95} />
                {[0, 1, 2].map((j) => <circle key={j} cx={ex + (acak(i * 3 + j) - 0.5) * w * 3} cy={ey + 30 + j * 34 + acak(i + j) * 20} r={8 + acak(i * 5 + j) * 8} fill="#BFF4FF" stroke={NAVY} strokeWidth={3} />)}
              </g>
            );
          })}
          <path d="M622 630 L648 660 L628 684" stroke={NAVY} strokeWidth={14} fill="none" />
          <path d="M622 630 L648 660 L628 684" stroke="#FFFFFF" strokeWidth={6} fill="none" />
          {genangan > 0 && <ellipse cx={540} cy={1380} rx={460 * genangan} ry={40 * Math.min(1, genangan * 1.6)} fill="#5FE0FF" stroke={NAVY} strokeWidth={5} />}
          {genangan > 0.4 && <path d="M260 1374 q50 -10 100 0 M600 1388 q50 -10 100 0" stroke="#FFFFFF" strokeWidth={5} fill="none" />}
        </g>
      )}
      {/* benda depan buram: pipa melintang bawah-kiri + katup atas-kanan */}
      <g filter="url(#depan)" fill="none" stroke={darurat ? "#14070E" : "#0A1020"} opacity={0.9}>
        <path d="M-80 1560 Q200 1500 440 1600" strokeWidth={70} />
        <path d="M1060 420 L1060 900" strokeWidth={60} />
      </g>
    </g>
  );
};

// dek perahu nelayan dilihat dari dalam perahu (perspektif satu titik hilang, seperti ruang KS19 tapi di luar):
// separuh atas langit + camar + laut di balik bibir lambung, lantai papan menyempit ke titik hilang, dinding ruang kemudi di kiri,
// tiang + tali di kanan belakang, jaring + pelampung + kotak ikan, benda depan buram. Detail diredam; tokoh = fokus.
export const DekPerahu: React.FC<{ P: Palet; children?: React.ReactNode }> = ({ P, children }) => {
  const TH = { x: 540, y: 640 }; // titik hilang
  const BL = 1040; // tepi belakang lantai (bibir lambung)
  const keX = (x: number, y: number) => TH.x + ((x - TH.x) * (y - TH.y)) / (H - TH.y);
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      <LautBesar P={P} permukaan={880} siluet={false} />
      <Cakrawala y={880} P={P} />
      {/* tiang + tali (kanan belakang) */}
      <g stroke={NAVY} strokeWidth={8}>
        <line x1={850} x2={850} y1={960} y2={250} />
        <line x1={790} x2={910} y1={330} y2={330} strokeWidth={6} />
        <path d="M850 256 L920 276 L850 296 Z" fill={T.koral} strokeWidth={5} />
        <path d="M850 260 L1120 900 M850 260 L380 960" stroke="#97A3BB" strokeWidth={3} />
      </g>
      {/* bibir lambung belakang + pagar */}
      <g stroke={NAVY} strokeWidth={6}>
        {[120, 300, 480, 660, 840, 1000].map((px) => <rect key={px} x={px - 7} y={900} width={14} height={70} fill="#8C5634" strokeWidth={4} />)}
        <rect x={-40} y={892} width={1160} height={16} rx={6} fill="#8C5634" />
        <rect x={-40} y={966} width={1160} height={BL - 966} fill="#B5764A" />
        <path d={`M-40 ${BL - 40} L1120 ${BL - 40}`} stroke="#9A6440" strokeWidth={4} />
        <rect x={-40} y={958} width={1160} height={16} rx={6} fill="#6B4128" />
      </g>
      {/* lantai papan menuju titik hilang */}
      <path d={`M-200 ${BL} L1280 ${BL} L1280 ${H + 200} L-200 ${H + 200} Z`} fill="#C9925E" />
      {Array.from({ length: 21 }).map((_, i) => {
        const xb = -900 + i * 145;
        return <line key={i} x1={keX(xb, BL)} y1={BL} x2={xb} y2={H} stroke="#A8744A" strokeWidth={4} />;
      })}
      {[1120, 1230, 1380, 1580, 1840].map((y) => <line key={y} x1={-200} x2={1280} y1={y} y2={y} stroke="#A8744A" strokeWidth={3} opacity={0.7} />)}
      {/* dinding ruang kemudi (kiri, menyerong ke titik hilang) */}
      <g stroke={NAVY} strokeWidth={6}>
        <path d={`M-40 380 L170 ${BL - 380} L170 ${BL + 10} L-40 1300 Z`} fill="#E9E1D2" />
        <path d={`M-40 360 L190 ${BL - 400} L190 ${BL - 380} L-40 392 Z`} fill="#2B4A7A" />
        <path d={`M14 560 L120 ${BL - 360} L120 ${BL - 250} L14 700 Z`} fill="#8FC3DD" strokeWidth={5} />
        <circle cx={80} cy={950} r={46} fill="#F4EFE6" strokeWidth={5} />
        <circle cx={80} cy={950} r={22} fill="#E9E1D2" strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${80 + 34 * Math.cos(i * 1.57 + 0.4)} ${950 + 34 * Math.sin(i * 1.57 + 0.4)} l${6 * Math.cos(i * 1.57 + 0.4)} ${6 * Math.sin(i * 1.57 + 0.4)}`} stroke={T.koralTua} strokeWidth={16} />)}
      </g>
      {/* jaring + pelampung, kotak ikan (di belakang tokoh, diredam) */}
      <g filter="url(#detailRedam)">
        <g stroke={NAVY} strokeWidth={5}>
          <path d={`M600 ${BL + 30} Q620 ${BL - 50} 700 ${BL - 46} Q760 ${BL - 80} 820 ${BL - 10} Q860 ${BL + 10} 860 ${BL + 40} Z`} fill="#3E5B84" />
          {[[650, BL - 20], [720, BL - 46], [800, BL - 8]].map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r={14} fill={T.kuning} strokeWidth={4} />)}
          <rect x={200} y={BL - 10} width={110} height={70} rx={6} fill="#5FA8C9" />
          <rect x={214} y={BL - 64} width={90} height={54} rx={6} fill="#7FBEDB" />
        </g>
      </g>
      <ellipse cx={540} cy={1340} rx={520} ry={150} fill={`url(#sorot${P.id})`} />
      {children}
      {/* benda depan buram: gulungan tali kiri-bawah, pelampung kanan-bawah */}
      <g filter="url(#depan)" stroke="#5A3A22" strokeWidth={26} fill="none" opacity={0.95}>
        <ellipse cx={90} cy={1760} rx={170} ry={70} />
        <ellipse cx={90} cy={1760} rx={90} ry={34} />
      </g>
      <g filter="url(#depan)"><circle cx={1010} cy={1820} r={90} fill={T.koralTua} /></g>
    </g>
  );
};

// pengukur kedalaman (atas layar, pengganti peta jalur): zona aman teal, zona bahaya koral, penanda kapal
export const Kedalaman: React.FC<{ d: number; bahaya?: boolean }> = ({ d, bahaya }) => {
  const x0 = 70, x1 = 530;
  const mx = x0 + Math.min(1, d) * (x1 - x0);
  return (
    <svg width={600} height={120} style={{ position: "absolute", left: 240, top: 130 }}>
      <rect x={4} y={4} width={592} height={112} rx={22} fill="rgba(10,20,44,.84)" stroke="#FFFFFF" strokeWidth={4} />
      <rect x={x0} y={52} width={(x1 - x0) * 0.72} height={16} rx={8} fill="#2FA7C9" />
      <rect x={x0 + (x1 - x0) * 0.72} y={52} width={(x1 - x0) * 0.28} height={16} rx={8} fill={T.koral} />
      <rect x={x0 + (x1 - x0) * 0.72 - 2} y={42} width={4} height={36} fill="#FFFFFF" />
      <circle cx={mx} cy={60} r={14} fill={bahaya ? T.koral : T.kuning} stroke="#FFFFFF" strokeWidth={4} />
      <text x={36} y={66} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={20} fill="#FFFFFF">0</text>
      <text x={300} y={104} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={22} fill="#FFFFFF">
        {bahaya ? "PAST SAFE DEPTH!" : `DEPTH ${Math.round(d * 1300)} FT`}
      </text>
    </svg>
  );
};

const Subtitle: React.FC<{ teks: string }> = ({ teks }) => (
  <div style={{ position: "absolute", top: 1445, left: 30, right: 30, fontSize: 72, color: "#FFFFFF", ...gayaStroke(11) }}>{teks}</div>
);
const Catatan: React.FC<{ id: string; nama: string; vo: string }> = ({ id, nama, vo }) => (
  <>
    <div style={{ position: "absolute", top: 36, left: 40, padding: "6px 18px", borderRadius: 14, background: "rgba(255,255,255,.9)", color: NAVY, fontFamily: "Baloo2", fontWeight: 800, fontSize: 34 }}>
      {id} · {nama}
    </div>
    <div style={{ position: "absolute", top: 1600, left: 40, right: 40, padding: "18px 24px", borderRadius: 20, background: "rgba(30,42,68,.88)", color: "#F4F8FC", fontFamily: "Baloo2", fontWeight: 700, fontSize: 32, lineHeight: 1.25 }}>
      VO: “{vo}”
    </div>
  </>
);

// ---------- adegan ----------
// kamera: kunci kamera (cx, cy = titik dunia di tengah layar, s = zoom). Satu still per kunci. k = indeks kunci (gambar boleh beda per kunci).
type Kunci = { nama: string; cx: number; cy: number; s: number };
type Adegan = { nama: string; vo: string; sub: string; istilah?: string; P: Palet; d?: number; bahaya?: boolean; gambar: (P: Palet, k: number) => React.ReactNode; teks?: React.ReactNode; kamera?: Kunci[] };
export const Sorot: React.FC<{ P: Palet; x: number; y: number; r?: number }> = ({ P, x, y, r = 420 }) => <ellipse cx={x} cy={y} rx={r} ry={r} fill={`url(#sorot${P.id})`} />;

// garis laju (gerak relatif): ikan & gelembung "tertinggal" ke bawah saat kapal naik cepat
export const IkanLewat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={0} x2={0} y1={-40} y2={-200} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
    <g transform="rotate(90)" stroke={NAVY} strokeWidth={4}>
      <ellipse cx={0} cy={0} rx={30} ry={12} fill="#7FA6CF" />
      <path d="M-26 0 L-48 -14 L-48 14 Z" fill="#5F86B8" />
      <circle cx={16} cy={-3} r={3} fill={NAVY} stroke="none" />
    </g>
  </g>
);

// posisi speedboat per kunci kamera KS25 (melaju ke kanan; kamera terakhir mengikutinya)
const BOAT_KS25 = [640, 720, 790];

const ADEGAN: Adegan[] = [
  // ===== BABAK 1 =====
  {
    nama: "Hook — nelayan punya masalah", P: PERMUKAAN, sub: "YOU HAVE A PROBLEM",
    vo: "You're a fisherman... and you have a problem.",
    // audit: perahu dilihat dari jauh dulu, lalu zoom ke orangnya DI ATAS DEK — bagian perahu tetap kelihatan
    kamera: [
      { nama: "kamera lebar", cx: 540, cy: 960, s: 1.02 },
      { nama: "zoom ke dek", cx: 700, cy: 830, s: 1.9 },
    ],
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={1080} siluet={false} />
        <Cakrawala y={1080} P={P} />
        <Sorot P={P} x={600} y={900} r={460} />
        <PerahuNelayan x={540} y={1080} s={1.4} />
        <Nelayan x={710} bawah={1080 - 40 * 1.4} t={0.72} />
        <AirDepan P={P} y0={1080} />
        <DepanLaut P={P} />
      </>
    ),
  },
  {
    nama: "Orang kaya menawarkan $5 miliar", P: PERMUKAAN, sub: "FIVE BILLION DOLLARS",
    vo: "Someone just offered you FIVE billion dollars",
    gambar: (P) => (
      <DekPerahu P={P}>
        <AI n="orangkaya-4" x={310} bawah={1330} tinggi={760} />
        <Nelayan x={770} bawah={1330} t={1.25} flip />
      </DekPerahu>
    ),
    teks: <Uang top={360} sisa={0.5} />,
  },
  {
    nama: "Kapal yang tenggelam lalu naik lagi", P: PERMUKAAN, sub: "SINKS... AND COMES BACK UP", d: 0,
    vo: "to build a boat that sinks... and comes back up.",
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={PERMUKAAN_Y} dasar={1500} />
        <path d="M300 600 C300 1300, 780 1300, 780 600" stroke="#FFFFFF" strokeWidth={10} fill="none" strokeDasharray="30 22" />
        <Panah x1={300} y1={700} x2={300} y2={1000} w={14} warna={T.kuning} />
        <Panah x1={780} y1={1000} x2={780} y2={700} w={14} warna={T.kuning} />
        <KapalSelam x={560} y={1180} s={0.55} />
        <DepanLaut P={P} />
      </>
    ),
  },
  {
    nama: "Dibayar hanya kalau awak kembali", P: PERMUKAAN, sub: "YOUR CREW COMES BACK UP TOO",
    vo: "But you only get paid if your crew comes back up too, and all you've ever built are fishing boats, boats that float.",
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={PERMUKAAN_Y + 300} siluet={false} />
        <Sorot P={P} x={540} y={980} r={460} />
        <g transform="rotate(-4 540 980)" strokeLinejoin="round">
          <rect x={264} y={638} width={580} height={680} rx={20} fill="rgba(10,14,34,.25)" />
          <rect x={250} y={620} width={580} height={680} rx={20} fill="#FFFBF2" stroke={NAVY} strokeWidth={7} />
          {[1180, 1210, 1240].map((y) => <line key={y} x1={300} x2={780} y1={y} y2={y} stroke="#D9D2C2" strokeWidth={4} />)}
          <text x={540} y={710} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={58} fill={NAVY}>CONTRACT</text>
          <text x={540} y={800} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={50} fill="#2BB765">$5,000,000,000</text>
          {/* awak berwajah (bukan kotak lagi) */}
          <Awak x={410} bawah={1050} t={0.95} topi="kupluk" baju="#9FD6EE" />
          <Awak x={540} bawah={1050} t={1.0} topi="topi" baju={T.koral} janggut />
          <Awak x={670} bawah={1050} t={0.95} topi="headset" baju="#C9D3E3" flip />
          <rect x={300} y={1080} width={70} height={70} rx={10} fill="#FFFFFF" stroke={T.koral} strokeWidth={9} />
          <text x={400} y={1132} fontFamily="Baloo2" fontWeight={800} fontSize={40} fill={T.koral}>ALL CREW RETURN</text>
        </g>
      </>
    ),
  },
  {
    nama: "Cuma pernah bikin perahu yang mengapung", P: PERMUKAAN, sub: "BOATS THAT FLOAT",
    vo: "...all you've ever built are fishing boats, boats that float.",
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={PERMUKAAN_Y + 300} />
        <Cakrawala y={PERMUKAAN_Y + 300} P={P} />
        <Sorot P={P} x={540} y={850} />
        {/* jauh → dekat: makin kecil makin buram */}
        <g filter="url(#jauh)" opacity={0.8}><PerahuNelayan x={820} y={PERMUKAAN_Y + 300} s={0.36} miring={3} /></g>
        <g filter="url(#buram)"><PerahuNelayan x={250} y={PERMUKAAN_Y + 300} s={0.5} miring={-4} /></g>
        <PerahuNelayan x={560} y={PERMUKAAN_Y + 300} s={0.78} miring={2} />
        <AirDepan P={P} y0={PERMUKAAN_Y + 300} />
        <Panah x1={560} y1={1060} x2={560} y2={940} w={12} warna="#FFFFFF" />
      </>
    ),
  },
  {
    nama: "Mimpi speedboat jet", P: PERMUKAAN, sub: "JET-POWERED SPEEDBOAT",
    vo: "But you REALLY want a jet-powered speedboat... So HERE'S how you get the money!",
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={PERMUKAAN_Y + 360} siluet={false} />
        <Sorot P={P} x={620} y={760} r={460} />
        <g stroke={NAVY} strokeWidth={6}>
          <ellipse cx={620} cy={720} rx={430} ry={220} fill="#FFFFFF" />
          <circle cx={300} cy={980} r={28} fill="#FFFFFF" />
          <circle cx={250} cy={1040} r={17} fill="#FFFFFF" />
        </g>
        <path d="M230 790 Q620 760 1000 790" stroke="#9FD6EE" strokeWidth={16} fill="none" strokeLinecap="round" />
        <SpeedboatJet x={690} y={780} s={0.72} />
        <Nelayan x={200} bawah={1420} t={1.3} />
      </>
    ),
  },
  // ===== BABAK 2 =====
  {
    nama: "Lelucon: perahu didorong ke bawah air", P: PERMUKAAN, sub: "BOATS REALLY LIKE FLOATING", d: 0.01,
    vo: "First, you just push your fishing boat underwater. Five minutes, tops. [laughs] It pops right back up. Boats REALLY like floating.",
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={PERMUKAAN_Y + 200} siluet={false} />
        <Cakrawala y={PERMUKAAN_Y + 200} P={P} />
        <Sorot P={P} x={540} y={820} />
        <PerahuNelayan x={560} y={PERMUKAAN_Y + 150} s={1} miring={-12} />
        {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={360 + acak(i) * 360} cy={PERMUKAAN_Y + 190 - acak(i + 5) * 120} r={10 + acak(i + 2) * 16} fill="#FFFFFF" stroke={NAVY} strokeWidth={4} />)}
        <AirDepan P={P} y0={PERMUKAAN_Y + 200} />
        <Panah x1={560} y1={1150} x2={560} y2={900} w={16} warna={T.kuning} />
        <Nelayan x={260} bawah={PERMUKAAN_Y + 420} t={0.9} pose="takut" />
      </>
    ),
    teks: <Tulisan teks="5 MINUTES, TOPS" x={540} y={330} ukuran={64} warna="#FFD23F" />,
  },
  {
    nama: "Tangki pemberat diisi air laut", P: PERMUKAAN, sub: "LET SEAWATER FLOOD IN", istilah: "Ballast Tanks", d: 0.08,
    vo: "So you build big tanks along the sides, and let seawater flood in. Now the boat is heavy enough to sink. These are called ballast tanks.",
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={PERMUKAAN_Y} />
        <Sorot P={P} x={540} y={1020} r={500} />
        <KapalSelam x={560} y={1020} s={1.15} potong air={0.75} trim={0.3} />
        <Panah x1={250} y1={760} x2={250} y2={860} w={12} warna={F.air} />
        <Panah x1={880} y1={760} x2={880} y2={860} w={12} warna={F.air} />
        <Panah x1={560} y1={1180} x2={560} y2={1300} w={16} warna={T.kuning} />
        <DepanLaut P={P} />
      </>
    ),
  },
  {
    nama: "Tenggelam terus, tak berhenti", P: DALAM, sub: "AND WON'T STOP", d: 0.55,
    vo: "But now it sinks... and sinks... and won't stop.",
    gambar: (P) => (
      <>
        <LautBesar P={P} />
        <Sorot P={P} x={540} y={1000} r={360} />
        {[700, 820, 940].map((y, i) => <g key={y} opacity={0.25 + i * 0.2}><KapalSelam x={540} y={y} s={0.62} /></g>)}
        <KapalSelam x={540} y={1080} s={0.62} />
        {[380, 700].map((x) => <line key={x} x1={x} x2={x} y1={700} y2={980} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.5} />)}
        <DepanLaut P={P} />
      </>
    ),
  },
  {
    nama: "Tangki trim — melayang diam", P: DALAM, sub: "PERFECTLY STILL", istilah: "Trim Tanks", d: 0.4,
    vo: "So you add small tanks you can fill or empty a little at a time, until the boat hangs perfectly still, halfway down. These are called trim tanks.",
    gambar: (P) => (
      <>
        <LautBesar P={P} />
        <Sorot P={P} x={540} y={1020} r={480} />
        <KapalSelam x={560} y={1020} s={1.15} potong air={0.55} trim={0.5} fokus="trim" />
        <g stroke="#FFFFFF" strokeWidth={5} opacity={0.8}>
          <line x1={140} x2={940} y1={1020} y2={1020} strokeDasharray="20 16" />
        </g>
        <Panah x1={360} y1={1170} x2={360} y2={1110} w={12} warna={T.kuning} />
        <Panah x1={760} y1={1110} x2={760} y2={1170} w={12} warna={T.kuning} />
        <DepanLaut P={P} />
      </>
    ),
  },
  {
    nama: "Tekanan meremukkan seperti kaleng (intens)", P: DARURAT, sub: "LIKE A SODA CAN", d: 0.66,
    vo: "But every thirty-three feet you go down, the water presses harder. Deep enough, and your boat crumples like a soda can.",
    gambar: (P) => (
      <>
        <LautBesar P={P} />
        <Sorot P={P} x={540} y={1020} r={420} />
        {[300, 520, 740, 960, 1180].map((y, i) => (
          <g key={y}>
            <line x1={70} x2={170} y1={y} y2={y} stroke="#FFFFFF" strokeWidth={4} opacity={0.7} />
            <text x={190} y={y + 10} fontFamily="Baloo2" fontWeight={800} fontSize={28} fill="#FFFFFF" opacity={0.8}>{(i + 1) * 33} FT</text>
          </g>
        ))}
        <KapalSelam x={600} y={1020} s={0.82} penyok={1} darurat />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * Math.PI) / 4;
          return <Panah key={i} x1={600 + 400 * Math.cos(a)} y1={1020 + 300 * Math.sin(a)} x2={600 + 330 * Math.cos(a)} y2={1020 + 190 * Math.sin(a)} w={12} warna={F.air} />;
        })}
        <DepanLaut P={P} />
      </>
    ),
  },
  {
    nama: "Lambung tekan bulat", P: DALAM, sub: "A ROUND SHAPE SPREADS THE PRESSURE", istilah: "Pressure Hull", d: 0.66,
    vo: "So you build the inside as a thick steel tube, because a round shape spreads the pressure evenly. This is called a pressure hull.",
    gambar: (P) => (
      <>
        <LautBesar P={P} />
        <Sorot P={P} x={540} y={1020} r={480} />
        <circle cx={540} cy={1020} r={300} fill={T.kuning} stroke={NAVY} strokeWidth={8} />
        <circle cx={540} cy={1020} r={240} fill="#9FB0C9" stroke={NAVY} strokeWidth={8} />
        {Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={540 + 270 * Math.cos((i * Math.PI) / 12)} cy={1020 + 270 * Math.sin((i * Math.PI) / 12)} r={5} fill={T.kuningTua} />)}
        <circle cx={540} cy={1020} r={200} fill="#22355C" stroke={NAVY} strokeWidth={6} />
        <line x1={350} x2={730} y1={1110} y2={1110} stroke="#9FB0C9" strokeWidth={6} />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * Math.PI) / 6;
          return <Panah key={i} x1={540 + 400 * Math.cos(a)} y1={1020 + 400 * Math.sin(a)} x2={540 + 315 * Math.cos(a)} y2={1020 + 315 * Math.sin(a)} w={10} warna={F.air} />;
        })}
        <Awak x={470} bawah={1110} t={0.55} topi="kupluk" baju="#9FD6EE" />
        <Awak x={540} bawah={1110} t={0.58} topi="topi" baju={T.koral} janggut />
        <Awak x={610} bawah={1110} t={0.55} topi="headset" baju="#C9D3E3" flip />
        <DepanLaut P={P} />
      </>
    ),
  },
  {
    nama: "Lelucon: oksigen habis sebelum makan siang", P: DALAM, sub: "BEFORE LUNCH", d: 0.5,
    vo: "You pack a few air tanks. Enough for a whole weekend, you think. [laughs] Your crew breathes through them before lunch.",
    gambar: (P) => (
      <>
        <LautBesar P={P} />
        <Sorot P={P} x={540} y={1000} r={460} />
        <rect x={160} y={700} width={760} height={560} rx={60} fill="#22355C" stroke="#9FB0C9" strokeWidth={10} />
        {[260, 360, 460].map((x) => (
          <g key={x} stroke={NAVY} strokeWidth={5}>
            <rect x={x - 32} y={820} width={64} height={260} rx={30} fill="#C9D3E3" />
            <rect x={x - 26} y={1074 - 20} width={52} height={20} rx={8} fill={T.koral} />
            <rect x={x - 12} y={796} width={24} height={30} rx={6} fill="#97A3BB" />
          </g>
        ))}
        <g transform="translate(720 920)" stroke={NAVY} strokeWidth={6}>
          <circle cx={0} cy={0} r={110} fill="#FFFFFF" />
          <line x1={0} x2={0} y1={0} y2={-80} strokeWidth={10} />
          <line x1={0} x2={10} y1={0} y2={-80} strokeWidth={10} />
          <text x={0} y={70} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={30} fill={NAVY} stroke="none">12:00</text>
        </g>
        <DepanLaut P={P} />
      </>
    ),
    teks: <Tulisan teks="WEEKEND? NOPE." x={540} y={360} ukuran={60} warna="#FFD23F" />,
  },
  {
    nama: "Elektrolisis: air jadi oksigen", P: DALAM, sub: "SPLIT IT INTO OXYGEN", istilah: "Electrolysis", d: 0.5,
    vo: "So you run electricity through water, and split it into oxygen. This is called electrolysis.",
    gambar: (P) => (
      <>
        <LautBesar P={P} />
        <Sorot P={P} x={540} y={1000} r={460} />
        <rect x={300} y={780} width={480} height={460} rx={40} fill="url(#gAir)" stroke={NAVY} strokeWidth={8} />
        <rect x={380} y={700} width={40} height={460} rx={10} fill="#C9D3E3" stroke={NAVY} strokeWidth={6} />
        <rect x={660} y={700} width={40} height={460} rx={10} fill="#C9D3E3" stroke={NAVY} strokeWidth={6} />
        <path d="M400 700 L400 640 L540 640 L520 600 L560 600 L540 560 M540 640 L680 640 L680 700" stroke={T.kuning} strokeWidth={12} fill="none" strokeLinejoin="round" />
        {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={(i % 2 ? 680 : 400) + (acak(i) - 0.5) * 40} cy={1120 - acak(i + 3) * 360} r={10 + acak(i + 1) * 8} fill="#FFFFFF" stroke={NAVY} strokeWidth={3} />)}
        <DepanLaut P={P} />
      </>
    ),
    teks: <Tulisan teks="O₂" x={680} y={480} ukuran={80} warna="#FFFFFF" />,
  },
  {
    nama: "CO₂ menumpuk → scrubber", P: DALAM, sub: "SOAKS IT UP", istilah: "CO2 Scrubber", d: 0.5,
    vo: "But every breath out fills the boat with carbon dioxide, and your crew gets dizzy. So you pump the air through a chemical that soaks it up. This is called a CO2 scrubber.",
    gambar: (P) => (
      <>
        <LautBesar P={P} />
        <Sorot P={P} x={540} y={1000} r={460} />
        <rect x={160} y={720} width={760} height={540} rx={60} fill="#22355C" stroke="#9FB0C9" strokeWidth={10} />
        <rect x={600} y={820} width={220} height={340} rx={24} fill={T.kuning} stroke={NAVY} strokeWidth={7} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={620} y={850 + i * 76} width={180} height={50} rx={10} fill={T.kuningTua} />)}
        {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={240 + acak(i) * 330} cy={800 + acak(i + 8) * 380} r={14 + acak(i + 2) * 10} fill="#6C7690" opacity={0.85} />)}
        <Panah x1={480} y1={990} x2={590} y2={990} w={14} warna="#FFFFFF" />
        <Awak x={290} bawah={1240} t={0.6} topi="kupluk" baju="#9FD6EE" />
        <Awak x={420} bawah={1240} t={0.6} topi="headset" baju="#C9D3E3" flip />
        <DepanLaut P={P} />
      </>
    ),
  },
  {
    // audit: batu jangan di zona kanan (tombol like/comment) & harus kontras
    nama: "Sonar — ping di kegelapan", P: DALAM, sub: "LISTEN FOR THE ECHO", istilah: "Sonar", d: 0.6,
    vo: "And down here, it's pitch black. So you send out a ping of sound, and listen for the echo.",
    gambar: (P) => {
      const busur = (cx: number, cy: number, r: number, a0: number, a1: number) =>
        `M${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`;
      return (
        <>
          <LautBesar P={P} siluet={false} />
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#030A18" opacity={0.38} />
          {/* tebing jauh (buram, nilai rendah) */}
          <g filter="url(#jauh)" fill="#0B2242" opacity={0.85}>
            <path d="M700 1920 L700 760 L780 640 L860 690 L930 560 L1120 600 L1120 1920 Z" />
            <path d="M-40 1920 L-40 1380 L80 1320 L200 1400 L300 1360 L360 1920 Z" />
          </g>
          <Sorot P={P} x={320} y={1040} r={300} />
          <KapalSelam x={290} y={1040} s={0.5} lampu />
          {[90, 170, 250, 330].map((r, i) => <path key={r} d={busur(465, 1030, r, -0.85, 0.85)} stroke={T.kuning} strokeWidth={9 - i * 1.5} fill="none" opacity={1 - i * 0.18} strokeLinecap="round" />)}
          {/* batu karang: siluet terang-tepi (rim light teal dari ping) + retakan + teritip — di tengah, bukan zona kanan */}
          {/* tebing karang tinggi: menjulang dari dasar (keluar bawah layar), bertingkat + lapisan batuan + tonjolan berbayang;
              tepi kiri disinari ping (teal) = satu-satunya bagian batu yang terang */}
          <g strokeLinejoin="round">
            <path d="M610 2000 L600 1640 L640 1560 L612 1450 L650 1360 L628 1250 L668 1150 L646 1050 L700 940 L752 968 L790 870 L846 912 L900 860 L930 900 L930 2000 Z" fill="#2E5A90" stroke={NAVY} strokeWidth={7} />
            {[1000, 1110, 1230, 1340, 1470, 1600, 1740].map((y, i) => <path key={y} d={`M${650 - (i % 2) * 20} ${y} q70 ${-14 + (i % 3) * 10} 140 0 t140 ${-6}`} stroke="#1E4272" strokeWidth={6} fill="none" />)}
            {[[650, 1150, 120], [630, 1360, 150], [620, 1560, 170]].map(([lx, ly, lw], i) => (
              <g key={i}>
                <path d={`M${lx} ${ly} L${lx + lw} ${ly - 10} L${lx + lw - 10} ${ly + 16} L${lx + 6} ${ly + 22} Z`} fill="#4473AA" stroke={NAVY} strokeWidth={5} />
                <path d={`M${lx + 6} ${ly + 22} L${lx + lw - 10} ${ly + 16} L${lx + lw - 20} ${ly + 40} L${lx + 14} ${ly + 44} Z`} fill="#15325C" stroke="none" />
              </g>
            ))}
            <path d="M610 2000 L600 1640 L640 1560 L612 1450 L650 1360 L628 1250 L668 1150 L646 1050 L700 940 L752 968 L790 870" stroke="#7FE3FF" strokeWidth={9} fill="none" strokeLinecap="round" />
            <path d="M700 1040 L730 1110 L710 1180 M810 980 L830 1060 M760 1250 L800 1300 M700 1480 L740 1520 L720 1580" stroke="#0B1D3A" strokeWidth={5} fill="none" />
            <g filter="url(#detailRedam)">
              {[[700, 1270], [730, 1320], [690, 1200], [850, 1150], [760, 1500], [690, 1660]].map(([bx, by], i) => <circle key={i} cx={bx} cy={by} r={9} fill="#9FB8D6" stroke={NAVY} strokeWidth={3} />)}
            </g>
          </g>
          {[60, 110].map((r) => <path key={r} d={busur(640, 1060, r, 2.3, 3.9)} stroke="#7FE3FF" strokeWidth={6} fill="none" opacity={0.85} strokeLinecap="round" />)}
          <DepanLaut P={P} />
        </>
      );
    },
    teks: <Tulisan teks="PING!" x={560} y={780} ukuran={70} warna="#FFD23F" />,
  },
  // ===== KRISIS =====
  {
    // audit: dia DI DALAM kapal; kamera dari luar (kapal utuh) lalu zoom — orangnya terlihat lewat kaca, detail kapal tetap kelihatan
    nama: "KRISIS — pipa pecah, air menyembur", P: DARURAT, sub: "SEAWATER BLASTS IN", d: 0.82, bahaya: true,
    vo: "Then, deep in the dark... a pipe bursts. Seawater blasts in. The boat gets heavier... and starts sinking past its safe depth.",
    kamera: [
      { nama: "luar: kapal utuh", cx: 540, cy: 960, s: 1 },
      { nama: "zoom: lewat kaca", cx: 540, cy: 960, s: 1 },
    ],
    gambar: (P, k) =>
      k === 0 ? (
        <>
          <LautBesar P={P} />
          <Sorot P={P} x={520} y={1000} r={420} />
          <KapalSelam x={540} y={1000} s={1.08} darurat penyok={0.4} />
          {/* lampu suar merah di menara + gelembung bocor */}
          <ellipse cx={616} cy={770} rx={90} ry={60} fill="url(#lampuMerah)" />
          {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={690 + (acak(i) - 0.5) * 70} cy={900 - acak(i + 2) * 280} r={6 + acak(i + 5) * 12} fill="none" stroke="#BFE6FA" strokeWidth={3} opacity={0.8} />)}
          <DepanLaut P={P} />
        </>
      ) : (
        <>
          <LautBesar P={P} />
          <defs>
            <clipPath id="kacaKS"><circle cx={540} cy={1000} r={330} /></clipPath>
          </defs>
          {/* lambung dari dekat: pelat, sambungan, paku keling, lubang limber */}
          <path d="M-80 560 Q540 500 1160 560 L1160 1470 Q540 1530 -80 1470 Z" fill={T.kuning} stroke={NAVY} strokeWidth={8} />
          <path d="M-80 1300 Q540 1380 1160 1300 L1160 1470 Q540 1530 -80 1470 Z" fill={T.kuningTua} opacity={0.45} />
          <path d="M-60 610 Q540 560 1140 610" stroke={T.sorot} strokeWidth={14} fill="none" opacity={0.7} />
          {[90, 990].map((sx) => (
            <g key={sx}>
              <line x1={sx} x2={sx} y1={560} y2={1480} stroke={T.kuningTua} strokeWidth={5} />
              {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={sx + 16} cy={600 + i * 74} r={6} fill={T.kuningTua} stroke={NAVY} strokeWidth={2} />)}
            </g>
          ))}
          {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={130 + i * 100} y={1410} width={50} height={18} rx={8} fill={NAVY} opacity={0.6} />)}
          {/* jendela bundar: cincin baja + baut + isi ruang dalam */}
          <circle cx={540} cy={1000} r={400} fill="#9FB0C9" stroke={NAVY} strokeWidth={10} />
          {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={540 + 372 * Math.cos((i * Math.PI) / 8)} cy={1000 + 372 * Math.sin((i * Math.PI) / 8)} r={10} fill="#6C7690" stroke={NAVY} strokeWidth={3} />)}
          <circle cx={540} cy={1000} r={346} fill="#6C7690" stroke={NAVY} strokeWidth={6} />
          <g clipPath="url(#kacaKS)">
            <g transform="translate(540 1000) scale(0.82) translate(-540 -1000)">
              <RuangKapal bocor genangan={0.6} />
              <Nelayan x={360} bawah={1330} t={0.9} pose="takut" />
            </g>
            <path d="M300 760 Q420 680 560 680" stroke="#FFFFFF" strokeWidth={22} fill="none" opacity={0.22} strokeLinecap="round" />
            <path d="M330 830 Q420 770 500 760" stroke="#FFFFFF" strokeWidth={10} fill="none" opacity={0.2} strokeLinecap="round" />
          </g>
          <circle cx={540} cy={1000} r={332} fill="none" stroke={NAVY} strokeWidth={8} />
          <ellipse cx={130} cy={620} rx={180} ry={120} fill="url(#lampuMerah)" />
          {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={960 + (acak(i) - 0.5) * 60} cy={640 - acak(i + 4) * 200} r={6 + acak(i + 1) * 10} fill="none" stroke="#BFE6FA" strokeWidth={3} opacity={0.8} />)}
        </>
      ),
  },
  {
    nama: "KRISIS — dinding berderit, uang hilang", P: DARURAT, sub: "EVERY SINGLE DOLLAR", d: 0.92, bahaya: true,
    vo: "The walls start to groan. If it keeps going, you lose the boat, the crew, and every single dollar.",
    gambar: (P) => (
      <>
        <LautBesar P={P} />
        <Sorot P={P} x={540} y={1040} r={420} />
        <KapalSelam x={540} y={1060} s={0.9} penyok={1} darurat miring={8} />
        {[[300, 940], [760, 1000], [520, 1150]].map(([x, y], i) => <Retak key={i} d={`M${x} ${y} l20 30 l-18 26 l22 30`} lebar={7} warna="#FFFFFF" />)}
        <DepanLaut P={P} />
      </>
    ),
    teks: <Uang top={420} merah sisa={0.1074457} />,
  },
  {
    // audit: ruang kapal dibuat lebih detail, layer demi layer
    nama: "Titik terendah — lampu darurat merah", P: DARURAT, sub: "THIS IS THE END", d: 0.95, bahaya: true,
    vo: "You sit on the cold floor, in the red emergency light... and you think this is the end.",
    gambar: () => (
      <>
        <RuangKapal genangan={0.45} />
        <Nelayan x={460} bawah={1350} t={1.05} pose="duduk" />
      </>
    ),
  },
  // ===== ILHAM (kenangan, sepia hangat) =====
  {
    nama: "Kenangan — ikan dari laut dalam menggembung", P: KENANGAN_LAUT, sub: "PUFFED LIKE A BALLOON",
    vo: "And then... you remember. Every time you pulled a fish up from deep water too fast, it came up puffed like a balloon.",
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={PERMUKAAN_Y} siluet={false} />
        <Cakrawala y={PERMUKAAN_Y} P={P} />
        <PerahuNelayan x={400} y={PERMUKAAN_Y} s={0.8} />
        <Nelayan x={330} bawah={PERMUKAAN_Y - 32} t={0.6} pose="pancing" />
        <AirDepan P={P} y0={PERMUKAAN_Y} />
        <path d="M522 156 Q560 600 560 930" stroke="#FFFFFF" strokeWidth={4} fill="none" />
        <Sorot P={P} x={600} y={1000} r={360} />
        <IkanGelembung x={600} y={1010} s={1.55} gembung={1} />
        <Panah x1={600} y1={1330} x2={600} y2={1200} w={12} warna="#FFFFFF" />
      </>
    ),
    teks: <Tulisan teks="YEARS AGO" x={540} y={700} ukuran={72} warna="#FFFFFF" />,
  },
  {
    nama: "Kenangan — udara mengembang, ikan meluncur naik", P: KENANGAN_LAUT, sub: "SHOT IT TO THE SURFACE",
    vo: "The air inside it grew bigger... and shot it to the surface.",
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={PERMUKAAN_Y} siluet={false} />
        <Sorot P={P} x={500} y={900} r={460} />
        {[[1300, 0.1, 0.45], [1010, 0.5, 0.75], [720, 1, 1]].map(([y, g, o], i) => (
          <g key={i} opacity={o as number}><IkanGelembung x={500} y={y as number} s={1.05} gembung={g as number} /></g>
        ))}
        <Panah x1={820} y1={1350} x2={820} y2={650} w={16} warna={T.kuning} />
        <DepanLaut P={P} />
      </>
    ),
  },
  // ===== SOLUSI =====
  {
    nama: "Emergency blow — udara bertekanan ke tangki", P: DALAM, sub: "BLAST IT ALL IN", istilah: "Emergency Blow", d: 0.85,
    vo: "So you grab the emergency air, the strongest you've got, and blast it ALL into the ballast tanks at once. The water is forced out.",
    gambar: (P) => (
      <>
        <LautBesar P={P} />
        <Sorot P={P} x={560} y={1020} r={500} />
        <KapalSelam x={560} y={1020} s={1.15} potong air={0.25} trim={0.2} />
        {[[-180, 120], [400, 120]].map(([dx], i) => <Panah key={i} x1={560 + dx * 1.15 * 0.5} y1={1020} x2={560 + dx * 1.15 * 0.5 + (i ? 110 : -110)} y2={1020} w={14} warna="#FFFFFF" />)}
        {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={(i % 2 ? 880 : 200) + (acak(i) - 0.5) * 80} cy={1110 + acak(i + 3) * 180} r={10 + acak(i) * 12} fill="url(#gAir)" stroke={NAVY} strokeWidth={3} />)}
        <DepanLaut P={P} />
      </>
    ),
  },
  {
    nama: "Naik makin cepat", P: PERMUKAAN, sub: "FASTER... AND FASTER", d: 0.3,
    vo: "And as you rise, the air expands even more, pushing you up faster... and faster.",
    gambar: (P) => (
      <>
        <LautBesar P={P} />
        <Sorot P={P} x={540} y={900} r={460} />
        {[[160, 760, 1], [250, 1180, 0.8], [840, 700, 0.9], [880, 1120, 0.7], [130, 1380, 0.7]].map(([x, y, s], i) => <IkanLewat key={i} x={x} y={y} s={s} />)}
        <KapalSelam x={540} y={900} s={0.8} miring={-70} />
        {Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={460 + acak(i) * 160} cy={1150 + acak(i + 6) * 500} r={8 + acak(i + 1) * 16} fill="#FFFFFF" stroke={NAVY} strokeWidth={3} opacity={0.85} />)}
        {[400, 680].map((x) => <line key={x} x1={x} x2={x} y1={1200} y2={1500} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.6} />)}
        <DepanLaut P={P} />
      </>
    ),
  },
  // ===== BABAK 3 =====
  {
    nama: "KAPAL SELAM MELOMPAT seperti paus", P: FAJAR, sub: "LEAPS OUT OF THE OCEAN", d: 0,
    vo: "And your submarine LEAPS out of the ocean like a whale!",
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={1100} siluet={false} />
        <Cakrawala y={1100} P={P} />
        <Sorot P={P} x={540} y={820} r={520} />
        <KapalSelam x={540} y={820} s={0.95} miring={-28} />
        {Array.from({ length: 18 }).map((_, i) => {
          const a = Math.PI + (i / 17) * Math.PI;
          return <circle key={i} cx={540 + Math.cos(a) * (260 + acak(i) * 120)} cy={1100 + Math.sin(a) * (120 + acak(i + 4) * 160)} r={14 + acak(i + 2) * 18} fill="#FFFFFF" stroke={NAVY} strokeWidth={3} />;
        })}
      </>
    ),
  },
  {
    // audit: kontrak = semua awak selamat → mulai zoom di awak (di atas kapal selam), lalu zoom out geser ke speedboat yang melaju dengan dia di atasnya
    nama: "Awak selamat, $5 miliar, speedboat", P: FAJAR, sub: "YOU GET THE MONEY",
    vo: "Your crew is safe. You get your five billion dollars, and you buy the jet-powered speedboat.",
    kamera: [
      { nama: "zoom di awak selamat", cx: 300, cy: 880, s: 2.1 },
      { nama: "zoom out, speedboat melaju", cx: 540, cy: 960, s: 1.02 },
      { nama: "zoom in ke speedboat", cx: BOAT_KS25[2], cy: 900, s: 1.9 },
    ],
    gambar: (P, k) => (
      <>
        <LautBesar P={P} permukaan={1000} siluet={false} />
        <Cakrawala y={1000} P={P} />
        <Sorot P={P} x={540} y={960} r={520} />
        <KapalSelam x={300} y={1012} s={0.52} />
        <Awak x={196} bawah={968} t={0.48} pose="sorak" topi="kupluk" baju="#9FD6EE" />
        <Awak x={250} bawah={966} t={0.5} pose="lambai" topi="topi" baju={T.koral} janggut />
        <Awak x={372} bawah={966} t={0.48} pose="sorak" topi="headset" baju="#C9D3E3" flip />
        <Awak x={420} bawah={968} t={0.46} pose="lambai" topi="rambut" baju="#9FD6EE" flip />
        <SpeedboatJet x={BOAT_KS25[k]} y={1000} s={0.55} jejak />
        <Nelayan x={BOAT_KS25[k] - 10} bawah={978} t={0.42} pose="sorak" />
        <AirDepan P={P} y0={1000} />
      </>
    ),
    teks: <Uang top={340} sisa={0.5} />,
  },
  {
    // audit: berdiri di atas air sambil ketakutan tidak masuk akal → di dermaga, pakai rompi + pelampung lengan, memeluk tiang, tak berani melangkah ke speedboat
    nama: "Penutup — takut air", P: PERMUKAAN, sub: "TERRIFIED OF WATER",
    vo: "Just one problem: you're now terrified of water.",
    gambar: (P) => (
      <>
        <LautBesar P={P} permukaan={1120} siluet={false} />
        <Cakrawala y={1120} P={P} />
        <Sorot P={P} x={480} y={1000} r={460} />
        {/* dermaga kayu: tiang pancang + papan */}
        {[60, 230, 400].map((px) => <rect key={px} x={px} y={1060} width={34} height={300} rx={6} fill="#6B4128" stroke={NAVY} strokeWidth={5} />)}
        <rect x={-40} y={1040} width={520} height={40} rx={6} fill="#B5764A" stroke={NAVY} strokeWidth={6} />
        {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={i * 86 + 20} x2={i * 86 + 20} y1={1042} y2={1078} stroke="#8C5634" strokeWidth={4} />)}
        <rect x={410} y={900} width={36} height={160} rx={8} fill="#6B4128" stroke={NAVY} strokeWidth={5} />
        <path d="M444 990 Q560 1060 640 1096" stroke="#C9A57E" strokeWidth={6} fill="none" />
        <SpeedboatJet x={760} y={1120} s={0.5} api={false} />
        <AirDepan P={P} y0={1120} />
        <Nelayan x={330} bawah={1040} t={0.95} pose="takut" rompi pelampung />
        <path d="M480 1110 q20 -18 40 0 q20 -18 40 0" stroke="#FFFFFF" strokeWidth={5} fill="none" />
      </>
    ),
  },
  {
    nama: "Penutup — speedboat di ruang tamu", P: FAJAR, sub: "LIVES IN YOUR LIVING ROOM",
    vo: "[laughs] So the speedboat lives in your living room.",
    gambar: () => (
      <>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#F3E7D3" />
        {Array.from({ length: 19 }).map((_, i) => <rect key={i} x={i * 60} y={0} width={26} height={1200} fill="#EADBC2" />)}
        {/* jendela bertirai dengan laut di kejauhan */}
        <g stroke={NAVY} strokeWidth={8}>
          <rect x={620} y={380} width={320} height={380} rx={14} fill="#BFE3F2" />
          <rect x={628} y={600} width={304} height={152} fill="#5FB6DE" stroke="none" />
          <line x1={780} x2={780} y1={380} y2={760} />
          <line x1={620} x2={940} y1={560} y2={560} />
          <path d="M600 360 Q640 560 610 800 L680 800 Q660 560 690 360 Z" fill={T.koralMuda} strokeWidth={5} />
          <path d="M960 360 Q920 560 950 800 L880 800 Q900 560 870 360 Z" fill={T.koralMuda} strokeWidth={5} />
          <rect x={580} y={340} width={400} height={20} rx={8} fill="#6B4128" strokeWidth={5} />
        </g>
        {/* foto berbingkai: kapal selam & ikan gembung */}
        <g stroke={NAVY} strokeWidth={6}>
          <rect x={110} y={420} width={220} height={150} rx={8} fill="#FFFBF2" />
          <rect x={126} y={436} width={188} height={118} fill="#9FD6EE" strokeWidth={3} />
          <rect x={150} y={640} width={140} height={110} rx={8} fill="#FFFBF2" />
          <rect x={164} y={654} width={112} height={82} fill="#F2D2A2" strokeWidth={3} />
        </g>
        <KapalSelam x={220} y={500} s={0.2} />
        <IkanGelembung x={220} y={696} s={0.28} gembung={1} />
        {/* lampu berdiri */}
        <ellipse cx={90} cy={880} rx={160} ry={120} fill="url(#cahayaKuning)" />
        <g stroke={NAVY} strokeWidth={6}>
          <line x1={90} x2={90} y1={880} y2={1240} />
          <path d="M40 880 L140 880 L118 800 L62 800 Z" fill={T.kuningMuda} />
          <ellipse cx={90} cy={1244} rx={44} ry={10} fill="#3A4660" />
        </g>
        <rect x={0} y={1200} width={W} height={720} fill="#C9A37A" />
        <rect x={0} y={1192} width={W} height={16} fill="#8C5634" />
        {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={0} x2={W} y1={1260 + i * 80} y2={1260 + i * 80} stroke="#B48C64" strokeWidth={4} />)}
        {/* sofa (di belakang perahu) */}
        <g stroke={NAVY} strokeWidth={6}>
          <rect x={-40} y={1000} width={300} height={130} rx={30} fill="#5F86B8" />
          <rect x={-40} y={1100} width={330} height={110} rx={24} fill="#4F75A6" />
          <rect x={250} y={1060} width={50} height={150} rx={20} fill="#5F86B8" />
        </g>
        <ellipse cx={540} cy={1290} rx={470} ry={74} fill={T.koralMuda} stroke={NAVY} strokeWidth={6} />
        <ellipse cx={540} cy={1290} rx={380} ry={50} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.6} />
        {/* dudukan kayu perahu */}
        {[380, 720].map((sx) => <path key={sx} d={`M${sx - 50} 1290 L${sx} 1220 L${sx + 50} 1290`} stroke="#6B4128" strokeWidth={14} fill="none" strokeLinejoin="round" />)}
        <SpeedboatJet x={560} y={1190} s={1.0} api={false} />
        <Nelayan x={560} bawah={1150} t={0.62} pose="sorak" rompi />
      </>
    ),
  },
];

export const JUMLAH_KS = ADEGAN.length;
// daftar still: satu per kunci kamera (KS01, KS01-2, …)
export const KS_STILL = ADEGAN.flatMap((a, n) =>
  (a.kamera ?? [null]).map((_, k) => ({ id: `KS${String(n + 1).padStart(2, "0")}${k ? `-${k + 1}` : ""}`, n, k })),
);

export const GambarKS: React.FC<{ n: number; k?: number }> = ({ n, k = 0 }) => {
  const a = ADEGAN[n];
  const kunci = a.kamera?.[k];
  const id = `KS${String(n + 1).padStart(2, "0")}${k ? `-${k + 1}` : ""}`;
  const terakhir = !a.kamera || k === a.kamera.length - 1;
  return (
    <AbsoluteFill style={{ background: a.P.langitAtas }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <Defs P={a.P} />
        <DefsTriad />
        <g transform={kunci ? `translate(${W / 2 - kunci.cx * kunci.s} ${H / 2 - kunci.cy * kunci.s}) scale(${kunci.s})` : undefined}>{a.gambar(a.P, k)}</g>
        <rect width={W} height={H} fill={`url(#vinyet${a.P.id})`} />
      </svg>
      {a.d !== undefined && <Kedalaman d={a.d} bahaya={a.bahaya} />}
      {terakhir && a.teks}
      {a.istilah && <Istilah teks={a.istilah} />}
      <Subtitle teks={a.sub} />
      <Catatan id={id} nama={kunci ? `${a.nama} (${kunci.nama})` : a.nama} vo={a.vo} />
    </AbsoluteFill>
  );
};
