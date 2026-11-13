import { describe, expect, it } from 'vitest';
import { buildQuoteMessage, buildWhatsAppUrl, validEventDate, validEventLocation } from './whatsapp';
import type { QuoteDetails } from './quote-store';

const base: QuoteDetails = { name: 'João', guests: '40', date: { kind: 'unknown' }, location: { kind: 'unknown' }, notes: 'Sem açúcar\npor favor' };
describe('quote validation and WhatsApp message', () => {
  it('validates date states without timezone day shifts and requires city only for a defined location', () => {
    expect(validEventDate({ kind: 'defined', iso: '2030-03-15' }, new Date(2030, 0, 1))).toBe(true);
    expect(validEventDate({ kind: 'approximate', month: 1, year: 2029 }, new Date(2030, 0, 1))).toBe(false);
    expect(validEventDate({ kind: 'unknown' })).toBe(true);
    expect(validEventLocation({ kind: 'defined', city: '  ' })).toBe(false);
    expect(validEventLocation({ kind: 'unknown' })).toBe(true);
  });
  it('preserves accents and line breaks and URL-encodes the organized message', () => {
    const message = buildQuoteMessage(base, 'montado', null, [{ name: 'Galeto', category: 'Carnes' }], ['Opção vegana']);
    expect(message).toContain('Nome: João'); expect(message).toContain('Sem açúcar\npor favor');
    expect(message).toContain('Pedidos especiais:\n- Opção vegana');
    expect(buildWhatsAppUrl('+55 (49) 99999-0000', message)).toContain('https://wa.me/5549999990000?text=');
    expect(message).not.toContain('R$');
  });
  it('normalizes the official WhatsApp number to the international digits-only format', () => {
    expect(buildWhatsAppUrl('5549991014293', 'Solicitação')).toMatch(/^https:\/\/wa\.me\/5549991014293\?text=/);
  });
});
