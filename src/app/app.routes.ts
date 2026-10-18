import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'DevResumos · Início',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    title: 'DevResumos · Entrar',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'cadastro',
    title: 'DevResumos · Cadastro',
    loadComponent: () => import('./pages/auth/cadastro/cadastro.component').then(m => m.CadastroComponent)
  },
  {
    path: 'recuperar-senha',
    title: 'DevResumos · Recuperar Senha',
    loadComponent: () => import('./pages/auth/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent)
  },
  {
    path: 'categorias',
    title: 'DevResumos · Categorias',
    loadComponent: () => import('./pages/categorias/categorias.component').then(m => m.CategoriasComponent)
  },
  {
    path: 'categorias/:slug',
    title: 'DevResumos · Categoria',
    loadComponent: () => import('./pages/categorias/categorias.component').then(m => m.CategoriasComponent)
  },
  {
    path: 'tecnologia/:slug',
    title: 'DevResumos · Cheat Sheet',
    loadComponent: () => import('./pages/tecnologia/tecnologia.component').then(m => m.TecnologiaComponent)
  },
  {
    path: 'pesquisa',
    title: 'DevResumos · Pesquisa',
    loadComponent: () => import('./pages/pesquisa/pesquisa.component').then(m => m.PesquisaComponent)
  },
  {
    path: 'admin',
    title: 'DevResumos · Painel Administrativo',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'admin/:secao',
    title: 'DevResumos · Painel Administrativo',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
