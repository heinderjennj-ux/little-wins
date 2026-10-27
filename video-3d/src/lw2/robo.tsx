// Kartu soal gaya buku Robo Coder (coding-worksheet/robo-coder-book): kartu putih bergaris #D3DEFF, nomor bulat navy,
// papan kuning 4×4 (#FFC94D, kotak krem selang-seling), Robo "robo-hopeful", batu "rock", baterai hijau, deret "ROBO'S CODE"
// berupa tombol panah biru #3F60DA. Digambar ulang dengan kode (bukan foto kertas) supaya tajam di layar.
// Gerak mengikuti 12 prinsip animasi (skill video-motion-graphics): antisipasi, lengkung lompatan, squash saat mendarat,
// overshoot saat muncul, gerak susulan, dan elemen yang selalu "hidup" (baterai berdenyut, kotak kosong berkedip).
import React from "react";
import { Easing, interpolate, staticFile } from "remotion";

export type Sel = [number, number];
export type Arah = "kanan" | "kiri" | "atas" | "bawah";
const GERAK: Record<Arah, Sel> = { kanan: [1, 0], kiri: [-1, 0], atas: [0, -1], bawah: [0, 1] };
const SUDUT: Record<Arah, number> = { kanan: 0, bawah: 90, kiri: 180, atas: -90 };
const cl = { extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const };
const BIRU = "#3F60DA", BIRU_TUA = "#2A43B4", NAVY = "#1E2A4A";

// muncul dengan overshoot (0 sebelum mulai)
const muncul = (f: number, mulai: number, lama = 8) => {
  const x = interpolate(f, [mulai, mulai + lama], [0, 1], cl);
  if (x === 0) return 0;
  const c = 1.7;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

export type JadwalRobo = {
  kartu?: number;
  robo?: number;
  batu?: number[];
  baterai?: number;
  panah?: { arah: Arah; f: number; hapus?: number; salah?: boolean; slot?: number }[];
  lompat?: number[]; // frame mulai tiap lompatan (mengikuti panah yang tidak dihapus)
  jari?: { jalur: Sel[]; f: number[]; stop?: boolean }; // jari menelusuri kotak; stop = berhenti mendadak di kotak terakhir
  kunci?: [number, number]; // ikon gembok "robot menunggu" (dari, sampai)
};

const Tombol: React.FC<{ arah: Arah; u: number; salah?: boolean; kosong?: boolean; aktif?: boolean; nyala?: number }> = ({ arah, u, salah, kosong, aktif, nyala = 0 }) =>
  kosong ? (
    <g>
      <rect x={-u / 2} y={-u / 2} width={u} height={u} rx={u * 0.24} fill="#fff" stroke="#9BAAD8" strokeWidth={4} strokeDasharray="10 8" />
      {nyala > 0 && <rect x={-u / 2 - 6} y={-u / 2 - 6} width={u + 12} height={u + 12} rx={u * 0.3} fill="none" stroke="#FFB21E" strokeWidth={5} opacity={nyala} />}
    </g>
  ) : (
    <g>
      <rect x={-u / 2} y={-u / 2 + 6} width={u} height={u} rx={u * 0.24} fill={salah ? "#B32424" : BIRU_TUA} />
      <rect x={-u / 2} y={-u / 2} width={u} height={u} rx={u * 0.24} fill={salah ? "#E23A3A" : BIRU} />
      {aktif && <rect x={-u / 2 - 7} y={-u / 2 - 7} width={u + 14} height={u + 20} rx={u * 0.3} fill="none" stroke="#FFB21E" strokeWidth={6} />}
      <g transform={`rotate(${SUDUT[arah]})`}>
        <path d={`M${-u * 0.24} 0 H${u * 0.22} M${u * 0.04} ${-u * 0.18} L${u * 0.24} 0 L${u * 0.04} ${u * 0.18}`} stroke="#fff" strokeWidth={u * 0.11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );

// baterai digambar vektor (owner: aset lama terpotong & hijaunya kurang kontras): garis navy tebal, hijau terang,
// petir kuning-putih, cahaya kuning berdenyut supaya menonjol di papan kuning
const BateraiAset: React.FC<{ cs: number; f: number; menang: number }> = ({ cs, f, menang }) => {
  const denyut = 0.5 + 0.5 * Math.sin(f / 7);
  const w = cs * 0.42, h = cs * 0.66, g = cs * 0.045;
  return (
    <g>
      <circle r={cs * 0.44} fill="#FFFFFF" opacity={0.35 + 0.25 * denyut + menang * 0.3} />
      <rect x={-w * 0.28} y={-h / 2 - cs * 0.07} width={w * 0.56} height={cs * 0.1} rx={cs * 0.03} fill={NAVY} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={cs * 0.09} fill={NAVY} />
      <rect x={-w / 2 + g} y={-h / 2 + g} width={w - 2 * g} height={h - 2 * g} rx={cs * 0.06} fill="#22D36B" />
      <rect x={-w / 2 + g} y={-h / 2 + g} width={(w - 2 * g) * 0.32} height={h - 2 * g} rx={cs * 0.06} fill="#7CF2A8" opacity={0.6} />
      <path d={`M${cs * 0.05} ${-h * 0.36} L${-cs * 0.11} ${cs * 0.03} L${-cs * 0.01} ${cs * 0.03} L${-cs * 0.06} ${h * 0.36} L${cs * 0.12} ${-cs * 0.05} L${cs * 0.02} ${-cs * 0.05}Z`} fill="#FFE14D" stroke={NAVY} strokeWidth={cs * 0.022} strokeLinejoin="round" />
    </g>
  );
};

// owner (2026-10-26): hanya tata letak soal (tanpa nomor/judul/subjudul), deret panah besar di ATAS papan, papan besar.
// Kartu berpusat di (x, y): deret kode y -470..-330, papan y -270..+490 (skala 1).
export const KartuRobo: React.FC<{ f: number; x: number; y: number; s: number; robo: Sel; batu: Sel[]; baterai: Sel; j: JadwalRobo; slot?: number }> = ({ f, x, y, s, robo, batu, baterai, j, slot = 4 }) => {
  const W = 860, cs = 190, B = cs * 4;
  const bx0 = -B / 2, by0 = -250, atasK = -560, bawahK = by0 + B + 40, H = bawahK - atasK;
  const pos = (c: number, r: number) => [bx0 + c * cs + cs / 2, by0 + r * cs + cs / 2];
  const kartu = j.kartu === undefined ? 1 : muncul(f, j.kartu, 10);
  if (kartu === 0) return null;

  // jalur dari panah yang berlaku
  const urutJalan = (j.panah ?? []).filter((p) => p.hapus === undefined);
  const jalur: Sel[] = [robo];
  for (const p of urutJalan) {
    const a = jalur[jalur.length - 1];
    jalur.push([a[0] + GERAK[p.arah][0], a[1] + GERAK[p.arah][1]]);
  }
  // Robo melompat: antisipasi (jongkok 3 frame) → lengkung → squash saat mendarat; ke batu = terpental balik + goyang
  const DUR = 9;
  let [rx, ry] = pos(...robo);
  let angkat = 0, sx = 1, sy = 1, rot = 0, langkahKe = -1, jarak = 0, tabrak = -1;
  let berhenti = false; // setelah menabrak batu, Robo berhenti (panah sisanya tidak dijalankan)
  (j.lompat ?? []).forEach((t, i) => {
    if (berhenti || i + 1 >= jalur.length) return;
    const jongkok = interpolate(f, [t - 3, t], [0, 1], cl) * (f < t + 1 ? 1 : 0);
    if (f >= t - 3 && f < t) { sx = 1 + 0.08 * jongkok; sy = 1 - 0.1 * jongkok; }
    const k = interpolate(f, [t, t + DUR], [0, 1], cl);
    if (k <= 0) return;
    const [ax, ay] = pos(...jalur[i]), [bx, by] = pos(...jalur[i + 1]);
    const keBatu = batu.some(([c, r]) => c === jalur[i + 1][0] && r === jalur[i + 1][1]);
    const e = Easing.inOut(Easing.cubic)(k);
    const maju = keBatu ? Math.sin(Math.PI * Math.min(1, k * 1.15)) * 0.42 : e;
    rx = ax + (bx - ax) * maju;
    ry = ay + (by - ay) * maju;
    angkat = Math.sin(Math.PI * k) * cs * (keBatu ? 0.18 : 0.32);
    if (!keBatu) jarak += Math.hypot(bx - ax, by - ay) * e;
    const darat = interpolate(f, [t + DUR, t + DUR + 5], [0, 1], cl);
    if (k >= 1) { sx = 1 + 0.12 * Math.sin(Math.PI * darat); sy = 1 - 0.12 * Math.sin(Math.PI * darat); }
    else { sx = 0.94; sy = 1.08; } // stretch di udara
    langkahKe = i;
    if (keBatu) { tabrak = t + DUR * 0.45; rot = f > tabrak ? 14 * Math.sin((f - tabrak) * 1.3) * Math.exp(-(f - tabrak) / 10) : 0; berhenti = true; }
  });
  const menangDari = (() => {
    const last = jalur[jalur.length - 1];
    const sampai = last[0] === baterai[0] && last[1] === baterai[1] && (j.lompat ?? []).length >= urutJalan.length && urutJalan.length > 0;
    return sampai ? (j.lompat ?? [])[urutJalan.length - 1] + DUR : Infinity;
  })();
  const menang = f >= menangDari ? Math.min(1, (f - menangDari) / 8) : 0;
  if (menang > 0) angkat += Math.abs(Math.sin((f - menangDari) / 4)) * 26 * Math.exp(-(f - menangDari) / 30);

  // jejak titik biru sepanjang jarak tempuh (gaya buku: garis titik biru)
  const titik: React.ReactNode[] = [];
  let d = 0;
  for (let i = 1; i < jalur.length; i++) {
    const [ax, ay] = pos(...jalur[i - 1]), [bx, by] = pos(...jalur[i]), L = Math.hypot(bx - ax, by - ay);
    for (let t = 25; t < L + 1; t += 25) if (d + t <= jarak + 4) titik.push(<circle key={`${i}-${t}`} cx={ax + ((bx - ax) * t) / L} cy={ay + ((by - ay) * t) / L} r={7} fill={BIRU} />);
    d += L;
  }

  // jari menelusuri (jejak titik oranye), stop = jari berhenti mendadak + tanda seru
  let jari: React.ReactNode = null;
  if (j.jari && f >= j.jari.f[0] - 8) {
    let k = 0;
    j.jari.f.forEach((t, i) => { if (f >= t) k = i; });
    const tNext = j.jari.f[k + 1];
    const geser = tNext === undefined ? 0 : interpolate(f, [tNext - 9, tNext], [0, 1], { ...cl, easing: Easing.inOut(Easing.cubic) });
    const a = j.jari.jalur[k], b = j.jari.jalur[Math.min(k + 1, j.jari.jalur.length - 1)];
    const [ax, ay] = pos(...a), [bx, by] = pos(...b);
    const masuk = interpolate(f, [j.jari.f[0] - 8, j.jari.f[0]], [1, 0], { ...cl, easing: Easing.out(Easing.cubic) });
    const jx = ax + (bx - ax) * geser, jy = ay + (by - ay) * geser + masuk * 300;
    const jejak = j.jari.jalur.slice(0, k + 1).map((c) => pos(...c));
    const fStop = j.jari.stop ? j.jari.f[j.jari.f.length - 1] : Infinity;
    const getar = f >= fStop ? 6 * Math.sin((f - fStop) * 2.2) * Math.exp(-(f - fStop) / 8) : 0;
    jari = (
      <g>
        {jejak.length > 1 && <path d={"M" + jejak.map((p) => p.join(" ")).join(" L")} stroke="#F28C38" strokeWidth={9} strokeDasharray="2 22" strokeLinecap="round" fill="none" />}
        {f >= fStop && (
          <g transform={`translate(${bx + 46} ${by - 70}) scale(${muncul(f, fStop, 6)})`}>
            <circle r={36} fill="#E23A3A" />
            <text y={16} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={52} fill="#fff">!</text>
          </g>
        )}
        <ellipse cx={jx + 24} cy={jy + 30} rx={36} ry={14} fill="rgba(30,25,60,.18)" />
        <image href={staticFile("v7/asli/jari.png")} x={jx - 217 * 0.42 + getar} y={jy - 790 * 0.42 + 8} width={641 * 0.42} height={829 * 0.42} />
      </g>
    );
  }

  // deret ROBO'S CODE: kotak TETAP sebanyak `slot` (soal hanya muat 4 panah); panah baru menggantikan yang dihapus
  const u = 150, gap = 26;
  const rowX0 = -((slot * (u + gap)) - gap) / 2 + u / 2, rowY = -410;
  const semua = (j.panah ?? []).map((p, i) => ({ ...p, slot: p.slot ?? i }));
  const diKotak = (i: number) => semua.filter((p) => p.slot === i && f >= p.f && (p.hapus === undefined || f < p.hapus + 2)).pop();
  let terisi = 0;
  while (terisi < slot && diKotak(terisi)) terisi++;
  const kunci = j.kunci && f >= j.kunci[0] && f < j.kunci[1] ? muncul(f, j.kunci[0], 6) : 0;

  return (
    <g transform={`translate(${x} ${y}) scale(${s * kartu})`}>
      <rect x={-W / 2 + 6} y={atasK + 14} width={W} height={H} rx={48} fill="rgba(30,25,60,.12)" />
      <rect x={-W / 2} y={atasK} width={W} height={H} rx={48} fill="#fff" stroke="#D3DEFF" strokeWidth={6} />
      {/* papan */}
      <rect x={bx0 - 14} y={by0 - 14} width={B + 28} height={B + 28} rx={34} fill="#FFC94D" />
      {Array.from({ length: 16 }).map((_, i) => {
        const c = i % 4, r = Math.floor(i / 4);
        return <rect key={i} x={bx0 + c * cs + 5} y={by0 + r * cs + 5} width={cs - 10} height={cs - 10} rx={22} fill={(c + r) % 2 ? "#FFEAA8" : "#FFF6D6"} stroke="#F0B43C" strokeWidth={2.5} />;
      })}
      {titik}
      {/* baterai */}
      {(() => {
        const m = j.baterai === undefined ? 1 : muncul(f, j.baterai, 8);
        const [cx, cy] = pos(...baterai);
        return m > 0 ? <g transform={`translate(${cx} ${cy}) scale(${m})`}><BateraiAset cs={cs} f={f} menang={menang} /></g> : null;
      })()}
      {/* batu */}
      {batu.map(([c, r], i) => {
        const m = j.batu?.[i] === undefined ? 1 : muncul(f, j.batu[i], 8);
        if (m <= 0) return null;
        const [cx, cy] = pos(c, r);
        const kena = tabrak > 0 && f >= tabrak && jalur[langkahKe + 1]?.[0] === c && jalur[langkahKe + 1]?.[1] === r;
        const g = kena ? 5 * Math.sin((f - tabrak) * 2.6) * Math.exp(-(f - tabrak) / 7) : 0;
        return (
          <g key={i} transform={`translate(${cx + g} ${cy}) scale(${m})`}>
            <ellipse cx={0} cy={cs * 0.28} rx={cs * 0.34} ry={cs * 0.07} fill="rgba(90,60,10,.18)" />
            <image href={staticFile("lw2/buku/rock.png")} x={-cs * 0.38} y={-cs * 0.27} width={cs * 0.76} height={cs * 0.54} />
            {kena && <circle r={cs * 0.46} fill="none" stroke="#E23A3A" strokeWidth={8} opacity={Math.max(0, 1 - (f - tabrak) / 24)} />}
          </g>
        );
      })}
      {/* bintang tabrakan */}
      {tabrak > 0 && f >= tabrak && f < tabrak + 26 && (
        <g transform={`translate(${rx} ${ry - cs * 0.4})`} opacity={1 - (f - tabrak) / 26}>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2 + (f - tabrak) / 6;
            return <path key={i} transform={`translate(${Math.cos(a) * 60} ${Math.sin(a) * 22})`} d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4Z" fill="#FFB21E" />;
          })}
        </g>
      )}
      {/* Robo */}
      {(() => {
        const m = j.robo === undefined ? 1 : muncul(f, j.robo, 8);
        if (m <= 0) return null;
        const h = cs * 0.8, w = (h * 451) / 434; // kepala Robo bertunas (v7/robo.png)
        const nafas = 1 + 0.02 * Math.sin(f / 9);
        return (
          <g>
            <ellipse cx={rx} cy={ry + cs * 0.36} rx={cs * 0.28 * (1 - angkat / 260)} ry={cs * 0.06} fill="rgba(90,60,10,.22)" />
            <g transform={`translate(${rx} ${ry + cs * 0.38 - angkat}) rotate(${rot}) scale(${m * sx} ${m * sy * nafas})`}>
              <image href={staticFile("v7/robo.png")} x={-w / 2} y={-h} width={w} height={h} />
            </g>
          </g>
        );
      })()}
      {/* percikan menang */}
      {menang > 0 && (() => {
        const [cx, cy] = pos(...baterai);
        return [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const t = f - menangDari;
          const a = (i / 8) * Math.PI * 2;
          const r = 40 + t * 7;
          return <path key={i} transform={`translate(${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r - t}) rotate(${t * 8})`} d="M0 -16 L5 -5 L16 -5 L7 3 L10 15 L0 8 L-10 15 L-7 3 L-16 -5 L-5 -5Z" fill={i % 2 ? "#FFB21E" : "#3FBF8F"} opacity={Math.max(0, 1 - t / 40)} />;
        });
      })()}
      {jari}
      {/* gembok: robot belum boleh jalan sebelum semua panah ditulis */}
      {kunci > 0 && (() => {
        const [cx, cy] = pos(...robo);
        return (
          <g transform={`translate(${cx + cs * 0.36} ${cy - cs * 0.42}) scale(${kunci})`}>
            <circle r={40} fill={NAVY} />
            <rect x={-18} y={-6} width={36} height={28} rx={6} fill="#FFB21E" />
            <path d="M-11 -6 v-10 a11 11 0 0 1 22 0 v10" stroke="#FFB21E" strokeWidth={7} fill="none" />
          </g>
        );
      })()}
      {/* ROBO'S CODE (besar, di atas papan) */}
      <text x={rowX0 - u / 2} y={rowY - u / 2 - 22} fontFamily="Fredoka" fontWeight={700} fontSize={40} letterSpacing={4} fill={BIRU}>ROBO'S CODE</text>
      {Array.from({ length: slot }).map((_, i) => {
        const p = diKotak(i);
        const px = rowX0 + i * (u + gap);
        const m = p ? muncul(f, p.f, 7) : 1;
        const hapusK = p?.hapus !== undefined ? interpolate(f, [p.hapus - 8, p.hapus], [1, 0], cl) : 1;
        const jalan = !!p && p.hapus === undefined && langkahKe === urutJalan.indexOf(p as never) && f < (j.lompat?.[langkahKe] ?? 0) + DUR + 6;
        const urutan = p ? urutJalan.findIndex((q) => q.f === p.f && q.arah === p.arah) : -1;
        const jalanIni = !!p && p.hapus === undefined && langkahKe === urutan && f < (j.lompat?.[langkahKe] ?? 0) + DUR + 6;
        const nyala = !p && i === terisi ? 0.5 + 0.5 * Math.sin(f / 5) : 0;
        return (
          <g key={i} transform={`translate(${px} ${rowY})`}>
            <Tombol arah="kanan" u={u} kosong nyala={nyala} />
            {p && hapusK > 0 && (
              <g transform={`scale(${m * (0.6 + 0.4 * hapusK)})`} opacity={hapusK}>
                <Tombol arah={p.arah} u={u} salah={p.salah} aktif={jalan || jalanIni} />
              </g>
            )}
            {p?.hapus !== undefined && f >= p.hapus - 8 && f < p.hapus + 10 && [0, 1, 2, 3].map((k) => (
              <rect key={k} x={-40 + k * 24} y={u / 2 + (f - (p.hapus ?? 0) + 8) * 2.6 + k * 4} width={16} height={10} rx={3} fill="#F2A7B4" />
            ))}
          </g>
        );
      })}
    </g>
  );
};
