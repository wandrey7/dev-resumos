import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Validador customizado para confirmação de senha
export const senhasIguaisValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const senha = control.get('senha');
  const confirmarSenha = control.get('confirmarSenha');

  if (!senha || !confirmarSenha) return null;

  if (confirmarSenha.errors && !confirmarSenha.errors['senhasDiferentes']) {
    return null;
  }

  if (senha.value !== confirmarSenha.value) {
    confirmarSenha.setErrors({ senhasDiferentes: true });
    return { senhasDiferentes: true };
  } else {
    confirmarSenha.setErrors(null);
    return null;
  }
};

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
          <!-- Campo Nome -->
          <div class="form-group">
            <label for="nome" class="form-label">Nome completo</label>
            <input
              id="nome"
              type="text"
              formControlName="nome"
              class="form-input"
              [class.input-error]="isCampoInvalido('nome')"
              placeholder="Ex: Jorvane Silva"
              autocomplete="name"
            />
            <div *ngIf="isCampoInvalido('nome')" class="field-error-text">
              <span *ngIf="cadastroForm.get('nome')?.hasError('required')">O nome é obrigatório.</span>
              <span *ngIf="cadastroForm.get('nome')?.hasError('minlength')">O nome deve ter no mínimo 3 caracteres.</span>
            </div>
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
              <span *ngIf="cadastroForm.get('email')?.hasError('required')">O e-mail é obrigatório.</span>
              <span *ngIf="cadastroForm.get('email')?.hasError('email')">Informe um endereço de e-mail válido.</span>
            </div>
          </div>

          <!-- Campo Senha -->
          <div class="form-group">
            <label for="senha" class="form-label">Senha (mínimo 8 caracteres)</label>
            <div class="password-wrapper">
              <input
                id="senha"
                [type]="mostrarSenha ? 'text' : 'password'"
                formControlName="senha"
                class="form-input"
                [class.input-error]="isCampoInvalido('senha')"
                placeholder="Crie uma senha forte"
                autocomplete="new-password"
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
              <span *ngIf="cadastroForm.get('senha')?.hasError('required')">A senha é obrigatória.</span>
              <span *ngIf="cadastroForm.get('senha')?.hasError('minlength')">A senha deve ter no mínimo 8 caracteres.</span>
            </div>
          </div>

          <!-- Campo Confirmar Senha -->
          <div class="form-group">
            <label for="confirmarSenha" class="form-label">Confirmar senha</label>
            <input
              id="confirmarSenha"
              [type]="mostrarSenha ? 'text' : 'password'"
              formControlName="confirmarSenha"
              class="form-input"
              [class.input-error]="isCampoInvalido('confirmarSenha')"
              placeholder="Digite a senha novamente"
              autocomplete="new-password"
            />
            <div *ngIf="isCampoInvalido('confirmarSenha')" class="field-error-text">
              <span *ngIf="cadastroForm.get('confirmarSenha')?.hasError('required')">A confirmação de senha é obrigatória.</span>
              <span *ngIf="cadastroForm.get('confirmarSenha')?.hasError('senhasDiferentes')">As senhas não coincidem.</span>
            </div>
          </div>

          <!-- Botão Cadastrar -->
          <button type="submit" class="btn-primary-block" [disabled]="submetendo">
            <span>{{ submetendo ? 'Criando conta...' : 'Cadastrar' }}</span>
          </button>
        </form>

        <div class="auth-footer-prompt">
          <span>Já tem uma conta?</span>
          <a routerLink="/login" class="auth-switch-link">Fazer login</a>
        </div>
      </div>
    </div>
  `
})
export class CadastroComponent {
  cadastroForm: FormGroup;
  mostrarSenha = false;
  submetendo = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group(
      {
        nome: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(8)]],
        confirmarSenha: ['', [Validators.required]]
      },
      { validators: senhasIguaisValidator }
    );
  }

  isCampoInvalido(campo: string): boolean {
    const control = this.cadastroForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      return;
    }

    this.submetendo = true;
    const { nome, email, senha } = this.cadastroForm.value;

    setTimeout(() => {
      this.authService.cadastrar(nome, email, senha);
      this.submetendo = false;
    }, 400);
  }
}
export default CadastroComponent;
