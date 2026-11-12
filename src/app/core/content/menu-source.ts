import { InjectionToken } from '@angular/core';
import type { Menu } from '../models';

export interface MenuSource {
  loadMenus(): Promise<readonly Menu[]>;
}

export const MENU_SOURCE = new InjectionToken<MenuSource>('MenuSource');
