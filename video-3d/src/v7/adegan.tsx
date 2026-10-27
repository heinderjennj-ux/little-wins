// Storyboard Variasi 7: 31 adegan, masing-masing satu gambar kunci (prototipe), mengikuti waktu suara asli (kata.json).
// Revisi owner (rekaman 2026-10-25): karakter = pose AI; soal/kertas/jari = aset asli; iklan seperti iklan sungguhan;
// lampu belajar jelas; cahaya tidak lebay; gerak tidak alay (muncul halus 0,25 dtk tanpa pantulan besar, satu aksi per momen).
import React from "react";
import { AbsoluteFill } from "remotion";
import { SceneRuang as RuangHook } from "./hook/RuangHook";
import { SceneAnak as AnakHook } from "./hook/AnakHook";
import { KartuSoal } from "./soal";
import { APPS, AppIcon } from "./aplikasi";
import { PASANGAN, PasanganCtx } from "../gaya/tema";
import { Lapis, W } from "../storybook/kit";
import { Bintang, FOKUS, Gelembung, HP, Label, LembarPR, MejaBelajar, Produk, Ruang, tema } from "./alat";
import { Halaman, IklanHP, jalankan, Kantor, LampuBelajar, Pose, Sel } from "./aset";
import K from "./kata.json";

export const FPS = 30;
export const fr = (i: number) => Math.round(K[i].s * FPS);
// muncul halus: 0 sebelum kata ke-i, lalu 0,9 → 1 dalam ±7 frame (tanpa pantulan)
export const pop = (f: number, i: number, lama = 7) => {
  const x = Math.max(0, Math.min(1, (f - fr(i) + 3) / lama));
  return x === 0 ? 0 : 0.9 + 0.1 * (1 - Math.pow(1 - x, 3));
};
const ada = (f: number, i: number) => f >= fr(i) - 3;
const Pop: React.FC<{ f: number; i: number; x: number; y: number; children: React.ReactNode }> = ({ f, i, x, y, children }) => {
  const s = pop(f, i);
  return s > 0 ? <g opacity={Math.min(1, (s - 0.9) * 14)} transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>{children}</g> : null;
};

// panggung: latar diwarnai palet triad (buram lembut), fokus bergaris tegas + cahaya hangat
const Panggung: React.FC<{ f: number; mulai: number; intens?: boolean; latar: (T: ReturnType<typeof tema>) => React.ReactNode; children: React.ReactNode; garis?: boolean }> = ({ f, mulai, intens, latar, children, garis = true }) => {
  const T = tema(!!intens);
  const zoom = 1 + 0.04 * Math.min(1, Math.max(0, (f - fr(mulai)) / 180));
  return (
    <AbsoluteFill style={{ background: T.latar }}>
      <Lapis id={`l${mulai}`} zoom={zoom} k={0.4} style={{ filter: T.blurJauh }}>{latar(T)}</Lapis>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 50% 32% at 50% 53%, ${T.cahaya}, rgba(0,0,0,0) 70%)`, mixBlendMode: "screen" }} />
      <Lapis id={`f${mulai}`} zoom={zoom} k={1} wobble={1} garis={garis ? (intens ? FOKUS.garisIntens : FOKUS.garis) : undefined}>{children}</Lapis>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 60% at 50% 52%, rgba(0,0,0,0) 60%, ${T.vinyet} 100%)` }} />
    </AbsoluteFill>
  );
};

// ikon empat hal yang dinilai
const Ikon4: React.FC<{ jenis: number; x: number; y: number }> = ({ jenis, x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={46} fill={["#F5B83D", "#E86A92", "#5B7BD8", "#3FBF8F"][jenis]} />
    {jenis === 0 && <g><circle cy={-6} r={20} fill="#fff" /><rect x={-10} y={12} width={20} height={14} rx={4} fill="#fff" /></g>}
    {jenis === 1 && <g><circle r={26} fill="none" stroke="#fff" strokeWidth={7} /><circle r={9} fill="#fff" /></g>}
    {jenis === 2 && <g><rect x={-26} y={-20} width={24} height={40} rx={4} fill="#fff" /><rect x={2} y={-20} width={24} height={40} rx={4} fill="#fff" /></g>}
    {jenis === 3 && <g><rect x={-26} y={-20} width={52} height={34} rx={14} fill="#fff" /><path d="M-10 12 L-18 26 L4 14Z" fill="#fff" /></g>}
  </g>
);
const NAMA4 = ["Berpikir", "Fokus", "Berguna", "Ngobrol"];

// kartu rapor 4 hal (diperkecil & digeser ke kanan supaya peneliti muat di kiri)
const Rapor: React.FC<{ f: number; muncul: number[]; bintang: (baris: number) => number; tampilBintang: boolean; sorotSatu?: boolean }> = ({ f, muncul, bintang, tampilBintang, sorotSatu }) => (
  <g transform="translate(330 150) scale(0.75)">
    <rect x={150} y={600} width={780} height={800} rx={40} fill="#FFFDF7" />
    <rect x={150} y={600} width={780} height={90} rx={40} fill="#5B6BB8" />
    <rect x={150} y={650} width={780} height={40} fill="#5B6BB8" />
    <text x={540} y={662} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={44} fill="#fff">Rapor Aplikasi Anak</text>
    {NAMA4.map((n, i) => {
      const y = 790 + i * 160;
      const s = pop(f, muncul[i]);
      if (s <= 0) return null;
      const isi = bintang(i);
      return (
        <g key={n} opacity={Math.min(1, (s - 0.9) * 14)}>
          <Ikon4 jenis={i} x={250} y={y} />
          <text x={320} y={y + 16} fontFamily="Fredoka" fontWeight={700} fontSize={50} fill={W.navy}>{n}</text>
          {tampilBintang && [0, 1, 2].map((k) => <Bintang key={k} x={690 + k * 74} y={y} r={32} isi={k < isi} />)}
          {sorotSatu && <rect x={650} y={y - 44} width={80} height={88} rx={20} fill="none" stroke={W.merah} strokeWidth={6} />}
        </g>
      );
    })}
  </g>
);

const Tanda: React.FC<{ x: number; y: number; ok: boolean; s?: number }> = ({ x, y, ok, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={40} fill={ok ? "#2FB36B" : W.merah} />
    {ok ? <path d="M-18 0 l12 12 l24 -26" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M-15 -15 l30 30 m0 -30 l-30 30" stroke="#fff" strokeWidth={10} strokeLinecap="round" />}
  </g>
);

const Awan: React.FC<{ x: number; y: number; w: number; h: number; ekorX: number; ekorY: number }> = ({ x, y, w, h, ekorX, ekorY }) => (
  <g>
    <circle cx={ekorX} cy={ekorY} r={14} fill="#fff" />
    <circle cx={(ekorX + x) / 2} cy={(ekorY + y + h / 2) / 2} r={22} fill="#fff" />
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2.4} fill="#fff" />
    {[-0.3, 0, 0.3].map((k, i) => <circle key={i} cx={x + k * w} cy={y - h / 2 + 10} r={h * 0.32} fill="#fff" />)}
  </g>
);

// soal A (sama dengan halaman soal no. 9) & soal B (dipakai di babak 3)
const SOAL_A = { robo: [0, 0] as Sel, batu: [[4, 0], [3, 1], [2, 3], [1, 4], [2, 4]] as Sel[], baterai: [1, 3] as Sel };
const SOAL_B = { robo: [0, 4] as Sel, batu: [[2, 2], [0, 2], [1, 1], [4, 3]] as Sel[], baterai: [4, 1] as Sel };
const JALUR_B_JARI = jalankan(SOAL_B.robo, ["kanan", "kanan", "atas"]);
const PANAH_A = ["bawah", "bawah", "bawah", "kanan"] as const;
const PANAH_B = ["kanan", "kanan", "atas", "kanan", "atas", "atas", "kanan"] as const;

// layar aplikasi gratis "Tebak Hewan" sebelum iklan bermunculan
const TebakHewan: React.FC = () => (
  <g>
    <rect x={-116} y={-212} width={232} height={424} fill="#FFF3E0" />
    <rect x={-116} y={-212} width={232} height={44} fill="#F28C38" />
    <text y={-183} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={20} fill="#fff">Tebak Hewan</text>
    <circle cy={-95} r={52} fill="#FFD9A8" />
    <path d="M-34 -115 L-26 -150 L-8 -126 Z M34 -115 L26 -150 L8 -126 Z" fill="#E8A35C" />
    <circle cy={-95} r={36} fill="#E8A35C" />
    <circle cx={-12} cy={-100} r={5} fill="#333" />
    <circle cx={12} cy={-100} r={5} fill="#333" />
    <path d="M-6 -86 Q0 -80 6 -86" stroke="#333" strokeWidth={3} fill="none" />
    <text y={-20} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={20} fill="#22324A">Hewan apa ini?</text>
    {["Kucing", "Sapi", "Ayam", "Bebek"].map((t, i) => (
      <g key={t} transform={`translate(${(i % 2) * 108 - 54} ${10 + Math.floor(i / 2) * 64})`}>
        <rect x={-50} y={0} width={100} height={52} rx={14} fill={["#2F80ED", "#3FBF8F", "#E86A92", "#8E5BFF"][i]} />
        <text x={0} y={33} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={19} fill="#fff">{t}</text>
      </g>
    ))}
  </g>
);

export type Adegan = { mulai: number; nama: string; intens?: boolean; judul: [string, number, string?][]; isi: (f: number) => React.ReactNode; sumber?: boolean; ilustrasi?: boolean; sfx?: [number, string, number?][]; hook?: boolean };

const HOOK_ANAK = (f: number) => (
  <PasanganCtx.Provider value={PASANGAN.E}>
    <AnakHook dari={0} beku={f} />
  </PasanganCtx.Provider>
);

export const ADEGAN: Adegan[] = [
  // ===== BABAK 1: hook =====
  {
    mulai: 0, nama: "Hook 1 · peneliti memeriksa 124 aplikasi", hook: true, judul: [["Para peneliti", 0], ["124 aplikasi anak", 3, "biru"]],
    isi: (f) => (
      <PasanganCtx.Provider value={PASANGAN.E}>
        <RuangHook beku={f} />
      </PasanganCtx.Provider>
    ),
  },
  {
    mulai: 14, nama: "Hook 2 · nilainya rendah", hook: true, intens: true, judul: [["Kebanyakan", 14], ["nilainya rendah.", 15, "merah"]],
    isi: (f) => (
      <PasanganCtx.Provider value={PASANGAN.E}>
        <RuangHook beku={f} />
      </PasanganCtx.Provider>
    ),
    sfx: [[fr(16) - 2, "pop", 0.8]],
  },
  { mulai: 17, nama: "Hook 3 · tap, tap, tap", hook: true, judul: [["Cuma disuruh", 22], ["tap, tap, tap.", 26, "biru"]], isi: HOOK_ANAK, sfx: [[fr(24) + 4, "benar-robo", 0.7]] /* owner: hanya satu "ting" di soal pertama */ },
  { mulai: 29, nama: "Hook 4 · bintang, hadiah, suara heboh", hook: true, judul: [["Bintang, hadiah,", 32], ["suara heboh!", 35, "koral"]], isi: HOOK_ANAK /* owner: tanpa bunyi setelah ketukan pertama */ },
  { mulai: 37, nama: "Hook 5 · belum sempat berpikir", hook: true, intens: true, judul: [["Belum sempat", 39], ["berpikir.", 41, "biru"]], isi: HOOK_ANAK },

  // ===== detail riset (peneliti menjelaskan di samping rapor) =====
  {
    mulai: 42, nama: "Riset · dinilai dari 4 hal", sumber: true, judul: [["Dinilai dari", 45], ["4 hal", 49, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={42} latar={(T) => <Kantor T={T} f={f} />}>
        <Rapor f={f} muncul={[54, 58, 61, 66]} bintang={() => 0} tampilBintang={false} />
        <Pose n="p-presentasi" x={250} bawah={1500} tinggi={760} />
      </Panggung>
    ),
  },
  {
    mulai: 67, nama: "Riset · paling bagus bintang tiga", sumber: true, judul: [["Paling bagus:", 73], ["★★★", 75, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={67} latar={(T) => <Kantor T={T} f={f} />}>
        <Rapor f={f} muncul={[0, 0, 0, 0]} bintang={() => (ada(f, 73) ? 3 : 0)} tampilBintang />
        <Pose n="p-presentasi" x={250} bawah={1500} tinggi={760} />
      </Panggung>
    ),
  },
  {
    mulai: 77, nama: "Riset · paling sering cuma bintang satu", intens: true, sumber: true, judul: [["Paling sering didapat:", 80], ["cuma ★", 85, "merah"]],
    isi: (f) => (
      <Panggung f={f} mulai={77} intens latar={(T) => <Kantor T={T} f={f} />}>
        <Rapor f={f} muncul={[0, 0, 0, 0]} bintang={() => 1} tampilBintang sorotSatu={ada(f, 86)} />
        <Pose n="p-kaget" x={240} bawah={1500} tinggi={760} />
      </Panggung>
    ),
  },
  {
    mulai: 88, nama: "Riset · aplikasi gratis penuh iklan", sumber: true, judul: [["Aplikasi gratis:", 89], ["paling rendah", 92, "merah"]],
    isi: (f) => (
      <Panggung f={f} mulai={88} latar={(T) => <Ruang T={T} f={f} />}>
        <HP x={540} y={1010} s={1.55} layar="#FFF6E5">
          <TebakHewan />
          {ada(f, 96) && <IklanHP f={f - fr(96)} />}
        </HP>
        <Pop f={f} i={90} x={800} y={650}><Label x={800} y={650} teks="GRATIS" warna="#2FB36B" ukuran={44} rot={6} /></Pop>
      </Panggung>
    ),
    sfx: [[fr(96) - 2, "pop", 0.6], [fr(96) + 22, "pop", 0.4], [fr(96) + 46, "pop", 0.4]],
  },

  // ===== dunia normal =====
  {
    mulai: 105, nama: "Bunda · awalnya tidak peduli", ilustrasi: true, judul: [["Yang dinilai", 106], ["aplikasinya", 108, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={105} latar={(T) => <Ruang T={T} f={f} />}>
        <Pose n="b-cuek" x={540} bawah={1560} tinggi={900} />
        <Pop f={f} i={108} x={210} y={700}><g><AppIcon app={APPS[0]} x={130} y={620} s={160} nama={false} /><Label x={210} y={830} teks="aplikasi" warna="#5B6BB8" ukuran={34} /><Tanda x={285} y={620} ok s={0.8} /></g></Pop>
        <Pop f={f} i={110} x={870} y={700}><g><Pose n="d-hp" x={870} bawah={800} tinggi={230} /><Label x={870} y={830} teks="anak" warna="#8C8FB0" ukuran={34} /><Tanda x={950} y={600} ok={false} s={0.8} /></g></Pop>
      </Panggung>
    ),
  },
  {
    mulai: 118, nama: "Dimas · 7 tahun, selalu bintang tiga", ilustrasi: true, judul: [["Dimas, 7 tahun", 121], ["selalu ★★★", 135, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={118} latar={(T) => <Ruang T={T} f={f} />}>
        <Pose n="b-haru" x={250} bawah={1540} tinggi={760} />
        <Pose n="d-hp" x={720} bawah={1560} tinggi={760} />
        {ada(f, 136) && <g>{[0, 1, 2].map((k) => <Bintang key={k} x={640 + k * 80} y={820} r={34} />)}</g>}
        <Pop f={f} i={123} x={880} y={640}><Label x={880} y={640} teks="7 tahun" warna="#5B6BB8" /></Pop>
      </Panggung>
    ),
  },

  // ===== insiden =====
  {
    mulai: 138, nama: "Malam · PR 10 soal selesai 3 menit", intens: true, ilustrasi: true, judul: [["10 soal", 145], ["selesai 3 menit", 147, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={138} intens latar={(T) => <MejaBelajar T={T} f={f} />}>
        <Pose n="d-santai" x={760} bawah={1420} tinggi={700} />
        <LampuBelajar x={150} y={1250} s={0.95} />
        <LembarPR x={420} y={1250} s={0.62} r={-6} />
        <Pop f={f} i={148} x={430} y={760}><g><circle cx={430} cy={760} r={74} fill="#fff" /><circle cx={430} cy={760} r={74} fill="none" stroke={W.navy} strokeWidth={8} /><path d="M430 760 L430 708 M430 760 L462 774" stroke={W.navy} strokeWidth={8} strokeLinecap="round" /><Label x={430} y={872} teks="3 menit" warna={W.merah} /></g></Pop>
      </Panggung>
    ),
  },
  {
    mulai: 151, nama: "Malam · salah enam, 3 + 4 = 8", intens: true, ilustrasi: true, judul: [["Yang salah:", 152], ["6 soal", 154, "merah"]],
    isi: (f) => (
      <Panggung f={f} mulai={151} intens latar={(T) => <MejaBelajar T={T} f={f} />}>
        <LembarPR x={420} y={1010} s={1.15} nilai={ada(f, 154)} sorot={ada(f, 156)} />
        <Pose n="d-santai" x={870} bawah={1440} tinggi={440} />
        <Pop f={f} i={167} x={760} y={1080}><Gelembung x={760} y={1080} teks="Kan cepet, Ma. Udah ya?" ukuran={38} ekor="kanan" /></Pop>
      </Panggung>
    ),
  },
  {
    mulai: 172, nama: "Bunda ingat: asal tekan, langsung bintang", intens: true, ilustrasi: true, judul: [["Terbiasa", 184], ["asal tekan", 185, "koral"]],
    isi: (f) => (
      <Panggung f={f} mulai={172} intens latar={(T) => <MejaBelajar T={T} f={f} />}>
        <Pose n="b-ingat" x={290} bawah={1520} tinggi={780} />
        <Pop f={f} i={180} x={770} y={860}>
          <g>
            <Awan x={770} y={860} w={420} h={400} ekorX={520} ekorY={940} />
            <HP x={770} y={860} s={0.62}>
              <rect x={-116} y={-212} width={232} height={424} fill="#FFF6E5" />
              <text y={-100} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={58} fill={W.navy}>3+4=?</text>
              {ada(f, 188) && !ada(f, 192) && <g><rect x={-90} y={-10} width={180} height={64} rx={20} fill={W.merah} /><text y={32} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={32} fill="#fff">COBA LAGI</text></g>}
              {ada(f, 192) && <g><rect x={-90} y={-10} width={180} height={64} rx={20} fill="#2FB36B" /><text y={32} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={34} fill="#fff">BENAR!</text></g>}
              {ada(f, 195) && <Bintang x={0} y={130} r={44} />}
            </HP>
          </g>
        </Pop>
      </Panggung>
    ),
  },
  {
    mulai: 197, nama: "Bukan bodoh, bukan malas: menebak dulu", ilustrasi: true, judul: [["Menebak dulu,", 208], ["baru berpikir", 210, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={197} latar={(T) => <Ruang T={T} f={f} />}>
        <Pose n="d-mikir" x={540} bawah={1560} tinggi={820} />
        {[["bodoh", 201, 220, 680], ["malas", 204, 860, 680]].map(([t, i, x, y]) => (
          <Pop key={t as string} f={f} i={i as number} x={x as number} y={y as number}>
            <g><Label x={x as number} y={y as number} teks={t as string} warna="#8C8FB0" ukuran={46} /><path d={`M${(x as number) - 80} ${(y as number) - 12} L${(x as number) + 80} ${(y as number) - 12}`} stroke={W.merah} strokeWidth={5} strokeLinecap="round" opacity={0.85} /></g>
          </Pop>
        ))}
        <Pop f={f} i={208} x={540} y={1360}>
          <g>
            <Label x={330} y={1360} teks="1. Tebak" warna="#E8862A" ukuran={44} />
            <path d="M450 1345 L600 1345 M580 1325 L605 1345 L580 1365" stroke={W.navy} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <Label x={760} y={1360} teks="2. Pikir" warna="#8C8FB0" ukuran={44} />
          </g>
        </Pop>
      </Panggung>
    ),
  },
  {
    mulai: 213, nama: "Bunda bertekad: berpikir dulu, tapi dia suka", ilustrasi: true, judul: [["Berpikir dulu,", 223], ["tapi dia suka", 227, "koral"]],
    isi: (f) => (
      <Panggung f={f} mulai={213} latar={(T) => <MejaBelajar T={T} f={f} />}>
        <Pose n="b-tekad" x={540} bawah={1560} tinggi={860} />
        <Pop f={f} i={223} x={260} y={700}><Label x={260} y={700} teks="berpikir dulu ✓" warna="#2FB36B" ukuran={38} /></Pop>
        <Pop f={f} i={229} x={830} y={700}><Label x={830} y={700} teks="dia suka ♥" warna="#E86A92" ukuran={38} /></Pop>
      </Panggung>
    ),
  },

  // ===== BABAK 2 =====
  {
    mulai: 232, nama: "Usaha 1 · 'Pelan-pelan, Nak' gagal", ilustrasi: true, judul: [["Pelan-pelan…", 236], ["tetap buru-buru", 241, "merah"]],
    isi: (f) => (
      <Panggung f={f} mulai={232} latar={(T) => <MejaBelajar T={T} f={f} />}>
        <Pose n="b-nasihat" x={260} bawah={1500} tinggi={720} />
        <Pose n="d-nulis" x={740} bawah={1440} tinggi={600} />
        <LembarPR x={740} y={1390} s={0.5} r={4} />
        <Pop f={f} i={236} x={330} y={660}><Gelembung x={330} y={660} teks="Pelan-pelan, Nak." ukuran={42} ekor="kiri" /></Pop>
      </Panggung>
    ),
  },
  {
    mulai: 243, nama: "Usaha 2 · aplikasi lain, tetap tap tap tap", ilustrasi: true, judul: [["Aplikasi lain:", 245], ["sama saja", 251, "merah"]],
    isi: (f) => (
      <Panggung f={f} mulai={243} latar={(T) => <Ruang T={T} f={f} />}>
        <Pose n="b-kecewa" x={250} bawah={1520} tinggi={720} />
        <Pose n="d-tap" x={730} bawah={1540} tinggi={760} />
        {ada(f, 257) && <g>{[0, 1, 2].map((k) => <Bintang key={k} x={790 + k * 70} y={860} r={28} />)}</g>}
      </Panggung>
    ),
  },
  {
    mulai: 262, nama: "Penemuan · Koder Cilik", judul: [["Teka-teki coding", 266], ["di kertas", 268, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={262} latar={(T) => <Ruang T={T} f={f} />} garis={false}>
        <Pop f={f} i={266} x={540} y={1010}><Produk x={540} y={1010} w={940} /></Pop>
        <Pop f={f} i={271} x={540} y={1370}><Label x={540} y={1360} teks="Koder Cilik" warna="#5B6BB8" ukuran={52} /></Pop>
      </Panggung>
    ),
  },
  {
    mulai: 273, nama: "Cara main · robot, batu, baterai, panah", judul: [["Tulis panah,", 285], ["sampai ke baterai", 289, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={273} latar={(T) => <Ruang T={T} f={f} />} garis={false}>
        <KartuSoal f={f} x={540} y={1010} s={1.12} {...SOAL_A}
          j={{ kartu: fr(273), robo: fr(277), batu: [fr(279), fr(279) + 3, fr(279) + 6, fr(279) + 9, fr(279) + 12], baterai: fr(281),
               panah: PANAH_A.map((arah, i) => ({ arah, f: fr(285) + i * 7 })), lompat: PANAH_A.map((_, i) => fr(288) + i * 9) }} />
      </Panggung>
    ),
    sfx: [[fr(273), "page-turn", 0.5], [fr(277), "pop", 0.7], ...[0, 3, 6, 9, 12].map((d) => [fr(279) + d, "pop", 0.45] as [number, string, number]), [fr(281), "pop", 0.7],
      ...PANAH_A.map((_, i) => [fr(285) + i * 7, "pop", 0.5] as [number, string, number]), ...PANAH_A.map((_, i) => [fr(288) + i * 9, "tek", 0.95] as [number, string, number]), [fr(288) + PANAH_A.length * 9, "ding-kc", 0.55]],
  },
  {
    mulai: 295, nama: "Bedanya dengan HP: tak ada 'coba lagi'", judul: [["Di kertas:", 298], ["periksa sendiri", 315, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={295} latar={(T) => <Ruang T={T} f={f} />} garis={false}>
        <HP x={270} y={1010} s={0.9}>
          <rect x={-116} y={-212} width={232} height={424} fill="#FFF6E5" />
          <rect x={-90} y={-40} width={180} height={70} rx={20} fill={W.merah} />
          <text y={6} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={34} fill="#fff">COBA LAGI</text>
          <Bintang x={0} y={120} r={46} />
        </HP>
        {ada(f, 302) && <path d="M140 830 L400 1190 M400 830 L140 1190" stroke={W.merah} strokeWidth={18} strokeLinecap="round" opacity={0.9} />}
        <KartuSoal f={f} x={770} y={1010} s={0.5} {...SOAL_A} j={{ panah: PANAH_A.map((arah) => ({ arah, f: 0 })) }} />
        <Pop f={f} i={315} x={770} y={1330}><Tanda x={770} y={1330} ok /></Pop>
      </Panggung>
    ),
    sfx: [[fr(302), "bonk", 0.5], [fr(315), "benar-robo", 0.6]],
  },
  {
    mulai: 324, nama: "Hari pertama · panah asal, robot menabrak", judul: [["Panah asal-asalan,", 333], ["robot menabrak", 340, "merah"]],
    isi: (f) => (
      <Panggung f={f} mulai={324} latar={(T) => <MejaBelajar T={T} f={f} />} garis={false}>
        <KartuSoal f={f} x={540} y={980} s={1.0} {...SOAL_A}
          j={{ panah: ["kanan", "kanan", "kanan", "kanan"].map((arah, i) => ({ arah: arah as "kanan", f: fr(332) + i * 4, salah: i === 3 })), lompat: [0, 1, 2, 3].map((i) => fr(338) + i * 7) }} />
        <Pose n="d-nulis" x={870} bawah={1500} tinggi={420} tukar={fr(330)} />
      </Panggung>
    ),
    sfx: [...[0, 1, 2, 3].map((i) => [fr(332) + i * 4, "pop", 0.4] as [number, string, number]), ...[0, 1, 2].map((i) => [fr(338) + i * 7, "tek", 0.95] as [number, string, number]), [fr(338) + 23, "bonk", 0.8]],
  },
  {
    mulai: 342, nama: "Dimas kesal · Bunda hampir menyerah", intens: true, ilustrasi: true, judul: [["“Nggak ada", 346], ["bintangnya!”", 348, "merah"]],
    isi: (f) => (
      <Panggung f={f} mulai={342} intens latar={(T) => <MejaBelajar T={T} f={f} />}>
        <Pose n="bunda-p1" x={280} bawah={1560} tinggi={860} />
        <Pose n="dimas-p1" x={760} bawah={1560} tinggi={760} />
        <Pop f={f} i={349} x={760} y={650}><Gelembung x={760} y={650} teks="Udahan, Ma!" ukuran={46} /></Pop>
      </Panggung>
    ),
  },

  // ===== BABAK 3 =====
  {
    mulai: 358, nama: "Bunda duduk di sebelah · lihat contoh soal", ilustrasi: true, judul: [["Duduk bersama,", 365], ["lihat contoh soal", 370, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={358} latar={(T) => <MejaBelajar T={T} f={f} />}>
        <Pose n="bunda-p2" x={270} bawah={1400} tinggi={760} />
        <Pose n="dimas-p2" x={790} bawah={1400} tinggi={640} />
        <Halaman n="contoh-l1" x={540} y={1290} lebar={330} rot={-3} />
      </Panggung>
    ),
  },
  {
    mulai: 377, nama: "Jalankan robot pakai jari: kanan, kanan, atas", judul: [["Jalankan dulu", 384], ["pakai jari", 386, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={377} latar={(T) => <MejaBelajar T={T} f={f} />} garis={false}>
        <KartuSoal f={f} x={540} y={1010} s={1.1} {...SOAL_B} j={{ jari: { jalur: JALUR_B_JARI, f: [fr(392), fr(397), fr(398), fr(399)] } }} />
      </Panggung>
    ),
  },
  {
    mulai: 400, nama: "Dimas berhenti · 'yang ini nabrak'", intens: true, judul: [["“Eh, bentar…", 404], ["yang ini nabrak.”", 407, "merah"]],
    isi: (f) => (
      <Panggung f={f} mulai={400} intens latar={(T) => <MejaBelajar T={T} f={f} />} garis={false}>
        <KartuSoal f={f} x={480} y={990} s={0.98} {...SOAL_B}
          j={{ panah: [{ arah: "kanan", f: 0 }, { arah: "kanan", f: 0 }, { arah: "atas", f: 0 }, { arah: "atas", f: fr(407), salah: true }], jari: { jalur: [JALUR_B_JARI[3], [2, 2]], f: [0, fr(407)] } }} />
        <Pose n="dimas-p3" x={900} bawah={1480} tinggi={520} tukar={fr(401)} />
      </Panggung>
    ),
    sfx: [[fr(407), "bonk", 0.5]],
  },
  {
    mulai: 410, nama: "Dimas menghapus & memperbaiki sendiri", judul: [["Dia periksa", 420], ["jawabannya sendiri", 422, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={410} latar={(T) => <MejaBelajar T={T} f={f} />} garis={false}>
        <KartuSoal f={f} x={460} y={960} s={0.92} {...SOAL_B}
          j={{ panah: [{ arah: "kanan", f: 0 }, { arah: "kanan", f: 0 }, { arah: "atas", f: 0 }, { arah: "atas", f: 0, salah: true, hapus: fr(411) + 6 },
            ...(["kanan", "atas", "atas", "kanan"] as const).map((arah, i) => ({ arah, f: fr(416) + i * 6 }))] }} />
        <Pose n="d-hapus" x={860} bawah={1500} tinggi={560} />
      </Panggung>
    ),
    sfx: [[fr(411) + 6, "page-turn", 0.4], ...[0, 1, 2, 3].map((i) => [fr(416) + i * 6, "pop", 0.45] as [number, string, number])],
  },
  {
    mulai: 424, nama: "Klimaks · 'Ma! Aku nemu sendiri!'", judul: [["“Ma! Aku nemu", 430], ["sendiri!”", 433, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={424} latar={(T) => <Ruang T={T} f={f} />} garis={false}>
        <KartuSoal f={f} x={400} y={990} s={0.88} {...SOAL_B} j={{ panah: PANAH_B.map((arah) => ({ arah, f: 0 })), lompat: PANAH_B.map((_, i) => fr(424) + i * 6) }} />
        <Pose n={ada(f, 429) ? "dimas-p4" : "dimas-p2"} x={850} bawah={1520} tinggi={640} tukar={fr(429) - 3} />
        <Pop f={f} i={430} x={640} y={640}><Gelembung x={600} y={640} teks="Ma! Aku nemu sendiri!" ukuran={42} ekor="kanan" /></Pop>
      </Panggung>
    ),
    sfx: [...PANAH_B.map((_, i) => [fr(424) + i * 6, "tek", 0.95] as [number, string, number]), [fr(424) + PANAH_B.length * 6, "selesai-robo", 0.7], [fr(430), "sorak", 0.3]],
  },

  // ===== penutup =====
  {
    mulai: 434, nama: "Jujur · masih suka HP, ditemani, dicetak sendiri", ilustrasi: true, judul: [["Hari pertama", 440], ["harus ditemani", 444, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={434} latar={(T) => <MejaBelajar T={T} f={f} />}>
        <Pose n="b-kertas" x={560} bawah={1500} tinggi={800} />
        <HP x={900} y={1290} s={0.42} r={-12}><rect x={-116} y={-212} width={232} height={424} fill="#C9D3F5" /></HP>
        {ada(f, 448) && (
          <g transform="translate(200 1250)">
            <rect x={-150} y={-60} width={300} height={140} rx={20} fill="#5B6BB8" />
            <rect x={-110} y={-110} width={220} height={60} rx={8} fill="#4A5AA6" />
            <Halaman n="l1" x={0} y={100} lebar={170} />
          </g>
        )}
      </Panggung>
    ),
  },
  {
    mulai: 452, nama: "Kebiasaan baru · 'Cek pakai jari dulu, Ma'", ilustrasi: true, judul: [["“Cek pakai", 465], ["jari dulu, Ma.”", 467, "biru"]],
    isi: (f) => (
      <Panggung f={f} mulai={452} latar={(T) => <MejaBelajar T={T} f={f} />}>
        <Pose n="bunda-p4" x={250} bawah={1500} tinggi={740} />
        <Pose n="d-jelas" x={740} bawah={1460} tinggi={680} />
        <LembarPR x={720} y={1400} s={0.5} />
        <Pop f={f} i={465} x={640} y={640}><Gelembung x={640} y={640} teks="Cek pakai jari dulu, Ma." ukuran={40} /></Pop>
      </Panggung>
    ),
  },
  {
    mulai: 470, nama: "CTA · Lihat Detail", judul: [["Suka grasa-grusu", 474], ["& asal jawab?", 477, "koral"]],
    isi: (f) => (
      <Panggung f={f} mulai={470} latar={(T) => <Ruang T={T} f={f} />} garis={false}>
        <Produk x={540} y={900} w={900} />
        <Pop f={f} i={482} x={540} y={1250}>
          <g>
            <rect x={240} y={1185} width={600} height={120} rx={60} fill="#2F80ED" />
            <text x={540} y={1265} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={56} fill="#fff">Lihat Detail ↓</text>
          </g>
        </Pop>
        <Pop f={f} i={494} x={540} y={1370}><Label x={540} y={1370} teks="Isi lengkap 4 level: mudah → menantang" warna="#5B6BB8" ukuran={34} /></Pop>
      </Panggung>
    ),
  },
];
