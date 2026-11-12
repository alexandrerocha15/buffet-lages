import type { Menu } from '../models';

export interface MenuSource {
  loadMenus(): Promise<readonly Menu[]>;
}
