// Adegan 3–4 (dari atas): tangan anak memegang HP berisi soal matematika. Tiap "tap" = anak menekan jawaban,
// langsung "BENAR!" + bintang. Lalu bintang, hadiah, dan suara heboh menyembur. "Padahal…" = semua meredup.
// Hirarki visual: hanya HP + tangan yang terang; pangkuan, karpet, mainan diredam dan buram.
import React from "react";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cari, kAnak, KATA } from "./naskahHook";
import { campur, TemaCtx, usePasangan, useTema } from "../../gaya/tema";
import { bintangPath, cl, Lapis, lerp, W } from "../../gaya/kit";

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
  { q: "4 + 3", opsi: [6, 7, 5, 8], benar: 1 },
];
// urutan ketukan mengikuti kalimat VO v4 (indeks kata):
// 59-61 "tap, tap, tap" (3 soal benar cepat) · 64 "a star pops up" · 69 "If it's wrong" (ketuk jawaban salah → TRY AGAIN)
// 71 "they tap again" (ketuk jawaban lain) · 75 "If it's right" (hijau + CORRECT!) · 79 "they get a prize" (kado keluar)
type Ketuk = { f: number; q: number; btn: number; ok: boolean; hasil: number };
const at = (i: number) => KATA[i].at;
const KETUK: Ketuk[] = [
  { f: at(57), q: 0, btn: 1, ok: true, hasil: at(57) },
  { f: at(58), q: 1, btn: 0, ok: true, hasil: at(58) },
  { f: at(59), q: 2, btn: 2, ok: true, hasil: at(59) },
  { f: at(65), q: 3, btn: 0, ok: false, hasil: at(65) },
  { f: at(67), q: 3, btn: 1, ok: true, hasil: at(70) },
];
const F_SOAL4 = at(64) - 4; // bintang besar muncul setelah 3 ketukan, menjelang "a star pops up" (kata 64)
const pusat = (i: number) => ({ x: TOMBOL[i].x + 105, y: TOMBOL[i].y + 75 });

// ---------- latar dari atas: pangkuan, karpet, mainan (diredam) ----------
const Latar: React.FC = () => {
  const T = useTema();
  return (
  <g>
    <rect width={1080} height={1920} fill={T.karpet} />
    {Array.from({ length: 10 }).map((_, r) =>
      Array.from({ length: 6 }).map((__, c) => (
        <path key={`${r}-${c}`} d={`M${c * 200 + 100} ${r * 200 + 40} l60 60 l-60 60 l-60 -60z`} fill="none" stroke={T.karpetGaris} strokeWidth={8} />
      )),
    )}
    <rect x={0} y={300} width={1080} height={40} fill={T.pita} />
    {/* paha anak (celana pendek) dari atas */}
    <path d="M150 1920 C140 1500 200 1250 330 1180 L540 1170 L750 1180 C880 1250 940 1500 930 1920Z" fill={T.celana} />
    <path d="M540 1180 L540 1920" stroke={T.jahitan} strokeWidth={10} />
    {/* mainan berserakan */}
    <g transform="translate(120 520) rotate(-20)">
      <rect x={-70} y={-34} width={140} height={60} rx={18} fill={T.mobil} />
      <rect x={-40} y={-64} width={80} height={40} rx={12} fill={T.mobilAtas} />
      <circle cx={-40} cy={30} r={20} fill={T.roda} />
      <circle cx={40} cy={30} r={20} fill={T.roda} />
    </g>
    <g transform="translate(960 470)">
      <rect x={-50} y={-50} width={100} height={100} rx={14} fill={T.balok} />
      <text y={22} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={64} fill={T.balokHuruf}>A</text>
    </g>
    <g transform="translate(990 1500) rotate(15)">
      <rect x={-60} y={-80} width={120} height={160} rx={16} fill={T.bukuB} />
      <rect x={-46} y={-66} width={92} height={60} rx={8} fill={T.bukuBDalam} opacity={0.8} />
    </g>
    <circle cx={110} cy={1560} r={60} fill={T.bola} />
    <path d="M60 1560 Q110 1520 160 1560" stroke={T.balokHuruf} strokeWidth={8} fill="none" />
  </g>
  );
};

const LayarSoal: React.FC<{ f: number; redup: number; pesta: number }> = ({ f, redup, pesta }) => {
  // soal 1–3 berganti 8 frame setelah tiap ketukan benar; bintang besar di "star pops up"; soal 4 masuk di "If"
  const tigaSelesai = f >= KETUK[2].f + 8;
  const bintangBesar = tigaSelesai && f < F_SOAL4;
  let q = 0;
  if (f >= KETUK[0].f + 8) q = 1;
  if (f >= KETUK[1].f + 8) q = 2;
  if (f >= F_SOAL4) q = 3;
  const soal = SOAL[q];
  const masukDari = q === 0 ? -99 : q === 3 ? F_SOAL4 : KETUK[q - 1].f + 8;
  const masuk = interpolate(f, [masukDari, masukDari + 6], [1, 0], { ...cl, easing: Easing.out(Easing.cubic) });
  const ketukSoal = KETUK.filter((k) => k.q === q && f >= k.f);
  const terakhir = ketukSoal[ketukSoal.length - 1];
  const salah = q === 3 && f >= KETUK[3].f && f < KETUK[4].f;
  const benarAkhir = q === 3 && f >= KETUK[4].hasil;
  const benarCepat = q < 3 && !!terakhir && f < terakhir.f + 8;
  const getar = salah ? Math.sin(f * 2.4) * 10 * Math.exp(-(f - KETUK[3].f) / 8) : 0;
  const jt = KETUK.filter((k) => k.ok && f >= k.hasil).length;
  const skor = 120 + jt * 10 + Math.round(pesta * 240);
  return (
    <g>
      <clipPath id="layarHP">
        <rect x={290} y={580} width={500} height={800} rx={34} />
      </clipPath>
      <g clipPath="url(#layarHP)">
        <rect x={290} y={580} width={500} height={800} fill={salah ? "#FFE3E3" : "#FFF6E5"} />
        <rect x={290} y={580} width={500} height={80} fill="#FFD66B" />
        <path d={bintangPath(335, 620, 22, 9)} fill="#FF9F1C" />
        <text x={366} y={634} fontFamily="Fredoka" fontWeight={700} fontSize={38} fill={W.navy}>{skor}</text>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${680 + i * 34} 636 c-14 -10 -22 -18 -14 -28 c6 -6 12 -4 14 2 c2 -6 8 -8 14 -2 c8 10 0 18 -14 28z`} fill={salah && i === 2 ? "#C9C3D9" : W.merah} />
        ))}
        {!bintangBesar && (
          <g transform={`translate(${masuk * 520 + getar} 0)`}>
            <rect x={318} y={690} width={444} height={220} rx={28} fill="#fff" />
            <text x={540} y={830} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={104} fill={W.navy}>{soal.q} = ?</text>
            {TOMBOL.map((b, i) => {
              const ketuk = ketukSoal.find((k) => k.btn === i);
              const tekan = ketuk ? 1 - 0.08 * Math.max(0, 1 - (f - ketuk.f) / 3) : 1;
              const hijau = !!ketuk && ketuk.ok && f >= ketuk.hasil;
              const merah = !!ketuk && !ketuk.ok;
              return (
                <g key={i} transform={`translate(${b.x + 105} ${b.y + 75}) scale(${tekan})`}>
                  <rect x={-105} y={-63} width={210} height={150} rx={30} fill="#000" opacity={0.12} />
                  <rect x={-105} y={-75} width={210} height={150} rx={30} fill={hijau ? "#2FB36B" : merah ? "#E23A3A" : b.c} opacity={merah && !salah ? 0.45 : 1} />
                  <text y={30} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={88} fill="#fff">{soal.opsi[i]}</text>
                  {hijau && <path d="M52 -60 l14 14 l26 -30" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
                  {merah && <path d="M60 -60 l26 26 m0 -26 l-26 26" stroke="#fff" strokeWidth={10} strokeLinecap="round" />}
                </g>
              );
            })}
            {salah && (
              <g transform={`translate(540 795) scale(${pop(f, KETUK[3].f, 5)}) rotate(-6)`}>
                <rect x={-210} y={-62} width={420} height={110} rx={30} fill="#E23A3A" />
                <text y={18} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={68} fill="#fff">COBA LAGI</text>
              </g>
            )}
            {(benarCepat || benarAkhir) && (
              <g transform={`translate(540 795) scale(${pop(f, benarAkhir ? KETUK[4].hasil : terakhir!.f, 5)}) rotate(-6)`}>
                <rect x={-200} y={-62} width={400} height={110} rx={30} fill="#2FB36B" />
                <text y={18} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={72} fill="#fff">BENAR!</text>
              </g>
            )}
          </g>
        )}
        {bintangBesar && (
          <g transform={`translate(540 960) scale(${pop(f, KETUK[2].f + 8, 9)})`}>
            <path d={bintangPath(0, -60, 150, 64)} fill="#FFB800" />
            <path d={bintangPath(-6, -66, 128, 54)} fill={W.kuning} />
            <text y={190} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={70} fill={W.navy}>+1 BINTANG!</text>
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
// jari asli (aset video sebelumnya) diputar 180° → tangan datang dari bawah, telunjuk ke atas; ujung telunjuk di (x,y)
const JariAsli: React.FC<{ x: number; y: number; angkat: number }> = ({ x, y, angkat }) => {
  const s = 0.62 * (1 + angkat * 0.05);
  return (
    <g>
      <ellipse cx={x + 14 + angkat * 30} cy={y + 18 + angkat * 36} rx={24} ry={16} fill="#000" opacity={0.16 * (1 - angkat * 0.5)} />
      <g transform={`translate(${x} ${y}) rotate(180) scale(${s}) translate(-217 -790)`}>
        <image href={staticFile("v7/asli/jari.png")} width={641} height={829} />
      </g>
    </g>
  );
};
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

export const SceneAnak: React.FC<{ dari: number; beku?: number }> = ({ dari, beku }) => {
  const P = usePasangan();
  const fAsli = useCurrentFrame() + dari;
  const f = beku ?? fAsli;
  const T = campur(P.tenang, P.intens, kAnak(f));
  // owner: cukup 3 soal supaya tidak terlalu cepat berganti (ketukan di "mengetuk", "tap" pertama, "tap" terakhir)
  const fBintang = cari("bintang").at, fPadahal = cari("padahal").at, fBelum = cari("belum").at;
  const akhir = cari("berpikir").akhir + 45;

  // jari: melayang di kanan bawah layar → turun ke jawaban yang benar tiap ketukan
  const istirahat = { x: 700, y: 1330 };
  let jari = { ...istirahat }, angkat = 1;
  KETUK.forEach((k) => {
    const d = f - k.f;
    if (d > -7 && d < 9) {
      const turun = d < 0 ? Easing.out(Easing.quad)((d + 7) / 7) : Math.max(0, 1 - d / 9);
      const p = pusat(k.btn);
      jari = { x: istirahat.x + (p.x - istirahat.x) * turun, y: istirahat.y + (p.y - istirahat.y) * turun };
      angkat = 1 - turun;
    }
  });

  const pesta = interpolate(f, [fBintang, fPadahal], [0, 1], cl);
  const kosong = interpolate(f, [fPadahal, fPadahal + 12], [0, 1], cl);
  const pikir = interpolate(f, [fBelum - 4, fBelum + 10], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.5)) });
  const zoom = 1 + lerp(f, dari, fPadahal, 0, 0.06) + lerp(f, fPadahal, akhir, 0, 0.08);
  const asal = "50% 52%";
  const kilatBenar = KETUK.filter((k) => k.ok).reduce((m, k) => Math.max(m, interpolate(f, [k.hasil, k.hasil + 2, k.hasil + 12], [0, 1, 0], cl)), 0);
  const kilatSalah = interpolate(f, [KETUK[3].f, KETUK[3].f + 2, KETUK[3].f + 14], [0, 1, 0], cl);

  return (
    <TemaCtx.Provider value={T}>
    <AbsoluteFill style={{ background: T.latarB }}>
      <Lapis id="rB1" zoom={zoom} k={0.6} asal={asal} style={{ filter: `brightness(${1 - kosong * 0.15}) contrast(0.9) blur(2.5px)` }}>
        <Latar />
      </Lapis>
      {/* cahaya layar yang jatuh ke sekitar HP (hijau sesaat saat BENAR) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 52% 36% at 50% 50%, ${kilatSalah > 0.05 ? `rgba(240,70,70,${0.5 * kilatSalah})` : kilatBenar > 0.05 ? `rgba(95,216,110,${0.5 * kilatBenar})` : T.cahayaB}, rgba(255,236,200,0) 72%)`,
          mixBlendMode: "screen",
        }}
      />
      <Lapis id="rB2" zoom={zoom} k={1} asal={asal} garis={T.garisFokus}>
        {/* HP tergeletak di pangkuan; bayangan di bawahnya */}
        <rect x={276} y={572} width={556} height={864} rx={58} fill="#000" opacity={0.18} />
        <rect x={262} y={548} width={556} height={864} rx={58} fill="#1E2230" />
        <rect x={270} y={556} width={540} height={848} rx={52} fill="none" stroke="#3A4058" strokeWidth={4} />
        <rect x={500} y={562} width={80} height={12} rx={6} fill="#0E1018" />
        <LayarSoal f={f} redup={kosong} pesta={pesta} />
      </Lapis>
      {/* owner: tangan punya garis tepi sendiri (bukan satu garis dengan HP) supaya terasa di depan HP */}
      <Lapis id="rB2j" zoom={zoom} k={1.05} asal={asal} garis={T.garisFokus}>
        <JariAsli x={jari.x} y={jari.y} angkat={angkat} />
      </Lapis>
      <Lapis id="rB3" zoom={zoom} k={1.1} asal={asal} garis={T.garisFokus} style={{ filter: `saturate(${1 - kosong * 0.85}) brightness(${1 - kosong * 0.25})`, opacity: 1 - kosong * 0.65 }}>
        <Hadiah f={f} />
      </Lapis>
      <Lapis id="rB4" zoom={zoom} k={1} asal={asal}>
        <GelembungPikir s={pikir} f={f} />
      </Lapis>
      {/* lapisan DEPAN tebal (owner: seperti video Bugar): boneka & ujung bantal — buram, di sudut, tidak menutupi HP */}
      <Lapis id="rB5" zoom={zoom} k={1.4} asal={asal} style={{ filter: `blur(7px) saturate(${1 - kosong * 0.6}) brightness(${1 - kosong * 0.2})` }}>
        <LapisDepanAnak f={f} />
      </Lapis>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 58% at 50% 52%, rgba(0,0,0,0) 58%, ${T.vinyetB} 100%)` }} />
    </AbsoluteFill>
    </TemaCtx.Provider>
  );
};

const LapisDepanAnak: React.FC<{ f: number }> = ({ f }) => {
  const T = useTema();
  const napas = Math.sin(f / 26) * 4;
  return (
    <g>
      {/* ujung bantal kiri bawah */}
      <path d={`M-60 1480 C120 ${1440 + napas} 230 1560 220 1720 C210 1860 120 1960 -60 1960Z`} fill={T.mobil} />
      <path d="M-60 1520 C90 1500 170 1580 170 1700" stroke="#FFFFFF" strokeWidth={10} fill="none" opacity={0.35} />
      {/* boneka beruang kanan bawah (kepala & telinga) */}
      <g transform={`translate(1010 1640) rotate(${-12 + napas * 0.3})`}>
        <circle cx={-90} cy={-150} r={58} fill={T.balok} />
        <circle cx={90} cy={-150} r={58} fill={T.balok} />
        <circle r={190} fill={T.balok} />
        <ellipse cy={50} rx={80} ry={62} fill={T.balokHuruf} opacity={0.5} />
      </g>
    </g>
  );
};
