import { RenderMode, ServerRoute } from '@angular/ssr';
import { menuRoutes } from './content/routes.generated';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'cardapios/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => menuRoutes.map((slug) => ({ slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
