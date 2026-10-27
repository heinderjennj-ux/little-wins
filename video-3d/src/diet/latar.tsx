// Latar digambar kode (gaya Bluey/Drummond): persegi membulat, tampak lurus dari depan, lantai rata,
// garis tepi warna benda (bukan hitam), bayangan kebiruan, area tengah kosong untuk tokoh.
import React from "react";
import { Palet } from "./warna";
import { useF } from "./waktu";

type P = { P: Palet };
const R: React.FC<React.SVGProps<SVGRectElement> & { r?: number }> = ({ r = 18, ...p }) => <rect rx={r} ry={r} {...p} />;

// dinding + pelapis bawah + lantai
export const Ruang: React.FC<P & { lantaiY?: number; ubin?: boolean }> = ({ P, lantaiY = 1260, ubin }) => (
  <g>
    <rect width={1080} height={1920} fill={P.dinding} />
    {ubin &&
      Array.from({ length: 9 }).map((_, i) => <line key={i} x1={0} x2={1080} y1={560 + i * 80} y2={560 + i * 80} stroke={P.dindingBawah} strokeWidth={3} />)}
    {ubin &&
      Array.from({ length: 14 }).map((_, i) => <line key={`v${i}`} x1={i * 80} x2={i * 80} y1={560} y2={lantaiY} stroke={P.dindingBawah} strokeWidth={3} />)}
    {/* kertas dinding bergaris tegak seperti V7 */}
    {!ubin && Array.from({ length: 19 }).map((_, i) => <rect key={i} x={i * 60} y={0} width={26} height={lantaiY} fill={P.dindingBawah} />)}
    {!ubin && <rect y={lantaiY - 26} width={1080} height={26} fill={P.perabotMuda} />}
    <rect y={lantaiY} width={1080} height={1920 - lantaiY} fill={P.lantai} />
    <rect y={lantaiY} width={1080} height={10} fill={P.garis} opacity={0.5} />
    {Array.from({ length: 6 }).map((_, i) => (
      <line key={i} x1={0} x2={1080} y1={lantaiY + 70 + i * i * 22 + i * 40} y2={lantaiY + 70 + i * i * 22 + i * 40} stroke={P.lantaiGaris} strokeWidth={4} />
    ))}
  </g>
);

export const Jendela: React.FC<P & { x: number; y: number; w: number; h: number; tirai?: boolean; malam?: boolean }> = ({ P, x, y, w, h, tirai, malam }) => (
  <g>
    <R x={x - 14} y={y - 14} width={w + 28} height={h + 28} r={24} fill={P.perabotMuda} stroke={P.garis} strokeWidth={5} />
    <R x={x} y={y} width={w} height={h} r={14} fill={P.kaca} />
    {/* luar: atap & pohon sederhana */}
    <path d={`M${x} ${y + h * 0.62} L${x + w * 0.35} ${y + h * 0.42} L${x + w * 0.7} ${y + h * 0.62} Z`} fill={malam ? P.luarTua : P.aksen} opacity={0.8} />
    <circle cx={x + w * 0.82} cy={y + h * 0.55} r={w * 0.2} fill={P.luar} />
    <rect x={x} y={y + h * 0.62} width={w} height={h * 0.38} fill={P.luarTua} opacity={0.7} />
    {malam && <circle cx={x + w * 0.25} cy={y + h * 0.22} r={w * 0.07} fill="#E9E2C4" />}
    <rect x={x + w / 2 - 5} y={y} width={10} height={h} fill={P.perabotMuda} />
    <rect x={x} y={y + h / 2 - 5} width={w} height={10} fill={P.perabotMuda} />
    {tirai && (
      <g>
        <path d={`M${x - 40} ${y - 30} h${w * 0.32} q-30 ${h * 0.5} 10 ${h + 60} h-${w * 0.32 - 30} Z`} fill={P.aksen} stroke={P.garis} strokeWidth={4} />
        <path d={`M${x + w + 40} ${y - 30} h-${w * 0.32} q30 ${h * 0.5} -10 ${h + 60} h${w * 0.32 - 30} Z`} fill={P.aksen} stroke={P.garis} strokeWidth={4} />
        <R x={x - 60} y={y - 46} width={w + 120} height={18} r={9} fill={P.kayuTua} />
      </g>
    )}
  </g>
);

export const Rak: React.FC<P & { x: number; y: number; w: number; isi?: "toples" | "piring" }> = ({ P, x, y, w, isi = "toples" }) => (
  <g>
    {Array.from({ length: Math.floor(w / 78) }).map((_, i) =>
      isi === "toples" ? (
        <g key={i} transform={`translate(${x + 20 + i * 78} ${y - 92})`}>
          <R width={58} height={84} r={14} fill={P.kaca} stroke={P.garis} strokeWidth={4} />
          <R y={34} width={58} height={50} r={12} fill={[P.aksen2, P.aksen, P.perabotTua, P.kayu][i % 4]} opacity={0.85} />
          <R x={-3} y={-12} width={64} height={20} r={8} fill={[P.aksen, P.perabotTua, P.aksen2][i % 3]} stroke={P.garis} strokeWidth={4} />
        </g>
      ) : (
        <g key={i} transform={`translate(${x + 24 + i * 78} ${y - 70})`}>
          <ellipse cx={28} cy={62} rx={34} ry={10} fill={P.perabotMuda} stroke={P.garis} strokeWidth={4} />
          <ellipse cx={28} cy={50} rx={34} ry={10} fill={P.perabotMuda} stroke={P.garis} strokeWidth={4} />
        </g>
      ),
    )}
    <R x={x} y={y} width={w} height={22} r={10} fill={P.kayu} stroke={P.garis} strokeWidth={5} />
    <path d={`M${x + 30} ${y + 22} v40 h40`} stroke={P.kayuTua} strokeWidth={10} fill="none" strokeLinecap="round" />
    <path d={`M${x + w - 30} ${y + 22} v40 h-40`} stroke={P.kayuTua} strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);

export const Pintu: React.FC<P & { x: number; y: number; w: number; h: number; terbuka?: boolean }> = ({ P, x, y, w, h, terbuka }) => (
  <g>
    <R x={x - 22} y={y - 22} width={w + 44} height={h + 22} r={20} fill={P.kayuTua} stroke={P.garis} strokeWidth={5} />
    {terbuka ? <R x={x} y={y} width={w} height={h} r={12} fill={P.bayang} /> : <R x={x} y={y} width={w} height={h} r={12} fill={P.kayu} stroke={P.garis} strokeWidth={4} />}
    {!terbuka && <circle cx={x + w - 50} cy={y + h * 0.52} r={14} fill={P.logam} stroke={P.garis} strokeWidth={4} />}
  </g>
);

export const Jam: React.FC<P & { x: number; y: number; r?: number; jam: number; menit?: number }> = ({ P, x, y, r = 64, jam, menit = 0 }) => {
  const aJ = ((jam % 12) + menit / 60) * 30 - 90;
  const aM = menit * 6 - 90;
  const ujung = (a: number, l: number) => [x + Math.cos((a * Math.PI) / 180) * l, y + Math.sin((a * Math.PI) / 180) * l];
  const [jx, jy] = ujung(aJ, r * 0.5);
  const [mx, my] = ujung(aM, r * 0.75);
  return (
    <g>
      <circle cx={x} cy={y} r={r + 10} fill={P.perabotTua} stroke={P.garis} strokeWidth={5} />
      <circle cx={x} cy={y} r={r} fill={P.kaca} />
      {Array.from({ length: 12 }).map((_, i) => {
        const [a, b] = ujung(i * 30, r * 0.82);
        return <circle key={i} cx={a} cy={b} r={i % 3 === 0 ? 6 : 3.5} fill={P.garis} />;
      })}
      <line x1={x} y1={y} x2={jx} y2={jy} stroke={P.garis} strokeWidth={9} strokeLinecap="round" />
      <line x1={x} y1={y} x2={mx} y2={my} stroke={P.garis} strokeWidth={6} strokeLinecap="round" />
      <circle cx={x} cy={y} r={8} fill={P.garis} />
    </g>
  );
};

export const Bingkai: React.FC<P & { x: number; y: number; w: number; h: number }> = ({ P, x, y, w, h }) => (
  <g>
    <R x={x} y={y} width={w} height={h} r={12} fill={P.kayu} stroke={P.garis} strokeWidth={5} />
    <R x={x + 16} y={y + 16} width={w - 32} height={h - 32} r={6} fill={P.luar} />
    <path d={`M${x + 16} ${y + h - 16} L${x + w * 0.4} ${y + h * 0.45} L${x + w * 0.62} ${y + h * 0.68} L${x + w * 0.78} ${y + h * 0.52} L${x + w - 16} ${y + h - 16} Z`} fill={P.luarTua} />
  </g>
);

export const Tanaman: React.FC<P & { x: number; y: number; s?: number }> = ({ P, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-50, -15, 20, 50].map((a, i) => (
      <ellipse key={i} cx={Math.sin((a * Math.PI) / 180) * 70} cy={-90 - Math.cos((a * Math.PI) / 180) * 40} rx={30} ry={70} transform={`rotate(${a} ${Math.sin((a * Math.PI) / 180) * 70} ${-90 - Math.cos((a * Math.PI) / 180) * 40})`} fill={i % 2 ? "#7F9C9C" : "#6E8C93"} stroke={P.garis} strokeWidth={4} />
    ))}
    <path d="M-60 -40 h120 l-16 110 h-88 Z" fill={P.aksen} stroke={P.garis} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

export const LampuGantung: React.FC<P & { x: number; y: number; nyala?: boolean }> = ({ P, x, y, nyala = true }) => (
  <g>
    <line x1={x} y1={0} x2={x} y2={y} stroke={P.garis} strokeWidth={6} />
    {nyala && <ellipse cx={x} cy={y + 260} rx={330} ry={300} fill="url(#cahayaLampu)" />}
    <path d={`M${x - 110} ${y + 90} Q${x - 100} ${y} ${x} ${y} Q${x + 100} ${y} ${x + 110} ${y + 90} Z`} fill={P.aksen2} stroke={P.garis} strokeWidth={5} />
    <ellipse cx={x} cy={y + 92} rx={36} ry={18} fill={nyala ? "#FFE9B0" : P.perabotMuda} />
    <defs>
      <radialGradient id="cahayaLampu">
        <stop offset="0" stopColor="rgba(255,226,160,.55)" />
        <stop offset="1" stopColor="rgba(255,226,160,0)" />
      </radialGradient>
    </defs>
  </g>
);

// ---------- dapur & warung ----------
export const Kompor: React.FC<P & { x: number; y: number; uap?: boolean }> = ({ P, x, y, uap = true }) => {
  const f = useF();
  return (
  <g>
    <R x={x} y={y - 40} width={300} height={44} r={12} fill={P.perabotTua} stroke={P.garis} strokeWidth={5} />
    {/* panci gulai = benda cerita: sedikit lebih jenuh */}
    <R x={x + 40} y={y - 230} width={220} height={190} r={34} fill={P.logamTua} stroke={P.garis} strokeWidth={5} />
    <R x={x + 58} y={y - 214} width={36} height={150} r={18} fill={P.logam} opacity={0.7} />
    <R x={x + 28} y={y - 244} width={244} height={30} r={14} fill={P.logamTua} stroke={P.garis} strokeWidth={5} />
    <ellipse cx={x + 150} cy={y - 236} rx={100} ry={12} fill="#E6B54A" />
    <R x={x + 4} y={y - 190} width={36} height={20} r={10} fill={P.logamTua} stroke={P.garis} strokeWidth={4} />
    <R x={x + 260} y={y - 190} width={36} height={20} r={10} fill={P.logamTua} stroke={P.garis} strokeWidth={4} />
    {uap &&
      [0, 1, 2].map((i) => {
        // uap naik & memudar berulang, tiap gumpal beda fase
        const k = ((f + i * 20) % 60) / 60;
        return <path key={i} d={`M${x + 100 + i * 50 + Math.sin(f / 14 + i) * 6} ${y - 262 - k * 50} q-24 -40 0 -80 q24 -40 0 -80`} stroke="#F4F1FA" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.75 * Math.sin(k * Math.PI)} />;
      })}
  </g>
  );
};

// meja dapur di depan (menutup bagian bawah tokoh)
export const MejaDepan: React.FC<P & { y?: number; ubin?: boolean }> = ({ P, y = 1360, ubin = true }) => (
  <g>
    <R x={-30} y={y} width={1140} height={44} r={16} fill={P.kayu} stroke={P.garis} strokeWidth={5} />
    <rect x={0} y={y + 44} width={1080} height={1920 - y} fill={P.kayuTua} />
    {ubin && Array.from({ length: 8 }).map((_, i) => <line key={i} x1={i * 150 + 40} x2={i * 150 + 40} y1={y + 44} y2={1920} stroke={P.lantaiGaris} strokeWidth={4} opacity={0.7} />)}
    <rect x={0} y={y + 44} width={1080} height={22} fill={P.bayang} opacity={0.6} />
  </g>
);

export const Wastafel: React.FC<P & { x: number; y: number }> = ({ P, x, y }) => (
  <g>
    <path d={`M${x + 170} ${y - 20} v-120 q0 -40 40 -40 h50 q20 0 20 24`} stroke={P.logamTua} strokeWidth={22} fill="none" strokeLinecap="round" />
    <R x={x + 160} y={y - 40} width={40} height={30} r={8} fill={P.logamTua} />
    <R x={x} y={y} width={460} height={60} r={20} fill={P.logam} stroke={P.garis} strokeWidth={5} />
    <R x={x + 40} y={y + 12} width={380} height={36} r={14} fill={P.logamTua} />
  </g>
);

export const Kulkas: React.FC<P & { x: number; y: number; buka?: boolean }> = ({ P, x, y, buka }) => (
  <g>
    {buka && <path d={`M${x + 330} ${y + 100} L1080 ${y - 60} L1080 1920 L${x + 330} ${y + 980} Z`} fill="url(#sinarKulkas)" />}
    <defs>
      <linearGradient id="sinarKulkas" x1="0" x2="1">
        <stop offset="0" stopColor="rgba(255,226,170,.55)" />
        <stop offset="1" stopColor="rgba(255,226,170,0)" />
      </linearGradient>
    </defs>
    <R x={x} y={y} width={330} height={1080} r={36} fill={P.perabotMuda} stroke={P.garis} strokeWidth={6} />
    {buka ? (
      <g>
        <R x={x + 22} y={y + 22} width={286} height={1036} r={20} fill="#FFE9BE" />
        {[0, 1, 2, 3].map((i) => (
          <R key={i} x={x + 22} y={y + 230 + i * 210} width={286} height={14} r={6} fill="#EBCB92" />
        ))}
        <R x={x + 50} y={y + 150} width={90} height={80} r={14} fill="#E9A05A" />
        <R x={x + 170} y={y + 170} width={110} height={60} r={14} fill="#9CC2A2" />
        <R x={x + 60} y={y + 370} width={120} height={70} r={14} fill="#E5C35A" />
        <ellipse cx={x + 230} cy={y + 420} rx={50} ry={22} fill="#D98A6A" />
        <R x={x + 50} y={y + 570} width={200} height={80} r={18} fill="#B9D59A" />
        {/* isi kulkas lebih penuh (audit A4) */}
        <R x={x + 200} y={y + 140} width={80} height={90} r={12} fill="#D9534F" opacity={0.85} />
        <R x={x + 190} y={y + 360} width={70} height={80} r={10} fill="#F2E3B3" />
        {[0, 1, 2, 3].map((i) => <ellipse key={i} cx={x + 60 + i * 34} cy={y + 520} rx={15} ry={19} fill="#F7EBD3" />)}
        <R x={x + 200} y={y + 480} width={90} height={60} r={12} fill="#9FC7E8" />
        <R x={x + 260} y={y + 570} width={36} height={80} r={10} fill="#E9A05A" />
        <R x={x + 40} y={y + 700} width={250} height={100} r={18} fill="#EBD9B0" />
        {[0, 1, 2].map((i) => <ellipse key={`t${i}`} cx={x + 80 + i * 80} cy={y + 760} rx={30} ry={22} fill={["#E5533F", "#7DBB5E", "#E9A05A"][i]} />)}
        <R x={x + 40} y={y + 840} width={250} height={180} r={22} fill="rgba(170,210,160,.55)" />
        {[0, 1, 2, 3, 4].map((i) => <ellipse key={`s${i}`} cx={x + 70 + i * 48} cy={y + 930} rx={20} ry={40} fill={i % 2 ? "#6FAF55" : "#E07A3E"} />)}
        {/* pintu kulkas terbuka ke kiri */}
        <path d={`M${x} ${y + 10} L${x - 170} ${y + 70} L${x - 170} ${y + 1010} L${x} ${y + 1070} Z`} fill={P.perabotMuda} stroke={P.garis} strokeWidth={6} strokeLinejoin="round" />
      </g>
    ) : (
      <g>
        <line x1={x} x2={x + 330} y1={y + 360} y2={y + 360} stroke={P.garis} strokeWidth={6} />
        <R x={x + 270} y={y + 120} width={22} height={150} r={11} fill={P.logamTua} />
        <R x={x + 270} y={y + 420} width={22} height={200} r={11} fill={P.logamTua} />
      </g>
    )}
  </g>
);

export const Etalase: React.FC<P & { x: number; y: number }> = ({ P, x, y }) => (
  <g>
    <R x={x} y={y} width={380} height={300} r={22} fill={P.kaca} stroke={P.garis} strokeWidth={5} opacity={0.95} />
    {[0, 1].map((i) => (
      <R key={i} x={x + 14} y={y + 120 + i * 120} width={352} height={12} r={6} fill={P.perabotTua} />
    ))}
    {Array.from({ length: 5 }).map((_, i) => (
      <ellipse key={i} cx={x + 50 + i * 70} cy={y + 100} rx={28} ry={18} fill={["#D9A35C", "#C98F4E", "#E3B76A"][i % 3]} />
    ))}
    {Array.from({ length: 5 }).map((_, i) => (
      <ellipse key={`b${i}`} cx={x + 50 + i * 70} cy={y + 220} rx={28} ry={16} fill={["#B9C98E", "#D9A35C", "#E3B76A"][i % 3]} />
    ))}
    <R x={x - 10} y={y + 300} width={400} height={40} r={14} fill={P.kayu} stroke={P.garis} strokeWidth={5} />
  </g>
);

export const Tenda: React.FC<P & { y: number }> = ({ P, y }) => (
  <g>
    {Array.from({ length: 9 }).map((_, i) => (
      <path key={i} d={`M${i * 130 - 20} ${y} h130 v90 q-65 40 -130 0 Z`} fill={i % 2 ? P.perabotMuda : P.aksen} stroke={P.garis} strokeWidth={4} />
    ))}
  </g>
);

export const Papan: React.FC<P & { x: number; y: number; teks: string }> = ({ P, x, y, teks }) => (
  <g>
    <R x={x} y={y} width={360} height={96} r={20} fill={P.perabotMuda} stroke={P.garis} strokeWidth={5} />
    <text x={x + 180} y={y + 64} textAnchor="middle" fontFamily="Baloo2" fontWeight={800} fontSize={48} fill={P.garis}>
      {teks}
    </text>
  </g>
);

// meja makan di depan (malam makan bareng)
export const MejaMakan: React.FC<P & { y: number }> = ({ P, y }) => (
  <g>
    <R x={-40} y={y} width={1160} height={60} r={24} fill={P.kayu} stroke={P.garis} strokeWidth={6} />
    <rect x={0} y={y + 60} width={1080} height={1920 - y} fill={P.kayuTua} />
    <rect x={0} y={y + 60} width={1080} height={26} fill={P.bayang} opacity={0.5} />
  </g>
);
