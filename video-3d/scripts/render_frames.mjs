// Render beberapa frame dari satu komposisi (satu kali bundle). Pakai: node scripts/render_frames.mjs <id> <folder> f1,f2,...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [id, keluar, daftar] = process.argv.slice(2);
fs.mkdirSync(keluar, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comp = await selectComposition({ serveUrl, id, port: 3157 });
for (const f of daftar.split(",").map(Number)) {
  await renderStill({ composition: comp, serveUrl, frame: f, output: path.join(keluar, `f${String(f).padStart(4, "0")}.png`), port: 3157 });
  console.log(f);
}
