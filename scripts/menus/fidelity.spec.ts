import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { catalog, menus } from '../../src/app/content/menus.generated';
import type { CatalogCategory, Menu } from '../../src/app/core/models';

const sourceDir = resolve(process.cwd(), 'assets/cardapios');
const originalFiles = readdirSync(sourceDir).filter((file) => file.endsWith('.md')).sort();
const sourceMenus: readonly Menu[] = menus;
const sourceCatalog: readonly CatalogCategory[] = catalog;

function extractOriginal(text: string, filename: string): { title: string; filename: string; categories: { name: string; dishes: string[] }[] } {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const extracted: { title: string; filename: string; categories: { name: string; dishes: string[] }[] }[] = [];
  let category: { name: string; dishes: string[] } | undefined;
  for (const line of lines) {
    if (line.startsWith('# ')) extracted.push({ title: line.slice(2), filename, categories: [] as typeof extracted[number]['categories'] });
    else if (line.startsWith('## ')) {
      category = { name: line.slice(3), dishes: [] };
      extracted.at(-1)?.categories.push(category);
    } else if (line.startsWith('- ')) category?.dishes.push(line.slice(2));
  }
  return extracted[0];
}

describe('fidelidade dos cardápios', () => {
  it('preserva títulos, categorias, itens, ordem e ocorrências da fonte Markdown', () => {
    const extracted = originalFiles.map((file) => extractOriginal(readFileSync(resolve(sourceDir, file), 'utf8'), file));
    expect(sourceMenus.map(({ title, slug, categories }) => ({
      title,
      slug,
      categories: categories.map(({ name, dishes }) => ({ name, dishes: dishes.map(({ name: dish }) => dish) })),
    }))).toEqual(extracted.map(({ title, filename, categories }) => ({
      title,
      slug: filename.replace(/\.md$/, ''),
      categories,
    })));

    const occurrences = extracted.flatMap(({ categories }) => categories.flatMap(({ dishes }) => dishes));
    expect(sourceMenus.flatMap(({ categories }) => categories.flatMap(({ dishes }) => dishes))).toHaveLength(occurrences.length);
    const catalogDishes = sourceCatalog.flatMap(({ dishes }) => dishes);
    expect(new Set(catalogDishes.map(({ key }) => key)).size).toBe(catalogDishes.length);
    for (const dish of catalogDishes) {
      const expectedMenus = sourceMenus
        .filter(({ categories }) => categories.some(({ dishes }) => dishes.some(({ name }) =>
          name.trim().toLowerCase().replace(/\s+/g, ' ') === dish.key,
        )))
        .map(({ slug }) => slug);
      expect(dish.menus).toEqual(expectedMenus);
    }
  });
});
