import { readFile } from 'node:fs/promises';

const paths = [
  'src/app/core/quote/quote-store.ts',
  'src/app/core/quote/whatsapp.ts',
  'src/app/features/orcamento/orcamento.ts',
];
const forbidden = [
  ['persistência local', /\b(?:localStorage|sessionStorage|indexedDB)\b|document\.cookie/],
  ['chamada HTTP própria', /\b(?:HttpClient|fetch|XMLHttpRequest|sendBeacon)\b/],
  ['endpoint/backend próprio', /https?:\/\/(?!wa\.me)/],
] as const;
const failures: string[] = [];
for (const path of paths) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  for (const [description, pattern] of forbidden) if (pattern.test(source)) failures.push(`${path}: encontrada ${description}`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Auditoria estática OK: ${paths.length} arquivos de domínio/UI sem armazenamento persistente, HTTP próprio ou endpoint/backend.`);
}
