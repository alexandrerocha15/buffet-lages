import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((module) => module.Home),
  },
  {
    path: 'cardapios/:slug',
    loadComponent: () => import('./features/cardapios/cardapio').then((module) => module.Cardapio),
  },
  { path: 'montar', loadComponent: () => import('./features/orcamento/orcamento').then((module) => module.Orcamento) },
  { path: 'orcamento', loadComponent: () => import('./features/orcamento/orcamento').then((module) => module.Orcamento) },
  {
    path: '**',
    loadComponent: () => import('./features/cardapios/cardapio').then((module) => module.Cardapio),
  },
];
