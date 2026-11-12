import { describe, expect, it } from 'vitest';
import { deriveCatalog } from './catalog';
import { normalizeDishKey } from '../../src/app/core/models/normalize-dish-key';

describe('normalizeDishKey', () => {
  it('normaliza espaços e caixa, preservando acentos e palavras distintas', () => {
    expect(normalizeDishKey('  SALADA   de   maçã ')).toBe('salada de maçã');
    expect(normalizeDishKey('salada de maca')).not.toBe(normalizeDishKey('salada de maçã'));
    expect(normalizeDishKey('carne assada')).not.toBe(normalizeDishKey('carne recheada'));
  });
});

describe('deriveCatalog', () => {
  const menus = [
    { slug: 'a', title: 'A', categories: [{ name: 'Carnes', dishes: [{ name: 'Bife' }, { name: 'Arroz' }] }] },
    { slug: 'b', title: 'B', categories: [{ name: 'Carnes', dishes: [{ name: ' bIFE ' }] }] },
  ] as const;

  it('deduplica preservando a primeira ocorrência e os slugs', () => {
    expect(deriveCatalog(menus)[0].dishes).toEqual([
      { key: 'bife', name: 'Bife', menus: ['a', 'b'] },
      { key: 'arroz', name: 'Arroz', menus: ['a'] },
    ]);
  });

  it('falha quando a chave normalizada aparece em categorias diferentes', () => {
    expect(() => deriveCatalog([
      menus[0],
      { slug: 'c', title: 'C', categories: [{ name: 'Acompanhamentos', dishes: [{ name: 'Bife' }] }] },
    ])).toThrow('Bife');
  });
});
