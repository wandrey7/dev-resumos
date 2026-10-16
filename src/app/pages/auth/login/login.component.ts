import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page-container">
      <div class="auth-card">
        <div class="auth-header">
          <a routerLink="/" class="auth-logo">
            <span class="logo-badge">DR</span>
            <span class="logo-text">Dev<span class="logo-highlight">Resumos</span></span>
          </a>
          <h1 class="auth-title">Entrar na sua conta</h1>
          <p class="auth-subtitle">Acesse seus resumos favoritos e painel administrativo</p>
        </div>

        <!-- Alerta de dica para teste simulado -->
        <div class="auth-hint-banner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <div>
            <strong>Dica de Acesso:</strong> Use qualquer e-mail contendo <code>admin</code> (ex: <code>admin&#64;devresumos.com.br</code>) para entrar no Painel Administrativo.
          </div>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form" novalidate>
          <!-- Mensagem de Erro Genérica -->
          <div *ngIf="erroMensagem" class="form-alert-error" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span>{{ erroMensagem }}</span>
          </div>

          <!-- Campo E-mail -->
          <div class="form-group">
            <label for="email" class="form-label">E-mail</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-input"
              [class.input-error]="isCampoInvalido('email')"
              placeholder="seu.email@exemplo.com"
              autocomplete="email"
            />
            <div *ngIf="isCampoInvalido('email')" class="field-error-text">
              <span *ngIf="loginForm.get('email')?.hasError('required')">O e-mail é obrigatório.</span>
              <span *ngIf="loginForm.get('email')?.hasError('email')">Informe um e-mail válido.</span>
            </div>
          </div>

          <!-- Campo Senha com botão mostrar/ocultar -->
          <div class="form-group">
            <div class="label-with-action">
              <label for="senha" class="form-label">Senha</label>
              <a routerLink="/recuperar-senha" class="link-secondary">Esqueci minha senha</a>
            </div>
            <div class="password-wrapper">
              <input
                id="senha"
                [type]="mostrarSenha ? 'text' : 'password'"
                formControlName="senha"
                class="form-input"
                [class.input-error]="isCampoInvalido('senha')"
                placeholder="Sua senha secreta"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="btn-toggle-password"
                (click)="mostrarSenha = !mostrarSenha"
                [attr.aria-label]="mostrarSenha ? 'Ocultar senha' : 'Exibir senha'"
              >
                <svg *ngIf="!mostrarSenha" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg *ngIf="mostrarSenha" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <div *ngIf="isCampoInvalido('senha')" class="field-error-text">
              <span *ngIf="loginForm.get('senha')?.hasError('required')">A senha é obrigatória.</span>
            </div>
          </div>

          <!-- Botão Entrar -->
          <button type="submit" class="btn-primary-block" [disabled]="submetendo">
            <span>{{ submetendo ? 'Entrando...' : 'Entrar' }}</span>
          </button>
        </form>

        <div class="auth-footer-prompt">
          <span>Não tem uma conta?</span>
          <a routerLink="/cadastro" class="auth-switch-link">Criar uma conta</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  mostrarSenha = false;
  erroMensagem = '';
  submetendo = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]]
    });
  }

  isCampoInvalido(campo: string): boolean {
    const control = this.loginForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    this.erroMensagem = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.submetendo = true;
    const { email, senha } = this.loginForm.value;

    setTimeout(() => {
      // Simulação: se o e-mail ou senha tiver menos de 3 caracteres geraria erro, senão entra
      if (!email || !senha || senha.length < 3) {
        this.erroMensagem = 'E-mail ou senha inválidos';
        this.submetendo = false;
        return;
      }

      this.authService.login(email, senha);
      this.submetendo = false;
    }, 400);
  }
}
export default LoginComponent;
