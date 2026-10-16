import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cabecalho',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="header-container">
        <!-- Logo -->
        <a routerLink="/" class="header-logo">
          <span class="logo-badge">DR</span>
          <span class="logo-text">Dev<span class="logo-highlight">Resumos</span></span>
        </a>

        <!-- Menu Desktop -->
        <nav class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-link">Início</a>
          <a routerLink="/categorias" routerLinkActive="active" class="nav-link">Categorias</a>
          <a routerLink="/pesquisa" routerLinkActive="active" class="nav-link">Pesquisa</a>
          <a *ngIf="authService.ehAdmin" routerLink="/admin" routerLinkActive="active" class="nav-link admin-link">
            <span class="admin-indicator"></span> Painel Admin
          </a>
        </nav>

        <!-- Ações do Usuário (Desktop) -->
        <div class="header-actions">
          <ng-container *ngIf="authService.usuarioAtual$ | async as usuario; else authButtons">
            <div class="user-profile">
              <div class="user-avatar">{{ usuario.nome.substring(0, 1) | uppercase }}</div>
              <div class="user-meta">
                <span class="user-name">{{ usuario.nome }}</span>
                <span class="user-role">{{ usuario.perfil === 'admin' ? 'Administrador' : 'Desenvolvedor' }}</span>
              </div>
            </div>
            <button type="button" class="btn-logout" (click)="logout()" title="Sair da conta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Sair</span>
            </button>
          </ng-container>

          <ng-template #authButtons>
            <a routerLink="/login" class="btn-ghost">Entrar</a>
            <a routerLink="/cadastro" class="btn-primary-sm">Cadastrar</a>
          </ng-template>
        </div>

        <!-- Botão Menu Mobile -->
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
        <a *ngIf="authService.ehAdmin" routerLink="/admin" (click)="fecharMenuMobile()" class="mobile-link admin-link">Painel Admin</a>

        <div class="mobile-auth-section">
          <ng-container *ngIf="authService.usuarioAtual$ | async as usuario; else mobileAuthButtons">
            <div class="mobile-user-row">
              <span class="user-avatar">{{ usuario.nome.substring(0, 1) | uppercase }}</span>
              <div>
                <strong class="user-name">{{ usuario.nome }}</strong>
                <div class="user-role">{{ usuario.email }}</div>
              </div>
            </div>
            <button type="button" class="btn-logout-full" (click)="logout()">Sair</button>
          </ng-container>

          <ng-template #mobileAuthButtons>
            <a routerLink="/login" (click)="fecharMenuMobile()" class="btn-ghost-full">Entrar</a>
            <a routerLink="/cadastro" (click)="fecharMenuMobile()" class="btn-primary-full">Cadastrar</a>
          </ng-template>
        </div>
      </div>
    </header>
  `
})
export class CabecalhoComponent {
  menuMobileAberto = false;

  constructor(public authService: AuthService) {}

  toggleMenuMobile() {
    this.menuMobileAberto = !this.menuMobileAberto;
  }

  fecharMenuMobile() {
    this.menuMobileAberto = false;
  }

  logout() {
    this.fecharMenuMobile();
    this.authService.logout();
  }
}
