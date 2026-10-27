// YouTube Shorts US "Deepest Cave" (storytelling, Gua Veryovkina): prototipe still GU01–GU24, digambar kode (tokoh sementara; nanti AI).
// ATURAN VISUAL (owner 2026-10-27, mengikuti skill + audit kapal selam):
//  TRIAD (Gurney gamut masking): DOMINAN = biru-abu batu kapur & langit · AKSEN 1 = emas (cahaya/harapan: layar HP, lampu kepala,
//  baju oranye penyelamat) · AKSEN 2 = MERAH KHUSUS TOPI (benda kunci cerita; tidak ada benda merah lain) · hijau ditekan ke hijau-abu.
//  COLOR SCRIPT: pegunungan cerah (awan gelap samar di cakrawala = petunjuk) → gua biru dingin + satu kolam cahaya HP → badai biru-hitam
//  (krisis) → lampu kepala emas menembus gelap (penyelamatan) → siang hujan kelabu (keluar) → ruang tamu hangat (penutup).
//  LAPISAN: langit → gunung jauh buram → punggung bukit → padang/dinding batu (detail diredam) → tokoh (fokus, garis navy) → benda depan buram → vinyet.
//  ZONA AMAN: atas (y<300: subtitle YouTube) & bawah (y>1440: caption) & kanan (x>950, y 850–1750: tombol) tanpa aksi penting.
//  Fakta (riset, sumber di chat): mulut gua 3×4 m, sumur pertama 32 m, dalam ±2.212 m (7.257 ft ≈ 6,7 Menara Eiffel 330 m),
//  suhu 4–7 °C basah, banjir 2018 setelah hujan → tim memanjat menembus air terjun, penyelamatan gua = tali + katrol 2:1/3:1.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Awan, Defs, H, NAVY, Palet, TERANG, W, acak, gayaStroke } from "../terowongan/Prototipe";

export const G = {
  merah: "#E8453C", merahTua: "#B8302A", // KHUSUS TOPI
  emas: "#FFC23D", emasTua: "#E09412", emasMuda: "#FFE08A", oranye: "#F2A33A", oranyeTua: "#C97A1E",
  kulit: "#F2C29A", kulitTua: "#D99E74", rambut: "#4A3020",
  jaket: "#3FB7C9", jaketTua: "#2A8FA1", celana: "#4B4F6B", sepatu: "#3A2C24", ransel: "#5C6B8A", ranselTua: "#46536E",
  batu: "#8C96A8", batuTua: "#5E6879", batuGelap: "#2A3242", batuMalam: "#171D2A", kapur: "#C9CFD9", kapurGaris: "#A9B1C0",
  rumput: "#8FA89A", rumputTua: "#6E8A7C", air: "#7FD4EE", airTerang: "#CFF2FF",
};

// palet (struktur Palet sama dengan terowongan → Defs bisa dipakai: gLangit, sorot, vinyet per id)
export const ALAM: Palet = { ...TERANG, id: "ga", langitAtas: "#BBD7EA", langitBawah: "#EEF1F0", awan: "#FFFFFF", matahari: "rgba(255,236,190,.7)", depan: "#4C5A55" };
export const GUA: Palet = { ...TERANG, id: "gg", langitAtas: "#0F1522", langitBawah: "#1B2435", awan: "#3A4458", matahari: "rgba(0,0,0,0)", depan: "#06080E", gelap: true };
export const BADAI: Palet = { ...GUA, id: "gb", langitAtas: "#0A0E18", langitBawah: "#141B2A" };
export const HUJAN: Palet = { ...TERANG, id: "gh", langitAtas: "#7D8A9C", langitBawah: "#A9B3C0", awan: "#8E99A8", matahari: "rgba(0,0,0,0)", depan: "#2E3644" };
export const RUMAH: Palet = { ...TERANG, id: "gr", langitAtas: "#F3E7D3", langitBawah: "#F3E7D3", depan: "#5A4232" };
export const KENANG: Palet = { ...ALAM, id: "gk", langitAtas: "#C9CDD3", langitBawah: "#DADDE0", awan: "#9AA3AE" };

export const DefsGua: React.FC = () => (
  <defs>
    <filter id="redam"><feColorMatrix type="matrix" values="0.55 0 0 0 0.07  0 0.55 0 0 0.09  0 0 0.6 0 0.14  0 0 0 1 0" /></filter>
    <filter id="kenangan"><feColorMatrix type="matrix" values="0.5 0.3 0.1 0 0.05  0.45 0.35 0.1 0 0.05  0.4 0.3 0.15 0 0.05  0 0 0 1 0" /></filter>
    <radialGradient id="cahayaHP" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="rgba(255,226,150,.75)" />
      <stop offset="100%" stopColor="rgba(255,226,150,0)" />
    </radialGradient>
    <radialGradient id="cahayaAtas" cx="50%" cy="0%" r="100%">
      <stop offset="0%" stopColor="rgba(200,215,235,.55)" />
      <stop offset="100%" stopColor="rgba(200,215,235,0)" />
    </radialGradient>
    <linearGradient id="gSumur" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#3A4660" />
      <stop offset="45%" stopColor="#1B2435" />
      <stop offset="100%" stopColor="#05070C" />
    </linearGradient>
    <linearGradient id="gLampu" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(255,210,110,.7)" />
      <stop offset="100%" stopColor="rgba(255,210,110,0)" />
    </linearGradient>
  </defs>
);

// ---------- latar ----------
// langit + awan; gelap = 0..1 (awan badai menutup), cakrawala = bank awan gelap samar (petunjuk sejak awal)
export const Langit: React.FC<{ P: Palet; gelap?: number; bawah?: number; cakrawala?: boolean }> = ({ P, gelap = 0, bawah = 1100, cakrawala = true }) => (
  <g>
    <rect x={-300} y={-300} width={W + 600} height={bawah + 320} fill={`url(#gLangit${P.id})`} />
    {gelap < 0.5 && <circle cx={830} cy={330} r={95} fill={P.matahari} filter="url(#cahaya)" />}
    <g filter="url(#buram)">
      <Awan x={230} y={360} s={1} warna={P.awan} />
      <Awan x={760} y={470} s={0.75} warna={P.awan} />
    </g>
    {cakrawala && (
      <g filter="url(#jauh)" fill="#6F7C8F" opacity={0.55 + 0.4 * gelap}>
        <ellipse cx={120} cy={bawah - 300} rx={260} ry={60} />
        <ellipse cx={380} cy={bawah - 330} rx={220} ry={55} />
      </g>
    )}
    {gelap > 0 && <rect x={-300} y={-300} width={W + 600} height={bawah + 320} fill="#1A2030" opacity={gelap * 0.7} />}
  </g>
);

// pegunungan kapur berlapis: jauh (buram, biru-abu) → tengah (abu dengan strata putih) → padang dekat (hijau-abu)
export const Pegunungan: React.FC<{ y: number; padang?: boolean; hujan?: boolean }> = ({ y, padang = true, hujan }) => (
  <g>
    <g filter="url(#jauh)" fill={hujan ? "#8390A2" : "#A9BBD0"}>
      <path d={`M-100 ${y - 120} L80 ${y - 420} L210 ${y - 300} L360 ${y - 520} L520 ${y - 330} L700 ${y - 470} L880 ${y - 280} L1180 ${y - 400} L1180 ${y + 40} L-100 ${y + 40} Z`} />
    </g>
    <g filter="url(#buram)">
      <path d={`M-100 ${y - 40} L140 ${y - 300} L300 ${y - 180} L470 ${y - 360} L640 ${y - 170} L820 ${y - 290} L1180 ${y - 120} L1180 ${y + 60} L-100 ${y + 60} Z`} fill={hujan ? "#7A8596" : G.batu} />
      <path d={`M140 ${y - 300} L180 ${y - 250} L160 ${y - 230} M470 ${y - 360} L520 ${y - 300} L490 ${y - 280} M820 ${y - 290} L860 ${y - 240}`} stroke={G.kapur} strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.8} />
      {[0, 1, 2].map((i) => <path key={i} d={`M-100 ${y - 80 + i * 40} q300 ${-20 + i * 8} 600 0 t600 4`} stroke={G.kapurGaris} strokeWidth={4} fill="none" opacity={0.5} />)}
    </g>
    {padang && (
      <g>
        <path d={`M-100 ${y + 20} Q300 ${y - 30} 620 ${y + 10} T1180 ${y} L1180 ${H + 300} L-100 ${H + 300} Z`} fill={hujan ? "#6E8378" : G.rumput} />
        <g filter="url(#redam)" opacity={0.7}>
          {Array.from({ length: 14 }).map((_, i) => (
            <ellipse key={i} cx={acak(i + 4) * W} cy={y + 120 + acak(i + 20) * 600} rx={30 + acak(i) * 50} ry={12 + acak(i + 3) * 14} fill={G.kapur} />
          ))}
        </g>
      </g>
    )}
  </g>
);

// mulut gua 3×4 m di padang kapur: lubang gelap berbibir batu + semak kecil di tepi (tempat topi tersangkut)
export const Lubang: React.FC<{ x: number; y: number; s?: number; topi?: boolean }> = ({ x, y, s = 1, topi = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} strokeLinejoin="round">
    <path d="M-190 -10 Q-160 -70 -60 -78 Q60 -88 160 -60 Q210 -30 190 20 Q150 70 20 76 Q-120 80 -180 40 Z" fill={G.kapur} stroke={NAVY} strokeWidth={6} />
    <path d="M-150 0 Q-120 -46 -40 -52 Q60 -60 130 -38 Q160 -12 140 20 Q100 50 10 54 Q-100 56 -140 30 Z" fill="#05070C" />
    <path d="M-120 -10 Q-60 -40 40 -42 Q100 -40 128 -22" stroke="#2A3242" strokeWidth={10} fill="none" />
    {[[-170, 10], [170, -20], [-60, 70], [100, 64]].map(([bx, by], i) => <ellipse key={i} cx={bx} cy={by} rx={34} ry={16} fill={G.batu} stroke={NAVY} strokeWidth={4} />)}
    {/* semak di tepi kanan-atas */}
    <g stroke={G.rumputTua} strokeWidth={7} strokeLinecap="round" fill="none">
      <path d="M140 -62 Q170 -120 210 -140" />
      <path d="M170 -100 Q200 -110 220 -96" />
      <path d="M150 -80 Q130 -130 110 -150" />
    </g>
    {topi && <Topi x={205} y={-142} s={0.9} miring={-18} />}
  </g>
);

// TOPI MERAH (satu-satunya benda merah): topi bucket dengan pita
export const Topi: React.FC<{ x: number; y: number; s?: number; miring?: number }> = ({ x, y, s = 1, miring = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${miring}) scale(${s})`} stroke={NAVY} strokeWidth={5} strokeLinejoin="round">
    <path d="M-60 10 Q0 30 60 10 L50 0 Q0 14 -50 0 Z" fill={G.merahTua} />
    <path d="M-40 4 Q-40 -44 0 -46 Q40 -44 40 4 Q0 14 -40 4 Z" fill={G.merah} />
    <path d="M-40 -6 Q0 4 40 -6" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.85} />
    <path d="M-22 -34 Q-8 -40 6 -38" stroke="#FF8A80" strokeWidth={5} fill="none" opacity={0.8} />
  </g>
);

// dinding sumur (tampak dari dalam): dua dinding berlapis strata + retak + kilap basah, bukaan terang di atas, tonjolan tempat dia mendarat
export const Sumur: React.FC<{ P: Palet; terang?: number; basah?: number; tonjolan?: boolean; air?: number }> = ({ P, terang = 1, basah = 0, tonjolan = true, air = 0 }) => (
  <g strokeLinejoin="round">
    <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="url(#gSumur)" />
    {/* bukaan di atas: langit kecil */}
    <path d="M330 -300 L760 -300 L740 230 Q560 270 360 230 Z" fill={`url(#gLangit${P.id})`} opacity={terang} />
    <path d="M300 230 Q560 300 790 230 L820 2300 L270 2300 Z" fill="url(#cahayaAtas)" opacity={0.6 * terang} />
    {/* dinding kiri & kanan */}
    {[-1, 1].map((sisi) => {
      const xTepi = sisi < 0 ? 330 : 750;
      const luar = sisi < 0 ? -320 : 1400;
      const d = `M${luar} -300 L${xTepi} -300 ` + Array.from({ length: 12 }).map((_, i) => `L${xTepi + sisi * (-40 + acak(i * 3 + (sisi > 0 ? 50 : 0)) * 90 + i * 6)} ${-200 + i * 200}`).join(" ") + ` L${luar} 2300 Z`;
      return (
        <g key={sisi}>
          <path d={d} fill={G.batuGelap} stroke={NAVY} strokeWidth={8} />
          <g filter="url(#redam)" opacity={0.85}>
            {Array.from({ length: 16 }).map((_, i) => (
              <path key={i} d={`M${sisi < 0 ? -320 : xTepi + sisi * 30} ${-150 + i * 140} q${sisi * 120} ${-10 + (i % 3) * 8} ${sisi * 240} 0 t${sisi * 240} -6`} stroke="#3A4660" strokeWidth={6} fill="none" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <path key={`r${i}`} d={`M${xTepi + sisi * (40 + acak(i + 9) * 160)} ${100 + i * 230} l${sisi * 20} 40 l${-sisi * 14} 30 l${sisi * 18} 36`} stroke="#0A0E18" strokeWidth={5} fill="none" />
            ))}
          </g>
          {basah > 0 && Array.from({ length: 10 }).map((_, i) => (
            <path key={`b${i}`} d={`M${xTepi + sisi * (10 + acak(i + 30) * 40)} ${-100 + i * 220} q${sisi * 6} 60 0 120`} stroke={G.airTerang} strokeWidth={4} fill="none" opacity={0.5 * basah} strokeLinecap="round" />
          ))}
        </g>
      );
    })}
    {tonjolan && (
      <g>
        <path d="M-200 1230 L360 1210 Q560 1205 640 1236 Q620 1290 520 1300 L-200 1330 Z" fill="#3A4458" stroke={NAVY} strokeWidth={8} />
        <path d="M360 1214 Q560 1209 636 1238" stroke="#6E7A90" strokeWidth={6} fill="none" />
        {[[420, 1222], [520, 1226], [300, 1218]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={22} ry={8} fill="#56627A" stroke={NAVY} strokeWidth={3} />)}
      </g>
    )}
    {air > 0 && (
      <g>
        <ellipse cx={420} cy={1226} rx={220 * air} ry={10 * air} fill={G.air} opacity={0.7} />
        {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M${360 + i * 50} 1224 q-4 30 -10 80`} stroke={G.airTerang} strokeWidth={4} opacity={0.6 * air} fill="none" />)}
      </g>
    )}
    {/* jurang di bawah tonjolan */}
    <ellipse cx={560} cy={1700} rx={330} ry={420} fill="#030408" opacity={0.55} filter="url(#buram)" />
  </g>
);

// hujan (garis miring) + tetesan
export const Hujan: React.FC<{ n?: number; o?: number; panjang?: number; y0?: number; y1?: number }> = ({ n = 60, o = 0.55, panjang = 60, y0 = -200, y1 = H + 100 }) => (
  <g stroke="#D7E6F5" strokeWidth={4} strokeLinecap="round" opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const x = acak(i + 7) * (W + 200) - 100, y = y0 + acak(i + 50) * (y1 - y0);
      return <line key={i} x1={x} y1={y} x2={x - panjang * 0.18} y2={y + panjang} />;
    })}
  </g>
);

// ---------- tokoh (sementara kode; nanti AI) ----------
// pendaki: jaket teal (kontras dengan batu & padang), celana abu-ungu, sepatu bot, ransel biru-abu, rambut cokelat; topi merah opsional
type PosePendaki = "jalan" | "jatuh" | "duduk" | "panjat" | "teriak" | "gigil" | "hp" | "angkat-hp" | "harnes" | "peluk-topi" | "lega";
export const Pendaki: React.FC<{ x: number; bawah: number; t?: number; pose?: PosePendaki; topi?: boolean; flip?: boolean; putar?: number; selimut?: boolean }> = ({
  x, bawah, t = 1, pose = "jalan", topi = false, flip, putar = 0, selimut,
}) => {
  const duduk = pose === "duduk" || pose === "gigil" || pose === "hp" || pose === "peluk-topi";
  const lengan = (bx: number, sudut: number, panjang = 120) => (
    <g transform={`rotate(${sudut} ${bx} -300)`}>
      <rect x={bx - 16} y={-300} width={32} height={panjang} rx={15} fill={G.jaket} />
      <circle cx={bx} cy={-300 + panjang + 10} r={17} fill={G.kulit} />
    </g>
  );
  const [ka, kn] =
    pose === "jatuh" ? [150, -140] : pose === "panjat" ? [-60, 60] : pose === "teriak" ? [150, -150] : pose === "angkat-hp" ? [10, -165] :
    pose === "hp" ? [-30, 30] : pose === "gigil" ? [-50, 50] : pose === "peluk-topi" ? [-45, 45] : pose === "lega" ? [20, -20] : pose === "harnes" ? [160, -160] : [16, -16];
  const mulut = pose === "teriak" || pose === "jatuh" ? "teriak" : pose === "gigil" || pose === "duduk" ? "sedih" : pose === "peluk-topi" || pose === "lega" ? "senang" : "biasa";
  return (
    <g transform={`translate(${x} ${bawah}) rotate(${putar}) scale(${(flip ? -1 : 1) * t} ${t})`} stroke={NAVY} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx={0} cy={4} rx={90} ry={12} fill="rgba(5,7,12,.3)" stroke="none" />
      {/* kaki */}
      {duduk ? (
        <g>
          <path d="M-40 -60 L40 -140 L70 -110 L-10 -36 Z" fill={G.celana} />
          <path d="M40 -140 L70 -40 L40 -30 L14 -120 Z" fill={G.celana} />
          <rect x={30} y={-46} width={60} height={34} rx={10} fill={G.sepatu} />
        </g>
      ) : pose === "panjat" ? (
        <g>
          <rect x={-20} y={-200} width={36} height={160} rx={16} fill={G.celana} transform="rotate(-70 0 -200)" />
          <rect x={-20} y={-180} width={36} height={160} rx={16} fill={G.celana} transform="rotate(-100 0 -180)" />
        </g>
      ) : (
        <g>
          <rect x={-44} y={-170} width={38} height={150} rx={16} fill={G.celana} transform={pose === "jalan" ? "rotate(10 -25 -170)" : pose === "jatuh" ? "rotate(30 -25 -170)" : undefined} />
          <rect x={6} y={-170} width={38} height={150} rx={16} fill="#3F435C" transform={pose === "jalan" ? "rotate(-12 25 -170)" : pose === "jatuh" ? "rotate(-40 25 -170)" : undefined} />
          <rect x={-58} y={-30} width={56} height={28} rx={10} fill={G.sepatu} transform={pose === "jalan" ? "translate(-30 0)" : undefined} />
          <rect x={4} y={-30} width={56} height={28} rx={10} fill={G.sepatu} transform={pose === "jalan" ? "translate(36 -6)" : undefined} />
        </g>
      )}
      <g transform={duduk ? "translate(0 100)" : undefined}>
        {/* ransel di punggung */}
        {!duduk && <rect x={-96} y={-330} width={60} height={160} rx={18} fill={G.ransel} />}
        {lengan(-62, ka)}
        {/* jaket */}
        <path d="M-64 -330 Q0 -352 64 -330 L74 -160 L-74 -160 Z" fill={G.jaket} />
        <path d="M0 -340 L4 -160" stroke={G.jaketTua} strokeWidth={6} />
        <rect x={-50} y={-250} width={34} height={30} rx={6} fill="none" stroke={G.jaketTua} strokeWidth={4} />
        <path d="M-40 -338 L0 -306 L40 -338" fill="none" stroke={G.jaketTua} strokeWidth={6} />
        <rect x={-74} y={-176} width={148} height={16} rx={6} fill={G.jaketTua} stroke="none" />
        {pose !== "harnes" && lengan(62, kn)}
        {pose === "harnes" && (
          <g>
            {lengan(62, kn)}
            <path d="M-60 -200 L60 -200 M-50 -170 L0 -120 L50 -170" stroke={G.emasTua} strokeWidth={10} fill="none" />
            <circle cx={0} cy={-200} r={12} fill="#C9D3E3" />
          </g>
        )}
        {selimut && <path d="M-90 -350 Q0 -380 90 -350 L100 -140 Q0 -120 -100 -140 Z" fill="#E6E9EE" stroke="#C9CFD9" strokeWidth={4} opacity={0.95} />}
        {selimut && <path d="M-60 -330 L-40 -150 M20 -340 L40 -150" stroke="#FFFFFF" strokeWidth={6} opacity={0.8} />}
        {/* kepala */}
        <rect x={-14} y={-370} width={28} height={30} fill={G.kulit} />
        <circle cx={0} cy={-412} r={56} fill={G.kulit} />
        <circle cx={-54} cy={-408} r={12} fill={G.kulit} />
        <path d="M-56 -430 Q-50 -480 0 -478 Q50 -480 56 -430 Q30 -456 0 -452 Q-30 -456 -56 -430 Z" fill={G.rambut} />
        <g stroke="none">
          <ellipse cx={-20} cy={-414} rx={mulut === "teriak" ? 9 : 7} ry={mulut === "teriak" ? 12 : 9} fill={NAVY} />
          <ellipse cx={20} cy={-414} rx={mulut === "teriak" ? 9 : 7} ry={mulut === "teriak" ? 12 : 9} fill={NAVY} />
          <circle cx={-17} cy={-418} r={3} fill="#FFFFFF" />
          <circle cx={23} cy={-418} r={3} fill="#FFFFFF" />
          <circle cx={-34} cy={-394} r={8} fill="#F29C8A" opacity={0.5} />
          <circle cx={34} cy={-394} r={8} fill="#F29C8A" opacity={0.5} />
        </g>
        <path d={mulut === "sedih" ? "M-32 -436 L-10 -444 M32 -436 L10 -444" : "M-32 -440 Q-20 -448 -8 -442 M32 -440 Q20 -448 8 -442"} strokeWidth={5} fill="none" />
        <path d="M0 -404 q5 8 -2 12" strokeWidth={4} fill="none" />
        {mulut === "teriak" && <ellipse cx={0} cy={-378} rx={14} ry={16} fill="#5A1E1E" strokeWidth={4} />}
        {mulut === "senang" && <path d="M-16 -384 q16 14 32 0 Z" fill="#7A2E2E" strokeWidth={4} />}
        {mulut === "sedih" && <path d="M-14 -374 q14 -10 28 0" strokeWidth={5} fill="none" />}
        {mulut === "biasa" && <path d="M-12 -380 q12 8 24 0" strokeWidth={5} fill="none" />}
        {topi && <g transform="translate(0 -452) scale(1.25)"><Topi x={0} y={0} /></g>}
        {pose === "gigil" && (
          <g fill="none" stroke={NAVY} strokeWidth={4} opacity={0.7}>
            <path d="M-110 -300 q-10 18 0 36 M-128 -292 q-10 18 0 36 M110 -300 q10 18 0 36 M128 -292 q10 18 0 36" />
          </g>
        )}
      </g>
    </g>
  );
};

// penjelajah gua (tim penyelamat): baju oranye (emas = harapan), helm putih + lampu kepala, harnes
export const Penjelajah: React.FC<{ x: number; bawah: number; t?: number; arah?: number; lampu?: boolean; pose?: "jalan" | "tunjuk" | "tarik" | "turun"; flip?: boolean }> = ({
  x, bawah, t = 1, arah = 20, lampu = true, pose = "jalan", flip,
}) => {
  const [ka, kn] = pose === "tunjuk" ? [16, -120] : pose === "tarik" ? [-120, -110] : pose === "turun" ? [170, -170] : [16, -16];
  const lengan = (bx: number, sudut: number) => (
    <g transform={`rotate(${sudut} ${bx} -300)`}>
      <rect x={bx - 16} y={-300} width={32} height={120} rx={15} fill={G.oranye} />
      <circle cx={bx} cy={-170} r={17} fill="#3A3F52" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${bawah}) scale(${(flip ? -1 : 1) * t} ${t})`} stroke={NAVY} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round">
      {lampu && <path d={`M30 -420 L${30 + 520 * Math.cos((arah * Math.PI) / 180)} ${-420 + 520 * Math.sin((arah * Math.PI) / 180) - 120} L${30 + 520 * Math.cos((arah * Math.PI) / 180)} ${-420 + 520 * Math.sin((arah * Math.PI) / 180) + 120} Z`} fill="url(#gLampu)" stroke="none" opacity={0.85} />}
      <ellipse cx={0} cy={4} rx={86} ry={12} fill="rgba(5,7,12,.3)" stroke="none" />
      <rect x={-44} y={-170} width={38} height={150} rx={16} fill={G.oranyeTua} />
      <rect x={6} y={-170} width={38} height={150} rx={16} fill={G.oranyeTua} />
      <rect x={-56} y={-30} width={54} height={28} rx={10} fill="#2A2F3E" />
      <rect x={4} y={-30} width={54} height={28} rx={10} fill="#2A2F3E" />
      {lengan(-62, ka)}
      <path d="M-64 -330 Q0 -352 64 -330 L74 -160 L-74 -160 Z" fill={G.oranye} />
      <path d="M-60 -200 L60 -200 M-50 -170 L0 -130 L50 -170" stroke="#3A3F52" strokeWidth={9} fill="none" />
      <circle cx={0} cy={-200} r={10} fill="#C9D3E3" />
      {lengan(62, kn)}
      <circle cx={0} cy={-412} r={54} fill={G.kulit} />
      <path d="M-58 -420 Q-56 -486 0 -488 Q56 -486 58 -420 Z" fill="#F4F6FA" />
      <rect x={-62} y={-424} width={124} height={14} rx={6} fill="#D5DCE8" />
      <rect x={16} y={-452} width={30} height={22} rx={6} fill={G.emas} />
      <g stroke="none">
        <ellipse cx={-18} cy={-404} rx={7} ry={9} fill={NAVY} />
        <ellipse cx={22} cy={-404} rx={7} ry={9} fill={NAVY} />
        <circle cx={-15} cy={-408} r={3} fill="#FFFFFF" />
        <circle cx={25} cy={-408} r={3} fill="#FFFFFF" />
      </g>
      <path d={pose === "tunjuk" ? "M-12 -374 q12 12 24 0 Z" : "M-12 -376 q12 8 24 0"} strokeWidth={5} fill={pose === "tunjuk" ? "#7A2E2E" : "none"} />
      <path d="M-50 -360 Q-40 -330 0 -328 Q40 -330 50 -360 Q30 -346 0 -346 Q-30 -346 -50 -360 Z" fill="#6B4128" />
    </g>
  );
};

// HP: layar menyala (status bar "No Service" atau SOS satelit mencari)
export const HP: React.FC<{ x: number; y: number; s?: number; layar: "sinyal" | "sos"; miring?: number }> = ({ x, y, s = 1, layar, miring = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${miring}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={360} ry={420} fill="url(#cahayaHP)" />
    <rect x={-150} y={-290} width={300} height={580} rx={44} fill="#1A1E2A" stroke={NAVY} strokeWidth={8} />
    <rect x={-132} y={-270} width={264} height={540} rx={30} fill={layar === "sos" ? "#0E1A2E" : "#F4F6FA"} />
    <rect x={-40} y={-262} width={80} height={18} rx={9} fill="#1A1E2A" />
    {layar === "sinyal" ? (
      <g fontFamily="Baloo2" fontWeight={800} textAnchor="middle">
        <text x={-80} y={-210} fontSize={22} fill={NAVY}>9:41</text>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={70 + i * 12} y={-218 + (3 - i) * 0} width={8} height={6 + i * 6} rx={2} fill="#C9CFD9" transform={`translate(0 ${-i * 6})`} />)}
        <text x={0} y={-60} fontSize={44} fill={NAVY}>No Service</text>
        <circle cx={0} cy={60} r={70} fill="none" stroke="#C9CFD9" strokeWidth={10} />
        <path d="M-50 110 L50 10" stroke={G.merahTua} strokeWidth={0} />
        <text x={0} y={80} fontSize={60} fill="#C9CFD9">✕</text>
        <text x={0} y={200} fontSize={26} fill="#8C96A8">SOS only?</text>
      </g>
    ) : (
      <g fontFamily="Baloo2" fontWeight={800} textAnchor="middle">
        <text x={0} y={-150} fontSize={34} fill="#FFFFFF">Emergency SOS</text>
        <text x={0} y={-110} fontSize={26} fill="#9FB0C9">via satellite</text>
        <circle cx={0} cy={40} r={90} fill="none" stroke="#2FA7C9" strokeWidth={6} opacity={0.6} />
        <circle cx={0} cy={40} r={60} fill="none" stroke="#2FA7C9" strokeWidth={6} opacity={0.8} />
        <circle cx={0} cy={40} r={18} fill={G.emas} />
        <text x={0} y={200} fontSize={36} fill={G.emasMuda}>Searching...</text>
      </g>
    )}
  </g>
);

// menara Eiffel siluet (skala), untuk perbandingan kedalaman
export const Eiffel: React.FC<{ x: number; bawah: number; tinggi: number; warna?: string }> = ({ x, bawah, tinggi, warna = "#C9D3E3" }) => {
  const s = tinggi / 330;
  return (
    <g transform={`translate(${x} ${bawah}) scale(${s})`} fill={warna} stroke={NAVY} strokeWidth={4 / s}>
      <path d="M-62 0 Q-30 -80 -16 -200 L-8 -300 L0 -330 L8 -300 L16 -200 Q30 -80 62 0 L40 0 Q14 -60 0 -62 Q-14 -60 -40 0 Z" />
      <rect x={-22} y={-120} width={44} height={8} />
      <rect x={-12} y={-210} width={24} height={6} />
    </g>
  );
};

// katrol & jangkar di bibir lubang (tim menarik)
export const Katrol: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} stroke={NAVY} strokeWidth={6} strokeLinejoin="round">
    <ellipse cx={-180} cy={10} rx={110} ry={60} fill={G.batu} />
    <path d="M-110 0 L0 -20 L120 -10" stroke={G.emasTua} strokeWidth={8} fill="none" />
    {[0, 60].map((px) => (
      <g key={px}>
        <circle cx={px} cy={-20} r={22} fill="#C9D3E3" />
        <circle cx={px} cy={-20} r={8} fill="#6C7690" />
      </g>
    ))}
    <line x1={30} x2={30} y1={-20} y2={700} stroke={G.emasTua} strokeWidth={8} />
  </g>
);

// ---------- adegan ----------
type Kunci = { nama: string; cx: number; cy: number; s: number };
type Adegan = { nama: string; vo: string; sub: string; P: Palet; gambar: (P: Palet, k: number) => React.ReactNode; teks?: React.ReactNode; kamera?: Kunci[] };
const Sorot: React.FC<{ P: Palet; x: number; y: number; r?: number }> = ({ P, x, y, r = 420 }) => <ellipse cx={x} cy={y} rx={r} ry={r} fill={`url(#sorot${P.id})`} />;
const TeksLayar: React.FC<{ teks: string; y: number; ukuran?: number; warna?: string }> = ({ teks, y, ukuran = 72, warna = "#FFFFFF" }) => (
  <div style={{ position: "absolute", top: y, left: 40, right: 40, fontSize: ukuran, color: warna, ...gayaStroke(11) }}>{teks}</div>
);
const Gelap: React.FC = () => <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#000" opacity={0.35} />;

const ADEGAN: Adegan[] = [
  // ===== BABAK 1 =====
  {
    nama: "Hook — liburan di pegunungan", P: ALAM, sub: "YOU'RE ON VACATION",
    vo: "You're on vacation in the mountains...",
    kamera: [{ nama: "lebar", cx: 540, cy: 960, s: 1.02 }],
    gambar: (P) => (
      <>
        <Langit P={P} bawah={1000} />
        <Pegunungan y={1000} />
        <Lubang x={700} y={1290} s={0.9} />
        <Sorot P={P} x={440} y={1180} r={420} />
        <Pendaki x={420} bawah={1300} t={0.9} pose="jalan" topi />
        <g filter="url(#depan)" fill="#4C5A55" opacity={0.9}><ellipse cx={60} cy={1820} rx={240} ry={90} /><ellipse cx={1040} cy={1860} rx={200} ry={80} /></g>
      </>
    ),
  },
  {
    nama: "Tergelincir — topi merah lepas & tersangkut (visual saja)", P: ALAM, sub: "AND YOU SLIP",
    vo: "...and you slip into this hole.",
    kamera: [{ nama: "terpeleset", cx: 640, cy: 1150, s: 1.35 }],
    gambar: (P) => (
      <>
        <Langit P={P} bawah={1000} />
        <Pegunungan y={1000} />
        <Lubang x={700} y={1290} s={0.9} topi />
        <Pendaki x={660} bawah={1330} t={0.8} pose="jatuh" putar={-24} />
        {[[540, 1120], [560, 1160], [590, 1100]].map(([x, y], i) => <path key={i} d={`M${x} ${y} l-30 -14`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />)}
      </>
    ),
  },
  {
    nama: "Mendarat di tonjolan 60 ft", P: GUA, sub: "SIXTY FEET DOWN",
    vo: "You land on a ledge sixty feet down.",
    gambar: (P) => (
      <>
        <Sumur P={P} />
        <Sorot P={P} x={420} y={1150} r={300} />
        <Pendaki x={420} bawah={1222} t={0.62} pose="duduk" />
        {[0, 1, 2].map((i) => <circle key={i} cx={380 + i * 60} cy={1210 - i * 10} r={8} fill={G.kapurGaris} opacity={0.6} />)}
      </>
    ),
    teks: <TeksLayar teks="60 FT" y={560} warna="#FFD23F" />,
  },
  {
    nama: "Kedalaman — tujuh ribu kaki ≈ 7 Menara Eiffel", P: GUA, sub: "SEVEN THOUSAND FEET",
    vo: "Below you, the hole keeps going... seven thousand feet. That's almost seven Eiffel Towers stacked.",
    gambar: () => (
      <>
        <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#0E1420" />
        {/* penampang gunung: permukaan di atas, gua berliku turun */}
        <path d="M-100 330 L200 260 L420 300 L560 250 L760 310 L1180 280 L1180 2300 L-100 2300 Z" fill="#1F2738" stroke={NAVY} strokeWidth={6} />
        <g filter="url(#redam)" opacity={0.8}>
          {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M-100 ${420 + i * 100} q300 -14 600 0 t600 6`} stroke="#2E3850" strokeWidth={5} fill="none" />)}
        </g>
        <path d="M560 250 L560 330 L520 420 L600 560 L540 700 L620 860 L560 1000 L640 1150 L580 1300 L660 1420" stroke="#05070C" strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={560} cy={300} r={10} fill={G.emas} />
        <path d="M600 300 L700 300" stroke="#FFFFFF" strokeWidth={4} />
        {/* 7 menara Eiffel bertumpuk */}
        {Array.from({ length: 7 }).map((_, i) => <Eiffel key={i} x={250} bawah={1420 - i * 160} tinggi={160} warna="#C9D3E3" />)}
        <path d="M150 260 L150 1420" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="14 10" />
      </>
    ),
    teks: <TeksLayar teks="7,000 FT" y={480} ukuran={90} warna="#FFD23F" />,
  },
  {
    nama: "Salah satu gua terdalam di Bumi", P: GUA, sub: "DEEPEST CAVES ON EARTH",
    vo: "You just fell into one of the deepest caves on Earth.",
    kamera: [{ nama: "zoom ke dasar", cx: 600, cy: 1200, s: 1.3 }],
    gambar: () => (
      <>
        <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#0E1420" />
        <path d="M-100 330 L200 260 L420 300 L560 250 L760 310 L1180 280 L1180 2300 L-100 2300 Z" fill="#1F2738" stroke={NAVY} strokeWidth={6} />
        <path d="M560 250 L560 330 L520 420 L600 560 L540 700 L620 860 L560 1000 L640 1150 L580 1300 L660 1420" stroke="#05070C" strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx={660} cy={1430} rx={90} ry={26} fill="#3FB7C9" opacity={0.7} />
        <circle cx={560} cy={300} r={10} fill={G.emas} />
      </>
    ),
  },
  // ===== BABAK 2 =====
  {
    nama: "HP selamat — tidak ada sinyal", P: GUA, sub: "NO BARS",
    vo: "Lucky you, your phone survived. The screen lights up... no bars. Down here, the rock swallows every signal.",
    gambar: (P) => (
      <>
        <Sumur P={P} terang={0.6} />
        <Gelap />
        <HP x={540} y={900} s={1.05} layar="sinyal" miring={-6} />
        <g fill={G.kulit} stroke={NAVY} strokeWidth={6}>
          <path d="M380 1120 Q420 1220 560 1230 L640 1200 Q560 1150 520 1080 Z" />
        </g>
      </>
    ),
  },
  {
    nama: "SOS satelit — dinding menutupi langit", P: GUA, sub: "SEARCHING...",
    vo: "So you hold it up toward the opening and try the satellite SOS. \"Searching...\" But the walls hide almost all of the sky.",
    gambar: (P) => (
      <>
        <Sumur P={P} />
        <circle cx={900} cy={-120} r={20} fill="#FFFFFF" />
        <path d="M900 -100 L560 1000" stroke="#FFFFFF" strokeWidth={4} strokeDasharray="16 12" opacity={0.6} />
        <path d="M760 400 L700 600" stroke={G.merahTua} strokeWidth={0} />
        <Sorot P={P} x={430} y={1100} r={320} />
        <Pendaki x={430} bawah={1222} t={0.62} pose="angkat-hp" />
        <g transform="translate(500 900)"><rect x={-26} y={-44} width={52} height={88} rx={10} fill="#0E1A2E" stroke={NAVY} strokeWidth={5} /><ellipse cx={0} cy={0} rx={90} ry={90} fill="url(#cahayaHP)" /></g>
      </>
    ),
    teks: <TeksLayar teks="SEARCHING..." y={500} ukuran={64} warna="#FFE08A" />,
  },
  {
    nama: "Memanjat — punggung di satu dinding, kaki di dinding lain", P: GUA, sub: "INCH BY INCH",
    vo: "So you climb. Back against one wall, feet against the other, and you push yourself up, inch by inch. Ten feet. Twenty feet!",
    gambar: (P) => (
      <>
        <Sumur P={P} tonjolan />
        <Sorot P={P} x={540} y={820} r={320} />
        <g transform="translate(470 820) rotate(80)"><Pendaki x={0} bawah={0} t={0.95} pose="panjat" /></g>
        {[[1110, "10 FT"], [960, "20 FT"]].map(([y, l]) => (
          <g key={l as string}><line x1={140} x2={230} y1={y as number} y2={y as number} stroke="#FFFFFF" strokeWidth={4} /><text x={240} y={(y as number) + 10} fontFamily="Baloo2" fontWeight={800} fontSize={30} fill="#FFFFFF">{l}</text></g>
        ))}
      </>
    ),
  },
  {
    nama: "Lubang melebar — merosot kembali", P: GUA, sub: "WIDER THAN YOUR LEGS",
    vo: "But the hole gets wider... wider than your legs can reach. And you slide all the way back down.",
    gambar: (P) => (
      <>
        <Sumur P={P} />
        <path d="M330 760 L750 760" stroke={G.emas} strokeWidth={6} strokeDasharray="18 12" />
        <path d="M300 640 L780 640" stroke={G.merahTua} strokeWidth={0} />
        <path d="M250 560 L830 560" stroke="#FFFFFF" strokeWidth={6} strokeDasharray="18 12" opacity={0.7} />
        <Pendaki x={540} bawah={980} t={0.6} pose="jatuh" putar={10} />
        {[0, 1, 2].map((i) => <path key={i} d={`M${470 + i * 70} ${700} l0 -80`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.6} />)}
      </>
    ),
  },
  {
    nama: "Teriak minta tolong — hanya gema yang menjawab (lelucon)", P: GUA, sub: "YOUR OWN ECHO",
    vo: "So you yell for help. [laughs] The only one who answers is your own echo. Very supportive. Not very helpful.",
    gambar: (P) => (
      <>
        <Sumur P={P} />
        <Sorot P={P} x={430} y={1100} r={320} />
        <Pendaki x={430} bawah={1222} t={0.62} pose="teriak" />
        {["HELP!", "help!", "help..."].map((t, i) => (
          <text key={t} x={540 + (i % 2 ? 90 : -40)} y={760 - i * 170} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={70 - i * 14} fill="#FFFFFF" stroke={NAVY} strokeWidth={8} paintOrder="stroke" opacity={1 - i * 0.25}>{t}</text>
        ))}
      </>
    ),
  },
  {
    nama: "Dingin 40°F — duduk di ransel, bukan di batu", P: GUA, sub: "FORTY DEGREES",
    vo: "And it's cold down here. Forty degrees, and everything is wet. You start shivering... So you get off the cold rock and sit on your backpack.",
    gambar: (P) => (
      <>
        <Sumur P={P} basah={0.7} />
        <Sorot P={P} x={430} y={1120} r={300} />
        <rect x={360} y={1150} width={140} height={70} rx={18} fill={G.ransel} stroke={NAVY} strokeWidth={6} />
        <Pendaki x={430} bawah={1160} t={0.6} pose="gigil" />
        <g transform="translate(760 820)" stroke={NAVY} strokeWidth={6}>
          <rect x={-22} y={-160} width={44} height={240} rx={22} fill="#F4F6FA" />
          <circle cx={0} cy={110} r={40} fill="#7FB3E8" />
          <rect x={-10} y={-40} width={20} height={150} fill="#7FB3E8" stroke="none" />
        </g>
      </>
    ),
    teks: <TeksLayar teks="40°F" y={540} ukuran={90} warna="#CFF2FF" />,
  },
  {
    nama: "KRISIS — teringat: sebelum terpeleset, langit penuh awan gelap", P: KENANG, sub: "DARK CLOUDS",
    vo: "And then... you remember something. Right before you slipped, the sky was full of dark clouds.",
    gambar: (P) => (
      <g filter="url(#kenangan)">
        <Langit P={P} bawah={1000} gelap={0.7} />
        <Pegunungan y={1000} />
        <g fill="#3E4656" filter="url(#buram)">
          {[[200, 300, 1.3], [520, 260, 1.5], [860, 330, 1.2]].map(([x, y, s], i) => <Awan key={i} x={x} y={y} s={s} warna="#4A5262" />)}
        </g>
        <Lubang x={700} y={1290} s={0.9} />
        <Pendaki x={600} bawah={1300} t={0.85} pose="jalan" topi />
      </g>
    ),
  },
  {
    nama: "Tetes hujan pertama jatuh ke wajahnya", P: BADAI, sub: "A DROP HITS YOUR FACE",
    vo: "A drop hits your face. Then another.",
    kamera: [{ nama: "dekat ke wajah", cx: 430, cy: 860, s: 1.6 }],
    gambar: (P) => (
      <>
        <Sumur P={P} terang={0.5} />
        <Hujan n={30} o={0.5} />
        <Pendaki x={430} bawah={1160} t={0.6} pose="gigil" />
        <path d="M432 900 q10 18 0 28 q-10 -10 0 -28 Z" fill={G.airTerang} stroke={NAVY} strokeWidth={3} />
      </>
    ),
  },
  {
    nama: "Gunung penuh gua: hujan langsung masuk — banjir 2018", P: BADAI, sub: "STRAIGHT DOWN INTO THEM",
    vo: "This mountain is full of caves, and when it rains, the water pours straight down into them. Here, a flash flood once forced a whole team of explorers to climb out through a waterfall.",
    gambar: () => (
      <>
        <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#0E1420" />
        <Hujan n={50} o={0.6} y1={420} />
        <path d="M-100 430 L200 380 L420 410 L560 360 L760 420 L1180 390 L1180 2300 L-100 2300 Z" fill="#1F2738" stroke={NAVY} strokeWidth={6} />
        {[180, 380, 560, 760, 920].map((x, i) => <path key={i} d={`M${x} ${400 + (i % 2) * 20} q${(i % 2 ? 1 : -1) * 30} 200 0 ${360 + i * 60}`} stroke={G.air} strokeWidth={10} fill="none" opacity={0.85} strokeLinecap="round" />)}
        {/* sisipan: tim 2018 memanjat menembus air terjun */}
        <g transform="translate(540 1180)">
          <rect x={-300} y={-200} width={600} height={360} rx={30} fill="#141B2A" stroke="#FFFFFF" strokeWidth={6} />
          <path d="M-60 -200 Q-40 0 -70 160 L40 160 Q60 0 40 -200 Z" fill={G.airTerang} opacity={0.85} />
          <line x1={110} x2={110} y1={-200} y2={160} stroke={G.emasTua} strokeWidth={6} />
          <g transform="translate(110 60) scale(0.25)"><Penjelajah x={0} bawah={0} lampu={false} pose="turun" /></g>
          <text x={-270} y={-160} fontFamily="Baloo2" fontWeight={800} fontSize={34} fill={G.emasMuda}>2018</text>
        </g>
      </>
    ),
  },
  {
    nama: "Titik terendah — air mengalir di dinding, tak ada yang tahu", P: BADAI, sub: "NOBODY KNOWS YOU'RE HERE",
    vo: "Water starts running down the walls. You hug your knees... and you realize nobody even knows you're here.",
    kamera: [{ nama: "mundur pelan", cx: 470, cy: 1000, s: 1.1 }],
    gambar: (P) => (
      <>
        <Sumur P={P} terang={0.35} basah={1} air={0.6} />
        <Hujan n={36} o={0.4} />
        <Gelap />
        <Pendaki x={430} bawah={1160} t={0.6} pose="duduk" />
      </>
    ),
  },
  // ===== BABAK 3 =====
  {
    nama: "Tim penjelajah gua lewat, pulang sebelum badai", P: HUJAN, sub: "SOMEBODY IS WALKING PAST",
    vo: "But somebody is walking past. A team of cave explorers, heading home before the storm.",
    gambar: (P) => (
      <>
        <Langit P={P} bawah={1000} gelap={0.4} cakrawala={false} />
        <Pegunungan y={1000} hujan />
        <Hujan n={60} o={0.45} />
        <Lubang x={760} y={1290} s={0.9} topi />
        {[200, 340, 470].map((x, i) => <Penjelajah key={x} x={x} bawah={1310 + i * 6} t={0.55} lampu={false} />)}
      </>
    ),
  },
  {
    nama: "Satu berhenti — ada topi merah di atas gua terdalam", P: HUJAN, sub: "A RED HAT",
    vo: "And one of them stops... because something bright red is hanging over the deepest cave on Earth. A red hat, caught on a branch. Your hat.",
    kamera: [{ nama: "zoom ke topi", cx: 700, cy: 1120, s: 1.5 }],
    gambar: (P) => (
      <>
        <Langit P={P} bawah={1000} gelap={0.4} cakrawala={false} />
        <Pegunungan y={1000} hujan />
        <Hujan n={60} o={0.45} />
        <Lubang x={760} y={1290} s={0.9} topi />
        <Penjelajah x={560} bawah={1300} t={0.55} lampu={false} pose="tunjuk" />
      </>
    ),
  },
  {
    nama: "\"Hello?\" — kali ini bukan gema yang menjawab", P: HUJAN, sub: "HELLO?",
    vo: "He leans over the edge and shouts, \"Hello?\" And for the first time, it's not your echo that answers.",
    gambar: (P) => (
      <>
        <Sumur P={P} terang={0.8} />
        <Hujan n={30} o={0.35} y1={600} />
        <g transform="translate(560 160)"><circle cx={0} cy={0} r={46} fill={G.kulit} stroke={NAVY} strokeWidth={6} /><path d="M-48 -8 Q-46 -60 0 -62 Q46 -60 48 -8 Z" fill="#F4F6FA" stroke={NAVY} strokeWidth={6} /><rect x={12} y={-40} width={26} height={18} rx={5} fill={G.emas} stroke={NAVY} strokeWidth={4} /></g>
        <path d="M585 150 L700 700 L420 700 Z" fill="url(#gLampu)" opacity={0.8} />
        <text x={720} y={420} fontFamily="Baloo2" fontWeight={800} fontSize={64} fill="#FFFFFF" stroke={NAVY} strokeWidth={8} paintOrder="stroke">HELLO?</text>
        <Pendaki x={430} bawah={1222} t={0.62} pose="teriak" />
        <text x={210} y={900} fontFamily="Baloo2" fontWeight={800} fontSize={56} fill={G.emasMuda} stroke={NAVY} strokeWidth={8} paintOrder="stroke">HERE!</text>
      </>
    ),
  },
  {
    nama: "Tali diikat ke batu besar, satu orang turun dengan lampu kepala", P: GUA, sub: "SLIDES DOWN INTO THE DARK",
    vo: "They don't waste a second. They tie a rope around a big rock at the top, and one of them slides down into the dark, his headlamp swinging toward you.",
    gambar: (P) => (
      <>
        <Sumur P={P} terang={0.7} />
        <line x1={600} x2={600} y1={-300} y2={760} stroke={G.emasTua} strokeWidth={8} />
        <Penjelajah x={600} bawah={880} t={0.55} arah={120} pose="turun" />
        <Sorot P={P} x={430} y={1150} r={260} />
        <Pendaki x={430} bawah={1222} t={0.62} pose="duduk" />
      </>
    ),
  },
  {
    nama: "Selimut darurat, minuman hangat, harnes", P: GUA, sub: "EMERGENCY BLANKET",
    vo: "He wraps you in a shiny emergency blanket, pours you something hot, and clips you into a harness.",
    gambar: (P) => (
      <>
        <Sumur P={P} terang={0.7} />
        <ellipse cx={500} cy={1050} rx={360} ry={260} fill="url(#cahayaHP)" />
        <Penjelajah x={620} bawah={1222} t={0.62} arah={150} pose="tunjuk" flip />
        <Pendaki x={400} bawah={1222} t={0.62} pose="duduk" selimut />
        <g transform="translate(520 1090)" stroke={NAVY} strokeWidth={5}><rect x={-22} y={-40} width={44} height={56} rx={8} fill="#C9D3E3" /><path d="M-8 -50 q-6 -20 4 -36 M8 -50 q-6 -20 4 -36" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.8} /></g>
      </>
    ),
  },
  {
    nama: "Hujan makin deras — air memercik dari tonjolan", P: BADAI, sub: "HEAVIER",
    vo: "But the rain is getting heavier. Water is splashing off the ledge now.",
    gambar: (P) => (
      <>
        <Sumur P={P} terang={0.5} basah={1} air={1} />
        <Hujan n={50} o={0.55} />
        <path d="M720 -300 Q700 400 740 1230" stroke={G.airTerang} strokeWidth={40} fill="none" opacity={0.7} />
        <Penjelajah x={620} bawah={1222} t={0.62} arah={200} flip />
        <Pendaki x={400} bawah={1222} t={0.62} pose="duduk" selimut />
      </>
    ),
  },
  {
    nama: "Katrol di atas — \"Pull!\" — naik di samping air terjun", P: BADAI, sub: "PULL!",
    vo: "Up top, they set up a row of pulleys, so every pull lifts you a little easier. \"Pull!\" You rise a few feet. \"Pull!\" A few more. A waterfall is pouring right beside you...",
    gambar: (P) => (
      <>
        <Sumur P={P} terang={0.6} basah={1} tonjolan={false} />
        <Hujan n={40} o={0.5} />
        <path d="M700 -300 Q690 600 720 2000" stroke={G.airTerang} strokeWidth={60} fill="none" opacity={0.75} />
        <line x1={560} x2={560} y1={-300} y2={720} stroke={G.emasTua} strokeWidth={8} />
        <Pendaki x={560} bawah={1080} t={0.6} pose="harnes" selimut />
        {[[300, 360, "PULL!"], [760, 520, "PULL!"]].map(([x, y, t], i) => <text key={i} x={x as number} y={y as number} fontFamily="Baloo2" fontWeight={800} fontSize={66} fill={G.emasMuda} stroke={NAVY} strokeWidth={8} paintOrder="stroke">{t as string}</text>)}
      </>
    ),
  },
  {
    nama: "Keluar — langit kelabu, hujan, udara segar", P: HUJAN, sub: "YOU'RE OUT",
    vo: "...but the hands at the top keep pulling. And then... grey sky. Rain. Fresh air. They drag you over the edge and you're out.",
    gambar: (P) => (
      <>
        <Langit P={P} bawah={1000} gelap={0.4} cakrawala={false} />
        <Pegunungan y={1000} hujan />
        <Hujan n={60} o={0.45} />
        <Lubang x={560} y={1330} s={1.1} />
        <Katrol x={720} y={1250} />
        <Penjelajah x={300} bawah={1300} t={0.6} lampu={false} pose="tarik" />
        <Penjelajah x={860} bawah={1290} t={0.55} lampu={false} pose="tarik" flip />
        <Pendaki x={540} bawah={1250} t={0.62} pose="lega" selimut />
      </>
    ),
  },
  {
    nama: "Penutup — liburan berikutnya: ruang tamu, memeluk topi merah", P: RUMAH, sub: "YOUR LIVING ROOM",
    vo: "You're safe. And your next vacation? Your living room. [laughs] Hugging the red hat that saved your life.",
    gambar: () => (
      <>
        <rect x={-300} y={-300} width={W + 600} height={H + 600} fill="#F3E7D3" />
        {Array.from({ length: 19 }).map((_, i) => <rect key={i} x={i * 60} y={0} width={26} height={1200} fill="#EADBC2" />)}
        <g stroke={NAVY} strokeWidth={8}>
          <rect x={620} y={380} width={320} height={380} rx={14} fill="#A9B3C0" />
          <line x1={780} x2={780} y1={380} y2={760} />
          <line x1={620} x2={940} y1={560} y2={560} />
        </g>
        <Hujan n={14} o={0.5} y0={390} y1={740} />
        <g stroke={NAVY} strokeWidth={6}>
          <rect x={120} y={420} width={220} height={150} rx={8} fill="#FFFBF2" />
          <rect x={136} y={436} width={188} height={118} fill="#8C96A8" strokeWidth={3} />
          <path d="M136 554 L200 470 L240 510 L290 450 L324 554 Z" fill={G.kapur} strokeWidth={3} />
        </g>
        <rect x={0} y={1200} width={W} height={720} fill="#C9A37A" />
        <rect x={0} y={1192} width={W} height={14} fill="#8C5634" />
        <g stroke={NAVY} strokeWidth={6}>
          <rect x={160} y={980} width={760} height={150} rx={40} fill="#5F86B8" />
          <rect x={140} y={1100} width={800} height={130} rx={30} fill="#4F75A6" />
          <rect x={100} y={1040} width={90} height={190} rx={30} fill="#5F86B8" />
          <rect x={890} y={1040} width={90} height={190} rx={30} fill="#5F86B8" />
        </g>
        <ellipse cx={540} cy={1250} rx={460} ry={60} fill="rgba(10,14,34,.2)" />
        <Pendaki x={520} bawah={1130} t={0.7} pose="peluk-topi" selimut />
        <Topi x={520} y={1010} s={1.1} miring={-8} />
      </>
    ),
  },
];

export const JUMLAH_GU = ADEGAN.length;
export const GU_STILL = ADEGAN.map((_, n) => ({ id: `GU${String(n + 1).padStart(2, "0")}`, n }));

const Catatan: React.FC<{ id: string; nama: string; vo: string }> = ({ id, nama, vo }) => (
  <>
    <div style={{ position: "absolute", top: 36, left: 40, right: 40, padding: "6px 18px", borderRadius: 14, background: "rgba(255,255,255,.9)", color: NAVY, fontFamily: "Baloo2", fontWeight: 800, fontSize: 30 }}>
      {id} · {nama}
    </div>
    <div style={{ position: "absolute", top: 1600, left: 40, right: 40, padding: "18px 24px", borderRadius: 20, background: "rgba(30,42,68,.88)", color: "#F4F8FC", fontFamily: "Baloo2", fontWeight: 700, fontSize: 30, lineHeight: 1.25 }}>
      VO: “{vo}”
    </div>
  </>
);

export const GambarGU: React.FC<{ n: number }> = ({ n }) => {
  const a = ADEGAN[n];
  const k = a.kamera?.[0];
  const id = `GU${String(n + 1).padStart(2, "0")}`;
  return (
    <AbsoluteFill style={{ background: a.P.langitAtas }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <Defs P={a.P} />
        <DefsGua />
        <g transform={k ? `translate(${W / 2 - k.cx * k.s} ${H / 2 - k.cy * k.s}) scale(${k.s})` : undefined}>{a.gambar(a.P, 0)}</g>
        <rect width={W} height={H} fill={`url(#vinyet${a.P.id})`} />
      </svg>
      {a.teks}
      {/* subtitle 1 kata (gaya pilihan owner) — prototipe menampilkan kata kunci adegan */}
      <div style={{ position: "absolute", top: 1420, left: 20, right: 20, fontSize: 100, color: "#FFFFFF", textTransform: "uppercase", ...gayaStroke(13) }}>{a.sub.split(" ").slice(-1)[0]}</div>
      <Catatan id={id} nama={a.nama} vo={a.vo} />
    </AbsoluteFill>
  );
};
