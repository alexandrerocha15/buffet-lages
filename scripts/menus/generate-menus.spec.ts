import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { generateMenus } from '../generate-menus';

const temporaryRoots: string[] = [];

function createRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'menus-pipeline-'));
  temporaryRoots.push(root);
  mkdirSync(join(root, 'assets/cardapios'), { recursive: true });
  return root;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('generateMenus', () => {
  it('valida tudo antes de gravar saída e cria saída válida determinística', () => {
    const root = createRoot();
    const input = join(root, 'assets/cardapios/a.md');
    writeFileSync(input, '# A\n**Buffet Lages**\n## Carnes\n- Bife', 'utf8');
    const first = generateMenus(root);
    expect(readFileSync(join(root, 'src/app/content/menus.generated.ts'), 'utf8')).toBe(first);
    expect(generateMenus(root)).toBe(first);

    writeFileSync(join(root, 'assets/cardapios/b.md'), Uint8Array.from([0xc3, 0x28]));
    expect(() => generateMenus(root)).toThrow('b.md:1:');
    expect(readFileSync(join(root, 'src/app/content/menus.generated.ts'), 'utf8')).toBe(first);
  });
});
