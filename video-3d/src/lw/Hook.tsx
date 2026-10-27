// Little Wins · hook Variasi 7 dalam bahasa Inggris US (suara Lauren). Duplikat hook V7: adegan sama, teks & waktu kata Inggris.
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { W } from "../storybook/kit";
import { PASANGAN, PasanganCtx } from "../gaya/tema";
import { SceneRuang as RuangHook } from "./hook/RuangHook";
import { SceneAnak as AnakHook } from "./hook/AnakHook";
import K from "./kata.json";

loadFont({ family: "Fredoka", url: staticFile("font/Fredoka.ttf") });
loadFont({ family: "Baloo2", url: staticFile("font/Baloo2-800.woff2"), weight: "800" });
loadFont({ family: "Baloo2", url: staticFile("font/Baloo2-700.woff2"), weight: "700" });

const FPS = 30;
const fr = (i: number) => Math.round(K[i].s * FPS);
export const DURASI_LW_HOOK = Math.ceil((K[K.length - 1].e + 1.5) * FPS);

type Adegan = { mulai: number; intens?: boolean; judul: [string, number, string?][]; isi: (f: number) => React.ReactNode; sfx?: [number, string, number?][] };
const RUANG = (f: number) => (
  <PasanganCtx.Provider value={PASANGAN.E}>
    <RuangHook beku={f} />
  </PasanganCtx.Provider>
);
const ANAK = (f: number) => (
  <PasanganCtx.Provider value={PASANGAN.E}>
    <AnakHook dari={0} beku={f} />
  </PasanganCtx.Provider>
);

// indeks = nomor kata di kata.json (0 "Researchers" … 49 "think.")
const ADEGAN: Adegan[] = [
  { mulai: 0, judul: [["Researchers", 0], ["124 kids' apps", 3, "biru"]], isi: RUANG },
  { mulai: 14, intens: true, judul: [["Most of them", 14], ["scored low.", 17, "merah"]], isi: RUANG, sfx: [[fr(18) - 2, "pop", 0.8]] },
  { mulai: 19, judul: [["Kids just", 23], ["tap, tap, tap.", 28, "biru"]], isi: ANAK,
    // owner: bunyi "benar" Robo Coder HANYA di jawaban benar pertama (diputar utuh, tidak dipotong), lalu bunyi "selesai" Robo Coder saat GREAT JOB
    sfx: [[fr(25) + 4, "benar-robo", 1], [fr(30) + 10, "selesai-robo", 0.7]] },
  { mulai: 31, judul: [["Stars, prizes,", 36], ["loud sounds!", 39, "koral"]], isi: ANAK },
  { mulai: 41, intens: true, judul: [["No time", 44], ["to think.", 48, "biru"]], isi: ANAK },
];
const mulaiAdegan = (n: number) => (n === 0 ? 0 : fr(ADEGAN[n].mulai) - 4);
const akhirAdegan = (n: number) => (n + 1 < ADEGAN.length ? mulaiAdegan(n + 1) : DURASI_LW_HOOK);

const SOROT: Record<string, string> = { biru: "#FFD23F", merah: "#FF6B6B", koral: "#FFB04A" };
const Judul: React.FC<{ f: number; baris: [string, number, string?][] }> = ({ f, baris }) => {
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: 66, right: 50, top: 270, fontFamily: "Baloo2", fontWeight: 800, fontSize: 98, lineHeight: 1.1, letterSpacing: 0.5, color: "#FFFFFF", WebkitTextStroke: "11px #1E2A44", paintOrder: "stroke fill", textShadow: "0 8px 0 rgba(20,28,50,.35)" }}>
      {baris.map(([tx, i, hl], k) => {
        const s = spring({ frame: f - fr(i) + 2, fps, config: { damping: hl ? 9 : 14, stiffness: 160 } });
        return (
          <div key={k}>
            <span style={{ display: "inline-block", opacity: Math.min(1, s * 3), scale: String(hl ? 0.3 + 0.7 * s : 1), translate: hl ? undefined : `0px ${(1 - s) * 30}px`, transformOrigin: "30% 60%", ...(hl ? { color: SOROT[hl] } : {}) }}>
              {tx}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// subtitle karaoke: maks 3 kata, potong setelah tanda baca; huruf kecil kecuali "I"
const teksKata = (i: number) => {
  const x = K[i].w.replace(/["“”]/g, "").replace(/[.,!…]+$/, "");
  return x === "I" ? x : x.toLowerCase();
};
const KELOMPOK = (() => {
  const out: number[][] = [];
  let cur: number[] = [];
  K.forEach((k, i) => {
    cur.push(i);
    if (/[.,?!…"]$/.test(k.w) || cur.length >= 3) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
})();
const Subtitle: React.FC<{ f: number }> = ({ f }) => {
  let g = -1;
  KELOMPOK.forEach((k, i) => {
    if (fr(k[0]) - 2 <= f) g = i;
  });
  if (g < 0) return null;
  const kel = KELOMPOK[g];
  if (f > Math.round(K[kel[kel.length - 1]].e * FPS) + 20 && g === KELOMPOK.length - 1) return null;
  let aktif = kel[0];
  kel.forEach((i) => {
    if (fr(i) - 2 <= f) aktif = i;
  });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1441, textAlign: "center" }}>
      <span style={{ display: "inline-block", background: W.navy, color: "#fff", fontFamily: "Baloo2", fontWeight: 700, fontSize: 52, padding: "6px 34px 10px", borderRadius: 22, boxShadow: "0 10px 24px rgba(34,50,74,.25)", whiteSpace: "nowrap" }}>
        {kel.map((i, n) => (
          <React.Fragment key={i}>
            {n > 0 && " "}
            <b style={{ fontWeight: 700, color: i === aktif ? W.kuning : "#fff" }}>{teksKata(i)}</b>
          </React.Fragment>
        ))}
      </span>
    </div>
  );
};

const SFX_ALL = ADEGAN.flatMap((a) => a.sfx ?? []);
export const HookLW: React.FC = () => {
  const f = useCurrentFrame();
  const aktif = ADEGAN.map((_, n) => n).filter((n) => f >= mulaiAdegan(n) && f < akhirAdegan(n) + 6);
  const n = aktif[aktif.length - 1];
  return (
    <AbsoluteFill
      style={{
        background: "#DDE3F6"
      }}
    >
      {aktif.map((m) => {
        const sambung = [1, 3, 4].includes(m); // adegan 2 lanjutan 1, adegan 4–5 lanjutan 3
        const o = m === 0 || sambung ? 1 : Math.min(1, (f - mulaiAdegan(m)) / 6);
        return (
          <AbsoluteFill
            key={m}
            style={{
              opacity: o
            }}
          >
            {ADEGAN[m].isi(f)}
          </AbsoluteFill>
        );
      })}
      <Judul f={f} baris={ADEGAN[n].judul} />
      <Subtitle f={f} />
      <Audio src={staticFile("lw/hook-vo.wav")} />
      <Audio src={staticFile("v7/musik.mp3")} volume={0.16} />
      {SFX_ALL.map(([t, nama, vol], i) => (
        <Sequence key={i} from={Math.max(0, t)} layout="none">
          <Audio src={staticFile(`sfx/${nama}.wav`)} volume={vol ?? 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
