export function normalizeDishKey(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}
