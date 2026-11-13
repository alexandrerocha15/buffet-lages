import { Injectable, computed, signal } from '@angular/core';
import type { Menu, Dish } from '../models';
import type { CatalogCategory } from '../models';

export type QuoteOrigin = 'pronto' | 'personalizado' | 'montado';
export type QuoteStep = 'selection' | 'preview' | 'details' | 'review';
export type EventDate = { kind: 'defined'; iso: string } | { kind: 'approximate'; month: number; year: number } | { kind: 'unknown' };
export type EventLocation = { kind: 'defined'; city: string; venue?: string; address?: string } | { kind: 'unknown' };
export interface QuoteDetails { name: string; guests: string; date: EventDate; location: EventLocation; notes: string }

@Injectable({ providedIn: 'root' })
export class QuoteStore {
  readonly origin = signal<QuoteOrigin>('montado');
  readonly baseMenu = signal<Menu | null>(null);
  readonly dishes = signal<readonly (Dish & { category: string })[]>([]);
  readonly specials = signal<readonly string[]>([]);
  readonly details = signal<QuoteDetails>({ name: '', guests: '', date: { kind: 'unknown' }, location: { kind: 'unknown' }, notes: '' });
  readonly step = signal<QuoteStep>('selection');
  readonly canContinue = computed(() => this.dishes().length > 0 || this.specials().some((item) => item.trim().length > 0));

  startCustom(): void { this.origin.set('montado'); this.baseMenu.set(null); this.dishes.set([]); this.specials.set([]); this.step.set('selection'); }
  startMenu(menu: Menu, mode: 'pronto' | 'personalizado' = 'pronto'): void {
    this.origin.set(mode); this.baseMenu.set(menu);
    this.dishes.set(menu.categories.flatMap((category) => category.dishes.map((dish) => ({ ...dish, category: category.name }))));
    this.specials.set([]); this.step.set('selection');
  }
  toggleDish(dish: Dish, category: string): void {
    const key = `${category}\u0000${dish.name}`;
    this.dishes.update((items) => items.some((item) => `${item.category}\u0000${item.name}` === key)
      ? items.filter((item) => `${item.category}\u0000${item.name}` !== key)
      : [...items, { ...dish, category }]);
  }
  addSpecial(text: string): boolean { const value = text.trim(); if (!value) return false; this.specials.update((items) => [...items, value]); return true; }
  editSpecial(index: number, text: string): void { const value = text.trim(); this.specials.update((items) => items.map((item, i) => i === index ? value : item)); }
  removeSpecial(index: number): void { this.specials.update((items) => items.filter((_, i) => i !== index)); }
  groupedDishes(): readonly CatalogCategory[] {
    const groups = new Map<string, string[]>();
    for (const dish of this.dishes()) groups.set(dish.category, [...(groups.get(dish.category) ?? []), dish.name]);
    return [...groups].map(([name, dishes]) => ({ name, dishes: dishes.map((dish) => ({ key: dish, name: dish, menus: [] })) }));
  }
  hasData(): boolean { return this.canContinue() || !!this.details().name || !!this.details().guests; }
}
