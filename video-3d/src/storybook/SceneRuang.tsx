// Adegan 1–2: ruang kerja peneliti yang terang. Monitor menggulir aplikasi anak (hitung sampai 124),
// "Hasilnya?" = kaca pembesar diangkat, lalu kamera menyentak ke monitor: kebanyakan dicap nilai rendah.
import { noise2D } from "@remotion/noise";
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { cari } from "./naskah";
import { Blush, bintangPath, cl, Eye, Lapis, lerp, Mouth, usePop, useHidup, W } from "./kit";

const WARNA_APP = ["#FF5FA2", "#8E5BFF", "#3FBF8F", "#FFB020", "#2F80ED", "#FF7A59", "#00B8D9", "#E8455B", "#7CC242", "#B26BFF"];

const Ikon: React.FC<{ x: number; y: number; s: number; i: number }> = ({ x, y, s, i }) => {
  const c = WARNA_APP[i % WARNA_APP.length], cx = x + s / 2, cy = y + s / 2, g = i % 5;
  return (
    <g>
      <rect x={x} y={y} width={s} height={s} rx={s * 0.24} fill={c} />
      <rect x={x} y={y + s * 0.55} width={s} height={s * 0.45} rx={s * 0.24} fill="#000" opacity={0.08} />
      {g === 0 && <path d={bintangPath(cx, cy, s * 0.3, s * 0.13)} fill="#fff" />}
      {g === 1 && <circle cx={cx} cy={cy} r={s * 0.24} fill="#fff" />}
      {g === 2 && <path d={`M${cx - s * 0.22} ${cy + s * 0.2} L${cx} ${cy - s * 0.24} L${cx + s * 0.22} ${cy + s * 0.2}Z`} fill="#fff" />}
      {g === 3 && <path d={`M${cx} ${cy + s * 0.24} C${cx - s * 0.4} ${cy - s * 0.05} ${cx - s * 0.15} ${cy - s * 0.32} ${cx} ${cy - s * 0.1} C${cx + s * 0.15} ${cy - s * 0.32} ${cx + s * 0.4} ${cy - s * 0.05} ${cx} ${cy + s * 0.24}Z`} fill="#fff" />}
      {g === 4 && <rect x={cx - s * 0.2} y={cy - s * 0.2} width={s * 0.4} height={s * 0.4} rx={s * 0.08} fill="#fff" />}
    </g>
  );
};

// ---------- latar: dinding, jendela pagi, rak buku, jam ----------
const Latar: React.FC<{ f: number }> = ({ f }) => {
  const awan = (f * 0.6) % 500;
  const buku: { x: number; y: number; w: number; h: number; c: string }[] = [];
  const warna = ["#A7C1E6", "#7FA3D6", "#B5B9E8", "#8CC3CF", "#93AEDD", "#C4D6EE", "#6E92C8"];
  [0, 1, 2, 3].forEach((r) => {
    let x = 58;
    let i = r * 7;
    while (x < 232) {
      const w = 18 + ((i * 7) % 4) * 5, h = 80 + ((i * 13) % 4) * 10;
      buku.push({ x, y: 690 + r * 125 - h, w, h, c: warna[i % warna.length] });
      x += w + 3;
      i++;
    }
  });
  return (
    <g>
      <rect width={1080} height={1920} fill="#DCE8F5" />
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={i} x={i * 90} y={0} width={38} height={1920} fill="#D0E0F1" />
      ))}
      {/* jendela pagi */}
      <g>
        <rect x={630} y={535} width={380} height={240} rx={14} fill="#F2F7FD" />
        <rect x={646} y={551} width={348} height={208} rx={6} fill="#B8D8F2" />
        <rect x={646} y={680} width={348} height={79} fill="#CFE4F6" />
        <circle cx={930} cy={600} r={34} fill="#F4F8FC" />
        <circle cx={930} cy={600} r={48} fill="#FFFFFF" opacity={0.35} />
        {[0, 1].map((k) => {
          const x = 600 + ((awan + k * 250) % 500);
          return (
            <g key={k} opacity={0.95}>
              <ellipse cx={x} cy={630 + k * 40} rx={48} ry={18} fill="#fff" />
              <ellipse cx={x + 22} cy={618 + k * 40} rx={28} ry={20} fill="#fff" />
            </g>
          );
        })}
        <rect x={814} y={551} width={12} height={208} fill="#F2F7FD" />
        <rect x={646} y={650} width={348} height={10} fill="#F2F7FD" />
        <path d="M612 520 Q640 650 616 790 L660 790 Q680 650 660 520Z" fill="#9DB6DE" />
        <path d="M1028 520 Q1000 650 1024 790 L980 790 Q960 650 980 520Z" fill="#9DB6DE" />
        <rect x={600} y={512} width={440} height={16} rx={8} fill="#7F93BC" />
      </g>
      {/* jam dinding berdetak */}
      <g transform="translate(565 640)">
        <circle r={52} fill="#EEF4FB" />
        <circle r={52} fill="none" stroke="#6F85AE" strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={-2} y={-44} width={4} height={8} fill="#6F85AE" transform={`rotate(${i * 30})`} />
        ))}
        <rect x={-3} y={-28} width={6} height={30} rx={3} fill="#6F85AE" transform="rotate(300)" />
        <rect x={-2} y={-38} width={4} height={40} rx={2} fill="#8FA7D4" transform={`rotate(${Math.floor(f / 30) * 6})`} />
        <circle r={5} fill="#6F85AE" />
      </g>
      {/* rak buku */}
      <g>
        <rect x={40} y={560} width={210} height={640} rx={8} fill="#8396C0" />
        <rect x={52} y={572} width={186} height={616} fill="#6F83AE" />
        {buku.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={3} fill={b.c} />
            <rect x={b.x + 3} y={b.y + 12} width={b.w - 6} height={5} fill="#fff" opacity={0.45} />
          </g>
        ))}
        {[0, 1, 2, 3].map((r) => (
          <rect key={r} x={46} y={688 + r * 125} width={198} height={12} fill="#95A8CF" />
        ))}
      </g>
    </g>
  );
};

// ---------- peneliti: perempuan berkacamata, sanggul + pensil, jas lab ----------
const Peneliti: React.FC<{ f: number; alis: number; mulut: number; lirik: number; condong: number; kaca: { x: number; y: number; r: number } }> = ({ f, alis, mulut, lirik, condong, kaca }) => {
  const { napas, kedip } = useHidup(0);
  const hx = 390, hy = 880;
  const ny = napas * 0.6;
  return (
    <g>
      {/* rambut belakang + sanggul */}
      <g transform={`rotate(${condong} 390 1000) translate(0 ${ny})`}>
        <ellipse cx={hx} cy={hy - 6} rx={150} ry={158} fill={W.rambut} />
        <circle cx={hx + 10} cy={hy - 165} r={64} fill={W.rambut} />
        <g transform={`rotate(-38 ${hx + 10} ${hy - 165})`}>
          <rect x={hx - 40} y={hy - 172} width={92} height={13} rx={4} fill={W.kuning} />
          <rect x={hx - 52} y={hy - 172} width={14} height={13} rx={4} fill="#F39AA8" />
          <path d={`M${hx + 52} ${hy - 172} l18 6.5 l-18 6.5z`} fill="#F4D3A8" />
        </g>
      </g>
      {/* badan: jas lab */}
      <g transform={`translate(0 ${ny})`}>
        <path d="M222 1215 C222 1080 270 1008 390 1003 C510 1008 558 1080 558 1215Z" fill="#FBFCFF" />
        <path d="M430 1008 C510 1015 558 1080 558 1215 L470 1215 C478 1120 470 1050 430 1008Z" fill="#E2E8F2" />
        <path d="M352 1006 L390 1104 L428 1006Z" fill={W.mint} />
        <path d="M352 1006 L338 1035 L382 1110 L390 1104Z" fill="#E9EEF5" />
        <path d="M428 1006 L442 1035 L398 1110 L390 1104Z" fill="#DCE3EE" />
        <rect x={438} y={1080} width={62} height={52} rx={6} fill="#EEF2F8" />
        <rect x={448} y={1060} width={8} height={34} rx={3} fill={W.biru} />
        <rect x={462} y={1066} width={8} height={28} rx={3} fill={W.merah} />
        <rect x={282} y={1078} width={54} height={36} rx={6} fill={W.biru} />
        <rect x={290} y={1088} width={38} height={6} rx={3} fill="#fff" />
        <rect x={290} y={1100} width={24} height={5} rx={2} fill="#fff" opacity={0.7} />
        {[1045, 1135].map((y) => (
          <circle key={y} cx={392} cy={y + 30} r={6} fill="#C9D3E2" />
        ))}
      </g>
      {/* leher */}
      <rect x={366} y={950 + ny} width={48} height={70} rx={18} fill={W.kulitBayang} />
      {/* kepala */}
      <g transform={`rotate(${condong} 390 1000) translate(0 ${ny})`}>
        <ellipse cx={hx - 122} cy={hy + 10} rx={20} ry={28} fill={W.kulit} />
        <ellipse cx={hx + 122} cy={hy + 10} rx={20} ry={28} fill={W.kulitBayang} />
        <circle cx={hx - 124} cy={hy + 42} r={8} fill="#FFFDF5" />
        <circle cx={hx + 124} cy={hy + 42} r={8} fill="#FFFDF5" />
        <clipPath id="kepalaP">
          <ellipse cx={hx} cy={hy} rx={122} ry={132} />
        </clipPath>
        <ellipse cx={hx} cy={hy} rx={122} ry={132} fill={W.kulit} />
        <g clipPath="url(#kepalaP)">
          <ellipse cx={hx + 95} cy={hy + 30} rx={90} ry={150} fill={W.kulitBayang} opacity={0.45} />
          <ellipse cx={hx} cy={hy + 150} rx={140} ry={40} fill={W.kulitBayang} opacity={0.35} />
        </g>
        <path d={`M${hx - 116} ${hy - 30} Q${hx - 126} ${hy + 40} ${hx - 92} ${hy + 92}`} stroke="#FFF1DE" strokeWidth={6} fill="none" opacity={0.6} strokeLinecap="round" />
        {/* poni */}
        <path d={`M${hx - 124} ${hy - 10} C${hx - 128} ${hy - 120} ${hx - 50} ${hy - 150} ${hx + 10} ${hy - 146} C${hx + 90} ${hy - 140} ${hx + 132} ${hy - 90} ${hx + 124} ${hy - 6} C${hx + 100} ${hy - 70} ${hx + 50} ${hy - 92} ${hx + 10} ${hy - 80} C${hx - 40} ${hy - 96} ${hx - 96} ${hy - 70} ${hx - 124} ${hy - 10}Z`} fill={W.rambut} />
        <path d={`M${hx + 40} ${hy - 96} Q${hx + 74} ${hy - 50} ${hx + 60} ${hy - 4}`} stroke={W.rambut} strokeWidth={6} fill="none" strokeLinecap="round" />
        <path d={`M${hx - 60} ${hy - 128} Q${hx - 20} ${hy - 140} ${hx + 20} ${hy - 132}`} stroke="#5A3A2A" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
        {/* mata + kacamata */}
        <Eye x={hx - 46} y={hy + 16} r={27} open={kedip} look={lirik} iris="#6B4226" lash />
        <Eye x={hx + 50} y={hy + 16} r={27} open={kedip} look={lirik} iris="#6B4226" lash />
        {[-46, 50].map((dx) => (
          <rect key={dx} x={hx + dx - 44} y={hy - 22} width={88} height={76} rx={26} fill="#DDF0FF" fillOpacity={0.15} stroke="#3A2616" strokeWidth={6} />
        ))}
        <path d={`M${hx - 2} ${hy + 6} Q${hx + 2} ${hy - 4} ${hx + 6} ${hy + 6}`} stroke="#3A2616" strokeWidth={6} fill="none" />
        <path d={`M${hx + 22} ${hy - 12} l22 22`} stroke="#fff" strokeWidth={5} opacity={0.6} strokeLinecap="round" />
        {/* alis */}
        {[-46, 50].map((dx, i) => (
          <path key={dx} d={`M${hx + dx - 26} ${hy - 40 - alis * 10 + (i ? alis * 4 : -alis * 4)} Q${hx + dx} ${hy - 54 - alis * 14} ${hx + dx + 26} ${hy - 40 - alis * 10 - (i ? alis * 4 : -alis * 4)}`} stroke={W.rambut} strokeWidth={8} fill="none" strokeLinecap="round" />
        ))}
        <path d={`M${hx + 6} ${hy + 50} Q${hx + 14} ${hy + 64} ${hx + 2} ${hy + 68}`} stroke={W.kulitBayang} strokeWidth={5} fill="none" strokeLinecap="round" />
        <Blush x={hx - 70} y={hy + 70} r={24} />
        <Blush x={hx + 78} y={hy + 70} r={24} />
        <Mouth x={hx + 4} y={hy + 96} w={42} t={mulut} smile={0.8} />
      </g>
      {/* lengan + tangan */}
      <path d={`M262 1110 Q250 1170 300 1192`} stroke="#F1F4F9" strokeWidth={56} fill="none" strokeLinecap="round" />
      <ellipse cx={312} cy={1196} rx={30} ry={20} fill={W.kulit} />
      <path d={`M520 1110 Q${(520 + kaca.x) / 2 + 40} ${(1110 + kaca.y) / 2 + 60} ${kaca.x - 30} ${kaca.y + 70}`} stroke="#F1F4F9" strokeWidth={54} fill="none" strokeLinecap="round" />
      <ellipse cx={kaca.x - 26} cy={kaca.y + 74} rx={26} ry={22} fill={W.kulit} />
    </g>
  );
};

const KacaPembesar: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-10} y={56} width={20} height={80} rx={9} fill={W.navy} />
    <circle r={58} fill="#CFEAFF" opacity={0.35} />
    <circle r={58} fill="none" stroke="#E0A93B" strokeWidth={12} />
    <path d="M-30 -22 Q-20 -40 0 -44" stroke="#fff" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.85} />
  </g>
);

export const SceneRuang: React.FC = () => {
  const f = useCurrentFrame();
  const fHasil = cari("hasilnya").at, fBanyak = cari("kebanyakan").at, fRendah = cari("rendah").at;
  const fHitung = cari("seratus").at, fHitungAkhir = cari("aplikasi").akhir;

  // kamera: push-in pelan, lalu menyentak ke monitor saat "Kebanyakan"
  const pelan = 1 + lerp(f, 0, fBanyak, 0, 0.07);
  const sentak = interpolate(f, [fBanyak - 4, fBanyak + 8], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.2)) });
  const zoom = pelan + sentak * 0.1;
  const asal = "50% 55%";
  const getar = f >= fRendah && f < fRendah + 12 ? (1 - (f - fRendah) / 12) * 10 * Math.sin(f * 2.7) : 0;

  // monitor: daftar aplikasi menggulir, angka naik ke 124
  const angka = Math.round(lerp(f, fHitung, fHitungAkhir, 0, 124, Easing.out(Easing.cubic)));
  const gulir = interpolate(f, [0, fHasil], [0, 640], { ...cl, easing: Easing.inOut(Easing.quad) });

  // kaca pembesar: di meja → diangkat ke monitor saat "Hasilnya?"
  const angkat = interpolate(f, [fHasil - 6, fHasil + 10], [0, 1], { ...cl, easing: Easing.out(Easing.back(1.4)) });
  const kaca = { x: 560 + angkat * 210, y: 1150 - angkat * 190, r: -70 + angkat * 45 };
  const kacaTurun = interpolate(f, [fBanyak + 2, fBanyak + 12], [0, 1], cl);
  const k2 = { x: kaca.x - kacaTurun * 150, y: kaca.y + kacaTurun * 120, r: kaca.r - kacaTurun * 30 };

  const alis = interpolate(f, [fHasil - 4, fHasil + 6], [0, 1], cl) - interpolate(f, [fRendah, fRendah + 6], [0, 1.6], cl);
  const bicara = f > fHasil - 2 && f < fHasil + 10 ? 0.5 : 0;
  const mulut = f >= fRendah ? 0.55 : bicara;

  const kotak = 66, jarak = 14, x0 = 657, y0 = 870;
  const cap = (i: number) => popLokal(f, fBanyak + 6 + i * 2);
  const stempel = usePop(fRendah - 2, 8);

  return (
    <AbsoluteFill style={{ background: "#E4EEF8", translate: `${getar}px ${getar * 0.4}px` }}>
      <Lapis id="rA1" zoom={zoom} k={0.3} asal={asal} style={{ filter: REDAM_JAUH }}>
        <g transform="translate(540 640) scale(1.15) translate(-540 -640)">
          <Latar f={f} />
        </g>
      </Lapis>
      <Lapis id="rA2" zoom={zoom} k={1} asal={asal} style={{ filter: REDAM_DEKAT }}>
        <g transform="translate(480 640) scale(1.15) translate(-540 -640)">
        {/* meja */}
        <rect x={-100} y={1178} width={1280} height={44} fill="#C4D3EA" />
        <rect x={-100} y={1218} width={1280} height={702} fill="#AFC2E0" />
        {[1300, 1420, 1560, 1700, 1840].map((y, i) => (
          <path key={y} d={`M0 ${y} Q300 ${y + (i % 2 ? 14 : -10)} 600 ${y} T1080 ${y + 6}`} stroke="#9EB1D3" strokeWidth={4} fill="none" opacity={0.7} />
        ))}
        <rect x={0} y={1218} width={1080} height={26} fill="#000" opacity={0.08} />
        {/* cangkir mengepul */}
        <g>
          <rect x={120} y={1100} width={84} height={90} rx={16} fill="#9BB4E0" />
          <path d="M204 1120 q34 0 34 26 q0 26 -34 26" stroke="#9BB4E0" strokeWidth={12} fill="none" />
          <rect x={120} y={1100} width={84} height={16} rx={8} fill="#869FCF" />
          {[0, 1, 2].map((i) => {
            const n = noise2D("uap", i, f / 40) * 14;
            const o = 0.5 + 0.4 * Math.sin(f / 9 + i * 2);
            return <path key={i} d={`M${140 + i * 22} 1088 q${n} -30 0 -60 q${-n} -30 0 -60`} stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" opacity={o} />;
          })}
        </g>
        {/* tumpukan kertas */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={238 + i * 6} y={1176 - i * 6} width={250} height={14} rx={3} fill={i === 2 ? "#EEF3FA" : "#DDE6F3"} transform={`rotate(${i - 1} 360 1180)`} />
        ))}
        </g>
      </Lapis>
      <Lapis id="rA3" zoom={zoom} k={1.35} asal={asal} style={{ filter: "blur(6px)" }}>
        <g transform="translate(480 640) scale(1.15) translate(-540 -640)">
        {/* tanaman di depan kanan bawah */}
        <g transform={`rotate(${Math.sin(f / 22) * 1.5} 1000 1330)`}>
          <path d="M1000 1330 C960 1220 930 1160 900 1120 C960 1150 1000 1220 1012 1300Z" fill="#7FB5B8" />
          <path d="M1010 1330 C1030 1210 1070 1150 1100 1110 C1090 1180 1060 1250 1030 1320Z" fill="#6AA3AC" />
          <path d="M1005 1330 C1000 1200 1010 1120 1030 1060 C1040 1140 1030 1240 1020 1330Z" fill="#93C4C4" />
        </g>
        <path d="M940 1320 L1080 1320 L1080 1460 L960 1460Z" fill="#E4ECF6" />
        <path d="M940 1320 L1080 1320 L1080 1345 L944 1345Z" fill="#E6E9EF" />
        </g>
      </Lapis>
            {/* cahaya hangat di belakang titik fokus */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 46% 30% at 52% 50%, rgba(255,214,150,.55), rgba(255,214,150,0) 70%)", mixBlendMode: "screen", scale: String(zoom) }} />
      <Lapis id="rA2f" zoom={zoom} k={1} asal={asal} garis="#3A2A3E">
        <g transform="translate(480 640) scale(1.15) translate(-540 -640)">
        <Peneliti f={f} alis={alis} mulut={mulut} lirik={0.65} condong={angkat * 3 - sentak * 2} kaca={k2} />
        {/* monitor */}
        <g>
          <rect x={790} y={1110} width={44} height={62} fill="#9AA6B8" />
          <ellipse cx={812} cy={1178} rx={90} ry={14} fill="#8592A6" />
          <rect x={600} y={788} width={424} height={334} rx={24} fill={W.navy} />
          <clipPath id="layarM">
            <rect x={618} y={806} width={388} height={298} rx={10} />
          </clipPath>
          <g clipPath="url(#layarM)">
            <rect x={618} y={806} width={388} height={298} fill="#F4F8FF" />
            <g transform={`translate(0 ${-gulir})`}>
              {Array.from({ length: 48 }).map((_, i) => {
                const r = Math.floor(i / 4), c = i % 4;
                const y = y0 + r * (kotak + jarak);
                if (y - gulir > 1110 || y - gulir < 780) return null;
                return <Ikon key={i} x={x0 + c * (kotak + jarak)} y={y} s={kotak} i={i + r} />;
              })}
            </g>
            {/* cap nilai rendah per aplikasi */}
            {f >= fBanyak &&
              Array.from({ length: 12 }).map((_, i) => {
                if ([2, 7, 9].includes(i)) return null;
                const s = cap(i);
                const r = Math.floor(i / 4), c = i % 4;
                const visRow = Math.floor((y0 - 870 + 640) / (kotak + jarak));
                const y = y0 + (r + visRow) * (kotak + jarak) - gulir;
                const x = x0 + c * (kotak + jarak);
                return (
                  <g key={i} transform={`translate(${x + kotak - 8} ${y + 10}) scale(${s})`}>
                    <circle r={19} fill={W.merah} stroke="#fff" strokeWidth={4} />
                    <text y={8} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={24} fill="#fff">1</text>
                  </g>
                );
              })}
            <rect x={618} y={806} width={388} height={50} fill={W.biru} />
            <text x={636} y={840} fontFamily="Fredoka" fontWeight={600} fontSize={24} fill="#fff">Aplikasi Anak</text>
            <rect x={900} y={815} width={96} height={32} rx={16} fill={W.kuning} />
            <text x={948} y={840} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={26} fill={W.navy}>{angka}</text>
            {/* stempel besar NILAI RENDAH */}
            {f >= fRendah - 2 && (
              <g transform={`translate(812 965) rotate(-12) scale(${0.6 + 0.4 * stempel * (2 - stempel)})`} opacity={Math.min(1, stempel * 2)}>
                <rect x={-150} y={-44} width={300} height={88} rx={14} fill="#fff" fillOpacity={0.85} stroke={W.merah} strokeWidth={10} />
                <text y={16} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={46} fill={W.merah}>NILAI RENDAH</text>
              </g>
            )}
          </g>
          <circle cx={812} cy={1113} r={4} fill="#5B6B85" />
        </g>
        <KacaPembesar x={k2.x} y={k2.y} r={k2.r} />
        </g>
      </Lapis>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 60% at 50% 52%, rgba(70,100,150,0) 60%, rgba(70,100,150,.28) 100%)" }} />
    </AbsoluteFill>
  );
};

// hirarki visual (Itten hangat-dingin + kontras luas, perspektif udara): sekitar = biru pucat lembut, fokus = hangat & tajam
const REDAM_JAUH = "blur(2px)";
const REDAM_DEKAT = "blur(0.8px)";

// pop tanpa hook (dipanggil di dalam map)
const popLokal = (f: number, mulai: number) => {
  const x = Math.max(0, Math.min(1, (f - mulai) / 6));
  if (x === 0) return 0;
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};
