import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';

describe('geração dos favicons oficiais', () => {
  it('gera PNGs transparentes e ICO multi-resolução usando o chapéu oficial', async () => {
    const output = mkdtempSync(join(tmpdir(), 'buffet-lages-favicons-'));
    try {
      execFileSync(
        process.execPath,
        ['--experimental-strip-types', resolve('scripts/generate-favicons.ts'), output],
        { cwd: process.cwd(), stdio: 'pipe' },
      );

      for (const [filename, size] of [
        ['favicon-16x16.png', 16],
        ['favicon-32x32.png', 32],
        ['favicon-48x48.png', 48],
        ['apple-touch-icon.png', 180],
      ] as const) {
        const image = sharp(join(output, filename));
        const metadata = await image.metadata();
        expect(metadata.width).toBe(size);
        expect(metadata.height).toBe(size);
        expect(metadata.hasAlpha).toBe(true);
      }

      const ico = readFileSync(join(output, 'favicon.ico'));
      expect(ico.readUInt16LE(0)).toBe(0);
      expect(ico.readUInt16LE(2)).toBe(1);
      expect(ico.readUInt16LE(4)).toBe(3);
      for (let index = 0; index < 3; index += 1) {
        const entry = 6 + index * 16;
        const width = ico.readUInt8(entry) || 256;
        const offset = ico.readUInt32LE(entry + 12);
        expect(width).toBe([16, 32, 48][index]);
        expect(ico.subarray(offset, offset + 8).toString('hex')).toBe('89504e470d0a1a0a');
      }
    } finally {
      rmSync(output, { recursive: true, force: true });
    }
  });
});
