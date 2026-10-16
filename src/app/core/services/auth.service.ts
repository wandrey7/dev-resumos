import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioAtualSubject = new BehaviorSubject<Usuario | null>(null);
  readonly usuarioAtual$: Observable<Usuario | null> = this.usuarioAtualSubject.asObservable();

  constructor(private router: Router) {
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
        return parsed as Usuario;
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

  login(email: string, _senha?: string): boolean {
    const limpo = email.trim().toLowerCase();
    const ehAdmin = limpo.includes('admin');

    const usuario: Usuario = {
      id: ehAdmin ? 'usr-admin' : 'usr-' + Date.now(),
      nome: ehAdmin ? 'Administrador Dev' : (limpo.split('@')[0] || 'Desenvolvedor'),
      email: limpo,
      perfil: ehAdmin ? 'admin' : 'usuario',
      criadoEm: new Date().toISOString().split('T')[0]
    };

    this.usuarioAtualSubject.next(usuario);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('devresumos_user', JSON.stringify(usuario));
      }
    } catch {}

    if (ehAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
    return true;
  }

  cadastrar(nome: string, email: string, _senha: string): boolean {
    const limpo = email.trim().toLowerCase();
    const ehAdmin = limpo.includes('admin');

    const usuario: Usuario = {
      id: 'usr-' + Date.now(),
      nome: nome.trim(),
      email: limpo,
      perfil: ehAdmin ? 'admin' : 'usuario',
      criadoEm: new Date().toISOString().split('T')[0]
    };

    this.usuarioAtualSubject.next(usuario);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('devresumos_user', JSON.stringify(usuario));
      }
    } catch {}

    if (ehAdmin) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
    return true;
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
