import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DadosService } from '../../core/services/dados.service';
import { Categoria, Tecnologia } from '../../core/models/models';
import { CardCategoriaComponent } from '../../shared/card-categoria/card-categoria.component';
import { CardTecnologiaComponent } from '../../shared/card-tecnologia/card-tecnologia.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, RouterLink, CardCategoriaComponent, CardTecnologiaComponent],
  template: `
    <div class="page-container">
      <!-- Se está na rota /categorias/:slug (Visualização de Categoria Específica) -->
      <div *ngIf="categoriaSelecionada; else todasCategorias">
        <div class="page-header-nav">
          <a routerLink="/categorias" class="back-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Todas as Categorias
          </a>
        </div>

        <div class="category-hero-card">
          <div class="category-meta-badge">Categoria</div>
          <h1 class="page-title">{{ categoriaSelecionada.nome }}</h1>
          <p class="page-desc">{{ categoriaSelecionada.descricao }}</p>
        </div>

        <!-- Lista de Tecnologias da Categoria -->
        <div class="section-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">Tecnologias em {{ categoriaSelecionada.nome }}</h2>
              <p class="section-subtitle">
                {{ tecnologiasDaCategoria.length }} {{ tecnologiasDaCategoria.length === 1 ? 'tecnologia cadastrada' : 'tecnologias cadastradas' }}
              </p>
            </div>
          </div>

          <!-- Estado com Tecnologias -->
          <div *ngIf="tecnologiasDaCategoria.length > 0" class="tech-grid">
            <app-card-tecnologia
              *ngFor="let tec of tecnologiasDaCategoria"
              [tecnologia]="tec"
            ></app-card-tecnologia>
          </div>

          <!-- Estado Vazio -->
          <div *ngIf="tecnologiasDaCategoria.length === 0" class="empty-state-box">
            <div class="empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3 class="empty-title">Nenhuma tecnologia nesta categoria ainda</h3>
            <p class="empty-text">Novos resumos e cheatsheets para esta área estão sendo preparados pela nossa equipe.</p>
            <a routerLink="/categorias" class="btn-primary-sm">Explorar outras categorias</a>
          </div>
        </div>
      </div>

      <!-- Template: /categorias (Todas as Categorias) -->
      <ng-template #todasCategorias>
        <div class="page-header">
          <div class="hero-kicker">Estrutura de Conteúdo</div>
          <h1 class="page-title">Categorias de Conhecimento</h1>
          <p class="page-desc">
            Navegue pelos resumos técnicos organizados por linguagens, desenvolvimento, bancos de dados, ferramentas, frameworks e web.
          </p>
        </div>

        <div class="cat-grid main-categories-grid">
          <app-card-categoria
            *ngFor="let cat of categorias"
            [categoria]="cat"
            [quantidadeTecnologias]="contarTecnologias(cat.id)"
          ></app-card-categoria>
        </div>
      </ng-template>
    </div>
  `
})
export class CategoriasComponent implements OnInit, OnDestroy {
  categorias: Categoria[] = [];
  categoriaSelecionada: Categoria | null = null;
  tecnologiasDaCategoria: Tecnologia[] = [];
  private sub?: Subscription;

  constructor(
    private dadosService: DadosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.dadosService.categorias$.subscribe(cats => {
      this.categorias = cats;
      this.atualizarCategoriaPorParametro();
    });

    this.sub = this.route.paramMap.subscribe(() => {
      this.atualizarCategoriaPorParametro();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private atualizarCategoriaPorParametro() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      const encontrada = this.dadosService.getCategoriaBySlug(slug);
      if (encontrada) {
        this.categoriaSelecionada = encontrada;
        this.tecnologiasDaCategoria = this.dadosService.getTecnologiasByCategoriaId(encontrada.id);
      } else {
        this.categoriaSelecionada = null;
        this.tecnologiasDaCategoria = [];
      }
    } else {
      this.categoriaSelecionada = null;
      this.tecnologiasDaCategoria = [];
    }
  }

  contarTecnologias(categoriaId: string): number {
    return this.dadosService.getTecnologiasByCategoriaId(categoriaId).length;
  }
}
export default CategoriasComponent;
