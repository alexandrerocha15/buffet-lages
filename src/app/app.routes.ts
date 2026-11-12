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
  {
    path: '**',
    loadComponent: () => import('./features/cardapios/cardapio').then((module) => module.Cardapio),
  },
];
