import { describe, expect, it } from 'vitest';
import { QuoteStore } from './quote-store';
import type { Menu } from '../models';

const menu: Menu = { slug: 'italiano', title: 'Cardápio Italiano', categories: [{ name: 'Massas', dishes: [{ name: 'Ravioli' }] }] };
describe('QuoteStore', () => {
  it('initializes menu dishes and preserves state while stepping back and forward', () => {
    const store = new QuoteStore(); store.startMenu(menu); store.addSpecial(' opção vegana ');
    store.step.set('preview'); store.step.set('selection');
    expect(store.dishes().map((dish) => dish.name)).toEqual(['Ravioli']);
    expect(store.specials()).toEqual(['opção vegana']);
  });
  it('requires a catalog dish or a nonblank special request', () => {
    const store = new QuoteStore();
    expect(store.canContinue()).toBe(false);
    expect(store.addSpecial('   ')).toBe(false);
    expect(store.canContinue()).toBe(false);
    expect(store.addSpecial('  sem lactose  ')).toBe(true);
    expect(store.canContinue()).toBe(true);
    store.removeSpecial(0); store.toggleDish({ name: 'Ravioli' }, 'Massas');
    expect(store.canContinue()).toBe(true);
  });
  it('edits special requests in place and keeps blank edits invalid for continuation', () => {
    const store = new QuoteStore();
    store.addSpecial('Menu vegano');
    store.editSpecial(0, ' Menu vegetariano ');
    expect(store.specials()).toEqual(['Menu vegetariano']);
    expect(store.canContinue()).toBe(true);
    store.editSpecial(0, '   ');
    expect(store.specials()).toEqual(['']);
    expect(store.canContinue()).toBe(false);
  });
});
