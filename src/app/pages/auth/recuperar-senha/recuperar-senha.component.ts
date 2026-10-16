import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
          <h1 class="auth-title">Recuperação de Senha</h1>
          <p class="auth-subtitle">Informe o endereço cadastrado para receber o link de redefinição</p>
        </div>

        <div *ngIf="mensagemSucesso" class="form-alert-success" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <div>
            <strong>Instruções enviadas!</strong>
            <p>{{ mensagemSucesso }}</p>
          </div>
        </div>

        <form *ngIf="!mensagemSucesso" [formGroup]="recuperarForm" (ngSubmit)="onSubmit()" class="auth-form" novalidate>
          <div class="form-group">
            <label for="email" class="form-label">E-mail cadastrado</label>
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
              <span *ngIf="recuperarForm.get('email')?.hasError('required')">O e-mail é obrigatório.</span>
              <span *ngIf="recuperarForm.get('email')?.hasError('email')">Informe um e-mail válido.</span>
            </div>
          </div>

          <button type="submit" class="btn-primary-block" [disabled]="submetendo">
            <span>{{ submetendo ? 'Verificando...' : 'Enviar instruções' }}</span>
          </button>
        </form>

        <div class="auth-footer-prompt">
          <a routerLink="/login" class="auth-switch-link">← Voltar para o Login</a>
        </div>
      </div>
    </div>
  `
})
export class RecuperarSenhaComponent {
  recuperarForm: FormGroup;
  mensagemSucesso = '';
  submetendo = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isCampoInvalido(campo: string): boolean {
    const control = this.recuperarForm.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    this.submetendo = true;
    const email = this.recuperarForm.value.email;

    setTimeout(() => {
      this.authService.recuperarSenha(email);
      this.mensagemSucesso = 'Se o e-mail existir, enviaremos as instruções para a redefinição de senha.';
      this.submetendo = false;
    }, 400);
  }
}
export default RecuperarSenhaComponent;
