import { Composition, Folder, Still } from "remotion";
import { Opening3D } from "./Opening3D";
import { Film } from "./storybook/Film";
import { DURASI } from "./storybook/naskah";
import { Film as FilmGaya } from "./gaya/Film";
import { AnimasiV7, DURASI_V7, GambarAdegan, JUMLAH_ADEGAN, PrototipeV7 } from "./v7/Prototipe";
import { AnimasiDiet, DURASI as DURASI_DIET, GambarDiet, JUMLAH_DIET } from "./diet/Prototipe";
import { DURASI_UJI, LembarRig, UjiKarakter } from "./uji/Uji";
import { DURASI_LW_HOOK, HookLW } from "./lw/Hook";
import { AnimaticLW2, DURASI_LW2, GambarLW2, JUMLAH_LW2 } from "./lw2/Prototipe";
import { AnimaticV8, DURASI_V8, GambarV8, JUMLAH_V8 } from "./v8/Prototipe";
import { GambarTW, JUMLAH_TW } from "./terowongan/Prototipe";
import { AnimasiTW, DURASI_TW } from "./terowongan/Animasi";
import { GambarKS, KS_STILL } from "./kapalselam/Prototipe";
import { AnimasiKS, DURASI_KS } from "./kapalselam/Animasi";
import { GambarGU, GU_STILL } from "./gua/Prototipe";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Shorts-Gua-Prototipe">
        {GU_STILL.map(({ id, n }) => (
          <Still key={id} id={id} component={GambarGU} defaultProps={{ n }} width={1080} height={1920} />
        ))}
      </Folder>
      <Composition id="KS-Animasi" component={AnimasiKS} durationInFrames={DURASI_KS} fps={30} width={1080} height={1920} />
      <Folder name="Shorts-KapalSelam-Prototipe">
        {KS_STILL.map(({ id, n, k }) => (
          <Still key={id} id={id} component={GambarKS} defaultProps={{ n, k }} width={1080} height={1920} />
        ))}
      </Folder>
      <Composition id="TW-Animasi" component={AnimasiTW} durationInFrames={DURASI_TW} fps={30} width={1080} height={1920} />
      <Folder name="Shorts-Terowongan-Prototipe">
        {Array.from({ length: JUMLAH_TW }).map((_, n) => (
          <Still key={n} id={`TW${String(n + 1).padStart(2, "0")}`} component={GambarTW} defaultProps={{ n }} width={1080} height={1920} />
        ))}
      </Folder>
      <Folder name="Little-Wins">
        <Composition id="LW-V7-Hook-EN" component={HookLW} durationInFrames={DURASI_LW_HOOK} fps={30} width={1080} height={1920} />
        <Composition id="LW2-Animatic" component={AnimaticLW2} durationInFrames={DURASI_LW2} fps={30} width={1080} height={1920} />
        <Folder name="LW2-Prototipe">
          {Array.from({ length: JUMLAH_LW2 }).map((_, n) => (
            <Still key={n} id={`L${String(n + 1).padStart(2, "0")}`} component={GambarLW2} defaultProps={{ n }} width={1080} height={1920} />
          ))}
        </Folder>
      </Folder>
      <Folder name="Koder-Cilik-V8">
        <Composition id="V8-Animasi" component={AnimaticV8} durationInFrames={DURASI_V8} fps={30} width={1080} height={1920} />
        {Array.from({ length: JUMLAH_V8 }).map((_, n) => (
          <Still key={n} id={`K${String(n + 1).padStart(2, "0")}`} component={GambarV8} defaultProps={{ n }} width={1080} height={1920} />
        ))}
      </Folder>
      <Composition id="V7-Animasi" component={AnimasiV7} durationInFrames={DURASI_V7} fps={30} width={1080} height={1920} />
      <Folder name="V7-Prototipe-Triad">
        <Composition id="V7-Animatic" component={PrototipeV7} durationInFrames={DURASI_V7} fps={30} width={1080} height={1920} />
        {Array.from({ length: JUMLAH_ADEGAN }).map((_, n) => (
          <Still key={n} id={`P${String(n + 1).padStart(2, "0")}`} component={GambarAdegan} defaultProps={{ n }} width={1080} height={1920} />
        ))}
      </Folder>
      <Composition id="Diet-Animasi" component={AnimasiDiet} durationInFrames={DURASI_DIET} fps={30} width={1080} height={1920} />
      <Folder name="Diet-V3-Prototipe">
        {Array.from({ length: JUMLAH_DIET }).map((_, n) => (
          <Still key={n} id={`D${String(n + 1).padStart(2, "0")}`} component={GambarDiet} defaultProps={{ n }} width={1080} height={1920} />
        ))}
      </Folder>
      <Folder name="Uji-Karakter">
        <Composition id="UjiKarakter-AI" component={UjiKarakter} defaultProps={{ versi: "ai" as const }} durationInFrames={DURASI_UJI} fps={30} width={1080} height={1920} />
        <Composition id="UjiKarakter-Kode" component={UjiKarakter} defaultProps={{ versi: "kode" as const }} durationInFrames={DURASI_UJI} fps={30} width={1080} height={1920} />
        <Still id="LembarRig" component={LembarRig} width={1920} height={1080} />
      </Folder>
      <Folder name="Uji-Gaya">
        <Composition id="V2AplikasiTap" component={Film} durationInFrames={DURASI} fps={30} width={1080} height={1920} />
        <Composition id="GayaA-BiruAdem" component={FilmGaya} defaultProps={{ gaya: "A" as const }} durationInFrames={DURASI} fps={30} width={1080} height={1920} />
        <Composition id="GayaB-SorotanCahaya" component={FilmGaya} defaultProps={{ gaya: "B" as const }} durationInFrames={DURASI} fps={30} width={1080} height={1920} />
        <Composition id="GayaC-KremAksenBiru" component={FilmGaya} defaultProps={{ gaya: "C" as const }} durationInFrames={DURASI} fps={30} width={1080} height={1920} />
        <Composition id="GayaAB-BiruAdemSorotan" component={FilmGaya} defaultProps={{ gaya: "AB" as const }} durationInFrames={DURASI} fps={30} width={1080} height={1920} />
        <Composition id="GayaD-OranyeTeal" component={FilmGaya} defaultProps={{ gaya: "D" as const }} durationInFrames={DURASI} fps={30} width={1080} height={1920} />
        <Composition id="GayaE-Triad" component={FilmGaya} defaultProps={{ gaya: "E" as const }} durationInFrames={DURASI} fps={30} width={1080} height={1920} />
        <Composition id="Variasi6Opening3D" component={Opening3D} durationInFrames={222} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
