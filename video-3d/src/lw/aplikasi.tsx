// Ikon aplikasi anak yang berbeda-beda (logo + nama), supaya penonton langsung paham ini banyak aplikasi yang berlainan.
import React from "react";

export type App = { nama: string; warna: string; g: string };
export const APPS: App[] = [
  { nama: "Guess the Animal", warna: "#F28C38", g: "kucing" },
  { nama: "Color Fun", warna: "#E8455B", g: "krayon" },
  { nama: "Quick Math", warna: "#2F80ED", g: "hitung" },
  { nama: "ABC Fun", warna: "#8E5BFF", g: "abc" },
  { nama: "Kids Songs", warna: "#FF5FA2", g: "nada" },
  { nama: "Car Race", warna: "#E23A3A", g: "mobil" },
  { nama: "Smart Puzzle", warna: "#3FBF8F", g: "puzzle" },
  { nama: "Dino Run", warna: "#7CC242", g: "dino" },
  { nama: "Cartoon TV", warna: "#00A3C4", g: "tv" },
  { nama: "Let's Cook", warna: "#FFB020", g: "panci" },
  { nama: "Funny Robot", warna: "#5B7BD8", g: "robot" },
  { nama: "Soccer Goal", warna: "#1F9D55", g: "bola" },
  { nama: "Block Stack", warna: "#B26BFF", g: "balok" },
  { nama: "Flower Garden", warna: "#F0679A", g: "bunga" },
  { nama: "Space Rocket", warna: "#3A4BA8", g: "roket" },
  { nama: "Watercolor", warna: "#00B8D9", g: "kuas" },
];

const Glyph: React.FC<{ g: string }> = ({ g }) => {
  const P = "#fff";
  switch (g) {
    case "kucing":
      return <g><path d="M-20 -8 L-16 -26 L-6 -14 Z M20 -8 L16 -26 L6 -14 Z" fill={P} /><circle r={20} fill={P} /><circle cx={-7} cy={-2} r={3} fill="#333" /><circle cx={7} cy={-2} r={3} fill="#333" /><path d="M-4 7 Q0 10 4 7" stroke="#333" strokeWidth={2.5} fill="none" /></g>;
    case "krayon":
      return <g transform="rotate(-35)"><rect x={-7} y={-18} width={14} height={30} rx={3} fill={P} /><path d="M-7 12 L0 24 L7 12 Z" fill="#FFD7D7" /><rect x={-7} y={-6} width={14} height={5} fill="#E8455B" opacity={0.4} /></g>;
    case "hitung":
      return <text y={10} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={26} fill={P}>1+2</text>;
    case "abc":
      return <text y={10} textAnchor="middle" fontFamily="Fredoka" fontWeight={700} fontSize={28} fill={P}>Abc</text>;
    case "nada":
      return <g><path d="M-6 12 L-6 -18 L14 -22 L14 8" stroke={P} strokeWidth={5} fill="none" /><ellipse cx={-11} cy={13} rx={7} ry={5.5} fill={P} /><ellipse cx={9} cy={9} rx={7} ry={5.5} fill={P} /></g>;
    case "mobil":
      return <g><path d="M-24 6 L-24 -2 L-14 -4 L-8 -14 L10 -14 L16 -4 L24 -2 L24 6 Z" fill={P} /><circle cx={-13} cy={8} r={6} fill="#333" /><circle cx={13} cy={8} r={6} fill="#333" /></g>;
    case "puzzle":
      return <path d="M-16 -16 H-4 A5 5 0 1 1 4 -16 H16 V-4 A5 5 0 1 0 16 4 V16 H-16 Z" fill={P} />;
    case "dino":
      return <path d="M-20 14 L-14 -2 Q-12 -12 0 -12 L6 -12 L8 -22 Q18 -24 20 -16 L20 -10 L10 -8 L10 4 L16 14 L8 14 L4 6 L-6 6 L-8 14 Z" fill={P} />;
    case "tv":
      return <g><rect x={-22} y={-16} width={44} height={30} rx={7} fill={P} /><path d="M-5 -7 L8 -1 L-5 5 Z" fill="#00A3C4" /></g>;
    case "panci":
      return <g><ellipse cx={-4} cy={2} rx={16} ry={12} fill={P} /><rect x={10} y={-1} width={16} height={6} rx={3} fill={P} /><path d="M-10 -14 q3 -5 0 -9 M-2 -14 q3 -5 0 -9" stroke={P} strokeWidth={2.5} fill="none" /></g>;
    case "robot":
      return <g><rect x={-15} y={-12} width={30} height={26} rx={7} fill={P} /><rect x={-1.5} y={-21} width={3} height={9} fill={P} /><circle cy={-22} r={4} fill={P} /><circle cx={-6} cy={0} r={3.5} fill="#333" /><circle cx={6} cy={0} r={3.5} fill="#333" /></g>;
    case "bola":
      return <g><circle r={18} fill={P} /><path d="M0 -7 L7 -2 L4 7 L-4 7 L-7 -2 Z" fill="#333" /></g>;
    case "balok":
      return <g><rect x={-20} y={-2} width={18} height={18} rx={3} fill={P} /><rect x={2} y={-2} width={18} height={18} rx={3} fill={P} opacity={0.85} /><rect x={-9} y={-22} width={18} height={18} rx={3} fill={P} /></g>;
    case "bunga":
      return <g>{[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cy={-11} rx={7} ry={10} fill={P} transform={`rotate(${a})`} />)}<circle r={6} fill="#FFD54F" /></g>;
    case "roket":
      return <g transform="rotate(35)"><path d="M0 -22 Q10 -10 8 10 L-8 10 Q-10 -10 0 -22 Z" fill={P} /><path d="M-8 4 L-15 14 L-8 12 Z M8 4 L15 14 L8 12 Z" fill={P} /><circle cy={-6} r={4} fill="#3A4BA8" /></g>;
    case "kuas":
      return <g transform="rotate(-40)"><rect x={-3} y={-22} width={6} height={26} rx={3} fill={P} /><path d="M-7 4 Q-8 18 0 22 Q8 18 7 4 Z" fill={P} /></g>;
    default:
      return null;
  }
};

// ikon aplikasi + nama di bawahnya; (x,y) = pojok kiri atas, s = sisi ikon
export const AppIcon: React.FC<{ app: App; x: number; y: number; s: number; nama?: boolean }> = ({ app, x, y, s, nama = true }) => (
  <g>
    <g transform={`translate(${x} ${y})`}>
      <rect width={s} height={s} rx={s * 0.24} fill={app.warna} />
      <rect y={s * 0.55} width={s} height={s * 0.45} rx={s * 0.24} fill="#000" opacity={0.07} />
      <g transform={`translate(${s / 2} ${s / 2}) scale(${s / 66})`}>
        <Glyph g={app.g} />
      </g>
    </g>
    {nama && <text x={x + s / 2} y={y + s + 15} textAnchor="middle" fontFamily="Fredoka" fontWeight={600} fontSize={13} fill="#3B4A6A">{app.nama}</text>}
  </g>
);
