import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rodape',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-grid">
          <!-- Coluna 1: Sobre -->
          <div class="footer-col brand-col">
            <div class="footer-logo">
              <span class="logo-badge">DR</span>
              <span class="logo-text">Dev<span class="logo-highlight">Resumos</span></span>
            </div>
            <p class="footer-tagline">
              Plataforma de consulta rápida (cheat sheet) com resumos e sintaxes organizadas para estudantes e desenvolvedores de software.
            </p>
          </div>

          <!-- Coluna 2: Navegação -->
          <div class="footer-col">
            <h4 class="footer-heading">Navegação</h4>
            <ul class="footer-list">
              <li><a routerLink="/">Página Inicial</a></li>
              <li><a routerLink="/categorias">Todas as Categorias</a></li>
              <li><a routerLink="/pesquisa">Pesquisa de Tópicos</a></li>
              <li><a routerLink="/login">Área do Usuário</a></li>
            </ul>
          </div>

          <!-- Coluna 3: Tecnologias Populares -->
          <div class="footer-col">
            <h4 class="footer-heading">Principais Resumos</h4>
            <ul class="footer-list">
              <li><a [routerLink]="['/tecnologia', 'java']">Java Cheat Sheet</a></li>
              <li><a [routerLink]="['/tecnologia', 'python']">Python Cheat Sheet</a></li>
              <li><a [routerLink]="['/tecnologia', 'sql']">SQL & Queries</a></li>
              <li><a [routerLink]="['/tecnologia', 'javascript']">JavaScript ES2024</a></li>
            </ul>
          </div>

          <!-- Coluna 4: Informações -->
          <div class="footer-col">
            <h4 class="footer-heading">Cheat Sheets</h4>
            <p class="footer-note">
              Desenvolvido com Angular e arquitetura moderna de componentes standalone, zone.js e design voltado para produtividade dev.
            </p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© 2026 DevResumos. Todos os direitos reservados. Interface em português do Brasil.</p>
          <div class="footer-badges">
            <span>TypeScript</span>
            <span>·</span>
            <span>Angular Standalone</span>
            <span>·</span>
            <span>CSS Puro</span>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class RodapeComponent {}
