import { existsSync, readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { menuRoutes } from '../src/app/content/routes.generated.ts';

const outputRoot = resolve('dist/buffet-lages/browser');
const routesManifest = resolve('dist/buffet-lages/prerendered-routes.json');
const baseHref = '/buffet-lages/';
const deployedRoot = baseHref.slice(0, -1);
const errors: string[] = [];

if (!existsSync(routesManifest)) {
  throw new Error(`Manifesto de prerender não encontrado: ${routesManifest}`);
}

const manifest = JSON.parse(readFileSync(routesManifest, 'utf8')) as {
  routes?: Record<string, unknown>;
};
const generatedRoutes = new Set(
  Object.keys(manifest.routes ?? {}).map((route) => {
    if (route === deployedRoot || route === baseHref) return '/';
    return route.startsWith(baseHref) ? `/${route.slice(baseHref.length)}` : route;
  }),
);
const requiredRoutes = [
  '/',
  '/montar',
  '/orcamento',
  ...menuRoutes.map((slug) => `/cardapios/${slug}`),
];

for (const route of requiredRoutes) {
  if (!generatedRoutes.has(route)) errors.push(`Rota ausente no manifesto de prerender: ${route}`);

  const relativePath = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`;
  const pagePath = resolve(outputRoot, relativePath);
  if (!existsSync(pagePath)) {
    errors.push(`HTML pré-renderizado ausente para ${route}: ${pagePath}`);
    continue;
  }

  const html = readFileSync(pagePath, 'utf8');
  if (!new RegExp(`<base\\s+href=["']${baseHref.replaceAll('/', '\\/')}["']`, 'i').test(html)) {
    errors.push(`Base href incorreto ou ausente em ${relativePath}; esperado ${baseHref}`);
  }

  for (const tagMatch of html.matchAll(/<(script|img|source|link)\b([^>]*)>/gi)) {
    const tagName = tagMatch[1]?.toLowerCase();
    const attributes = tagMatch[2] ?? '';
    const rel =
      attributes
        .match(/\brel=["']([^"']+)["']/i)?.[1]
        ?.toLowerCase()
        .split(/\s+/) ?? [];
    const resourceAttributes =
      tagName === 'script'
        ? ['src']
        : tagName === 'img'
          ? ['src', 'srcset']
          : tagName === 'source'
            ? ['srcset']
            : rel.some((value) =>
                  ['stylesheet', 'icon', 'modulepreload', 'preload'].includes(value),
                )
              ? ['href']
              : [];

    for (const attribute of resourceAttributes) {
      const value = attributes.match(new RegExp(`\\b${attribute}=["']([^"']+)["']`, 'i'))?.[1];
      if (!value) continue;

      const candidates =
        attribute === 'srcset'
          ? value.split(',').map((part) => part.trim().split(/\s+/)[0] ?? '')
          : [value];
      for (const candidate of candidates) {
        if (!candidate || /^(?:[a-z]+:|\/\/|#)/i.test(candidate)) continue;
        const url = new URL(candidate, `https://pages.invalid${baseHref}`);
        if (!url.pathname.startsWith(baseHref)) {
          errors.push(`Recurso fora da base ${baseHref} em ${relativePath}: ${candidate}`);
          continue;
        }
        const resourcePath = resolve(
          outputRoot,
          decodeURIComponent(url.pathname.slice(baseHref.length)),
        );
        if (resourcePath !== outputRoot && !resourcePath.startsWith(`${outputRoot}${sep}`)) {
          errors.push(`Recurso escapou do diretório publicado em ${relativePath}: ${candidate}`);
        } else if (!existsSync(resourcePath)) {
          errors.push(
            `Recurso referenciado não existe em ${relativePath}: ${candidate} (${resourcePath})`,
          );
        }
      }
    }
  }

  for (const linkMatch of html.matchAll(/<link\b([^>]*)>/gi)) {
    const attributes = linkMatch[1] ?? '';
    const rel = attributes.match(/\brel=["']([^"']+)["']/i)?.[1]?.toLowerCase() ?? '';
    const href = attributes.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (!href || !rel.split(/\s+/).includes('stylesheet')) continue;

    const stylesheetUrl = new URL(href, `https://pages.invalid${baseHref}`);
    const stylesheetPath = resolve(
      outputRoot,
      decodeURIComponent(stylesheetUrl.pathname.slice(baseHref.length)),
    );
    if (!existsSync(stylesheetPath)) continue;

    const stylesheet = readFileSync(stylesheetPath, 'utf8');
    for (const cssUrlMatch of stylesheet.matchAll(/url\(["']?([^"')]+)["']?\)/gi)) {
      const cssUrl = cssUrlMatch[1]?.trim();
      if (!cssUrl || /^(?:[a-z]+:|\/\/|#)/i.test(cssUrl)) continue;

      const resourceUrl = new URL(cssUrl, stylesheetUrl);
      if (!resourceUrl.pathname.startsWith(baseHref)) {
        errors.push(`Fonte ou recurso CSS fora da base ${baseHref} em ${relativePath}: ${cssUrl}`);
        continue;
      }
      const resourcePath = resolve(
        outputRoot,
        decodeURIComponent(resourceUrl.pathname.slice(baseHref.length)),
      );
      if (!existsSync(resourcePath)) {
        errors.push(
          `Fonte ou recurso CSS não existe em ${relativePath}: ${cssUrl} (${resourcePath})`,
        );
      }
    }
  }

  for (const linkMatch of html.matchAll(/<a\b([^>]*)>/gi)) {
    const href = linkMatch[1]?.match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (!href || !href.startsWith('/') || href.startsWith('//')) continue;
    if (!href.startsWith(baseHref))
      errors.push(`Link interno fora da base ${baseHref} em ${relativePath}: ${href}`);
  }
}

if (errors.length) {
  console.error(`Validação do artefato GitHub Pages falhou:\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(
    `Artefato GitHub Pages válido: base ${baseHref}; ${requiredRoutes.length} rotas pré-renderizadas e recursos locais verificados.`,
  );
}
