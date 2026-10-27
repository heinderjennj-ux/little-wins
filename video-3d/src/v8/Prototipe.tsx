// Koder Cilik Variasi 8 (duplikat iklan US v4, suara Kennisa, tokoh Bunda & Dimas)
// Little Wins · iklan US v4 "You're a parent, and you have a problem" (suara Lauren, 99 dtk).
// Prototipe: 24 adegan (L01–L24) mengikuti kata VO (kata.json). Panggung berlapis ala video Bugar:
// latar buram → cahaya di belakang fokus → tokoh (garis tepi) → bayangan tipis di bawah benda/tokoh → benda depan tajam
// → lapisan depan buram (DOF) → vinyet. Adegan riset memakai animasi hook (RuangHook/AnakHook) dengan waktu suara baru.
import { loadFont } from "@remotion/fonts";
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Audio, Easing, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { Bingkai, Jam, Jendela, LampuGantung, MejaDepan, Rak, Ruang, Tanaman } from "../diet/latar";
import { DepanDaun, DepanToples } from "../diet/detail";
import { Debu, Sinar } from "../diet/suasana";
import { INTENS, NAVY, Palet, SENJA, SIANG } from "../diet/warna";
import { PASANGAN, PasanganCtx } from "../gaya/tema";
import { W } from "../storybook/kit";
import { Bintang, Gelembung, HP, Label } from "../v7/alat";
import { SceneAnak as AnakHook } from "./hook/AnakHook";
import { SceneRuang as RuangHook } from "./hook/RuangHook";
import MATA from "./mata.json";
import UKURAN from "./pose-ukuran.json";
import { GarisKecepatan, Kilau, SapuanCahaya } from "./efek";
import { Arah, KartuRobo, Sel as RSel } from "./robo";
import { akhirKata, DURASI_V8, FPS, FrameCtx, fr, KATA, pop, useF } from "./waktu";

loadFont({ family: "Baloo2", url: staticFile("font/Baloo2-800.woff2"), weight: "800" });
loadFont({ family: "Baloo2", url: staticFile("font/Baloo2-700.woff2"), weight: "700" });
loadFont({ family: "Fredoka", url: staticFile("font/Fredoka.ttf") });

// ---------- tokoh AI: napas, goyang kecil, kedip ----------
type Mata = { mata: { cx: number; cy: number; rx: number; ry: number }[]; kulit: string };
const Pose: React.FC<{ n: string; x: number; bawah: number; tinggi: number; flip?: boolean; kaget?: number; gemetar?: boolean }> = ({ n, x, bawah, tinggi, flip, kaget, gemetar }) => {
  const f = useF();
  const [w, h] = (UKURAN as Record<string, number[]>)[n];
  const s = tinggi / h;
  const benih = (x % 97) / 10;
  let sq = 1 + 0.008 * Math.sin(f / 15 + benih);
  const rot = 0.45 * Math.sin(f / 37 + benih) + (gemetar ? 0.35 * Math.sin(f * 1.9) : 0);
  const gx = gemetar ? 1.4 * Math.sin(f * 2.3) + Math.sin(f * 3.7) : 0;
  if (kaget !== undefined && f >= fr(kaget)) sq *= 1 + 0.035 * Math.exp(-(f - fr(kaget)) / 6);
  const mata = (MATA as Record<string, Mata>)[n];
  const fase = Math.floor(f + benih * 31) % 97;
  const tutup = fase < 4 ? [0.55, 1, 1, 0.5][fase] : 0;
  return (
    <g transform={`translate(${x + gx} ${bawah}) rotate(${rot}) scale(${(flip ? -1 : 1) * s * (2 - sq)} ${s * sq}) translate(${-w / 2} ${-h})`}>
      <image href={staticFile(`v8/pose/${n}.png`)} width={w} height={h} />
      {tutup > 0.05 &&
        mata?.mata.map((m, i) => (
          <g key={i}>
            <clipPath id={`kd${n}${Math.round(x)}${i}`}>
              <ellipse cx={m.cx} cy={m.cy} rx={m.rx * 0.9} ry={m.ry * 0.9} />
            </clipPath>
            <rect x={m.cx - m.rx} y={m.cy - m.ry} width={m.rx * 2} height={m.ry * 2 * tutup} fill={mata.kulit} clipPath={`url(#kd${n}${Math.round(x)}${i})`} />
            <path d={`M${m.cx - m.rx * 0.8} ${m.cy - m.ry + m.ry * 2 * tutup} Q${m.cx} ${m.cy - m.ry + m.ry * 2 * tutup + m.ry * 0.25} ${m.cx + m.rx * 0.8} ${m.cy - m.ry + m.ry * 2 * tutup}`} stroke="#4A2A1A" strokeWidth={Math.max(4, m.rx * 0.14)} fill="none" strokeLinecap="round" />
          </g>
        ))}
    </g>
  );
};

// bayangan kontak tipis di bawah tokoh/benda (owner: "bayangan yang tipis aja di bawah")
const Bayang: React.FC<{ x: number; y: number; rx: number; ry?: number; o?: number }> = ({ x, y, rx, ry = 14, o = 0.2 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`rgba(28,22,60,${o})`} filter="url(#bayangHalus)" />
);

// benda/grafis muncul halus di kata ke-i
const Muncul: React.FC<{ i: number; x: number; y: number; children: React.ReactNode }> = ({ i, x, y, children }) => {
  const f = useF();
  const sc = pop(f, i);
  if (!sc) return null;
  return <g opacity={Math.min(1, (sc - 0.9) * 14)} transform={`translate(${x} ${y}) scale(${sc}) translate(${-x} ${-y})`}>{children}</g>;
};

const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, ...style }}>
    <defs>
      <filter id="bayangHalus" x="-30%" y="-200%" width="160%" height="500%">
        <feGaussianBlur stdDeviation={6} />
      </filter>
    </defs>
    {children}
  </svg>
);

// ---------- panggung berlapis ----------
const KameraCtx = createContext(0); // kemajuan adegan 0..1 (push-in & parallax)
const Panggung: React.FC<{ P: Palet; latar: React.ReactNode; tokoh?: React.ReactNode; depan?: React.ReactNode; fokus?: [number, number]; atas?: React.ReactNode; efek?: React.ReactNode; buram?: React.ReactNode; getarF?: number }> = ({ P, latar, tokoh, depan, fokus = [540, 1050], atas, efek, buram, getarF }) => {
  const fNow = useF();
  const dG = getarF === undefined ? -1 : fNow - getarF;
  const guncang = dG >= 0 && dG < 18 ? 16 * Math.exp(-dG / 5) * Math.sin(dG * 2.4) : 0;
  const k = useContext(KameraCtx);
  const blurLatar = parseFloat(P.blur.replace(/[^0-9.]/g, "")) + 1.5;
  const zoom = 1 + 0.045 * k;
  return (
    <AbsoluteFill style={{ background: P.dinding, scale: String(zoom), transformOrigin: `${fokus[0]}px ${fokus[1]}px`, translate: `${guncang}px ${guncang * 0.5}px` }}>
      <Svg style={{ filter: `blur(${blurLatar}px)`, scale: String(1 - 0.02 * k), transformOrigin: `${fokus[0]}px ${fokus[1]}px` }}>{latar}</Svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${P.gelap ? 420 : 460}px ${P.gelap ? 540 : 580}px at ${fokus[0]}px ${fokus[1]}px, ${P.cahaya}, rgba(0,0,0,0) 72%)` }} />
      <Svg>{efek}</Svg>
      <Svg>
        <defs>
          <filter id="tepiFokus" x="-5%" y="-5%" width="110%" height="110%">
            <feMorphology in="SourceAlpha" operator="dilate" radius={3} result="tebal" />
            <feFlood floodColor={P.garisFokus} />
            <feComposite in2="tebal" operator="in" result="tepi" />
            <feMerge>
              <feMergeNode in="tepi" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g filter="url(#tepiFokus)">{tokoh}</g>
      </Svg>
      <Svg style={{ scale: String(1 + 0.03 * k), transformOrigin: "50% 60%" }}>{depan}</Svg>
      <Svg>{atas}</Svg>
      {buram && <Svg style={{ filter: "blur(9px)", scale: String(1 + 0.06 * k), transformOrigin: "50% 60%" }}>{buram}</Svg>}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 62% at 50% 52%, rgba(0,0,0,0) 58%, ${P.vinyet} 100%)` }} />
    </AbsoluteFill>
  );
};

// ---------- latar rumah keluarga AS ----------
const Dapur: React.FC<{ P: Palet }> = ({ P }) => (
  <g>
    <Ruang P={P} lantaiY={1500} ubin />
    <Rak P={P} x={60} y={760} w={380} isi="piring" />
    <Jendela P={P} x={640} y={600} w={320} h={320} tirai malam={P.gelap} />
    <Jam P={P} x={520} y={700} r={50} jam={7} menit={30} />
    <Bingkai P={P} x={110} y={1010} w={200} h={150} />
    <LampuGantung P={P} x={820} y={420} />
  </g>
);
const RuangKeluarga: React.FC<{ P: Palet }> = ({ P }) => (
  <g>
    <Ruang P={P} lantaiY={1500} />
    <Bingkai P={P} x={80} y={640} w={240} h={180} />
    <Bingkai P={P} x={350} y={700} w={150} h={200} />
    <Jendela P={P} x={640} y={620} w={340} h={360} tirai malam={P.gelap} />
    <Rak P={P} x={70} y={1000} w={360} />
    <Tanaman P={P} x={990} y={1300} s={0.85} />
    <LampuGantung P={P} x={300} y={430} />
  </g>
);
// meja di depan + bayangan tipis tokoh di tepi meja
const MEJA = 1330;
const Meja: React.FC<{ P: Palet; bayang?: [number, number][] }> = ({ P, bayang = [] }) => (
  <g>
    <MejaDepan P={P} y={MEJA} />
    {bayang.map(([x, rx], i) => <Bayang key={i} x={x} y={MEJA + 8} rx={rx} ry={12} o={0.22} />)}
  </g>
);
const DaunKiri = () => <DepanDaun x={-30} y={1980} s={1.25} warna="#2E4A5A" />;
const DaunKanan = () => <DepanDaun x={1110} y={1980} s={1.1} warna="#2E4A5A" flip />;
const Uap: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useF();
  return <g>{[0, 1, 2].map((i) => { const k = ((f + i * 20) % 60) / 60; return <path key={i} d={`M${x - 20 + i * 20 + Math.sin(f / 14 + i) * 5} ${y - k * 40} q-14 -24 0 -48 q14 -24 0 -48`} stroke="#F4F1FA" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.6 * Math.sin(k * Math.PI)} />; })}</g>;
};
const Cangkir: React.FC<{ x: number; y: number; c?: string; uap?: boolean }> = ({ x, y, c = "#E8A33D", uap }) => (
  <g>
    <Bayang x={x} y={y + 4} rx={60} ry={10} />
    <rect x={x - 46} y={y - 96} width={92} height={98} rx={18} fill={c} />
    <path d={`M${x + 46} ${y - 76} q36 0 36 30 q0 30 -36 30`} stroke={c} strokeWidth={14} fill="none" />
    <rect x={x - 46} y={y - 96} width={92} height={18} rx={9} fill="#fff" opacity={0.35} />
    {uap && <Uap x={x} y={y - 110} />}
  </g>
);

// ---------- PR matematika (bahasa Inggris) ----------
const SOAL_PR = ["3 + 4 = 8", "5 + 2 = 7", "6 + 1 = 8", "2 + 2 = 4", "7 + 2 = 8", "4 + 5 = 9", "8 + 1 = 10", "3 + 3 = 6", "9 + 0 = 8", "6 + 2 = 9"];
const SALAH = [0, 2, 4, 6, 8, 9];
const Lembar: React.FC<{ x: number; y: number; s?: number; r?: number; nilai?: number; sorot?: number }> = ({ x, y, s = 1, r = 0, nilai, sorot }) => {
  const f = useF();
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
      <Bayang x={0} y={296} rx={230} ry={16} o={0.25} />
      <rect x={-220} y={-290} width={440} height={580} rx={12} fill="#FFFDF7" />
      <rect x={-220} y={-290} width={440} height={70} rx={12} fill="#F3EAD6" />
      <text x={-190} y={-243} fontFamily="Fredoka" fontWeight={700} fontSize={34} fill={W.navy}>PR Matematika</text>
      {SOAL_PR.map((q, i) => {
        const y0 = -180 + i * 46;
        const tanda = nilai !== undefined && f >= fr(nilai) + i * 2;
        const redup = sorot !== undefined && f >= fr(sorot) && i !== 0;
        return (
          <g key={i} opacity={redup ? 0.45 : 1}>
            <text x={-170} y={y0} fontFamily="Fredoka" fontWeight={600} fontSize={32} fill="#3B4A6A">{`${i + 1}. ${q}`}</text>
            {tanda && SALAH.includes(i) && <path d={`M90 ${y0 - 28} l28 28 m0 -28 l-28 28`} stroke={W.merah} strokeWidth={7} strokeLinecap="round" />}
            {tanda && !SALAH.includes(i) && <path d={`M86 ${y0 - 10} l12 12 l24 -26`} stroke="#2FB36B" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          </g>
        );
      })}
      {sorot !== undefined && f >= fr(sorot) && <ellipse cx={-60} cy={-192} rx={150} ry={36} fill="none" stroke={W.merah} strokeWidth={7} />}
    </g>
  );
};

// jam "3 min"
const JamMenit: React.FC<{ x: number; y: number; mulai: number }> = ({ x, y, mulai }) => {
  const f = useF();
  const putar = Math.max(0, f - fr(mulai)) * 34; // jarum menit berputar cepat (3 menit berlalu kilat)
  const ujung = (a: number, l: number) => [x + Math.sin((a * Math.PI) / 180) * l, y - Math.cos((a * Math.PI) / 180) * l];
  const [mx, my] = ujung(putar, 54), [jx, jy] = ujung(putar / 12 + 60, 36);
  return (
    <g>
      <Bayang x={x} y={y + 90} rx={60} ry={10} />
      <circle cx={x} cy={y} r={78} fill="#fff" stroke={W.navy} strokeWidth={9} />
      <path d={`M${x} ${y - 78} A78 78 0 ${putar % 360 > 180 ? 1 : 0} 1 ${ujung(Math.min(putar, 359), 78).join(" ")} L${x} ${y} Z`} fill={W.merah} opacity={0.3} />
      <path d={`M${x} ${y} L${mx} ${my} M${x} ${y} L${jx} ${jy}`} stroke={W.navy} strokeWidth={9} strokeLinecap="round" />
      <circle cx={x} cy={y} r={9} fill={W.navy} />
      <Label x={x} y={y + 128} teks="3 menit" warna={W.merah} ukuran={44} />
    </g>
  );
};

// ---------- judul & subtitle ----------
const SOROT: Record<string, string> = { k: "#FFD23F", m: "#FF6B6B", o: "#FFB04A" };
const Judul: React.FC<{ baris: [string, number, string?][] }> = ({ baris }) => {
  const f = useF();
  return (
    <div style={{ position: "absolute", left: 66, right: 50, top: 270, fontFamily: "Baloo2", fontWeight: 800, fontSize: 96, lineHeight: 1.1, color: "#fff", WebkitTextStroke: `11px ${NAVY}`, paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(20,28,50,.35)" }}>
      {baris.map(([t, i, hl], k) => {
        const sp = spring({ frame: f - fr(i) + 2, fps: FPS, config: { damping: hl ? 11 : 14, stiffness: 160 } });
        return (
          <div key={k}>
            <span style={{ display: "inline-block", opacity: Math.min(1, sp * 3), scale: String(hl ? 0.5 + 0.5 * sp : 1), translate: hl ? undefined : `0px ${(1 - sp) * 26}px`, transformOrigin: "20% 60%", ...(hl ? { color: SOROT[hl] } : {}) }}>{t}</span>
          </div>
        );
      })}
    </div>
  );
};
const BESAR: Record<string, string> = { koder: "Koder", cilik: "Cilik", lihat: "LIHAT", detail: "DETAIL", "hp-nya": "HP-nya", hp: "HP", "124": "124", "80": "80" };
const teksKata = (i: number) => {
  const x = KATA[i].w.replace(/["“”]/g, "").replace(/[.,!…]+$/, "").replace(/\.\.\.$/, "");
  const tanya = x.endsWith("?");
  const b = x.replace("?", "");
  return (BESAR[b.toLowerCase()] ?? b.toLowerCase()) + (tanya ? "?" : "");
};
const KELOMPOK = (() => {
  const out: number[][] = [];
  let cur: number[] = [];
  KATA.forEach((k, i) => {
    cur.push(i);
    if (/[.,?!…"]$/.test(k.w) || cur.length >= 3) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
})();
const Subtitle: React.FC = () => {
  const f = useF();
  let gi = -1;
  KELOMPOK.forEach((k, i) => {
    if (fr(k[0]) - 2 <= f) gi = i;
  });
  if (gi < 0) return null;
  const kel = KELOMPOK[gi];
  if (gi === KELOMPOK.length - 1 && f > akhirKata(kel[kel.length - 1]) + 24) return null;
  let aktif = kel[0];
  kel.forEach((i) => {
    if (fr(i) - 2 <= f) aktif = i;
  });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1441, textAlign: "center" }}>
      <span style={{ display: "inline-block", background: NAVY, color: "#fff", fontFamily: "Baloo2", fontWeight: 700, fontSize: 52, padding: "6px 34px 10px", borderRadius: 22, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(20,28,50,.25)" }}>
        {kel.map((i, n) => (
          <React.Fragment key={i}>
            {n > 0 && " "}
            <b style={{ fontWeight: 700, color: i === aktif ? "#FFD23F" : "#fff" }}>{teksKata(i)}</b>
          </React.Fragment>
        ))}
      </span>
    </div>
  );
};

// bohlam ide yang menyala & memancarkan garis cahaya
const BohlamIde: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useF();
  const nyala = 0.6 + 0.4 * Math.sin(f / 4);
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={110} fill="#FFE36B" opacity={0.25 * nyala} />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-5} y={-130} width={10} height={34} rx={5} fill="#FFB21E" transform={`rotate(${i * 45 + f})`} opacity={nyala} />)}
      <circle r={56} fill="#FFE36B" stroke={W.navy} strokeWidth={7} />
      <rect x={-24} y={46} width={48} height={30} rx={8} fill="#9AA6B8" stroke={W.navy} strokeWidth={6} />
      <path d="M-14 0 q14 -24 28 0" stroke="#E08600" strokeWidth={6} fill="none" />
    </g>
  );
};

// panggung kartu soal: dapur siang, cahaya jendela + debu (selalu ada yang bergerak), meja + bayangan tipis di bawah kartu
const PanggungKartu: React.FC<{ f: number; tokoh?: React.ReactNode; children: React.ReactNode; P?: Palet }> = ({ tokoh, children, P = SIANG }) => (
  <Panggung P={P} fokus={[480, 1000]} latar={<Dapur P={P} />}
    efek={<><Sinar id="sk" x={700} y={560} w={220} miring={-200} /><Debu seed="dk" x={200} y={620} w={700} h={700} /></>}
    tokoh={tokoh} depan={<><Meja P={P} bayang={tokoh ? [[900, 150]] : []} /><Bayang x={480} y={1400} rx={360} ry={16} o={0.22} /></>}
    atas={children} buram={<DaunKiri />} />
);

// momen intens (owner): kamera menghentak lalu warna bergeser ke palet malam dengan sorotan cahaya hangat di fokus,
// bertahan (tidak berkedip). a = adegan palet biasa, b = adegan yang sama dengan palet INTENS.
const GantiSorot: React.FC<{ dari: number; a: React.ReactNode; b: React.ReactNode }> = ({ dari, a, b }) => {
  const f = useF();
  const k = Math.max(0, Math.min(1, (f - dari + 2) / 10));
  return (
    <>
      {a}
      {k > 0 && <AbsoluteFill style={{ opacity: k }}>{b}</AbsoluteFill>}
    </>
  );
};

// "No try-again. No star.": tombol TRY AGAIN lalu 3 bintang ditempel di atas papan, masing-masing dicoret X;
// di "So guessing doesn't work anymore" tempelan memudar dan muncul "think first ✓".
const Coret: React.FC<{ x: number; y: number; r: number; dari: number }> = ({ x, y, r, dari }) => {
  const f = useF();
  const k1 = Math.max(0, Math.min(1, (f - dari) / 5)), k2 = Math.max(0, Math.min(1, (f - dari - 4) / 5));
  return (
    <g stroke={W.merah} strokeWidth={22} strokeLinecap="round">
      {k1 > 0 && <line x1={x - r} y1={y - r} x2={x - r + 2 * r * k1} y2={y - r + 2 * r * k1} />}
      {k2 > 0 && <line x1={x + r} y1={y - r} x2={x + r - 2 * r * k2} y2={y - r + 2 * r * k2} />}
    </g>
  );
};
const TempelanHP: React.FC<{ f: number }> = ({ f }) => {
  const pudar = Math.max(0, Math.min(1, (f - fr(162)) / 8));
  const tombol = pop(f, 155), bintang = pop(f, 159);
  return (
    <g>
      {pudar < 1 && (
        <g opacity={1 - pudar}>
          {tombol > 0 && (
            <g transform={`translate(540 880) scale(${tombol}) rotate(-4)`}>
              <rect x={-250} y={-70} width={500} height={150} rx={44} fill="#B32424" />
              <rect x={-250} y={-82} width={500} height={150} rx={44} fill={W.merah} stroke="#fff" strokeWidth={8} />
              <text y={22} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={80} fill="#fff">COBA LAGI</text>
            </g>
          )}
          {tombol > 0 && <Coret x={540} y={875} r={120} dari={fr(155) + 6} />}
          {bintang > 0 && [0, 1, 2].map((k) => (
            <g key={k} transform={`translate(${380 + k * 160} ${1150 - (k === 1 ? 30 : 0)}) scale(${bintang})`}>
              <Bintang x={0} y={0} r={74} rot={(k - 1) * 12} />
            </g>
          ))}
          {bintang > 0 && <Coret x={540} y={1135} r={150} dari={fr(159) + 6} />}
        </g>
      )}
      <Muncul i={162} x={540} y={545}><Label x={540} y={545} teks="pikir dulu ✓" warna="#2FB36B" ukuran={46} /></Muncul>
    </g>
  );
};

// ---------- soal robot gaya buku Robo Coder ----------
const PUZ = { robo: [0, 1] as RSel, baterai: [3, 2] as RSel, batu: [[2, 1], [1, 3], [3, 0], [0, 3]] as RSel[] };
const BENAR: Arah[] = ["bawah", "kanan", "kanan", "kanan"];
const BURU: Arah[] = ["kanan", "kanan", "kanan", "bawah"]; // tetap 4 panah (soal hanya muat 4); panah ke-2 menabrak batu
const KELIRU: Arah[] = ["kanan", "kanan", "bawah", "kanan"];
const KARTU = { x: 540, y: 1012, s: 0.76 };
const KARTU_KECIL = { x: 400, y: 1010, s: 0.62 };
const F_HAPUS_FIX = (k: number) => fr(204) + 2 + k * 2;
const F_TULIS_FIX = (i: number) => fr(204) + 14 + i * 4;
const F_LOMPAT_FIX = F_TULIS_FIX(3) + 24; // owner: jeda jelas antara menulis panah dan robot berjalan
const F_LOMPAT_BURU = fr(174) + 4;
const F_TABRAK = F_LOMPAT_BURU + 8 + 4;
const J_TRIK = { panah: ["bawah", "kanan", "kanan", "kanan"].map((arah, i) => ({ arah: arah as Arah, f: fr(146) + i * 7 })), kunci: [fr(146), fr(153)] as [number, number], lompat: [0, 1, 2, 3].map((i) => fr(153) + 6 + i * 8) };
// bunyi: menulis panah = goresan pensil pendek; robot berjalan = "tak" per langkah
const TULIS = (f: number): Bunyi => [f, "lw2/sfx/pensil-pendek.wav", 0.55];
const LANGKAH = (f: number): Bunyi => [f, "sfx/pop.wav", 0.5];

const RISET = (f: number) => (
  <PasanganCtx.Provider value={PASANGAN.E}>
    <RuangHook beku={f} />
  </PasanganCtx.Provider>
);
const ANAK_APP = (f: number) => (
  <PasanganCtx.Provider value={PASANGAN.E}>
    <AnakHook dari={0} beku={f} />
  </PasanganCtx.Provider>
);

// panah "↓" memantul (mengajak komentar di bawah)
const PanahBawah: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useF();
  const b = Math.abs(Math.sin(f / 7)) * 26;
  return <path transform={`translate(${x} ${y + b})`} d="M-22 -40 h44 v40 h30 l-52 56 l-52 -56 h30z" fill="#FFB21E" stroke={NAVY} strokeWidth={6} strokeLinejoin="round" />;
};

type Masuk = "potong" | "sambung" | "fade" | "geserKiri" | "geserKanan" | "zoom" | "mundur" | "kilat" | "putar" | "iris" | "sapu" | "dorong";
type Bunyi = [number, string, number?, number?, number?]; // [frame, berkas di public/, volume, kecepatan putar, maks frame]
type Adegan = {
  nama: string; mulai: number; judul: [string, number, string?][]; isi: (f: number) => React.ReactNode;
  masuk?: Masuk; grup?: string; sfx?: Bunyi[]; efek?: React.ReactNode; punch?: number[]; getar?: number[];
};
const S = (n: string) => `lw2/sfx/${n}.wav`;
const L = (n: string) => `sfx/${n}.wav`;

const ADEGAN: Adegan[] = [
  // ===== masalah =====
  { nama: "You're a parent with a problem", mulai: 0, masuk: "potong", judul: [["Kamu orang tua", 0], ["punya masalah.", 4, "m"]], punch: [3], getar: [3],
    sfx: [[fr(3), S("sting-tegang"), 0.55]],
    // owner: awalnya ibu memegang PR sambil tersenyum (belum tahu), di "and you have a problem" langsung sedih + layar bergetar
    isi: (f) => {
      const ad = (P: Palet) => <Panggung P={P} fokus={[540, 1000]} latar={<Dapur P={P} />}
        efek={<><Sinar id="s1" x={700} y={560} w={200} miring={-160} /><Debu seed="d1" x={420} y={600} w={420} h={700} /></>}
        tokoh={<Pose n={f < fr(3) ? "ibu-senyum" : "ibu-kaget"} x={540} bawah={1420} tinggi={820} kaget={3} gemetar={f >= fr(3)} />} depan={<><Meja P={P} bayang={[[540, 240]]} /><Cangkir x={900} y={1350} uap /></>}
        buram={<DaunKiri />} />;
      return <GantiSorot dari={fr(3)} a={ad(SENJA)} b={ad(INTENS)} />;
    } },
  { nama: "10 problems in 3 minutes", mulai: 7, masuk: "fade", judul: [["10 soal", 13], ["cuma 3 menit", 16, "k"]], punch: [17],
    sfx: [[fr(12), S("pensil"), 0.5], [fr(16), S("jam-cepat"), 0.6, 1.7, 24], [fr(17), L("pop"), 0.5]],
    isi: () => <Panggung P={SENJA} fokus={[620, 1050]} latar={<Dapur P={SENJA} />}
      tokoh={<Pose n="anak-cepat" x={640} bawah={1420} tinggi={760} />}
      depan={<><Meja P={SENJA} bayang={[[640, 230]]} /><Lembar x={300} y={1300} s={0.5} r={-8} /></>}
      atas={<Muncul i={17} x={230} y={800}><JamMenit x={230} y={800} mulai={17} /></Muncul>} buram={<DaunKanan />} /> },
  { nama: "6 wrong · 3 + 4 = 8", mulai: 18, masuk: "zoom", judul: [["Salah 6.", 21], ["3 + 4 = 8", 22, "m"]], punch: [21, 22],
    sfx: [[fr(21), S("salah"), 0.6], ...SALAH.map((i) => [fr(21) + i * 2, L("tek"), 0.35] as Bunyi), [fr(22), S("dentum"), 0.7]],
    isi: () => {
      const ad = (P: Palet) => <Panggung P={P} fokus={[480, 1050]} latar={<Dapur P={P} />}
        tokoh={<Pose n="ibu-kaget" x={880} bawah={1420} tinggi={520} />}
        depan={<Meja P={P} bayang={[[880, 150]]} />} atas={<Lembar x={440} y={1010} s={1.12} nilai={21} sorot={22} />} buram={<><DaunKiri /><DepanToples x={1060} y={1960} s={1.1} /></>} />;
      return <GantiSorot dari={fr(21)} a={ad(SENJA)} b={ad(INTENS)} />;
    } },
  { nama: "Here's how you fix it", mulai: 28, masuk: "fade", judul: [["Begini cara", 28], ["memperbaikinya.", 29, "k"]], punch: [30],
    sfx: [[fr(30), S("kilau"), 0.5]], efek: <SapuanCahaya di={30} />,
    isi: () => <Panggung P={SIANG} fokus={[540, 1000]} latar={<RuangKeluarga P={SIANG} />}
      efek={<><Sinar id="s4" x={720} y={600} w={220} miring={-200} /><Debu seed="d4" x={380} y={600} w={500} h={700} /></>}
      tokoh={<Pose n="ibu-yakin" x={540} bawah={1420} tinggi={840} />} depan={<Meja P={SIANG} bayang={[[540, 240]]} />} buram={<DaunKanan />} /> },
  { nama: "Learning apps every day", mulai: 31, masuk: "fade", judul: [["Aplikasi belajar", 33], ["setiap hari", 35, "k"]],
    sfx: [34, 35, 36].map((k) => [fr(k), L("ding-kc"), 0.4] as Bunyi),
    isi: (f) => <Panggung P={SIANG} fokus={[540, 1050]} latar={<RuangKeluarga P={SIANG} />}
      tokoh={<Pose n="anak-tap" x={540} bawah={1420} tinggi={800} />} depan={<><Meja P={SIANG} bayang={[[540, 200]]} /><Cangkir x={180} y={1350} c="#5B7BD8" /></>}
      atas={<g>{[0, 1, 2].map((k) => <Muncul key={k} i={34 + k} x={760 + k * 90} y={760}><Bintang x={760 + k * 90} y={760 + Math.sin(f / 8 + k) * 10} r={38} rot={Math.sin(f / 11 + k) * 12} /></Muncul>)}</g>} buram={<DaunKiri />} /> },
  // ===== riset (animasi hook dengan waktu suara baru) =====
  { nama: "Researchers checked 124 apps", mulai: 37, masuk: "fade", grup: "riset", judul: [["Peneliti memeriksa", 41], ["124 aplikasi anak", 44, "k"]],
    sfx: [[fr(43), L("mouse-click"), 0.4]], isi: RISET },
  { nama: "Most of them scored low", mulai: 51, masuk: "sambung", grup: "riset", judul: [["Kebanyakan", 51], ["nilainya rendah.", 52, "m"]],
    sfx: [[fr(53), S("salah"), 0.85], [fr(53), S("dentum"), 0.35]], isi: RISET },
  { nama: "Kids just tap, tap, tap", mulai: 54, masuk: "zoom", grup: "hp", judul: [["Anak cuma", 55], ["tap, tap, tap.", 57, "k"]],
    sfx: [[fr(57), L("tek"), 0.9], [fr(57), L("benar-robo"), 0.7], [fr(58), L("tek"), 0.9], [fr(58), L("ding-kc"), 0.45], [fr(59), L("tek"), 0.9], [fr(59), L("ding-kc"), 0.45], [fr(59) + 8, S("kilau"), 0.6]],
    isi: ANAK_APP },
  { nama: "Wrong? Tap again. Right? Prize", mulai: 64, masuk: "sambung", grup: "hp", judul: [["Salah? Tap lagi.", 64], ["Benar? Dapat hadiah!", 69, "o"]],
    sfx: [[fr(65), L("tek"), 0.9], [fr(65), S("salah"), 0.8], [fr(67), L("tek"), 0.9], [fr(70), L("benar-robo"), 0.8], [fr(73), S("kado"), 0.8]],
    isi: ANAK_APP },
  { nama: "Guess first, think later", mulai: 74, masuk: "sambung", grup: "hp", judul: [["Menebak dulu,", 83], ["mikir belakangan.", 85, "m"]],
    sfx: [[fr(83), "diet/sfx/sadar.mp3", 0.6]], isi: ANAK_APP },
  // ===== solusi langkah demi langkah =====
  { nama: "So you do something crazy", mulai: 87, masuk: "fade", judul: [["Lakukan hal", 87], ["yang nggak biasa.", 92, "o"]], punch: [92],
    sfx: [[fr(92), S("ide"), 0.8]], efek: <GarisKecepatan di={92} cx={540} cy={950} />,
    isi: () => <Panggung P={SIANG} fokus={[540, 1000]} latar={<RuangKeluarga P={SIANG} />}
      efek={<><Sinar id="s11" x={720} y={600} w={220} miring={-200} /><Debu seed="d11" x={400} y={620} w={460} h={700} /></>}
      tokoh={<Pose n="ibu-ide" x={540} bawah={1420} tinggi={840} kaget={92} />} depan={<Meja P={SIANG} bayang={[[540, 240]]} />}
      atas={<Muncul i={92} x={330} y={700}><BohlamIde x={330} y={700} /></Muncul>} buram={<DaunKiri />} /> },
  { nama: "Don't take the phone away", mulai: 94, masuk: "fade", judul: [["Nggak perlu", 94], ["merebut HP-nya.", 97, "k"]],
    sfx: [[fr(98), L("pop"), 0.5]],
    isi: (f) => <Panggung P={SIANG} fokus={[420, 1050]} latar={<RuangKeluarga P={SIANG} />}
      tokoh={<Pose n="ibu-jelas" x={420} bawah={1420} tinggi={820} />}
      depan={<><Meja P={SIANG} bayang={[[420, 230], [830, 110]]} /><HP x={830} y={1180 + Math.sin(f / 9) * 8} s={0.55} r={8 + Math.sin(f / 13) * 3}><rect x={-116} y={-212} width={232} height={424} fill="#C9D3F5" /><Bintang x={0} y={-40} r={50} rot={f * 2} /></HP></>}
      atas={<Muncul i={98} x={830} y={900}><Label x={830} y={900} teks="HP tetap boleh ✓" warna="#2FB36B" ukuran={40} /></Muncul>} buram={<DaunKanan />} /> },
  { nama: "A game with no guessing", mulai: 99, masuk: "fade", judul: [["Permainan yang", 99], ["nggak bisa ditebak.", 104, "k"]],
    sfx: [[fr(100), L("page-turn"), 0.6], [fr(104), S("kilau"), 0.4]],
    isi: () => <Panggung P={SENJA} fokus={[540, 1000]} latar={<RuangKeluarga P={SENJA} />}
      efek={<Sinar id="s13" x={720} y={600} w={220} miring={-200} />}
      tokoh={<Pose n="ibu-kasih" x={540} bawah={1420} tinggi={840} />} depan={<Meja P={SENJA} bayang={[[540, 240]]} />}
      atas={<svg><Kilau dari={104} titik={[[420, 1150, 26], [660, 1170, 22], [540, 1080, 18], [700, 1260, 24]]} /></svg>} buram={<DaunKiri />} /> },
  { nama: "A worksheet? They'll rush it", mulai: 107, masuk: "fade", judul: [["Lembar soal biasa?", 110], ["Pasti buru-buru.", 114, "m"]], getar: [116],
    sfx: [[fr(110), L("page-turn"), 0.5], [fr(116), S("pensil"), 0.7], [fr(116) + 12, S("salah"), 0.4]],
    isi: (f) => <Panggung P={SENJA} fokus={[600, 1050]} latar={<Dapur P={SENJA} />}
      tokoh={<Pose n="anak-cepat" x={640} bawah={1420} tinggi={760} />}
      depan={<><Meja P={SENJA} bayang={[[640, 230]]} /><Lembar x={290} y={1290} s={0.5} r={-6} nilai={116} /></>}
      atas={f >= fr(116) ? <g>{[0, 1, 2].map((k) => <path key={k} d={`M${215 + k * 10} ${1190 + k * 55} q25 -25 50 0 t50 0 t50 0`} stroke={W.merah} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.8} strokeDasharray={300} strokeDashoffset={300 * Math.max(0, 1 - (f - fr(116) - k * 4) / 8)} />)}</g> : null} buram={<DaunKanan />} /> },
  // ===== kartu Robo Coder (gaya buku) =====
  { nama: "A robot puzzle on paper", mulai: 118, masuk: "fade", grup: "kartu", judul: [["Teka-teki robot", 122], ["di kertas", 124, "k"]],
    sfx: [[fr(119), L("page-turn"), 0.6], [fr(127), L("pop"), 0.6], ...[0, 1, 2, 3].map((k) => [fr(130) + k * 3, L("tek"), 0.4] as Bunyi), [fr(132), L("ding-kc"), 0.6]],
    isi: (f) => <PanggungKartu f={f}><KartuRobo f={f} {...KARTU} {...PUZ} j={{ kartu: fr(119), robo: fr(127), batu: [0, 1, 2, 3].map((k) => fr(130) + k * 3), baterai: fr(132) }} /></PanggungKartu> },
  { nama: "Write arrows to the battery", mulai: 133, masuk: "sambung", grup: "kartu", judul: [["Tulis panah", 134], ["sampai ke baterai", 138, "k"]],
    sfx: [...BENAR.map((_, i) => TULIS(fr(133) + i * 7)), ...BENAR.map((_, i) => LANGKAH(fr(137) + i * 9 + 6)), [fr(137) + 36, L("selesai-robo"), 0.6]],
    isi: (f) => <PanggungKartu f={f}><KartuRobo f={f} {...KARTU} {...PUZ} j={{ panah: BENAR.map((arah, i) => ({ arah, f: fr(133) + i * 7 })), lompat: BENAR.map((_, i) => fr(137) + i * 9) }} /></PanggungKartu> },
  { nama: "Trick: robot moves only after all arrows", mulai: 144, masuk: "fade", grup: "kartu2", judul: [["Ini triknya:", 144], ["panah dulu.", 151, "k"]],
    sfx: [[fr(146), L("tek"), 0.6], ...BENAR.map((_, i) => TULIS(fr(146) + i * 7)), [fr(153), S("buka-kunci"), 0.7], ...BENAR.map((_, i) => LANGKAH(fr(153) + 6 + i * 8 + 6))],
    isi: (f) => <PanggungKartu f={f}><KartuRobo f={f} {...KARTU} {...PUZ} j={J_TRIK} /></PanggungKartu> },
  { nama: "No try-again button, no star", mulai: 155, masuk: "sambung", grup: "kartu2", judul: [["Nggak ada coba lagi.", 155], ["Nggak ada bintang.", 159, "m"]], punch: [159],
    sfx: [[fr(155), L("pop"), 0.5], [fr(155) + 6, S("salah"), 0.6], [fr(159), L("ding-kc"), 0.4], [fr(159) + 6, S("salah"), 0.6], [fr(162), S("kilau"), 0.4]],
    isi: (f) => <PanggungKartu f={f}>
      <KartuRobo f={f} {...KARTU} {...PUZ} j={J_TRIK} />
      <TempelanHP f={f} />
    </PanggungKartu> },
  { nama: "Day one: they rush, robot crashes", mulai: 167, masuk: "zoom", judul: [["Hari pertama:", 167], ["NABRAK!", 175, "m"]],
    sfx: [...BURU.map((_, i) => TULIS(fr(169) + i * 4)), LANGKAH(F_LOMPAT_BURU + 6), [F_TABRAK, L("bonk"), 0.9], [F_TABRAK, S("dentum"), 0.5]],
    isi: (f) => {
      const ad = (P: Palet) => <Panggung P={P} fokus={[420, 1000]} latar={<Dapur P={P} />} getarF={F_TABRAK}
        tokoh={f >= F_TABRAK + 2 ? <Pose n="anak-cemberut" x={900} bawah={1420} tinggi={480} kaget={175} /> : null}
        depan={<Meja P={P} bayang={[[900, 140]]} />}
        atas={<KartuRobo f={f} {...KARTU_KECIL} {...PUZ} j={{ panah: BURU.map((arah, i) => ({ arah, f: fr(169) + i * 4, salah: i === 1 && f >= F_TABRAK })), lompat: BURU.map((_, i) => F_LOMPAT_BURU + i * 8) }} />} buram={<DaunKiri />} />;
      return <GantiSorot dari={F_TABRAK} a={ad(SIANG)} b={ad(INTENS)} />;
    } },
  { nama: "Sit next to them: finger first", mulai: 177, masuk: "fade", judul: [["Duduk di sebelahnya:", 179], ["pakai jari dulu.", 190, "k"]],
    sfx: [[fr(187), L("pop"), 0.5], [fr(190), S("kilau"), 0.4]],
    isi: () => <Panggung P={SENJA} fokus={[540, 1050]} latar={<Dapur P={SENJA} />}
      efek={<><Sinar id="s19" x={720} y={600} w={220} miring={-200} /><Debu seed="d19" x={300} y={620} w={600} h={700} /></>}
      tokoh={<><Pose n="ibu-tunjuk" x={300} bawah={1420} tinggi={780} /><Pose n="anak-telusur" x={790} bawah={1420} tinggi={640} /></>}
      depan={<><Meja P={SENJA} bayang={[[300, 220], [790, 200]]} /><g transform="translate(560 1330) rotate(4) scale(0.24)"><KartuRobo f={0} x={0} y={0} s={1} {...PUZ} j={{ panah: KELIRU.map((arah) => ({ arah, f: 0 })) }} /></g></>}
      atas={<Muncul i={187} x={540} y={590}><Gelembung x={540} y={590} teks="Jalankan robotnya pakai jari dulu." ukuran={34} /></Muncul>} buram={<DaunKanan />} /> },
  { nama: "“Wait… this one crashes.”", mulai: 192, masuk: "fade", grup: "kartu3", judul: [["“Eh, bentar…", 199], ["yang ini nabrak.”", 201, "m"]], punch: [199],
    sfx: [[fr(193), L("tek"), 0.4], [fr(196), L("tek"), 0.4], [fr(199), "diet/sfx/sadar.mp3", 0.6], [fr(199), L("tek"), 0.6]],
    isi: (f) => {
      const ad = (P: Palet) => <PanggungKartu f={f} P={P} tokoh={<Pose n="anak-tunggu" x={900} bawah={1420} tinggi={500} kaget={199} />}><KartuRobo f={f} {...KARTU_KECIL} {...PUZ} j={{ panah: KELIRU.map((arah) => ({ arah, f: 0 })), jari: { jalur: [[0, 1], [1, 1], [2, 1]], f: [fr(193), fr(196), fr(199)], stop: true } }} /></PanggungKartu>;
      return <GantiSorot dari={fr(199)} a={ad(SIANG)} b={ad(INTENS)} />;
    } },
  { nama: "They fix it themselves", mulai: 204, masuk: "sambung", grup: "kartu3", judul: [["Dia perbaiki", 204], ["sendiri.", 207, "k"]],
    sfx: [[F_HAPUS_FIX(0) - 4, S("hapus"), 0.7], ...BENAR.map((_, i) => TULIS(F_TULIS_FIX(i))), ...BENAR.map((_, i) => LANGKAH(F_LOMPAT_FIX + i * 7 + 6)), [F_LOMPAT_FIX + 30, L("selesai-robo"), 0.7]],
    isi: (f) => <PanggungKartu f={f} tokoh={<Pose n="anak-hapus" x={900} bawah={1420} tinggi={520} />}><KartuRobo f={f} {...KARTU_KECIL} {...PUZ} j={{ panah: [...KELIRU.map((arah, k) => ({ arah, f: 0, hapus: F_HAPUS_FIX(k), slot: k })), ...BENAR.map((arah, i) => ({ arah, f: F_TULIS_FIX(i), slot: i }))], lompat: BENAR.map((_, i) => F_LOMPAT_FIX + i * 7) }} /></PanggungKartu> },
  { nama: "Check first, then answer", mulai: 212, masuk: "fade", judul: [["Cek dulu,", 220], ["baru jawab.", 222, "k"]],
    // owner: untuk orang tua, cukup hangat & tenang (tanpa sorak, kilau, sapuan cahaya, bokeh)
    isi: () => <Panggung P={SENJA} fokus={[540, 1000]} latar={<RuangKeluarga P={SENJA} />}
      efek={<Sinar id="s22" x={700} y={600} w={260} miring={-220} />}
      tokoh={<><Pose n="ibu-bangga" x={300} bawah={1420} tinggi={780} /><Pose n="anak-sorak" x={780} bawah={1420} tinggi={700} /></>}
      depan={<Meja P={SENJA} bayang={[[300, 220], [780, 220]]} />} buram={<DaunKiri />} /> },
  { nama: "Namanya Koder Cilik", mulai: 224, masuk: "fade", judul: [["Namanya", 227], ["Koder Cilik", 228, "k"]], punch: [228],
    sfx: [[fr(228), S("kilau"), 0.6], [fr(230), L("page-turn"), 0.5]],
    // mockup produk Koder Cilik (3 lembar: sampul di tengah, 2 halaman soal) + kepala robot di depan
    isi: (f) => <Panggung P={SIANG} fokus={[540, 1000]} latar={<RuangKeluarga P={SIANG} />}
      efek={<Sinar id="s23" x={700} y={600} w={260} miring={-220} />}
      depan={<><Meja P={SIANG} /><Bayang x={540} y={1340} rx={430} ry={18} o={0.25} /></>}
      atas={<>
        <Muncul i={227} x={540} y={980}><image href={staticFile("v7/produk.png")} x={540 - 480} y={980 - 307 + Math.sin(f / 30) * 4} width={960} height={613} /></Muncul>
        <svg><Kilau dari={228} titik={[[240, 700, 24], [840, 700, 22], [900, 1180, 20]]} /></svg>
        <Muncul i={230} x={540} y={1395}><Label x={540} y={1395} teks="80 soal · mudah → menantang" warna="#F28C38" ukuran={36} /></Muncul>
      </>} buram={<DaunKanan />} /> },
  { nama: "Klik LIHAT DETAIL", mulai: 243, masuk: "fade", judul: [["Suka buru-buru?", 247], ["Klik LIHAT DETAIL", 254, "k"]], punch: [256],
    sfx: [[fr(254), L("pop"), 0.5], [fr(256), L("ding-kc"), 0.5]],
    isi: (f) => <Panggung P={SENJA} fokus={[540, 1000]} latar={<RuangKeluarga P={SENJA} />}
      tokoh={<Pose n="anak-pamer" x={540} bawah={1420} tinggi={760} />} depan={<Meja P={SENJA} bayang={[[540, 210]]} />}
      atas={<>
        <Muncul i={254} x={540} y={1230}><g transform={`translate(540 1230) scale(${1 + 0.04 * Math.max(0, Math.sin((f - fr(256)) / 6))})`}>
          <Bayang x={0} y={70} rx={300} ry={14} />
          <rect x={-300} y={-62} width={600} height={124} rx={62} fill="#1F5FB8" />
          <rect x={-300} y={-70} width={600} height={124} rx={62} fill="#2F80ED" stroke="#fff" strokeWidth={6} />
          <text y={16} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={58} fill="#fff">LIHAT DETAIL ↓</text>
        </g></Muncul>
        <Muncul i={259} x={540} y={1340}><PanahBawah x={540} y={1350} /></Muncul>
      </>} buram={<DaunKiri />} /> },
];

const mulaiAdegan = (n: number) => (n === 0 ? 0 : fr(ADEGAN[n].mulai) - 4);
const akhirAdegan = (n: number) => (n + 1 < ADEGAN.length ? mulaiAdegan(n + 1) : DURASI_V8);
// kamera 0..1 dihitung per grup supaya adegan "sambung" tidak melompat zoom-nya
const rentangKamera = (n: number) => {
  const g = ADEGAN[n].grup;
  if (!g) return [mulaiAdegan(n), akhirAdegan(n)];
  const anggota = ADEGAN.map((a, i) => i).filter((i) => ADEGAN[i].grup === g);
  return [mulaiAdegan(anggota[0]), akhirAdegan(anggota[anggota.length - 1])];
};

// punch-in kamera (antisipasi 3 frame → hentak) & getar
const dorongKata = (f: number, kata: number[] = []) =>
  kata.reduce((s, i) => {
    const d = f - fr(i);
    if (d >= -3 && d < 0) return s - 0.015 * ((d + 3) / 3);
    if (d >= 0) return s + 0.07 * Math.exp(-d / 7);
    return s;
  }, 0);
const getarKata = (f: number, kata: number[] = []) =>
  kata.reduce((s, i) => {
    const d = f - fr(i);
    return d >= 0 && d < 16 ? s + 12 * Math.exp(-d / 5) * Math.sin(d * 2.3) : s;
  }, 0);

const Lapisan: React.FC<{ n: number; f: number }> = ({ n, f }) => {
  const [a, b] = rentangKamera(n);
  const k = Math.max(0, Math.min(1, (f - a) / Math.max(1, b - a)));
  const A = ADEGAN[n];
  const sc = 1 + dorongKata(f, A.punch);
  const g = getarKata(f, A.getar);
  return (
    <KameraCtx.Provider value={k}>
      <AbsoluteFill style={{ scale: String(sc), translate: `${g}px ${g * 0.4}px` }}>{A.isi(f)}</AbsoluteFill>
      {A.efek}
    </KameraCtx.Provider>
  );
};

// ---------- transisi antar adegan (bervariasi, 14 frame, ease in-out) ----------
const T = 14;
const ease = Easing.inOut(Easing.cubic);
const gayaMasuk = (jenis: Masuk, k: number): React.CSSProperties => {
  const e = ease(k);
  switch (jenis) {
    case "geserKiri": return { translate: `${(1 - e) * 1080}px 0px`, filter: `blur(${(1 - e) * 10}px)` };
    case "geserKanan": return { translate: `${-(1 - e) * 1080}px 0px`, filter: `blur(${(1 - e) * 10}px)` };
    case "zoom": return { scale: String(1.35 - 0.35 * e), filter: `blur(${(1 - e) * 14}px)`, opacity: Math.min(1, e * 1.6) };
    case "mundur": return { scale: String(1.5 - 0.5 * e), opacity: Math.min(1, e * 2), filter: `blur(${(1 - e) * 8}px)` };
    case "kilat": return { opacity: k >= 0.5 ? 1 : 0, scale: String(1.08 - 0.08 * e) };
    case "putar": return { rotate: `${(1 - e) * -14}deg`, scale: String(1.3 - 0.3 * e), opacity: Math.min(1, e * 1.5), filter: `blur(${(1 - e) * 8}px)` };
    case "iris": return { clipPath: `circle(${e * 120}% at 50% 52%)` };
    case "sapu": return { clipPath: `inset(0 ${(1 - e) * 100}% 0 0)` };
    case "dorong": return { translate: `0px ${(1 - e) * 1920}px` };
    case "fade": return { opacity: e };
    default: return {};
  }
};
const gayaKeluar = (jenis: Masuk, k: number): React.CSSProperties => {
  const e = ease(k);
  switch (jenis) {
    case "geserKiri": return { translate: `${-e * 1080}px 0px`, filter: `blur(${e * 10}px)` };
    case "geserKanan": return { translate: `${e * 1080}px 0px`, filter: `blur(${e * 10}px)` };
    case "zoom": return { scale: String(1 + 0.5 * e), filter: `blur(${e * 14}px)`, opacity: 1 - e };
    case "mundur": return { scale: String(1 - 0.3 * e), opacity: 1 - e };
    case "kilat": return { opacity: k < 0.5 ? 1 : 0 };
    case "putar": return { rotate: `${e * 14}deg`, scale: String(1 + 0.3 * e), opacity: 1 - e };
    case "dorong": return { translate: `0px ${-e * 600}px`, filter: `brightness(${1 - 0.4 * e})` };
    default: return {};
  }
};
const BUNYI_TRANSISI: Partial<Record<Masuk, [string, number]>> = {
  // owner: transisi heboh hanya untuk momen cepat; fade biasa tanpa bunyi
  zoom: [S("zoom-masuk"), 0.5], geserKiri: [S("whoosh-transisi"), 0.5], geserKanan: [S("whoosh-transisi"), 0.5],
};
const SFX_SEMUA: Bunyi[] = [
  ...ADEGAN.flatMap((a, n) => {
    const t = a.masuk && BUNYI_TRANSISI[a.masuk];
    return t && n > 0 ? [[mulaiAdegan(n) - 2, t[0], t[1]] as Bunyi] : [];
  }),
  ...ADEGAN.flatMap((a) => a.sfx ?? []),
];

export const AnimaticV8: React.FC = () => {
  const f = useCurrentFrame();
  const aktif = ADEGAN.map((_, n) => n).filter((n) => f >= mulaiAdegan(n) && f < akhirAdegan(n) + T);
  const n = aktif[aktif.length - 1];
  const masukN = ADEGAN[n].masuk ?? "potong";
  const kN = (f - mulaiAdegan(n)) / T;
  const kilat = masukN === "kilat" && kN >= 0 && kN <= 1 ? 1 - Math.abs(2 * kN - 1) : 0;
  return (
    <AbsoluteFill style={{ background: "#1E2A44" }}>
      {aktif.map((m) => {
        const kMasuk = (f - mulaiAdegan(m)) / T;
        const jenis = ADEGAN[m].masuk ?? "potong";
        let gaya: React.CSSProperties = {};
        if (m === n && kMasuk >= 0 && kMasuk < 1 && jenis !== "sambung" && jenis !== "potong") gaya = gayaMasuk(jenis, kMasuk);
        if (m < n) {
          const jenisBerikut = ADEGAN[m + 1].masuk ?? "potong";
          const kKeluar = (f - mulaiAdegan(m + 1)) / T;
          if (jenisBerikut === "sambung" || jenisBerikut === "potong") return null;
          if (jenisBerikut === "fade") gaya = {};
          else gaya = gayaKeluar(jenisBerikut, Math.max(0, Math.min(1, kKeluar)));
        }
        return (
          <AbsoluteFill key={m} style={gaya}>
            <Lapisan n={m} f={f} />
          </AbsoluteFill>
        );
      })}
      {kilat > 0 && <AbsoluteFill style={{ background: "#FFF8E8", opacity: kilat }} />}
      <Judul baris={ADEGAN[n].judul} />
      <Subtitle />
      <Audio src={staticFile("v8/vo.wav")} />
      <Audio src={staticFile("v7/musik.mp3")} volume={(fr2) => 0.13 * Math.min(1, (DURASI_V8 - fr2) / 45)} />
      {SFX_SEMUA.map(([t, berkas, vol], i) => (
        <Sequence key={i} from={Math.max(0, t)} durationInFrames={SFX_SEMUA[i][4]} layout="none">
          <Audio src={staticFile(berkas)} volume={vol ?? 0.6} playbackRate={SFX_SEMUA[i][3] ?? 1} />
        </Sequence>
      ))}
      <PenandaV8 />
    </AbsoluteFill>
  );
};

// gambar diam per adegan: menjelang akhir adegan supaya semua elemen sudah muncul
export const GambarV8: React.FC<{ n: number }> = ({ n }) => {
  const f = Math.max(mulaiAdegan(n) + 10, akhirAdegan(n) - 10);
  return (
    <FrameCtx.Provider value={f}>
      <AbsoluteFill>
        <Lapisan n={n} f={f} />
        <Judul baris={ADEGAN[n].judul} />
        <Subtitle />
        <div style={{ position: "absolute", left: 24, top: 24, background: "rgba(34,50,74,.8)", color: "#fff", fontFamily: "Fredoka", fontSize: 30, padding: "6px 16px", borderRadius: 12 }}>
          L{String(n + 1).padStart(2, "0")} · {ADEGAN[n].nama}
        </div>
      </AbsoluteFill>
    </FrameCtx.Provider>
  );
};
export const JUMLAH_V8 = ADEGAN.length;
export { DURASI_V8 };
const PenandaV8: React.FC = () => (
  <>
    {ADEGAN.map((a, n) => (
      <Sequence key={n} name={`L${String(n + 1).padStart(2, "0")} ${a.nama}`} from={mulaiAdegan(n)} durationInFrames={akhirAdegan(n) - mulaiAdegan(n)}>
        <></>
      </Sequence>
    ))}
  </>
);
