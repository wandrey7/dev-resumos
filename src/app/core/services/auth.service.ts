import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/models';
import { DadosService } from './dados.service';

interface Credencial {
  salt: string;
  hash: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioAtualSubject = new BehaviorSubject<Usuario | null>(null);
  readonly usuarioAtual$: Observable<Usuario | null> = this.usuarioAtualSubject.asObservable();

  constructor(private router: Router, private dadosService: DadosService) {
    const usuario = this.carregarUsuarioSalvo();
    if (usuario) {
      this.usuarioAtualSubject.next(usuario);
    }
  }

  private carregarUsuarioSalvo(): Usuario | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }
      const salvo = localStorage.getItem('devresumos_user');
      if (!salvo || salvo === 'undefined' || salvo === 'null') {
        if (salvo === 'undefined' || salvo === 'null') {
          localStorage.removeItem('devresumos_user');
        }
        return null;
      }
      const trimmed = salvo.trim();
      if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
        localStorage.removeItem('devresumos_user');
        return null;
      }
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.nome) {
        const { senha: _senhaSalva, ...usuario } = parsed as Usuario;
        return usuario;
      }
    } catch {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('devresumos_user');
        }
      } catch {}
    }
    return null;
  }

  get usuarioAtual(): Usuario | null {
    return this.usuarioAtualSubject.getValue();
  }

  get estaAutenticado(): boolean {
    return this.usuarioAtual !== null;
  }

  get ehAdmin(): boolean {
    return this.usuarioAtual?.perfil === 'admin';
  }

  async login(email: string, senha: string): Promise<boolean> {
    const limpo = email.trim().toLowerCase();
    const cadastrado = this.dadosService.getUsuarios().find(usuario => usuario.email.toLowerCase() === limpo);
    if (!cadastrado) return false;

    let credencial = this.obterCredenciais()[cadastrado.id];
    if (!credencial) {
      const senhaLegada = cadastrado.senha || this.senhaPadraoDemonstracao(cadastrado) || 'password123';
      if (!senhaLegada || senha !== senhaLegada) return false;
      credencial = await this.criarCredencial(senha);
      this.salvarCredencial(cadastrado.id, credencial);
    } else if (!await this.verificarSenha(senha, credencial)) {
      return false;
    }

    const usuario = cadastrado;
    const { senha: _senhaSalva, ...usuarioSessao } = usuario;
    this.usuarioAtualSubject.next(usuarioSessao);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('devresumos_user', JSON.stringify(usuarioSessao));
      }
    } catch {}

    if (usuarioSessao.perfil === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
    return true;
  }

  async cadastrar(nome: string, email: string, senha: string): Promise<boolean> {
    const limpo = email.trim().toLowerCase();
    if (this.dadosService.getUsuarios().some(usuario => usuario.email.toLowerCase() === limpo)) {
      return false;
    }

    const credencial = await this.criarCredencial(senha);
    const usuario = this.dadosService.salvarUsuario({
      nome: nome.trim(),
      email: limpo,
      perfil: 'usuario'
    });
    this.salvarCredencial(usuario.id, credencial);
    const { senha: _senhaSalva, ...usuarioSessao } = usuario;
    this.usuarioAtualSubject.next(usuarioSessao);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('devresumos_user', JSON.stringify(usuarioSessao));
      }
    } catch {}

    if (usuarioSessao.perfil === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
    return true;
  }

  async definirSenha(usuarioId: string, senha: string): Promise<void> {
    const credencial = await this.criarCredencial(senha);
    this.salvarCredencial(usuarioId, credencial);
  }

  private senhaPadraoDemonstracao(usuario: Usuario): string | null {
    const contasDemo: Record<string, string> = {
      'usr-admin': 'admin@devresumos.com.br',
      'usr-dev': 'jorvane@devresumos.com.br'
    };
    return contasDemo[usuario.id] === usuario.email.toLowerCase() ? 'password123' : null;
  }

  private obterCredenciais(): Record<string, Credencial> {
    if (typeof window === 'undefined' || !window.localStorage) {
      throw new Error('O armazenamento local não está disponível neste navegador.');
    }

    const salvo = window.localStorage.getItem('devresumos_credentials');
    if (!salvo) return {};

    try {
      const dados: unknown = JSON.parse(salvo);
      if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
        throw new Error('Formato inválido');
      }
      return dados as Record<string, Credencial>;
    } catch (error) {
      console.error('Não foi possível ler as credenciais salvas.', error);
      throw new Error('As credenciais salvas estão inválidas. Limpe os dados do site e tente novamente.');
    }
  }

  private salvarCredencial(usuarioId: string, credencial: Credencial): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      throw new Error('O armazenamento local não está disponível neste navegador.');
    }
    const credenciais = this.obterCredenciais();
    credenciais[usuarioId] = credencial;
    try {
      window.localStorage.setItem('devresumos_credentials', JSON.stringify(credenciais));
    } catch (error) {
      console.error('Não foi possível salvar a credencial.', error);
      throw new Error('Não foi possível salvar a credencial no navegador.');
    }
  }

  private async criarCredencial(senha: string): Promise<Credencial> {
    const cryptoApi = globalThis.crypto;
    if (!cryptoApi?.subtle) {
      throw new Error('Este navegador não oferece suporte à validação segura de senha.');
    }

    const salt = cryptoApi.getRandomValues(new Uint8Array(16));
    return {
      salt: this.bytesParaHex(salt),
      hash: await this.gerarHash(senha, salt)
    };
  }

  private async verificarSenha(senha: string, credencial: Credencial): Promise<boolean> {
    const salt = this.hexParaBytes(credencial.salt);
    const hashSalvo = this.hexParaBytes(credencial.hash);
    const hashInformado = this.hexParaBytes(await this.gerarHash(senha, salt));
    if (hashSalvo.length !== hashInformado.length) return false;

    let diferenca = 0;
    for (let indice = 0; indice < hashSalvo.length; indice++) {
      diferenca |= hashSalvo[indice] ^ hashInformado[indice];
    }
    return diferenca === 0;
  }

  private async gerarHash(senha: string, salt: Uint8Array): Promise<string> {
    const cryptoApi = globalThis.crypto;
    if (!cryptoApi?.subtle) {
      throw new Error('Este navegador não oferece suporte à validação segura de senha.');
    }

    const material = await cryptoApi.subtle.importKey(
      'raw',
      new TextEncoder().encode(senha),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const hash = await cryptoApi.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 310000, hash: 'SHA-256' },
      material,
      256
    );
    return this.bytesParaHex(new Uint8Array(hash));
  }

  private bytesParaHex(bytes: Uint8Array): string {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private hexParaBytes(hex: string): Uint8Array {
    if (!/^(?:[0-9a-f]{2})+$/i.test(hex)) {
      throw new Error('A credencial salva possui um formato inválido.');
    }
    return new Uint8Array(hex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
  }

  atualizarSessao(usuario: Usuario): void {
    if (this.usuarioAtual?.id !== usuario.id) return;

    const { senha: _senhaSalva, ...usuarioSessao } = usuario;
    this.usuarioAtualSubject.next(usuarioSessao);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('devresumos_user', JSON.stringify(usuarioSessao));
      }
    } catch (error) {
      console.error('Não foi possível atualizar a sessão do usuário.', error);
    }

    if (usuarioSessao.perfil !== 'admin') {
      this.router.navigate(['/']);
    }
  }

  recuperarSenha(email: string): boolean {
    // Simulação bem sucedida
    return !!email && email.includes('@');
  }

  logout() {
    this.usuarioAtualSubject.next(null);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('devresumos_user');
      }
    } catch {}
    this.router.navigate(['/login']);
  }
}
