import type { EventDate, EventLocation, QuoteDetails, QuoteOrigin } from './quote-store';
import type { Dish, Menu } from '../models';

export function validEventDate(date: EventDate, today = new Date()): boolean {
  if (date.kind === 'unknown') return true;
  if (date.kind === 'defined') { const parsed = new Date(`${date.iso}T00:00:00`); return !Number.isNaN(parsed.getTime()) && parsed >= new Date(today.getFullYear(), today.getMonth(), today.getDate()); }
  return date.year > today.getFullYear() || (date.year === today.getFullYear() && date.month >= today.getMonth() + 1);
}
export function validEventLocation(location: EventLocation): boolean { return location.kind === 'unknown' || !!location.city.trim(); }
export function buildQuoteMessage(details: QuoteDetails, origin: QuoteOrigin, menu: Menu | null, dishes: readonly (Dish & { category: string })[], specials: readonly string[]): string {
  const date = details.date.kind === 'unknown' ? 'ainda não definida' : details.date.kind === 'defined' ? new Intl.DateTimeFormat('pt-BR').format(new Date(`${details.date.iso}T00:00:00`)) : new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(details.date.year, details.date.month - 1, 1)));
  const location = details.location.kind === 'unknown' ? 'ainda não definido' : [details.location.city, details.location.venue, details.location.address].filter(Boolean).join(' — ');
  const originText = origin === 'montado' ? 'Seleção montada pelo cliente' : `${menu?.title ?? 'Cardápio'} — ${origin === 'pronto' ? 'todos os itens' : 'versão personalizada'}`;
  const groups = new Map<string, string[]>(); for (const dish of dishes) groups.set(dish.category, [...(groups.get(dish.category) ?? []), dish.name]);
  return ['Olá! Gostaria de solicitar um orçamento para um evento.', '', `Nome: ${details.name.trim()}`, `Convidados (aproximados): ${details.guests}`, `Data: ${date}`, `Local: ${location}`, '', `Origem: ${originText}`, '', 'Itens:', ...[...groups].flatMap(([category, names]) => [category, ...names.map((name) => `- ${name}`)]), ...(specials.length ? ['', 'Pedidos especiais:', ...specials.map((item) => `- ${item}`)] : []), ...(details.notes.trim() ? ['', `Observações: ${details.notes.trim()}`] : []), '', 'Obs.: esta é uma solicitação de orçamento, não uma contratação. A disponibilidade e o valor serão avaliados pela equipe do buffet.'].join('\n');
}
export function buildWhatsAppUrl(number: string, message: string): string { return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`; }
