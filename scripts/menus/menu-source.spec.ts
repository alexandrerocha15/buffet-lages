import { describe, expect, it } from 'vitest';
import { StaticMenuSource } from '../../src/app/core/content/static-menu-source';

describe('StaticMenuSource', () => {
  it('resolve os cardápios gerados na ordem e com o conteúdo preservado', async () => {
    const menus = await new StaticMenuSource().loadMenus();
    expect(menus.map(({ slug }) => slug)).toEqual(['churrasco', 'contemporaneo', 'italiano']);
    expect(menus[0].categories[0].dishes[0].name).toBe('Carne bovina na churrasqueira');
  });
});
