export function hasOfficialWhatsAppNumber(source: string): boolean {
  const match = source.match(/whatsappNumber\s*:\s*['"](.*?)['"]/);
  return !!match?.[1] && /^\d{10,15}$/.test(match[1]);
}
