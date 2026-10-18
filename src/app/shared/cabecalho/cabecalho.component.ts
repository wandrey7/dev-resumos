import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="header-container">
        <a routerLink="/" class="header-logo">
          <span class="logo-badge">DR</span>
          <span class="logo-text">Dev<span class="logo-highlight">Resumos</span></span>
        </a>

        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">Início</a>
          <a routerLink="/categorias" routerLinkActive="active" class="nav-link">Categorias</a>
          <a routerLink="/pesquisa" routerLinkActive="active" class="nav-link">Pesquisa</a>
        </nav>

        <!-- Ações do Usuário (Desktop) -->
        <ng-container *ngIf="usuario() as u; else acoesDeslogado">
          <div class="header-actions">
            <a *ngIf="ehAdmin()" routerLink="/admin" class="nav-link admin-link">
              Admin <span class="admin-indicator"></span>
            </a>
            <div class="user-profile">
              <span class="user-avatar">{{ iniciais(u.nome) }}</span>
              <div class="user-meta">
                <span class="user-name">{{ u.nome }}</span>
                <span class="user-role">{{ ehAdmin() ? 'Administrador' : 'Usuário' }}</span>
              </div>
            </div>
            <button type="button" class="btn-logout" (click)="sair()">Sair</button>
          </div>
        </ng-container>
        <ng-template #acoesDeslogado>
          <div class="header-actions">
            <a routerLink="/login" class="btn-ghost">Entrar</a>
            <a routerLink="/cadastro" class="btn-primary-sm">Cadastrar</a>
          </div>
        </ng-template>

        <button
          type="button"
          class="mobile-menu-btn"
          (click)="toggleMenuMobile()"
          [attr.aria-expanded]="menuMobileAberto"
          aria-label="Abrir menu de navegação"
        >
          <svg *ngIf="!menuMobileAberto" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg *ngIf="menuMobileAberto" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Menu Mobile Dropdown -->
      <div *ngIf="menuMobileAberto" class="mobile-dropdown">
        <a routerLink="/" (click)="fecharMenuMobile()" class="mobile-link">Início</a>
        <a routerLink="/categorias" (click)="fecharMenuMobile()" class="mobile-link">Categorias</a>
        <a routerLink="/pesquisa" (click)="fecharMenuMobile()" class="mobile-link">Pesquisa</a>

        <div class="mobile-auth-section">
          <ng-container *ngIf="usuario() as u; else mobileDeslogado">
            <div class="mobile-user-row">
              <span class="user-avatar">{{ iniciais(u.nome) }}</span>
              <div class="user-meta">
                <span class="user-name">{{ u.nome }}</span>
                <span class="user-role">{{ ehAdmin() ? 'Administrador' : 'Usuário' }}</span>
              </div>
            </div>
            <a *ngIf="ehAdmin()" routerLink="/admin" (click)="fecharMenuMobile()" class="btn-ghost-full">Painel Admin</a>
            <button type="button" class="btn-logout-full" (click)="sair()">Sair da conta</button>
          </ng-container>
          <ng-template #mobileDeslogado>
            <a routerLink="/login" (click)="fecharMenuMobile()" class="btn-ghost-full">Entrar</a>
            <a routerLink="/cadastro" (click)="fecharMenuMobile()" class="btn-primary-full">Cadastrar</a>
          </ng-template>
        </div>
      </div>
    </header>
  `,
})
export class CabecalhoComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly usuario = this.auth.usuarioAtual;
  readonly ehAdmin = computed(() => this.usuario()?.perfil === 'admin');
  menuMobileAberto = false;

  iniciais(nome: string): string {
    return nome.trim().charAt(0).toUpperCase() || '?';
  }

  toggleMenuMobile(): void {
    this.menuMobileAberto = !this.menuMobileAberto;
  }

  fecharMenuMobile(): void {
    this.menuMobileAberto = false;
  }

  sair(): void {
    this.auth.logout();
    this.fecharMenuMobile();
    void this.router.navigate(['/login']);
  }
}
