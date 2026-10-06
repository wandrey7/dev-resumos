import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

// ponytail: cabeçalho sem estado de login (sempre Entrar/Cadastrar) — quando a
// task de auth portar o AuthService, reintroduzir usuarioAtual$/async e link Admin
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
        </nav>

        <!-- Ações do Usuário (Desktop) -->
        <div class="header-actions">
          <a routerLink="/login" class="btn-ghost">Entrar</a>
          <a routerLink="/cadastro" class="btn-primary-sm">Cadastrar</a>
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

        <div class="mobile-auth-section">
          <a routerLink="/login" (click)="fecharMenuMobile()" class="btn-ghost-full">Entrar</a>
          <a routerLink="/cadastro" (click)="fecharMenuMobile()" class="btn-primary-full">Cadastrar</a>
        </div>
      </div>
    </header>
  `
})
export class CabecalhoComponent {
  menuMobileAberto = false;

  toggleMenuMobile() {
    this.menuMobileAberto = !this.menuMobileAberto;
  }

  fecharMenuMobile() {
    this.menuMobileAberto = false;
  }
}
