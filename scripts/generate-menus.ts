import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseMenu } from './menus/parser.ts';
import { deriveCatalog } from './menus/catalog.ts';

export function generateMenus(root = process.cwd()): string {
  const sourceDir = resolve(root, 'assets/cardapios');
  const files = readdirSync(sourceDir).filter((file) => file.endsWith('.md')).sort();
  if (files.length === 0) throw new Error(`Nenhum arquivo Markdown encontrado em ${sourceDir}.`);
  const slugs = new Set<string>();
  const menus = files.map((file) => {
    const slug = file.slice(0, -3);
    if (slugs.has(slug)) throw new Error(`Slug duplicado: ${slug}.`);
    slugs.add(slug);
    const text = decodeMenuBytes(readFileSync(resolve(sourceDir, file)), file);
    return parseMenu(text, file);
  });
  const catalog = deriveCatalog(menus);
  const output = `// Gerado automaticamente por scripts/generate-menus.ts. Não edite.\nimport type { CatalogCategory, Menu } from '../core/models';\n\nexport const menus = ${JSON.stringify(menus, null, 2)} as const satisfies readonly Menu[];\n\nexport const catalog = ${JSON.stringify(catalog, null, 2)} as const satisfies readonly CatalogCategory[];\n`;
  mkdirSync(resolve(root, 'src/app/content'), { recursive: true });
  writeFileSync(resolve(root, 'src/app/content/menus.generated.ts'), output.replace(/\r\n/g, '\n'), 'utf8');
  return output;
}

export function decodeMenuBytes(bytes: Uint8Array, sourceName: string): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    throw new Error(`${sourceName}:1: arquivo não contém UTF-8 válido.`);
  }
}

if (process.argv[1]?.replaceAll('\\', '/').endsWith('/scripts/generate-menus.ts')) {
  try {
    generateMenus();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
