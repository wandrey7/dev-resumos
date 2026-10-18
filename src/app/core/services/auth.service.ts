import { Injectable, signal } from '@angular/core';
import { Usuario } from '../models/models';

interface UsuarioRegistro extends Usuario {
  senhaHash: string;
  senhaSalt: string;
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

  /** Validação "de servidor" simulada + grava usuário com senha hasheada. */
  async cadastrar(nome: string, email: string, senha: string): Promise<ResultadoCadastro> {
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
