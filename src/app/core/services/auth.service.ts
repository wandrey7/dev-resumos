import { Injectable, signal } from '@angular/core';
import { Usuario } from '../models/models';

interface UsuarioRegistro extends Usuario {
  senhaHash: string;
  senhaSalt: string;
  senha?: string;
}

export interface ResultadoCadastro {
  ok: boolean;
  erro?: string;
  campo?: 'nome' | 'email' | 'senha';
}

const CHAVE_USUARIOS = 'devresumos_usuarios';
const CHAVE_SESSAO = 'devresumos_sessao';
const DURACAO_SESSAO_MS = 8 * 60 * 60 * 1000; // 8h (RF03)
const ITERACOES_PBKDF2 = 100_000;
const EMAIL_ADMIN_DEMO = 'admin@devresumos.com.br';
const SENHA_ADMIN_DEMO = 'password123';

/**
 * Auth simulada para o protótipo (front-end apenas): "base de usuários" e sessão
 * vivem no localStorage. Validação e hash ficam aqui, o que faria o papel do
 * servidor — quando houver API real, troca-se só esta classe.
 */
// ponytail: sem backend, então PBKDF2 (Web Crypto nativo) em vez de bcrypt;
// sessão é um registro local com expiração. Trocar por API/JWT quando existir.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _usuario = signal<Usuario | null>(null);
  readonly usuarioAtual = this._usuario.asReadonly();

  constructor() {
    this._usuario.set(this.lerSessaoValida());
  }

  get ehAdmin(): boolean {
    return this._usuario()?.perfil === 'admin';
  }

  get estaAutenticado(): boolean {
    return this._usuario() !== null;
  }

  getUsuarios(): Usuario[] {
    return this.lerUsuarios().map(({ senhaHash, senhaSalt, ...usuario }) => usuario);
  }

  async salvarUsuario(
    dados: Partial<Usuario> & { senha?: string },
  ): Promise<Usuario> {
    await this.garantirContaAdminDemo();
    const nome = dados.nome?.trim() ?? '';
    const email = dados.email?.trim().toLowerCase() ?? '';
    const senha = dados.senha ?? '';

    if (nome.length < 3) throw new Error('O nome deve ter no mínimo 3 caracteres.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Informe um endereço de e-mail válido.');
    }

    const usuarios = this.lerUsuarios();
    if (usuarios.some((usuario) => usuario.email === email && usuario.id !== dados.id)) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const atual = dados.id ? usuarios.find((usuario) => usuario.id === dados.id) : undefined;
    if (dados.id && !atual) throw new Error('O usuário selecionado não foi encontrado.');
    if (!atual && senha.length < 8) {
      throw new Error('A senha deve ter no mínimo 8 caracteres.');
    }
    if (senha && senha.length < 8) {
      throw new Error('A senha deve ter no mínimo 8 caracteres.');
    }

    const usuario: UsuarioRegistro = {
      ...atual,
      id: atual?.id ?? `usr-${crypto.randomUUID()}`,
      nome,
      email,
      perfil: dados.perfil === 'admin' ? 'admin' : 'usuario',
      criadoEm: atual?.criadoEm ?? new Date().toISOString(),
      senhaSalt: atual?.senhaSalt ?? '',
      senhaHash: atual?.senhaHash ?? '',
    };

    if (senha) {
      const salt = this.gerarSalt();
      usuario.senhaSalt = this.paraHex(salt);
      usuario.senhaHash = await this.derivarHash(senha, salt);
    }

    if (atual) {
      usuarios[usuarios.indexOf(atual)] = usuario;
    } else {
      usuarios.push(usuario);
    }
    this.salvarUsuarios(usuarios);

    const { senhaHash: _senhaHash, senhaSalt: _senhaSalt, ...usuarioPublico } = usuario;
    if (this._usuario()?.id === usuario.id) this.iniciarSessao(usuarioPublico);
    return usuarioPublico;
  }

  excluirUsuario(id: string): void {
    if (this._usuario()?.id === id) {
      throw new Error('Não é possível excluir o usuário conectado.');
    }

    const usuarios = this.lerUsuarios();
    const usuario = usuarios.find((item) => item.id === id);
    if (!usuario) throw new Error('O usuário selecionado não foi encontrado.');
    if (
      usuario.perfil === 'admin' &&
      !usuarios.some((item) => item.id !== id && item.perfil === 'admin')
    ) {
      throw new Error('Não é possível excluir o único administrador cadastrado.');
    }

    this.salvarUsuarios(usuarios.filter((item) => item.id !== id));
  }

  /** Validação "de servidor" simulada + grava usuário com senha hasheada. */
  async cadastrar(nome: string, email: string, senha: string): Promise<ResultadoCadastro> {
    await this.garantirContaAdminDemo();
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (nomeLimpo.length < 3) {
      return { ok: false, erro: 'O nome deve ter no mínimo 3 caracteres.', campo: 'nome' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo)) {
      return { ok: false, erro: 'Informe um endereço de e-mail válido.', campo: 'email' };
    }
    if (senha.length < 8) {
      return { ok: false, erro: 'A senha deve ter no mínimo 8 caracteres.', campo: 'senha' };
    }
    if (this.lerUsuarios().some((u) => u.email === emailLimpo)) {
      return { ok: false, erro: 'Este e-mail já está cadastrado.', campo: 'email' };
    }

    const salt = this.gerarSalt();
    const usuarios = this.lerUsuarios();
    usuarios.push({
      id: 'usr-' + crypto.randomUUID(),
      nome: nomeLimpo,
      email: emailLimpo,
      // ponytail: regra de protótipo — e-mail com "admin" vira administrador.
      perfil: emailLimpo.includes('admin') ? 'admin' : 'usuario',
      criadoEm: new Date().toISOString(),
      senhaSalt: this.paraHex(salt),
      senhaHash: await this.derivarHash(senha, salt),
    });
    this.salvarUsuarios(usuarios);
    return { ok: true };
  }

  async login(email: string, senha: string): Promise<boolean> {
    await this.garantirContaAdminDemo();
    const emailLimpo = email.trim().toLowerCase();
    const registro = this.lerUsuarios().find((u) => u.email === emailLimpo);
    if (!registro) return false;

    const hash = await this.derivarHash(senha, this.deHex(registro.senhaSalt));
    if (hash !== registro.senhaHash) return false;

    const { senhaHash, senhaSalt, ...usuario } = registro;
    this.iniciarSessao(usuario);
    return true;
  }

  /** Recuperação simulada: nenhum e-mail é enviado (decisão desta etapa). */
  async redefinirSenha(email: string, novaSenha: string): Promise<void> {
    const emailLimpo = email.trim().toLowerCase();
    const usuarios = this.lerUsuarios();
    const registro = usuarios.find((u) => u.email === emailLimpo);
    // Se não existir, silêncio: não revela quais e-mails estão cadastrados.
    if (!registro) return;

    const salt = this.gerarSalt();
    registro.senhaSalt = this.paraHex(salt);
    registro.senhaHash = await this.derivarHash(novaSenha, salt);
    this.salvarUsuarios(usuarios);
  }

  logout(): void {
    this._usuario.set(null);
    this.remover(CHAVE_SESSAO);
  }

  private iniciarSessao(usuario: Usuario): void {
    this._usuario.set(usuario);
    this.gravar(
      CHAVE_SESSAO,
      JSON.stringify({ usuario, expiraEm: Date.now() + DURACAO_SESSAO_MS }),
    );
  }

  private lerSessaoValida(): Usuario | null {
    try {
      const raw = this.ler(CHAVE_SESSAO);
      if (!raw) return null;
      const { usuario, expiraEm } = JSON.parse(raw) as { usuario: Usuario; expiraEm: number };
      if (usuario && Date.now() < expiraEm) return usuario;
    } catch {
      // sessão corrompida é tratada como inexistente
    }
    this.remover(CHAVE_SESSAO);
    return null;
  }

  private lerUsuarios(): UsuarioRegistro[] {
    try {
      const raw = this.ler(CHAVE_USUARIOS);
      return raw ? (JSON.parse(raw) as UsuarioRegistro[]) : [];
    } catch {
      return [];
    }
  }

  private salvarUsuarios(usuarios: UsuarioRegistro[]): void {
    this.gravar(CHAVE_USUARIOS, JSON.stringify(usuarios));
  }

  private async garantirContaAdminDemo(): Promise<void> {
    const usuarios = this.lerUsuarios();
    const indiceExistente = usuarios.findIndex((usuario) => usuario.email === EMAIL_ADMIN_DEMO);
    const existente = indiceExistente >= 0 ? usuarios[indiceExistente] : undefined;
    if (existente?.senhaHash && existente.senhaSalt) return;

    const salt = this.gerarSalt();
    const { senha: _senhaLegada, ...dadosExistentes } = existente ?? {};
    const contaDemo: UsuarioRegistro = {
      ...dadosExistentes,
      id: existente?.id ?? 'usr-admin-demo',
      nome: existente?.nome ?? 'Administrador DevResumos',
      email: EMAIL_ADMIN_DEMO,
      perfil: 'admin',
      criadoEm: existente?.criadoEm ?? new Date().toISOString(),
      senhaSalt: this.paraHex(salt),
      senhaHash: await this.derivarHash(SENHA_ADMIN_DEMO, salt),
    };
    if (indiceExistente >= 0) {
      usuarios[indiceExistente] = contaDemo;
    } else {
      usuarios.push(contaDemo);
    }
    this.salvarUsuarios(usuarios);
  }

  private gerarSalt(): Uint8Array<ArrayBuffer> {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  private async derivarHash(senha: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
    const chave = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(senha),
      'PBKDF2',
      false,
      ['deriveBits'],
    );
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: ITERACOES_PBKDF2, hash: 'SHA-256' },
      chave,
      256,
    );
    return this.paraHex(new Uint8Array(bits));
  }

  private paraHex(bytes: Uint8Array): string {
    return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  private deHex(hex: string): Uint8Array<ArrayBuffer> {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return bytes;
  }

  private ler(chave: string): string | null {
    try {
      return typeof localStorage === 'undefined' ? null : localStorage.getItem(chave);
    } catch {
      return null;
    }
  }

  private gravar(chave: string, valor: string): void {
    try {
      localStorage?.setItem(chave, valor);
    } catch {
      // storage indisponível (modo privado) — segue sem persistir
    }
  }

  private remover(chave: string): void {
    try {
      localStorage?.removeItem(chave);
    } catch {
      // ignora
    }
  }
}
