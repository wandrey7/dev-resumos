import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { senhasIguaisValidator } from '../../../core/validators';

@Component({
  selector: 'app-recuperar-senha',
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
          <h1 class="auth-title">Recuperação de senha</h1>
          <p class="auth-subtitle">
            {{ etapa() === 'email' ? 'Informe o e-mail cadastrado' : 'Defina a nova senha' }}
          </p>
        </div>

        <!-- Etapa 1: informar e-mail -->
        <ng-container *ngIf="etapa() === 'email'">
          <div *ngIf="solicitado()" class="form-alert-success" role="status">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Se o e-mail existir, enviaremos as instruções para redefinição de senha.</span>
          </div>

          <form *ngIf="!solicitado()" [formGroup]="recuperarForm" (ngSubmit)="solicitar()" class="auth-form" novalidate>
            <div class="form-group">
              <label for="email" class="form-label">E-mail cadastrado</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="form-input"
                [class.input-error]="campoInvalido(recuperarForm, 'email')"
                placeholder="seu.email@exemplo.com"
                autocomplete="email"
              />
              <div *ngIf="campoInvalido(recuperarForm, 'email')" class="field-error-text">
                <span *ngIf="recuperarForm.get('email')?.hasError('required')">O e-mail é obrigatório.</span>
                <span *ngIf="recuperarForm.get('email')?.hasError('email')">Informe um e-mail válido.</span>
              </div>
            </div>

            <button type="submit" class="btn-primary-block">Enviar instruções</button>
          </form>

          <!-- Recuperação simulada: aqui o "link do e-mail" é só um botão -->
          <button
            *ngIf="solicitado()"
            type="button"
            class="btn-primary-block"
            (click)="etapa.set('redefinir')"
          >
            Definir nova senha
          </button>
        </ng-container>

        <!-- Etapa 2: definir nova senha -->
        <ng-container *ngIf="etapa() === 'redefinir'">
          <div *ngIf="sucesso()" class="form-alert-success" role="status">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Senha redefinida com sucesso! Você já pode fazer login.</span>
          </div>

          <form *ngIf="!sucesso()" [formGroup]="redefinirForm" (ngSubmit)="redefinir()" class="auth-form" novalidate>
            <div class="form-group">
              <label for="novaSenha" class="form-label">Nova senha (mínimo 8 caracteres)</label>
              <div class="password-wrapper">
                <input
                  id="novaSenha"
                  [type]="mostrarSenha() ? 'text' : 'password'"
                  formControlName="senha"
                  class="form-input"
                  [class.input-error]="campoInvalido(redefinirForm, 'senha')"
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
              <div *ngIf="campoInvalido(redefinirForm, 'senha')" class="field-error-text">
                <span *ngIf="redefinirForm.get('senha')?.hasError('required')">A senha é obrigatória.</span>
                <span *ngIf="redefinirForm.get('senha')?.hasError('minlength')">A senha deve ter no mínimo 8 caracteres.</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmarNovaSenha" class="form-label">Confirmar nova senha</label>
              <input
                id="confirmarNovaSenha"
                [type]="mostrarSenha() ? 'text' : 'password'"
                formControlName="confirmarSenha"
                class="form-input"
                [class.input-error]="campoInvalido(redefinirForm, 'confirmarSenha')"
                placeholder="Digite a senha novamente"
                autocomplete="new-password"
              />
              <div *ngIf="campoInvalido(redefinirForm, 'confirmarSenha')" class="field-error-text">
                <span *ngIf="redefinirForm.get('confirmarSenha')?.hasError('required')">A confirmação é obrigatória.</span>
                <span *ngIf="redefinirForm.get('confirmarSenha')?.hasError('senhasDiferentes')">As senhas não coincidem.</span>
              </div>
            </div>

            <button type="submit" class="btn-primary-block" [disabled]="submetendo()">
              <span>{{ submetendo() ? 'Salvando...' : 'Redefinir senha' }}</span>
            </button>
          </form>
        </ng-container>

        <div class="auth-footer-prompt">
          <a routerLink="/login" class="auth-switch-link">← Voltar para o login</a>
        </div>
      </div>
    </div>
  `,
})
export class RecuperarSenhaComponent {
  readonly recuperarForm: FormGroup;
  readonly redefinirForm: FormGroup;
  readonly etapa = signal<'email' | 'redefinir'>('email');
  readonly solicitado = signal(false);
  readonly sucesso = signal(false);
  readonly submetendo = signal(false);
  readonly mostrarSenha = signal(false);

  private emailSolicitado = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
  ) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.redefinirForm = this.fb.group(
      {
        senha: ['', [Validators.required, Validators.minLength(8)]],
        confirmarSenha: ['', [Validators.required]],
      },
      { validators: senhasIguaisValidator },
    );
  }

  campoInvalido(form: FormGroup, campo: string): boolean {
    const control = form.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  solicitar(): void {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }
    // Mock: nenhum e-mail é enviado nesta etapa; só mostramos a mensagem genérica
    // (que não revela se o e-mail existe) e liberamos a tela de nova senha.
    this.emailSolicitado = this.recuperarForm.value.email;
    this.solicitado.set(true);
  }

  async redefinir(): Promise<void> {
    if (this.redefinirForm.invalid) {
      this.redefinirForm.markAllAsTouched();
      return;
    }

    this.submetendo.set(true);
    await this.auth.redefinirSenha(this.emailSolicitado, this.redefinirForm.value.senha);
    this.submetendo.set(false);
    this.sucesso.set(true);
  }
}
