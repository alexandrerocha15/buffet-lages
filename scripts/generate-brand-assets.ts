import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';

const outputRoot = resolve(process.argv[2] ?? 'public');
const assets = [
  { source: 'assets/fotos/logo-nav.png', output: 'logo-nav.png', width: 600, height: 455 },
  {
    source: 'assets/fotos/logo-chapel.png',
    output: 'logo-chapel.png',
    width: 96,
    height: 73,
  },
];

await mkdir(resolve(outputRoot, 'brand'), { recursive: true });
for (const asset of assets) {
  const image = await sharp(await readFile(resolve(asset.source)))
    .resize(asset.width, asset.height, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();
  await writeFile(resolve(outputRoot, 'brand', asset.output), image);
}

console.log(`Ativos otimizados da marca gerados em ${resolve(outputRoot, 'brand')}`);
