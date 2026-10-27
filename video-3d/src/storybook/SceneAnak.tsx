// Adegan 3–4 (dari atas): tangan anak memegang HP berisi soal matematika. Tiap "tap" = anak menekan jawaban,
// langsung "BENAR!" + bintang. Lalu bintang, hadiah, dan suara heboh menyembur. "Padahal…" = semua meredup.
// Hirarki visual: hanya HP + tangan yang terang; pangkuan, karpet, mainan diredam dan buram.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { cari } from "./naskah";
import { bintangPath, cl, Lapis, lerp, W } from "./kit";

const pop = (f: number, mulai: number, lama = 7) => {
  const x = Math.max(0, Math.min(1, (f - mulai) / lama));
  if (x === 0) return 0;
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

// layar HP: x 290–790, y 580–1380
const TOMBOL = [
  { x: 320, y: 960, c: W.biru },
  { x: 550, y: 960, c: W.koral },
  { x: 320, y: 1140, c: W.mint },
  { x: 550, y: 1140, c: "#8E5BFF" },
];
const SOAL = [
  { q: "3 + 4", opsi: [6, 7, 8, 5], benar: 1 },
  { q: "5 + 2", opsi: [7, 4, 9, 6], benar: 0 },
  { q: "6 + 3", opsi: [8, 10, 9, 7], benar: 2 },
  { q: "4 + 4", opsi: [8, 6, 7, 9], benar: 0 },
];
const pusat = (i: number) => ({ x: TOMBOL[i].x + 105, y: TOMBOL[i].y + 75 });

// ---------- latar dari atas: pangkuan, karpet, mainan (diredam) ----------
const Latar: React.FC = () => (
  <g>
    <rect width={1080} height={1920} fill="#3F7680" />
    {Array.from({ length: 10 }).map((_, r) =>
      Array.from({ length: 6 }).map((__, c) => (
        <path key={`${r}-${c}`} d={`M${c * 200 + 100} ${r * 200 + 40} l60 60 l-60 60 l-60 -60z`} fill="none" stroke="#4C8791" strokeWidth={8} />
      )),
    )}
    <rect x={0} y={300} width={1080} height={40} fill="#346873" />
    {/* paha anak (celana pendek) dari atas */}
    <path d="M150 1920 C140 1500 200 1250 330 1180 L540 1170 L750 1180 C880 1250 940 1500 930 1920Z" fill="#2F5866" />
    <path d="M540 1180 L540 1920" stroke="#284D5A" strokeWidth={10} />
    {/* mainan berserakan */}
    <g transform="translate(120 520) rotate(-20)">
      <rect x={-70} y={-34} width={140} height={60} rx={18} fill="#5E9AA5" />
      <rect x={-40} y={-64} width={80} height={40} rx={12} fill="#6FAAB3" />
      <circle cx={-40} cy={30} r={20} fill="#23434C" />
      <circle cx={40} cy={30} r={20} fill="#23434C" />
    </g>
    <g transform="translate(960 470)">
      <rect x={-50} y={-50} width={100} height={100} rx={14} fill="#7FB7B0" />
      <text y={22} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={64} fill="#CDE7E3">A</text>
    </g>
    <g transform="translate(990 1500) rotate(15)">
      <rect x={-60} y={-80} width={120} height={160} rx={16} fill="#5C8FB0" />
      <rect x={-46} y={-66} width={92} height={60} rx={8} fill="#8DB6CC" opacity={0.8} />
    </g>
    <circle cx={110} cy={1560} r={60} fill="#5FA394" />
    <path d="M60 1560 Q110 1520 160 1560" stroke="#CDE7E3" strokeWidth={8} fill="none" />
  </g>
);

const LayarSoal: React.FC<{ f: number; fTap: number[]; redup: number; pesta: number }> = ({ f, fTap, redup, pesta }) => {
  // soal ke-n tampil sampai jawabannya ditekan + 10 frame, lalu soal berikutnya meluncur masuk
  let n = 0;
  fTap.forEach((t, i) => {
    if (f >= t + 10) n = Math.min(i + 1, SOAL.length - 1);
  });
  const sudahSemua = f >= fTap[fTap.length - 1] + 10;
  const tapIni = fTap[n], tapLalu = n > 0 ? fTap[n - 1] : -99;
  const masuk = n > 0 ? interpolate(f, [tapLalu + 10, tapLalu + 16], [1, 0], { ...cl, easing: Easing.out(Easing.cubic) }) : 0;
  const soal = SOAL[n];
  const ditekan = f >= tapIni && f < tapIni + 10 && !sudahSemua;
  const benar = ditekan ? pop(f, tapIni, 5) : 0;
  const skor = 120 + fTap.filter((t) => f >= t).length * 10 + Math.round(pesta * 990);
  return (
    <g>
      <clipPath id="layarHP">
        <rect x={290} y={580} width={500} height={800} rx={34} />
      </clipPath>
      <g clipPath="url(#layarHP)">
        <rect x={290} y={580} width={500} height={800} fill="#FFF6E5" />
        {/* bilah atas */}
        <rect x={290} y={580} width={500} height={80} fill="#FFD66B" />
        <path d={bintangPath(335, 620, 22, 9)} fill="#FF9F1C" />
        <text x={366} y={634} fontFamily="Fredoka" fontWeight={700} fontSize={38} fill={W.navy}>{skor}</text>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${680 + i * 34} 636 c-14 -10 -22 -18 -14 -28 c6 -6 12 -4 14 2 c2 -6 8 -8 14 -2 c8 10 0 18 -14 28z`} fill={W.merah} />
        ))}
        {!sudahSemua && (
          <g transform={`translate(${masuk * 520} 0)`}>
            {/* kartu soal */}
            <rect x={318} y={690} width={444} height={220} rx={28} fill="#fff" />
            <rect x={318} y={880} width={444} height={30} rx={14} fill="#000" opacity={0.05} />
            <text x={540} y={830} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={104} fill={W.navy}>{soal.q} = ?</text>
            {TOMBOL.map((b, i) => {
              const ini = ditekan && i === soal.benar;
              const s = ini ? 1 - 0.08 * Math.max(0, 1 - (f - tapIni) / 3) : 1;
              return (
                <g key={i} transform={`translate(${b.x + 105} ${b.y + 75}) scale(${s})`}>
                  <rect x={-105} y={-63} width={210} height={150} rx={30} fill="#000" opacity={0.12} />
                  <rect x={-105} y={-75} width={210} height={150} rx={30} fill={ini ? "#2FB36B" : b.c} />
                  <text y={30} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={88} fill="#fff">{soal.opsi[i]}</text>
                  {ini && <path d="M52 -60 l14 14 l26 -30" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                </g>
              );
            })}
            {/* BENAR! */}
            {benar > 0 && (
              <g transform={`translate(540 795) scale(${benar}) rotate(-6)`}>
                <rect x={-170} y={-62} width={340} height={110} rx={30} fill="#2FB36B" />
                <text y={18} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={72} fill="#fff">BENAR!</text>
              </g>
            )}
          </g>
        )}
        {sudahSemua && (
          <g transform={`translate(540 960) scale(${pop(f, fTap[fTap.length - 1] + 10, 9)})`}>
            <path d={bintangPath(0, -60, 150, 64)} fill="#FFB800" />
            <path d={bintangPath(-6, -66, 128, 54)} fill={W.kuning} />
            <text y={190} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={90} fill={W.navy}>HEBAT!</text>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const a = (i / 8) * Math.PI * 2 + f / 20;
              return <rect key={i} x={-6} y={-260} width={12} height={50} rx={6} fill="#FFB800" transform={`rotate(${(a * 180) / Math.PI})`} opacity={0.8} />;
            })}
          </g>
        )}
        <rect x={290} y={580} width={500} height={800} fill="#1C2033" opacity={redup * 0.6} />
      </g>
    </g>
  );
};

// ---------- tangan dari atas ----------
const TanganKiri: React.FC = () => (
  <g>
    <path d="M150 1920 Q170 1560 250 1300" stroke={W.koral} strokeWidth={130} fill="none" strokeLinecap="round" />
    <path d="M162 1520 Q190 1420 236 1330" stroke="#E8613F" strokeWidth={30} fill="none" strokeLinecap="round" opacity={0.5} />
    <ellipse cx={250} cy={1210} rx={72} ry={96} fill={W.kulit} />
    {[1080, 1135, 1190, 1245].map((y, i) => (
      <rect key={y} x={214 - (i === 3 ? 6 : 0)} y={y - 22} width={66} height={42} rx={21} fill={W.kulit} />
    ))}
    {[1080, 1135, 1190, 1245].map((y) => (
      <path key={`l${y}`} d={`M226 ${y + 20} q16 4 30 0`} stroke={W.kulitBayang} strokeWidth={4} fill="none" />
    ))}
  </g>
);
const JempolKiri: React.FC = () => (
  <g>
    <rect x={262} y={1150} width={46} height={120} rx={23} fill={W.kulit} transform="rotate(28 285 1210)" />
    <ellipse cx={302} cy={1162} rx={13} ry={11} fill="#F6D2BC" />
  </g>
);

const TanganKetuk: React.FC<{ x: number; y: number; angkat: number }> = ({ x, y, angkat }) => (
  <g>
    {/* bayangan jari di layar: makin jauh saat jari terangkat */}
    <ellipse cx={x + 18 + angkat * 40} cy={y + 26 + angkat * 50} rx={26} ry={18} fill="#000" opacity={0.18 * (1 - angkat * 0.5)} />
    <g transform={`translate(${x} ${y}) scale(${1 + angkat * 0.08})`}>
      <path d="M150 260 Q220 520 330 900" stroke={W.koral} strokeWidth={130} fill="none" strokeLinecap="round" />
      <path d="M150 260 Q220 520 330 900" stroke="#E8613F" strokeWidth={24} fill="none" strokeLinecap="round" opacity={0.35} transform="translate(30 0)" />
      <ellipse cx={110} cy={200} rx={92} ry={78} fill={W.kulit} transform="rotate(30 110 200)" />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={70 + i * 34} cy={250 + i * 12} rx={22} ry={18} fill={W.kulitBayang} opacity={0.5} />
      ))}
      <rect x={-18} y={-6} width={40} height={190} rx={20} fill={W.kulit} transform="rotate(-28 0 0)" />
      <ellipse cx={-4} cy={10} rx={13} ry={12} fill="#F6D2BC" transform="rotate(-28 -4 10)" />
    </g>
  </g>
);

// ---------- hadiah yang menyembur keluar HP ----------
const Hadiah: React.FC<{ f: number }> = ({ f }) => {
  const fBintang = cari("bintang").at, fHadiah = cari("hadiah").at, fSuara = cari("suara").at, fHeboh = cari("heboh").at;
  const bintang = [
    { x: 160, y: 700, s: 1.1, r: 15 },
    { x: 920, y: 640, s: 0.9, r: -10 },
    { x: 940, y: 1020, s: 0.8, r: 20 },
    { x: 150, y: 1000, s: 0.75, r: -25 },
    { x: 880, y: 1300, s: 0.7, r: 8 },
  ];
  const kotak = pop(f, fHadiah, 9), tutup = interpolate(f, [fHadiah + 8, fHadiah + 20], [0, 1], { ...cl, easing: Easing.out(Easing.quad) });
  const spk = pop(f, fSuara, 8), heboh = f >= fHeboh;
  const konfeti = Array.from({ length: 30 }).map((_, i) => {
    const mulai = fHadiah + 8 + (i % 3) * 3;
    if (f < mulai) return null;
    const t = f - mulai;
    const a = -Math.PI / 2 + (((i * 47) % 100) - 50) / 35;
    const v = 14 + (i % 5) * 4;
    const x = 900 + Math.cos(a) * v * t * 0.8, y = 1240 + Math.sin(a) * v * t + 0.5 * t * t;
    if (y > 1600) return null;
    const c = [W.kuning, W.biru, W.mint, "#FF5FA2", W.koral][i % 5];
    return <rect key={i} x={x} y={y} width={18} height={10} rx={2} fill={c} transform={`rotate(${t * 12 + i * 30} ${x} ${y})`} />;
  });
  return (
    <g>
      {bintang.map((b, i) => {
        const mulai = fBintang + i * 3;
        const k = interpolate(f, [mulai, mulai + 14], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.6)) });
        if (k <= 0) return null;
        const x = 540 + (b.x - 540) * k, y = 960 + (b.y - 960) * k - Math.sin(k * Math.PI) * 100;
        return (
          <g key={i} transform={`translate(${x} ${y + Math.sin(f / 8 + i) * 8}) rotate(${b.r + f * 2 * (i % 2 ? 1 : -1)}) scale(${b.s * Math.min(1, k * 1.4)})`}>
            <path d={bintangPath(0, 0, 70, 30)} fill="#FFB800" />
            <path d={bintangPath(-4, -5, 60, 25)} fill={W.kuning} />
            <circle cx={-14} cy={-10} r={6} fill="#5A3A10" />
            <circle cx={12} cy={-10} r={6} fill="#5A3A10" />
            <path d="M-12 10 Q0 22 12 10" stroke="#5A3A10" strokeWidth={5} fill="none" strokeLinecap="round" />
          </g>
        );
      })}
      {konfeti}
      {kotak > 0 && (
        <g transform={`translate(900 ${1260 - kotak * 30}) scale(${kotak * 0.9}) rotate(${Math.sin(f / 4) * 4})`}>
          <rect x={-80} y={-50} width={160} height={120} rx={12} fill="#E8455B" />
          <rect x={-14} y={-50} width={28} height={120} fill={W.kuning} />
          <g transform={`translate(${tutup * 40} ${-tutup * 140}) rotate(${tutup * 40})`}>
            <rect x={-92} y={-86} width={184} height={42} rx={10} fill="#FF5A6E" />
            <rect x={-14} y={-86} width={28} height={42} fill={W.kuning} />
            <path d="M0 -86 C-50 -140 -70 -90 0 -86 C70 -90 50 -140 0 -86Z" fill={W.kuning} />
          </g>
        </g>
      )}
      {spk > 0 && (
        <g transform={`translate(150 1250) scale(${spk * 0.9})`}>
          <path d="M-60 -40 L-20 -40 L40 -95 L40 95 L-20 40 L-60 40Z" fill="#00B8D9" />
          <rect x={-74} y={-44} width={30} height={88} rx={10} fill="#0090AE" />
          {[0, 1, 2].map((i) => {
            const t = ((f - fSuara) / 10 + i / 3) % 1;
            return <path key={i} d={`M${70 + t * 100} -${60 + t * 50} Q${110 + t * 130} 0 ${70 + t * 100} ${60 + t * 50}`} stroke="#00B8D9" strokeWidth={12} fill="none" strokeLinecap="round" opacity={1 - t} />;
          })}
          {heboh &&
            [0, 1, 2].map((i) => {
              const t = ((f - fHeboh) / 24 + i / 3) % 1;
              const c = ["#FF5FA2", W.kuning, W.mint][i];
              return (
                <g key={`n${i}`} transform={`translate(${20 + i * 40} ${-120 - t * 200}) rotate(${Math.sin(f / 5 + i) * 15})`} opacity={1 - t}>
                  <ellipse cx={0} cy={30} rx={18} ry={14} fill={c} />
                  <rect x={12} y={-30} width={7} height={60} fill={c} />
                  <path d="M19 -30 q26 10 20 34" stroke={c} strokeWidth={7} fill="none" />
                </g>
              );
            })}
        </g>
      )}
    </g>
  );
};

const GelembungPikir: React.FC<{ s: number; f: number }> = ({ s, f }) => (
  <g opacity={Math.min(1, s * 1.5)}>
    {[[760, 1150, 16], [800, 1060, 24]].map(([x, y, r], i) => (
      <circle key={i} cx={x} cy={y} r={r * Math.min(1, s * 1.6)} fill="#fff" />
    ))}
    <g transform={`translate(860 900) scale(${s * 0.8})`}>
      <ellipse rx={150} ry={100} fill="#fff" />
      {[[-110, -40, 60], [-40, -80, 66], [50, -78, 62], [115, -30, 56], [100, 50, 52], [0, 70, 60], [-100, 45, 50]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff" />
      ))}
      <g transform={`rotate(${Math.sin(f / 12) * 3})`}>
        <circle cx={-10} cy={-12} r={46} fill="#D7D9DE" />
        <path d="M-34 22 L14 22 L10 48 L-30 48Z" fill="#B9BDC6" />
        <rect x={-30} y={50} width={40} height={10} rx={4} fill="#9EA3AD" />
        <rect x={-26} y={62} width={32} height={9} rx={4} fill="#9EA3AD" />
      </g>
      <text x={70} y={18} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={84} fill="#9EA3AD">?</text>
    </g>
  </g>
);

export const SceneAnak: React.FC<{ dari: number }> = ({ dari }) => {
  const f = useCurrentFrame() + dari;
  const fTap = [cari("mengetuk").at + 4, cari("tap", 0).at, cari("tap", 1).at, cari("tap", 2).at];
  const fBintang = cari("bintang").at, fPadahal = cari("padahal").at, fBelum = cari("belum").at;
  const akhir = cari("berpikir").akhir + 45;

  // jari: melayang di kanan bawah layar → turun ke jawaban yang benar tiap ketukan
  const istirahat = { x: 700, y: 1330 };
  let jari = { ...istirahat }, angkat = 1;
  fTap.forEach((t, i) => {
    const d = f - t;
    if (d > -7 && d < 9) {
      const turun = d < 0 ? Easing.out(Easing.quad)((d + 7) / 7) : Math.max(0, 1 - d / 9);
      const p = pusat(SOAL[i].benar);
      jari = { x: istirahat.x + (p.x - istirahat.x) * turun, y: istirahat.y + (p.y - istirahat.y) * turun };
      angkat = 1 - turun;
    }
  });

  const pesta = interpolate(f, [fBintang, fPadahal], [0, 1], cl);
  const kosong = interpolate(f, [fPadahal, fPadahal + 12], [0, 1], cl);
  const pikir = interpolate(f, [fBelum - 4, fBelum + 10], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.5)) });
  const zoom = 1 + lerp(f, dari, fPadahal, 0, 0.06) + lerp(f, fPadahal, akhir, 0, 0.08);
  const asal = "50% 52%";
  const kilatBenar = fTap.reduce((m, t) => Math.max(m, interpolate(f, [t, t + 2, t + 12], [0, 1, 0], cl)), 0);

  return (
    <AbsoluteFill style={{ background: "#2C5664" }}>
      <Lapis id="rB1" zoom={zoom} k={0.6} asal={asal} style={{ filter: `brightness(${1 - kosong * 0.15}) contrast(0.9) blur(2.5px)` }}>
        <Latar />
      </Lapis>
      {/* cahaya layar yang jatuh ke sekitar HP (hijau sesaat saat BENAR) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 52% 36% at 50% 50%, rgba(${Math.round(255 - kilatBenar * 160)},${Math.round(236 - kilatBenar * 20)},${Math.round(200 - kilatBenar * 90)},${0.5 - kosong * 0.3}), rgba(255,236,200,0) 72%)`,
          mixBlendMode: "screen",
        }}
      />
      <Lapis id="rB2" zoom={zoom} k={1} asal={asal} garis="#1E2A3A">
        <TanganKiri />
        {/* HP */}
        <rect x={262} y={548} width={556} height={864} rx={58} fill="#1E2230" />
        <rect x={270} y={556} width={540} height={848} rx={52} fill="none" stroke="#3A4058" strokeWidth={4} />
        <rect x={500} y={562} width={80} height={12} rx={6} fill="#0E1018" />
        <LayarSoal f={f} fTap={fTap} redup={kosong} pesta={pesta} />
        <JempolKiri />
        <TanganKetuk x={jari.x} y={jari.y} angkat={angkat} />
      </Lapis>
      <Lapis id="rB3" zoom={zoom} k={1.1} asal={asal} garis="#1E2A3A" style={{ filter: `saturate(${1 - kosong * 0.85}) brightness(${1 - kosong * 0.25})`, opacity: 1 - kosong * 0.65 }}>
        <Hadiah f={f} />
      </Lapis>
      <Lapis id="rB4" zoom={zoom} k={1} asal={asal}>
        <GelembungPikir s={pikir} f={f} />
      </Lapis>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 58% at 50% 52%, rgba(14,40,50,0) 58%, rgba(14,40,50,.4) 100%)" }} />
    </AbsoluteFill>
  );
};
