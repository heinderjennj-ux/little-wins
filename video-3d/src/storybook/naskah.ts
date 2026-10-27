// Naskah Variasi 2 riset (Meyer, Zosh dkk. 2021). Belum ada suara: waktu tiap kata dihitung dari tempo baca ±2,4 kata/dtk.
// Kalau nanti VO sudah ada, ganti KATA dengan waktu asli dari kata.json.
export const FPS = 30;

export type Kata = { w: string; tampil: string; at: number; akhir: number }; // at/akhir dalam frame

const KALIMAT = [
  "Para peneliti memeriksa seratus dua puluh empat aplikasi belajar anak yang paling populer.",
  "Hasilnya?",
  "Kebanyakan nilainya rendah.",
  "Karena di aplikasi itu, anak cuma disuruh mengetuk layar.",
  "Tap, tap, tap.",
  "Sedikit-sedikit, langsung muncul bintang, hadiah, dan suara heboh.",
  "Padahal anaknya belum sempat berpikir.",
];
// yang tampil di subtitle berbeda dari yang diucapkan ("" = disembunyikan)
const TAMPIL: Record<string, string> = { seratus: "124", dua: "", puluh: "", empat: "" };

const susun = (): Kata[] => {
  const out: Kata[] = [];
  let t = 10;
  KALIMAT.forEach((k) => {
    k.split(" ").forEach((w) => {
      const bersih = w.replace(/[.,?!]/g, "").toLowerCase();
      const dur = /^tap/i.test(w) ? 13 : Math.round(8 + bersih.length * 1.05);
      out.push({ w, tampil: TAMPIL[bersih] ?? w.replace(/[.,!]/g, "").toLowerCase().replace(/^tap$/, "tap"), at: t, akhir: t + dur });
      t += dur + (/[.?]$/.test(w) ? 14 : /,$/.test(w) ? 6 : 0);
    });
  });
  return out;
};

export const KATA = susun();
export const cari = (w: string, ke = 0) => KATA.filter((k) => k.w.replace(/[.,?!]/g, "").toLowerCase() === w)[ke];
export const DURASI = KATA[KATA.length - 1].akhir + 45;
