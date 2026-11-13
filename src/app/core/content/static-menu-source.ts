import { catalog, menus } from '../../content/menus.generated';
import type { Menu } from '../models';
import type { MenuSource } from './menu-source';

export class StaticMenuSource implements MenuSource {
  loadMenus(): Promise<readonly Menu[]> {
    return Promise.resolve(menus);
  }

  loadCatalog() {
    return Promise.resolve(catalog);
  }
}
