import type { Category, Menu } from '../../src/app/core/models/menu.model';

function fail(sourceName: string, line: number, message: string): never {
  throw new Error(`${sourceName}:${line}: ${message}`);
}

export function parseMenu(text: string, sourceName: string): Menu {
  const normalized = text.replace(/\r\n?/g, '\n');
  if (normalized.startsWith('\uFEFF')) fail(sourceName, 1, 'BOM UTF-8 não é permitido.');
  const lines = normalized.split('\n');
  if (!lines[0]?.startsWith('# ')) fail(sourceName, 1, 'Esperado um único título H1 na primeira linha.');

  const title = lines[0].slice(2);
  if (!title.trim() || title !== title.trim()) fail(sourceName, 1, 'Título H1 vazio ou com espaços externos.');
  if (lines[1] !== '**Buffet Lages**') fail(sourceName, 2, 'Esperado o subtítulo **Buffet Lages**.');

  const slug = sourceName.replace(/\\/g, '/').split('/').pop()!.replace(/\.md$/i, '');
  const categories: Category[] = [];
  let categoryName: string | undefined;
  let dishes: { name: string }[] = [];
  const finishCategory = (line: number) => {
    if (categoryName === undefined) return;
    if (dishes.length === 0) fail(sourceName, line, `A categoria “${categoryName}” não possui pratos.`);
    categories.push({ name: categoryName, dishes });
    categoryName = undefined;
    dishes = [];
  };

  for (let index = 2; index < lines.length; index++) {
    const line = lines[index];
    if (line === '') continue;
    if (line.startsWith('# ')) fail(sourceName, index + 1, 'Mais de um título H1 não é permitido.');
    if (line.startsWith('## ')) {
      finishCategory(index + 1);
      categoryName = line.slice(3);
      if (!categoryName.trim() || categoryName !== categoryName.trim()) {
        fail(sourceName, index + 1, 'Nome de categoria vazio ou com espaços externos.');
      }
      continue;
    }
    if (line.startsWith('- ')) {
      if (categoryName === undefined) fail(sourceName, index + 1, 'Prato encontrado fora de uma categoria.');
      const name = line.slice(2);
      if (!name.trim() || name !== name.trim()) fail(sourceName, index + 1, 'Nome de prato inválido.');
      dishes.push({ name });
      continue;
    }
    fail(sourceName, index + 1, 'Formato inválido; use cabeçalhos H2 e itens “- ”.');
  }
  finishCategory(lines.length);
  if (categories.length === 0) fail(sourceName, 3, 'O cardápio precisa conter ao menos uma categoria.');
  return { slug, title, categories };
}
