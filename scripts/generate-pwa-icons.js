/**
 * Generates PWA icons (192x192 and 512x512) using sharp.
 * Dark background (#0a0a0a) with a gold "A" lettermark (#c9a84c).
 */

const sharp = require("sharp");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "../public");

// SVG: dark square background + gold italic "A" lettermark
function makeSvg(size) {
  const fontSize = Math.round(size * 0.55);
  const letterY = Math.round(size * 0.72);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#0a0a0a" rx="${Math.round(size * 0.12)}"/>
  <text
    x="50%"
    y="${letterY}"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${fontSize}"
    font-style="italic"
    font-weight="400"
    fill="#c9a84c"
    letter-spacing="-2"
  >A</text>
</svg>`;
}

async function generate(size, filename) {
  const svg = Buffer.from(makeSvg(size));
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(path.join(OUTPUT_DIR, filename));
  console.log(`Generated ${filename} (${size}x${size})`);
}

(async () => {
  await generate(192, "icon-192.png");
  await generate(512, "icon-512.png");
  console.log("PWA icons generated successfully.");
})();
