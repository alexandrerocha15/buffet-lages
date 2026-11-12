import type { CatalogCategory, CatalogDish, Menu } from '../../src/app/core/models';
import { normalizeDishKey } from '../../src/app/core/models/normalize-dish-key.ts';

export function deriveCatalog(menus: readonly Menu[]): readonly CatalogCategory[] {
  const categories = new Map<string, { name: string; dishes: CatalogDish[] }>();
  const owners = new Map<string, { category: string; name: string }>();

  for (const menu of menus) {
    for (const category of menu.categories) {
      let target = categories.get(category.name);
      if (!target) {
        target = { name: category.name, dishes: [] };
        categories.set(category.name, target);
      }
      for (const dish of category.dishes) {
        const key = normalizeDishKey(dish.name);
        const owner = owners.get(key);
        if (owner && owner.category !== category.name) {
          throw new Error(`Conflito para “${dish.name}”: categorias “${owner.category}” e “${category.name}”.`);
        }
        const existing = target.dishes.find((entry) => entry.key === key);
        if (existing) {
          if (!existing.menus.includes(menu.slug)) {
            target.dishes[target.dishes.indexOf(existing)] = {
              ...existing,
              menus: [...existing.menus, menu.slug],
            };
          }
        } else {
          target.dishes.push({ key, name: dish.name, menus: [menu.slug] });
          owners.set(key, { category: category.name, name: dish.name });
        }
      }
    }
  }
  return [...categories.values()];
}
