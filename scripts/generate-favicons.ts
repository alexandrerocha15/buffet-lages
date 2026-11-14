import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const source = resolve('assets/fotos/logo-chapel.png');
const outputDirectory = resolve(process.argv[2] ?? 'public');
const pngSizes = [16, 32, 48, 180];
const icoSizes = [16, 32, 48];

function createIco(images: Buffer[], sizes: number[]): Buffer {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let imageOffset = header.length;
  images.forEach((image, index) => {
    const entryOffset = 6 + index * 16;
    header.writeUInt8(sizes[index] === 256 ? 0 : sizes[index], entryOffset);
    header.writeUInt8(sizes[index] === 256 ? 0 : sizes[index], entryOffset + 1);
    header.writeUInt8(0, entryOffset + 2);
    header.writeUInt8(0, entryOffset + 3);
    header.writeUInt16LE(1, entryOffset + 4);
    header.writeUInt16LE(32, entryOffset + 6);
    header.writeUInt32LE(image.length, entryOffset + 8);
    header.writeUInt32LE(imageOffset, entryOffset + 12);
    imageOffset += image.length;
  });

  return Buffer.concat([header, ...images]);
}

await mkdir(outputDirectory, { recursive: true });
const original = await readFile(source);
const pngs = new Map<number, Buffer>();

for (const size of pngSizes) {
  const png = await sharp(original)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const filename = size === 180 ? 'apple-touch-icon.png' : `favicon-${size}x${size}.png`;
  await writeFile(resolve(outputDirectory, filename), png);
  if (icoSizes.includes(size)) pngs.set(size, png);
}

const ico = createIco(
  icoSizes.map((size) => pngs.get(size)!),
  icoSizes,
);
const icoPath = resolve(outputDirectory, 'favicon.ico');
await mkdir(dirname(icoPath), { recursive: true });
await writeFile(icoPath, ico);

console.log(`Favicons gerados em ${outputDirectory}`);
