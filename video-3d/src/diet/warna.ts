// Palet video diet = palet Koder Cilik Variasi 7 (Triad E, src/gaya/tema.ts) atas permintaan owner:
// TENANG = dinding biru-lavender sangat pucat (bergaris), lantai/meja krem kayu hangat, aksen mawar & emas;
// INTENS = dinding indigo gelap + kolam cahaya hangat (sorotan) di fokus + vinyet kuat, dipakai di momen tegang.
// Tokoh tetap paling jenuh; fokus diberi garis tepi navy tipis seperti V7.
export type Palet = {
  dinding: string; dindingBawah: string; lantai: string; lantaiGaris: string;
  perabot: string; perabotTua: string; perabotMuda: string; garis: string; bayang: string;
  kaca: string; luar: string; luarTua: string; kayu: string; kayuTua: string; logam: string; logamTua: string;
  aksen: string; aksen2: string; cahaya: string; vinyet: string; blur: string; gelap: boolean; garisFokus: string; sorot: number;
};

// TRIAD (Gurney: 3 "primer subjektif" = sudut segitiga gamut; warna di luar segitiga tidak dipakai):
//   1) biru-periwinkle = DOMINAN (latar, pucat & kurang jenuh)
//   2) merah-koral   = aksen (baju Bonita, benda cerita)
//   3) emas/kunyit   = aksen (cahaya, makanan, buku, CTA)
// Kontras ala Pixar (Csillag & Sabao 2022): fokus = paling jenuh & terang, sekitar = pucat/kurang jenuh.
export const SIANG: Palet = {
  dinding: "#D3DAF3", dindingBawah: "#C6CEEE", lantai: "#E6D7B5", lantaiGaris: "#D6C49E",
  perabot: "#9AA2D0", perabotTua: "#7F88C0", perabotMuda: "#EEEAF6", garis: "#7880B5", bayang: "#C3CAEA",
  kaca: "#BFCDF0", luar: "#D4DDF5", luarTua: "#A9B79A", kayu: "#E6D7B5", kayuTua: "#D3C09A", logam: "#C8CFEC", logamTua: "#98A1CF",
  aksen: "#DDB0C0", aksen2: "#EBD3A0", cahaya: "rgba(255,214,150,.5)", vinyet: "rgba(80,80,140,.25)", blur: "blur(2px)", gelap: false,
  garisFokus: "#2E2A48", sorot: 1,
};

// warung Rini: dominan digeser ke mawar pucat (sudut triad lain) supaya kaus teal Rini kontras komplementer & tempatnya beda dari warung Bonita
export const RINI: Palet = {
  ...SIANG,
  dinding: "#EDD3DA", dindingBawah: "#E4C4CE", perabot: "#C99AAE", perabotTua: "#B07F96", perabotMuda: "#F8EEF1", garis: "#A87A92",
  bayang: "#E0BFCB", kaca: "#F3E2E7", luar: "#F1DCE3", aksen: "#C6CEEE", logam: "#EBD8DF", logamTua: "#C99AAE",
};

// sama dengan E_INTENS (V7): dipakai untuk momen tegang & malam
export const MALAM: Palet = {
  dinding: "#2F3566", dindingBawah: "#2B3160", lantai: "#5A5240", lantaiGaris: "#4E4838",
  perabot: "#30366A", perabotTua: "#222850", perabotMuda: "#4A4660", garis: "#22264A", bayang: "#262C58",
  kaca: "#46508A", luar: "#505A92", luarTua: "#465440", kayu: "#5A5240", kayuTua: "#4E4838", logam: "#4E4A5E", logamTua: "#3E4888",
  aksen: "#6A4A62", aksen2: "#7A6E58", cahaya: "rgba(255,206,140,.42)", vinyet: "rgba(12,12,32,.5)", blur: "blur(2px)", gelap: true,
  garisFokus: "#1A1626", sorot: 1.25,
};
export const INTENS = MALAM;

// makan bareng malam hari: palet tenang + cahaya lampu lebih hangat (bukan palet baru)
export const SENJA: Palet = { ...SIANG, cahaya: "rgba(255,200,120,.6)", luar: "#46508A", luarTua: "#3E4888", kaca: "#505A92" };

// subuh: palet tenang, langit jendela merah muda
export const SUBUH: Palet = { ...SIANG, kaca: "#F1D4DE", luar: "#EBC3D2", cahaya: "rgba(255,200,180,.45)" };

export const MEREK = { kertas: "#FBF5EA", tinta: "#2E211B", bata: "#B93F0C", bataTua: "#8F3009", kunyit: "#E3A13A", cta: "#E9B23E", garis: "#E7DBC6" };
export const NAVY = "#1E2A44";
