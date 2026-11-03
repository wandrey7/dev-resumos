import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthService);
  });

  it('cadastra e entra com a senha correta', async () => {
    expect(await auth.cadastrar('Ana Souza', 'ana@exemplo.com', 'senha1234')).toEqual({ ok: true });
    expect(await auth.login('ana@exemplo.com', 'senha1234')).toBe(true);
    expect(auth.usuarioAtual()?.email).toBe('ana@exemplo.com');
    expect(auth.ehAdmin).toBe(false);
  });

  it('nunca guarda a senha em texto puro (RNF04)', async () => {
    await auth.cadastrar('Ana Souza', 'ana@exemplo.com', 'senha1234');
    expect(localStorage.getItem('devresumos_usuarios')).not.toContain('senha1234');
  });

  it('rejeita senha errada sem dizer qual campo errou', async () => {
    await auth.cadastrar('Ana Souza', 'ana@exemplo.com', 'senha1234');
    expect(await auth.login('ana@exemplo.com', 'senha-errada')).toBe(false);
    expect(await auth.login('nao-existe@exemplo.com', 'senha1234')).toBe(false);
  });

  it('rejeita e-mail duplicado na validação simulada de servidor', async () => {
    await auth.cadastrar('Ana Souza', 'ana@exemplo.com', 'senha1234');
    expect(await auth.cadastrar('Bia', 'ana@exemplo.com', 'outrasenha')).toMatchObject({
      ok: false,
      campo: 'email',
    });
  });

  it('exige senha com 8+ caracteres', async () => {
    expect(await auth.cadastrar('Ana Souza', 'ana@exemplo.com', 'curta')).toMatchObject({
      ok: false,
      campo: 'senha',
    });
  });

  it('e-mail com "admin" vira administrador', async () => {
    await auth.cadastrar('Admin Dev', 'admin-pessoal@exemplo.com', 'senha1234');
    await auth.login('admin-pessoal@exemplo.com', 'senha1234');
    expect(auth.ehAdmin).toBe(true);
  });

  it('administra usuários sem armazenar a senha em texto puro', async () => {
    await auth.cadastrar('Admin Dev', 'admin-pessoal@exemplo.com', 'senha1234');
    await auth.login('admin-pessoal@exemplo.com', 'senha1234');

    const usuario = await auth.salvarUsuario({
      nome: 'Ana Souza',
      email: 'ana@exemplo.com',
      perfil: 'usuario',
      senha: 'senha5678',
    });

    expect(auth.getUsuarios()).toContainEqual(usuario);
    expect(localStorage.getItem('devresumos_usuarios')).not.toContain('senha5678');
    expect(await auth.login('ana@exemplo.com', 'senha5678')).toBe(true);
  });

  it('permite entrar com a conta administrativa de demonstração', async () => {
    expect(await auth.login('admin@devresumos.com.br', 'password123')).toBe(true);
    expect(auth.usuarioAtual()?.perfil).toBe('admin');
    expect(auth.getUsuarios().some((usuario) => usuario.email === 'admin@devresumos.com.br')).toBe(true);
  });

  it('migra a conta administrativa antiga sem manter a senha em texto puro', async () => {
    localStorage.setItem(
      'devresumos_usuarios',
      JSON.stringify([
        {
          id: 'usr-admin-demo',
          nome: 'Administrador DevResumos',
          email: 'admin@devresumos.com.br',
          perfil: 'admin',
          criadoEm: '2026-01-01',
          senha: 'senha-legada',
        },
      ]),
    );

    expect(await auth.login('admin@devresumos.com.br', 'password123')).toBe(true);
    expect(localStorage.getItem('devresumos_usuarios')).not.toContain('senha-legada');
  });

  it('impede remover o último administrador', async () => {
    await auth.login('admin@devresumos.com.br', 'password123');
    auth.logout();
    const [admin] = auth.getUsuarios();

    expect(() => auth.excluirUsuario(admin.id)).toThrow('único administrador');
    expect(auth.getUsuarios()).toContainEqual(admin);
  });

  it('logout encerra a sessão', async () => {
    await auth.cadastrar('Ana Souza', 'ana@exemplo.com', 'senha1234');
    await auth.login('ana@exemplo.com', 'senha1234');
    auth.logout();
    expect(auth.usuarioAtual()).toBeNull();
    expect(localStorage.getItem('devresumos_sessao')).toBeNull();
  });

  it('sessão expirada não autentica', async () => {
    await auth.cadastrar('Ana Souza', 'ana@exemplo.com', 'senha1234');
    await auth.login('ana@exemplo.com', 'senha1234');
    const sessao = JSON.parse(localStorage.getItem('devresumos_sessao')!);
    sessao.expiraEm = Date.now() - 1000;
    localStorage.setItem('devresumos_sessao', JSON.stringify(sessao));

    TestBed.resetTestingModule();
    const novo = TestBed.configureTestingModule({}).inject(AuthService);
    expect(novo.usuarioAtual()).toBeNull();
  });
});
