/**
 * Generates app/favicon.ico and public/apple-icon.png using sharp.
 * Draws the Aurea "A" mark: gold #c9a84c on dark #0a0a0a, RGBA output.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── Colors ───────────────────────────────────────────────────────────────────
const BG = { r: 10,  g: 10,  b: 10,  a: 255 };
const FG = { r: 201, g: 168, b: 76,  a: 255 };

// ── Geometry helpers ─────────────────────────────────────────────────────────
function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function distToRect(px, py, rx, ry, rw, rh) {
  const cx = Math.max(rx, Math.min(rx + rw, px));
  const cy = Math.max(ry, Math.min(ry + rh, py));
  return Math.hypot(px - cx, py - cy);
}

function coverage(dist, halfStroke) {
  return Math.max(0, Math.min(1, halfStroke + 0.5 - dist));
}

/** Returns a raw RGBA Buffer for the Aurea "A" at the given size. */
function drawA(size) {
  const buf = Buffer.allocUnsafe(size * size * 4);
  const s   = size / 200; // scale from 200-unit design space
  const sw  = 16 * s;     // stroke width

  // Leg centerlines (design space → scaled)
  const ll = [100 * s, 18 * s, 62 * s, 174 * s];   // left leg
  const rl = [100 * s, 18 * s, 138 * s, 174 * s];  // right leg
  // Crossbar rect
  const [bx, by, bw, bh] = [70 * s, 108 * s, 60 * s, 10 * s];
  // Base serifs
  const [lsx, lsy, lsw, lsh] = [48 * s, 174 * s, 32 * s, 8 * s];
  const [rsx, rsy, rsw, rsh] = [120 * s, 174 * s, 32 * s, 8 * s];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = x + 0.5, cy = y + 0.5;
      const d = Math.min(
        distToSegment(cx, cy, ...ll),
        distToSegment(cx, cy, ...rl),
        distToRect(cx, cy, bx, by, bw, bh),
        distToRect(cx, cy, lsx, lsy, lsw, lsh),
        distToRect(cx, cy, rsx, rsy, rsw, rsh),
      );
      const a = coverage(d, sw / 2);
      const i = (y * size + x) * 4;
      buf[i]     = Math.round(FG.r * a + BG.r * (1 - a));
      buf[i + 1] = Math.round(FG.g * a + BG.g * (1 - a));
      buf[i + 2] = Math.round(FG.b * a + BG.b * (1 - a));
      buf[i + 3] = 255; // fully opaque RGBA
    }
  }
  return buf;
}

// ── ICO encoder (wraps a PNG blob, modern browsers accept PNG-in-ICO) ─────────
function encodeICO(pngBuf, size) {
  const header = Buffer.allocUnsafe(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type = 1 (ICO)
  header.writeUInt16LE(1, 4); // image count = 1

  const entry = Buffer.allocUnsafe(16);
  entry[0] = size === 256 ? 0 : size;
  entry[1] = size === 256 ? 0 : size;
  entry[2] = 0; entry[3] = 0;          // color count, reserved
  entry.writeUInt16LE(1, 4);            // planes
  entry.writeUInt16LE(32, 6);           // bit count
  entry.writeUInt32LE(pngBuf.length, 8);
  entry.writeUInt32LE(6 + 16, 12);      // data offset

  return Buffer.concat([header, entry, pngBuf]);
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  // 32×32 favicon
  console.log('Generating 32×32 favicon…');
  const raw32 = drawA(32);
  const png32 = await sharp(raw32, { raw: { width: 32, height: 32, channels: 4 } })
    .png()
    .toBuffer();
  const ico = encodeICO(png32, 32);
  fs.writeFileSync(path.join(ROOT, 'app', 'favicon.ico'), ico);
  console.log('  ✓ app/favicon.ico', ico.length, 'bytes');

  // 180×180 apple-icon
  console.log('Generating 180×180 apple-icon…');
  const raw180 = drawA(180);
  await sharp(raw180, { raw: { width: 180, height: 180, channels: 4 } })
    .png()
    .toFile(path.join(ROOT, 'public', 'apple-icon.png'));
  console.log('  ✓ public/apple-icon.png');

  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
