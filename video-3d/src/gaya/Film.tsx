// Variasi 2 riset "aplikasi tap-tap" — gaya storybook terang. Susunan adegan, judul, subtitle karaoke, suara.
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { cl, W } from "./kit";
import { cari, KATA } from "./naskah";
import { SceneAnak } from "./SceneAnak";
import { SceneRuang } from "./SceneRuang";
import { Gaya, kAnak, kRuang, PASANGAN, PasanganCtx } from "./tema";

loadFont({ family: "Fredoka", url: staticFile("font/Fredoka.ttf") });

const SORot: Record<string, string> = { biru: W.biru, merah: W.merah, koral: W.koral };

const Kata: React.FC<{ teks: string; mulai: number; sorot?: string }> = ({ teks, mulai, sorot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - mulai, fps, config: { damping: sorot ? 9 : 14, stiffness: 160 } });
  return (
    <span
      style={{
        display: "inline-block",
        opacity: Math.min(1, s * 3),
        scale: String(sorot ? 0.3 + 0.7 * s : 1),
        translate: sorot ? undefined : `0px ${(1 - s) * 30}px`,
        transformOrigin: "30% 60%",
        ...(sorot ? { color: "#fff", background: SORot[sorot], padding: "0 22px 8px", borderRadius: 22, boxShadow: "0 8px 0 rgba(0,0,0,.12)" } : {}),
      }}
    >
      {teks}
    </span>
  );
};

const Judul: React.FC<{ dari: number; sampai: number; baris: [string, number, string?][]; gelap?: boolean }> = ({ dari, sampai, baris, gelap }) => {
  const f = useCurrentFrame();
  if (f < dari || f >= sampai) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 60, top: 280, fontFamily: "Fredoka", fontWeight: 700, fontSize: 100, lineHeight: 1.15, letterSpacing: -0.5, color: gelap ? "#F7F1E6" : W.navy, textShadow: gelap ? "0 4px 16px rgba(10,14,30,.45)" : "0 3px 12px rgba(255,255,255,.6)" }}>
      {baris.map(([tx, m, hl], i) => (
        <div key={i}>
          <Kata teks={tx} mulai={m} sorot={hl} />
        </div>
      ))}
    </div>
  );
};

// subtitle karaoke: maks 3 kata tampil, potongan baru setelah tanda baca
const KELOMPOK = (() => {
  const out: number[][] = [];
  let cur: number[] = [];
  KATA.forEach((k, i) => {
    if (k.tampil === "") return;
    cur.push(i);
    if (/[.,?!]$/.test(k.w) || cur.length >= 3) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
})();

const Subtitle: React.FC = () => {
  const f = useCurrentFrame();
  let g = -1;
  KELOMPOK.forEach((k, i) => {
    if (KATA[k[0]].at - 2 <= f) g = i;
  });
  if (g < 0 || f > KATA[KATA.length - 1].akhir + 20) return null;
  const kel = KELOMPOK[g];
  let aktif = kel[0];
  kel.forEach((i) => {
    if (KATA[i].at - 2 <= f) aktif = i;
  });
  const p = interpolate(f - KATA[kel[0]].at, [-2, 3], [0.85, 1], cl);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1441, textAlign: "center" }}>
      <span style={{ display: "inline-block", scale: String(p), background: W.navy, color: "#fff", fontFamily: "Fredoka", fontWeight: 600, fontSize: 50, padding: "10px 34px 14px", borderRadius: 22, boxShadow: "0 10px 24px rgba(34,50,74,.25)", whiteSpace: "nowrap" }}>
        {kel.map((i, n) => (
          <React.Fragment key={i}>
            {n > 0 && " "}
            <b style={{ fontWeight: 600, color: i === aktif ? W.kuning : "#fff" }}>{KATA[i].tampil}</b>
          </React.Fragment>
        ))}
      </span>
    </div>
  );
};

const Fade: React.FC<{ dari: number; lama: number; masuk?: number; keluar?: number; children: React.ReactNode; name: string }> = ({ dari, lama, masuk = 10, keluar = 10, children, name }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [dari, dari + masuk, dari + lama - keluar, dari + lama], [0, 1, 1, 0], cl);
  return (
    <Sequence name={name} from={dari} durationInFrames={lama}>
      <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>
    </Sequence>
  );
};

export const Film: React.FC<{ gaya: Gaya }> = ({ gaya }) => {
  const P = PASANGAN[gaya];
  const fNow = useCurrentFrame();
  const g1 = (kRuang(fNow) > 0.5 ? P.intens : P.tenang).judulGelap1, g2 = (kAnak(fNow) > 0.5 ? P.intens : P.tenang).judulGelap2;
  const { durationInFrames } = useVideoConfig();
  const potong = cari("karena").at - 4;
  const a = (w: string, k = 0) => cari(w, k).at;
  return (
    <PasanganCtx.Provider value={P}>
    <AbsoluteFill
      style={{
        background: W.krem
      }}
    >
      <Fade name="Ruang peneliti" dari={0} lama={potong + 6} masuk={1} keluar={10}>
        <SceneRuang />
      </Fade>
      <Fade name="Anak & tablet" dari={potong - 6} lama={durationInFrames - potong + 6} keluar={1}>
        <SceneAnak dari={potong - 6} />
      </Fade>

      <Judul gelap={g1} dari={0} sampai={a("kebanyakan") - 2} baris={[["Para peneliti", a("para")], ["124 aplikasi anak", a("seratus"), "biru"]]} />
      <Judul gelap={g1} dari={a("kebanyakan") - 2} sampai={potong} baris={[["Kebanyakan", a("kebanyakan")], ["nilainya rendah.", a("nilainya"), "merah"]]} />
      <Judul dari={potong} sampai={a("sedikit-sedikit") - 2} gelap={g2} baris={[["Cuma disuruh", a("cuma")], ["tap, tap, tap.", a("tap"), "biru"]]} />
      <Judul dari={a("sedikit-sedikit") - 2} sampai={a("padahal") - 2} gelap={g2} baris={[["Bintang, hadiah,", a("bintang")], ["suara heboh!", a("suara"), "koral"]]} />
      <Judul dari={a("padahal") - 2} sampai={99999} gelap={g2} baris={[["Belum sempat", a("belum")], ["berpikir.", a("berpikir"), "biru"]]} />
      <Subtitle />

      <Audio src={staticFile("musik-aplikasi.mp3")} volume={0.32} />
      <Sequence from={potong - 8} durationInFrames={20}>
      </Sequence>
      <Sequence from={a("rendah") - 2} durationInFrames={30}>
        <Audio src={staticFile("sfx/pop.wav")} volume={0.8} />
      </Sequence>
      {[a("mengetuk") + 4, a("tap", 0), a("tap", 1), a("tap", 2)].map((t, i) => (
        <Sequence key={i} from={t} durationInFrames={15}>
          <Audio src={staticFile("sfx/tek.wav")} volume={0.9} />
        </Sequence>
      ))}
      <Sequence from={a("bintang")} durationInFrames={45}>
        <Audio src={staticFile("sfx/ding-kc.wav")} volume={0.6} />
      </Sequence>
      <Sequence from={a("hadiah") + 8} durationInFrames={20}>
        <Audio src={staticFile("sfx/pop.wav")} volume={0.7} />
      </Sequence>
      <Sequence from={a("suara")} durationInFrames={40}>
        <Audio src={staticFile("sfx/yippee.wav")} volume={0.45} />
      </Sequence>
    </AbsoluteFill>
    </PasanganCtx.Provider>
  );
};
