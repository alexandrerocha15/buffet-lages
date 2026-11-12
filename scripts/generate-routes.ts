import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { menus } from '../src/app/content/menus.generated.ts';

export interface RouteMenu {
  readonly slug: string;
}

export function buildMenuRoutes(menuList: readonly RouteMenu[]): readonly string[] {
  const slugs = menuList.map((menu) => menu.slug);
  if (new Set(slugs).size !== slugs.length) throw new Error('Slug duplicado na lista de rotas.');
  return [...slugs].sort((left, right) => left.localeCompare(right, 'pt-BR'));
}

export function generateRoutes(root = process.cwd(), menuList: readonly RouteMenu[] = menus): string {
  const menuRoutes = buildMenuRoutes(menuList);
  const output = `// Gerado automaticamente por scripts/generate-routes.ts. Não edite.\nexport const menuRoutes = ${JSON.stringify(menuRoutes, null, 2)} as const;\n`;
  mkdirSync(resolve(root, 'src/app/content'), { recursive: true });
  writeFileSync(resolve(root, 'src/app/content/routes.generated.ts'), output.replace(/\r\n/g, '\n'), 'utf8');
  return output;
}

if (process.argv[1]?.replaceAll('\\', '/').endsWith('/scripts/generate-routes.ts')) {
  try {
    generateRoutes();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
