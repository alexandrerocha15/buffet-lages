import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';

describe('geração de ativos responsivos da marca', () => {
  it('redimensiona os PNGs oficiais sem perder transparência ou proporção', async () => {
    const output = mkdtempSync(join(tmpdir(), 'buffet-lages-brand-'));
    try {
      execFileSync(
        process.execPath,
        ['--experimental-strip-types', resolve('scripts/generate-brand-assets.ts'), output],
        { cwd: process.cwd(), stdio: 'pipe' },
      );

      for (const [filename, sourceFilename, maximum] of [
        ['logo-nav.png', 'logo-nav.png', 600],
        ['logo-chapel.png', 'logo-chapel.png', 96],
      ] as const) {
        const sourcePath = resolve(`assets/fotos/${sourceFilename}`);
        const sourceDigest = createHash('sha256').update(readFileSync(sourcePath)).digest('hex');
        const sourceMetadata = await sharp(sourcePath).metadata();
        const resultPath = join(output, 'brand', filename);
        const resultMetadata = await sharp(resultPath).metadata();
        expect(resultMetadata.width).toBeLessThanOrEqual(maximum);
        expect(resultMetadata.height).toBeLessThanOrEqual(maximum);
        expect(resultMetadata.hasAlpha).toBe(true);
        expect((resultMetadata.width ?? 0) / (resultMetadata.height ?? 1)).toBeCloseTo(
          (sourceMetadata.width ?? 0) / (sourceMetadata.height ?? 1),
          2,
        );
        expect(readFileSync(resultPath).length).toBeLessThan(readFileSync(sourcePath).length);
        expect(createHash('sha256').update(readFileSync(sourcePath)).digest('hex')).toBe(
          sourceDigest,
        );
      }
    } finally {
      rmSync(output, { recursive: true, force: true });
    }
  });
});
