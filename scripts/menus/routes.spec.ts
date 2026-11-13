import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { menus } from '../../src/app/content/menus.generated.ts';
import { menuRoutes } from '../../src/app/content/routes.generated.ts';
import { buildMenuRoutes, generateRoutes } from '../generate-routes';

const temporaryRoots: string[] = [];

function createRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'routes-pipeline-'));
  temporaryRoots.push(root);
  return root;
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('generateRoutes', () => {
  it('gera uma rota por slug do catálogo, de forma determinística', () => {
    const root = createRoot();
    const fixture = [{ slug: 'italiano' }, { slug: 'churrasco' }, { slug: 'contemporaneo' }];
    const first = generateRoutes(root, fixture);
    expect(buildMenuRoutes(fixture)).toEqual(['churrasco', 'contemporaneo', 'italiano']);
    expect(readFileSync(join(root, 'src/app/content/routes.generated.ts'), 'utf8')).toBe(first);
    expect(generateRoutes(root, fixture)).toBe(first);
  });

  it('rejeita slugs duplicados', () => {
    expect(() => buildMenuRoutes([{ slug: 'italiano' }, { slug: 'italiano' }])).toThrow('duplicado');
  });

  it('mantém a lista de rotas igual ao catálogo de cardápios', () => {
    const catalogSlugs = menus.map((menu) => menu.slug).sort((left, right) => left.localeCompare(right, 'pt-BR'));
    expect([...menuRoutes]).toEqual(catalogSlugs);
  });
});
