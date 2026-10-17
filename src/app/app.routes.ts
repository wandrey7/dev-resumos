import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'pesquisa',
    loadComponent: () =>
      import('./pages/pesquisa/pesquisa.component').then((m) => m.PesquisaComponent),
  },
];
