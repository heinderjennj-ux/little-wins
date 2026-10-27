// Tiga gaya kontras untuk dipilih owner. Semua benda latar DIWARNAI ULANG dari palet (bukan ditimpa lapisan warna).
// A — Itten hangat-dingin + Gurney "dominant hue with accent": latar keluarga biru adem, fokus hangat.
// B — Itten gelap-terang + Bruce Block "tone": latar nada gelap berwarna (indigo), fokus disorot kolam cahaya hangat.
// C — Itten komplementer + kontras luas: latar keluarga krem-peach hangat yang pucat, fokus diberi aksen biru.
import { createContext, useContext } from "react";
import { interpolate } from "remotion";
import { cari } from "./naskah";

export type Tema = {
  nama: string;
  // adegan peneliti
  latar: string; dinding: string; garisDinding: string; kusen: string; langit: string; langitBawah: string; matahari: string;
  tirai: string; rel: string; jamMuka: string; jamGaris: string; jarumDetik: string; rakLuar: string; rakDalam: string;
  buku: string[]; papanRak: string; mejaAtas: string; mejaDepan: string; serat: string; cangkir: string; cangkirAtas: string;
  kertas: [string, string]; daun: [string, string, string]; pot: string;
  blurJauh: string; blurDekat: string; cahaya: string; vinyet: string; garisFokus: string; judulGelap1: boolean;
  // adegan HP dari atas
  latarB: string; karpet: string; karpetGaris: string; pita: string; celana: string; jahitan: string;
  mobil: string; mobilAtas: string; roda: string; balok: string; balokHuruf: string; bukuB: string; bukuBDalam: string;
  bola: string; bolaGaris: string; lengan: string; lenganBayang: string; cahayaB: string; vinyetB: string; judulGelap2: boolean;
};

export const TEMA: Record<"A" | "B" | "C", Tema> = {
  A: {
    nama: "A · Biru adem + fokus hangat",
    latar: "#DCE8F5", dinding: "#DCE8F5", garisDinding: "#D0E0F1", kusen: "#F2F7FD", langit: "#B8D8F2", langitBawah: "#CFE4F6", matahari: "#F4F8FC",
    tirai: "#9DB6DE", rel: "#7F93BC", jamMuka: "#EEF4FB", jamGaris: "#6F85AE", jarumDetik: "#8FA7D4", rakLuar: "#8396C0", rakDalam: "#6F83AE",
    buku: ["#A7C1E6", "#7FA3D6", "#B5B9E8", "#8CC3CF", "#93AEDD", "#C4D6EE", "#6E92C8"], papanRak: "#95A8CF",
    mejaAtas: "#C4D3EA", mejaDepan: "#AFC2E0", serat: "#9EB1D3", cangkir: "#9BB4E0", cangkirAtas: "#869FCF",
    kertas: ["#EEF3FA", "#DDE6F3"], daun: ["#7FB5B8", "#6AA3AC", "#93C4C4"], pot: "#E4ECF6",
    blurJauh: "blur(2px)", blurDekat: "blur(0.8px)", cahaya: "rgba(255,214,150,.55)", vinyet: "rgba(70,100,150,.28)", garisFokus: "#3A2A3E", judulGelap1: false,
    latarB: "#2C5664", karpet: "#3F7680", karpetGaris: "#4C8791", pita: "#346873", celana: "#2F5866", jahitan: "#284D5A",
    mobil: "#5E9AA5", mobilAtas: "#6FAAB3", roda: "#23434C", balok: "#7FB7B0", balokHuruf: "#CDE7E3", bukuB: "#5C8FB0", bukuBDalam: "#8DB6CC",
    bola: "#5FA394", bolaGaris: "#CDE7E3", lengan: "#FF7A59", lenganBayang: "#E8613F", cahayaB: "rgba(255,236,200,.5)", vinyetB: "rgba(14,40,50,.4)", judulGelap2: true,
  },
  B: {
    nama: "B · Sorotan cahaya (gelap-terang)",
    latar: "#2E3358", dinding: "#3A3F6B", garisDinding: "#353A63", kusen: "#4B5180", langit: "#5A6AA0", langitBawah: "#6676AC", matahari: "#8C98C8",
    tirai: "#5B4F86", rel: "#2E3258", jamMuka: "#4A5182", jamGaris: "#2A2E52", jarumDetik: "#6D78B0", rakLuar: "#2E3358", rakDalam: "#262A4A",
    buku: ["#4D5A92", "#5E4F8C", "#3F6E86", "#6A5E9E", "#4E7096", "#58628F", "#7A5C8E"], papanRak: "#3A4070",
    mejaAtas: "#4A5285", mejaDepan: "#3B4272", serat: "#343A66", cangkir: "#55609A", cangkirAtas: "#4A548C",
    kertas: ["#6A74A6", "#5A6496"], daun: ["#3E6A78", "#34606E", "#4A7A84"], pot: "#4A5285",
    blurJauh: "blur(2px)", blurDekat: "blur(0.6px)", cahaya: "rgba(255,206,140,.85)", vinyet: "rgba(12,12,30,.55)", garisFokus: "#1E1A2E", judulGelap1: true,
    latarB: "#232448", karpet: "#2E2F55", karpetGaris: "#383A66", pita: "#28294C", celana: "#24264A", jahitan: "#1D1F3E",
    mobil: "#4A4E86", mobilAtas: "#585D96", roda: "#17182E", balok: "#5A5A92", balokHuruf: "#8C8EC0", bukuB: "#3F5B8A", bukuBDalam: "#5C76A6",
    bola: "#4E6E88", bolaGaris: "#8C9EC0", lengan: "#FF7A59", lenganBayang: "#E8613F", cahayaB: "rgba(255,226,180,.7)", vinyetB: "rgba(10,10,28,.55)", judulGelap2: true,
  },
  C: {
    nama: "C · Krem hangat + aksen biru (komplementer)",
    latar: "#F3DCC6", dinding: "#F6E3CF", garisDinding: "#F1D8BF", kusen: "#FBF1E6", langit: "#F6DCC4", langitBawah: "#F9E6D3", matahari: "#FFF3E6",
    tirai: "#E8B998", rel: "#C99A7A", jamMuka: "#FBF0E4", jamGaris: "#C29274", jarumDetik: "#D9A486", rakLuar: "#D3A47F", rakDalam: "#C08F6C",
    buku: ["#EBC3A0", "#E2A98A", "#F0D2B4", "#D99F86", "#E7B79A", "#F2C9A6", "#CF9478"], papanRak: "#DDB08E",
    mejaAtas: "#F0D3B8", mejaDepan: "#E6C2A2", serat: "#D9AF8E", cangkir: "#E9B48F", cangkirAtas: "#DDA27D",
    kertas: ["#FBF2E8", "#F3E3D2"], daun: ["#C9B48A", "#B9A47C", "#D6C39A"], pot: "#F6E9DA",
    blurJauh: "blur(2px)", blurDekat: "blur(0.8px)", cahaya: "rgba(190,220,255,.5)", vinyet: "rgba(150,100,70,.22)", garisFokus: "#22324A", judulGelap1: false,
    latarB: "#C98B6B", karpet: "#D9A383", karpetGaris: "#E2B293", pita: "#C98F6E", celana: "#B97C5E", jahitan: "#A86E55",
    mobil: "#E0B08E", mobilAtas: "#E9C09F", roda: "#9A6650", balok: "#EDC9A6", balokHuruf: "#FFF1E2", bukuB: "#D69C7C", bukuBDalam: "#EAC0A2",
    bola: "#E4B48C", bolaGaris: "#FFF1E2", lengan: "#2F80ED", lenganBayang: "#1F5FB8", cahayaB: "rgba(200,225,255,.45)", vinyetB: "rgba(120,70,40,.3)", judulGelap2: false,
  },
};


// ---- palet tambahan: tiap gaya punya suasana TENANG dan INTENS (sorotan gelap-terang untuk momen tegang) ----
const D_TENANG: Tema = {
  nama: "D · Oranye–teal (komplementer) — tenang",
  latar: "#CFE7E6", dinding: "#CFE7E6", garisDinding: "#C3E0DF", kusen: "#EAF5F4", langit: "#A9D9DA", langitBawah: "#C2E5E4", matahari: "#F1F8F7",
  tirai: "#7FBFC0", rel: "#5E9EA2", jamMuka: "#E6F3F2", jamGaris: "#4F8D92", jarumDetik: "#73AFAF", rakLuar: "#5F9DA0", rakDalam: "#4C878B",
  buku: ["#8CCFCB", "#5FB3B3", "#A6D8D2", "#4FA3A8", "#7BC0BE", "#B9E2DC", "#3F8F96"], papanRak: "#6FAAAC",
  mejaAtas: "#B5DAD8", mejaDepan: "#9ACBCA", serat: "#88BDBD", cangkir: "#7FC2C0", cangkirAtas: "#6AB0AF",
  kertas: ["#EEF7F6", "#DCEDEB"], daun: ["#5FA59A", "#4E968C", "#74B5A8"], pot: "#E3F1EF",
  blurJauh: "blur(2px)", blurDekat: "blur(0.8px)", cahaya: "rgba(255,170,90,.55)", vinyet: "rgba(30,90,95,.28)", garisFokus: "#3A2A2A", judulGelap1: false,
  latarB: "#1F5A5E", karpet: "#2C6E70", karpetGaris: "#378080", pita: "#25605F", celana: "#1F5254", jahitan: "#19474A",
  mobil: "#4E9C9B", mobilAtas: "#5FAEAB", roda: "#133A3C", balok: "#6DB8AE", balokHuruf: "#C9ECE6", bukuB: "#3F8794", bukuBDalam: "#77B3BB",
  bola: "#4FA08E", bolaGaris: "#C9ECE6", lengan: "#FF8A3D", lenganBayang: "#E06A1F", cahayaB: "rgba(255,190,120,.5)", vinyetB: "rgba(8,40,42,.4)", judulGelap2: true,
};
const D_INTENS: Tema = {
  ...D_TENANG, nama: "D intens",
  latar: "#163D42", dinding: "#1E4A50", garisDinding: "#1B444A", kusen: "#2A5A60", langit: "#3B7178", langitBawah: "#457C82", matahari: "#5E9198",
  tirai: "#2F6268", rel: "#163A40", jamMuka: "#2A5A60", jamGaris: "#10302F", jarumDetik: "#4A8288", rakLuar: "#163D42", rakDalam: "#12343A",
  buku: ["#2E6A70", "#3D7A6E", "#26606A", "#457F84", "#30707A", "#3A6870", "#255A60"], papanRak: "#1F4A50",
  mejaAtas: "#2A5C62", mejaDepan: "#22525A", serat: "#1C4850", cangkir: "#30707A", cangkirAtas: "#286068",
  kertas: ["#3E767C", "#346A70"], daun: ["#28605A", "#215450", "#306C64"], pot: "#2A5C62",
  cahaya: "rgba(255,160,70,.85)", vinyet: "rgba(5,25,28,.6)", garisFokus: "#1A1212", judulGelap1: true,
  latarB: "#0F3436", karpet: "#164244", karpetGaris: "#1B4C4E", pita: "#123A3C", celana: "#10363A", jahitan: "#0C2E30",
  mobil: "#285E5E", mobilAtas: "#306A68", roda: "#081E20", balok: "#2F6A64", balokHuruf: "#5E9A92", bukuB: "#22545E", bukuBDalam: "#346670",
  bola: "#275E54", bolaGaris: "#5E9A92", cahayaB: "rgba(255,170,90,.7)", vinyetB: "rgba(4,20,22,.6)",
};
const E_TENANG: Tema = {
  nama: "E · Triad (biru dominan + emas + mawar) — tenang",
  latar: "#DDE3F6", dinding: "#DDE3F6", garisDinding: "#D2D9F2", kusen: "#F4F1E6", langit: "#BFCDF0", langitBawah: "#D4DDF5", matahari: "#F6E7B8",
  tirai: "#E3B8C4", rel: "#B48A9A", jamMuka: "#F7F0DC", jamGaris: "#8A8FB8", jarumDetik: "#D69AAE", rakLuar: "#9AA2D0", rakDalam: "#8790C2",
  buku: ["#B9C3EC", "#E8C9A0", "#E3B3C1", "#A3AEE0", "#EED9A8", "#D9A9BA", "#C5CDF0"], papanRak: "#A8B0DA",
  mejaAtas: "#E9DDBE", mejaDepan: "#DCCDA8", serat: "#CDBD96", cangkir: "#E3B3C1", cangkirAtas: "#D6A1B1",
  kertas: ["#FBF7EC", "#F0E9D6"], daun: ["#A9B79A", "#97A78A", "#BBC7A9"], pot: "#F1E7EC",
  blurJauh: "blur(2px)", blurDekat: "blur(0.8px)", cahaya: "rgba(255,214,150,.5)", vinyet: "rgba(80,80,140,.25)", garisFokus: "#2E2A48", judulGelap1: false,
  latarB: "#3E4A86", karpet: "#4D5A98", karpetGaris: "#5A67A6", pita: "#9B6E8A", celana: "#3A4478", jahitan: "#323B6A",
  mobil: "#B98A9E", mobilAtas: "#C99AAE", roda: "#2A2F55", balok: "#C9AE78", balokHuruf: "#F3E6C4", bukuB: "#6E7CC0", bukuBDalam: "#98A3D6",
  bola: "#B8A15F", bolaGaris: "#F3E6C4", lengan: "#FF7A59", lenganBayang: "#E8613F", cahayaB: "rgba(255,230,180,.5)", vinyetB: "rgba(20,20,50,.4)", judulGelap2: true,
};
const E_INTENS: Tema = {
  ...E_TENANG, nama: "E intens",
  latar: "#262C58", dinding: "#2F3566", garisDinding: "#2B3160", kusen: "#4A4660", langit: "#46508A", langitBawah: "#505A92", matahari: "#7A6E58",
  tirai: "#6A4A62", rel: "#3A2A44", jamMuka: "#4E4A5E", jamGaris: "#22264A", jarumDetik: "#8A5E74", rakLuar: "#282E5A", rakDalam: "#222850",
  buku: ["#3E4888", "#6E6048", "#6A4A60", "#384280", "#7A6A4E", "#5E4258", "#4A5492"], papanRak: "#30366A",
  mejaAtas: "#5A5240", mejaDepan: "#4E4838", serat: "#443E30", cangkir: "#6A4A60", cangkirAtas: "#5E4256",
  kertas: ["#6A6478", "#5E5870"], daun: ["#465440", "#3E4A38", "#505E48"], pot: "#4A4660",
  cahaya: "rgba(255,206,140,.42)", vinyet: "rgba(12,12,32,.5)", garisFokus: "#1A1626", judulGelap1: true,
  latarB: "#1C2144", karpet: "#252B52", karpetGaris: "#2D3460", pita: "#4A3046", celana: "#1E2446", jahitan: "#181D3C",
  mobil: "#5E4250", mobilAtas: "#6A4C5C", roda: "#12142A", balok: "#6A5A38", balokHuruf: "#9A8C66", bukuB: "#343E74", bukuBDalam: "#48528A",
  bola: "#5E5432", bolaGaris: "#9A8C66", cahayaB: "rgba(255,226,180,.7)", vinyetB: "rgba(10,10,28,.58)",
};

export type Gaya = "A" | "B" | "C" | "AB" | "D" | "E";
export const PASANGAN: Record<Gaya, { tenang: Tema; intens: Tema }> = {
  A: { tenang: TEMA.A, intens: TEMA.A },
  B: { tenang: TEMA.B, intens: TEMA.B },
  C: { tenang: TEMA.C, intens: TEMA.C },
  AB: { tenang: TEMA.A, intens: TEMA.B },
  D: { tenang: D_TENANG, intens: D_INTENS },
  E: { tenang: E_TENANG, intens: E_INTENS },
};

// ---- campur dua palet (k 0 = tenang, 1 = intens) ----
const rgba = (c: string): number[] => {
  if (c.startsWith("#")) return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16), 1];
  return c.replace(/rgba?\(|\)/g, "").split(",").map(Number);
};
const campurWarna = (a: string, b: string, k: number) => {
  if (a === b || k <= 0) return a;
  if (k >= 1) return b;
  const x = rgba(a), y = rgba(b);
  const m = x.map((v, i) => v + ((y[i] ?? 1) - v) * k);
  return `rgba(${Math.round(m[0])},${Math.round(m[1])},${Math.round(m[2])},${m[3].toFixed(3)})`;
};
export const campur = (a: Tema, b: Tema, k: number): Tema => {
  if (a === b || k <= 0) return a;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(a) as (keyof Tema)[]) {
    const va = a[key], vb = b[key];
    if (Array.isArray(va)) out[key] = (va as string[]).map((c, i) => campurWarna(c, (vb as string[])[i], k));
    else if (typeof va === "string" && /^(#|rgba)/.test(va)) out[key] = campurWarna(va, vb as string, k);
    else out[key] = k > 0.5 ? vb : va;
  }
  return out as Tema;
};

// ---- kapan suasana jadi intens (mengikuti kata) ----
export const kRuang = (f: number) => interpolate(f, [cari("kebanyakan").at - 4, cari("rendah").at], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const kAnak = (f: number) => interpolate(f, [cari("padahal").at - 2, cari("padahal").at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const PasanganCtx = createContext(PASANGAN.A);
export const TemaCtx = createContext<Tema>(TEMA.A);
export const useTema = () => useContext(TemaCtx);
export const usePasangan = () => useContext(PasanganCtx);
