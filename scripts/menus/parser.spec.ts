import { describe, expect, it } from 'vitest';
import { parseMenu } from './parser';
import { decodeMenuBytes } from '../generate-menus';

describe('parseMenu', () => {
  it('preserva textos e ordem com CRLF e sem quebra final', () => {
    expect(parseMenu('# Título Á\r\n**Buffet Lages**\r\n\r\n## Carnes\r\n- Talharinho', 'a.md')).toEqual({
      slug: 'a',
      title: 'Título Á',
      categories: [{ name: 'Carnes', dishes: [{ name: 'Talharinho' }] }],
    });
  });

  it.each([
    ['texto inicial', 'a.md:1:'],
    ['# Título\n**Outro**\n', 'a.md:2:'],
    ['# Título\n**Buffet Lages**\n# Outro', 'a.md:3:'],
    ['# Título\n**Buffet Lages**\n- fora', 'a.md:3:'],
    ['# Título\n**Buffet Lages**\n## Vazia\n## Outra\n- item', 'a.md:4:'],
    ['# Título\n**Buffet Lages**\nlinha inválida', 'a.md:3:'],
  ])('rejeita Markdown inválido: %s', (text, message) => {
    expect(() => parseMenu(text, 'a.md')).toThrow(message);
  });

  it('rejeita BOM', () => {
    expect(() => parseMenu('\uFEFF# T\n**Buffet Lages**\n## A\n- B', 'a.md')).toThrow('a.md:1:');
  });

  it('rejeita bytes UTF-8 inválidos com arquivo e linha', () => {
    expect(() => decodeMenuBytes(Uint8Array.from([0xc3, 0x28]), 'a.md')).toThrow('a.md:1:');
  });
});
