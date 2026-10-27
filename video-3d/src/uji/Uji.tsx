// Uji perbandingan karakter: versi GAMBAR AI (GPT Image 2.5 Flare, pose ditukar + kedip/mulut ditimpa)
// vs versi KODE (rig cut-out, sudut sendi dianimasikan). Adegan & suara sama persis:
// A (0–4,5 dtk) Dimas kesal "Ah, nggak ada bintangnya! Udahan, Ma."  ·  B (4,8–9,8 dtk) robot sampai → "Ma! Aku nemu sendiri!"
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { bintangPath, Lapis, W } from "../storybook/kit";
import { FOKUS, MejaBelajar, tema, Teka } from "../v7/alat";
import K from "../v7/kata.json";
import POSE_AI from "./pose.json";
import { BundaRig, DimasRig, lerpPose, POSE, PoseRig } from "./rig";

loadFont({ family: "Fredoka", url: staticFile("font/Fredoka.ttf") });

export const DURASI_UJI = 306;
const B0 = 144; // awal bagian B
const lokal = (i: number) => (i < 400 ? K[i].s - 156.1 : K[i].s - 195.9 + 4.8);
const fk = (i: number) => Math.round(lokal(i) * 30);
const F = { kesal: fk(344), ah: fk(345), udahan: fk(349), akhirA: fk(350) + 12, sampai: fk(427), teriak: fk(429), ma: fk(430), sendiri: fk(433), akhirB: fk(433) + 20 };
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };

// ---------- gerak bersama ----------
const KEDIP_DIMAS = [12, 70, 118, 160, 238, 290];
const KEDIP_BUNDA = [30, 96, 150, 196, 280];
const kedip = (f: number, daftar: number[]) => {
  for (const k of daftar) {
    const d = f - k;
    if (d >= 0 && d < 5) return [0.5, 1, 1, 0.6, 0.2][d];
  }
  return 0;
};
const bicaraDimas = (f: number) => {
  const dalam = (f >= F.ah && f <= F.akhirA - 10) || (f >= F.ma && f <= F.akhirB - 14);
  return dalam ? 0.2 + 0.6 * Math.abs(Math.sin(f / 2.1)) : 0;
};

// pose AI: pilih gambar + squash antisipasi saat berganti pose
type GantiPose = { f: number; nama: string }[];
const DIMAS_AI: GantiPose = [{ f: 0, nama: "dimas-p2" }, { f: F.kesal + 4, nama: "dimas-p1" }, { f: B0, nama: "dimas-p2" }, { f: F.teriak + 6, nama: "dimas-p4" }];
const BUNDA_AI: GantiPose = [{ f: 0, nama: "bunda-p1" }, { f: B0, nama: "bunda-p3" }, { f: F.ma + 4, nama: "bunda-p4" }];
const aktif = (g: GantiPose, f: number) => [...g].reverse().find((p) => f >= p.f)!;

// pegas: squash sesaat sebelum ganti pose (antisipasi), lalu meregang & menetap (overshoot)
const pegas = (f: number, ganti: number[], fps: number) => {
  let sq = 1, dy = 0;
  for (const g of ganti) {
    const d = f - g;
    if (d >= -5 && d < 0) { sq = Math.min(sq, 1 - 0.07 * ((d + 5) / 5)); dy = Math.max(dy, 14 * ((d + 5) / 5)); }
    if (d >= 0 && d < 30) {
      const s = spring({ frame: d, fps, config: { damping: 7, stiffness: 220 } });
      sq = 1 + (1 - s) * 0.1 * (d < 2 ? 1 : 1) - 0.0;
      dy = -(1 - s) * 30;
    }
  }
  return { sq, dy };
};

// ---------- versi AI ----------
type DataPose = { w: number; h: number; mata: { cx: number; cy: number; rx: number; ry: number; kulit: string }[]; mulut: { cx: number; cy: number } };
const PoseAI: React.FC<{ nama: string; x: number; bawah: number; s: number; flip: number; sq: number; rot: number; tutup: number; bicara: number }> = ({ nama, x, bawah, s, flip, sq, rot, tutup, bicara }) => {
  const d = (POSE_AI as Record<string, DataPose>)[nama];
  const ax = d.mulut.cx;
  return (
    <g transform={`translate(${x} ${bawah}) scale(${s * flip * (2 - sq)} ${s * sq}) rotate(${rot}) translate(${-ax} ${-d.h})`}>
      <image href={staticFile(`uji/${nama}.png`)} width={d.w} height={d.h} />
      {/* kedip: kelopak kulit turun dari atas, garis bulu mata di tepinya */}
      {tutup > 0.05 &&
        d.mata.map((m, i) => (
          <g key={i}>
            <clipPath id={`m${nama}${i}`}>
              <ellipse cx={m.cx} cy={m.cy} rx={m.rx * 1.28} ry={m.ry * 1.22} />
            </clipPath>
            <rect x={m.cx - m.rx * 1.3} y={m.cy - m.ry * 1.24} width={m.rx * 2.6} height={m.ry * 2.48 * tutup} fill={m.kulit} clipPath={`url(#m${nama}${i})`} />
            <path d={`M${m.cx - m.rx * 1.15} ${m.cy - m.ry * 1.2 + m.ry * 2.3 * tutup} Q${m.cx} ${m.cy - m.ry * 1.2 + m.ry * 2.3 * tutup + 10} ${m.cx + m.rx * 1.15} ${m.cy - m.ry * 1.2 + m.ry * 2.3 * tutup}`} stroke="#3A2416" strokeWidth={7} fill="none" strokeLinecap="round" />
          </g>
        ))}
      {/* mulut bicara (hanya pose yang mulutnya tertutup) */}
      {bicara > 0.05 && nama === "dimas-p1" && (
        <g>
          <ellipse cx={d.mulut.cx} cy={d.mulut.cy + 4} rx={26} ry={16} fill={d.mata[0].kulit} />
          <ellipse cx={d.mulut.cx} cy={d.mulut.cy + 4} rx={17 - 3 * bicara} ry={4 + 15 * bicara} fill="#5A1D1A" />
          <ellipse cx={d.mulut.cx} cy={d.mulut.cy + 8 + 8 * bicara} rx={9} ry={3 + 5 * bicara} fill="#C9575A" />
        </g>
      )}
    </g>
  );
};

// ---------- versi kode: urutan pose dengan interpolasi sudut sendi ----------
type Kunci = { f: number; pose: PoseRig; lama: number };
const DIMAS_KODE: Kunci[] = [
  { f: 0, pose: POSE.dimasFokus, lama: 1 },
  { f: F.kesal, pose: POSE.dimasSilang, lama: 9 },
  { f: B0, pose: POSE.dimasFokus, lama: 8 },
  { f: F.teriak + 4, pose: POSE.dimasSorak, lama: 8 },
];
const BUNDA_KODE: Kunci[] = [
  { f: 0, pose: POSE.bundaCemas, lama: 1 },
  { f: B0, pose: POSE.bundaTunjuk, lama: 10 },
  { f: F.ma + 2, pose: POSE.bundaBangga, lama: 10 },
];
const poseKode = (urut: Kunci[], f: number, fps: number) => {
  let p = urut[0].pose;
  for (let i = 1; i < urut.length; i++) {
    if (f >= urut[i].f) {
      const k = spring({ frame: f - urut[i].f, fps, durationInFrames: urut[i].lama * 2, config: { damping: 9, stiffness: 160 } });
      p = lerpPose(p, urut[i].pose, k);
    }
  }
  return p;
};

// ---------- adegan ----------
const JALAN: [number, number][] = [[0, 3], [1, 3], [2, 3], [2, 2], [3, 2], [3, 1], [3, 0]];
const Meja: React.FC<{ f: number; T: ReturnType<typeof tema> }> = ({ f, T }) => {
  const k = interpolate(f, [B0 + 4, F.sampai], [0, JALAN.length - 1], { ...cl, easing: Easing.inOut(Easing.quad) });
  const i = Math.min(JALAN.length - 2, Math.floor(k)), r = k - i;
  const robo: [number, number] = f < B0 ? [0, 3] : [JALAN[i][0] + (JALAN[i + 1][0] - JALAN[i][0]) * r, JALAN[i][1] + (JALAN[i + 1][1] - JALAN[i][1]) * r];
  const menang = f >= F.sampai;
  return (
    <g>
      <rect x={-20} y={1430} width={1120} height={40} fill={T.mejaAtas} />
      <rect x={-20} y={1470} width={1120} height={460} fill={T.mejaDepan} />
      <g transform="translate(540 1680) scale(1.15 0.6) rotate(-3)">
        <rect x={-150} y={-150} width={300} height={300} rx={10} fill="#FFFDF7" />
        <Teka x={0} y={0} s={0.42} batu={[[2, 1], [0, 1], [1, 0]]} baterai={[3, 0]} robo={robo} menang={menang}
          panah={[{ sel: [0, 3], arah: "kanan" }, { sel: [1, 3], arah: "kanan" }, { sel: [2, 3], arah: "atas" }, { sel: [2, 2], arah: "kanan" }, { sel: [3, 2], arah: "atas" }, { sel: [3, 1], arah: "atas" }]} />
      </g>
    </g>
  );
};

const Konfeti: React.FC<{ f: number; mulai: number }> = ({ f, mulai }) => (
  <g>
    {f >= mulai &&
      Array.from({ length: 22 }).map((_, i) => {
        const t = f - mulai, a = -Math.PI / 2 + ((i * 47) % 100 - 50) / 32, v = 15 + (i % 5) * 4;
        const x = 720 + Math.cos(a) * v * t, y = 820 + Math.sin(a) * v * t + 0.45 * t * t;
        if (y > 1500) return null;
        return i % 3 === 0 ? <path key={i} d={bintangPath(x, y, 18, 8)} fill={W.kuning} /> : <rect key={i} x={x} y={y} width={18} height={10} rx={2} fill={[W.kuning, "#5B7BD8", "#E86A92", W.mint][i % 4]} transform={`rotate(${t * 12 + i * 30} ${x} ${y})`} />;
      })}
  </g>
);

const Judul: React.FC<{ f: number; gelap: boolean }> = ({ f, gelap }) => {
  const { fps } = useVideoConfig();
  const baris: [string, number, boolean][] = f < B0 ? [["“Nggak ada", F.ah, false], ["bintangnya!”", fk(348), true]] : [["“Ma! Aku nemu", F.ma, false], ["sendiri!”", F.sendiri, true]];
  return (
    <div style={{ position: "absolute", left: 72, right: 60, top: 280, fontFamily: "Fredoka", fontWeight: 700, fontSize: 96, lineHeight: 1.15, color: gelap ? "#F7F1E6" : W.navy }}>
      {baris.map(([t, m, hl], i) => {
        const s = spring({ frame: f - m + 2, fps, config: { damping: hl ? 9 : 14, stiffness: 160 } });
        return (
          <div key={i}>
            <span style={{ display: "inline-block", opacity: Math.min(1, s * 3), scale: String(hl ? 0.3 + 0.7 * s : 1), transformOrigin: "30% 60%", ...(hl ? { color: "#fff", background: f < B0 ? W.merah : "#5B6BB8", padding: "0 22px 8px", borderRadius: 22 } : {}) }}>{t}</span>
          </div>
        );
      })}
    </div>
  );
};

const KATA_UJI = [...Array.from({ length: 7 }, (_, i) => 344 + i), ...Array.from({ length: 10 }, (_, i) => 424 + i)];
const Subtitle: React.FC<{ f: number }> = ({ f }) => {
  const grup = [[344], [345, 346, 347], [348], [349, 350], [424, 425, 426], [427], [428, 429], [430], [431, 432, 433]];
  let g = -1;
  grup.forEach((k, i) => { if (fk(k[0]) - 2 <= f) g = i; });
  if (g < 0 || f > F.akhirB + 10) return null;
  const kel = grup[g];
  let a = kel[0];
  kel.forEach((i) => { if (fk(i) - 2 <= f) a = i; });
  const tx = (i: number) => K[i].w.replace(/["“”]/g, "").replace(/[.,!]+$/, "").toLowerCase().replace(/^ma$/, "Ma");
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1441, textAlign: "center" }}>
      <span style={{ display: "inline-block", background: W.navy, color: "#fff", fontFamily: "Fredoka", fontWeight: 600, fontSize: 50, padding: "10px 34px 14px", borderRadius: 22 }}>
        {kel.map((i, n) => <React.Fragment key={i}>{n > 0 && " "}<b style={{ fontWeight: 600, color: i === a ? W.kuning : "#fff" }}>{tx(i)}</b></React.Fragment>)}
      </span>
    </div>
  );
};
void KATA_UJI;

export const UjiKarakter: React.FC<{ versi: "ai" | "kode" }> = ({ versi }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intens = f < B0;
  const T = tema(intens);
  const fade = interpolate(f, [F.akhirA, B0 - 2, B0 + 6], [0, 1, 0], cl);

  // Dimas: berbalik (flip) saat "Udahan", lalu kembali menghadap di bagian B
  const putar = f < B0 ? interpolate(f, [F.udahan - 2, F.udahan + 5], [1, -1], { ...cl, easing: Easing.inOut(Easing.cubic) }) : 1;
  const flipD = Math.abs(putar) < 0.08 ? 0.08 * Math.sign(putar || 1) : putar;
  const geleng = f >= F.ah && f < F.udahan ? Math.sin(f / 3) * 2.5 : 0;
  const lompat = f >= F.teriak ? -Math.abs(Math.sin((f - F.teriak) / 5)) * 26 * Math.max(0, 1 - (f - F.teriak) / 70) : 0;
  const goyang = f >= F.ma && f < F.akhirB ? Math.sin(f / 2.5) * 3 : 0;
  const telusur = f >= B0 && f < F.teriak ? Math.sin((f - B0) / 9) * 14 : 0; // jari menelusuri jalan robot

  const pD = pegas(f, versi === "ai" ? DIMAS_AI.slice(1).map((p) => p.f) : [], fps);
  const pB = pegas(f, versi === "ai" ? BUNDA_AI.slice(1).map((p) => p.f) : [], fps);

  return (
    <AbsoluteFill style={{ background: T.latar }}>
      <Lapis id="ujL" zoom={1 + 0.03 * (f / 300)} k={0.4} style={{ filter: T.blurJauh }}>
        <MejaBelajar T={T} f={f} />
      </Lapis>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 55% 35% at 50% 55%, ${T.cahaya}, rgba(0,0,0,0) 70%)`, mixBlendMode: "screen" }} />
      <Lapis id={`ujF${versi}`} zoom={1 + 0.03 * (f / 300)} k={1} wobble={versi === "ai" ? 0.6 : 3} garis={versi === "kode" ? (intens ? FOKUS.garisIntens : FOKUS.garis) : undefined}>
        {versi === "ai" ? (
          <>
            <PoseAI nama={aktif(BUNDA_AI, f).nama} x={290} bawah={1600 + pB.dy * 0.5} s={1.02} flip={1} sq={pB.sq} rot={f < B0 ? 2 : 0} tutup={kedip(f, KEDIP_BUNDA)} bicara={0} />
            <PoseAI nama={aktif(DIMAS_AI, f).nama} x={760 + telusur} bawah={1600 + pD.dy + lompat} s={1.12} flip={flipD} sq={pD.sq} rot={geleng + goyang} tutup={kedip(f, KEDIP_DIMAS)} bicara={bicaraDimas(f)} />
          </>
        ) : (
          <>
            <BundaRig pose={poseKode(BUNDA_KODE, f, fps)} kedip={1 - kedip(f, KEDIP_BUNDA)} x={290} y={832} s={1.2} />
            <DimasRig pose={poseKode(DIMAS_KODE, f, fps)} kedip={1 - kedip(f, KEDIP_DIMAS)} bicara={bicaraDimas(f)} x={760 + telusur} y={832 + lompat} s={1.28} flip={flipD} squash={1 + (geleng + goyang) * 0.004} />
          </>
        )}
        <Meja f={f} T={T} />
        <Konfeti f={f} mulai={F.ma} />
      </Lapis>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 52%, rgba(0,0,0,0) 60%, ${T.vinyet} 100%)` }} />
      <Judul f={f} gelap={intens} />
      <Subtitle f={f} />
      <div style={{ position: "absolute", left: 24, top: 24, background: "rgba(34,50,74,.8)", color: "#fff", fontFamily: "Fredoka", fontWeight: 600, fontSize: 32, padding: "6px 16px", borderRadius: 12 }}>
        {versi === "ai" ? "Versi A · Gambar AI (GPT Image 2.5 Flare)" : "Versi B · Digambar kode (rig)"}
      </div>
      <AbsoluteFill style={{ background: "#0E1020", opacity: fade }} />
      <Audio src={staticFile("uji/klip.wav")} />
    </AbsoluteFill>
  );
};

// lembar pose rig (model sheet) untuk dicek
export const LembarRig: React.FC = () => {
  const d = [POSE.dimasFokus, POSE.dimasSilang, POSE.dimasSorak];
  const b = [POSE.bundaCemas, POSE.bundaTunjuk, POSE.bundaBangga];
  return (
    <AbsoluteFill style={{ background: "#DDE3F6" }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {d.map((p, i) => <DimasRig key={i} pose={p} kedip={1} x={200 + i * 300} y={330} s={0.62} />)}
        {b.map((p, i) => <BundaRig key={i} pose={p} kedip={1} x={1060 + i * 300} y={330} s={0.6} />)}
      </svg>
    </AbsoluteFill>
  );
};
