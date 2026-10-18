import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { senhasIguaisValidator } from '../../../core/validators';

@Component({
  selector: 'app-cadastro',
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
          <h1 class="auth-title">Crie sua conta</h1>
          <p class="auth-subtitle">Tenha acesso a conteúdos completos e recursos da comunidade</p>
        </div>

        <form [formGroup]="cadastroForm" (ngSubmit)="onSubmit()" class="auth-form" novalidate>
          <div class="form-group">
            <label for="nome" class="form-label">Nome completo</label>
            <input
              id="nome"
              type="text"
              formControlName="nome"
              class="form-input"
              [class.input-error]="campoInvalido('nome')"
              placeholder="Ex: Jorvane Silva"
              autocomplete="name"
            />
            <div *ngIf="campoInvalido('nome')" class="field-error-text">
              <span *ngIf="cadastroForm.get('nome')?.hasError('required')">O nome é obrigatório.</span>
              <span *ngIf="cadastroForm.get('nome')?.hasError('minlength')">O nome deve ter no mínimo 3 caracteres.</span>
              <span *ngIf="erroServidor().campo === 'nome'">{{ erroServidor().erro }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email" class="form-label">E-mail</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="form-input"
              [class.input-error]="campoInvalido('email')"
              placeholder="seu.email@exemplo.com"
              autocomplete="email"
            />
            <div *ngIf="campoInvalido('email')" class="field-error-text">
              <span *ngIf="cadastroForm.get('email')?.hasError('required')">O e-mail é obrigatório.</span>
              <span *ngIf="cadastroForm.get('email')?.hasError('email')">Informe um endereço de e-mail válido.</span>
              <span *ngIf="erroServidor().campo === 'email'">{{ erroServidor().erro }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="senha" class="form-label">Senha (mínimo 8 caracteres)</label>
            <div class="password-wrapper">
              <input
                id="senha"
                [type]="mostrarSenha() ? 'text' : 'password'"
                formControlName="senha"
                class="form-input"
                [class.input-error]="campoInvalido('senha')"
                placeholder="Crie uma senha forte"
                autocomplete="new-password"
              />
              <button
                type="button"
                class="btn-toggle-password"
                (click)="mostrarSenha.set(!mostrarSenha())"
                [attr.aria-label]="mostrarSenha() ? 'Ocultar senha' : 'Exibir senha'"
              >
                <svg *ngIf="!mostrarSenha()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg *ngIf="mostrarSenha()" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              </button>
            </div>
            <span class="field-hint-text">Sugestão: combine letras, números e símbolos.</span>
            <div *ngIf="campoInvalido('senha')" class="field-error-text">
              <span *ngIf="cadastroForm.get('senha')?.hasError('required')">A senha é obrigatória.</span>
              <span *ngIf="cadastroForm.get('senha')?.hasError('minlength')">A senha deve ter no mínimo 8 caracteres.</span>
              <span *ngIf="erroServidor().campo === 'senha'">{{ erroServidor().erro }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmarSenha" class="form-label">Confirmar senha</label>
            <input
              id="confirmarSenha"
              [type]="mostrarSenha() ? 'text' : 'password'"
              formControlName="confirmarSenha"
              class="form-input"
              [class.input-error]="campoInvalido('confirmarSenha')"
              placeholder="Digite a senha novamente"
              autocomplete="new-password"
            />
            <div *ngIf="campoInvalido('confirmarSenha')" class="field-error-text">
              <span *ngIf="cadastroForm.get('confirmarSenha')?.hasError('required')">A confirmação de senha é obrigatória.</span>
              <span *ngIf="cadastroForm.get('confirmarSenha')?.hasError('senhasDiferentes')">As senhas não coincidem.</span>
            </div>
          </div>

          <button type="submit" class="btn-primary-block" [disabled]="submetendo()">
            <span>{{ submetendo() ? 'Criando conta...' : 'Cadastrar' }}</span>
          </button>
        </form>

        <div class="auth-footer-prompt">
          <span>Já tem uma conta?</span>
          <a routerLink="/login" class="auth-switch-link">Fazer login</a>
        </div>
      </div>
    </div>
  `,
})
export class CadastroComponent {
  readonly cadastroForm: FormGroup;
  readonly mostrarSenha = signal(false);
  readonly submetendo = signal(false);
  readonly erroServidor = signal<{ erro: string; campo?: string }>({ erro: '' });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {
    this.cadastroForm = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(8)]],
        confirmarSenha: ['', [Validators.required]],
      },
      { validators: senhasIguaisValidator },
    );
  }

  campoInvalido(campo: string): boolean {
    const control = this.cadastroForm.get(campo);
    if (control && control.invalid && (control.dirty || control.touched)) return true;
    return this.erroServidor().campo === campo;
  }

  async onSubmit(): Promise<void> {
    this.erroServidor.set({ erro: '' });
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    this.submetendo.set(true);
    const { nome, email, senha } = this.cadastroForm.value;
    const resultado = await this.auth.cadastrar(nome, email, senha);
    this.submetendo.set(false);

    if (!resultado.ok) {
      this.erroServidor.set({ erro: resultado.erro ?? 'Não foi possível concluir o cadastro.', campo: resultado.campo });
      return;
    }

    await this.router.navigate(['/login'], { queryParams: { cadastro: 'ok' } });
  }
}
