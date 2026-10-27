// Video diet V3 "Menguping suami ke ibunya": 30 adegan (P01–P30), latar digambar kode + tokoh AI.
// Semua waktu mengikuti kata VO (kata.json). Still D01–D30 = prototipe; komposisi Diet-Animasi = video penuh.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile } from "remotion";
import MATA from "./mata.json";
import { DURASI_DIET, FPS, FrameCtx, KATA, fr, pop, useF } from "./waktu";
import { GarisKecepatan, Kilat, Kilau, SapuanCahaya, TepiBuram, VinyetDenyut } from "./efek";
import { createContext, useContext } from "react";
import { loadFont } from "@remotion/fonts";
import UKURAN from "./pose-ukuran.json";
import { Bingkai, Etalase, Jam, Jendela, Kompor, Kulkas, LampuGantung, MejaDepan, MejaMakan, Papan, Pintu, Rak, Ruang, Tanaman, Tenda, Wastafel } from "./latar";
import { Bakul, CelahPintu, DaunPintu, Galon, Gantungan, KalenderDinding, KipasDinding, LapKotak, Magnet, MejaTeh, Pagar, RuangHangat, RumahMalam, Saklar, Termos, TudungSaji } from "./detail";
import { Bokeh, Debu, Genangan, Hujan, Sinar } from "./suasana";
import { Coret, Gelembung, HPEbook, IkonCoret, Kalender, Lingkaran, Rantai, TombolCTA } from "./grafis";
import { INTENS, MALAM, MEREK, RINI, NAVY, Palet, SENJA, SIANG, SUBUH } from "./warna";

loadFont({ family: "Baloo2", url: staticFile("font/Baloo2-800.woff2"), weight: "800" });
loadFont({ family: "Baloo2", url: staticFile("font/Baloo2-700.woff2"), weight: "700" });

// tokoh AI: x = tengah, bawah = garis bawah gambar, tinggi = tinggi tampil.
// Hidup (acuan HN1): napas, goyang kecil, kedip, dan KEPALA bergerak terpisah dari badan —
// "bicara" = kepala naik-turun cepat-halus saat kalimatnya diucapkan, "dengar" = sesekali mengangguk pelan.
// Kepala hanya bergeser ke BAWAH (menimpa leher) supaya tidak pernah ada celah.
type Mata = { mata: { cx: number; cy: number; rx: number; ry: number }[]; kulit: string };
type Orang = { x0: number; x1: number; leher: number; bicara?: [number, number][]; ngobrol?: number };
const sedangBicara = (f: number, o: Orang) => {
  if (o.ngobrol !== undefined) return Math.sin(f / 38 + o.ngobrol * Math.PI) > 0.15; // bergantian bicara
  return (o.bicara ?? []).some(([a, b]) => f >= fr(a) - 2 && f <= Math.round(KATA[b].e * FPS));
};
const geserKepala = (f: number, o: Orang, benih: number) =>
  sedangBicara(f, o)
    ? 3 + 3 * Math.sin(f / 2.6 + benih) + 1.5 * Math.sin(f / 5.3) // bicara: ritme suku kata
    : 4 * Math.max(0, Math.sin(f / 31 + benih * 3)) ** 3; // dengar: angguk pelan sesekali
const Pose: React.FC<{ n: string; x: number; bawah: number; tinggi: number; flip?: boolean; orang?: Orang[]; bicara?: [number, number][]; dengar?: boolean; gemetar?: boolean; isak?: boolean; kaget?: number }> = ({ n, x, bawah, tinggi, flip, orang, bicara, dengar, gemetar, isak, kaget }) => {
  const f = useF();
  const [w, h] = (UKURAN as Record<string, number[]>)[n];
  const s = tinggi / h;
  const benih = (x % 97) / 10;
  let sq = 1 + 0.008 * Math.sin(f / 15 + benih);
  let rot = 0.45 * Math.sin(f / 37 + benih);
  let dx = 0, dy = 0;
  if (gemetar) { dx = 1.6 * Math.sin(f * 2.3) + Math.sin(f * 3.7); rot += 0.25 * Math.sin(f * 1.9); } // tangan & badan gemetar
  if (isak) dy = 6 * Math.max(0, Math.sin(f / 7)) ** 4; // bahu naik-turun saat menangis
  if (kaget !== undefined) sq *= 1 + 0.035 * Math.exp(-Math.max(0, f - fr(kaget)) / 6) * (f >= fr(kaget) ? 1 : 0);
  const mata = (MATA as Record<string, Mata>)[n];
  const fase = Math.floor(f + benih * 31) % 97;
  const tutup = fase < 4 ? [0.55, 1, 1, 0.5][fase] : 0;
  const kedip = tutup > 0.05 && mata
    ? mata.mata.map((m, i) => (
        <g key={i}>
          <clipPath id={`kd${n}${Math.round(x)}${i}`}>
            <ellipse cx={m.cx} cy={m.cy} rx={m.rx} ry={m.ry} />
          </clipPath>
          <rect x={m.cx - m.rx} y={m.cy - m.ry} width={m.rx * 2} height={m.ry * 2 * tutup} fill={mata.kulit} clipPath={`url(#kd${n}${Math.round(x)}${i})`} />
          <path d={`M${m.cx - m.rx * 0.85} ${m.cy - m.ry + m.ry * 2 * tutup} Q${m.cx} ${m.cy - m.ry + m.ry * 2 * tutup + m.ry * 0.25} ${m.cx + m.rx * 0.85} ${m.cy - m.ry + m.ry * 2 * tutup}`} stroke="#3A2416" strokeWidth={Math.max(4, m.rx * 0.14)} fill="none" strokeLinecap="round" />
        </g>
      ))
    : null;
  // orang di gambar: default satu orang selebar gambar; leher dari posisi mata (atau isian manual)
  const leherDefault = mata ? Math.min(0.5, (Math.max(...mata.mata.map((m) => m.cy)) / h) * 1.62) : 0.36;
  const daftar: Orang[] = orang ?? (bicara || dengar ? [{ x0: 0, x1: 1, leher: leherDefault, bicara }] : []);
  const img = <image href={staticFile(`diet/${n}.png`)} width={w} height={h} />;
  const id = `${n}${Math.round(x)}${Math.round(bawah)}`;
  return (
    <g transform={`translate(${x + dx} ${bawah + dy}) rotate(${rot}) scale(${(flip ? -1 : 1) * s * (2 - sq)} ${s * sq}) translate(${-w / 2} ${-h})`}>
      {daftar.length === 0 ? (
        <>
          {img}
          {kedip}
        </>
      ) : (
        <>
          {daftar.map((o, k) => (
            <clipPath key={k} id={`bwh${id}${k}`}>
              <rect x={o.x0 * w} y={o.leher * h} width={(o.x1 - o.x0) * w} height={h} />
            </clipPath>
          ))}
          <clipPath id={`luar${id}`}>
            {/* kolom di luar semua orang (mis. sofa di tepi) tetap utuh */}
            <rect x={0} y={0} width={Math.min(...daftar.map((o) => o.x0)) * w} height={h} />
            <rect x={Math.max(...daftar.map((o) => o.x1)) * w} y={0} width={w} height={h} />
          </clipPath>
          <g clipPath={`url(#luar${id})`}>{img}</g>
          {daftar.map((o, k) => (
            <g key={`b${k}`} clipPath={`url(#bwh${id}${k})`}>{img}</g>
          ))}
          {daftar.map((o, k) => {
            const turun = geserKepala(f, o, benih + k * 1.7) / s; // px layar → px gambar
            return (
              <g key={`k${k}`}>
                <clipPath id={`kpl${id}${k}`}>
                  <rect x={o.x0 * w} y={-20} width={(o.x1 - o.x0) * w} height={o.leher * h + 26} />
                </clipPath>
                <g transform={`translate(0 ${turun})`}>
                  <g clipPath={`url(#kpl${id}${k})`}>
                    {img}
                    {kedip}
                  </g>
                </g>
              </g>
            );
          })}
        </>
      )}
    </g>
  );
};

// benda/grafis muncul halus di kata ke-i (0,9 → 1, tanpa pantulan)
const Muncul: React.FC<{ i: number; x: number; y: number; children: React.ReactNode; denyut?: boolean }> = ({ i, x, y, children, denyut }) => {
  const f = useF();
  const sc = pop(f, i);
  if (!sc) return null;
  const d = denyut ? 1 + 0.025 * Math.max(0, Math.sin((f - fr(i)) / 9)) : 1;
  return <g opacity={Math.min(1, (sc - 0.9) * 14)} transform={`translate(${x} ${y}) scale(${sc * d}) translate(${-x} ${-y})`}>{children}</g>;
};

// foto berbingkai berisi wajah ASLI dua tokoh (dipotong dari pose AI), bukan bentuk putus-putus (audit A3)
const KEPALA: Record<string, [number, number, number, number]> = {
  "su-bicara": [110, 0, 320, 380], "ib-duduk": [30, 0, 320, 380], "bn-duduk": [80, 0, 340, 400],
};
const FotoAsli: React.FC<{ x: number; y: number; s?: number; kiri: string; kanan: string; redup?: boolean }> = ({ x, y, s = 1, kiri, kanan, redup }) => {
  const isi = (n: string, dx: number) => {
    const [cx, cy, cw, ch] = KEPALA[n];
    const [w, h] = (UKURAN as Record<string, number[]>)[n];
    return (
      <svg x={dx} y={22} width={92} height={160} viewBox={`${cx} ${cy} ${cw} ${ch}`} preserveAspectRatio="xMidYMin slice">
        <image href={staticFile(`diet/${n}.png`)} width={w} height={h} />
      </svg>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={redup ? 0.8 : 1}>
      <rect width={220} height={210} rx={10} fill="#B98A4A" stroke="#6E4A32" strokeWidth={5} />
      <rect x={14} y={14} width={192} height={182} rx={4} fill="#EADBC4" />
      <svg x={14} y={14} width={192} height={182} viewBox="0 0 192 182">
        <rect width={192} height={182} fill="#D9C7AE" />
        {isi(kiri, 6)}
        {isi(kanan, 94)}
      </svg>
    </g>
  );
};

const Svg: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, ...style }}>
    {children}
  </svg>
);

// panggung: latar (buram tipis) → cahaya hangat di belakang fokus → tokoh & benda depan (tajam) → vinyet
// lapisan: latar (buram 2px) → cahaya fokus → tokoh (garis tepi) → benda depan tajam → efek suasana → lapisan depan buram (DOF) → vinyet
// kemajuan kamera adegan (0..1) untuk parallax: latar bergerak lebih lambat, benda depan lebih cepat
const KameraCtx = createContext(0);
const Panggung: React.FC<{ P: Palet; latar: React.ReactNode; tokoh?: React.ReactNode; depan?: React.ReactNode; fokus?: [number, number]; atas?: React.ReactNode; efek?: React.ReactNode; buram?: React.ReactNode; rak?: number; dolly?: number }> = ({ P, latar, tokoh, depan, fokus = [540, 1050], atas, efek, buram, rak = 0, dolly = 0 }) => {
  const k = useContext(KameraCtx);
  // K12 parallax · K6 dolly zoom: latar membesar (seolah tertarik) sementara tokoh tetap · K9 rak = 1 → fokus di benda depan
  const skalaLatar = (1 - 0.022 * k) * (1 + 0.32 * dolly);
  const skalaDepan = 1 + 0.03 * k;
  const blurLatar = parseFloat(P.blur.replace(/[^0-9.]/g, "")) + 4 * rak + 2 * dolly;
  return (
  <AbsoluteFill style={{ background: P.dinding }}>
    <Svg style={{ filter: `blur(${blurLatar}px)`, scale: String(skalaLatar), transformOrigin: `${fokus[0]}px ${fokus[1]}px` }}>{latar}</Svg>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse ${P.gelap ? 400 : 440}px ${P.gelap ? 520 : 560}px at ${fokus[0]}px ${fokus[1]}px, ${P.cahaya}, rgba(0,0,0,0) 72%)` }} />
    <Svg>
      <defs>
        {/* garis tepi navy tipis di tokoh fokus (seperti V7) */}
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
      <g filter="url(#tepiFokus)" style={rak > 0.02 ? { filter: `url(#tepiFokus) blur(${5 * rak}px)` } : undefined}>{tokoh}</g>
      {efek}
    </Svg>
    <Svg style={{ scale: String(skalaDepan), transformOrigin: "50% 60%", filter: rak < 0.98 && rak > 0 ? `blur(${6 * (1 - rak)}px)` : undefined }}>{depan}</Svg>
    <Svg>{atas}</Svg>
    {buram && <Svg style={{ filter: "blur(9px)", scale: String(1 + 0.05 * k) }}>{buram}</Svg>}
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 62% at 50% 52%, rgba(0,0,0,0) 58%, ${P.vinyet} 100%)` }} />
  </AbsoluteFill>
  );
};

const SOROT: Record<string, string> = { k: "#FFD23F", m: "#FF6B6B", o: "#FFB04A" };
const Judul: React.FC<{ baris: [string, number, string?][] }> = ({ baris }) => {
  const f = useF();
  return (
    <div style={{ position: "absolute", left: 66, right: 50, top: 270, fontFamily: "Baloo2", fontWeight: 800, fontSize: 98, lineHeight: 1.1, color: "#fff", WebkitTextStroke: `11px ${NAVY}`, paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(20,28,50,.35)" }}>
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

// subtitle karaoke dari kata VO asli: maks 3 kata per kelompok, potong setelah tanda baca, kata aktif kuning
const BESAR: Record<string, string> = { rini: "Rini", diet: "Diet", tanpa: "Tanpa", tersiksa: "Tersiksa", minyaknya: "MINYAKNYA", bu: "Bu", ebook: "ebook", indonesia: "Indonesia" };
const teksKata = (i: number) => {
  const x = KATA[i].w.replace(/["“”]/g, "").replace(/[.,!…]+$/, "").replace(/\.\.\.$/, "");
  const tanya = x.endsWith("?");
  const b = x.replace("?", "");
  const asli = KATA[i].w.replace(/["“”.,!…?]/g, "");
  const t = BESAR[b.toLowerCase()] ?? (asli === asli.toUpperCase() && asli.length > 3 ? asli : b.toLowerCase());
  return t + (tanya ? "?" : "");
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
const KINETIK = [102, 141, 164]; // "lemah", "MINYAKNYA", "lemah" (dicoret)
const Subtitle: React.FC<{ top?: number }> = ({ top = 1441 }) => {
  const f = useF();
  let gi = -1;
  KELOMPOK.forEach((k, i) => {
    if (fr(k[0]) - 2 <= f) gi = i;
  });
  if (gi < 0) return null;
  const kel = KELOMPOK[gi];
  if (gi === KELOMPOK.length - 1 && f > Math.round(KATA[kel[kel.length - 1]].e * FPS) + 24) return null;
  let aktif = kel[0];
  kel.forEach((i) => {
    if (fr(i) - 2 <= f) aktif = i;
  });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center" }}>
      <span style={{ display: "inline-block", background: NAVY, color: "#fff", fontFamily: "Baloo2", fontWeight: 700, fontSize: 52, padding: "6px 34px 10px", borderRadius: 22, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(20,28,50,.25)" }}>
        {kel.map((i, n) => (
          <React.Fragment key={i}>
            {n > 0 && " "}
            <b style={{ fontWeight: 700, color: i === aktif ? "#FFD23F" : "#fff", display: "inline-block", ...(i === aktif && KINETIK.includes(i) ? { scale: String(1 + 0.22 * Math.exp(-(f - fr(i)) / 10)), translate: `${3 * Math.sin(f * 2.1) * Math.exp(-(f - fr(i)) / 8)}px 0px`, margin: `0 ${Math.round(28 * Math.exp(-(f - fr(i)) / 10))}px`, transformOrigin: "50% 60%" } : {}) }}>{teksKata(i)}</b>
          </React.Fragment>
        ))}
      </span>
    </div>
  );
};

// pintu terbuka pelan antara kata a dan b (0 → 1, melambat di akhir)
const buka = (f: number, a: number, b: number) => {
  const k = Math.max(0, Math.min(1, (f - fr(a) + 6) / Math.max(10, fr(b) - fr(a))));
  return 1 - Math.pow(1 - k, 3);
};

// ---------- latar yang dipakai berulang ----------
const Warung: React.FC<{ P: Palet; jam?: [number, number]; kompor?: boolean }> = ({ P, jam, kompor = true }) => (
  <g>
    <Ruang P={P} ubin lantaiY={1500} />
    <Rak P={P} x={50} y={760} w={420} />
    <Rak P={P} x={70} y={930} w={330} isi="piring" />
    <Jendela P={P} x={690} y={620} w={290} h={300} />
    <KalenderDinding P={P} x={520} y={640} s={0.9} />
    {jam && <Jam P={P} x={590} y={880} r={52} jam={jam[0]} menit={jam[1]} />}
    <KipasDinding P={P} x={930} y={1070} s={0.9} />
    <Gantungan P={P} x={640} y={1000} w={260} />
    <Saklar P={P} x={480} y={1080} />
    <MejaDepan P={P} y={1362} />
    {kompor && <Kompor P={P} x={40} y={1362} />}
    <Termos P={P} x={420} y={1362} s={0.8} />
    <Bakul P={P} x={940} y={1362} s={0.9} />
    <LapKotak P={P} x={360} y={1372} w={70} h={100} />
  </g>
);
const WarungRini: React.FC<{ P: Palet; papan?: boolean }> = ({ P, papan = true }) => (
  <g>
    <Ruang P={P} ubin lantaiY={1500} />
    <Jendela P={P} x={720} y={700} w={260} h={260} />
    <Tenda P={P} y={540} />
    {papan && <Papan P={P} x={60} y={680} teks="Warung Rini" />}
    <KalenderDinding P={P} x={500} y={700} s={0.85} />
    <Gantungan P={P} x={660} y={1030} w={300} />
    <MejaDepan P={P} y={1362} />
    <Etalase P={P} x={40} y={1020} />
    <Termos P={P} x={470} y={1362} s={0.8} />
  </g>
);
const RuangMakan: React.FC<{ P: Palet }> = ({ P }) => (
  <g>
    <Ruang P={P} lantaiY={1300} />
    <Bingkai P={P} x={90} y={660} w={220} h={170} />
    <FotoAsli x={330} y={630} s={0.62} kiri="su-bicara" kanan="bn-duduk" />
    <Jendela P={P} x={740} y={660} w={240} h={260} malam tirai />
    <Jam P={P} x={620} y={720} r={46} jam={7} menit={30} />
    <KipasDinding P={P} x={150} y={1060} s={0.8} />
    <Tanaman P={P} x={960} y={1300} s={0.9} />
  </g>
);
// dapur malam: kulkas BESAR + magnet & catatan, jendela hujan, kalender, galon
const DapurMalam: React.FC<{ buka?: boolean; jam?: [number, number] }> = ({ buka, jam = [11, 0] }) => (
  <g>
    <Ruang P={MALAM} lantaiY={1640} ubin />
    <Jendela P={MALAM} x={700} y={600} w={300} h={300} malam />
    <Jam P={MALAM} x={860} y={1030} r={56} jam={jam[0]} menit={jam[1]} />
    <KalenderDinding P={MALAM} x={560} y={650} s={0.85} />
    <Galon P={MALAM} x={960} y={1640} s={0.9} />
    <g transform="translate(-10 430) scale(1.3)">
      <Kulkas P={MALAM} x={20} y={0} buka={buka} />
      {!buka && <><Magnet x={70} y={60} w={80} h={90} c="#E3C16A" rot={-6} /><Magnet x={170} y={90} w={70} h={80} c="#E59A8E" rot={5} /><Magnet x={80} y={420} w={90} h={100} c="#9CC2A2" rot={3} /></>}
    </g>
  </g>
);
// lorong gelap di balik pintu (hook): dinding indigo, foto nikah redup, saklar
const Lorong: React.FC = () => (
  <g>
    <Ruang P={MALAM} lantaiY={1640} />
    <FotoAsli x={680} y={620} s={1} kiri="su-bicara" kanan="bn-duduk" redup />
    <Saklar P={MALAM} x={560} y={1000} />
    <Pintu P={MALAM} x={-120} y={560} w={320} h={1080} />
  </g>
);
const Chip: React.FC<{ x: number; y: number; t: string; w?: number }> = ({ x, y, t, w = 460 }) => (
  <g>
    <rect x={x} y={y} width={w} height={86} rx={43} fill="#FFFDF8" stroke={NAVY} strokeWidth={5} />
    <circle cx={x + 44} cy={y + 43} r={22} fill="#3FBF8F" />
    <path d={`M${x + 33} ${y + 44} l8 9 l15 -18`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <text x={x + 82} y={y + 58} fontFamily="Baloo2" fontWeight={700} fontSize={42} fill={NAVY}>
      {t}
    </text>
  </g>
);

type Adegan = { nama: string; mulai: number; judul: [string, number, string?][]; sub: string; isi: (f: number) => React.ReactNode; kamera?: [number, number, number]; gerak?: "mundur" | "pan"; masuk?: "sapu" };
const BN = (n: string, x = 560, bawah = 1760, tinggi = 1060, flip = false) => <Pose n={n} x={x} bawah={bawah} tinggi={tinggi} flip={flip} />;

export const ADEGAN: Adegan[] = [
  { nama: "Hook · rumah malam, siluet di jendela", kamera: [410, 1050, 1.6], mulai: 0, judul: [["Nggak sengaja", 0], ["dengar…", 2, "k"]], sub: "Aku nggak sengaja dengar…",
    isi: (f) => <Panggung P={{ ...INTENS, blur: "blur(1.2px)", cahaya: "rgba(255,200,120,.35)" }} fokus={[410, 1050]} latar={<RumahMalam />}
      efek={<><Hujan seed="h1" jumlah={110} /><Genangan x={420} y={1650} w={420} /><Bokeh titik={[[660, 1130, 22], [120, 980, 34, "rgba(255,210,140,.35)"], [1000, 760, 40, "rgba(255,220,170,.3)"]]} /></>}
      buram={<><Pagar y={1590} /><Hujan seed="h1d" jumlah={16} dekat /></>} /> },
  { nama: "Hook · lewat celah pintu", mulai: 8, judul: [["Mereka lagi", 8], ["ngomongin aku…", 10, "m"]], sub: "Mereka lagi ngomongin aku…",
    isi: (f) => <Panggung P={{ ...INTENS, cahaya: "rgba(255,206,140,.25)" }} fokus={[540, 1150]} latar={<RuangHangat foto={<FotoAsli x={120} y={620} s={0.85} kiri="su-bicara" kanan="ib-duduk" />} />}
      rak={1 - buka(f, 8, 10)} tokoh={<Pose n="sofa-2" x={560} bawah={1620} tinggi={760} orang={[{ x0: 0, x1: 0.5, leher: 0.37, ngobrol: 0 }, { x0: 0.5, x1: 1, leher: 0.37, ngobrol: 1 }]} />} depan={<><MejaTeh x={560} y={1700} s={0.9} /><CelahPintu kiri={Math.round(380 - 130 * buka(f, 8, 11))} kanan={Math.round(700 + 130 * buka(f, 8, 11))} /></>}
      efek={<Debu seed="d2" x={250} y={600} w={580} h={900} />} /> },
  { nama: "Hook · suami: nggak tega", mulai: 12, judul: [], sub: "aku nggak tega lihat dia…",
    isi: (f) => <Panggung P={{ ...INTENS, cahaya: "rgba(255,206,140,.25)" }} fokus={[560, 1150]} latar={<RuangHangat foto={<FotoAsli x={120} y={620} s={0.85} kiri="su-bicara" kanan="ib-duduk" />} />}
      tokoh={<Pose n="sofa-1" x={600} bawah={1760} tinggi={980} orang={[{ x0: 0, x1: 0.5, leher: 0.37, bicara: [[12, 20]] }, { x0: 0.5, x1: 1, leher: 0.37, bicara: [] }]} />} depan={<><MejaTeh x={620} y={1800} s={1.1} /><CelahPintu kiri={Math.round(170 - 60 * buka(f, 12, 18))} kanan={1080} /></>}
      atas={<Muncul i={12} x={420} y={760}><Gelembung x={110} y={430} w={700} teks={["\"Bu… aku nggak tega", "lihat dia nahan", "laper terus.\""]} s={54} ekorX={420} /></Muncul>} /> },
  { nama: "Hook · Bonita di balik pintu", mulai: 21, judul: [["Tanganku", 21], ["gemeter…", 23, "o"]], sub: "sampai gelasnya bunyi",
    isi: (f) => <Panggung P={INTENS} fokus={[600, 1150]} latar={<Lorong />} tokoh={<Pose n="bn-gemetar" x={600} bawah={1990} tinggi={1250} />}
      efek={<><Sinar id="s4" x={250} w={260} miring={260} /><Debu seed="d4" x={350} y={500} w={500} h={900} /></>} depan={<DaunPintu x={-30} w={Math.round(240 - 70 * buka(f, 21, 30))} gagang="kanan" />} /> },
  { nama: "Hook · pura-pura senyum", mulai: 35, judul: [["Pura-pura", 35], ["nggak dengar", 37]], sub: "Aku pura-pura… terus senyum",
    isi: (f) => <Panggung P={INTENS} fokus={[600, 1150]} latar={<Lorong />} tokoh={BN("bn-senyum", 600, 1990, 1250)}
      efek={<Sinar id="s5" x={250} w={260} miring={260} />} depan={<DaunPintu x={-30} w={Math.round(185 - 15 * buka(f, 35, 40))} gagang="kanan" />} /> },
  { nama: "Hook · dia lihat semuanya", mulai: 41, judul: [["Ternyata dia", 41], ["lihat semuanya", 43, "k"]], sub: "Ternyata selama ini dia lihat semuanya",
    isi: (f) => <Panggung P={INTENS} fokus={[600, 1150]} latar={<Lorong />} tokoh={BN("bn-dada", 600, 1990, 1250)}
      efek={<><Sinar id="s6" x={330} w={180} miring={220} /><Debu seed="d6" x={380} y={500} w={420} h={900} /></>} depan={<DaunPintu x={-30} w={Math.round(175 - 20 * buka(f, 41, 46))} gagang="kanan" />} /> },
  { nama: "Nyicip gulai", mulai: 47, judul: [["Nyicip", 47], ["kuah gulai…", 49, "o"]], sub: "aku nyicip kuah gulai di warung…",
    isi: (f) => <Panggung P={SIANG} fokus={[680, 1050]} latar={<Warung P={SIANG} kompor={false} />} tokoh={BN("bn-nyicip", 700, 1720, 1020)} depan={<><MejaDepan P={SIANG} y={1370} /><Kompor P={SIANG} x={40} y={1372} /></>} /> },
  { nama: "Ludahin ke wastafel", masuk: "sapu", mulai: 55, judul: [["…terus", 55], ["aku ludahin", 57, "m"]], sub: "terus aku ludahin ke wastafel",
    isi: (f) => <Panggung P={SIANG} latar={<><Ruang P={SIANG} ubin lantaiY={1500} /><Jendela P={SIANG} x={120} y={620} w={260} h={280} /><KipasDinding P={SIANG} x={250} y={1080} s={0.9} /><Rak P={SIANG} x={640} y={800} w={380} isi="piring" /></>} tokoh={BN("bn-ludah", 560, 1760, 1060)} depan={<><MejaDepan P={SIANG} y={1400} /><Wastafel P={SIANG} x={300} y={1355} /></>} /> },
  { nama: "Kopi item sampai sore", masuk: "sapu", mulai: 60, judul: [["Cuma kopi item", 60], ["sampai sore", 62, "o"]], sub: "cuma minum kopi item sampai sore",
    isi: (f) => <Panggung P={SIANG} fokus={[680, 1050]} latar={<Warung P={SIANG} jam={[4, 0]} />} tokoh={BN("bn-kopi", 700, 1720, 1020)} depan={<MejaDepan P={SIANG} y={1370} />} /> },
  { nama: "Kulkas jam 11 malam", gerak: "mundur", mulai: 69, judul: [["Jam sebelas", 69], ["malam…", 71, "m"]], sub: "habisin apa aja, sambil nangis",
    isi: (f) => <Panggung P={MALAM} fokus={[700, 1150]} latar={<DapurMalam />} tokoh={<><g transform="translate(-10 430) scale(1.3)"><Kulkas P={MALAM} x={20} y={0} buka /></g>{<Pose n="bn-nangis" x={740} bawah={2260} tinggi={1460} isak />}</>} efek={<Debu seed="d10" x={430} y={700} w={500} h={800} />} /> },
  { nama: "Lingkaran lapar", mulai: 85, judul: [["Laper, kalap,", 85], ["nebus, ulang", 87, "m"]], sub: "Sorenya laper lagi. Malamnya kalap lagi.",
    isi: (f) => <Panggung P={MALAM} fokus={[540, 980]} latar={<DapurMalam />} atas={<Lingkaran cx={540} cy={1000} r={300} langkah={[85, 96, 87, 92]} />} /> },
  { nama: "Aku emang lemah", mulai: 98, judul: [["\"Aku emang", 98], ["lemah…\"", 100, "m"]], sub: "aku emang lemah soal makanan",
    isi: (f) => <Panggung P={MALAM} fokus={[560, 1150]} latar={<DapurMalam jam={[11, 40]} />} tokoh={<Pose n="bn-lesu" x={640} bawah={1990} tinggi={1220} isak />} /> },
  { nama: "Rini warung sebelah", gerak: "pan", mulai: 105, judul: [["Sampai aku", 105], ["perhatiin Rini", 107, "k"]], sub: "Rini, teman warung sebelah",
    isi: (f) => <Panggung P={RINI} fokus={[700, 1050]} latar={<WarungRini P={RINI} />} tokoh={<Pose n="ri-lambai" x={720} bawah={1740} tinggi={1040} orang={[{ x0: 0, x1: 1, leher: 0.42, ngobrol: 0 }]} />} depan={<MejaDepan P={RINI} y={1400} />} /> },
  { nama: "Rini makan bersantan", mulai: 112, judul: [["Bumbunya", 112], ["lengkap", 114, "k"]], sub: "Tapi badannya stabil.",
    isi: (f) => <Panggung P={RINI} fokus={[760, 1050]} latar={<WarungRini P={RINI} papan={false} />} tokoh={<Pose n="ri-makan" x={780} bawah={1740} tinggi={1040} />} depan={<MejaDepan P={RINI} y={1400} />} atas={<><Muncul i={113} x={200} y={683}><Chip x={50} y={640} t="Nasi" w={300} /></Muncul><Muncul i={114} x={260} y={793}><Chip x={50} y={750} t="Lauk bersantan" w={420} /></Muncul><Muncul i={116} x={255} y={903}><Chip x={50} y={860} t="Bumbu lengkap" w={410} /></Muncul></>} /> },
  { nama: "Tebakan dicoret", mulai: 121, judul: [["Pasti ada", 121], ["rahasianya?", 123, "o"]], sub: "Teh pelangsing? Juga nggak.",
    isi: (f) => <Panggung P={RINI} fokus={[800, 1150]} latar={<WarungRini P={RINI} />} tokoh={BN("bn-mikir", 830, 1990, 1080)} atas={<><Muncul i={121} x={360} y={685}><Coret x={40} y={620} w={640} teks="Diam-diam puasa?" jawab="Nggak" coretDi={124} /></Muncul><Muncul i={125} x={360} y={855}><Coret x={40} y={790} w={640} teks="Teh pelangsing?" jawab="Nggak" coretDi={129} /></Muncul></>} /> },
  { nama: "Bukan bumbunya, MINYAKNYA", mulai: 131, judul: [], sub: "bukan bumbunya… tapi MINYAKNYA",
    isi: (f) => <Panggung P={INTENS} fokus={[540, 1150]} latar={<WarungRini P={INTENS} />} tokoh={<>{BN("bn-tanya", 290, 1800, 950)}<Pose n="ri-tunjuk" x={790} bawah={1780} tinggi={1000} bicara={[[134, 141]]} flip kaget={141} /></>} depan={<><MejaDepan P={INTENS} y={1420} /><Pose n="bd-minyak" x={560} bawah={1440} tinggi={290} /></>} atas={<Muncul i={134} x={770} y={700}><Gelembung x={360} y={460} w={680} teks={["\"Bukan bumbunya…", "tapi MINYAKNYA.\""]} s={58} ekorX={770} /></Muncul>} /> },
  { nama: "Buang rasanya", mulai: 142, judul: [["Yang perlu dibuang", 142], ["cuma minyaknya", 144, "k"]], sub: "Selama ini aku buang rasanya",
    isi: (f) => <Panggung P={SIANG} fokus={[560, 1150]} dolly={eio(Math.max(0, Math.min(1, (f - fr(142)) / Math.max(1, fr(150) - fr(142)))))} latar={<Warung P={SIANG} />} tokoh={<Pose n="bn-kaget" x={560} bawah={2500} tinggi={1900} kaget={142} />} /> },
  { nama: "Bukan karena lemah", mulai: 153, judul: [["Itu lingkaran.", 153], ["Bukan lemah", 155, "k"]], sub: "Bukan karena aku lemah.",
    isi: (f) => <Panggung P={{ ...SIANG, vinyet: "rgba(60,60,120,.35)" }} fokus={[540, 980]} latar={<Warung P={SIANG} />} atas={<Lingkaran cx={540} cy={1000} r={300} coretLemah langkah={[153, 155, 156, 157]} coretDi={161} />} /> },
  { nama: "Rini nunjukin buku", mulai: 165, judul: [["Diet Tanpa", 165], ["Tersiksa", 167, "k"]], sub: "Rini nunjukin ebook yang dia pakai",
    isi: (f) => <Panggung P={RINI} fokus={[420, 1000]} latar={<WarungRini P={RINI} />} tokoh={<Pose n="ri-buku" x={760} bawah={1760} tinggi={1040} orang={[{ x0: 0, x1: 1, leher: 0.42, ngobrol: 0.5 }]} />} depan={<MejaDepan P={RINI} y={1420} />} atas={<Muncul i={167} x={245} y={960}><HPEbook x={70} y={600} w={350} rot={-5} /><Kilau dari={168} titik={[[90, 640, 30], [420, 720, 24], [110, 1240, 22], [410, 1180, 30], [250, 590, 18]]} /></Muncul>} /> },
  { nama: "Menu 30 hari", mulai: 175, judul: [["Menu 30 hari,", 175], ["3x makan", 177, "k"]], sub: "Tinggal buka sesuai harinya",
    isi: (f) => <Panggung P={SIANG} fokus={[800, 1150]} latar={<Warung P={SIANG} />} tokoh={BN("bn-mikir", 840, 1990, 1080)} atas={<Muncul i={176} x={300} y={900}><Kalender x={40} y={620} w={520} /></Muncul>} /> },
  { nama: "Takar minyak", mulai: 187, judul: [["Yang ditakar", 187], ["cuma minyaknya", 189, "o"]], sub: "pakai sendok takar",
    isi: (f) => <Panggung P={SIANG} fokus={[740, 1050]} latar={<Warung P={SIANG} />} tokoh={BN("bn-minyak", 760, 1720, 1020)} depan={<MejaDepan P={SIANG} y={1370} />} atas={<><Muncul i={191} x={290} y={683}><Chip x={40} y={640} t="45 resep Indonesia" w={500} /></Muncul><Muncul i={195} x={290} y={793}><Chip x={40} y={750} t="Bumbu tetap lengkap" w={500} /></Muncul></>} /> },
  { nama: "Tanpa puasa & larangan", mulai: 205, judul: [["Nggak ada", 205], ["yang dilarang", 207, "k"]], sub: "Nggak ada jam puasa.",
    isi: (f) => <Panggung P={SIANG} fokus={[540, 1000]} latar={<Warung P={SIANG} />} atas={<><Muncul i={205} x={290} y={900}><IkonCoret x={290} y={900} ikon="jam" label="Jam puasa" /></Muncul><Muncul i={209} x={790} y={900}><IkonCoret x={790} y={900} ikon="piring" label="Makanan dilarang" /></Muncul></>} /> },
  { nama: "Minggu ketiga nyicip", mulai: 214, judul: [["Minggu ketiga…", 214]], sub: "aku nyicip kuah gulai lagi",
    isi: (f) => <Panggung P={SIANG} fokus={[680, 1050]} latar={<Warung P={SIANG} kompor={false} />} tokoh={BN("bn-nyicip", 700, 1720, 1020)} depan={<><MejaDepan P={SIANG} y={1370} /><Kompor P={SIANG} x={40} y={1372} /></>} atas={<Muncul i={214} x={230} y={830}><Kalender x={40} y={600} w={380} sorot={2} label="Minggu 3" /></Muncul>} /> },
  { nama: "Sekarang aku telen", mulai: 221, judul: [["Sekarang", 221], ["aku telen", 223, "k"]], sub: "Bedanya… sekarang aku telen.",
    isi: (f) => <Panggung P={{ ...SIANG, cahaya: "rgba(255,214,150,.6)" }} fokus={[560, 1100]} latar={<Warung P={SIANG} />} tokoh={BN("bn-telen", 540, 2350, 1750)} /> },
  { nama: "Rantai sebab-akibat", mulai: 225, judul: [["Karena bumbunya", 225], ["lengkap…", 227, "k"]], sub: "besoknya nggak ada puasa buat nebus",
    isi: (f) => <Panggung P={SIANG} fokus={[540, 1000]} latar={<Warung P={SIANG} />} atas={<Rantai x={140} y={600} w={800} baris={["Nggak nunggu malam", "Nggak kalap", "Nggak puasa nebus"]} langkah={[228, 233, 240]} />} /> },
  { nama: "Makan bareng satu meja", mulai: 249, judul: [["Satu menu,", 249], ["satu meja", 251, "k"]], sub: "Terus suatu malam, kami makan bareng",
    isi: (f) => <Panggung P={SENJA} fokus={[540, 1100]} latar={<RuangMakan P={SENJA} />} tokoh={<><Pose n="su-sendok" x={210} bawah={1400} tinggi={560} orang={[{ x0: 0, x1: 1, leher: 0.46, ngobrol: 0 }]} /><Pose n="ib-duduk" x={540} bawah={1380} tinggi={520} orang={[{ x0: 0, x1: 1, leher: 0.47, ngobrol: 0.66 }]} /><Pose n="bn-duduk" x={870} bawah={1400} tinggi={560} orang={[{ x0: 0, x1: 1, leher: 0.45, ngobrol: 1.33 }]} /></>} depan={<><MejaMakan P={SENJA} y={1330} /><Pose n="bd-gulai" x={540} bawah={1420} tinggi={150} /><TudungSaji P={SENJA} x={860} y={1360} s={0.7} /><Pose n="bd-teh" x={220} bawah={1410} tinggi={110} /></>} atas={<LampuGantung P={SENJA} x={540} y={540} />} /> },
  { nama: "Suami: nggak ngeluh laper", mulai: 259, judul: [], sub: "nggak pernah ngeluh laper lagi",
    isi: (f) => <Panggung P={SENJA} fokus={[300, 1100]} latar={<RuangMakan P={SENJA} />} tokoh={<><Pose n="su-bicara" x={250} bawah={1470} tinggi={760} bicara={[[262, 269]]} /><Pose n="ib-duduk" x={590} bawah={1440} tinggi={580} dengar /><Pose n="bn-duduk" x={910} bawah={1460} tinggi={620} dengar /></>} depan={<MejaMakan P={SENJA} y={1390} />} atas={<Muncul i={262} x={250} y={640}><Gelembung x={40} y={340} w={680} teks={["\"Kamu udah nggak", "pernah ngeluh", "laper lagi, ya.\""]} s={54} ekorX={250} /></Muncul>} /> },
  { nama: "Senyum beneran", mulai: 270, judul: [["Senyumnya", 270], ["beneran", 272, "k"]], sub: "Kali ini… senyumnya beneran.",
    isi: (f) => <Panggung P={{ ...SENJA, cahaya: "rgba(255,200,120,.7)" }} fokus={[540, 1050]} latar={<RuangMakan P={SENJA} />} tokoh={<Pose n="bn-duduk" x={540} bawah={1500} tinggi={860} />} depan={<MejaMakan P={SENJA} y={1420} />} /> },
  { nama: "Masih masak dari subuh", mulai: 276, judul: [["Bedanya", 276], ["cuma satu…", 278, "o"]], sub: "Masih masak dari subuh.",
    isi: (f) => <Panggung P={SUBUH} fokus={[700, 1050]} latar={<Warung P={SUBUH} jam={[5, 0]} kompor={false} />} tokoh={BN("bn-minyak", 720, 1720, 1020)} depan={<><MejaDepan P={SUBUH} y={1370} /><Kompor P={SUBUH} x={40} y={1372} /></>} /> },
  { nama: "CTA", mulai: 292, judul: [["Capek nahan", 292], ["laper?", 294, "o"]], sub: "klik tombol LIHAT DETAIL",
    isi: (f) => (
      <AbsoluteFill style={{ background: MEREK.kertas }}>
        <Svg>
          <circle cx={540} cy={960} r={420} fill="#F6E6C8" />
          <Muncul i={292} x={540} y={900}><HPEbook x={360} y={540} w={360} rot={3} /><Kilau dari={293} titik={[[350, 600, 30], [740, 680, 26], [330, 1150, 24], [760, 1120, 30], [560, 520, 20]]} /></Muncul>
          <Muncul i={303} x={540} y={1365} denyut><TombolCTA x={190} y={1300} w={700} /></Muncul>
          <Muncul i={303} x={540} y={1470}>
            <text x={540} y={1478} textAnchor="middle" fontFamily="Baloo2" fontWeight={700} fontSize={28} fill="#8A7A6A">*Kisah di video ini adalah cerita rekayasa</text>
          </Muncul>
        </Svg>
      </AbsoluteFill>
    ) },
];

export const JUMLAH_DIET = ADEGAN.length;
const mulaiAdegan = (n: number) => (n === 0 ? 0 : fr(ADEGAN[n].mulai) - 4);
const akhirAdegan = (n: number) => (n + 1 < ADEGAN.length ? mulaiAdegan(n + 1) : DURASI_DIET);

// kamera: dorong pelan 1 → 1,035 sepanjang adegan; P01 masuk ke jendela (zoom besar di paruh akhir)
// K2 punch-in cepat di kata kunci: naik 4 frame, tahan, kembali pelan
const PUNCH: [number, number][] = [[141, 1.13], [172, 1.07]];
const punch = (f: number) => {
  let z = 1;
  for (const [i, s] of PUNCH) {
    const d = f - fr(i);
    if (d < 0 || d > 44) continue;
    const naik = Math.min(1, d / 4);
    const turun = d > 22 ? 1 - Math.min(1, (d - 22) / 22) : 1;
    z *= 1 + (s - 1) * naik * (turun * turun * (3 - 2 * turun));
  }
  return z;
};
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const Kamera: React.FC<{ n: number; f: number; fAsli?: number; children: React.ReactNode }> = ({ n, f, fAsli, children }) => {
  const a = mulaiAdegan(n), b = akhirAdegan(n);
  const k = Math.max(0, Math.min(1.25, (f - a) / Math.max(1, b - a)));
  const A = ADEGAN[n];
  let zoom: number, asal: string;
  if (A.kamera) {
    zoom = 1 + (A.kamera[2] - 1) * Math.pow(Math.max(0, (k - 0.45) / 0.55), 2);
    asal = `${A.kamera[0]}px ${A.kamera[1]}px`;
  } else if (A.gerak === "mundur") {
    // K3 mulai dekat di wajah → mundur mengungkap tempat
    const e = eio(Math.min(1, k / 0.55));
    zoom = 1.55 - 0.55 * e + 0.02 * k;
    asal = "700px 900px";
  } else if (A.gerak === "pan") {
    // K10 kamera bergeser dari kiri ke kanan memperkenalkan tempat/tokoh
    zoom = 1.24;
    asal = `${8 + 70 * eio(Math.min(1, k / 0.6))}% 55%`;
  } else {
    zoom = 1 + 0.035 * k;
    asal = "50% 55%";
  }
  zoom *= punch(fAsli ?? f);
  // K5 kamera genggam halus di babak masalah (P07–P12), kembali stabil sesudahnya
  const genggam = n >= 6 && n <= 11 ? 1 : 0;
  const tx = genggam * (5 * Math.sin(f / 41) + 2.5 * Math.sin(f / 17));
  const ty = genggam * (4 * Math.sin(f / 53 + 1) + 2 * Math.sin(f / 23));
  const rot = genggam * 0.25 * Math.sin(f / 61);
  return (
    <KameraCtx.Provider value={Math.min(1, k)}>
      <AbsoluteFill style={{ scale: String(zoom), transformOrigin: asal, translate: `${tx}px ${ty}px`, rotate: `${rot}deg` }}>{children}</AbsoluteFill>
    </KameraCtx.Provider>
  );
};

const Lapisan: React.FC<{ n: number; f: number; final?: boolean }> = ({ n, f, final }) => {
  const a = ADEGAN[n];
  return (
    <>
      {a.judul.length > 0 && <Judul baris={a.judul} />}
      <Subtitle top={n === ADEGAN.length - 1 ? 1585 : 1441} />
      {!final && (
        <div style={{ position: "absolute", left: 24, top: 24, background: "rgba(30,42,68,.8)", color: "#fff", fontFamily: "Baloo2", fontWeight: 700, fontSize: 30, padding: "6px 16px", borderRadius: 12 }}>
          P{String(n + 1).padStart(2, "0")} · {a.nama}
        </div>
      )}
    </>
  );
};

// gambar diam prototipe: frame mendekati akhir adegan supaya semua yang muncul per kata sudah tampil
export const GambarDiet: React.FC<{ n: number }> = ({ n }) => {
  const f = Math.max(mulaiAdegan(n) + 10, akhirAdegan(n) - 10);
  return (
    <FrameCtx.Provider value={f}>
      <AbsoluteFill>
        <Kamera n={n} f={f}>{ADEGAN[n].isi(f)}</Kamera>
        <Lapisan n={n} f={f} />
      </AbsoluteFill>
    </FrameCtx.Provider>
  );
};

// ---------- audio ----------
const t = (i: number) => KATA[i].s;
const T2 = t(105); // babak 2: Rini
const T3 = t(214); // babak 3: minggu ketiga
const MUSIK = 0.28; // semua file dinormalisasi: VO −16 LUFS, musik −16 → ±11 dB di bawah narator
const naikTurun = (x: number, a: number, b: number) => interpolate(x, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
const halus = (k: number) => Math.sin((k * Math.PI) / 2); // crossfade daya-sama (equal-power)
// musik turun sesaat di "…tapi MINYAKNYA" supaya kalimat kunci terdengar
const duck = (d: number) => 1 - 0.6 * naikTurun(d, t(139) - 0.4, t(140)) * (1 - naikTurun(d, t(141) + 1.2, t(141) + 2.6));
const SFX: [number, string, number, number?][] = [
  [t(30) - 0.1, "gelas-gemetar", 0.7],
  [t(50), "seruput", 0.7],
  [t(57) + 0.1, "keran", 0.45],
  [t(79) - 0.3, "kulkas-buka", 0.6],
  [t(80), "mengunyah", 0.6],
  [t(141) - 0.05, "sadar", 0.55],
  [t(217), "seruput", 0.7],
  [t(253) - 0.2, "makan-bareng", 0.5],
];

export const DURASI = DURASI_DIET;
// getar kamera singkat & meluruh di kata kunci: [indeks kata, lama (frame), kekuatan px]
const GETAR: [number, number, number][] = [
  [10, 16, 9], // "ngomongin aku" — kaget mendengar
  [31, 20, 7], // "gemeter" — tangan gemetar (pengganti tubuh gemetar terus)
  [141, 14, 10], // "MINYAKNYA" — momen sadar
];
const getar = (f: number) => {
  let x = 0, y = 0, r = 0;
  for (const [i, lama, kuat] of GETAR) {
    const d = f - fr(i);
    if (d < 0 || d > lama) continue;
    const k = kuat * Math.pow(1 - d / lama, 1.6);
    x += k * Math.sin(d * 2.9) * Math.cos(d * 1.3);
    y += k * Math.cos(d * 3.4);
    r += (k / 10) * Math.sin(d * 2.2) * 0.6;
  }
  return { x, y, r };
};
export const AnimasiDiet: React.FC = () => {
  const f = useF();
  const LARUT = 14; // ±0,5 dtk, double exposure seperti HN1
  const aktif = ADEGAN.map((_, n) => n).filter((n) => f >= mulaiAdegan(n) && f < akhirAdegan(n) + LARUT);
  const atas = aktif[aktif.length - 1];
  return (
    <AbsoluteFill style={{ background: "#14183A" }}>
      <AbsoluteFill style={{ translate: `${getar(f).x}px ${getar(f).y}px`, rotate: `${getar(f).r}deg`, scale: getar(f).x !== 0 ? "1.03" : "1" }}>
      {aktif.map((n) => {
        // K11 freeze ±0,3 dtk tepat di "MINYAKNYA" (suara jalan terus)
        const fz = f >= fr(141) && f < fr(141) + 9 ? fr(141) : f;
        // K7 whip pan: adegan masuk menyapu dari kanan, adegan lama tersapu ke kiri, dengan blur gerak
        const sapuMasuk = ADEGAN[n].masuk === "sapu" && f < mulaiAdegan(n) + 10 ? eio(Math.min(1, (f - mulaiAdegan(n)) / 10)) : null;
        const sapuKeluar = n + 1 < ADEGAN.length && ADEGAN[n + 1].masuk === "sapu" && f >= akhirAdegan(n) ? eio(Math.min(1, (f - akhirAdegan(n)) / 10)) : null;
        const geser = sapuMasuk !== null ? (1 - sapuMasuk) * 1080 : sapuKeluar !== null ? -sapuKeluar * 1080 : 0;
        const blurGerak = sapuMasuk !== null ? 16 * Math.sin(Math.PI * sapuMasuk) : sapuKeluar !== null ? 16 * Math.sin(Math.PI * sapuKeluar) : 0;
        const larut = sapuMasuk !== null || sapuKeluar !== null ? 1 : (n === 0 ? 1 : halus(Math.min(1, (f - mulaiAdegan(n)) / LARUT))) * (n + 1 < ADEGAN.length && f >= akhirAdegan(n) ? 1 - 0.55 * Math.min(1, (f - akhirAdegan(n)) / LARUT) : 1);
        // O5 warna kilas balik untuk kenangan "Dia lihat aku…" (P07–P09)
        const kilasBalik = n >= 6 && n <= 8 ? "saturate(0.6) sepia(0.14) brightness(0.95)" : "";
        const filter = [kilasBalik, blurGerak > 0.3 ? `blur(${blurGerak}px)` : ""].filter(Boolean).join(" ");
        return (
          <AbsoluteFill key={n} style={{ opacity: larut, translate: `${geser}px 0px`, filter: filter || undefined }}>
            <FrameCtx.Provider value={fz}>
              <Kamera n={n} f={fz} fAsli={f}>{ADEGAN[n].isi(fz)}</Kamera>
            </FrameCtx.Provider>
          </AbsoluteFill>
        );
      })}
      </AbsoluteFill>
      {/* overlay — kurva intensitas Bruce Block: hook (O1) → tenang → puncak "MINYAKNYA" (O2, O3) → hangat (O4) */}
      <VinyetDenyut dari={35} sampai={46} />
      <TepiBuram dari={69} sampai={84} />
      <Kilat di={141} />
      <GarisKecepatan di={142} cx={560} cy={900} />
      <SapuanCahaya di={222} />
      <SapuanCahaya di={274} />
      <Lapisan n={atas} f={f} final />
      <Audio src={staticFile("diet/vo.wav")} />
      {/* musik 3 babak: lagu berikut masuk lebih dulu (pre-lap) dengan nada pembukanya yang tipis, lagu sebelumnya turun perlahan (equal-power) */}
      <Audio src={staticFile("diet/musik/babak-1.wav")} volume={(x) => MUSIK * duck(x / FPS) * halus(1 - naikTurun(x / FPS, T2 - 4.5, T2 + 0.8))} />
      <Sequence from={Math.round((T2 - 3) * FPS)} layout="none">
        <Audio src={staticFile("diet/musik/babak-2.wav")} volume={(x) => { const d = x / FPS + T2 - 3; return MUSIK * duck(d) * halus(naikTurun(d, T2 - 3, T2 + 0.5)) * halus(1 - naikTurun(d, T3 - 3.5, T3 + 1.2)); }} />
      </Sequence>
      <Sequence from={Math.round((T3 - 2.5) * FPS)} layout="none">
        <Audio src={staticFile("diet/musik/babak-3.wav")} volume={(x) => { const d = x / FPS + T3 - 2.5; return MUSIK * halus(naikTurun(d, T3 - 2.5, T3 + 0.5)) * halus(1 - naikTurun(d, DURASI_DIET / FPS - 2.5, DURASI_DIET / FPS)); }} />
      </Sequence>
      {/* hujan HANYA di hook (owner): sangat pelan, makin pelan saat masuk rumah, hilang sebelum P07 */}
      {/* tanpa loop: pada audio loop, frame volume kembali ke 0 tiap ulangan sehingga hujan muncul lagi setelah hook */}
      <Sequence from={0} durationInFrames={Math.round(t(47) * FPS)} layout="none">
        <Audio src={staticFile("diet/sfx/hujan-panjang.mp3")} volume={(x) => { const d = x / FPS; return 0.22 * (1 - 0.55 * naikTurun(d, t(8) - 0.3, t(8) + 0.5)) * (1 - naikTurun(d, t(47) - 1.2, t(47) - 0.1)); }} />
      </Sequence>
      {SFX.map(([d, nama, vol], i) => (
        <Sequence key={i} from={Math.max(0, Math.round(d * FPS))} durationInFrames={150} layout="none">
          <Audio src={staticFile(`diet/sfx/${nama}.mp3`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
