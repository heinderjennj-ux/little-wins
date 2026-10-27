// Video penuh "Undersea Tunnel" (YouTube Shorts US): 26 adegan dari prototipe TW, dianimasikan mengikuti kata VO.
// Bahasa gerak (skill membuat-video-iklan-2d, efek-kamera.md):
//  - kamera keyframe di DALAM satu dunia (pan/tilt/zoom/pull-back), fade 12 frame ANTAR dunia, zoom-tembus hanya di breakthrough;
//  - momen intens = punch-in + palet malam (+ getar hanya saat kaget/benturan); momen hangat = tenang;
//  - tokoh = flipbook 4 frame AI + squash kecil saat ganti frame + napas; tidak ada adegan statis.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  AI, FrameCtx, gel, BingkaiKenangan, Batu, Darat, Defs, Dunia, F, Gali, INTENS, Istilah, KENANGAN, KepalaBor, Lapisan, Langit, LorongSamping, NAVY,
  Palet, Panah, Peta, RUTE_Y, Retak, Semburan, TBM, TERANG, Tulisan, Uang, W, H, X_KANAN, X_KIRI, acak, busur, gayaStroke, pita,
} from "./Prototipe";
import { DURASI, KATA, Kunci, fr, getar, iv, kamera, keluar, masuk, munculO, munculS } from "./waktu";

const MALAM: Palet = { ...INTENS, rumput: "#2A4A4E", rumputTua: "#1F3A40" };
const PANJANG = X_KANAN - X_KIRI;
const FADE = 12;

// ---------- tokoh hidup ----------
// jadwal = [frame, nomor frame AI]; squash kecil saat frame berganti, napas pelan selalu
type Jadwal = [number, number][];
const Flip: React.FC<{ f: number; n: string; jadwal: Jadwal; x: number; bawah: number; tinggi: number; flip?: boolean; filter?: string; bayang?: boolean }> = ({ f, n, jadwal, x, bawah, tinggi, flip, filter, bayang }) => {
  let k = jadwal[0][1];
  let t0 = -99;
  for (const [t, i] of jadwal) if (f >= t) { k = i; t0 = t; }
  const sq = 1 - 0.035 * Math.exp(-Math.max(0, f - t0) / 3) * (f >= t0 ? 1 : 0);
  const napas = 1 + 0.007 * Math.sin(f / 14 + x);
  const sy = sq * napas;
  return (
    <g transform={`translate(${x} ${bawah}) scale(${2 - sy} ${sy})`}>
      <AI n={`${n}-${k}`} x={0} bawah={0} tinggi={tinggi} flip={flip} filter={filter} bayang={bayang} />
    </g>
  );
};
// pose diam yang tetap hidup (napas + goyang kecil)
const Hidup: React.FC<{ f: number; n: string; x: number; bawah: number; tinggi: number; flip?: boolean; filter?: string; bayang?: boolean }> = ({ f, n, x, bawah, tinggi, flip, filter, bayang }) => {
  const napas = 1 + 0.008 * Math.sin(f / 13 + x);
  const rot = 0.6 * Math.sin(f / 31 + x);
  return (
    <g transform={`translate(${x} ${bawah}) rotate(${rot}) scale(${2 - napas} ${napas})`}>
      <AI n={n} x={0} bawah={0} tinggi={tinggi} flip={flip} filter={filter} bayang={bayang} />
    </g>
  );
};
// siklus frame (menggali, menimba, lompat): urutan berulang tiap `langkah` frame
const siklus = (a: number, b: number, langkah: number, urut = [1, 2, 3, 4]): Jadwal => {
  const j: Jadwal = [];
  for (let t = a, i = 0; t < b; t += langkah, i++) j.push([t, urut[i % urut.length]]);
  return j;
};

// ---------- teks layar ----------
const Muncul: React.FC<{ f: number; t: number; children: React.ReactNode; dari?: number }> = ({ f, t, children, dari = 0.9 }) =>
  f < t ? null : (
    <div style={{ position: "absolute", inset: 0, opacity: munculO(f, t), transform: `scale(${iv(f, t, t + 7, dari, 1, keluar)})`, transformOrigin: "50% 30%" }}>{children}</div>
  );

// subtitle: kelompok ≤3 kata, putus setelah tanda baca; kata aktif kuning (gaya video acuan, posisi zona skill)
type Kelompok = { a: number; b: number };
const KELOMPOK: Kelompok[] = (() => {
  const g: Kelompok[] = [];
  let a = 0;
  for (let i = 0; i < KATA.length; i++) {
    const akhir = /[.,!?:]$/.test(KATA[i].w) || i - a === 2 || i === KATA.length - 1 || KATA[i + 1].s - KATA[i].e > 0.35;
    if (akhir) { g.push({ a, b: i }); a = i + 1; }
  }
  return g;
})();
const Subtitle: React.FC<{ f: number }> = ({ f }) => {
  const t = f / 30;
  const k = KELOMPOK.find((g) => t >= KATA[g.a].s - 0.05 && t <= KATA[g.b].e + 0.25);
  if (!k) return null;
  const kata = KATA.slice(k.a, k.b + 1);
  return (
    <div style={{ position: "absolute", top: 1445, left: 30, right: 30, fontSize: 74, ...gayaStroke(11), textTransform: "uppercase" }}>
      {kata.map((w, i) => {
        const aktif = t >= w.s - 0.03;
        return (
          <span key={i} style={{ color: aktif ? "#FFFFFF" : "rgba(255,255,255,.55)" }}>
            {w.w.replace(/[.,!?:]$/, "")}
            {i < kata.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};

// label teks di dalam dunia SVG (ikut kamera), gaya sama dengan teks layar
const LabelDunia: React.FC<{ teks: string; x: number; y: number; ukuran: number; warna?: string; o?: number }> = ({ teks, x, y, ukuran, warna = "#FFFFFF", o = 1 }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={ukuran} fill={warna} stroke={NAVY} strokeWidth={ukuran * 0.16} paintOrder="stroke fill" strokeLinejoin="round" opacity={o}>
    {teks}
  </text>
);

// sudut retakan adegan grouting (derajat searah jarum jam dari atas); bukan di sisi kanan (zona tombol Shorts)
const RETAK_GROUT = [30, 150, 205, 250, 310];

// ---------- adegan ----------
type Adegan = {
  mulai: number; // indeks kata
  grup: string; // grup sama = sambung tanpa transisi
  P: Palet;
  tembus?: boolean; // masuk dengan zoom tembus (hanya momen besar)
  kamera?: (a: number, b: number) => Kunci[];
  kameraLangsung?: (f: number) => { cx: number; cy: number; s: number } | null; // menimpa keyframe pada frame tertentu
  gambar: (f: number, P: Palet, a: number, b: number) => React.ReactNode;
  teks?: (f: number, a: number, b: number) => React.ReactNode;
  peta?: (f: number) => Gali;
  bahaya?: (f: number) => boolean;
  istilah?: [string, number];
  bebasKiri?: boolean; // kamera boleh melewati tepi kiri dunia (adegan menggambar perpanjangan dunia sendiri)
};
const w = fr;
const dorong = (cx = 540, cy = 960, s0 = 1, s1 = 1.04) => (a: number, b: number): Kunci[] => [[a, cx, cy, s0], [b, cx, cy, s1]];

const ADEGAN: Adegan[] = [
  // ===== BABAK 1 =====
  {
    // hook: penggali → orang kaya misterius muncul & membuka koper → kaget
    mulai: 0, grup: "darat-hook", P: TERANG,
    kamera: (a) => [[a, 560, 1010, 1.22], [w(7), 560, 1010, 1.26], [w(8) + 8, 540, 980, 1.0], [w(11) + 10, 540, 980, 1.03]],
    gambar: (f, P) => {
      const xKaya = iv(f, w(7) - 6, w(8) + 6, -260, 300, keluar); // masuk dari kiri, menoleh ke kanan (ke pekerja)
      return (
        <>
          <Darat P={P} />
          <ellipse cx={540} cy={1010} rx={500} ry={430} fill={`url(#sorot${P.id})`} />
          <AI n="sumur" x={930} bawah={1330} tinggi={430} />
          <Flip f={f} n="kaget" jadwal={[[0, 1], [w(8), 2], [w(10), 3], [w(11) + 8, 4]]} x={iv(f, w(7) - 6, w(8) + 6, 540, 760, keluar)} bawah={1340} tinggi={720} flip={f >= w(8)} />
          <Flip f={f} n="orangkaya" jadwal={[[0, 1], [w(9) - 4, 2], [w(9) + 6, 3], [w(10) - 2, 4]]} x={xKaya} bawah={1345} tinggi={760} />
          {/* cahaya emas memancar dari mulut koper yang terbuka (di atas tokoh, mode screen), berdenyut halus */}
          {f >= w(9) + 6 && (
            <g style={{ mixBlendMode: "screen" }} opacity={iv(f, w(9) + 6, w(10), 0, 1) * (0.85 + 0.15 * Math.sin(f / 5))}>
              <ellipse cx={xKaya - 75} cy={860} rx={150} ry={95} fill="rgba(255,205,90,.55)" filter="url(#cahaya)" />
              <ellipse cx={xKaya - 75} cy={875} rx={85} ry={42} fill="rgba(255,240,180,.7)" filter="url(#cahaya)" />
            </g>
          )}
          {/* cahaya emas dari koper */}
          
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(9)}><Uang top={360} /></Muncul>,
  },
  {
    // jalan bawah laut 20 mil: pull-back dari tebing kiri, jalur tergambar kiri→kanan
    mulai: 12, grup: "dunia-awal", P: TERANG,
    kamera: (a) => [[a, 200, 760, 1.75], [w(17), 540, 960, 1.0], [w(20) + 20, 540, 960, 1.03]],
    gambar: (f, P) => {
      const p = iv(f, w(14), w(17) + 6, 0, 1);
      return (
        <>
          <Dunia P={P} />
          <clipPath id="jalurKlip"><rect x={X_KIRI} y={RUTE_Y - 20} width={PANJANG * p} height={40} /></clipPath>
          <line x1={X_KIRI} x2={X_KANAN} y1={RUTE_Y} y2={RUTE_Y} stroke="#FFFFFF" strokeWidth={10} strokeDasharray="28 20" clipPath="url(#jalurKlip)" />
          {f >= w(18) && (
            <g opacity={munculO(f, w(18))}>
              <Panah x1={540} y1={RUTE_Y - 80} x2={iv(f, w(18), w(19), 560, X_KANAN - 20, keluar)} y2={RUTE_Y - 80} w={12} warna={F.kuning} />
              <Panah x1={540} y1={RUTE_Y - 80} x2={iv(f, w(18), w(19), 520, X_KIRI + 20, keluar)} y2={RUTE_Y - 80} w={12} warna={F.kuning} />
            </g>
          )}
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(18)}><Tulisan teks="20 MILES" x={540} y={RUTE_Y - 200} ukuran={70} warna="#FFD23F" /></Muncul>,
    peta: () => ({ a: 0 }),
  },
  {
    // kontrak: dibayar hanya kalau selesai
    mulai: 21, grup: "kontrak", P: TERANG,
    kamera: dorong(540, 960, 1, 1.06),
    gambar: (f, P, a) => {
      const naik = iv(f, a, a + 12, 700, 0, keluar);
      const tanda = f >= w(28);
      const denyut = tanda ? 1 + 0.12 * Math.exp(-(f - w(28)) / 6) : 1;
      return (
        <>
          <Darat P={P} />
          <ellipse cx={540} cy={960} rx={460} ry={460} fill={`url(#sorot${P.id})`} />
          <g transform={`translate(0 ${naik}) rotate(${-4 + iv(f, a, a + 12, 6, 0)} 540 960)`} strokeLinejoin="round">
            <rect x={264} y={618} width={580} height={720} rx={20} fill="rgba(10,14,34,.25)" />
            <rect x={250} y={600} width={580} height={720} rx={20} fill="#FFFBF2" stroke={NAVY} strokeWidth={7} />
            <text x={540} y={690} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={58} fill={NAVY}>CONTRACT</text>
            {[750, 790, 830, 870].map((y) => <rect key={y} x={300} y={y} width={480 - (y % 3) * 40} height={14} rx={7} fill="#D7DCE8" />)}
            <text x={540} y={970} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={52} fill="#2BB765">$10,000,000,000</text>
            <g transform={`translate(335 1075) scale(${denyut}) translate(-335 -1075)`}>
              <rect x={300} y={1040} width={70} height={70} rx={10} fill="#FFFFFF" stroke={tanda ? F.merah : NAVY} strokeWidth={tanda ? 9 : 6} />
            </g>
            <text x={400} y={1092} fontFamily="Baloo2" fontWeight={800} fontSize={44} fill={tanda ? F.merah : NAVY}>TUNNEL FINISHED</text>
            <path d="M300 1200 Q360 1160 420 1200 T540 1196" stroke={NAVY} strokeWidth={5} fill="none" />
          </g>
        </>
      );
    },
  },
  {
    // hanya pernah gali sumur: penampang berdampingan SKALA NYATA (1 kaki = 30 px) — sumur 3 kaki vs terowongan 25 kaki,
    // tokoh ±6 kaki di permukaan sebagai patokan; kamera mulai dekat di sumur, mundur saat terowongan membesar di "wider"
    mulai: 29, grup: "skala", P: TERANG,
    kamera: (a, b) => [[a, 250, 600, 1.9], [w(35), 250, 610, 1.95], [w(36) + 12, 540, 1000, 1.02], [b, 540, 1000, 1.04]],
    gambar: (f, P) => {
      const t = iv(f, w(36) - 2, w(36) + 12, 0, 1, keluar);
      const PERMUKAAN = 600;
      return (
        <>
          <g filter="url(#buram)">
            <Langit P={P} bawah={PERMUKAAN + 20} />
            <path d={pita(PERMUKAAN + 30, 10, 2)} fill={P.kapur} />
            <path d={pita(900, 14, -4)} fill={P.marl} />
            <path d={gel(900, 14, -4)} stroke={P.kapurGaris} strokeWidth={6} fill="none" />
            {[980, 1080, 1180, 1280].map((y, k) => <path key={y} d={gel(y, 12, k * 3)} stroke={P.marlGaris} strokeWidth={4} fill="none" />)}
            <path d={pita(1420, 16, 4)} fill={P.lempung} />
            {Array.from({ length: 22 }).map((_, k) => <ellipse key={k} cx={acak(k) * W} cy={680 + acak(k + 40) * 820} rx={7 + acak(k + 5) * 10} ry={5 + acak(k + 6) * 4} fill={P.flint} opacity={0.6} />)}
          </g>
          <rect y={PERMUKAAN - 22} width={W} height={26} fill={P.rumput} />
          <rect y={PERMUKAAN} width={W} height={8} fill={P.rumputTua} />
          {/* sumur tampak potong: 3 kaki = 90 px, dinding batu, air di dasar */}
          <rect x={140} y={PERMUKAAN} width={90} height={760} fill={`url(#gLorong${P.id})`} stroke={NAVY} strokeWidth={5} />
          {Array.from({ length: 13 }).map((_, k) => (
            <g key={k}>
              <rect x={128} y={PERMUKAAN + 6 + k * 58} width={14} height={50} rx={5} fill={F.baja} stroke={NAVY} strokeWidth={3} />
              <rect x={228} y={PERMUKAAN + 6 + k * 58} width={14} height={50} rx={5} fill={F.baja} stroke={NAVY} strokeWidth={3} />
            </g>
          ))}
          <rect x={142} y={1290 + 4 * Math.sin(f / 9)} width={86} height={70 - 4 * Math.sin(f / 9)} fill="url(#gAir)" />
          <Hidup f={f} n="berdiri" x={330} bawah={PERMUKAAN + 4} tinggi={180} />
          {/* terowongan 25 kaki = 750 px, membesar dari tengah di "wider" */}
          {t > 0 && (
            <g transform={`translate(670 1050) scale(${t}) translate(-670 -1050)`}>
              <circle cx={670} cy={1050} r={375} fill="rgba(30,36,64,.55)" stroke="#FFFFFF" strokeWidth={12} strokeDasharray="34 24" />
              <Panah x1={670} y1={1050} x2={670} y2={690} w={10} warna="#FFFFFF" />
              <Panah x1={670} y1={1050} x2={670} y2={1410} w={10} warna="#FFFFFF" />
            </g>
          )}
          {/* ukuran sumur */}
          <g opacity={munculO(f, w(31))}>
            <line x1={140} x2={230} y1={PERMUKAAN - 60} y2={PERMUKAAN - 60} stroke="#FFFFFF" strokeWidth={5} />
            <line x1={140} x2={140} y1={PERMUKAAN - 74} y2={PERMUKAAN - 46} stroke="#FFFFFF" strokeWidth={5} />
            <line x1={230} x2={230} y1={PERMUKAAN - 74} y2={PERMUKAAN - 46} stroke="#FFFFFF" strokeWidth={5} />
          </g>
          <LabelDunia teks="YOUR WELL" x={185} y={PERMUKAAN - 108} ukuran={40} warna="#FFD23F" o={munculO(f, w(31))} />
          <LabelDunia teks="3 FT" x={185} y={PERMUKAAN - 74} ukuran={30} o={munculO(f, w(31))} />
          <LabelDunia teks="TUNNEL" x={670} y={1000} ukuran={64} o={munculO(f, w(36) + 10)} />
          <LabelDunia teks="25 FT" x={670} y={1080} ukuran={70} warna="#FFD23F" o={munculO(f, w(36) + 10)} />
        </>
      );
    },
  },
  {
    // mimpi mobil jet → janji "So here's how you get the money!" (punch-in + uang)
    mulai: 40, grup: "darat-mimpi", P: TERANG,
    kamera: (a) => [[a, 540, 980, 1.0], [w(48), 540, 980, 1.03], [w(49) + 5, 470, 1020, 1.14], [w(54) + 30, 470, 1020, 1.16]],
    gambar: (f, P) => {
      const gel = munculS(f, w(42));
      const xMobil = iv(f, w(45), w(47) + 6, 260, 640, keluar);
      const api = 1 + 0.15 * Math.sin(f * 1.7);
      return (
        <>
          <Darat P={P} />
          <ellipse cx={600} cy={880} rx={480} ry={320} fill={`url(#sorot${P.id})`} />
          {f >= w(41) && (
            <g stroke={NAVY} strokeWidth={6} opacity={munculO(f, w(41))}>
              <circle cx={250} cy={1180} r={17} fill="#FFFFFF" />
              {f >= w(41) + 4 && <circle cx={300} cy={1120} r={28} fill="#FFFFFF" />}
            </g>
          )}
          {f >= w(42) && (
            <g transform={`translate(620 860) scale(${gel}) translate(-620 -860)`} opacity={munculO(f, w(42))}>
              <ellipse cx={620} cy={860} rx={430} ry={220} fill="#FFFFFF" stroke={NAVY} strokeWidth={6} />
              <clipPath id="gelKlip"><ellipse cx={620} cy={860} rx={424} ry={214} /></clipPath>
              <g clipPath="url(#gelKlip)">
                <path d="M260 930 H980" stroke="#D7DCE8" strokeWidth={10} strokeLinecap="round" />
                {f >= w(45) && (
                  <g>
                    <ellipse cx={xMobil - 260} cy={935} rx={70 * api} ry={18} fill="rgba(255,190,80,.6)" filter="url(#cahaya)" />
                    <AI n="mobil-jet" x={xMobil} bawah={990} tinggi={250} bayang={false} />
                  </g>
                )}
              </g>
            </g>
          )}
          <Hidup f={f} n="melamun" x={230} bawah={1430} tinggi={640} />
        </>
      );
    },
    teks: (f) => (
      <Muncul f={f} t={w(53)} dari={1.3}>
        <Uang top={300} />
      </Muncul>
    ),
  },
  // ===== BABAK 2 =====
  {
    // sekop seumur hidup: siklus menggali, bar kemajuan hampir kosong
    mulai: 55, grup: "gali-sekop", P: TERANG,
    kamera: dorong(420, 1040, 1.12, 1.05),
    gambar: (f, P, a, b) => (
      <>
        <Batu P={P} benih={5} />
        <rect x={0} y={880} width={300} height={500} fill={`url(#gLorong${P.id})`} />
        <rect x={0} y={1380} width={300} height={10} fill={F.bajaTua} />
        <ellipse cx={220} cy={1100} rx={280} ry={320} fill={`url(#sorot${P.id})`} />
        {f >= w(57) &&
          Array.from({ length: 6 }).map((_, i) => {
            const t = ((f - w(57)) * 5 + i * 31) % 120;
            return <circle key={i} cx={330 + t * 1.6} cy={1260 - t * 2 + t * t * 0.022} r={9} fill={F.lumpur} opacity={1 - t / 120} />;
          })}
        <Flip f={f} n="menggali" jadwal={[[a, 1], ...siklus(w(57), b, 7)]} x={230} bawah={1390} tinggi={560} />
        {f >= w(60) && (
          <g stroke={NAVY} strokeWidth={6} opacity={munculO(f, w(60))}>
            <rect x={140} y={700} width={800} height={70} rx={35} fill="#FFFFFF" />
            <rect x={146} y={706} width={22 + iv(f, w(60), b, 0, 6)} height={58} rx={29} fill={F.oranye} strokeWidth={0} />
          </g>
        )}
      </>
    ),
    teks: (f) => <Muncul f={f} t={w(60)}><Tulisan teks="0%" x={540} y={600} ukuran={72} warna="#FFD23F" /></Muncul>,
    peta: () => ({ a: 0.002 }),
  },
  {
    // mesin bor: muncul membesar, mulai berputar di "spinning", serpihan lumpur di "grinds rock into mud"
    mulai: 68, grup: "bor-depan", P: TERANG,
    kamera: (a, b) => [[a, 540, 1010, 1.25], [w(73), 540, 1010, 1.0], [b, 540, 1010, 1.04]],
    gambar: (f, P) => {
      const s = iv(f, w(69), w(71), 0.4, 1, keluar);
      const sudut = f < w(73) ? 0 : (f - w(73)) * 3.2;
      return (
        <>
          <Batu P={P} benih={7} />
          <ellipse cx={540} cy={1010} rx={500} ry={500} fill={`url(#sorot${P.id})`} />
          <g transform={`translate(540 1010) scale(${s}) rotate(${sudut}) translate(-540 -1010)`}>
            <KepalaBor cx={540} cy={1010} r={330} />
          </g>
          {f >= w(73) &&
            [0.4, 2.5, 4.6].map((a0, i) => {
              const a1 = a0 + ((f - w(73)) * 3.2 * Math.PI) / 180;
              return <Panah key={i} x1={540 + 372 * Math.cos(a1)} y1={1010 + 372 * Math.sin(a1)} x2={540 + 372 * Math.cos(a1 + 0.8)} y2={1010 + 372 * Math.sin(a1 + 0.8)} w={14} warna="#FFFFFF" />;
            })}
          {f >= w(79) &&
            Array.from({ length: 18 }).map((_, i) => {
              const ang = acak(i) * Math.PI * 2;
              const d = ((f - w(79)) * 7 + i * 41) % 300;
              return <circle key={i} cx={540 + (370 + d) * Math.cos(ang)} cy={1010 + (370 + d) * Math.sin(ang)} r={8 + acak(i + 3) * 10} fill={i % 3 ? F.lumpur : "#8F9DBB"} opacity={1 - d / 300} />;
            })}
        </>
      );
    },
    istilah: ["Tunnel Boring Machine", 85],
    peta: () => ({ a: 0.05 }),
  },
  {
    // dinding runtuh: palet malam, getar di "walls", batu jatuh dengan gravitasi
    mulai: 90, grup: "runtuh", P: INTENS,
    kamera: (a, b) => [[a, 560, 1000, 1.0], [w(96), 560, 1000, 1.04], [w(96) + 5, 420, 960, 1.15], [b, 420, 960, 1.17]],
    gambar: (f, P) => {
      const batu: [number, number, number, number][] = [[170, 930, 48, 0], [330, 1040, 62, 3], [470, 950, 42, 6], [110, 1110, 36, 9], [560, 1100, 40, 12]];
      return (
        <>
          <Batu P={P} benih={9} />
          <rect x={0} y={860} width={720} height={300} fill={`url(#gLorong${P.id})`} />
          <ellipse cx={520} cy={980} rx={440} ry={340} fill={`url(#sorot${P.id})`} />
          <TBM x={iv(f, w(90), w(95), 980, 1010)} y={1010} s={1.05} />
          <Retak d="M80 860 L140 800 L120 740 L190 680" lebar={10} p={iv(f, w(94), w(96), 0, 1)} />
          <Retak d="M420 860 L460 790 L430 730" lebar={10} p={iv(f, w(94) + 3, w(96) + 3, 0, 1)} />
          <g stroke={NAVY} strokeWidth={6} strokeLinejoin="round">
            {batu.map(([x, yAkhir, r, tunda], i) => {
              const t0 = w(96) + tunda;
              if (f < t0) return null;
              const t = f - t0;
              const y = Math.min(yAkhir, 820 + 1.9 * t * t);
              const putar = Math.min(yAkhir, 820 + 1.9 * t * t) === yAkhir ? 18 : t * 3;
              return (
                <g key={i} transform={`rotate(${putar} ${x} ${y})`}>
                  <path d={`M${x - r} ${y} L${x - r * 0.3} ${y - r} L${x + r} ${y - r * 0.4} L${x + r * 0.6} ${y + r * 0.8} L${x - r * 0.5} ${y + r * 0.7} Z`} fill="#7D88AC" />
                </g>
              );
            })}
          </g>
          {f >= w(96) && Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={80 + acak(i) * 560} cy={840 + ((f - w(96)) * 9 + i * 50) % 300} r={4} fill="#C9D3E3" opacity={0.7} />)}
        </>
      );
    },
    peta: () => ({ a: 0.08 }),
  },
  {
    // cincin beton: lengan robot memasang 6 segmen satu per satu, lalu "ring after ring" = cincin berderet ke dalam
    mulai: 99, grup: "cincin", P: TERANG,
    kamera: (a, b) => [[a, 540, 1010, 1.12], [w(111), 540, 1010, 1.12], [w(113), 540, 1010, 1.0], [b, 540, 1010, 1.03]],
    gambar: (f, P) => {
      const pasang = [w(101), w(103), w(105), w(108), w(110), w(111)];
      const urut = [4, 5, 0, 1, 2, 3];
      const n = pasang.filter((t) => f >= t).length;
      const aktif = Math.max(0, n - 1);
      const sAktif = urut[aktif];
      const sudutLengan = ((sAktif + 0.5) * 60) % 360;
      const deret = f >= w(112) ? Math.min(4, Math.floor((f - w(112)) / 5) + 1) : 0;
      return (
        <>
          <Batu P={P} benih={11} />
          <ellipse cx={540} cy={1010} rx={500} ry={500} fill={`url(#sorot${P.id})`} />
          <circle cx={540} cy={1010} r={360} fill={P.marlGaris} stroke={NAVY} strokeWidth={6} />
          <circle cx={540} cy={1010} r={290} fill={`url(#gLorong${P.id})`} />
          {/* cincin-cincin di belakang (kedalaman terowongan) */}
          {Array.from({ length: deret }).map((_, k) => {
            const r = 290 * Math.pow(0.78, k + 1);
            return (
              <g key={k} opacity={0.9 - k * 0.15}>
                {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={busur(540, 1010, r - 40 * Math.pow(0.78, k + 1), r, (i * Math.PI) / 3 + 0.03, ((i + 1) * Math.PI) / 3 - 0.03)} fill={F.betonTua} stroke={NAVY} strokeWidth={4} />)}
              </g>
            );
          })}
          {/* segmen terpasang */}
          {urut.slice(0, n).map((i, k) => {
            const t = pasang[k];
            const geser = iv(f, t, t + 7, 60, 0, keluar);
            const a0 = (i * Math.PI) / 3 + 0.03;
            const a1 = ((i + 1) * Math.PI) / 3 - 0.03;
            const m = (a0 + a1) / 2;
            return (
              <g key={i} transform={`translate(${-geser * Math.cos(m)} ${-geser * Math.sin(m)})`}>
                <path d={busur(540, 1010, 294, 350, a0, a1)} fill={F.beton} stroke={NAVY} strokeWidth={6} />
                <path d={busur(540, 1010, 294, 304, a0 + 0.02, a1 - 0.02)} fill={F.betonTua} />
              </g>
            );
          })}
          {/* lengan robot berputar ke segmen yang sedang dipasang */}
          {f < w(112) && (
            <g transform={`rotate(${sudutLengan - 90 + 0 * f} 540 1010)`} stroke={NAVY} strokeWidth={6} strokeLinejoin="round">
              <rect x={520} y={790} width={40} height={220} rx={18} fill={F.kuning} />
              <rect x={500} y={770} width={80} height={36} rx={12} fill={F.kuningTua} />
            </g>
          )}
          <circle cx={540} cy={1010} r={50} fill={F.kuning} stroke={NAVY} strokeWidth={6} />
          <circle cx={540} cy={1010} r={20} fill={F.kuningTua} />
        </>
      );
    },
    istilah: ["Segment Lining", 117],
    peta: (f) => ({ a: iv(f, fr(99), fr(120), 0.1, 0.18) }),
  },
  {
    // 300 kaki di bawah laut: kamera tilt dari laut turun ke terowongan, garis kedalaman ikut memanjang, panah tekanan berdenyut
    mulai: 121, grup: "tekanan", P: INTENS,
    kamera: (a, b) => [[a, 540, 430, 1.6], [w(126), 540, 1060, 1.6], [w(128) + 4, 540, 980, 1.02], [b, 540, 1000, 1.05]],
    gambar: (f, P) => {
      const dalam = iv(f, w(121), w(126), 20, 1080);
      const denyut = f >= w(127) ? 14 * Math.sin((f - w(127)) / 4) : 0;
      return (
        <>
          <Batu P={P} laut={440} benih={13} />
          <ellipse cx={540} cy={1080} rx={420} ry={420} fill={`url(#sorot${P.id})`} />
          <circle cx={540} cy={1080} r={196} fill={`url(#gLorong${P.id})`} />
          <g>
            {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={busur(540, 1080, 192, 232, (i * Math.PI) / 3 + 0.03, ((i + 1) * Math.PI) / 3 - 0.03)} fill={F.beton} stroke={NAVY} strokeWidth={6} />)}
          </g>
          {f >= w(127) &&
            Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              const r1 = 375 - Math.max(0, denyut);
              return <g key={i} opacity={munculO(f, w(127) + i)}><Panah x1={540 + r1 * Math.cos(a)} y1={1080 + r1 * Math.sin(a)} x2={540 + (262 + Math.max(0, denyut) * 0.4) * Math.cos(a)} y2={1080 + (262 + Math.max(0, denyut) * 0.4) * Math.sin(a)} w={14} warna={F.air} /></g>;
            })}
          <g stroke="#FFFFFF" strokeWidth={5}>
            <line x1={110} x2={110} y1={20} y2={dalam} strokeDasharray="14 10" />
            <line x1={90} x2={130} y1={dalam} y2={dalam} />
          </g>
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(126)}><Tulisan teks="300 FT" x={190} y={1110} ukuran={58} warna="#FFD23F" /></Muncul>,
    peta: () => ({ a: 0.3 }),
  },
  {
    // grouting: beton cair mengisi celah melingkar, tetes air dicoret
    mulai: 132, grup: "grout", P: TERANG,
    kamera: dorong(540, 1060, 1.0, 1.06),
    gambar: (f, P) => {
      const isi = iv(f, w(134), w(139), 0, 1);
      const keliling = 2 * Math.PI * 362;
      return (
        <>
          <Batu P={P} laut={440} benih={15} />
          <ellipse cx={540} cy={1080} rx={460} ry={460} fill={`url(#sorot${P.id})`} />
          {/* celah kosong di belakang cincin = gelap; beton cair = putih terang + garis navy, mengalir searah jarum jam */}
          <circle cx={540} cy={1080} r={394} fill="#1E2440" stroke={NAVY} strokeWidth={6} />
          <circle cx={540} cy={1080} r={362} fill="none" stroke={NAVY} strokeWidth={70} strokeDasharray={`${keliling * isi} ${keliling}`} transform="rotate(-90 540 1080)" />
          <circle cx={540} cy={1080} r={362} fill="none" stroke="#F4F6FA" strokeWidth={58} strokeDasharray={`${keliling * isi} ${keliling}`} transform="rotate(-90 540 1080)" />
          <circle cx={540} cy={1080} r={372} fill="none" stroke="#FFFFFF" strokeWidth={10} strokeDasharray={`${keliling * isi} ${keliling}`} transform="rotate(-90 540 1080)" />
          {isi > 0 && isi < 1 && <circle cx={540 + 362 * Math.sin(isi * 2 * Math.PI)} cy={1080 - 362 * Math.cos(isi * 2 * Math.PI)} r={36 + 4 * Math.sin(f / 2)} fill="#FFFFFF" stroke={NAVY} strokeWidth={6} />}
          <circle cx={540} cy={1080} r={250} fill={`url(#gLorong${P.id})`} />
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={busur(540, 1080, 250, 330, (i * Math.PI) / 3 + 0.03, ((i + 1) * Math.PI) / 3 - 0.03)} fill={F.beton} stroke={NAVY} strokeWidth={6} />)}
          {f >= w(135) && <g opacity={munculO(f, w(135))}><Panah x1={540} y1={560} x2={540} y2={iv(f, w(135), w(135) + 8, 580, 668, keluar)} w={12} warna="#FFFFFF" /></g>}
          {/* retakan batu, air merembes masuk (garis cyan mengalir); terputus begitu beton cair melewati sudutnya */}
          {RETAK_GROUT.map((sd, k) => {
            const lewat = w(134) + ((w(139) - w(134)) * sd) / 360;
            const tersumbat = f >= lewat;
            const rad = (sd * Math.PI) / 180;
            const titik = (r: number, geser = 0) => `${540 + r * Math.sin(rad + geser)} ${1080 - r * Math.cos(rad + geser)}`;
            const d = `M${titik(600, 0.05)} L${titik(540, -0.04)} L${titik(480, 0.05)} L${titik(430, -0.03)} L${titik(394, 0)}`;
            const air = tersumbat ? iv(f, lewat, lewat + 10, 1, 0) : 1;
            const atas = sd > 270 || sd < 90;
            return (
              <g key={k}>
                <Retak d={d} lebar={13} />
                {air > 0 && <path d={d} stroke={F.air} strokeWidth={7} fill="none" strokeDasharray="16 12" strokeDashoffset={-f * 2.2} strokeLinecap="round" opacity={air} />}
                {!tersumbat && atas &&
                  Array.from({ length: 3 }).map((_, m) => {
                    const u = ((f + m * 13 + k * 7) % 40) / 40;
                    return <circle key={m} cx={540 + 250 * Math.sin(rad)} cy={1080 - 250 * Math.cos(rad) + u * 300} r={8} fill={F.air} stroke={NAVY} strokeWidth={3} opacity={1 - u} />;
                  })}
                {tersumbat && f < lewat + 10 && <circle cx={540 + 394 * Math.sin(rad)} cy={1080 - 394 * Math.cos(rad)} r={20 + (f - lewat) * 2} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={1 - (f - lewat) / 10} />}
              </g>
            );
          })}
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(135)}><Tulisan teks="CONCRETE" x={540} y={480} ukuran={50} /></Muncul>,
    istilah: ["Grouting", 146],
    peta: (f) => ({ a: iv(f, fr(132), fr(147), 0.32, 0.42) }),
  },
  {
    // KRISIS: retakan menjalar dari dasar laut ke muka bor, air menyembur di "blasts" (getar besar + punch-in)
    mulai: 148, grup: "krisis", P: INTENS,
    kamera: (a, b) => [[a, 540, 960, 1.02], [w(166), 440, 1000, 1.06], [w(167) + 4, 560, 1060, 1.22], [b, 560, 1060, 1.24]],
    gambar: (f, P) => {
      const semprot = f >= w(167) ? munculS(f, w(167)) * (1 + 0.06 * Math.sin(f * 1.3)) : 0;
      const lagi = f >= w(169) ? munculS(f, w(169)) * (1 + 0.06 * Math.sin(f * 1.1 + 1)) : 0;
      return (
        <>
          <Batu P={P} laut={420} benih={17} />
          <LorongSamping P={P} x0={0} x1={520} cy={1080} h={300} />
          <ellipse cx={460} cy={1060} rx={420} ry={380} fill={`url(#sorot${P.id})`} />
          <TBM x={iv(f, w(148), w(155), 460, 580)} y={1080} s={0.95} />
          <Retak d="M740 470 L700 600 L760 720 L690 860 L750 980 L660 1080" lebar={16} warna={F.air} p={iv(f, w(155), w(160) + 6, 0, 1)} />
          {semprot > 0 && <Semburan x={640} y={1000} arah={190} s={1.25 * semprot} />}
          {semprot > 0 && <Semburan x={660} y={1130} arah={170} s={1.0 * semprot} />}
          {lagi > 0 && <Semburan x={650} y={900} arah={205} s={0.9 * lagi} />}
          {lagi > 0 && <Semburan x={670} y={1200} arah={160} s={0.85 * lagi} />}
        </>
      );
    },
    peta: () => ({ a: 0.5 }),
    bahaya: (f) => f >= fr(157),
  },
  {
    // banjir: air naik, menimba panik, uang hitung mundur makin cepat sampai retak di "dollar"
    mulai: 174, grup: "banjir", P: INTENS,
    kamera: (a, b) => [[a, 540, 1060, 1.06], [b, 520, 1040, 1.12]],
    gambar: (f, P, a, b) => {
      const muka = iv(f, a, w(194), 1150, 1010);
      const riak = (x: number) => muka + 8 * Math.sin(x / 60 + f / 5);
      const pathAir = `M0 ${riak(0)} ` + Array.from({ length: 19 }).map((_, i) => `L${i * 60} ${riak(i * 60)}`).join(" ") + ` L1080 ${riak(1080)} L1080 1246 L0 1246 Z`;
      return (
        <>
          <Batu P={P} benih={19} />
          <LorongSamping P={P} x0={0} x1={1080} cy={1060} h={380} />
          <ellipse cx={420} cy={1000} rx={340} ry={300} fill={`url(#sorot${P.id})`} />
          <TBM x={1040} y={1060} s={0.9} />
          <g transform={`translate(${2 * Math.sin(f * 2.5)} 0)`}><AI n="pompa" x={720} bawah={1200} tinggi={150} bayang={false} /></g>
          <path d={pathAir} fill="url(#gAir)" opacity={0.92} />
          <Flip f={f} n="menimba" jadwal={siklus(a, b, 8)} x={330} bawah={1215} tinggi={520} bayang={false} />
          <rect x={0} y={Math.max(muka + 80, 1090)} width={1080} height={1246 - Math.max(muka + 80, 1090)} fill="url(#gAir)" opacity={0.55} />
          <path d={`M0 ${riak(0)} ` + Array.from({ length: 19 }).map((_, i) => `L${i * 60} ${riak(i * 60)}`).join(" ")} stroke={F.busa} strokeWidth={8} fill="none" />
        </>
      );
    },
    teks: (f) => {
      if (f < fr(181)) return null;
      const t = iv(f, fr(181), fr(194), 0, 1, masuk);
      return <Muncul f={f} t={fr(181)}><Uang top={420} merah sisa={Math.max(0.0001, 1 - t)} /></Muncul>;
    },
    peta: () => ({ a: 0.5 }),
    bahaya: () => true,
  },
  {
    // hampir menyerah: malam di sumur, cahaya bulan, kamera mendorong pelan
    mulai: 195, grup: "sumur-malam", P: MALAM,
    kamera: (a, b) => [[a, 560, 1060, 1.0], [b, 620, 1090, 1.09]],
    gambar: (f, P) => (
      <>
        <Darat P={P} />
        <ellipse cx={560} cy={1120} rx={420} ry={360} fill="url(#sorotBulan)" />
        <AI n="sumur" x={330} bawah={1350} tinggi={560} filter="malam" />
        <Flip f={f} n="ide" jadwal={[[0, 1], [fr(209), 2]]} x={770} bawah={1360} tinggi={500} filter="tokohMalam" />
      </>
    ),
  },
  {
    // teringat: sambung (tanpa transisi), kepala terangkat, cahaya hangat menyala
    mulai: 214, grup: "sumur-malam", P: MALAM,
    kamera: (a, b) => [[a, 620, 1090, 1.09], [w(217), 680, 1060, 1.18], [b, 680, 1060, 1.19]],
    gambar: (f, P) => (
      <>
        <Darat P={P} />
        <ellipse cx={560} cy={1120} rx={420} ry={360} fill="url(#sorotBulan)" />
        <ellipse cx={720} cy={1080} rx={460} ry={420} fill={`url(#sorot${P.id})`} opacity={iv(f, fr(216), fr(218), 0, 1)} />
        <AI n="sumur" x={330} bawah={1350} tinggi={560} filter="malam" />
        <Flip f={f} n="ide" jadwal={[[0, 2], [fr(216), 3], [fr(217), 4]]} x={770} bawah={1360} tinggi={500} filter={f >= fr(217) ? undefined : "tokohMalam"} />
      </>
    ),
  },
  {
    // kenangan (sepia): kamera turun menyusuri sumur, air menyembur di "burst"
    mulai: 218, grup: "kenangan", P: KENANGAN,
    kamera: (a) => [[a, 540, 640, 1.55], [w(223), 540, 1220, 1.55], [w(225) + 6, 540, 990, 1.0]],
    gambar: (f, P) => {
      const air = iv(f, w(224), w(226), 1436, 1260);
      const s = f >= w(224) ? munculS(f, w(224)) : 0;
      return (
        <>
          <SumurPotong P={P} />
          <rect x={436} y={air} width={208} height={1436 - air} fill="url(#gAir)" />
          {s > 0 && <Semburan x={660} y={1150} arah={175} s={0.8 * s * (1 + 0.06 * Math.sin(f * 1.4))} />}
          <ellipse cx={540} cy={1180} rx={220} ry={240} fill={`url(#sorot${P.id})`} />
          <Flip f={f} n="menimba" jadwal={[[0, 1], [w(224), 4]]} x={540} bawah={1300} tinggi={300} filter="kenangan" bayang={false} />
          <BingkaiKenangan />
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={fr(218)}><Tulisan teks="YEARS AGO" x={540} y={290} ukuran={72} warna="#FFFFFF" /></Muncul>,
  },
  {
    // kenangan: menuang lumpur (4 frame), lumpur mengisi dari dasar, panah mendorong air keluar, dinding terlapisi
    mulai: 227, grup: "kenangan", P: KENANGAN,
    kamera: (a, b) => [[a, 540, 990, 1.0], [b, 540, 960, 1.04]],
    gambar: (f, P) => {
      const isi = iv(f, w(231), w(236), 1436, 820);
      const aliran = f >= w(231) && f < w(245);
      const dorongX = iv(f, w(237), w(237) + 10, 0, 50, keluar);
      return (
        <>
          <SumurPotong P={P} />
          <rect x={436} y={iv(f, w(231), w(233), 1436, 1300)} width={208} height={1436 - iv(f, w(231), w(233), 1436, 1300)} fill="url(#gAir)" opacity={iv(f, w(234), w(236), 1, 0)} />
          <rect x={436} y={isi} width={208} height={1436 - isi} fill={F.lumpur} />
          {f >= w(233) && Array.from({ length: 14 }).map((_, i) => { const y = 860 + acak(i + 7) * 540; return y > isi ? <circle key={i} cx={460 + acak(i) * 160} cy={y} r={8 + acak(i + 2) * 10} fill={F.lumpurMuda} /> : null; })}
          {aliran && <rect x={436} y={540} width={44} height={Math.max(0, isi - 540)} rx={18} fill={F.lumpur} />}
          {f >= w(243) && (
            <g opacity={munculO(f, w(243))}>
              <rect x={420} y={820} width={16} height={616} fill={F.lumpurMuda} stroke={NAVY} strokeWidth={4} />
              <rect x={644} y={820} width={16} height={616} fill={F.lumpurMuda} stroke={NAVY} strokeWidth={4} />
            </g>
          )}
          {f >= w(237) && [900, 1060, 1220].map((y) => <Panah key={y} x1={660} y1={y} x2={700 + dorongX} y2={y} w={14} warna={F.lumpurMuda} />)}
          {f >= w(237) && [900, 1060, 1220].map((y) => <Panah key={`k${y}`} x1={420} y1={y} x2={380 - dorongX} y2={y} w={14} warna={F.lumpurMuda} />)}
          {f >= w(237) && [900, 1060, 1220].map((y) => <Panah key={`ka${y}`} x1={190 - dorongX * 0.4} y1={y + 30} x2={250 - dorongX} y2={y + 30} w={10} warna={F.air} />)}
          {f >= w(237) && [900, 1060, 1220].map((y) => <Panah key={`a${y}`} x1={830 + dorongX * 0.4} y1={y + 30} x2={770 + dorongX} y2={y + 30} w={10} warna={F.air} />)}
          <Flip f={f} n="menuang" jadwal={[[0, 1], [w(229), 2], [w(231), 3], [w(245), 4]]} x={410} bawah={548} tinggi={420} filter="kenangan" bayang={false} />
          <BingkaiKenangan />
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(232)}><Tulisan teks="CLAY MUD" x={540} y={1180} ukuran={50} warna="#FFE7B0" /></Muncul>,
  },
  {
    // slurry shield: ruang depan bor terisi lumpur, mendorong laut, retakan tersumbat dari bawah ke atas
    mulai: 249, grup: "slurry", P: TERANG,
    kamera: (a, b) => [[a, 480, 1000, 1.08], [w(278), 560, 900, 1.12], [b, 560, 900, 1.14]],
    gambar: (f, P) => {
      const isiRuang = iv(f, w(262), w(269), 0, 1, keluar);
      const sumbat = iv(f, w(278), w(280) + 8, 0, 1);
      const dorongX = iv(f, w(273), w(273) + 10, 0, 1, keluar);
      return (
        <>
          <Batu P={P} laut={420} benih={17} />
          <LorongSamping P={P} x0={0} x1={260} cy={1080} h={300} />
          <ellipse cx={480} cy={1060} rx={420} ry={380} fill={`url(#sorot${P.id})`} />
          <TBM x={520} y={1080} s={0.95} />
          {isiRuang > 0 && (
            <g transform={`translate(520 1080) scale(0.95) translate(0 ${-(1 - isiRuang) * 0})`}>
              <clipPath id="ruangKlip"><rect x={-25} y={100 - 200 * isiRuang} width={70} height={200 * isiRuang} /></clipPath>
              <path d="M-20 -82 L40 -100 L40 100 L-20 82 Z" fill={F.lumpur} stroke={NAVY} strokeWidth={5} clipPath="url(#ruangKlip)" />
            </g>
          )}
          <Retak d="M740 470 L700 600 L760 720 L690 860 L750 980 L640 1080" lebar={16} warna={F.air} />
          <Retak d="M640 1080 L750 980 L690 860 L760 720 L700 600 L740 470" lebar={16} warna={F.lumpur} p={sumbat} />
          {f >= w(278) && <circle cx={640} cy={1080} r={40 * munculS(f, w(278))} fill={F.lumpur} stroke={NAVY} strokeWidth={5} />}
          {f >= w(273) && [960, 1080, 1200].map((y) => <Panah key={y} x1={580} y1={y} x2={610 + 80 * dorongX} y2={y} w={14} warna={F.lumpurMuda} />)}
          {f >= w(274) && <Panah x1={760} y1={iv(f, w(274), w(276), 620, 600)} x2={760} y2={iv(f, w(274), w(276), 560, 480)} w={14} warna={F.air} />}
        </>
      );
    },
    istilah: ["Slurry Shield", 283],
    peta: () => ({ a: 0.5 }),
  },
  {
    // Tokyo Bay: mesin raksasa berputar, manusia kecil, panah tinggi 46 kaki tumbuh
    mulai: 287, grup: "tokyo", P: TERANG,
    kamera: (a, b) => [[a, 540, 1420, 3.2], [w(289), 540, 1410, 3.0], [w(293), 540, 1060, 1.02], [b, 540, 1050, 1.04]],
    gambar: (f, P) => {
      const tinggiPanah = iv(f, w(290), w(293), 1500, 640, keluar);
      return (
        <>
          <Batu P={P} laut={380} benih={23} />
          <ellipse cx={540} cy={1060} rx={520} ry={520} fill={`url(#sorot${P.id})`} />
          <g transform={`rotate(${f * 1.2} 540 1060)`}><KepalaBor cx={540} cy={1060} r={360} /></g>
          <Hidup f={f} n="berdiri" x={540} bawah={1480} tinggi={150} />
          {f >= w(290) && <Panah x1={150} y1={1500} x2={150} y2={tinggiPanah} w={10} warna="#FFFFFF" />}
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={fr(293)}><Tulisan teks="46 FT" x={150} y={560} ukuran={52} warna="#FFD23F" /></Muncul>,
  },
  // ===== BABAK 3 =====
  {
    // dua negara: kamera di ujung mesin kiri → pan ke pantai kanan saat mesin kedua mulai → mundur ke gambar utuh
    mulai: 299, grup: "dunia-dua", P: INTENS, // "in the dark": malam terus sampai breakthrough, pagi saat menang
    kamera: (a, b) => [[a, 560, 1180, 1.7], [w(306), 560, 1180, 1.7], [w(309) + 6, 880, 1120, 1.6], [w(313), 540, 960, 1.0], [b, 540, 960, 1.03]],
    gambar: (f, P, a, b) => <Dunia P={P} g={petaDua(f)} />,
    peta: (f) => petaDua(f),
  },
  {
    // meleset: palet malam, punch-in ke tengah, dua lubang saling lewat, tanda X
    mulai: 318, grup: "meleset", P: INTENS,
    kamera: (a, b) => [[a, 540, 1000, 1.0], [a + 6, 540, 1200, 1.25], [b, 540, 1200, 1.28]],
    gambar: (f, P, a) => {
      const g: Gali = { a: iv(f, a, fr(326), 0.55, 0.62), b: iv(f, a, fr(326), 0.3, 0.45), meleset: true, mesin: true };
      return (
        <>
          <Dunia P={P} g={g} />
          {f >= fr(327) && <g transform={`translate(540 1240) scale(${munculS(f, fr(327))}) translate(-540 -1240)`}><path d="M480 1180 L600 1300 M600 1180 L480 1300" stroke={F.merah} strokeWidth={22} strokeLinecap="round" /></g>}
        </>
      );
    },
    peta: (f) => ({ a: iv(f, fr(318), fr(326), 0.55, 0.62), b: iv(f, fr(318), fr(326), 0.3, 0.45), meleset: true }),
  },
  {
    // laser: garis merah tergambar dari kedua pantai, kamera mendorong ke tengah
    mulai: 330, grup: "laser", P: INTENS,
    kamera: (a, b) => [[a, 540, 960, 1.0], [b, 540, 1240, 1.35]],
    gambar: (f, P, a, b) => {
      const p = iv(f, w(331), w(333), 0, 1);
      const g: Gali = { a: iv(f, a, b, 0.58, 0.62), b: iv(f, a, b, 0.33, 0.37), mesin: true };
      return (
        <>
          <Dunia P={P} g={g} />
          <line x1={X_KIRI} x2={X_KIRI + (PANJANG / 2) * p} y1={RUTE_Y} y2={RUTE_Y} stroke={F.laser} strokeWidth={5} />
          <line x1={X_KANAN} x2={X_KANAN - (PANJANG / 2) * p} y1={RUTE_Y} y2={RUTE_Y} stroke={F.laser} strokeWidth={5} />
          {p >= 1 && <circle cx={540} cy={RUTE_Y} r={10 + 3 * Math.sin(f / 3)} fill={F.laser} />}
        </>
      );
    },
    peta: (f) => ({ a: iv(f, fr(330), fr(335), 0.58, 0.62), b: iv(f, fr(330), fr(335), 0.33, 0.37) }),
  },
  {
    // BREAKTHROUGH (zoom tembus): dua mesin mendekat, bertemu di "meet" — kilau + serpihan + getar
    mulai: 335, grup: "breakthrough", P: INTENS, tembus: true,
    kamera: (a, b) => [[a, 540, 1060, 1.15], [w(337), 540, 1060, 1.15], [w(337) + 5, 540, 1060, 1.25], [b, 540, 1060, 1.1]],
    gambar: (f, P, a) => {
      const kiri = iv(f, a, w(337), 330, 505, keluar);
      const kanan = iv(f, a, w(337), 750, 575, keluar);
      const temu = f >= w(337);
      const kilau = temu ? Math.exp(-(f - w(337)) / 14) : 0;
      return (
        <>
          <Batu P={P} benih={25} />
          <LorongSamping P={P} x0={0} x1={kiri - 120} cy={1060} h={260} />
          <LorongSamping P={P} x0={kanan + 120} x1={1080} cy={1060} h={260} />
          <ellipse cx={540} cy={1060} rx={300} ry={300} fill={`url(#sorot${P.id})`} />
          {temu && <ellipse cx={540} cy={1060} rx={100 + 120 * (1 - kilau)} ry={170 + 80 * (1 - kilau)} fill="#FFF3C4" opacity={0.4 + 0.6 * kilau} filter="url(#jauh)" />}
          <TBM x={kiri} y={1060} s={0.85} />
          <TBM x={kanan} y={1060} s={0.85} arah={-1} />
          {temu && Array.from({ length: 14 }).map((_, i) => {
            const t = f - w(337);
            const ang = acak(i + 5) * Math.PI * 2;
            const d = Math.min(260, t * (6 + acak(i) * 6));
            return <circle key={i} cx={540 + d * Math.cos(ang)} cy={1060 + d * Math.sin(ang) + 0.3 * t * t} r={8 + acak(i + 1) * 12} fill="#8F9DBB" stroke={NAVY} strokeWidth={4} opacity={Math.max(0, 1 - t / 40)} />;
          })}
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(340)}><Tulisan teks="< 2 FT" x={540} y={1250} ukuran={58} warna="#FFD23F" /></Muncul>,
    istilah: ["Breakthrough", 345],
    peta: () => ({ a: 0.62, b: 0.38 }),
  },
  {
    // menang: kamera dekat pada penggali yang melompat di tebing kiri (uang hijau di atas kepalanya);
    // di "jet-powered sports car" kamera turun ke terowongan dan mengikuti mobil jet yang melaju
    mulai: 348, grup: "dunia-akhir", P: TERANG, bebasKiri: true,
    kamera: (a) => [[a, 150, 470, 1.8], [w(356) - 4, 150, 480, 1.85], [w(357), mobilMenang(fr(357)), RUTE_Y, 2.4]],
    // mulai "jet-powered": kamera menempel pada mobil tiap frame, lalu zoom masuk sampai lorong memenuhi layar (siap match cut)
    kameraLangsung: (f) => (f < fr(357) ? null : { cx: mobilMenang(f), cy: RUTE_Y, s: iv(f, fr(358), fr(360) - 4, 2.4, 5.4, masuk) }),
    gambar: (f, P, a, b) => {
      const xMobil = mobilMenang(f);
      const sUang = f >= w(351) ? iv(f, w(351), w(351) + 8, 1.35, 1, keluar) : 0;
      return (
        <>
          <g filter="url(#buram)">
            <rect x={-700} y={0} width={760} height={630} fill={`url(#gLangit${P.id})`} />
            <rect x={-700} y={636} width={702} height={400} fill={P.tebing} />
            <rect x={-700} y={1030} width={702} height={130} fill={P.kapur} />
            <rect x={-700} y={1155} width={702} height={280} fill={P.marl} />
            <rect x={-700} y={1430} width={702} height={500} fill={P.lempung} />
          </g>
          <rect x={-700} y={606} width={702} height={34} fill={P.rumput} />
          <rect x={-700} y={632} width={702} height={10} fill={P.rumputTua} />
          <Dunia P={P} g={{ a: 1 }} />
          {f >= w(356) && (
            <g>
              <ellipse cx={xMobil - 70} cy={RUTE_Y + 6} rx={40 * (1 + 0.2 * Math.sin(f * 1.6))} ry={9} fill="rgba(255,190,80,.75)" filter="url(#cahaya)" />
              <AI n="mobil-jet" x={xMobil} bawah={RUTE_Y + 20} tinggi={42} bayang={false} />
            </g>
          )}
          <Flip f={f} n="lompat" jadwal={siklus(a, b, 6)} x={150} bawah={608} tinggi={210} bayang={false} />
          {sUang > 0 && (
            <g transform={`translate(150 372) scale(${sUang}) translate(-150 -372)`} opacity={munculO(f, w(351))}>
              <LabelDunia teks="$10,000,000,000" x={150} y={372} ukuran={40} warna={F.hijau} />
            </g>
          )}
        </>
      );
    },
    peta: () => ({ a: 1 }),
  },
  {
    // satu masalah: mesin tidak bisa mundur (maju-mundur tersendat, tanda X)
    mulai: 360, grup: "mundur", P: TERANG,
    kamera: (a, b) => [[a, 600, 1040, 1.2], [b, 560, 1040, 1.1]],
    gambar: (f, P) => {
      const coba = f >= w(366) ? -26 * Math.abs(Math.sin((f - w(366)) / 3)) * Math.exp(-(f - w(366)) / 30) : 0;
      return (
        <>
          <Batu P={P} benih={27} />
          <LorongSamping P={P} x0={0} x1={1080} cy={1040} h={300} />
          <ellipse cx={600} cy={1040} rx={400} ry={300} fill={`url(#sorot${P.id})`} />
          <TBM x={780 + coba} y={1040} s={1} />
          {f >= w(366) && (
            <g transform={`translate(260 1040) scale(${munculS(f, w(367))})`} opacity={munculO(f, w(366))}>
              <Panah x1={60} y1={0} x2={-80} y2={0} w={16} warna="#FFFFFF" />
              {f >= w(367) && <path d="M-60 -60 L40 60 M40 -60 L-60 60" stroke={F.merah} strokeWidth={18} strokeLinecap="round" />}
            </g>
          )}
        </>
      );
    },
    peta: () => ({ a: 1 }),
  },
  {
    // dikubur: mesin berbelok menukik dan menggali lubang miring SESUAI lintasannya (pita selebar mesin), kamera ikut turun
    mulai: 369, grup: "kubur", P: TERANG,
    kamera: (a, b) => [[a, 420, 860, 1.05], [w(371), 460, 860, 1.05], [w(375) + 6, 840, 1080, 1.15], [b, 860, 1110, 1.2]],
    gambar: (f, P) => {
      const E = { x: 560, y: 760 }; // titik belok (ujung mesin saat masih di lorong utama)
      const SUDUT = 40;
      const rad = (SUDUT * Math.PI) / 180;
      const t = iv(f, w(371), w(375) + 6, 0, 1);
      const miring = SUDUT * Math.min(1, t * 4);
      const d = 560 * t; // jarak ujung mesin di sepanjang lubang miring
      const tip = { x: E.x + d * Math.cos(rad), y: E.y + d * Math.sin(rad) };
      return (
        <>
          <Batu P={P} laut={300} benih={29} />
          <LorongSamping P={P} x0={0} x1={1080} cy={760} h={240} />
          {/* lubang hasil galian: mengikuti mesin, lebar = tinggi mesin + sela */}
          {t > 0 && (
            <g transform={`translate(${E.x} ${E.y}) rotate(${miring})`}>
              <rect x={-140} y={-92} width={140 + d + 24} height={184} rx={20} fill={`url(#gLorong${P.id})`} />
              <path d={`M-140 -92 H${d + 24} M-140 92 H${d + 24}`} stroke={P.marlGaris} strokeWidth={10} strokeDasharray="22 10" />
            </g>
          )}
          <ellipse cx={tip.x - 80} cy={tip.y} rx={300} ry={240} fill={`url(#sorot${P.id})`} opacity={0.4 + 0.6 * t} />
          <TBM x={tip.x} y={tip.y} s={0.75} miring={miring} />
          {f >= w(376) && Array.from({ length: 6 }).map((_, i) => {
            const u = ((f - w(376)) * 2 + i * 22) % 130;
            return <circle key={i} cx={tip.x - 60 + acak(i) * 80 + 6 * Math.sin(u / 8)} cy={tip.y - 40 - u * 2} r={6 + acak(i + 2) * 6} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={1 - u / 130} />;
          })}
        </>
      );
    },
    peta: () => ({ a: 1 }),
  },
];

// dunia dua sisi (adegan 20): mesin kiri lanjut sedikit, mesin kanan mulai di "both countries"
function petaDua(f: number): Gali {
  return { a: iv(f, fr(299), fr(304), 0.5, 0.55), b: iv(f, fr(308), fr(317), 0, 0.3), mesin: true };
}

// lubang sumur tampak potong (kenangan)
const SumurPotong: React.FC<{ P: Palet }> = ({ P }) => (
  <>
    <g filter="url(#buram)">
      <Langit P={P} bawah={560} />
      <path d={pita(540, 10, 2)} fill={P.rumput} />
      <Lapisan P={P} dasar={600} batasMarl={900} batasLempung={1300} benih={21} />
    </g>
    <rect x={430} y={540} width={220} height={900} fill={`url(#gLorong${P.id})`} stroke={NAVY} strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i}>
        <rect x={414} y={560 + i * 72} width={22} height={64} rx={6} fill={F.baja} stroke={NAVY} strokeWidth={4} />
        <rect x={644} y={560 + i * 72} width={22} height={64} rx={6} fill={F.baja} stroke={NAVY} strokeWidth={4} />
      </g>
    ))}
  </>
);

// mobil jet menang: mulai di "jet-powered", makin cepat menyeberang terowongan
function mobilMenang(f: number) {
  return iv(f, fr(357), fr(360) - 4, X_KIRI + 60, 540, masuk);
}

// ---------- perakit ----------
const MULAI = ADEGAN.map((a) => Math.max(0, fr(a.mulai) - 4));
const akhirAdegan = (i: number) => (i + 1 < ADEGAN.length ? MULAI[i + 1] : DURASI);

const Lapis: React.FC<{ i: number; f: number; opasitas?: number; skala?: number }> = ({ i, f, opasitas = 1, skala = 1 }) => {
  const a = ADEGAN[i];
  const t0 = MULAI[i];
  const t1 = akhirAdegan(i);
  const kunci = a.kamera ? a.kamera(t0, t1) : dorong()(t0, t1);
  const k = (a.kameraLangsung && a.kameraLangsung(f)) || kamera(f, kunci);
  // getar: kaget/benturan saja
  const gt = [getar(f, fr(10), 8), getar(f, fr(96), 14), getar(f, fr(167), 16, 24), getar(f, fr(194), 10), getar(f, fr(337), 12), getar(f, fr(54), 6, 12)].reduce((s, g) => ({ x: s.x + g.x, y: s.y + g.y }), { x: 0, y: 0 });
  // penjepit kamera: skala ≥1,02 (ruang untuk getar) dan pandangan tidak pernah keluar dari dunia 1080×1920
  const sk = Math.max(1.02, k.s);
  const cx = a.bebasKiri ? Math.min(W - 540 / sk - 12, k.cx) : Math.min(W - 540 / sk - 12, Math.max(540 / sk + 12, k.cx));
  const cy = Math.min(H - 960 / sk - 12, Math.max(960 / sk + 12, k.cy));
  const tf = `translate(${540 + gt.x} ${960 + gt.y}) scale(${sk * skala}) translate(${-cx} ${-cy})`;
  return (
    <AbsoluteFill style={{ opacity: opasitas, background: a.P.langitAtas }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <Defs P={a.P} />
        <FrameCtx.Provider value={f}>
          <g transform={tf}>{a.gambar(f, a.P, t0, t1)}</g>
        </FrameCtx.Provider>
        <rect width={W} height={H} fill={`url(#vinyet${a.P.id})`} />
      </svg>
      {a.teks && a.teks(f, t0, t1)}
      {a.istilah && f >= fr(a.istilah[1]) && (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${iv(f, fr(a.istilah[1]), fr(a.istilah[1]) + 8, 1.25, 1, keluar)})`, transformOrigin: "50% 16%", opacity: munculO(f, fr(a.istilah[1])) }}>
          <Istilah teks={a.istilah[0]} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- suara: SFX tepat di aksinya + musik (babak 1–2 ceria, krisis hening + dengung, harapan → akhir) ----------
type Bunyi = [number, string, number, number?]; // [frame, berkas, volume, lama maks (frame)]
const BUNYI: Bunyi[] = (() => {
  const b: Bunyi[] = [
    [fr(8) - 8, "whoosh-transisi", 0.45], [fr(9) - 2, "buka-kunci", 0.75], [fr(9) + 6, "kilau", 0.55], [fr(11) + 8, "dentang", 0.6],
    [fr(18), "kilau", 0.35], [fr(28), "salah", 0.45], [fr(35), "zoom-masuk", 0.45],
    [fr(42), "kilau", 0.3], [fr(45), "whoosh-transisi", 0.45], [fr(49), "dentum", 0.55], [fr(53), "kilau", 0.7],
    [fr(70), "zoom-masuk", 0.45], [fr(73), "bor", 0.6],
    [fr(96), "runtuh", 0.8], [fr(96), "dentum", 0.45],
    ...[101, 103, 105, 108, 110, 111].map((i): Bunyi => [fr(i) + 7, "klunk", 0.6]),
    ...[0, 1, 2, 3].map((k): Bunyi => [fr(112) + k * 5, "klunk", 0.3]),
    [fr(127), "sting-tegang", 0.45], [fr(134), "lumpur", 0.35], [fr(141), "klunk", 0.4],
    [fr(148), "dengung", 0.5, fr(195) - fr(148)],
    [fr(157), "runtuh", 0.35], [fr(167), "air", 0.9], [fr(167), "dentum", 0.65], [fr(169), "air", 0.6],
    [fr(181), "hitung", 0.55, fr(194) - fr(181)], [fr(194), "dentum", 0.6], [fr(194), "salah", 0.45],
    [fr(195), "jangkrik", 0.35, fr(218) - fr(195)], [fr(217), "ide", 0.7],
    [fr(224), "air", 0.5], [fr(229), "lumpur", 0.7], [fr(237), "whoosh-transisi", 0.3],
    [fr(262), "lumpur", 0.6], [fr(273), "whoosh-transisi", 0.35], [fr(278), "klunk", 0.6], [fr(279), "kilau", 0.45],
    [fr(287), "bor", 0.35], [fr(308), "zoom-masuk", 0.35], [fr(318), "sting-tegang", 0.45], [fr(327), "salah", 0.55],
    [fr(331), "laser", 0.7], [fr(335) - 8, "whoosh-transisi", 0.7], [fr(337), "tembus", 0.9], [fr(337), "dentum", 0.6], [fr(345), "kilau", 0.45],
    [fr(351), "kilau", 0.75], [fr(355), "whoosh-transisi", 0.6], [fr(366), "macet", 0.7], [fr(367), "salah", 0.45], [fr(371), "kubur", 0.8], [fr(376), "kilau", 0.25],
  ];
  // menimba banjir: cipratan tiap lemparan (frame 3 dari siklus 8 frame)
  for (let t = fr(174) - 4 + 16; t < fr(194); t += 32) b.push([t, "ciprat", 0.45]);
  // menggali: hentak sekop tiap siklus
  for (let t = fr(57) + 7; t < fr(68) - 4; t += 28) b.push([t, "klunk", 0.22]);
  return b;
})();

// musik turun otomatis saat narator bicara (ducking, saran BBC/Salford & Fraunhofer), naik di jeda antar kalimat
const DUCK: number[] = (() => {
  const target = Array.from({ length: DURASI }, (_, f) => {
    const t = f / 30;
    return KATA.some((k) => t >= k.s - 0.08 && t <= k.e + 0.12) ? 0.62 : 1;
  });
  const hasil: number[] = [];
  let v = 1;
  for (const x of target) {
    v += (x - v) * (x < v ? 0.35 : 0.08); // turun cepat, naik pelan
    hasil.push(v);
  }
  return hasil;
})();

// Lagu A (babak 1–2, 48 dtk) berhenti tepat saat krisis mulai (hening + dengung);
// Lagu B (50 dtk) ditempatkan supaya puncaknya (detik ke-34) jatuh tepat di "And they meet".
const AKHIR_A = fr(148) + 6;
const MULAI_B = fr(337) - 34 * 30;
// lagu B: 22 dtk awal lebih lembut (momen teringat), naik bertahap ke puncak di detik 34 (breakthrough), lalu penuh sampai menang
const BANGUN_B = (t: number) => (t < 22 * 30 ? 0.65 : t > 34 * 30 ? 1 : 0.65 + (0.35 * (t - 22 * 30)) / (12 * 30));
const Suara: React.FC = () => {
  return (
    <>
      <Audio src={staticFile("terowongan/audio/vo.wav")} />
      <Sequence durationInFrames={AKHIR_A}>
        <Audio src={`${staticFile("terowongan/audio/musik-a.wav")}?v=3`} volume={(t) => 0.42 * DUCK[t] * Math.min(1, t / 12) * Math.min(1, Math.max(0, (AKHIR_A - t) / 20))} />
      </Sequence>
      <Sequence from={MULAI_B} durationInFrames={DURASI - MULAI_B}>
        <Audio src={`${staticFile("terowongan/audio/musik-b.wav")}?v=3`} volume={(t) => 0.42 * DUCK[Math.min(DURASI - 1, MULAI_B + t)] * BANGUN_B(t) * Math.min(1, t / 45) * Math.min(1, Math.max(0, (DURASI - MULAI_B - t) / 45))} />
      </Sequence>
      {BUNYI.map(([t, n, v, maks], i) => (
        <Sequence key={i} from={Math.max(0, t)} durationInFrames={maks ?? 150}>
          <Audio src={`${staticFile(`terowongan/sfx/${n}.wav`)}?v=3`} volume={(u) => v * (maks ? Math.min(1, Math.max(0, (maks - u) / 10)) : 1)} />
        </Sequence>
      ))}
    </>
  );
};

export const DURASI_TW = DURASI;

export const AnimasiTW: React.FC = () => {
  const f = useCurrentFrame();
  let c = 0;
  for (let i = 0; i < ADEGAN.length; i++) if (f >= MULAI[i]) c = i;
  const a = ADEGAN[c];
  const sebelum = c > 0 ? ADEGAN[c - 1] : null;
  const t = f - MULAI[c];
  const transisi = sebelum && sebelum.grup !== a.grup && t < FADE;
  const peta = a.peta ? a.peta(f) : null;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {transisi && a.tembus ? (
        <>
          <Lapis i={c - 1} f={f} skala={iv(t, 0, FADE, 1, 1.6, masuk)} opasitas={iv(t, 0, FADE, 1, 0)} />
          <Lapis i={c} f={f} skala={iv(t, 0, FADE, 0.7, 1, keluar)} opasitas={iv(t, 0, FADE * 0.6, 0, 1)} />
        </>
      ) : transisi ? (
        <>
          <Lapis i={c - 1} f={f} />
          <Lapis i={c} f={f} opasitas={iv(t, 0, FADE, 0, 1)} />
        </>
      ) : (
        <Lapis i={c} f={f} />
      )}
      {peta && (
        <div style={{ position: "absolute", inset: 0, opacity: sebelum && !sebelum.peta ? iv(t, 0, 10, 0, 1) : 1 }}>
          <Peta g={peta} bahaya={a.bahaya ? a.bahaya(f) : false} />
        </div>
      )}
      <Subtitle f={f} />
      <Suara />
    </AbsoluteFill>
  );
};
