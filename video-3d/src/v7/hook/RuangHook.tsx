// Adegan 1–2: ruang kerja peneliti yang terang. Monitor menggulir aplikasi anak (hitung sampai 124),
// "Hasilnya?" = kaca pembesar diangkat, lalu kamera menyentak ke monitor: kebanyakan dicap nilai rendah.
import { noise2D } from "@remotion/noise";
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { cari, kRuang } from "./naskahHook";
import { Pose } from "../aset";
import { APPS, AppIcon } from "../aplikasi";
import { campur, TemaCtx, usePasangan, useTema } from "../../gaya/tema";
import { cl, Lapis, lerp, usePop, W } from "../../gaya/kit";

// ---------- latar: dinding, jendela pagi, rak buku, jam ----------
const Latar: React.FC<{ f: number }> = ({ f }) => {
  const T = useTema();
  const awan = (f * 0.6) % 500;
  const buku: { x: number; y: number; w: number; h: number; c: string }[] = [];
  const warna = T.buku;
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
      <rect width={1080} height={1920} fill={T.dinding} />
      {Array.from({ length: 13 }).map((_, i) => (
        <rect key={i} x={i * 90} y={0} width={38} height={1920} fill={T.garisDinding} />
      ))}
      {/* jendela pagi */}
      <g>
        <rect x={630} y={535} width={380} height={240} rx={14} fill={T.kusen} />
        <rect x={646} y={551} width={348} height={208} rx={6} fill={T.langit} />
        <rect x={646} y={680} width={348} height={79} fill={T.langitBawah} />
        <circle cx={930} cy={600} r={34} fill={T.matahari} />
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
        <rect x={814} y={551} width={12} height={208} fill={T.kusen} />
        <rect x={646} y={650} width={348} height={10} fill={T.kusen} />
        <path d="M612 520 Q640 650 616 790 L660 790 Q680 650 660 520Z" fill={T.tirai} />
        <path d="M1028 520 Q1000 650 1024 790 L980 790 Q960 650 980 520Z" fill={T.tirai} />
        <rect x={600} y={512} width={440} height={16} rx={8} fill={T.rel} />
      </g>
      {/* jam dinding berdetak */}
      <g transform="translate(565 640)">
        <circle r={52} fill={T.jamMuka} />
        <circle r={52} fill="none" stroke={T.jamGaris} strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={-2} y={-44} width={4} height={8} fill={T.jamGaris} transform={`rotate(${i * 30})`} />
        ))}
        <rect x={-3} y={-28} width={6} height={30} rx={3} fill={T.jamGaris} transform="rotate(300)" />
        <rect x={-2} y={-38} width={4} height={40} rx={2} fill={T.jarumDetik} transform={`rotate(${Math.floor(f / 30) * 6})`} />
        <circle r={5} fill={T.jamGaris} />
      </g>
      {/* rak buku */}
      <g>
        <rect x={40} y={560} width={210} height={640} rx={8} fill={T.rakLuar} />
        <rect x={52} y={572} width={186} height={616} fill={T.rakDalam} />
        {buku.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={3} fill={b.c} />
            <rect x={b.x + 3} y={b.y + 12} width={b.w - 6} height={5} fill="#fff" opacity={0.45} />
          </g>
        ))}
        {[0, 1, 2, 3].map((r) => (
          <rect key={r} x={46} y={688 + r * 125} width={198} height={12} fill={T.papanRak} />
        ))}
      </g>
    </g>
  );
};

export const SceneRuang: React.FC<{ beku?: number }> = ({ beku }) => {
  const P = usePasangan();
  const fAsli = useCurrentFrame();
  const f = beku ?? fAsli;
  const T = campur(P.tenang, P.intens, kRuang(f));
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


  const kotak = 62, jarak = 18, x0 = 663, y0 = 868;
  const cap = (i: number) => popLokal(f, fBanyak + 6 + i * 2);
  const stempel = usePop(fRendah - 2, 8);

  return (
    <TemaCtx.Provider value={T}>
    <AbsoluteFill style={{ background: T.latar, translate: `${getar}px ${getar * 0.4}px` }}>
      <Lapis id="rA1" zoom={zoom} k={0.3} asal={asal} style={{ filter: T.blurJauh }}>
        <g transform="translate(540 640) scale(1.15) translate(-540 -640)">
          <Latar f={f} />
        </g>
      </Lapis>
      <Lapis id="rA2" zoom={zoom} k={1} asal={asal} style={{ filter: T.blurDekat }}>
        <g transform="translate(480 640) scale(1.15) translate(-540 -640)">
        {/* meja */}
        <rect x={-100} y={1178} width={1280} height={44} fill={T.mejaAtas} />
        <rect x={-100} y={1218} width={1280} height={702} fill={T.mejaDepan} />
        {[1300, 1420, 1560, 1700, 1840].map((y, i) => (
          <path key={y} d={`M0 ${y} Q300 ${y + (i % 2 ? 14 : -10)} 600 ${y} T1080 ${y + 6}`} stroke={T.serat} strokeWidth={4} fill="none" opacity={0.7} />
        ))}
        <rect x={0} y={1218} width={1080} height={26} fill="#000" opacity={0.08} />
        {/* cangkir mengepul */}
        <g>
          <rect x={120} y={1100} width={84} height={90} rx={16} fill={T.cangkir} />
          <path d="M204 1120 q34 0 34 26 q0 26 -34 26" stroke={T.cangkir} strokeWidth={12} fill="none" />
          <rect x={120} y={1100} width={84} height={16} rx={8} fill={T.cangkirAtas} />
          {[0, 1, 2].map((i) => {
            const n = noise2D("uap", i, f / 40) * 14;
            const o = 0.5 + 0.4 * Math.sin(f / 9 + i * 2);
            return <path key={i} d={`M${140 + i * 22} 1088 q${n} -30 0 -60 q${-n} -30 0 -60`} stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" opacity={o} />;
          })}
        </g>
        {/* tumpukan kertas */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={238 + i * 6} y={1176 - i * 6} width={250} height={14} rx={3} fill={i === 2 ? T.kertas[0] : T.kertas[1]} transform={`rotate(${i - 1} 360 1180)`} />
        ))}
        </g>
      </Lapis>
      <Lapis id="rA3" zoom={zoom} k={1.35} asal={asal} style={{ filter: "blur(6px)" }}>
        <g transform="translate(480 640) scale(1.15) translate(-540 -640)">
        {/* tanaman di depan kanan bawah */}
        <g transform={`rotate(${Math.sin(f / 22) * 1.5} 1000 1330)`}>
          <path d="M1000 1330 C960 1220 930 1160 900 1120 C960 1150 1000 1220 1012 1300Z" fill={T.daun[0]} />
          <path d="M1010 1330 C1030 1210 1070 1150 1100 1110 C1090 1180 1060 1250 1030 1320Z" fill={T.daun[1]} />
          <path d="M1005 1330 C1000 1200 1010 1120 1030 1060 C1040 1140 1030 1240 1020 1330Z" fill={T.daun[2]} />
        </g>
        <path d="M940 1320 L1080 1320 L1080 1460 L960 1460Z" fill={T.pot} />
        <path d="M940 1320 L1080 1320 L1080 1345 L944 1345Z" fill="#E6E9EF" />
        </g>
      </Lapis>
            {/* cahaya hangat di belakang titik fokus */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 46% 30% at 52% 50%, ${T.cahaya}, rgba(255,214,150,0) 70%)`, mixBlendMode: "screen", scale: String(zoom) }} />
      <Lapis id="rA2f" zoom={zoom} k={1} asal={asal} garis={T.garisFokus}>
        <g transform="translate(480 640) scale(1.15) translate(-540 -640)">
        <Pose n={f >= fBanyak - 2 ? "p-kaget" : "p-kaca"} x={360} bawah={1300} tinggi={700} sq={1 + 0.012 * Math.sin(f / 16)} />
        {/* peneliti duduk DI BALIK meja: tepi & muka meja digambar di depannya */}
        <rect x={-100} y={1186} width={1280} height={36} fill={T.mejaAtas} />
        <rect x={-100} y={1218} width={1280} height={702} fill={T.mejaDepan} />
        <rect x={-100} y={1218} width={1280} height={22} fill="#000" opacity={0.06} />
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
                return <AppIcon key={i} app={APPS[(i + r * 3) % APPS.length]} x={x0 + c * (kotak + jarak)} y={y} s={kotak} />;
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
        </g>
      </Lapis>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 52%, rgba(0,0,0,0) 60%, ${T.vinyet} 100%)` }} />
    </AbsoluteFill>
    </TemaCtx.Provider>
  );
};

// hirarki visual (Itten hangat-dingin + kontras luas, perspektif udara): sekitar = biru pucat lembut, fokus = hangat & tajam

// pop tanpa hook (dipanggil di dalam map)
const popLokal = (f: number, mulai: number) => {
  const x = Math.max(0, Math.min(1, (f - mulai) / 6));
  if (x === 0) return 0;
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};
