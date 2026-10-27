// Video penuh "Submarine" (YouTube Shorts US): adegan dari prototipe KS, dianimasikan mengikuti kata VO (kata.json, VO 1,10×).
// Bahasa gerak (skill membuat-video-iklan-2d, efek-kamera.md + prinsip Disney):
//  - kamera keyframe di DALAM satu dunia (pan/zoom), fade 12 frame ANTAR dunia, zoom-tembus hanya saat pipa pecah (masuk lewat kaca);
//  - tokoh = flipbook 4 frame AI + squash kecil saat ganti frame (squash & stretch) + napas; antisipasi sebelum aksi besar;
//  - slow in/out di semua gerak (easing), follow-through: kapal terayun lalu tenang, ikan/gelembung/partikel selalu bergerak;
//  - momen intens = punch-in + palet merah + getar hanya saat benturan; momen hangat = kamera tenang;
//  - satu titik fokus terang per adegan (detail lain diredam), zona kanan (tombol Shorts) bebas aksi penting.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { AI, Defs, F, FrameCtx, H, Istilah, NAVY, Palet, Panah, Retak, Tulisan, Uang, W, acak, gayaStroke } from "../terowongan/Prototipe";
import UKURAN from "../../public/kapalselam/ai/frame/ukuran.json";
import {
  AirDepan, Awak, Cakrawala, DALAM, DARURAT, DefsTriad, DekPerahu, DepanLaut, FAJAR, IkanGelembung, IkanLewat, KENANGAN_LAUT, KapalSelam,
  Kedalaman, LautBesar, PERMUKAAN, PerahuNelayan, RuangKapal, Sorot, T,
} from "./Prototipe";
import { DURASI, KATA, Kunci, fr, getar, iv, kamera, keluar, masuk, munculO, munculS } from "./waktu";

const FADE = 12;
const w = fr;

// ---------- gambar AI kapal selam (frame terpotong & sejajar di public/kapalselam/ai/frame) ----------
// s = satuan dunia per piksel lembar (ukuran tokoh tetap sama antar-lembar karena semua lembar 2K dengan skala tokoh serupa)
const UK = UKURAN as Record<string, number[]>;
const AIK: React.FC<{ n: string; x: number; bawah: number; s: number; flip?: boolean; filter?: string; bayang?: boolean; putar?: number; o?: number }> = ({ n, x, bawah, s, flip, filter, bayang = true, putar = 0, o = 1 }) => {
  const [lw, lh] = [UK[n][0] * s, UK[n][1] * s];
  return (
    <g transform={`translate(${x} ${bawah}) rotate(${putar}) scale(${flip ? -1 : 1} 1)`} opacity={o}>
      {bayang && <ellipse cx={0} cy={-4} rx={lw * 0.34} ry={Math.max(5, lh * 0.02)} fill="rgba(10,14,34,.28)" />}
      <image href={staticFile(`kapalselam/ai/frame/${n}.png`)} x={-lw / 2} y={-lh} width={lw} height={lh} filter={filter ? `url(#${filter})` : undefined} />
    </g>
  );
};
// jadwal = [frame, nomor frame AI]; squash kecil saat frame berganti, napas pelan selalu
type Jadwal = [number, number][];
const Flip: React.FC<{ f: number; n: string; jadwal: Jadwal; x: number; bawah: number; s: number; flip?: boolean; filter?: string; bayang?: boolean }> = ({ f, n, jadwal, x, bawah, s, flip, filter, bayang }) => {
  let k = jadwal[0][1];
  let t0 = -99;
  for (const [t, i] of jadwal) if (f >= t) { k = i; t0 = t; }
  const dt = f - t0;
  const sq = f >= t0 ? 1 - 0.09 * Math.exp(-dt / 4) * Math.cos(dt / 2.5) : 1; // tekan lalu memantul (squash → stretch)
  const napas = 1 + 0.018 * Math.sin(f / 12 + x);
  const sy = sq * napas;
  return (
    <g transform={`translate(${x} ${bawah}) scale(${2 - sy} ${sy})`}>
      <AIK n={`${n}-${k}`} x={0} bawah={0} s={s} flip={flip} filter={filter} bayang={bayang} />
    </g>
  );
};
// siklus frame berulang
const siklus = (a: number, b: number, langkah: number, urut = [1, 2, 3, 4]): Jadwal => {
  const j: Jadwal = [];
  for (let t = a, i = 0; t < b; t += langkah, i++) j.push([t, urut[i % urut.length]]);
  return j;
};

// ---------- benda hidup ----------
// partikel laut bergerak (laju + = naik relatif → kapal turun; laju − = turun relatif → kapal naik)
const Salju: React.FC<{ f: number; laju: number; n?: number; o?: number; panjang?: number }> = ({ f, laju, n = 46, o = 0.4, panjang = 0 }) => {
  const L = H * 1.3;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const v = 0.6 + acak(i) * 0.8;
        const y = ((((acak(i + 70) * L - f * laju * v) % L) + L) % L) - 150;
        const r = 1.5 + acak(i + 9) * 3;
        return panjang > 0 ? (
          <line key={i} x1={acak(i + 3) * W} x2={acak(i + 3) * W} y1={y} y2={y + panjang * Math.sign(laju || 1) * v} stroke="#FFFFFF" strokeWidth={r} strokeLinecap="round" opacity={o} />
        ) : (
          <circle key={i} cx={acak(i + 3) * W} cy={y} r={r} fill="#FFFFFF" opacity={o} />
        );
      })}
    </g>
  );
};
// gelembung naik berulang dari satu titik
const Gelembung: React.FC<{ f: number; x: number; y: number; n?: number; tinggi?: number; lebar?: number; laju?: number; t0?: number }> = ({ f, x, y, n = 10, tinggi = 360, lebar = 60, laju = 5, t0 = 0 }) =>
  f < t0 ? null : (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const p = (((f - t0) * laju + i * (tinggi / n)) % tinggi) / tinggi;
        return <circle key={i} cx={x + (acak(i) - 0.5) * lebar + 8 * Math.sin(f / 7 + i)} cy={y - p * tinggi} r={(6 + acak(i + 4) * 10) * (0.6 + p * 0.6)} fill="none" stroke="#DFF5FF" strokeWidth={3} opacity={(1 - p) * 0.9} />;
      })}
    </g>
  );

// ---------- teks layar ----------
const Muncul: React.FC<{ f: number; t: number; children: React.ReactNode; dari?: number }> = ({ f, t, children, dari = 0.9 }) =>
  f < t ? null : (
    <div style={{ position: "absolute", inset: 0, opacity: munculO(f, t), transform: `scale(${iv(f, t, t + 7, dari, 1, keluar)})`, transformOrigin: "50% 30%" }}>{children}</div>
  );
// subtitle: kelompok ≤3 kata, putus setelah tanda baca atau jeda
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
// 5 pilihan gaya subtitle (owner memilih; semua di zona subtitle skill, y ±1445):
//  1 satu-pop     : 1 kata besar, meletup (skala 1,3→1) tiap kata — gaya Shorts viral (Hormozi/MrBeast)
//  2 tiga-kuning  : ≤3 kata, kata yang diucapkan kuning + membesar (karaoke)
//  3 tiga-kotak   : ≤3 kata, kata yang diucapkan diberi kotak koral di belakangnya (gaya CapCut "highlight box")
//  4 tiga-muncul  : ≤3 kata, kata muncul satu per satu tepat saat diucapkan (bertambah), masing-masing meletup
//  5 satu-goyang  : 1 kata sangat besar, bergantian putih/kuning, sedikit miring & memantul
// Kata yang ditekankan di naskah (huruf kapital: FIVE, REALLY, HERE'S, ALL, LEAPS) selalu kuning.
export type GayaSub = "satu-pop" | "tiga-kuning" | "tiga-kotak" | "tiga-muncul" | "satu-goyang";
const bersih = (w: string) => w.replace(/\.\.\.$/, "").replace(/[.,!?:]$/, "");
const tekan = (w: string) => { const b = bersih(w).replace(/'S$/, ""); return b.length > 1 && b === b.toUpperCase() && /[A-Z]/.test(b) && b !== "CO2"; };
const KUNING = "#FFD23F";
const Subtitle: React.FC<{ f: number; gaya: GayaSub }> = ({ f, gaya }) => {
  const t = f / 30;
  if (gaya === "satu-pop" || gaya === "satu-goyang") {
    // kata aktif: dari mulai diucapkan sampai kata berikutnya mulai (hilang kalau jeda panjang)
    let i = -1;
    for (let j = 0; j < KATA.length; j++) if (t >= KATA[j].s - 0.04) i = j;
    if (i < 0 || t > KATA[i].e + 0.35) return null;
    const t0 = Math.round((KATA[i].s - 0.04) * 30);
    const pop = iv(f, t0, t0 + 5, 1.3, 1, keluar);
    const w = KATA[i].w;
    const goyang = gaya === "satu-goyang";
    const warna = tekan(w) || (goyang && i % 2 === 1) ? KUNING : "#FFFFFF";
    return (
      <div style={{ position: "absolute", top: goyang ? 1400 : 1420, left: 20, right: 20, fontSize: goyang ? 132 : 112, ...gayaStroke(goyang ? 15 : 13), textTransform: "uppercase", color: warna, transform: `scale(${pop}) rotate(${goyang ? (i % 2 ? 3 : -3) * pop : 0}deg)`, transformOrigin: "50% 60%" }}>
        {bersih(w)}
      </div>
    );
  }
  const k = KELOMPOK.find((g) => t >= KATA[g.a].s - 0.05 && t <= KATA[g.b].e + 0.25);
  if (!k) return null;
  const kata = KATA.slice(k.a, k.b + 1);
  return (
    <div style={{ position: "absolute", top: 1445, left: 30, right: 30, fontSize: 78, ...gayaStroke(11), textTransform: "uppercase" }}>
      {kata.map((x, i) => {
        const mulai = t >= x.s - 0.03;
        const aktif = mulai && (i === kata.length - 1 || t < kata[i + 1].s - 0.03);
        const t0 = Math.round((x.s - 0.03) * 30);
        const spasi = i < kata.length - 1 ? " " : "";
        if (gaya === "tiga-muncul") {
          if (!mulai) return null;
          return (
            <span key={i} style={{ display: "inline-block", transform: `scale(${iv(f, t0, t0 + 5, 1.35, 1, keluar)})`, color: tekan(x.w) ? KUNING : "#FFFFFF", marginRight: spasi ? 30 : 0 }}>
              {bersih(x.w)}
            </span>
          );
        }
        if (gaya === "tiga-kotak") {
          return (
            <span key={i} style={{ display: "inline-block", padding: "0 14px", margin: "0 4px", borderRadius: 18, background: aktif ? T.koral : "transparent", color: tekan(x.w) && !aktif ? KUNING : "#FFFFFF", transform: `scale(${aktif ? iv(f, t0, t0 + 4, 1.12, 1.04, keluar) : 1})` }}>
              {bersih(x.w)}
            </span>
          );
        }
        // tiga-kuning
        return (
          <span key={i} style={{ display: "inline-block", color: aktif || tekan(x.w) ? KUNING : mulai ? "#FFFFFF" : "rgba(255,255,255,.6)", transform: `scale(${aktif ? 1.12 : 1})`, marginRight: spasi ? 30 : 0 }}>
            {bersih(x.w)}
          </span>
        );
      })}
    </div>
  );
};

// ---------- adegan ----------
type Adegan = {
  mulai: number; // indeks kata
  grup: string; // grup sama = sambung tanpa transisi
  P: Palet;
  tembus?: boolean; // masuk dengan zoom tembus
  kamera?: (a: number, b: number) => Kunci[];
  kameraLangsung?: (f: number) => { cx: number; cy: number; s: number } | null;
  gambar: (f: number, P: Palet, a: number, b: number) => React.ReactNode;
  teks?: (f: number, a: number, b: number) => React.ReactNode;
  d?: (f: number) => number; // pengukur kedalaman
  bahaya?: (f: number) => boolean;
  istilah?: [string, number];
  bebas?: boolean; // kamera boleh keluar dari dunia 1080×1920 (adegan menggambar perpanjangan dunia sendiri)
};
const dorong = (cx = 540, cy = 960, s0 = 1.02, s1 = 1.06) => (a: number, b: number): Kunci[] => [[a, cx, cy, s0], [b, cx, cy, s1]];
// ayun perahu di air (tenang): naik-turun + miring
const ayun = (f: number, fase = 0, amp = 6) => ({ y: amp * Math.sin(f / 20 + fase), r: 1.4 * Math.sin(f / 26 + fase) });

// kurva KS03: kapal tenggelam lalu naik (bezier kubik)
const B3 = (p: number) => {
  const q = 1 - p;
  const x = q * q * q * 300 + 3 * q * q * p * 300 + 3 * q * p * p * 780 + p * p * p * 780;
  const y = q * q * q * 640 + 3 * q * q * p * 1300 + 3 * q * p * p * 1300 + p * p * p * 640;
  const dx = 3 * q * q * 0 + 6 * q * p * 480 + 3 * p * p * 0;
  const dy = 3 * q * q * 660 + 6 * q * p * 0 + 3 * p * p * -660;
  return { x, y, sudut: (Math.atan2(dy, dx) * 180) / Math.PI };
};

// posisi speedboat KS25 (melaju ke kanan; kamera terakhir mengikutinya)
const xBoat25 = (f: number) => iv(f, fr(432), fr(447) + 40, 600, 800, (t) => t);

const ADEGAN: Adegan[] = [
  // ===== BABAK 1 =====
  {
    // hook: perahu dari jauh → zoom ke nelayan DI ATAS DEK (bagian perahu tetap terlihat); menunjuk penonton di "problem"
    mulai: 0, grup: "hook", P: PERMUKAAN,
    kamera: (a, b) => [[a, 540, 960, 1.02], [w(4), 560, 930, 1.12], [w(7) + 4, 700, 830, 1.9], [b, 705, 828, 1.96]],
    gambar: (f, P) => {
      const g = ayun(f);
      return (
        <>
          <LautBesar P={P} permukaan={1080} siluet={false} />
          <Cakrawala y={1080} P={P} />
          <Sorot P={P} x={600} y={900} r={460} />
          <g transform={`translate(0 ${g.y}) rotate(${g.r} 540 1080)`}>
            <PerahuNelayan x={540} y={1080} s={1.4} />
            <Flip f={f} n="jelas" jadwal={[[0, 1], [w(3), 2], [w(5), 3], [w(7), 4]]} x={710} bawah={1080 - 56} s={0.44} flip={f < w(5)} />
          </g>
          <AirDepan P={P} y0={1080 + g.y * 0.4} />
          <DepanLaut P={P} />
        </>
      );
    },
  },
  {
    // tawaran: orang kaya masuk dari kiri di dek, membuka koper → nelayan kaget; uang muncul di "FIVE"
    mulai: 8, grup: "dek", P: PERMUKAAN,
    kamera: (a, b) => [[a, 540, 1000, 1.02], [w(12) - 2, 540, 1000, 1.04], [w(12) + 8, 580, 1000, 1.12], [b, 580, 1000, 1.14]],
    gambar: (f, P, a) => {
      const xKaya = iv(f, a, a + 16, -220, 310, keluar);
      return (
        <DekPerahu P={P}>
          <AI n={`orangkaya-${f < w(11) - 6 ? 1 : f < w(11) ? 2 : f < w(12) ? 3 : 4}`} x={xKaya} bawah={1330} tinggi={760} />
          {f >= w(11) && (
            <g style={{ mixBlendMode: "screen" }} opacity={iv(f, w(11), w(12), 0, 1) * (0.85 + 0.15 * Math.sin(f / 5))}>
              <ellipse cx={xKaya - 75} cy={850} rx={150} ry={95} fill="rgba(255,205,90,.55)" filter="url(#cahaya)" />
            </g>
          )}
          <Flip f={f} n="uang" jadwal={[[0, 1], [w(10), 2], [w(12), 3], [w(13) + 6, 4]]} x={770} bawah={1330} s={0.72} flip />
        </DekPerahu>
      );
    },
    teks: (f) => <Muncul f={f} t={w(12)}><Uang top={360} sisa={0.5} /></Muncul>,
  },
  {
    // kapal yang tenggelam lalu naik lagi: lintasan tergambar, kapal mengikuti
    mulai: 15, grup: "lintasan", P: PERMUKAAN,
    d: (f) => { const p = iv(f, w(18), w(24), 0, 1); return 0.32 * Math.sin(Math.PI * p); },
    gambar: (f, P) => {
      const p = iv(f, w(18), w(24) + 6, 0, 1);
      const k = B3(p);
      return (
        <>
          <LautBesar P={P} permukaan={560} dasar={1500} />
          <path d="M300 640 C300 1300, 780 1300, 780 640" stroke="#FFFFFF" strokeWidth={10} fill="none" strokeDasharray="30 22" opacity={munculO(f, w(16))} />
          {f >= w(20) && <g opacity={munculO(f, w(20))}><Panah x1={250} y1={720} x2={250} y2={1000} w={14} warna={T.kuning} /></g>}
          {f >= w(22) && <g opacity={munculO(f, w(22))}><Panah x1={830} y1={1000} x2={830} y2={720} w={14} warna={T.kuning} /></g>}
          <KapalSelam x={k.x} y={k.y} s={0.5} miring={k.sudut * 0.35} />
          <Gelembung f={f} x={k.x - 180} y={k.y} n={6} tinggi={200} t0={w(18)} />
          <DepanLaut P={P} />
        </>
      );
    },
  },
  {
    // kontrak: kertas naik, awak muncul satu-satu, kotak "ALL CREW RETURN" berdenyut merah
    mulai: 25, grup: "kontrak", P: PERMUKAAN,
    kamera: dorong(540, 960, 1.02, 1.08),
    gambar: (f, P, a) => {
      const naik = iv(f, a, a + 12, 700, 0, keluar);
      const tanda = f >= w(35);
      const denyut = tanda ? 1 + 0.15 * Math.exp(-(f - w(35)) / 6) : 1;
      return (
        <>
          <LautBesar P={P} permukaan={860} siluet={false} />
          <Sorot P={P} x={540} y={980} r={460} />
          <g transform={`translate(0 ${naik}) rotate(${-4 + iv(f, a, a + 12, 6, 0)} 540 980)`} strokeLinejoin="round">
            <rect x={264} y={638} width={580} height={680} rx={20} fill="rgba(10,14,34,.25)" />
            <rect x={250} y={620} width={580} height={680} rx={20} fill="#FFFBF2" stroke={NAVY} strokeWidth={7} />
            {[1180, 1210, 1240].map((y) => <line key={y} x1={300} x2={780} y1={y} y2={y} stroke="#D9D2C2" strokeWidth={4} />)}
            <text x={540} y={710} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={58} fill={NAVY}>CONTRACT</text>
            <text x={540} y={800} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={50} fill="#2BB765">$5,000,000,000</text>
            {[[410, w(31), "kupluk", "#9FD6EE"], [540, w(32), "topi", T.koral], [670, w(33), "headset", "#C9D3E3"]].map(([x, t, topi, baju], i) => {
              const sc = f < (t as number) ? 0 : iv(f, t as number, (t as number) + 8, 0.4, 1, keluar);
              return sc > 0 ? (
                <g key={i} transform={`translate(${x} 1050) scale(${sc}) translate(${-(x as number)} -1050)`}>
                  <Awak x={x as number} bawah={1050} t={i === 1 ? 1 : 0.95} topi={topi as "kupluk"} baju={baju as string} janggut={i === 1} pose={tanda ? "lambai" : "berdiri"} flip={i === 2} />
                </g>
              ) : null;
            })}
            <g transform={`translate(335 1115) scale(${denyut}) translate(-335 -1115)`}>
              <rect x={300} y={1080} width={70} height={70} rx={10} fill="#FFFFFF" stroke={T.koral} strokeWidth={9} />
              {tanda && <path d="M312 1112 L330 1134 L362 1090" stroke={T.koral} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
            </g>
            <text x={400} y={1132} fontFamily="Baloo2" fontWeight={800} fontSize={40} fill={T.koral}>ALL CREW RETURN</text>
          </g>
        </>
      );
    },
  },
  {
    // cuma pernah bikin perahu yang mengapung: perahu jauh→dekat bergoyang, panah naik
    mulai: 37, grup: "perahu", P: PERMUKAAN,
    kamera: dorong(540, 960, 1.02, 1.07),
    gambar: (f, P) => (
      <>
        <LautBesar P={P} permukaan={860} />
        <Cakrawala y={860} P={P} />
        <Sorot P={P} x={540} y={850} />
        <g filter="url(#jauh)" opacity={0.8} transform={`translate(0 ${ayun(f, 2, 3).y})`}><PerahuNelayan x={820} y={860} s={0.36} miring={3 + ayun(f, 2).r} /></g>
        <g filter="url(#buram)" transform={`translate(0 ${ayun(f, 4, 4).y})`}><PerahuNelayan x={250} y={860} s={0.5} miring={-4 + ayun(f, 4).r} /></g>
        <g transform={`translate(0 ${ayun(f, 0, 6).y})`}><PerahuNelayan x={560} y={860} s={0.78} miring={2 + ayun(f).r} /></g>
        <AirDepan P={P} y0={860} />
        {f >= w(45) && <g opacity={munculO(f, w(45))} transform={`translate(0 ${-10 * Math.sin(f / 8)})`}><Panah x1={560} y1={1060} x2={560} y2={940} w={12} warna="#FFFFFF" /></g>}
      </>
    ),
  },
  {
    // mimpi speedboat jet: gelembung pikiran tumbuh, speedboat melesat masuk (api berkedip); "So HERE'S how" punch-in
    mulai: 48, grup: "mimpi", P: PERMUKAAN,
    kamera: (a, b) => [[a, 540, 980, 1.02], [w(55) - 2, 540, 980, 1.05], [w(55) + 6, 470, 1020, 1.16], [b, 470, 1020, 1.18]],
    gambar: (f, P) => {
      const gb = munculS(f, w(50));
      const xBoat = iv(f, w(51), w(53) + 8, 330, 640, keluar);
      return (
        <>
          <LautBesar P={P} permukaan={920} siluet={false} />
          <Sorot P={P} x={620} y={760} r={460} />
          <g stroke={NAVY} strokeWidth={6} opacity={munculO(f, w(48) + 4)}>
            <circle cx={250} cy={1040} r={17 * munculS(f, w(48) + 4)} fill="#FFFFFF" />
            <circle cx={300} cy={980} r={28 * munculS(f, w(49))} fill="#FFFFFF" />
          </g>
          {f >= w(50) && (
            <g transform={`translate(620 720) scale(${gb}) translate(-620 -720)`} opacity={munculO(f, w(50))}>
              <ellipse cx={600} cy={730} rx={480} ry={260} fill="#FFFFFF" stroke={NAVY} strokeWidth={6} />
              <path d="M170 830 Q600 800 1030 830" stroke="#9FD6EE" strokeWidth={18} fill="none" strokeLinecap="round" />
              <AIK n={`boat-${f < w(51) ? 1 : 2 + (Math.floor(f / 3) % 3)}`} x={xBoat} bawah={840 + 5 * Math.sin(f / 6)} s={1.12} bayang={false} />
            </g>
          )}
          <Flip f={f} n="jelas" jadwal={[[0, 1], [w(50), 2], [w(55), 4]]} x={210} bawah={1420} s={0.75} />
        </>
      );
    },
  },
  // ===== BABAK 2 =====
  {
    // lelucon: nelayan di dermaga menekan perahunya ke bawah air → perahu melompat naik, dia terjengkang
    mulai: 62, grup: "dorong", P: PERMUKAAN,
    d: (f) => iv(f, w(65), w(69), 0, 0.03) * (f < w(73) ? 1 : iv(f, w(73), w(73) + 6, 1, 0)),
    kamera: (a, b) => [[a, 420, 860, 1.25], [w(73), 430, 860, 1.3], [b, 430, 860, 1.3]],
    gambar: (f, P) => {
      const tenggelam = iv(f, w(64), w(69), 0, 190);
      const pop = f < w(73) ? 0 : -150 * Math.exp(-(f - w(73)) / 7) * Math.cos((f - w(73)) / 4);
      const yPerahu = 760 + (f < w(73) ? tenggelam : iv(f, w(73), w(73) + 3, tenggelam, 0) + pop) + ayun(f).y;
      const g = getar(f, w(73), 10, 14);
      return (
        <g transform="translate(0 190)">
          <LautBesar P={P} permukaan={760} siluet={false} />
          <Cakrawala y={760} P={P} />
          <Sorot P={P} x={540} y={820} />
          {/* dermaga kiri tempat dia berdiri */}
          {[20, 150].map((px) => <rect key={px} x={px} y={740} width={30} height={300} rx={6} fill="#6B4128" stroke={NAVY} strokeWidth={5} />)}
          <rect x={-40} y={722} width={250} height={34} rx={6} fill="#B5764A" stroke={NAVY} strokeWidth={6} />
          <g transform={`translate(${g.x} ${g.y})`}>
            <PerahuNelayan x={500} y={yPerahu} s={0.95} miring={f < w(73) ? -6 : -12 * Math.exp(-(f - w(73)) / 10) * Math.cos((f - w(73)) / 3)} />
          </g>
          <Gelembung f={f} x={500} y={yPerahu + 30} n={12} tinggi={160} lebar={360} t0={w(66)} />
          <AirDepan P={P} y0={760} />
          <Flip f={f} n="dorong" jadwal={[[0, 1], [w(66), 2], [w(73), 3], [w(76), 4]]} x={140} bawah={726} s={0.5} />
        </g>
      );
    },
    teks: (f) => <Muncul f={f} t={w(70)}><Tulisan teks="5 MINUTES, TOPS" x={540} y={520} ukuran={64} warna="#FFD23F" /></Muncul>,
  },
  {
    // tangki pemberat: air laut membanjiri tangki, kapal (tampak potong) turun dari permukaan
    mulai: 82, grup: "ballast", P: PERMUKAAN, bebas: true,
    d: (f) => iv(f, w(95), w(102) + 10, 0, 0.08),
    kamera: (a, b) => [[a, 540, 960, 1.02], [w(95), 540, 960, 1.02], [w(102) + 10, 540, 1660, 1.02], [b, 540, 1670, 1.05]],
    gambar: (f, P) => {
      const air = iv(f, w(91), w(95) + 6, 0.05, 0.78);
      const y = iv(f, w(95), w(102) + 10, 930, 1660) + 5 * Math.sin(f / 18);
      return (
        <>
          <LautBesar P={P} permukaan={900} />
          <rect x={-300} y={H} width={W + 600} height={1400} fill={P.lautBawah} />
          <Salju f={f} laju={iv(f, w(95), w(97), 0, 6)} o={0.3} />
          <Sorot P={P} x={540} y={y} r={500} />
          <KapalSelam x={560} y={y} s={1.15} potong air={air} trim={0.3} fokus="ballast" />
          {f >= w(91) && f < w(97) && (
            <g opacity={munculO(f, w(91)) * iv(f, w(96), w(97), 1, 0)}>
              <Panah x1={250} y1={y - 270 + 10 * Math.sin(f / 4)} x2={250} y2={y - 160} w={12} warna={F.air} />
              <Panah x1={880} y1={y - 270 + 10 * Math.sin(f / 4)} x2={880} y2={y - 160} w={12} warna={F.air} />
            </g>
          )}
          {f >= w(99) && <g opacity={munculO(f, w(99))}><Panah x1={560} y1={y + 170} x2={560} y2={y + 290} w={16} warna={T.kuning} /></g>}
        </>
      );
    },
    istilah: ["Ballast Tanks", 106],
  },
  {
    // tenggelam terus: partikel melesat ke atas (kapal turun), jejak bayangan, pengukur kedalaman naik
    mulai: 108, grup: "turun", P: DALAM,
    d: (f) => iv(f, w(108), w(116) + 10, 0.1, 0.62),
    gambar: (f, P) => {
      const laju = iv(f, w(108), w(116), 4, 14);
      return (
        <>
          <LautBesar P={P} />
          <Salju f={f} laju={laju} panjang={laju * 3} o={0.35} />
          <Sorot P={P} x={540} y={1000} r={360} />
          {[0.08, 0.14, 0.22].map((o, i) => <g key={i} opacity={o * iv(f, w(109), w(111), 0, 1)} filter="url(#buram)"><KapalSelam x={540} y={620 + i * 150} s={0.62} /></g>)}
          <KapalSelam x={540} y={1080 + 6 * Math.sin(f / 9)} s={0.62} miring={4} />
          <DepanLaut P={P} />
        </>
      );
    },
  },
  {
    // tangki trim: isi-kosong bergantian → ayunan kapal mengecil → diam sempurna
    mulai: 117, grup: "trim", P: DALAM,
    d: () => 0.4,
    // kamera tidak pernah diam: dorong pelan + mengorbit kecil; setelah diam sempurna, punch-in ke tangki trim
    kameraLangsung: (f) => {
      const a = fr(117) - 4;
      const masukTrim = iv(f, fr(136), fr(140), 0, 1, keluar);
      return {
        cx: 540 + 26 * Math.sin((f - a) / 40) + 40 * masukTrim,
        cy: 1010 + 18 * Math.cos((f - a) / 52) + 70 * masukTrim,
        s: iv(f, a, fr(136), 1.03, 1.1) + 0.14 * masukTrim + 0.012 * Math.sin((f - a) / 30),
      };
    },
    gambar: (f, P) => {
      const redam = iv(f, w(124), w(136), 1, 0);
      const trim = 0.5 + 0.35 * Math.sin((f - w(117)) / 7) * redam;
      const y = 1020 + 46 * Math.sin((f - w(117)) / 7 - 1.2) * redam;
      return (
        <>
          <LautBesar P={P} />
          <Salju f={f} laju={0.6} o={0.3} />
          <Sorot P={P} x={540} y={1020} r={480} />
          <KapalSelam x={560} y={y} s={1.15} potong air={0.55} trim={trim} fokus="trim" />
          {/* garis "melayang di sini": putus-putus berjalan + berkedip hidup-nyala, tangki trim berdenyut */}
          {f >= w(136) && (
            <g opacity={munculO(f, w(136)) * (0.55 + 0.45 * (0.5 + 0.5 * Math.sin(f / 4)))}>
              <line x1={140} x2={940} y1={1020} y2={1020} stroke="#DFF5FF" strokeWidth={14} opacity={0.35} filter="url(#cahaya)" />
              <line x1={140} x2={940} y1={1020} y2={1020} stroke="#FFFFFF" strokeWidth={9} strokeDasharray="22 16" strokeDashoffset={-f * 2.5} strokeLinecap="round" />
              {[140, 940].map((x) => <circle key={x} cx={x} cy={1020} r={10 + 4 * Math.sin(f / 4)} fill="#FFFFFF" />)}
            </g>
          )}
          {f >= w(140) && [-196, 134].map((tx) => (
            <rect key={tx} x={560 + tx * 1.15 - 6} y={1020 + 20 * 1.15} width={62 * 1.15 + 12} height={40 * 1.15} rx={12} fill="none" stroke={T.kuning} strokeWidth={6} opacity={(0.5 + 0.5 * Math.sin(f / 3.5)) * munculO(f, w(140))} />
          ))}
          {redam > 0.05 && (
            <g opacity={redam}>
              <Panah x1={360} y1={y + 150} x2={360} y2={y + 150 + (trim > 0.5 ? -60 : 60)} w={12} warna={T.kuning} />
              <Panah x1={760} y1={y + 150} x2={760} y2={y + 150 + (trim > 0.5 ? -60 : 60)} w={12} warna={T.kuning} />
            </g>
          )}
          <DepanLaut P={P} />
        </>
      );
    },
    istilah: ["Trim Tanks", 143],
  },
  {
    // tekanan: penggaris kedalaman bergulir, panah tekanan makin besar, kapal penyok di "crumples"
    mulai: 145, grup: "tekanan", P: DARURAT,
    d: (f) => iv(f, w(145), w(161), 0.45, 0.68),
    gambar: (f, P) => {
      const gulir = iv(f, w(145), w(156), 0, 660, (t) => t);
      const tekan = iv(f, w(152), w(160), 0.3, 1);
      const penyok = iv(f, w(161), w(161) + 6, 0, 1, keluar);
      const g = getar(f, w(161), 14, 20);
      return (
        <>
          <LautBesar P={P} />
          <Salju f={f} laju={3} o={0.3} />
          <Sorot P={P} x={540} y={1020} r={420} />
          {Array.from({ length: 9 }).map((_, i) => {
            const y = 300 + i * 220 - gulir;
            return y < 160 || y > 1420 ? null : (
              <g key={i}>
                <line x1={70} x2={170} y1={y} y2={y} stroke="#FFFFFF" strokeWidth={4} opacity={0.7} />
                <text x={190} y={y + 10} fontFamily="Baloo2" fontWeight={800} fontSize={28} fill="#FFFFFF" opacity={0.8}>{(i + 1) * 33} FT</text>
              </g>
            );
          })}
          <g transform={`translate(${g.x} ${g.y})`}>
            <KapalSelam x={600} y={1020} s={0.82} penyok={penyok} darurat={f >= w(161)} />
          </g>
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const r0 = 420 - 40 * tekan + 10 * Math.sin(f / 3 + i);
            return <Panah key={i} x1={600 + r0 * Math.cos(a)} y1={1020 + (r0 - 100) * Math.sin(a)} x2={600 + (r0 - 70 - 40 * tekan) * Math.cos(a)} y2={1020 + (r0 - 190 - 30 * tekan) * Math.sin(a)} w={8 + 8 * tekan} warna={F.air} />;
          })}
          <DepanLaut P={P} />
        </>
      );
    },
  },
  {
    // lambung tekan: cincin baja tebal terbangun, tekanan menyebar rata
    mulai: 166, grup: "lambung", P: DALAM,
    d: () => 0.66,
    kamera: dorong(540, 1000, 1.02, 1.08),
    gambar: (f, P) => {
      const baja = munculS(f, w(173));
      const rata = f >= w(180) ? 1 : 0;
      return (
        <>
          <LautBesar P={P} />
          <Salju f={f} laju={0.6} o={0.3} />
          <Sorot P={P} x={540} y={1020} r={480} />
          <circle cx={540} cy={1020} r={300} fill={T.kuning} stroke={NAVY} strokeWidth={8} />
          {f >= w(173) && (
            <g transform={`translate(540 1020) scale(${baja}) translate(-540 -1020)`}>
              <circle cx={540} cy={1020} r={240} fill="#9FB0C9" stroke={NAVY} strokeWidth={8} />
              {Array.from({ length: 24 }).map((_, i) => <circle key={i} cx={540 + 270 * Math.cos((i * Math.PI) / 12)} cy={1020 + 270 * Math.sin((i * Math.PI) / 12)} r={5} fill={T.kuningTua} />)}
            </g>
          )}
          <circle cx={540} cy={1020} r={200} fill="#22355C" stroke={NAVY} strokeWidth={6} />
          {rata > 0 && <circle cx={540} cy={1020} r={244 + 6 * Math.sin(f / 4)} fill="none" stroke="#DFF5FF" strokeWidth={8} opacity={0.5 * munculO(f, w(180))} />}
          <line x1={350} x2={730} y1={1110} y2={1110} stroke="#9FB0C9" strokeWidth={6} />
          {f >= w(176) && Array.from({ length: 12 }).map((_, i) => {
            const a = (i * Math.PI) / 6;
            const r = 400 - 30 * Math.abs(Math.sin(f / 6 + (rata ? 0 : i)));
            return <g key={i} opacity={munculO(f, w(176))}><Panah x1={540 + r * Math.cos(a)} y1={1020 + r * Math.sin(a)} x2={540 + (r - 85) * Math.cos(a)} y2={1020 + (r - 85) * Math.sin(a)} w={10} warna={F.air} /></g>;
          })}
          <Awak x={445} bawah={1110} t={0.8} topi="kupluk" baju="#9FD6EE" />
          <Awak x={540} bawah={1110} t={0.84} topi="topi" baju={T.koral} janggut pose={f >= w(184) ? "lambai" : "berdiri"} />
          <Awak x={635} bawah={1110} t={0.8} topi="headset" baju="#C9D3E3" flip />
          <DepanLaut P={P} />
        </>
      );
    },
    istilah: ["Pressure Hull", 188],
  },
  {
    // lelucon oksigen: tabung "cukup seminggu" → habis sebelum makan siang (jarum jam berputar cepat)
    mulai: 190, grup: "oksigen", P: DALAM,
    d: () => 0.5,
    kamera: dorong(540, 980, 1.02, 1.08),
    gambar: (f, P) => {
      const isi = iv(f, w(203), w(209), 1, 0.06);
      const putar = iv(f, w(196), w(209), 0, 360 * 5, (t) => 1 - (1 - t) * (1 - t));
      return (
        <>
          <LautBesar P={P} />
          <Sorot P={P} x={540} y={1000} r={460} />
          <rect x={160} y={700} width={760} height={560} rx={60} fill="#22355C" stroke="#9FB0C9" strokeWidth={10} />
          {[260, 360, 460].map((x, i) => {
            const sc = munculS(f, w(191) + i * 4);
            return f < w(191) + i * 4 ? null : (
              <g key={x} stroke={NAVY} strokeWidth={5} transform={`translate(${x} 1080) scale(${sc}) translate(${-x} -1080)`}>
                <rect x={x - 32} y={820} width={64} height={260} rx={30} fill="#C9D3E3" />
                <rect x={x - 24} y={1072 - 240 * isi} width={48} height={240 * isi} rx={20} fill={isi < 0.3 ? T.koral : "#9FD6EE"} stroke="none" />
                <rect x={x - 12} y={796} width={24} height={30} rx={6} fill="#97A3BB" />
              </g>
            );
          })}
          <g transform="translate(720 920)" stroke={NAVY} strokeWidth={6}>
            <circle cx={0} cy={0} r={110} fill="#FFFFFF" />
            <line x1={0} x2={0} y1={0} y2={-60} strokeWidth={10} transform={`rotate(${putar / 12})`} />
            <line x1={0} x2={0} y1={0} y2={-86} strokeWidth={7} transform={`rotate(${putar})`} />
            <circle cx={0} cy={0} r={8} fill={NAVY} />
            <text x={0} y={70} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={30} fill={NAVY} stroke="none">LUNCH</text>
          </g>
          <DepanLaut P={P} />
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(208)}><Tulisan teks="WEEKEND? NOPE." x={540} y={360} ukuran={60} warna="#FFD23F" /></Muncul>,
  },
  {
    // elektrolisis: listrik menyambar, gelembung oksigen naik terus
    mulai: 210, grup: "elektro", P: DALAM,
    d: () => 0.5,
    kamera: dorong(540, 980, 1.02, 1.07),
    gambar: (f, P) => {
      const kilat = f >= w(212) ? 0.55 + 0.45 * Math.abs(Math.sin(f * 1.3)) : 0;
      return (
        <>
          <LautBesar P={P} />
          <Sorot P={P} x={540} y={1000} r={460} />
          <rect x={300} y={780} width={480} height={460} rx={40} fill="url(#gAir)" stroke={NAVY} strokeWidth={8} />
          <rect x={380} y={700} width={40} height={460} rx={10} fill="#C9D3E3" stroke={NAVY} strokeWidth={6} />
          <rect x={660} y={700} width={40} height={460} rx={10} fill="#C9D3E3" stroke={NAVY} strokeWidth={6} />
          <path d="M400 700 L400 640 L540 640 L520 600 L560 600 L540 560 M540 640 L680 640 L680 700" stroke={T.kuning} strokeWidth={12} fill="none" strokeLinejoin="round" opacity={0.35 + 0.65 * kilat} />
          {kilat > 0 && <ellipse cx={540} cy={600} rx={90} ry={60} fill="url(#cahayaKuning)" opacity={kilat} />}
          <Gelembung f={f} x={400} y={1150} n={9} tinggi={380} lebar={40} laju={4} t0={w(216)} />
          <Gelembung f={f} x={680} y={1150} n={9} tinggi={380} lebar={40} laju={4.5} t0={w(216) + 6} />
          <DepanLaut P={P} />
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(219)}><Tulisan teks="O₂" x={680} y={480} ukuran={80} warna="#FFFFFF" /></Muncul>,
    istilah: ["Electrolysis", 223],
  },
  {
    // CO₂ menumpuk, awak pusing → scrubber menyedot asap kelabu
    mulai: 225, grup: "co2", P: DALAM,
    d: () => 0.5,
    kamera: dorong(540, 980, 1.02, 1.07),
    gambar: (f, P) => {
      const jumlah = Math.floor(iv(f, w(226), w(238), 0, 16));
      const sedot = iv(f, w(244), w(251) + 6, 0, 1);
      const pusing = f >= w(237) && f < w(246) ? 8 * Math.sin(f / 4) : 0;
      return (
        <>
          <LautBesar P={P} />
          <Sorot P={P} x={540} y={1000} r={460} />
          <rect x={160} y={720} width={760} height={540} rx={60} fill="#22355C" stroke="#9FB0C9" strokeWidth={10} />
          {f >= w(240) && (
            <g transform={`translate(710 990) scale(${munculS(f, w(240))}) translate(-710 -990)`}>
              <rect x={600} y={820} width={220} height={340} rx={24} fill={T.kuning} stroke={NAVY} strokeWidth={7} />
              {[0, 1, 2, 3].map((i) => <rect key={i} x={620} y={850 + i * 76} width={180} height={50} rx={10} fill={T.kuningTua} />)}
            </g>
          )}
          {Array.from({ length: jumlah }).map((_, i) => {
            const x0 = 240 + acak(i) * 330 + 10 * Math.sin(f / 9 + i), y0 = 800 + acak(i + 8) * 380;
            return <circle key={i} cx={x0 + (700 - x0) * sedot} cy={y0 + (990 - y0) * sedot} r={(14 + acak(i + 2) * 10) * (1 - sedot * 0.8)} fill="#6C7690" opacity={0.85 * (1 - sedot)} />;
          })}
          {f >= w(242) && sedot < 1 && <Panah x1={480} y1={990} x2={590} y2={990} w={14} warna="#FFFFFF" />}
          <g transform={`rotate(${pusing} 280 1250)`}><Awak x={280} bawah={1250} t={0.9} topi="kupluk" baju="#9FD6EE" /></g>
          <g transform={`rotate(${-pusing} 430 1250)`}><Awak x={430} bawah={1250} t={0.9} topi="headset" baju="#C9D3E3" flip /></g>
          <DepanLaut P={P} />
        </>
      );
    },
    istilah: ["CO2 Scrubber", 254],
  },
  {
    // sonar: gelap pekat → ping menyebar → gema memantul dari tebing → tepi tebing menyala
    mulai: 258, grup: "sonar", P: DALAM,
    d: () => 0.6,
    kamera: dorong(560, 1080, 1.02, 1.06),
    gambar: (f, P) => {
      const busur = (cx: number, cy: number, r: number, a0: number, a1: number) =>
        `M${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`;
      const gelap = iv(f, w(259), w(263), 0.2, 0.55);
      const ping = [w(269), w(269) + 26, w(269) + 52].filter((t) => f >= t);
      const gema = [w(275), w(275) + 26].filter((t) => f >= t);
      const kena = ping.length ? Math.max(...ping.map((t) => Math.exp(-Math.abs(f - t - 16) / 6))) : 0;
      return (
        <>
          <LautBesar P={P} siluet={false} />
          <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#030A18" opacity={gelap} />
          <Salju f={f} laju={0.5} o={0.25} />
          <g filter="url(#jauh)" fill="#0B2242" opacity={0.85}>
            <path d="M700 1920 L700 760 L780 640 L860 690 L930 560 L1120 600 L1120 1920 Z" />
          </g>
          <Sorot P={P} x={320} y={1040} r={300} />
          <KapalSelam x={290} y={1040 + 5 * Math.sin(f / 16)} s={0.5} lampu={f >= w(264)} />
          {ping.map((t, i) => {
            const r = (f - t) * 13 + 40;
            return r < 380 ? <path key={i} d={busur(465, 1030, r, -0.85, 0.85)} stroke={T.kuning} strokeWidth={9} fill="none" opacity={1 - r / 380} strokeLinecap="round" /> : null;
          })}
          <g strokeLinejoin="round">
            <path d="M610 2000 L600 1640 L640 1560 L612 1450 L650 1360 L628 1250 L668 1150 L646 1050 L700 940 L752 968 L790 870 L846 912 L900 860 L960 905 L1020 850 L1080 890 L1140 830 L1240 870 L1240 2000 Z" fill="#2E5A90" stroke={NAVY} strokeWidth={7} />
            {/* lapisan batuan + tonjolan meneruskan tebing sampai keluar layar kanan (tidak terpotong) */}
            {[1000, 1110, 1230, 1340, 1470, 1600, 1740].map((y, i) => <path key={y} d={`M${650 - (i % 2) * 20} ${y} q90 ${-14 + (i % 3) * 10} 180 0 t180 -6 t180 4`} stroke="#1E4272" strokeWidth={6} fill="none" />)}
            {[[880, 1260, 160], [840, 1520, 200]].map(([lx, ly, lw], i) => (
              <path key={i} d={`M${lx} ${ly} L${lx + lw} ${ly - 10} L${lx + lw - 10} ${ly + 16} L${lx + 6} ${ly + 22} Z`} fill="#4473AA" stroke={NAVY} strokeWidth={5} />
            ))}
            <path d="M610 2000 L600 1640 L640 1560 L612 1450 L650 1360 L628 1250 L668 1150 L646 1050 L700 940 L752 968 L790 870" stroke="#7FE3FF" strokeWidth={6 + 8 * kena} fill="none" strokeLinecap="round" opacity={0.35 + 0.65 * Math.max(kena, f >= w(275) ? 0.6 : 0)} />
          </g>
          {gema.map((t, i) => {
            const r = (f - t) * 10 + 40;
            return r < 300 ? <path key={i} d={busur(640, 1060, r, 2.3, 3.9)} stroke="#7FE3FF" strokeWidth={6} fill="none" opacity={1 - r / 300} strokeLinecap="round" /> : null;
          })}
          <DepanLaut P={P} />
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(269)}><Tulisan teks="PING!" x={560} y={780} ukuran={70} warna="#FFD23F" /></Muncul>,
    istilah: ["Sonar", 279],
  },
  // ===== KRISIS =====
  {
    // luar: kapal utuh di kegelapan, kamera mendekat ke jendela... gelembung mulai bocor
    mulai: 281, grup: "krisis-luar", P: DARURAT,
    d: (f) => iv(f, w(281), w(287), 0.66, 0.72),
    kamera: (a, b) => [[a, 540, 980, 1.02], [b, 470, 990, 1.5]],
    gambar: (f, P) => (
      <>
        <LautBesar P={P} />
        <Salju f={f} laju={0.6} o={0.25} />
        <Sorot P={P} x={520} y={1000} r={420} />
        <KapalSelam x={540} y={1000 + 4 * Math.sin(f / 14)} s={1.08} darurat={f >= w(285)} penyok={0.2} />
        {f >= w(285) && <ellipse cx={616} cy={770} rx={90} ry={60} fill="url(#lampuMerah)" opacity={0.5 + 0.5 * Math.sin(f / 3)} />}
        <Gelembung f={f} x={690} y={900} n={12} tinggi={300} lebar={60} laju={7} t0={w(285)} />
        <DepanLaut P={P} />
      </>
    ),
  },
  {
    // dalam (masuk lewat kaca): pipa pecah, semburan cyan membesar, dia panik; kedalaman lewat batas aman
    mulai: 287, grup: "krisis-dalam", P: DARURAT, tembus: true,
    d: (f) => iv(f, w(287), w(302), 0.72, 0.88),
    bahaya: (f) => f >= w(299),
    kamera: (a, b) => [[a, 540, 1000, 1.02], [b, 540, 1010, 1.1]],
    gambar: (f, P, a) => {
      const pb = iv(f, a, a + 10, 0.15, 1, keluar);
      const gen = iv(f, a + 6, w(302), 0.1, 0.85);
      const g = getar(f, a, 12, 18);
      return (
        <>
          <LautBesar P={P} />
          <defs><clipPath id="kacaKSA"><circle cx={540} cy={1000} r={330} /></clipPath></defs>
          <path d="M-80 560 Q540 500 1160 560 L1160 1470 Q540 1530 -80 1470 Z" fill={T.kuning} stroke={NAVY} strokeWidth={8} />
          <path d="M-80 1300 Q540 1380 1160 1300 L1160 1470 Q540 1530 -80 1470 Z" fill={T.kuningTua} opacity={0.45} />
          {[90, 990].map((sx) => (
            <g key={sx}>
              <line x1={sx} x2={sx} y1={560} y2={1480} stroke={T.kuningTua} strokeWidth={5} opacity={0.6} />
              {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={sx + 16} cy={600 + i * 74} r={6} fill={T.kuningTua} opacity={0.6} />)}
            </g>
          ))}
          <circle cx={540} cy={1000} r={400} fill="#9FB0C9" stroke={NAVY} strokeWidth={10} />
          {Array.from({ length: 16 }).map((_, i) => <circle key={i} cx={540 + 372 * Math.cos((i * Math.PI) / 8)} cy={1000 + 372 * Math.sin((i * Math.PI) / 8)} r={10} fill="#6C7690" stroke={NAVY} strokeWidth={3} />)}
          <circle cx={540} cy={1000} r={346} fill="#6C7690" stroke={NAVY} strokeWidth={6} />
          <g clipPath="url(#kacaKSA)">
            <g transform={`translate(${g.x} ${g.y}) translate(540 1000) scale(0.82) translate(-540 -1000)`}>
              <RuangKapal bocor={pb} genangan={gen} getar={f} />
              <Flip f={f} n="takut" jadwal={[[0, 1], [w(289), 2], [w(290) + 6, 3], [w(295), 4]]} x={360} bawah={1340} s={0.56} />
            </g>
            <path d="M300 760 Q420 680 560 680" stroke="#FFFFFF" strokeWidth={22} fill="none" opacity={0.18} strokeLinecap="round" />
          </g>
          <circle cx={540} cy={1000} r={332} fill="none" stroke={NAVY} strokeWidth={8} />
          <ellipse cx={130} cy={620} rx={180} ry={120} fill="url(#lampuMerah)" opacity={0.5 + 0.5 * Math.sin(f / 3)} />
        </>
      );
    },
  },
  {
    // dinding berderit, retak menjalar; uang menghitung mundur merah
    mulai: 303, grup: "derit", P: DARURAT,
    d: (f) => iv(f, w(303), w(321), 0.88, 0.95),
    bahaya: () => true,
    kamera: (a, b) => [[a, 540, 1040, 1.02], [b, 540, 1040, 1.12]],
    gambar: (f, P) => {
      const g = [getar(f, w(304), 9, 16), getar(f, w(307), 12, 18), getar(f, w(315), 8, 14)].reduce((s, x) => ({ x: s.x + x.x, y: s.y + x.y }), { x: 0, y: 0 });
      return (
        <>
          <LautBesar P={P} />
          <Salju f={f} laju={2} o={0.25} />
          <Sorot P={P} x={540} y={1040} r={420} />
          <g transform={`translate(${g.x} ${g.y})`}>
            <KapalSelam x={540} y={1060 + iv(f, w(303), w(321), 0, 60)} s={0.9} penyok={iv(f, w(304), w(308), 0.4, 1)} darurat miring={8 + 2 * Math.sin(f / 10)} />
            {[[300, 940, w(305)], [760, 1000, w(308)], [520, 1150, w(311)]].map(([x, y, t], i) => (
              <Retak key={i} d={`M${x} ${y} l20 30 l-18 26 l22 30`} lebar={7} warna="#FFFFFF" p={iv(f, t, t + 10, 0, 1)} />
            ))}
          </g>
          <DepanLaut P={P} />
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(312)}><Uang top={420} merah sisa={iv(f, w(312), w(321) + 8, 0.5, 0.0214)} /></Muncul>,
  },
  {
    // titik terendah: duduk di lantai dingin, lampu darurat berdenyut, kamera mendekat pelan
    mulai: 322, grup: "terendah", P: DARURAT,
    d: () => 0.95,
    bahaya: () => true,
    kamera: (a, b) => [[a, 520, 1060, 1.02], [b, 480, 1140, 1.16]],
    gambar: (f) => (
      <>
        <RuangKapal genangan={0.45} />
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="url(#lampuMerah)" opacity={0.35 + 0.35 * Math.sin(f / 9)} />
        <Flip f={f} n="duduk" jadwal={[[0, 1], [w(323), 2], [w(327), 3], [w(335), 4]]} x={460} bawah={1350} s={0.62} />
      </>
    ),
  },
  // ===== ILHAM (kenangan, sepia hangat) =====
  {
    // dulu: menarik ikan dari laut dalam terlalu cepat → ikan naik dan menggembung
    mulai: 340, grup: "kenangan", P: KENANGAN_LAUT,
    kamera: (a, b) => [[a, 540, 900, 1.2], [w(347), 540, 960, 1.08], [b, 550, 980, 1.04]],
    gambar: (f, P) => {
      const yIkan = iv(f, w(347), w(358) + 4, 1560, 1110, keluar);
      const gb = iv(f, w(355), w(362), 0, 1, keluar);
      const g = ayun(f, 1, 4);
      const k = f < w(347) ? 1 : f < w(350) ? 2 : f < w(357) ? 3 : 4;
      const ujung = [[0, 0], [210, -640], [225, -540], [70, -925], [40, -945]][k];
      const tx = 330 + ujung[0] * 0.3, ty = 728 + g.y + ujung[1] * 0.3;
      return (
        <>
          <LautBesar P={P} permukaan={760} siluet={false} />
          <Cakrawala y={760} P={P} />
          <g transform={`translate(0 ${g.y}) rotate(${g.r} 400 760)`}>
            <PerahuNelayan x={400} y={760} s={0.8} />
          </g>
          <Flip f={f} n="pancing" jadwal={[[0, 1], [w(347), 2], [w(350), 3], [w(357), 4]]} x={330} bawah={728 + g.y} s={0.3} />
          <AirDepan P={P} y0={760} />
          <path d={`M${tx} ${ty} Q${(tx + 600) / 2 + 20} ${(ty + yIkan) / 2} ${600 - 214} ${yIkan}`} stroke="#FFFFFF" strokeWidth={4} fill="none" />
          <Sorot P={P} x={600} y={yIkan} r={360} />
          <IkanGelembung x={600} y={yIkan} s={1.55} gembung={gb} />
          {f >= w(349) && f < w(358) && <Panah x1={600} y1={yIkan + 330} x2={600} y2={yIkan + 200} w={12} warna="#FFFFFF" />}
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(340) + 6}><Tulisan teks="YEARS AGO" x={540} y={880} ukuran={64} warna="#FFFFFF" /></Muncul>,
  },
  {
    // udara di dalam ikan mengembang → ikan melesat ke permukaan (jejak bayangan)
    mulai: 363, grup: "kenangan-naik", P: KENANGAN_LAUT,
    gambar: (f, P, a) => {
      const p = iv(f, a, w(374) + 6, 0, 1, masuk);
      const y = 1350 - 700 * p;
      const gb = iv(f, a, w(368) + 4, 0.25, 1);
      return (
        <>
          <LautBesar P={P} permukaan={560} siluet={false} />
          <Salju f={f} laju={-6 * p - 1} panjang={20 * p} o={0.3} />
          <Sorot P={P} x={500} y={y} r={460} />
          {[0.12, 0.24].map((o, i) => <g key={i} opacity={o * p}><IkanGelembung x={500} y={y + 140 * (i + 1)} s={1.05} gembung={gb} /></g>)}
          <IkanGelembung x={500} y={y} s={1.05} gembung={gb} />
          {f >= w(370) && <g opacity={munculO(f, w(370))}><Panah x1={820} y1={1350} x2={820} y2={650} w={16} warna={T.kuning} /></g>}
          <DepanLaut P={P} />
        </>
      );
    },
  },
  // ===== SOLUSI =====
  {
    // emergency blow: udara terkuat ditiup ke tangki, air terdorong keluar
    mulai: 375, grup: "tiup", P: DALAM,
    d: (f) => iv(f, w(386), w(399), 0.85, 0.78),
    gambar: (f, P) => {
      const air = iv(f, w(386), w(399), 0.82, 0.08);
      const g = getar(f, w(386), 10, 16);
      return (
        <>
          <LautBesar P={P} />
          <Salju f={f} laju={0.5} o={0.3} />
          <Sorot P={P} x={560} y={1020} r={500} />
          <g transform={`translate(${g.x} ${g.y})`}>
            <KapalSelam x={560} y={1020} s={1.15} potong air={air} trim={0.2} fokus="ballast" />
          </g>
          {f >= w(386) && f < w(400) && [-1, 1].map((sg) => (
            <g key={sg} opacity={munculO(f, w(386))}>
              <Panah x1={560 + sg * 110} y1={1020} x2={560 + sg * (220 + 20 * Math.sin(f / 2))} y2={1020} w={14} warna="#FFFFFF" />
            </g>
          ))}
          {f >= w(395) && [210, 900].map((x) => (
            <g key={x}>
              {Array.from({ length: 8 }).map((_, i) => {
                const p = (((f - w(395)) * 6 + i * 30) % 240) / 240;
                return <circle key={i} cx={x + (acak(i) - 0.5) * 80} cy={1110 + p * 240} r={10 + acak(i) * 12} fill="url(#gAir)" stroke={NAVY} strokeWidth={3} opacity={1 - p} />;
              })}
            </g>
          ))}
          <DepanLaut P={P} />
        </>
      );
    },
  },
  {
    // naik makin cepat: ikan & partikel tertinggal ke bawah makin kencang
    mulai: 400, grup: "naik", P: PERMUKAAN,
    d: (f) => iv(f, w(400), w(420), 0.5, 0.1),
    gambar: (f, P, a) => {
      const t = f - a;
      const geser = 0.12 * t * t;
      const g = getar(f, w(412), 6, 30);
      return (
        <>
          <LautBesar P={P} />
          <Salju f={f} laju={-(4 + t * 0.35)} panjang={10 + t * 1.2} o={0.4} />
          <Sorot P={P} x={540} y={900} r={460} />
          {[[160, 760, 1], [250, 1180, 0.8], [840, 700, 0.9], [880, 1120, 0.7], [130, 1380, 0.7]].map(([x, y, s], i) => (
            <IkanLewat key={i} x={x} y={((((y + geser * (0.8 + s * 0.4)) % 1700) + 1700) % 1700) + 150} s={s} />
          ))}
          <g transform={`translate(${g.x} ${g.y})`}><KapalSelam x={540} y={900} s={0.8} miring={-70} /></g>
          <Gelembung f={f} x={540} y={1400} n={18} tinggi={500} lebar={120} laju={-9} t0={a} />
          {Array.from({ length: 16 }).map((_, i) => {
            const p = (((t * 9 + i * 40) % 640) / 640);
            return <circle key={i} cx={470 + acak(i) * 140} cy={1150 + p * 640} r={8 + acak(i + 1) * 16} fill="#FFFFFF" stroke={NAVY} strokeWidth={3} opacity={0.85 * (1 - p)} />;
          })}
          <DepanLaut P={P} />
        </>
      );
    },
    istilah: ["Emergency Blow", 417],
  },
  // ===== BABAK 3 =====
  {
    // melompat keluar laut seperti paus
    mulai: 421, grup: "lompat", P: FAJAR,
    d: () => 0,
    kamera: (a, b) => [[a, 540, 1000, 1.02], [w(424), 540, 960, 1.05], [b, 540, 940, 1.08]],
    gambar: (f, P, a) => {
      const p = iv(f, a, w(424) + 6, 0, 1, keluar);
      const y = 1500 - 680 * p + (f > w(424) + 6 ? 8 * Math.sin((f - w(424)) / 8) : 0);
      const ciprat = iv(f, w(423), w(424) + 12, 0, 1, keluar);
      const g = getar(f, w(423), 12, 20);
      return (
        <>
          <LautBesar P={P} permukaan={1100} siluet={false} />
          <Cakrawala y={1100} P={P} />
          <Sorot P={P} x={540} y={820} r={520} />
          <g transform={`translate(${g.x} ${g.y})`}>
            <KapalSelam x={540} y={y} s={0.95} miring={-28 + 6 * (1 - p)} />
          </g>
          <AirDepan P={P} y0={1100} />
          {ciprat > 0 && Array.from({ length: 18 }).map((_, i) => {
            const a2 = Math.PI + (i / 17) * Math.PI;
            return <circle key={i} cx={540 + Math.cos(a2) * (260 + acak(i) * 120) * ciprat} cy={1100 + Math.sin(a2) * (120 + acak(i + 4) * 160) * ciprat + 40 * ciprat * ciprat} r={(14 + acak(i + 2) * 18) * (1.2 - ciprat * 0.4)} fill="#FFFFFF" stroke={NAVY} strokeWidth={3} />;
          })}
        </>
      );
    },
  },
  {
    // semua awak selamat (zoom di awak) → zoom out → zoom in ke speedboat yang melaju, dia bersorak di atasnya
    mulai: 432, grup: "selamat", P: FAJAR,
    kamera: (a, b) => [[a, 300, 880, 2.1], [w(436) + 4, 300, 880, 2.1], [w(437) + 12, 540, 960, 1.02], [w(444), 540, 960, 1.02], [b, 800, 900, 1.9]],
    kameraLangsung: (f) => (f >= fr(446) + 12 ? { cx: xBoat25(f), cy: 900, s: 1.9 } : f >= fr(444) ? { cx: iv(f, fr(444), fr(446) + 12, 540, xBoat25(f)), cy: iv(f, fr(444), fr(446) + 12, 960, 900), s: iv(f, fr(444), fr(446) + 12, 1.02, 1.9) } : null),
    gambar: (f, P) => {
      const xb = xBoat25(f);
      const lambai = (i: number) => (Math.floor(f / 8 + i) % 2 === 0 ? "lambai" : "sorak");
      return (
        <>
          <LautBesar P={P} permukaan={1000} siluet={false} />
          <Cakrawala y={1000} P={P} />
          <Sorot P={P} x={540} y={960} r={520} />
          <g transform={`translate(0 ${ayun(f, 1, 4).y})`}>
            <KapalSelam x={300} y={1012} s={0.52} />
            <Awak x={196} bawah={968} t={0.56} pose={lambai(0)} topi="kupluk" baju="#9FD6EE" />
            <Awak x={250} bawah={966} t={0.58} pose={lambai(1)} topi="topi" baju={T.koral} janggut />
            <Awak x={372} bawah={966} t={0.56} pose={lambai(1)} topi="headset" baju="#C9D3E3" flip />
            <Awak x={420} bawah={968} t={0.54} pose={lambai(0)} topi="rambut" baju="#9FD6EE" flip />
          </g>
          {/* buih jejak */}
          <path d={`M${xb - 170} 1004 Q${xb - 300} 990 ${xb - 430} 1012 L${xb - 430} 1030 Q${xb - 300} 1016 ${xb - 170} 1022 Z`} fill="#FFFFFF" opacity={0.85} />
          <g transform={`translate(0 ${3 * Math.sin(f / 3)}) rotate(-2 ${xb} 1000)`}>
            <AIK n={`boat-${2 + (Math.floor(f / 3) % 3)}`} x={xb} bawah={1012} s={0.42} bayang={false} />
            <Flip f={f} n="sorak" jadwal={siklus(fr(432), fr(460), 7, [1, 2, 3, 4, 3, 2])} x={xb + 10} bawah={976} s={0.16} bayang={false} />
          </g>
          <AirDepan P={P} y0={1000} />
        </>
      );
    },
    teks: (f) => <Muncul f={f} t={w(439)}><Uang top={480} sisa={0.5} /></Muncul>,
  },
  {
    // penutup: takut air — di dermaga dengan rompi & pelampung lengan, memeluk tiang, tak berani naik speedboat
    mulai: 448, grup: "dermaga", P: PERMUKAAN,
    kamera: (a, b) => [[a, 540, 1000, 1.02], [w(453), 520, 980, 1.08], [b, 480, 960, 1.16]],
    gambar: (f, P) => {
      const g = ayun(f, 0, 5);
      return (
        <>
          <LautBesar P={P} permukaan={1120} siluet={false} />
          <Cakrawala y={1120} P={P} />
          <Sorot P={P} x={480} y={1000} r={460} />
          {[60, 230].map((px) => <rect key={px} x={px} y={1060} width={34} height={300} rx={6} fill="#6B4128" stroke={NAVY} strokeWidth={5} />)}
          <rect x={-40} y={1040} width={520} height={40} rx={6} fill="#B5764A" stroke={NAVY} strokeWidth={6} />
          {Array.from({ length: 6 }).map((_, i) => <line key={i} x1={i * 86 + 20} x2={i * 86 + 20} y1={1042} y2={1078} stroke="#8C5634" strokeWidth={4} />)}
          <path d={`M300 990 Q520 ${1080 + g.y} 640 ${1100 + g.y}`} stroke="#C9A57E" strokeWidth={6} fill="none" />
          <g transform={`translate(0 ${g.y}) rotate(${g.r} 760 1120)`}>
            <AIK n="boat-1" x={760} bawah={1132} s={0.4} bayang={false} />
          </g>
          <AirDepan P={P} y0={1120} />
          <g transform={f >= w(455) ? `translate(${3 * Math.sin(f * 2.1)} 0)` : undefined}>
            <Flip f={f} n="dermaga" jadwal={[[0, 1], [w(451), 2], [w(453), 3], [w(455), 4]]} x={300} bawah={1044} s={0.52} />
          </g>
        </>
      );
    },
  },
  {
    // speedboat tinggal di ruang tamu: mulai dekat di dia, mundur menampakkan ruangan
    mulai: 456, grup: "ruang-tamu", P: FAJAR,
    kamera: (a, b) => [[a, 520, 1120, 1.6], [w(459), 530, 1080, 1.4], [b, 540, 980, 1.02]],
    gambar: (f) => (
      <>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} fill="#F3E7D3" />
        {Array.from({ length: 19 }).map((_, i) => <rect key={i} x={i * 60} y={0} width={26} height={1200} fill="#EADBC2" />)}
        {/* lis langit-langit + jam dinding + rak buku + tanaman: ruangan berlapis (detail diredam, fokus = perahu) */}
        <g filter="url(#detailRedam)" opacity={0.55}>
          <rect x={-200} y={170} width={W + 400} height={18} fill="#D9C3A0" />
        </g>
        <g stroke={NAVY} strokeWidth={5}>
          <circle cx={450} cy={300} r={46} fill="#FFFBF2" />
          <line x1={450} x2={450} y1={300} y2={270} strokeWidth={5} />
          <line x1={450} x2={472} y1={300} y2={300} strokeWidth={4} />
          <rect x={790} y={860} width={150} height={330} rx={6} fill="#B48C64" />
          {[930, 1010, 1090].map((y) => <line key={y} x1={790} x2={940} y1={y} y2={y} strokeWidth={5} />)}
          {[[800, 882, 18, "#5F86B8"], [822, 890, 16, T.koral], [842, 878, 22, "#E9E1D2"], [868, 886, 18, "#9FD6EE"], [890, 960, 40, "#E9E1D2"], [802, 962, 30, T.kuningMuda], [808, 1040, 50, "#5F86B8"], [870, 1050, 28, "#6B4128"]].map(([x, y, w2, c], i) => (
            <rect key={i} x={x as number} y={y as number} width={w2 as number} height={(i < 4 ? 930 : i < 6 ? 1010 : 1090) - (y as number)} rx={3} fill={c as string} strokeWidth={3} />
          ))}
          <path d="M360 1200 L372 1120 L428 1120 L440 1200 Z" fill="#C98F7A" />
          {[-30, 0, 30].map((a2) => <ellipse key={a2} cx={400 + a2} cy={1080 - Math.abs(a2) * 0.3} rx={18} ry={44} fill="#4F8A8B" transform={`rotate(${a2} ${400 + a2} 1100)`} strokeWidth={4} />)}
        </g>
        <g stroke={NAVY} strokeWidth={8}>
          <rect x={620} y={380} width={320} height={380} rx={14} fill="#BFE3F2" />
          <rect x={628} y={600} width={304} height={152} fill="#5FB6DE" stroke="none" />
          <line x1={780} x2={780} y1={380} y2={760} />
          <line x1={620} x2={940} y1={560} y2={560} />
          <path d="M600 360 Q640 560 610 800 L680 800 Q660 560 690 360 Z" fill={T.koralMuda} strokeWidth={5} />
          <path d="M960 360 Q920 560 950 800 L880 800 Q900 560 870 360 Z" fill={T.koralMuda} strokeWidth={5} />
          <rect x={580} y={340} width={400} height={20} rx={8} fill="#6B4128" strokeWidth={5} />
        </g>
        <g stroke={NAVY} strokeWidth={6}>
          <rect x={110} y={420} width={220} height={150} rx={8} fill="#FFFBF2" />
          <rect x={126} y={436} width={188} height={118} fill="#9FD6EE" strokeWidth={3} />
          <rect x={150} y={640} width={140} height={110} rx={8} fill="#FFFBF2" />
          <rect x={164} y={654} width={112} height={82} fill="#F2D2A2" strokeWidth={3} />
        </g>
        <KapalSelam x={220} y={500} s={0.2} />
        <IkanGelembung x={220} y={696} s={0.28} gembung={1} />
        <ellipse cx={90} cy={880} rx={160} ry={120} fill="url(#cahayaKuning)" />
        <g stroke={NAVY} strokeWidth={6}>
          <line x1={90} x2={90} y1={880} y2={1240} />
          <path d="M40 880 L140 880 L118 800 L62 800 Z" fill={T.kuningMuda} />
          <ellipse cx={90} cy={1244} rx={44} ry={10} fill="#3A4660" />
        </g>
        <rect x={0} y={1200} width={W} height={720} fill="#C9A37A" />
        <rect x={0} y={1192} width={W} height={16} fill="#8C5634" />
        {Array.from({ length: 8 }).map((_, i) => <line key={i} x1={0} x2={W} y1={1260 + i * 80} y2={1260 + i * 80} stroke="#B48C64" strokeWidth={4} />)}
        <g stroke={NAVY} strokeWidth={6}>
          <rect x={-40} y={1000} width={300} height={130} rx={30} fill="#5F86B8" />
          <rect x={-40} y={1100} width={330} height={110} rx={24} fill="#4F75A6" />
          <rect x={250} y={1060} width={50} height={150} rx={20} fill="#5F86B8" />
        </g>
        <ellipse cx={540} cy={1300} rx={490} ry={84} fill={T.koralMuda} stroke={NAVY} strokeWidth={6} />
        <ellipse cx={540} cy={1300} rx={400} ry={58} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.6} />
        <ellipse cx={540} cy={1300} rx={300} ry={40} fill="none" stroke={T.koral} strokeWidth={4} opacity={0.5} strokeDasharray="14 12" />
        <rect x={0} y={1192} width={W} height={10} fill="#6B4128" />
        <ellipse cx={540} cy={1318} rx={400} ry={22} fill="rgba(10,14,34,.25)" />
        <AIK n="boat-1" x={540} bawah={1322} s={1.5} bayang={false} />
        {/* nelayan melompat di lantai DEPAN speedboat, setinggi ±dasar jet sampai sandaran sofa */}
        <Flip f={f} n="sorak" jadwal={siklus(fr(456), fr(464) + 60, 7, [1, 2, 3, 4, 3, 2])} x={720} bawah={1400} s={0.4} />
      </>
    ),
  },
];

// ---------- perakit ----------
const MULAI = ADEGAN.map((a) => Math.max(0, fr(a.mulai) - 4));
const akhirAdegan = (i: number) => (i + 1 < ADEGAN.length ? MULAI[i + 1] : DURASI);

const Lapis: React.FC<{ i: number; f: number; opasitas?: number; skala?: number }> = ({ i, f, opasitas = 1, skala = 1 }) => {
  const a = ADEGAN[i];
  const t0 = MULAI[i];
  const t1 = akhirAdegan(i);
  const kunci = a.kamera ? a.kamera(t0, t1) : dorong()(t0, t1);
  const k = (a.kameraLangsung && a.kameraLangsung(f)) || kamera(f, kunci);
  // penjepit kamera: skala ≥1,02 dan pandangan tidak keluar dari dunia 1080×1920
  const sk = Math.max(1.02, k.s);
  const cx = Math.min(W - 540 / sk - 12, Math.max(540 / sk + 12, k.cx));
  const cy = a.bebas ? k.cy : Math.min(H - 960 / sk - 12, Math.max(960 / sk + 12, k.cy));
  const tf = `translate(540 960) scale(${sk * skala}) translate(${-cx} ${-cy})`;
  return (
    <AbsoluteFill style={{ opacity: opasitas, background: a.P.langitAtas }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute" }}>
        <Defs P={a.P} />
        <DefsTriad />
        <FrameCtx.Provider value={f}>
          <g transform={tf}>{a.gambar(f, a.P, t0, t1)}</g>
        </FrameCtx.Provider>
        <rect width={W} height={H} fill={`url(#vinyet${a.P.id})`} />
      </svg>
      {a.d && <Kedalaman d={a.d(f)} bahaya={a.bahaya ? a.bahaya(f) : false} />}
      {a.teks && a.teks(f, t0, t1)}
      {a.istilah && f >= fr(a.istilah[1]) && (
        <div style={{ position: "absolute", inset: 0, top: 130, transform: `scale(${iv(f, fr(a.istilah[1]), fr(a.istilah[1]) + 8, 1.25, 1, keluar)})`, transformOrigin: "50% 22%", opacity: munculO(f, fr(a.istilah[1])) }}>
          <Istilah teks={a.istilah[0]} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- suara: VO + SFX di momen penting + suasana (owner 2026-10-27: lebih kaya tapi tidak berisik) ----------
// Semua berkas SFX dinormalkan dulu (−18 LUFS; kelompok BESAR −13 LUFS), lalu diberi level per KELOMPOK standar:
//   BESAR = momen puncak (emergency blow, keluar dari laut, pipa pecah, remuk) · SEDANG = aksi utama (turun/naik, ciprat, sonar, jet…)
//   KECIL = aksen (gelembung, centang, jam, kilau) · SUASANA = latar terus-menerus (ombak+camar, dengung bawah laut) — paling pelan
const BESAR = 1;
const SEDANG = 0.85;
const KECIL = 0.55;
const SUASANA = 0.22;
// [frame, berkas, volume, lama maks (frame)]; "k:" = SFX kapal selam (ElevenLabs), lainnya dipakai ulang dari terowongan
type Bunyi = [number, string, number, number?];
const BUNYI: Bunyi[] = [
  [fr(12), "kilau", KECIL], // uang $5 miliar muncul
  [fr(20), "k:turun", SEDANG], [fr(22), "k:naik", SEDANG], // kapal tenggelam … lalu naik lagi
  [fr(35), "k:centang", KECIL], // ALL CREW RETURN dicentang
  [fr(51), "k:speedboat-jet", SEDANG], // speedboat impian melesat masuk
  [fr(66), "k:gelembung-pelan", KECIL], [fr(73), "ciprat", SEDANG], [fr(73), "dentum", KECIL], // perahu ditekan → melompat naik
  [fr(91), "air", KECIL * 0.6, 70], [fr(95), "k:turun", SEDANG], // air masuk: dikecilkan (owner — terlalu besar) // air laut membanjiri tangki → menyelam
  [fr(111), "k:turun", KECIL], // terus tenggelam
  [fr(124), "k:gelembung-pelan", KECIL], // tangki trim diisi-kosongkan
  [fr(161) - 12, "k:derit-logam", BESAR], [fr(161), "dentum", SEDANG], // diremukkan tekanan
  [fr(173), "dentang", KECIL], // tabung baja tebal
  [fr(196), "k:jam-cepat", KECIL], // "seminggu" → habis sebelum makan siang
  [fr(212), "k:listrik", SEDANG], [fr(216), "k:gelembung-pelan", KECIL], // listrik → oksigen
  [fr(244), "k:sedot", SEDANG], // scrubber menyedot CO₂
  [fr(269), "k:ping", SEDANG], // sonar
  [fr(281), "sting-tegang", KECIL], [fr(287) - 2, "k:pipa-pecah", SEDANG * 0.7], [fr(287), "dentum", SEDANG], // pipa pecah
  [fr(303), "k:derit-logam", SEDANG], [fr(312), "hitung", KECIL, fr(322) - fr(312)],
  [fr(304), "k:getar-rusak", SEDANG], [fr(307), "k:getar-rusak", SEDANG * 0.8], [fr(315), "k:getar-rusak", KECIL], // tiap guncangan: getar + panel berderak (owner) // dinding berderit + uang menghitung mundur
  [fr(342), "ide", KECIL], [fr(359), "k:gelembung-pelan", KECIL], [fr(365), "k:naik", SEDANG], // teringat → ikan menggembung → melesat naik
  [fr(386), "k:tiup-darurat", BESAR], [fr(386), "dentum", BESAR], [fr(388), "k:gelembung-pelan", SEDANG], // EMERGENCY BLOW (paling besar)
  [fr(400), "k:naik", SEDANG], // kapal naik makin cepat
  [fr(423) - 22, "k:ceburan", BESAR], // melompat keluar laut
  [fr(439), "kilau", KECIL], // dapat uang
  [fr(444), "k:speedboat-jet", SEDANG], // speedboat benar-benar melaju
];
// suasana: [mulai, selesai, berkas, volume] — berkas panjang (disambung ffmpeg), masuk/keluar pelan 24 frame
// [mulai, selesai, berkas, volume, volume akhir (opsional: mengecil pelan dari volume → volume akhir)]
type Suasana = [number, number, string, number, number?];
const SUASANA_LIST: Suasana[] = [
  [0, fr(95) + 20, "ombak-camar", SUASANA, SUASANA * 0.5], // di permukaan: ombak + camar, turun pelan menjelang menyelam
  // camar pantai: jelas di awal, lalu SATU penurunan halus sampai hampir hilang sebelum adegan mimpi (owner: jangan naik-turun)
  [0, fr(47), "camar-pantai", KECIL * 0.75, 0.01],
  [fr(95), fr(340) - 10, "bawah-laut", SUASANA], // menyelam: dengung bawah laut
  [fr(281), fr(340) - 10, "dengung", SUASANA * 0.8], // krisis: dengung tegang
  // air terus masuk sejak pipa pecah, mengecil pelan (masih terdengar kecil saat dia merenung), lalu HILANG sebelum kenangan dimulai (owner)
  [fr(287) + 15, fr(340) - 16, "air-bocor", KECIL * 0.55, 0.01], // dikecilkan lagi (owner)
  [fr(288), fr(340) - 16, "alarm-darurat", KECIL * 0.55, 0.01], // alarm darurat pelan di latar, ikut mengecil sampai hilang
  [fr(340), fr(375), "ombak-camar", SUASANA * 0.6], // kenangan di permukaan (lebih pelan)
  [fr(375), fr(423), "bawah-laut", SUASANA],
  [fr(421), fr(456) + 10, "ombak-camar", SUASANA], // kembali ke permukaan
];
// musik latar (ElevenLabs Music v2, satu lagu 142 dtk, sengaja TIDAK dramatis — owner: konten penjelasan, jangan ramai):
// turun otomatis saat narator bicara (ducking), naik pelan di jeda; masuk 12 frame, keluar 45 frame
const DUCK: number[] = (() => {
  const target = Array.from({ length: DURASI }, (_, f) => {
    const t = f / 30;
    return KATA.some((k) => t >= k.s - 0.08 && t <= k.e + 0.12) ? 0.55 : 1;
  });
  const hasil: number[] = [];
  let v = 1;
  for (const x of target) {
    v += (x - v) * (x < v ? 0.35 : 0.08); // turun cepat, naik pelan
    hasil.push(v);
  }
  return hasil;
})();
const MUSIK = 0.38;
const Suara: React.FC = () => (
  <>
    <Audio src={`${staticFile("kapalselam/audio/vo.wav")}?v=2`} />
    <Audio src={`${staticFile("kapalselam/audio/musik.wav")}?v=1`} volume={(t) => MUSIK * DUCK[Math.min(DURASI - 1, t)] * Math.min(1, t / 12) * Math.min(1, Math.max(0, (DURASI - t) / 45))} />
    {SUASANA_LIST.map(([a, b, n, v, vAkhir], i) => (
      <Sequence key={`s${i}`} from={a} durationInFrames={b - a}>
        <Audio src={`${staticFile(n === "dengung" ? "terowongan/sfx/dengung.wav" : `kapalselam/sfx/${n}-panjang.wav`)}?v=2`} volume={(u) => v * (vAkhir === undefined ? 1 : 1 + (vAkhir / v - 1) * Math.min(1, u / (b - a - 24))) * Math.min(1, u / (vAkhir === undefined ? 24 : 6)) * Math.min(1, Math.max(0, (b - a - u) / 24))} />
      </Sequence>
    ))}
    {BUNYI.map(([t, n, v, maks], i) => {
      const src = n.startsWith("k:") ? `kapalselam/sfx/${n.slice(2)}.wav` : `terowongan/sfx/${n}.wav`;
      return (
        <Sequence key={i} from={Math.max(0, t)} durationInFrames={maks ?? 180}>
          <Audio src={`${staticFile(src)}?v=2`} volume={(u) => v * (maks ? Math.min(1, Math.max(0, (maks - u) / 10)) : 1)} />
        </Sequence>
      );
    })}
  </>
);

export const DURASI_KS = DURASI;

export const AnimasiKS: React.FC<{ gayaSub?: GayaSub }> = ({ gayaSub = "satu-pop" }) => {
  const f = useCurrentFrame();
  let c = 0;
  for (let i = 0; i < ADEGAN.length; i++) if (f >= MULAI[i]) c = i;
  const a = ADEGAN[c];
  const sebelum = c > 0 ? ADEGAN[c - 1] : null;
  const t = f - MULAI[c];
  const transisi = sebelum && sebelum.grup !== a.grup && t < FADE;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {transisi && a.tembus ? (
        <>
          <Lapis i={c - 1} f={f} skala={iv(t, 0, FADE, 1, 1.8, masuk)} opasitas={iv(t, 0, FADE, 1, 0)} />
          <Lapis i={c} f={f} skala={iv(t, 0, FADE, 0.6, 1, keluar)} opasitas={iv(t, 0, FADE * 0.6, 0, 1)} />
        </>
      ) : transisi ? (
        <>
          <Lapis i={c - 1} f={f} />
          <Lapis i={c} f={f} opasitas={iv(t, 0, FADE, 0, 1)} />
        </>
      ) : (
        <Lapis i={c} f={f} />
      )}
      <Subtitle f={f} gaya={gayaSub} />
      <Suara />
    </AbsoluteFill>
  );
};
