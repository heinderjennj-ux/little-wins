// Render banyak Still sekaligus (satu kali bundle). Pakai: node scripts/render_stills.mjs <awalan id> <folder keluar> [id1,id2,...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const [awalan, keluar, pilih] = process.argv.slice(2);
fs.mkdirSync(keluar, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const { getCompositions } = await import("@remotion/renderer");
const semua = (await getCompositions(serveUrl, { port: 3159 })).filter((c) => c.id.startsWith(awalan) && (!pilih || pilih.split(",").includes(c.id)));
for (const c of semua) {
  const comp = await selectComposition({ serveUrl, id: c.id, port: 3159 });
  await renderStill({ composition: comp, serveUrl, output: path.join(keluar, `${c.id}.png`), port: 3159 });
  console.log(c.id);
}
