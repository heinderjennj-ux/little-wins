// Opening Variasi 6 (Riset 9 menit kartun) dalam 3D gaya kartun ruangan — 7,4 dtk, 1080x1920.
// Adegan 1 (3 shot): ruang keluarga malam, anak di sofa terpaku ke HP (reels), jam digital 09:00.
// Adegan 2: ruang kerja peneliti — rak buku, meja, dua ahli + asisten, kamera maju pelan.
import { RoundedBox } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import { ThreeCanvas } from "@remotion/three";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

loadFont({ family: "Fredoka", url: staticFile("font/Fredoka.ttf") });

const BIRU = "#2F80ED";
const NAVY = "#22324A";
const MERAH = "#EF5B5B";
const KUNING = "#F7C948";
const KULIT = "#F2C7A0";
const ADEGAN2 = 134; // "Para" mulai 4,52 dtk

// waktu kata dari kata.json Variasi 6
const KATA: [string, number][] = [
  ["apa", 0], ["yang", 0.32], ["terjadi", 0.52], ["kalau", 1.12], ["anak", 1.4], ["nonton", 1.64],
  ["kartun", 1.98], ["cuma", 2.86], ["9", 3.26], ["menit?", 3.58],
  ["para", 4.52], ["ahli", 4.76], ["psikologi", 5.0], ["anak", 5.6], ["pernah", 5.86], ["mengujinya", 6.3],
];
const KELOMPOK = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9], [10, 11, 12], [13, 14, 15]];
const AKHIR = 7.22;

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const ease = Easing.inOut(Easing.cubic);
const acak = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
type V3 = [number, number, number];

// ---------- alat bantu ----------
const useGambar = (srcs: string[]) => {
  const [img, setImg] = useState<Record<string, HTMLImageElement>>({});
  const [handle] = useState(() => delayRender("gambar"));
  useEffect(() => {
    Promise.all(
      srcs.map(
        (s) =>
          new Promise<[string, HTMLImageElement]>((ok) => {
            const i = new Image();
            i.onload = () => ok([s, i]);
            i.onerror = () => ok([s, i]);
            i.src = staticFile(s);
          }),
      ),
    ).then((r) => {
      setImg(Object.fromEntries(r));
      continueRender(handle);
    });
  }, []);
  return img;
};

// tekstur dari kanvas (wallpaper, lantai kayu, karpet)
const useKanvas = (w: number, h: number, gambar: (c: CanvasRenderingContext2D) => void, ulang: [number, number] = [1, 1]) =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    gambar(c.getContext("2d")!);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...ulang);
    t.anisotropy = 8;
    return t;
  }, []);

const Kamera: React.FC<{ pos: V3; lihat: V3; fov?: number }> = ({ pos, lihat, fov = 32 }) => {
  const { camera } = useThree();
  camera.position.set(...pos);
  (camera as THREE.PerspectiveCamera).fov = fov;
  camera.lookAt(...lihat);
  camera.updateProjectionMatrix();
  return null;
};

// pantulan lembut + semua benda memberi & menerima bayangan
const Suasana: React.FC<{ env?: number }> = ({ env = 0.35 }) => {
  const { gl, scene } = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = env;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
  }, [gl, scene]);
  useLayoutEffect(() => {
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh && !m.userData.tanpaBayangan) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
  });
  return null;
};

const Efek: React.FC = () => (
  <EffectComposer multisampling={4}>
    <Bloom intensity={0.7} luminanceThreshold={0.82} luminanceSmoothing={0.2} mipmapBlur />
    <Vignette offset={0.32} darkness={0.55} />
  </EffectComposer>
);

const Mat: React.FC<{ c: string; r?: number; m?: number; e?: string; ei?: number }> = ({ c, r = 0.7, m = 0, e, ei = 0 }) => (
  <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? "#000"} emissiveIntensity={ei} />
);

// ================= TOKOH (kepala bulat besar, kaki lidi) =================
type Rambut = "anak" | "sanggul" | "uban" | "kuncir";
type OrangProps = {
  baju: string;
  celana?: string;
  rambut: Rambut;
  warnaRambut?: string;
  jas?: boolean;
  kacamata?: boolean;
  jenggot?: boolean;
  duduk?: boolean;
  lenganKi?: V3;
  lenganKa?: V3;
  kepala?: V3; // rotasi kepala
  lirik?: [number, number]; // arah pupil
  kedip?: number; // 0 terbuka – 1 tertutup
  mulut?: number; // 0 senyum – 1 melongo
  pupil?: number;
  alis?: number;
  posisi?: V3;
  putar?: number;
  skala?: number;
  pegang?: React.ReactNode;
};

const Orang: React.FC<OrangProps> = ({
  baju, celana = NAVY, rambut, warnaRambut = "#5A3A22", jas, kacamata, jenggot, duduk,
  lenganKi = [0, 0, 0.12], lenganKa = [0, 0, -0.12], kepala = [0, 0, 0], lirik = [0, 0], kedip = 0, mulut = 0,
  pupil = 1, alis = 0, posisi = [0, 0, 0], putar = 0, skala = 1, pegang,
}) => {
  const H = duduk ? 0.47 : 0.74;
  const warnaLengan = jas ? "#FFFFFF" : KULIT;
  const lengan = (sisi: number, rot: V3) => (
    <group position={[0.2 * sisi, H + 0.38, 0]} rotation={rot}>
      <mesh position={[0, -0.08, 0]}>
        <sphereGeometry args={[jas ? 0.075 : 0.07, 16, 16]} />
        <Mat c={jas ? "#FFFFFF" : baju} />
      </mesh>
      <mesh position={[0, -0.22, 0]}>
        <cylinderGeometry args={[jas ? 0.045 : 0.03, jas ? 0.045 : 0.03, 0.4, 12]} />
        <Mat c={warnaLengan} />
      </mesh>
      <mesh position={[0, -0.44, 0]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <Mat c={KULIT} />
      </mesh>
    </group>
  );
  const kaki = (sisi: number) =>
    duduk ? (
      <group key={sisi} position={[0.085 * sisi, H, 0]}>
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 12]} />
          <Mat c={celana} />
        </mesh>
        <mesh position={[0, -H / 2, 0.4]}>
          <cylinderGeometry args={[0.032, 0.032, H, 12]} />
          <Mat c="#2A2A33" />
        </mesh>
        <mesh position={[0, -H + 0.03, 0.44]} scale={[1, 0.55, 1.5]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <Mat c="#2A2A33" />
        </mesh>
      </group>
    ) : (
      <group key={sisi} position={[0.085 * sisi, 0, 0]}>
        <mesh position={[0, H / 2, 0]}>
          <cylinderGeometry args={[0.035, 0.035, H, 12]} />
          <Mat c={jas ? celana : "#2A2A33"} />
        </mesh>
        <mesh position={[0, 0.03, 0.03]} scale={[1, 0.55, 1.5]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <Mat c="#2A2A33" />
        </mesh>
      </group>
    );
  const mata = (sisi: number) => (
    <group position={[0.105 * sisi, 0.04, 0.245]} scale={[1, 1 - 0.92 * kedip, 1]}>
      <mesh scale={[1, 1.15, 0.7]}>
        <sphereGeometry args={[0.078, 24, 24]} />
        <Mat c="#FFFFFF" r={0.25} />
      </mesh>
      <mesh position={[lirik[0] * 0.03, lirik[1] * 0.03, 0.05]} scale={[pupil, pupil, 0.5]}>
        <sphereGeometry args={[0.04, 20, 20]} />
        <Mat c="#111" r={0.2} />
      </mesh>
      <mesh position={[lirik[0] * 0.03 + 0.014, lirik[1] * 0.03 + 0.016, 0.072]}>
        <sphereGeometry args={[0.011, 10, 10]} />
        <meshBasicMaterial color="#fff" />
      </mesh>
    </group>
  );
  return (
    <group position={posisi} rotation={[0, putar, 0]} scale={skala}>
      {[-1, 1].map(kaki)}
      {/* celana */}
      <mesh position={[0, H + 0.02, 0]}>
        <cylinderGeometry args={[0.16, 0.17, 0.14, 24]} />
        <Mat c={celana} />
      </mesh>
      {/* badan */}
      <mesh position={[0, H + 0.24, 0]}>
        <capsuleGeometry args={[0.165, 0.18, 8, 24]} />
        <Mat c={baju} />
      </mesh>
      {jas && (
        <>
          <mesh position={[0, H + 0.12, 0]}>
            <cylinderGeometry args={[0.18, 0.225, 0.62, 32, 1, true, 0.42, Math.PI * 2 - 0.84]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0.11, H + 0.25, 0.17]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[0.07, 0.09, 0.01]} />
            <Mat c="#DDEBFA" />
          </mesh>
        </>
      )}
      {lengan(-1, lenganKi)}
      {lengan(1, lenganKa)}
      {pegang}
      {/* kepala */}
      <group position={[0, H + 0.78, 0]} rotation={kepala}>
        <mesh>
          <sphereGeometry args={[0.3, 40, 40]} />
          <Mat c={KULIT} r={0.6} />
        </mesh>
        {/* rambut */}
        <mesh rotation={[-0.35, 0, 0]}>
          <sphereGeometry args={[0.312, 40, 40, 0, Math.PI * 2, 0, rambut === "uban" ? 1.05 : 1.25]} />
          <Mat c={warnaRambut} r={0.8} />
        </mesh>
        {rambut === "sanggul" && (
          <mesh position={[0, 0.2, -0.24]}>
            <sphereGeometry args={[0.12, 24, 24]} />
            <Mat c={warnaRambut} r={0.8} />
          </mesh>
        )}
        {rambut === "kuncir" && (
          <mesh position={[0, 0.02, -0.33]} rotation={[0.5, 0, 0]} scale={[0.8, 1.6, 0.8]}>
            <sphereGeometry args={[0.09, 20, 20]} />
            <Mat c={warnaRambut} r={0.8} />
          </mesh>
        )}
        {(rambut === "sanggul" || rambut === "kuncir") &&
          [-1, 1].map((s) => (
            <mesh key={s} position={[0.27 * s, -0.04, -0.04]} scale={[0.35, 1, 0.8]}>
              <sphereGeometry args={[0.16, 20, 20]} />
              <Mat c={warnaRambut} r={0.8} />
            </mesh>
          ))}
        {jenggot && (
          <mesh position={[0, -0.1, 0.05]} rotation={[0.3, 0, 0]}>
            <sphereGeometry args={[0.29, 32, 32, Math.PI * 0.15, Math.PI * 0.7, Math.PI * 0.55, Math.PI * 0.4]} />
            <meshStandardMaterial color="#8B8B8B" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
        )}
        {mata(-1)}
        {mata(1)}
        {/* alis */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.105 * s, 0.15 + alis * 0.03, 0.262]} rotation={[-0.3, 0, -s * (0.12 + alis * 0.15)]}>
            <boxGeometry args={[0.09, 0.018, 0.02]} />
            <Mat c="#3A2616" />
          </mesh>
        ))}
        {/* hidung */}
        <mesh position={[0, -0.04, 0.3]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <Mat c="#E8B48A" />
        </mesh>
        {/* mulut */}
        <mesh position={[0, -0.13, 0.272]} rotation={[-0.4, 0, 0]} scale={[0.045 + 0.01 * mulut, 0.012 + 0.04 * mulut, 0.02]}>
          <sphereGeometry args={[1, 20, 20]} />
          <Mat c="#5A1E1E" />
        </mesh>
        {kacamata && (
          <group position={[0, 0.04, 0.3]}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[0.105 * s, 0, 0]}>
                <torusGeometry args={[0.085, 0.012, 10, 32]} />
                <Mat c="#3A2616" r={0.3} />
              </mesh>
            ))}
            <mesh>
              <boxGeometry args={[0.05, 0.012, 0.012]} />
              <Mat c="#3A2616" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};

// ================= LAYAR HP: reels bergeser cepat =================
const REELS = ["img/reel1.jpg", "img/reel2.jpg", "img/reel3.jpg", "img/reel4.jpg"];
const WARNA_REEL = ["#FF4FD8", "#3FD0FF", "#FFD23F", "#7CFF6B"];
const GESER_TIAP = 0.5, GESER_LAMA = 0.16;
const reelKe = (t: number) => {
  const n = Math.floor(t / GESER_TIAP);
  return { n, p: ease(clamp((t - n * GESER_TIAP - (GESER_TIAP - GESER_LAMA)) / GESER_LAMA)) };
};

const LayarReels: React.FC<{ t: number; w: number; h: number }> = ({ t, w, h }) => {
  const img = useGambar(REELS);
  const [kanvas] = useState(() => {
    const c = document.createElement("canvas");
    c.width = 376;
    c.height = 680;
    return c;
  });
  const tekstur = useMemo(() => {
    const tx = new THREE.CanvasTexture(kanvas);
    tx.colorSpace = THREE.SRGBColorSpace;
    return tx;
  }, [kanvas]);
  const { n, p } = reelKe(t);
  const ctx = kanvas.getContext("2d")!;
  const W = 376, H = 680;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  const a = img[REELS[n % 4]], b = img[REELS[(n + 1) % 4]];
  if (a) ctx.drawImage(a, 0, -p * H, W, H);
  if (b && p > 0) ctx.drawImage(b, 0, H - p * H, W, H);
  ctx.fillStyle = "rgba(255,255,255,.35)";
  ctx.fillRect(15, H - 20, W - 30, 4);
  ctx.fillStyle = "#fff";
  ctx.fillRect(15, H - 20, (W - 30) * ((t % GESER_TIAP) / GESER_TIAP), 4);
  tekstur.needsUpdate = true;
  return (
    <mesh userData={{ tanpaBayangan: true }}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tekstur} toneMapped={false} />
    </mesh>
  );
};

// ================= JAM DIGITAL 7-SEGMEN =================
const SEG: Record<string, string> = { "0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcdfg" };
const Digit: React.FC<{ d: string; x: number }> = ({ d, x }) => {
  const Wd = 0.05, Hd = 0.09, tb = 0.012;
  const pos: Record<string, [number, number, boolean]> = {
    a: [0, Hd / 2, true], b: [Wd / 2, Hd / 4, false], c: [Wd / 2, -Hd / 4, false], d: [0, -Hd / 2, true],
    e: [-Wd / 2, -Hd / 4, false], f: [-Wd / 2, Hd / 4, false], g: [0, 0, true],
  };
  return (
    <group position={[x, 0, 0]}>
      {Object.entries(pos).map(([s, [px, py, dat]]) =>
        SEG[d].includes(s) ? (
          <mesh key={s} position={[px, py, 0]} userData={{ tanpaBayangan: true }}>
            <boxGeometry args={dat ? [Wd - tb, tb, 0.004] : [tb, Hd / 2 - tb, 0.004]} />
            <meshBasicMaterial color={[4, 0.5, 0.45]} toneMapped={false} />
          </mesh>
        ) : null,
      )}
    </group>
  );
};

const JamDigital: React.FC<{ t: number; posisi: V3; putar: number; skala: number }> = ({ t, posisi, putar, skala }) => {
  const menit = Math.min(9, Math.floor(clamp((t - 3.26) / 0.3) * 9.99));
  const titikDua = Math.floor(t * 2) % 2 === 0;
  return (
    <group position={posisi} rotation={[0, putar, 0]} scale={skala}>
      <RoundedBox args={[0.34, 0.16, 0.1]} radius={0.02} position={[0, 0.08, 0]}>
        <Mat c="#1B1B22" r={0.4} />
      </RoundedBox>
      <mesh position={[0, 0.085, 0.051]}>
        <planeGeometry args={[0.3, 0.12]} />
        <Mat c="#0A0A0E" r={0.2} />
      </mesh>
      <group position={[0, 0.085, 0.054]}>
        <Digit d="0" x={-0.105} />
        <Digit d={String(menit)} x={-0.04} />
        {titikDua &&
          [0.02, -0.02].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <boxGeometry args={[0.012, 0.012, 0.004]} />
              <meshBasicMaterial color={[4, 0.5, 0.45]} toneMapped={false} />
            </mesh>
          ))}
        <Digit d="0" x={0.04} />
        <Digit d="0" x={0.105} />
      </group>
      <pointLight position={[0, 0.1, 0.2]} color={MERAH} intensity={0.5 * skala} distance={1.2} />
    </group>
  );
};

// ================= ADEGAN 1: ruang keluarga malam =================
const RuangKeluarga: React.FC = () => {
  const wallpaper = useKanvas(256, 256, (c) => {
    c.fillStyle = "#F1D9A8";
    c.fillRect(0, 0, 256, 256);
    c.fillStyle = "#E6C68C";
    for (let x = 0; x < 256; x += 64) c.fillRect(x, 0, 26, 256);
    c.fillStyle = "rgba(255,255,255,.25)";
    for (let x = 30; x < 256; x += 64) c.fillRect(x, 0, 4, 256);
  }, [6, 3]);
  const lantai = useKanvas(512, 512, (c) => {
    const r = acak(7);
    for (let y = 0; y < 512; y += 64)
      for (let x = -((y / 64) % 2) * 128; x < 512; x += 256) {
        const v = 150 + r() * 30;
        c.fillStyle = `rgb(${v},${v * 0.62},${v * 0.36})`;
        c.fillRect(x, y, 256, 64);
        c.strokeStyle = "rgba(60,30,10,.45)";
        c.lineWidth = 3;
        c.strokeRect(x, y, 256, 64);
      }
  }, [3, 3]);
  const karpet = useKanvas(512, 512, (c) => {
    c.fillStyle = "#3E8E5A";
    c.fillRect(0, 0, 512, 512);
    c.strokeStyle = "#F4E3B5";
    c.lineWidth = 10;
    c.strokeRect(30, 30, 452, 452);
    c.lineWidth = 5;
    for (let y = 90; y < 460; y += 70)
      for (let x = 90; x < 460; x += 70) {
        c.beginPath();
        c.moveTo(x, y - 18);
        c.lineTo(x + 18, y);
        c.lineTo(x, y + 18);
        c.lineTo(x - 18, y);
        c.closePath();
        c.stroke();
      }
  });
  const langit = useKanvas(256, 256, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, "#1C2B5A");
    g.addColorStop(1, "#4A5C9A");
    c.fillStyle = g;
    c.fillRect(0, 0, 256, 256);
    c.fillStyle = "#FFF6D0";
    c.beginPath();
    c.arc(180, 70, 22, 0, Math.PI * 2);
    c.fill();
    const r = acak(3);
    for (let i = 0; i < 30; i++) c.fillRect(r() * 256, r() * 160, 2, 2);
  });
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]}>
        <planeGeometry args={[9, 9]} />
        <meshStandardMaterial map={lantai} roughness={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.9]}>
        <planeGeometry args={[2.6, 2.0]} />
        <meshStandardMaterial map={karpet} roughness={0.95} />
      </mesh>
      {/* dinding belakang & kiri */}
      <mesh position={[0, 2, -1.3]}>
        <planeGeometry args={[9, 4]} />
        <meshStandardMaterial map={wallpaper} roughness={0.9} />
      </mesh>
      <mesh position={[-2.6, 2, 1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[9, 4]} />
        <meshStandardMaterial map={wallpaper} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.06, -1.28]}>
        <boxGeometry args={[9, 0.12, 0.04]} />
        <Mat c="#8A5A35" />
      </mesh>
      {/* jendela malam + tirai ungu */}
      <group position={[-1.15, 1.75, -1.27]}>
        <mesh>
          <boxGeometry args={[1.0, 0.85, 0.05]} />
          <Mat c="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0, 0.03]} userData={{ tanpaBayangan: true }}>
          <planeGeometry args={[0.88, 0.73]} />
          <meshBasicMaterial map={langit} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.03, 0.75, 0.02]} />
          <Mat c="#FFFFFF" />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.58 * s, -0.05, 0.08]}>
            <boxGeometry args={[0.22, 1.15, 0.06]} />
            <Mat c="#6B3FA0" r={0.9} />
          </mesh>
        ))}
      </group>
      {/* jam dinding */}
      <group position={[0.9, 2.15, -1.27]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.04, 32]} />
          <Mat c="#FFFFFF" />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <torusGeometry args={[0.17, 0.02, 10, 32]} />
          <Mat c="#2D2D35" />
        </mesh>
        <mesh position={[0.03, 0.03, 0.03]} rotation={[0, 0, -0.8]}>
          <boxGeometry args={[0.012, 0.1, 0.01]} />
          <Mat c="#222" />
        </mesh>
      </group>
      {/* bingkai foto */}
      <group position={[1.75, 1.75, -1.27]}>
        <mesh>
          <boxGeometry args={[0.55, 0.42, 0.04]} />
          <Mat c="#6B4428" />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[0.45, 0.32]} />
          <Mat c="#8FC7E8" />
        </mesh>
        <mesh position={[0, -0.08, 0.03]}>
          <planeGeometry args={[0.45, 0.14]} />
          <Mat c="#6DBE5A" />
        </mesh>
      </group>
      {/* sofa merah */}
      <group position={[0, 0, -0.55]}>
        <RoundedBox args={[1.9, 0.3, 0.75]} radius={0.06} position={[0, 0.27, 0.05]}>
          <Mat c="#C8463B" r={0.85} />
        </RoundedBox>
        <RoundedBox args={[1.9, 0.6, 0.22]} radius={0.08} position={[0, 0.6, -0.3]}>
          <Mat c="#C8463B" r={0.85} />
        </RoundedBox>
        {[-1, 1].map((s) => (
          <RoundedBox key={s} args={[0.22, 0.48, 0.8]} radius={0.08} position={[0.95 * s, 0.4, 0.03]}>
            <Mat c="#B23B31" r={0.85} />
          </RoundedBox>
        ))}
        {[-1, 1].map((s) => (
          <RoundedBox key={`b${s}`} args={[0.82, 0.12, 0.66]} radius={0.05} position={[0.42 * s, 0.46, 0.08]}>
            <Mat c="#D9574B" r={0.9} />
          </RoundedBox>
        ))}
        <RoundedBox args={[0.32, 0.32, 0.1]} radius={0.05} position={[-0.6, 0.66, -0.12]} rotation={[-0.2, 0.2, 0.15]}>
          <Mat c={KUNING} r={0.9} />
        </RoundedBox>
      </group>
      {/* meja samping + lampu tidur */}
      <group position={[1.35, 0, -0.65]}>
        <RoundedBox args={[0.5, 0.5, 0.45]} radius={0.03} position={[0, 0.25, 0]}>
          <Mat c="#9A6B42" />
        </RoundedBox>
        <mesh position={[0, 0.3, 0.226]}>
          <boxGeometry args={[0.4, 0.14, 0.01]} />
          <Mat c="#86592F" />
        </mesh>
        <mesh position={[-0.12, 0.6, -0.05]}>
          <cylinderGeometry args={[0.025, 0.06, 0.2, 16]} />
          <Mat c="#C9A46B" m={0.4} r={0.4} />
        </mesh>
        <mesh position={[-0.12, 0.76, -0.05]} userData={{ tanpaBayangan: true }}>
          <cylinderGeometry args={[0.09, 0.14, 0.16, 24, 1, true]} />
          <meshStandardMaterial color="#FFE7B0" emissive="#FFC46B" emissiveIntensity={1.6} side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[-0.12, 0.74, -0.05]} color="#FFB45E" intensity={2.2} distance={4} decay={1.6} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.002} />
      </group>
      {/* tanaman pot */}
      <group position={[-2.1, 0, -0.85]}>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.16, 0.12, 0.34, 20]} />
          <Mat c="#E07A4F" />
        </mesh>
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} position={[Math.cos(i * 1.3) * 0.08, 0.55 + (i % 2) * 0.12, Math.sin(i * 1.3) * 0.08]} rotation={[Math.cos(i * 1.3) * 0.35, 0, Math.sin(i * 1.3) * 0.35]}>
            <capsuleGeometry args={[0.05, 0.4, 6, 12]} />
            <Mat c="#4E9A4A" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Adegan1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const { n, p } = reelKe(t);
  const warnaHP = new THREE.Color(WARNA_REEL[n % 4]).lerp(new THREE.Color(WARNA_REEL[(n + 1) % 4]), p);
  const jamPop = spring({ frame: frame - Math.round(3.2 * fps), fps, config: { damping: 9, stiffness: 160 } });

  // 3 shot: lebar (0–1,4) · balik bahu ke layar (1,4–2,86) · wajah + jam (2,86–4,47)
  let cam: { pos: V3; lihat: V3; fov: number };
  if (t < 1.4) {
    const k = ease(clamp(t / 1.4));
    cam = { pos: [1.5 - 0.9 * k, 1.55 - 0.15 * k, 4.6 - 0.9 * k], lihat: [0.05, 0.85, -0.4], fov: 34 };
  } else if (t < 2.86) {
    const k = ease(clamp((t - 1.4) / 1.46));
    cam = { pos: [0.32 - 0.06 * k, 1.42 - 0.04 * k, -0.62 + 0.1 * k], lihat: [0, 0.86, 0.02], fov: 30 - 4 * k };
  } else {
    const k = ease(clamp((t - 2.86) / 1.6));
    cam = { pos: [0.75 - 0.25 * k, 1.12, 1.55 - 0.45 * k], lihat: [0.15, 0.95, -0.4], fov: 32 };
  }
  // anak terpaku: kepala sedikit maju, napas kecil, sesekali kaget saat reel ganti
  const kaget = Math.sin(p * Math.PI);
  const HP = (
    <group position={[0, 0.86, 0.02]} rotation={[0.55, 0, 0]}>
      <RoundedBox args={[0.17, 0.31, 0.016]} radius={0.012}>
        <Mat c="#15151C" r={0.3} m={0.5} />
      </RoundedBox>
      <group position={[0, 0, -0.0085]} rotation={[0, Math.PI, 0]}>
        <LayarReels t={t} w={0.155} h={0.155 * (680 / 376)} />
      </group>
      <pointLight position={[0, 0.05, -0.18]} color={warnaHP} intensity={1.6 + 0.8 * kaget} distance={1.4} decay={1.5} />
    </group>
  );
  return (
    <ThreeCanvas width={width} height={height} shadows>
      <Kamera {...cam} />
      <Suasana env={0.18} />
      <ambientLight intensity={0.18} color="#9DB4FF" />
      <hemisphereLight args={["#A9B8E8", "#5A3A22", 0.25]} />
      <directionalLight position={[-3, 3.5, 2.5]} intensity={0.55} color="#B8C7FF" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} />
      <RuangKeluarga />
      <Orang
        baju="#2BB39A"
        rambut="anak"
        duduk
        skala={0.82}
        posisi={[0.05, 0.07, -0.45]}
        kepala={[0.28 + 0.02 * Math.sin(t * 2), 0, 0.03 * Math.sin(t * 1.3)]}
        lirik={[0, -0.6]}
        pupil={1.25 + 0.15 * kaget}
        mulut={0.75 + 0.15 * kaget}
        alis={0.4 * kaget}
        lenganKi={[-1.15, 0, 0.42]}
        lenganKa={[-1.15, 0, -0.42]}
        pegang={HP}
      />
      <JamDigital t={t} posisi={[1.32, 0.5, -0.55]} putar={-0.5} skala={jamPop} />
      <Efek />
    </ThreeCanvas>
  );
};

// ================= ADEGAN 2: ruang kerja para ahli =================
const Rak: React.FC<{ posisi: V3; seed: number }> = ({ posisi, seed }) => {
  const buku = useMemo(() => {
    const r = acak(seed);
    const warna = ["#C8463B", "#2F80ED", "#F2B33D", "#3E8E5A", "#7B4FB3", "#E07A4F", "#1F6F8B", "#D9D2C0"];
    const out: { x: number; y: number; w: number; h: number; c: string; m: number }[] = [];
    for (let rak = 0; rak < 4; rak++) {
      let x = -0.52;
      while (x < 0.5) {
        const w = 0.04 + r() * 0.035, h = 0.24 + r() * 0.1;
        if (r() > 0.1) out.push({ x: x + w / 2, y: 0.18 + rak * 0.48, w, h, c: warna[Math.floor(r() * warna.length)], m: (r() - 0.5) * 0.06 });
        x += w + 0.005;
      }
    }
    return out;
  }, [seed]);
  return (
    <group position={posisi}>
      <mesh position={[0, 1.0, -0.17]}>
        <boxGeometry args={[1.2, 2.0, 0.04]} />
        <Mat c="#6B4428" />
      </mesh>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 1.0, 0]}>
          <boxGeometry args={[0.05, 2.0, 0.36]} />
          <Mat c="#7E5232" />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[0, 0.03 + i * 0.48, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.36]} />
          <Mat c="#7E5232" />
        </mesh>
      ))}
      {buku.map((b, i) => (
        <mesh key={i} position={[b.x, b.y + b.h / 2 - 0.13, 0.02]} rotation={[0, 0, b.m]}>
          <boxGeometry args={[b.w, b.h, 0.26]} />
          <Mat c={b.c} r={0.75} />
        </mesh>
      ))}
    </group>
  );
};

const RuangAhli: React.FC = () => {
  const dinding = useKanvas(256, 256, (c) => {
    c.fillStyle = "#E7EEF6";
    c.fillRect(0, 0, 256, 256);
    c.fillStyle = "#DCE6F1";
    for (let x = 0; x < 256; x += 32) c.fillRect(x, 0, 14, 256);
  }, [8, 3]);
  const ubin = useKanvas(256, 256, (c) => {
    for (let y = 0; y < 256; y += 64)
      for (let x = 0; x < 256; x += 64) {
        c.fillStyle = (x + y) % 128 ? "#E9DCC6" : "#DECDB1";
        c.fillRect(x, y, 64, 64);
        c.strokeStyle = "rgba(120,90,60,.3)";
        c.lineWidth = 2;
        c.strokeRect(x, y, 64, 64);
      }
  }, [6, 6]);
  const karpet = useKanvas(512, 256, (c) => {
    c.fillStyle = "#2F6FB5";
    c.fillRect(0, 0, 512, 256);
    c.strokeStyle = "#F7C948";
    c.lineWidth = 8;
    c.strokeRect(20, 20, 472, 216);
    c.lineWidth = 4;
    c.strokeRect(40, 40, 432, 176);
  });
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial map={ubin} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.9]}>
        <planeGeometry args={[3.2, 1.6]} />
        <meshStandardMaterial map={karpet} roughness={0.95} />
      </mesh>
      <mesh position={[0, 2, -1.6]}>
        <planeGeometry args={[10, 4]} />
        <meshStandardMaterial map={dinding} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.07, -1.58]}>
        <boxGeometry args={[10, 0.14, 0.04]} />
        <Mat c="#5E7FA3" />
      </mesh>
      <Rak posisi={[-1.55, 0, -1.38]} seed={11} />
      <Rak posisi={[1.55, 0, -1.38]} seed={29} />
      {/* papan tulis grafik di tengah */}
      <group position={[0, 1.95, -1.57]}>
        <mesh>
          <boxGeometry args={[1.5, 0.95, 0.05]} />
          <Mat c="#2E4A3C" r={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.005]}>
          <boxGeometry args={[1.6, 1.05, 0.04]} />
          <Mat c="#8A5A35" />
        </mesh>
        {[0.25, 0.5, 0.35, 0.7, 0.55].map((h, i) => (
          <mesh key={i} position={[-0.5 + i * 0.25, -0.35 + h / 2, 0.03]}>
            <boxGeometry args={[0.13, h, 0.01]} />
            <meshStandardMaterial color={[KUNING, "#FFFFFF", MERAH, "#7FD1FF", KUNING][i]} roughness={0.9} />
          </mesh>
        ))}
      </group>
      {/* meja kerja */}
      <group position={[0, 0, -0.75]}>
        <RoundedBox args={[1.9, 0.07, 0.75]} radius={0.02} position={[0, 0.76, 0]}>
          <Mat c="#A06B3E" r={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.4, -0.2]}>
          <boxGeometry args={[1.8, 0.7, 0.04]} />
          <Mat c="#8A5A35" />
        </mesh>
        {[-0.88, 0.88].map((x) => (
          <mesh key={x} position={[x, 0.38, 0]}>
            <boxGeometry args={[0.07, 0.76, 0.7]} />
            <Mat c="#8A5A35" />
          </mesh>
        ))}
        {/* laptop */}
        <group position={[0.45, 0.8, 0.05]} rotation={[0, -0.4, 0]}>
          <RoundedBox args={[0.42, 0.02, 0.3]} radius={0.008}>
            <Mat c="#B8BEC8" m={0.6} r={0.3} />
          </RoundedBox>
          <group position={[0, 0.14, -0.15]} rotation={[-0.25, 0, 0]}>
            <RoundedBox args={[0.42, 0.28, 0.015]} radius={0.008}>
              <Mat c="#B8BEC8" m={0.6} r={0.3} />
            </RoundedBox>
            <mesh position={[0, 0, 0.009]} userData={{ tanpaBayangan: true }}>
              <planeGeometry args={[0.38, 0.24]} />
              <meshStandardMaterial color="#CFE6FF" emissive="#8EC5FF" emissiveIntensity={0.9} />
            </mesh>
          </group>
        </group>
        {/* tumpukan kertas + toples otak */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[-0.25, 0.81 + i * 0.012, 0.1]} rotation={[0, 0.1 * i - 0.1, 0]}>
            <boxGeometry args={[0.26, 0.01, 0.34]} />
            <Mat c="#FAFAF5" />
          </mesh>
        ))}
        <group position={[-0.7, 0.8, 0]}>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.28, 24]} />
            <meshPhysicalMaterial color="#DDF2FF" transmission={0.6} roughness={0.1} thickness={0.05} transparent opacity={0.45} />
          </mesh>
          {[[0, 0.13, 0, 0.07], [0.04, 0.16, 0.01, 0.06], [-0.04, 0.16, 0.01, 0.06], [0, 0.18, -0.02, 0.06]].map(([x, y, z, r], i) => (
            <mesh key={i} position={[x, y, z]}>
              <sphereGeometry args={[r, 16, 16]} />
              <Mat c="#FF9EC4" r={0.5} />
            </mesh>
          ))}
        </group>
        {/* lampu meja */}
        <group position={[0.82, 0.8, -0.2]}>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.08, 0.09, 0.03, 20]} />
            <Mat c="#2F80ED" />
          </mesh>
          <mesh position={[-0.05, 0.22, 0]} rotation={[0, 0, 0.35]}>
            <cylinderGeometry args={[0.012, 0.012, 0.42, 8]} />
            <Mat c="#2F80ED" />
          </mesh>
          <mesh position={[-0.15, 0.4, 0.04]} rotation={[0.3, 0, 0.9]}>
            <coneGeometry args={[0.09, 0.14, 20, 1, true]} />
            <meshStandardMaterial color="#2F80ED" side={THREE.DoubleSide} />
          </mesh>
          <pointLight position={[-0.2, 0.35, 0.08]} color="#FFD08A" intensity={1.2} distance={2.2} />
        </group>
      </group>
      {/* tanaman */}
      <group position={[2.5, 0, -1.2]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 0.4, 20]} />
          <Mat c="#FFFFFF" />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh key={i} position={[Math.cos(i) * 0.1, 0.7 + (i % 3) * 0.12, Math.sin(i) * 0.1]} rotation={[Math.cos(i) * 0.4, 0, Math.sin(i) * 0.4]}>
            <capsuleGeometry args={[0.06, 0.5, 6, 12]} />
            <Mat c="#3E8E5A" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const Papan: React.FC = () => (
  <group position={[0.02, 0.6, 0.3]} rotation={[-0.5, 0, 0]}>
    <RoundedBox args={[0.24, 0.32, 0.015]} radius={0.01}>
      <Mat c="#3D6FB6" />
    </RoundedBox>
    <mesh position={[0, -0.01, 0.009]}>
      <planeGeometry args={[0.2, 0.25]} />
      <Mat c="#FFFFFF" />
    </mesh>
    <mesh position={[0, 0.14, 0.012]}>
      <boxGeometry args={[0.08, 0.03, 0.01]} />
      <Mat c="#B8BEC8" m={0.6} r={0.3} />
    </mesh>
  </group>
);

const Adegan2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t0 = ADEGAN2 / fps;
  const t = frame / fps + t0;
  const k = Easing.out(Easing.cubic)(clamp((t - t0) / (7.4 - t0)));
  const cam: V3 = [-1.0 + 1.3 * k, 1.5 - 0.15 * k, 5.4 - 1.1 * k];
  // muncul satu-satu mengikuti kata: Para · ahli · psikologi
  const lompat = (mulai: number) => {
    const s = spring({ frame: frame - Math.round((mulai - t0) * fps), fps, config: { damping: 10, stiffness: 170 } });
    return { s, y: (1 - s) * 0.35 };
  };
  const a1 = lompat(4.5), a2 = lompat(4.74), a3 = lompat(4.98);
  const kedip = (geser: number) => (((t + geser) % 3.1) > 2.95 ? 1 : 0);
  const lambai = Math.sin(t * 7) * 0.25;
  return (
    <ThreeCanvas width={width} height={height} shadows>
      <Kamera pos={cam} lihat={[0.05, 1.0, -0.4]} fov={34} />
      <Suasana env={0.35} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#FFFFFF", "#D8C4A6", 0.45]} />
      <directionalLight position={[2.5, 4, 3.5]} intensity={1.6} color="#FFF3E0" castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005} shadow-camera-left={-4} shadow-camera-right={4} shadow-camera-top={4} shadow-camera-bottom={-4} />
      <RuangAhli />
      {/* ahli 1: perempuan berkacamata, melambai */}
      <Orang
        baju="#2BB39A" celana="#3A4660" rambut="sanggul" warnaRambut="#3B2416" jas kacamata
        posisi={[-0.62, a1.y, 0.35]} putar={0.25} skala={a1.s * 0.95}
        lenganKa={[0, 0, -2.4 - lambai]} lenganKi={[0, 0, 0.15]}
        kepala={[0, 0, 0.06 * Math.sin(t * 2.2)]} lirik={[0.2, 0]} kedip={kedip(0)} mulut={0.25 + 0.2 * Math.abs(Math.sin(t * 9))}
      />
      {/* ahli 2: laki-laki beruban berjenggot, tangan menunjuk */}
      <Orang
        baju={NAVY} celana="#2A2F3E" rambut="uban" warnaRambut="#9A9A9A" jas jenggot
        posisi={[0.68, a2.y, 0.3]} putar={-0.3} skala={a2.s}
        lenganKi={[-0.9, 0, 0.5]} lenganKa={[0, 0, -0.12]}
        kepala={[0, 0, -0.05 * Math.sin(t * 1.8)]} lirik={[-0.2, 0]} kedip={kedip(1.3)} mulut={0.1}
      />
      {/* asisten di belakang meja, pegang papan klip */}
      <Orang
        baju="#9A86D8" rambut="kuncir" warnaRambut="#2B1A10" jas
        posisi={[0.05, a3.y - 0.05, -1.3]} skala={a3.s * 0.88}
        lenganKi={[-1.0, 0, 0.35]} lenganKa={[-1.0, 0, -0.35]}
        kepala={[0.05, 0, 0]} lirik={[0, 0]} kedip={kedip(2.1)} mulut={0.15}
        pegang={<Papan />}
      />
      <Efek />
    </ThreeCanvas>
  );
};

// ================= lapisan HTML: judul + subtitle =================
const Kata: React.FC<{ teks: string; mulai: number; sorot?: boolean }> = ({ teks, mulai, sorot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - Math.round(mulai * fps), fps, config: { damping: sorot ? 9 : 14, stiffness: 160 } });
  return (
    <span
      style={{
        display: "inline-block",
        opacity: clamp(s * 3),
        scale: String(sorot ? 0.3 + 0.7 * s : 1),
        translate: sorot ? undefined : `0px ${(1 - s) * 30}px`,
        transformOrigin: "30% 60%",
        textShadow: sorot ? undefined : "0 4px 0 rgba(0,0,0,.25), 0 0 18px rgba(0,0,0,.35)",
        ...(sorot ? { color: "#fff", background: BIRU, padding: "0 20px 8px", borderRadius: 20, boxShadow: "0 10px 24px rgba(0,0,0,.25)" } : { color: "#fff" }),
      }}
    >
      {teks}
    </span>
  );
};

const Judul: React.FC<{ dari: number; sampai: number; baris: [string, number, boolean?][] }> = ({ dari, sampai, baris }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < dari || t >= sampai) return null;
  return (
    <div style={{ position: "absolute", left: 72, right: 60, top: 280, fontFamily: "Fredoka", fontWeight: 700, fontSize: 104, lineHeight: 1.15, letterSpacing: -0.5 }}>
      {baris.map(([tx, m, hl], i) => (
        <div key={i}>
          <Kata teks={tx} mulai={m} sorot={hl} />
        </div>
      ))}
    </div>
  );
};

const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let g = -1;
  KELOMPOK.forEach((k, i) => { if (KATA[k[0]][1] - 0.05 <= t) g = i; });
  if (g < 0 || t > AKHIR + 0.6) return null;
  const kel = KELOMPOK[g];
  let aktif = kel[0];
  kel.forEach((i) => { if (KATA[i][1] - 0.05 <= t) aktif = i; });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1441, textAlign: "center" }}>
      <span style={{ display: "inline-block", background: NAVY, color: "#fff", fontFamily: "Fredoka", fontWeight: 600, fontSize: 48, padding: "10px 32px 14px", borderRadius: 20 }}>
        {kel.map((i, n) => (
          <React.Fragment key={i}>
            {n > 0 && " "}
            <b style={{ fontWeight: 600, color: i === aktif ? KUNING : "#fff" }}>{KATA[i][0]}</b>
          </React.Fragment>
        ))}
      </span>
    </div>
  );
};

export const Opening3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // kilat putih singkat di tiap pergantian shot
  const kilat = Math.max(
    ...[1.4, 2.86].map((c) => interpolate(t, [c - 0.04, c, c + 0.14], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
    interpolate(t, [4.32, 4.47, 4.72], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ background: "#1B2233" }}>
      <Audio src={staticFile("opening-audio.mp3")} />
      <Sequence name="Adegan 1 - Anak & HP" durationInFrames={ADEGAN2}>
        <Adegan1 />
      </Sequence>
      <Sequence name="Adegan 2 - Para ahli" from={ADEGAN2}>
        <Adegan2 />
      </Sequence>
      <Judul dari={0} sampai={4.47} baris={[["Apa jadinya…", 0], ["kartun 9 menit?", 1.98, true]]} />
      <Judul dari={4.47} sampai={99} baris={[["Para ahli", 4.52], ["psikologi anak.", 5.0, true]]} />
      <Subtitle />
      <AbsoluteFill style={{ background: "#fff", opacity: kilat }} />
    </AbsoluteFill>
  );
};
