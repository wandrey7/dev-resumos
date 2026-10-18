export const routes: Routes = [
  {
    path: 'pesquisa',
    loadComponent: () =>
      import('./pages/pesquisa/pesquisa.component').then((m) => m.PesquisaComponent),
  },
  {
    path: 'login',
    title: 'DevResumos · Entrar',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
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
  { path: '**', redirectTo: 'login' },
];