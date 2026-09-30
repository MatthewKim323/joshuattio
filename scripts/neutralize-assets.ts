/**
 * Swap third-party imagery for neutral stand-ins of identical dimensions, so layout never moves:
 * - company logos (customers, investors) become a generic mark + wordmark bar
 * - photos of real people listed in PEOPLE become a flat gradient
 * Files keep their names; only their content changes. Run with `bun scripts/neutralize-assets.ts`.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from '/Users/matthewkim/.claude/skills/1to1/node_modules/sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const IMG = path.join(ROOT, 'public', 'img');

// original file stems (before the content hash) that are company logos
const LOGO = /^(taskrabbit|granola|railway|wispr-flow|accel|mercury|modal|benchmark|replicate|google-ventures|listen|passionfroot|aiuc|a16z|snackpass|wordsmith|khosla|flatfile|firstround|turbopuffer|sequoia|lightspeed|redpoint|usv|parallel|obvious|ycombinator)([-._].*)?$/i;
// photos of real people, by harvested file name
const PEOPLE = ['img-543b0631ea.avif', 'img-741d02cc82.avif', 'img-ee359acccf.avif'];

// harvested name -> original name, from every capture manifest
const original = new Map<string, string>();
for (const d of fs.readdirSync(path.join(ROOT, 'reference'))) {
  const f = path.join(ROOT, 'reference', d, 'assets', 'manifest.json');
  if (!fs.existsSync(f)) continue;
  for (const a of JSON.parse(fs.readFileSync(f, 'utf8'))) original.set(path.basename(a.localPath), a.originalUrl.split('?')[0].split('/').pop());
}

function logoSvg(svg: string) {
  const vb = svg.match(/viewBox="([^"]+)"/)?.[1];
  const w = svg.match(/<svg[^>]*\swidth="([\d.]+)/)?.[1];
  const h = svg.match(/<svg[^>]*\sheight="([\d.]+)/)?.[1];
  const [x, y, vw, vh] = (vb ?? `0 0 ${w ?? 120} ${h ?? 24}`).split(/[\s,]+/).map(Number);
  const r = vh * 0.5;
  const size = w && h ? ` width="${w}" height="${h}"` : '';
  // square mark followed by a text-like bar, proportioned to the original box
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${vw} ${vh}"${size} fill="currentColor">`
    + `<rect x="${x}" y="${y + vh * 0.1}" width="${vh * 0.8}" height="${vh * 0.8}" rx="${r * 0.35}"/>`
    + `<rect x="${x + vh * 1.05}" y="${y + vh * 0.32}" width="${Math.max(vw - vh * 1.1, vh)}" height="${vh * 0.36}" rx="${vh * 0.18}"/></svg>`;
}

async function blank(file: string, kind: 'logo' | 'photo') {
  const meta = await sharp(file).metadata();
  const width = meta.width ?? 64, height = meta.height ?? 64;
  const svg = kind === 'photo'
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9dce1"/><stop offset="1" stop-color="#b7bcc4"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>`
    : logoSvg(`<svg viewBox="0 0 ${width} ${height}"></svg>`).replace('fill="currentColor"', 'fill="#1e1f24"');
  const img = sharp(Buffer.from(svg)).resize(width, height);
  const ext = path.extname(file).slice(1);
  const out = ext === 'avif' ? img.avif() : ext === 'webp' ? img.webp() : ext === 'jpg' || ext === 'jpeg' ? img.jpeg() : img.png();
  fs.writeFileSync(file, await out.toBuffer());
}

let logos = 0, photos = 0;
for (const name of fs.readdirSync(IMG)) {
  const file = path.join(IMG, name);
  if (PEOPLE.includes(name)) { await blank(file, 'photo'); photos++; continue; }
  const orig = original.get(name);
  if (!orig || !LOGO.test(orig)) continue;
  // company cover photos (offices, billboards) get the photo treatment, not a logo mark
  if (/cover|photo|office|team/i.test(orig) && !name.endsWith('.svg')) { await blank(file, 'photo'); photos++; continue; }
  if (name.endsWith('.svg')) fs.writeFileSync(file, logoSvg(fs.readFileSync(file, 'utf8')));
  else await blank(file, 'logo');
  logos++;
}
console.log(`logos ${logos}, photos ${photos}`);
