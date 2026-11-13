import { describe, expect, it } from 'vitest';
import { hasOfficialWhatsAppNumber } from './production-config';

describe('production WhatsApp configuration gate', () => {
  it('accepts an official-looking configured number and rejects missing or placeholder values', () => {
    expect(hasOfficialWhatsAppNumber("export const environment = { whatsappNumber: '5549991014293' };" )).toBe(true);
    expect(hasOfficialWhatsAppNumber("export const environment = { whatsappNumber: '5549999990000' };")).toBe(true);
    expect(hasOfficialWhatsAppNumber("export const environment = { whatsappNumber: 'WHATSAPP_PENDENTE' };")).toBe(false);
    expect(hasOfficialWhatsAppNumber('export const environment = {};')).toBe(false);
    expect(hasOfficialWhatsAppNumber("whatsappNumber: '123'")).toBe(false);
  });
});
