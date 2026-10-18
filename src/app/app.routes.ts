import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    title: 'DevResumos · Entrar',
    loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'cadastro',
    title: 'DevResumos · Cadastro',
    loadComponent: () =>
      import('./pages/auth/cadastro/cadastro.component').then((m) => m.CadastroComponent),
  },
  {
    path: 'recuperar-senha',
    title: 'DevResumos · Recuperar Senha',
    loadComponent: () =>
      import('./pages/auth/recuperar-senha/recuperar-senha.component').then(
        (m) => m.RecuperarSenhaComponent,
      ),
  },
  // ponytail: demais rotas (home/categorias/pesquisa/admin) entram nas suas tasks;
  // até lá o fallback manda para o login.
  { path: '**', redirectTo: 'login' },
];
