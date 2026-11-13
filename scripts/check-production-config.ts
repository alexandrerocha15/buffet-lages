import { readFile } from 'node:fs/promises';
import { hasOfficialWhatsAppNumber } from './production-config.ts';

const env = await readFile(new URL('../src/environments/environment.production.ts', import.meta.url), 'utf8');
if (!hasOfficialWhatsAppNumber(env)) {
  console.error('Build de produção bloqueado: configure o número oficial (10 a 15 dígitos) em environment.production.ts e remova o placeholder.');
  process.exit(1);
}
