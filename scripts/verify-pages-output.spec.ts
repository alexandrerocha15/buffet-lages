import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { menuRoutes } from '../src/app/content/routes.generated.ts';

const temporaryRoots: string[] = [];
const verifier = resolve('scripts/verify-pages-output.ts');
const prefix = '/buffet-lages';
const routes = ['/', '/montar', '/orcamento', ...menuRoutes.map((slug) => `/cardapios/${slug}`)];

function createOutput(): string {
  const root = mkdtempSync(join(tmpdir(), 'github-pages-output-'));
  temporaryRoots.push(root);
  const browser = join(root, 'dist/buffet-lages/browser');
  const routeMap: Record<string, object> = {};

  for (const route of routes) {
    const deployedRoute = route === '/' ? prefix : `${prefix}${route}`;
    routeMap[deployedRoute] = {};
    const relativePath = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`;
    const pagePath = join(browser, relativePath);
    mkdirSync(join(pagePath, '..'), { recursive: true });
    writeFileSync(
      pagePath,
      `<html><head><base href="${prefix}/"></head><body><a href="${prefix}/orcamento">Orçamento</a></body></html>`,
    );
  }

  const manifestPath = join(root, 'dist/buffet-lages/prerendered-routes.json');
  mkdirSync(join(manifestPath, '..'), { recursive: true });
  writeFileSync(manifestPath, JSON.stringify({ routes: routeMap }));
  return root;
}

function runVerifier(root: string) {
  return spawnSync(process.execPath, ['--experimental-strip-types', verifier], {
    cwd: root,
    encoding: 'utf8',
  });
}

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('verify-pages-output', () => {
  it('aceita todas as rotas pré-renderizadas sob o prefixo do projeto', () => {
    const result = runVerifier(createOutput());
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('6 rotas pré-renderizadas');
  });

  it('falha quando falta uma rota ou seu HTML', () => {
    const root = createOutput();
    const manifestPath = join(root, 'dist/buffet-lages/prerendered-routes.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
      routes: Record<string, object>;
    };
    delete manifest.routes[`${prefix}/orcamento`];
    writeFileSync(manifestPath, JSON.stringify(manifest));

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Rota ausente no manifesto de prerender: /orcamento');
  });

  it('falha quando um link interno ou recurso ignora o prefixo publicado', () => {
    const root = createOutput();
    const homePath = join(root, 'dist/buffet-lages/browser/index.html');
    writeFileSync(
      homePath,
      `<html><head><base href="${prefix}/"></head><body><a href="/orcamento">Orçamento</a><img src="/img/foto.webp"></body></html>`,
    );

    const result = runVerifier(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Recurso fora da base /buffet-lages/');
    expect(result.stderr).toContain('Link interno fora da base /buffet-lages/');
  });
});
