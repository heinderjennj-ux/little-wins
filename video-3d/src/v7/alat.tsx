// Latar & properti Variasi 7, gaya triad (biru periwinkle dominan + emas + mawar). Warna latar diambil dari palet tema E.
import React from "react";
import { staticFile } from "remotion";
import { bintangPath, W } from "../storybook/kit";
import { PASANGAN, Tema } from "../gaya/tema";

export const tema = (intens: boolean): Tema => (intens ? PASANGAN.E.intens : PASANGAN.E.tenang);
export const FOKUS = { garis: "#2E2A48", garisIntens: "#1A1626" };

// ---------- ruang keluarga (siang) / malam ----------
export const Ruang: React.FC<{ T: Tema; malam?: boolean; f: number }> = ({ T, malam, f }) => (
  <g>
    <rect width={1080} height={1920} fill={T.dinding} />
    {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={i * 90} y={0} width={38} height={1920} fill={T.garisDinding} />)}
    {/* jendela */}
    <rect x={70} y={560} width={330} height={300} rx={14} fill={T.kusen} />
    <rect x={86} y={576} width={298} height={268} rx={6} fill={malam ? "#2B3266" : T.langit} />
    {malam ? (
      <g>
        <circle cx={300} cy={640} r={30} fill="#E9E4C8" />
        <circle cx={314} cy={630} r={26} fill="#2B3266" />
        {[[140, 620], [200, 700], [330, 760], [120, 780]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#E9E4C8" opacity={0.6 + 0.4 * Math.sin(f / 9 + i)} />)}
      </g>
    ) : (
      <g>
        <circle cx={300} cy={640} r={30} fill={T.matahari} />
        <ellipse cx={150 + ((f * 0.5) % 180)} cy={700} rx={40} ry={14} fill="#fff" opacity={0.8} />
      </g>
    )}
    <rect x={230} y={576} width={10} height={268} fill={T.kusen} />
    <path d="M52 545 Q90 720 58 880 L104 880 Q122 720 98 545Z" fill={T.tirai} />
    <path d="M418 545 Q380 720 412 880 L366 880 Q348 720 372 545Z" fill={T.tirai} />
    {/* bingkai foto keluarga */}
    <rect x={700} y={590} width={200} height={160} rx={8} fill={T.rel} />
    <rect x={714} y={604} width={172} height={132} fill={T.jamMuka} />
    <circle cx={770} cy={660} r={20} fill={T.cangkir} />
    <circle cx={830} cy={668} r={15} fill={T.balok} />
    <path d="M730 736 Q800 690 870 736Z" fill={T.daun[0]} />
    {/* rak kecil + tanaman */}
    <rect x={930} y={820} width={140} height={14} rx={6} fill={T.papanRak} />
    <rect x={950} y={760} width={60} height={60} rx={10} fill={T.pot} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={965 + i * 16} cy={735 - (i % 2) * 18} rx={14} ry={34} fill={T.daun[i]} transform={`rotate(${(i - 1) * 25} ${965 + i * 16} 760)`} />)}
    {/* sofa */}
    <rect x={20} y={1040} width={1040} height={330} rx={70} fill={T.rakLuar} />
    <rect x={20} y={1260} width={1040} height={660} fill={T.rakDalam} />
    <rect x={60} y={1080} width={200} height={140} rx={40} fill={T.cangkir} transform="rotate(-8 160 1150)" />
    <rect x={840} y={1080} width={190} height={140} rx={40} fill={T.balok} transform="rotate(8 935 1150)" />
    <rect x={0} y={1700} width={1080} height={220} fill={T.mejaDepan} />
  </g>
);

// ---------- meja belajar (biasanya malam) ----------
export const MejaBelajar: React.FC<{ T: Tema; f: number }> = ({ T, f }) => (
  <g>
    <rect width={1080} height={1920} fill={T.dinding} />
    {Array.from({ length: 13 }).map((_, i) => <rect key={i} x={i * 90} y={0} width={38} height={1920} fill={T.garisDinding} />)}
    <rect x={640} y={560} width={340} height={290} rx={14} fill={T.kusen} />
    <rect x={656} y={576} width={308} height={258} rx={6} fill="#2B3266" />
    <circle cx={880} cy={640} r={28} fill="#E9E4C8" />
    <circle cx={893} cy={631} r={24} fill="#2B3266" />
    {[[700, 620], [760, 720], [920, 780]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#E9E4C8" opacity={0.6 + 0.4 * Math.sin(f / 9 + i)} />)}
    <rect x={805} y={576} width={10} height={258} fill={T.kusen} />
    {/* papan gabus + kertas tempel */}
    <rect x={90} y={580} width={300} height={220} rx={10} fill={T.mejaAtas} />
    <rect x={120} y={610} width={90} height={70} fill={T.kertas[0]} transform="rotate(-5 165 645)" />
    <rect x={240} y={620} width={110} height={80} fill={T.cangkir} transform="rotate(4 295 660)" />
    <rect x={150} y={700} width={100} height={70} fill={T.balok} transform="rotate(3 200 735)" />
    {/* meja */}
    <rect x={-20} y={1240} width={1120} height={40} fill={T.mejaAtas} />
    <rect x={-20} y={1280} width={1120} height={640} fill={T.mejaDepan} />
    {[1360, 1480, 1620, 1780].map((y, i) => <path key={y} d={`M0 ${y} Q300 ${y + (i % 2 ? 12 : -8)} 600 ${y} T1080 ${y + 5}`} stroke={T.serat} strokeWidth={4} fill="none" opacity={0.7} />)}
  </g>
);

// lampu belajar hangat (bagian dari fokus)
export const Lampu: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={0} rx={70} ry={16} fill="#3F4E8C" />
    <rect x={-8} y={-200} width={16} height={200} fill="#3F4E8C" />
    <path d="M-10 -200 L-130 -250 L-110 -300 L10 -230Z" fill="#3F4E8C" />
    <path d="M-150 -240 L-60 -330 L-20 -270 L-110 -190Z" fill="#4D5FA8" />
    <circle cx={-90} cy={-230} r={16} fill="#FFF3C4" />
  </g>
);

export const HP: React.FC<{ x: number; y: number; s?: number; r?: number; children?: React.ReactNode; layar?: string }> = ({ x, y, s = 1, r = 0, children, layar = "#FFF6E5" }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <rect x={-130} y={-230} width={260} height={460} rx={36} fill="#1E2230" />
    <clipPath id={`hp${x}${y}`}>
      <rect x={-116} y={-212} width={232} height={424} rx={24} />
    </clipPath>
    <g clipPath={`url(#hp${x}${y})`}>
      <rect x={-116} y={-212} width={232} height={424} fill={layar} />
      {children}
    </g>
    <rect x={-30} y={-222} width={60} height={8} rx={4} fill="#0E1018" />
  </g>
);

export const Bintang: React.FC<{ x: number; y: number; r: number; isi?: boolean; rot?: number }> = ({ x, y, r, isi = true, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {isi ? (
      <>
        <path d={bintangPath(0, 0, r, r * 0.43)} fill="#FFB800" />
        <path d={bintangPath(-r * 0.06, -r * 0.07, r * 0.85, r * 0.36)} fill={W.kuning} />
      </>
    ) : (
      <path d={bintangPath(0, 0, r, r * 0.43)} fill="none" stroke="#C9C3D9" strokeWidth={r * 0.12} strokeLinejoin="round" />
    )}
  </g>
);

export const Gelembung: React.FC<{ x: number; y: number; teks: string; ekor?: "kiri" | "kanan" | "bawah"; lebar?: number; ukuran?: number; s?: number }> = ({ x, y, teks, ekor = "bawah", lebar, ukuran = 50, s = 1 }) => {
  const w = lebar ?? Math.max(260, teks.length * ukuran * 0.52 + 70);
  const ex = ekor === "kiri" ? -w / 2 + 60 : ekor === "kanan" ? w / 2 - 60 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-60} width={w} height={110} rx={44} fill="#fff" stroke={W.navy} strokeWidth={7} />
      <path d={`M${ex - 20} 46 L${ex + (ekor === "kanan" ? 30 : ekor === "kiri" ? -30 : 0)} 96 L${ex + 22} 46`} fill="#fff" stroke={W.navy} strokeWidth={7} strokeLinejoin="round" />
      <rect x={ex - 24} y={38} width={48} height={14} fill="#fff" />
      <text y={14} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={ukuran} fill={W.navy}>{teks}</text>
    </g>
  );
};

export const Label: React.FC<{ x: number; y: number; teks: string; warna?: string; ukuran?: number; rot?: number }> = ({ x, y, teks, warna = W.navy, ukuran = 40, rot = 0 }) => {
  const w = teks.length * ukuran * 0.55 + 50;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-ukuran * 0.85} width={w} height={ukuran * 1.5} rx={ukuran * 0.45} fill={warna} />
      <text y={ukuran * 0.2} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={ukuran} fill="#fff">{teks}</text>
    </g>
  );
};

// lembar PR matematika: 10 soal; salah = tanda silang merah di 6 soal
export const LembarPR: React.FC<{ x: number; y: number; s?: number; r?: number; nilai?: boolean; sorot?: boolean }> = ({ x, y, s = 1, r = 0, nilai, sorot }) => {
  const soal = ["3 + 4 = 8", "5 + 2 = 7", "6 + 1 = 8", "2 + 2 = 4", "7 + 2 = 8", "4 + 5 = 9", "8 + 1 = 10", "3 + 3 = 6", "9 + 0 = 8", "6 + 2 = 9"];
  const salah = [0, 2, 4, 6, 8, 9];
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <rect x={-220} y={-290} width={440} height={580} rx={12} fill="#FFFDF7" />
      <rect x={-220} y={-290} width={440} height={70} rx={12} fill="#F3EAD6" />
      <text x={-190} y={-243} fontFamily="Fredoka" fontWeight={700} fontSize={34} fill={W.navy}>PR Matematika</text>
      {soal.map((q, i) => {
        const y0 = -180 + i * 46;
        return (
          <g key={i} opacity={sorot && i !== 0 ? 0.55 : 1}>
            <text x={-170} y={y0} fontFamily="Fredoka" fontWeight={600} fontSize={32} fill="#3B4A6A">{`${i + 1}. ${q}`}</text>
            {nilai && salah.includes(i) && <path d={`M90 ${y0 - 28} l28 28 m0 -28 l-28 28`} stroke={W.merah} strokeWidth={7} strokeLinecap="round" />}
            {nilai && !salah.includes(i) && <path d={`M86 ${y0 - 10} l12 12 l24 -26`} stroke="#2FB36B" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        );
      })}
      {sorot && <ellipse cx={-60} cy={-192} rx={150} ry={36} fill="none" stroke={W.merah} strokeWidth={7} />}
    </g>
  );
};

// teka-teki Koder Cilik: papan n×n, batu, baterai, panah, Robo
export type Sel = [number, number];
export const Teka: React.FC<{
  x: number; y: number; s?: number; n?: number; batu: Sel[]; baterai: Sel; robo: Sel | [number, number]; panah?: { sel: Sel; arah: "kanan" | "kiri" | "atas" | "bawah"; warna?: string; hapus?: boolean }[];
  jejak?: Sel[]; tabrak?: boolean; menang?: boolean;
}> = ({ x, y, s = 1, n = 4, batu, baterai, robo, panah = [], jejak = [], tabrak, menang }) => {
  const u = 130, w = n * u, x0 = -w / 2, y0 = -w / 2;
  const pusat = (c: number, r: number) => [x0 + c * u + u / 2, y0 + r * u + u / 2];
  const sudut = { kanan: 0, bawah: 90, kiri: 180, atas: -90 };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={x0 - 30} y={y0 - 30} width={w + 60} height={w + 60} rx={26} fill="#FFFDF7" />
      {Array.from({ length: n * n }).map((_, i) => {
        const c = i % n, r = Math.floor(i / n);
        return <rect key={i} x={x0 + c * u + 6} y={y0 + r * u + 6} width={u - 12} height={u - 12} rx={18} fill={(c + r) % 2 ? "#EEF1FB" : "#E4E9F8"} />;
      })}
      {jejak.length > 1 && <path d={"M" + jejak.map(([c, r]) => pusat(c, r).join(" ")).join(" L")} stroke="#8E9BD6" strokeWidth={12} fill="none" strokeDasharray="4 22" strokeLinecap="round" />}
      {batu.map(([c, r], i) => {
        const [cx, cy] = pusat(c, r);
        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy + 10} rx={48} ry={38} fill="#8C8698" />
            <ellipse cx={cx - 8} cy={cy} rx={40} ry={30} fill="#A7A1B3" />
            <ellipse cx={cx - 18} cy={cy - 10} rx={12} ry={7} fill="#C9C4D2" />
          </g>
        );
      })}
      {(() => {
        const [cx, cy] = pusat(...baterai);
        return (
          <g>
            <rect x={cx - 26} y={cy - 46} width={52} height={92} rx={10} fill="#3FBF8F" />
            <rect x={cx - 12} y={cy - 56} width={24} height={12} rx={4} fill="#2E9A70" />
            <path d={`M${cx + 6} ${cy - 30} L${cx - 12} ${cy + 4} L${cx + 2} ${cy + 4} L${cx - 6} ${cy + 30} L${cx + 14} ${cy - 6} L${cx} ${cy - 6}Z`} fill="#FFF3B0" />
          </g>
        );
      })()}
      {panah.map((p, i) => {
        const [cx, cy] = pusat(...p.sel);
        return (
          <g key={i} transform={`translate(${cx} ${cy}) rotate(${sudut[p.arah]})`} opacity={p.hapus ? 0.3 : 1}>
            <path d="M-34 0 L22 0 M4 -20 L26 0 L4 20" stroke={p.warna ?? W.biru} strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
      {(() => {
        const [cx, cy] = pusat(robo[0], robo[1]);
        return (
          <g transform={`translate(${cx} ${cy}) rotate(${tabrak ? -14 : 0})`}>
            <image href={staticFile("v7/robo.png")} x={-58} y={-58} width={116} height={108} />
            {tabrak && [0, 1, 2].map((k) => <path key={k} d={bintangPath(40 + k * 18, -60 + k * 10, 14, 6)} fill={W.kuning} />)}
            {menang && [0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={-4} y={-110} width={8} height={30} rx={4} fill={W.kuning} transform={`rotate(${k * 60})`} />)}
          </g>
        );
      })()}
    </g>
  );
};

export const Produk: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <image href={staticFile("v7/produk.png")} x={x - w / 2} y={y - w * 0.32} width={w} height={w * 0.64} preserveAspectRatio="xMidYMid meet" />
);
