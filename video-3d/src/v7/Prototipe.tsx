// Prototipe Variasi 7 (gaya triad): animatic penuh dengan suara asli + satu gambar diam per adegan (P01…P31).
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { W } from "../storybook/kit";
import { ADEGAN, fr, FPS } from "./adegan";
import K from "./kata.json";

loadFont({ family: "Fredoka", url: staticFile("font/Fredoka.ttf") });
// huruf judul & subtitle: Baloo 2 (tebal, bulat, mudah dibaca di HP)
loadFont({ family: "Baloo2", url: staticFile("font/Baloo2-800.woff2"), weight: "800" });
loadFont({ family: "Baloo2", url: staticFile("font/Baloo2-700.woff2"), weight: "700" });

export const DURASI_V7 = Math.ceil((K[K.length - 1].e + 1.5) * FPS);
const mulaiAdegan = (n: number) => (n === 0 ? 0 : fr(ADEGAN[n].mulai) - 4);
const akhirAdegan = (n: number) => (n + 1 < ADEGAN.length ? mulaiAdegan(n + 1) : DURASI_V7);
// judul selalu terbaca di latar apa pun: huruf putih/berwarna + garis tepi navy tebal (tanpa kotak warna yang bisa menyatu dengan latar)
const SOROT: Record<string, string> = { biru: "#FFD23F", merah: "#FF6B6B", koral: "#FFB04A" };

const Judul: React.FC<{ f: number; baris: [string, number, string?][]; gelap: boolean }> = ({ f, baris, gelap }) => {
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

// subtitle karaoke dari kata asli: maks 3 kata, potong setelah tanda baca
const TAMPIL: Record<number, string> = { 3: "124", 4: "", 5: "", 6: "" };
const BESAR: Record<string, string> = { hape: "HP", dimas: "Dimas", pr: "PR", koder: "Koder", cilik: "Cilik", lihat: "LIHAT", detail: "DETAIL", ibu: "Ibu", ma: "Ma", nak: "Nak" };
const teksKata = (i: number) => {
  if (TAMPIL[i] !== undefined) return TAMPIL[i];
  const x = K[i].w.replace(/["“”]/g, "").replace(/[.,!…]+$/, "").replace(/\.\.\.$/, "");
  const b = x.replace("?", "").toLowerCase();
  return BESAR[b] ? BESAR[b] + (x.endsWith("?") ? "?" : "") : x.toLowerCase();
};
const KELOMPOK = (() => {
  const out: number[][] = [];
  let cur: number[] = [];
  K.forEach((k, i) => {
    if (teksKata(i) === "") return;
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

const Catatan: React.FC<{ n: number; final?: boolean }> = ({ n, final }) => {
  const a = ADEGAN[n];
  return (
    <>
      {/* penanda prototipe: nomor adegan untuk memudahkan revisi (tidak ikut di video final) */}
      {!final && <div style={{ position: "absolute", left: 24, top: 24, background: "rgba(34,50,74,.8)", color: "#fff", fontFamily: "Fredoka", fontWeight: 600, fontSize: 30, padding: "6px 16px", borderRadius: 12 }}>
        P{String(n + 1).padStart(2, "0")} · {a.nama}
      </div>}
      {a.sumber && <div style={{ position: "absolute", left: 0, right: 0, top: 1545, textAlign: "center", fontFamily: "Fredoka", fontSize: 26, color: a.intens ? "#E9E4F2" : "#4A5170" }}>Meyer, Zosh dkk., Journal of Children and Media, 2021 · 124 aplikasi</div>}
    </>
  );
};

const SatuAdegan: React.FC<{ n: number; f: number }> = ({ n, f }) => {
  const a = ADEGAN[n];
  return (
    <AbsoluteFill>
      {a.isi(f)}
      <Judul f={f} baris={a.judul} gelap={!!a.intens} />
      <Subtitle f={f} />
      <Catatan n={n} />
    </AbsoluteFill>
  );
};

export const PrototipeV7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#DDE3F6" }}>
      {ADEGAN.map((a, n) => (
        <Sequence key={n} name={`P${String(n + 1).padStart(2, "0")} ${a.nama}`} from={mulaiAdegan(n)} durationInFrames={akhirAdegan(n) - mulaiAdegan(n)}>
          <SatuAdegan n={n} f={f} />
        </Sequence>
      ))}
      <Audio src={staticFile("v7/vo.wav")} />
    </AbsoluteFill>
  );
};

// gambar diam per adegan: diambil menjelang akhir adegan supaya semua elemen sudah muncul
export const GambarAdegan: React.FC<{ n: number }> = ({ n }) => <SatuAdegan n={n} f={Math.max(mulaiAdegan(n) + 10, akhirAdegan(n) - 12)} />;
export const JUMLAH_ADEGAN = ADEGAN.length;

// ===================== VIDEO ANIMASI PENUH =====================
// Adegan dirender menurut frame absolut (tanpa Sequence) supaya semua gerak memakai jam yang sama.
// Antar adegan: crossfade 6 frame (kecuali di dalam hook yang memang satu adegan bersambung).
const SFX_ALL = ADEGAN.flatMap((a) => a.sfx ?? []);
export const AnimasiV7: React.FC = () => {
  const f = useCurrentFrame();
  const aktif = ADEGAN.map((_, n) => n).filter((n) => f >= mulaiAdegan(n) && f < akhirAdegan(n) + 6);
  return (
    <AbsoluteFill style={{ background: "#DDE3F6" }}>
      {aktif.map((n) => {
        const sambung = [1, 3, 4].includes(n); // P02 lanjutan P01, P04–P05 lanjutan P03 (adegan yang sama)
        const o = n === 0 || sambung ? 1 : Math.min(1, (f - mulaiAdegan(n)) / 6);
        return (
          <AbsoluteFill key={n} style={{ opacity: o }}>
            {ADEGAN[n].isi(f)}
          </AbsoluteFill>
        );
      })}
      {(() => {
        const n = aktif[aktif.length - 1];
        return (
          <>
            <Judul f={f} baris={ADEGAN[n].judul} gelap={!!ADEGAN[n].intens} />
            <Catatan n={n} final />
          </>
        );
      })()}
      <Subtitle f={f} />
      <Audio src={staticFile("v7/vo.wav")} />
      <Audio src={staticFile("v7/musik.mp3")} volume={0.16} />
      {SFX_ALL.map(([t, nama, vol], i) => (
        <Sequence key={i} from={Math.max(0, t)} durationInFrames={nama === "sorak" ? 150 : 45} layout="none">
          <Audio src={staticFile(`sfx/${nama}.wav`)} volume={vol ?? 0.6} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
