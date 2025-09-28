#!/usr/bin/env node
// Pre-generate high-quality, non-progressive, optimized variants for site images.
// Requires: npm i -D sharp
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = new URL('..', import.meta.url).pathname;
const pub = path.join(root, 'public');
const outDir = path.join(pub, 'optimized');

/** Images to optimize (public-root relative) and target widths */
const targets = [
  { file: 'logo.png', widths: [320, 480, 640] },
  { file: 'pcb.png', widths: [320, 480, 640] },
  { file: 'timeline/note-2.png', widths: [320, 480] },
  { file: 'timeline/note-3.png', widths: [320, 480] },
  { file: 'timeline/note-4.png', widths: [320, 480] },
  { file: 'timeline/note-5.png', widths: [320, 480] },
  { file: 'sharenote-example.png', widths: [480, 640, 820, 1024] },
];

const ensure = async (p) => fs.mkdir(p, { recursive: true });
await ensure(outDir);

const pipeline = async (inputAbs, baseName, width) => {
  const base = `${baseName}-w${width}`;
  const avifOut = path.join(outDir, `${base}.avif`);
  const webpOut = path.join(outDir, `${base}.webp`);
  const pngOut = path.join(outDir, `${base}.png`);

  const common = sharp(inputAbs).resize({ width, withoutEnlargement: true, fit: 'inside' });
  // AVIF: visually lossless for UI, good compression
  await common.clone().avif({ quality: 60, effort: 4 }).toFile(avifOut);
  // WebP: broad support
  await common.clone().webp({ quality: 80 }).toFile(webpOut);
  // PNG fallback: non-interlaced to avoid progressive loading
  await common.clone().png({ compressionLevel: 9, adaptiveFiltering: false, progressive: false }).toFile(pngOut);
};

for (const t of targets) {
  const inputAbs = path.join(pub, t.file);
  const exists = await fs
    .access(inputAbs)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    console.warn(`[skip] ${t.file} not found`);
    continue;
  }
  const baseName = path.basename(t.file, path.extname(t.file));
  await Promise.all(t.widths.map((w) => pipeline(inputAbs, baseName, w)));
  console.log(`[ok] ${t.file} -> widths ${t.widths.join(', ')}`);
}

console.log(`Optimized images written to ${path.relative(root, outDir)}`);

