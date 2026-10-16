import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DadosService } from '../../core/services/dados.service';
import { Categoria, Tecnologia } from '../../core/models/models';
import { CardCategoriaComponent } from '../../shared/card-categoria/card-categoria.component';
import { CardTecnologiaComponent } from '../../shared/card-tecnologia/card-tecnologia.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardCategoriaComponent,
    CardTecnologiaComponent
  ],
  template: `
    <div class="page-home">
      <!-- Seção Hero com Busca Principal -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-kicker">Guia de Consulta Rápida · Cheat Sheets</div>
          <h1 class="hero-title">Consulte uma tecnologia</h1>
          <p class="hero-subtitle">
            Encontre instantaneamente sintaxes, comandos, estruturas de repetição, classes e exemplos de código prontos para copiar.
          </p>

          <!-- Campo de Busca Grande -->
          <form class="hero-search-form" (ngSubmit)="executarBusca()">
            <div class="search-input-wrapper">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                class="hero-search-input"
                name="termoBusca"
                [(ngModel)]="termoBusca"
                placeholder="Pesquisar tecnologia, sintaxe ou assunto (ex: ArrayList, for, map, joins)..."
                autocomplete="off"
              />
              <button type="submit" class="btn-search-action">
                <span>Buscar</span>
                <span class="kbd-hint">Enter ↵</span>
              </button>
            </div>
          </form>

          <!-- Faixa de Categorias em Destaque -->
          <div class="hero-cat-bar">
            <span class="cat-bar-label">Categorias principais:</span>
            <div class="cat-bar-links">
              <a *ngFor="let cat of categoriasDestaque" [routerLink]="['/categorias', cat.slug]" class="cat-chip-link">
                {{ cat.nome }}
              </a>
              <a routerLink="/categorias" class="cat-chip-link view-all">Ver todas →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- Seção Tecnologias Populares -->
      <section class="section-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Tecnologias populares</h2>
            <p class="section-subtitle">As tecnologias e linguagens mais consultadas no dia a dia da comunidade de desenvolvimento</p>
          </div>
          <a routerLink="/categorias" class="link-more">Ver categorias</a>
        </div>

        <div class="tech-grid">
          <app-card-tecnologia
            *ngFor="let tec of tecnologiasPopulares"
            [tecnologia]="tec"
          ></app-card-tecnologia>
        </div>
      </section>

      <!-- Seção Adicionadas Recentemente -->
      <section class="section-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Adicionadas recentemente</h2>
            <p class="section-subtitle">Novos resumos e ferramentas incluídos para acelerar seu fluxo de trabalho</p>
          </div>
        </div>

        <div class="tech-grid">
          <app-card-tecnologia
            *ngFor="let tec of tecnologiasRecentes"
            [tecnologia]="tec"
          ></app-card-tecnologia>
        </div>
      </section>

      <!-- Seção de Todas as Categorias no final -->
      <section class="section-container section-categorias-preview">
        <div class="section-header">
          <div>
            <h2 class="section-title">Navegue por Categoria</h2>
            <p class="section-subtitle">Explore a base de conhecimento organizada por áreas de especialidade técnica</p>
          </div>
          <a routerLink="/categorias" class="link-more">Todas as 6 categorias →</a>
        </div>

        <div class="cat-grid">
          <app-card-categoria
            *ngFor="let cat of categorias"
            [categoria]="cat"
            [quantidadeTecnologias]="contarTecnologias(cat.id)"
          ></app-card-categoria>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit {
  termoBusca = '';
  categorias: Categoria[] = [];
  categoriasDestaque: Categoria[] = [];
  tecnologiasPopulares: Tecnologia[] = [];
  tecnologiasRecentes: Tecnologia[] = [];

  constructor(
    private dadosService: DadosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dadosService.categorias$.subscribe(cats => {
      this.categorias = cats;
      // Faixa de categorias solicitada: Linguagens, Web, Banco de Dados, Ferramentas
      const destaquesSlugs = ['linguagens', 'web', 'banco-de-dados', 'ferramentas'];
      this.categoriasDestaque = cats.filter(c => destaquesSlugs.includes(c.slug));
    });

    this.dadosService.tecnologias$.subscribe(() => {
      this.tecnologiasPopulares = this.dadosService.getTecnologiasPopulares();
      this.tecnologiasRecentes = this.dadosService.getTecnologiasRecentes();
    });
  }

  contarTecnologias(categoriaId: string): number {
    return this.dadosService.getTecnologiasByCategoriaId(categoriaId).length;
  }

  executarBusca() {
    const termo = this.termoBusca.trim();
    if (termo) {
      this.router.navigate(['/pesquisa'], { queryParams: { q: termo } });
    } else {
      this.router.navigate(['/pesquisa']);
    }
  }
}
export default HomeComponent;
