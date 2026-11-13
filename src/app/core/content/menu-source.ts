import { InjectionToken } from '@angular/core';
import type { CatalogCategory, Menu } from '../models';

export interface MenuSource {
  loadMenus(): Promise<readonly Menu[]>;
  loadCatalog(): Promise<readonly CatalogCategory[]>;
}

export const MENU_SOURCE = new InjectionToken<MenuSource>('MenuSource');
