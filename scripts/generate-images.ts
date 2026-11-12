import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';

const widths = [400, 800, 1200, 1600];
const formats = ['webp', 'avif'] as const;

const qualityLadders = {
  avif: [48, 42, 36, 30, 26, 22],
  webp: [72, 64, 56, 48, 40, 32],
} as const;

// A fotografia do hero é o elemento LCP: usa uma escada mais enxuta que as demais.
const heroQualityLadders = {
  avif: [26, 22, 18, 14],
  webp: [56, 48, 40, 32],
};

function encoderOptions(format: 'webp' | 'avif', quality: number): Record<string, unknown> {
  return format === 'avif'
    ? { quality, effort: 7, chromaSubsampling: '4:4:4' }
    : { quality, effort: 6 };
}

export async function generateImages(root = process.cwd()): Promise<void> {
  const source = resolve(root, 'assets/fotos');
  const destination = resolve(root, 'public/img');
  mkdirSync(destination, { recursive: true });
  const photos = readdirSync(source).filter((name) => name.endsWith('.png')).sort();
  if (photos.length === 0) throw new Error('Nenhuma fotografia encontrada em assets/fotos.');

  const manifest: Record<string, { width: number; height: number; files: Record<string, string> }> = {};

  for (const photo of photos) {
    const id = photo.slice(0, -4);
    const input = resolve(source, photo);
    const metadata = await sharp(input).metadata();
    if (!metadata.width || !metadata.height) throw new Error(`Dimensões ausentes: ${photo}`);
    const files: Record<string, string> = {};

    for (const width of widths.filter((value) => value <= metadata.width!)) {
      for (const format of formats) {
        const filename = `${id}-${width}.${format}`;
        const output = resolve(destination, filename);
        const budget = id === 'mesa-frios' ? 200_000 : 150_000;
        let achieved = false;
        const ladder = id === 'mesa-frios' ? heroQualityLadders[format] : qualityLadders[format];
        for (const quality of ladder) {
          await sharp(input)
            .resize({ width })
            .toFormat(format, encoderOptions(format, quality))
            .toFile(output);
          if (statSync(output).size <= budget) {
            achieved = true;
            break;
          }
        }
        if (!achieved) throw new Error(`${filename} excede o orçamento de ${budget} bytes.`);
        files[`${width}.${format}`] = filename;
      }
    }

    manifest[id] = { width: metadata.width, height: metadata.height, files };
  }

  writeFileSync(resolve(destination, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
}

if (process.argv[1]?.replaceAll('\\', '/').endsWith('/scripts/generate-images.ts')) {
  generateImages().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
}
