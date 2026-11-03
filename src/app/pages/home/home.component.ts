import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { DadosService } from '../../core/services/dados.service';
import { CardCategoriaComponent } from '../../shared/card-categoria/card-categoria.component';
import { CardTecnologiaComponent } from '../../shared/card-tecnologia/card-tecnologia.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CardCategoriaComponent, CardTecnologiaComponent],
  template: `
    <div class="page-home">
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-kicker">Guia de consulta rápida · Cheat sheets</div>
          <h1 class="hero-title">Consulte uma tecnologia</h1>
          <p class="hero-subtitle">
            Encontre sintaxes, assuntos e exemplos de código para acelerar seus estudos e projetos.
          </p>

          <form class="hero-search-form" (submit)="executarBusca($event)">
            <div class="search-input-wrapper">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="search"
                class="hero-search-input"
                [value]="termoBusca()"
                (input)="atualizarTermo($event)"
                placeholder="Pesquisar tecnologia, sintaxe ou assunto..."
                autocomplete="off"
              />
              <button type="submit" class="btn-search-action">Buscar</button>
            </div>
          </form>

          <div class="hero-cat-bar">
            <span class="cat-bar-label">Categorias principais:</span>
            <div class="cat-bar-links">
              @for (categoria of categoriasDestaque(); track categoria.id) {
                <a [routerLink]="['/categorias', categoria.slug]" class="cat-chip-link">
                  {{ categoria.nome }}
                </a>
              }
              <a routerLink="/categorias" class="cat-chip-link view-all">Ver todas →</a>
            </div>
          </div>
        </div>
      </section>

      <section class="section-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Tecnologias populares</h2>
            <p class="section-subtitle">Acesse rapidamente os resumos mais consultados.</p>
          </div>
          <a routerLink="/categorias" class="link-more">Ver categorias</a>
        </div>
        <div class="tech-grid">
          @for (tecnologia of tecnologiasPopulares(); track tecnologia.id) {
            <app-card-tecnologia [tecnologia]="tecnologia" />
          }
        </div>
      </section>

      <section class="section-container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Adicionadas recentemente</h2>
            <p class="section-subtitle">Confira as tecnologias incluídas recentemente.</p>
          </div>
        </div>
        <div class="tech-grid">
          @for (tecnologia of tecnologiasRecentes(); track tecnologia.id) {
            <app-card-tecnologia [tecnologia]="tecnologia" />
          }
        </div>
      </section>

      <section class="section-container section-categorias-preview">
        <div class="section-header">
          <div>
            <h2 class="section-title">Navegue por categoria</h2>
            <p class="section-subtitle">Explore os resumos por área de conhecimento.</p>
          </div>
          <a routerLink="/categorias" class="link-more">Todas as categorias →</a>
        </div>
        <div class="cat-grid">
          @for (categoria of categorias(); track categoria.id) {
            <app-card-categoria
              [categoria]="categoria"
              [quantidadeTecnologias]="contarTecnologias(categoria.id)"
            />
          }
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent {
  private readonly dados = inject(DadosService);
  private readonly router = inject(Router);

  readonly termoBusca = signal('');
  readonly categorias = toSignal(this.dados.categorias$, {
    initialValue: this.dados.getCategorias(),
  });
  private readonly tecnologias = toSignal(this.dados.tecnologias$, {
    initialValue: this.dados.getTecnologias(),
  });
  readonly categoriasDestaque = computed(() => this.categorias().slice(0, 4));
  readonly tecnologiasPopulares = computed(() =>
    this.tecnologias().filter((tecnologia) => tecnologia.popular),
  );
  readonly tecnologiasRecentes = computed(() =>
    this.tecnologias().filter((tecnologia) => tecnologia.recente),
  );

  contarTecnologias(categoriaId: string): number {
    return this.tecnologias().filter((tecnologia) => tecnologia.categoriaId === categoriaId).length;
  }

  atualizarTermo(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.termoBusca.set(event.target.value);
    }
  }

  executarBusca(event: Event): void {
    event.preventDefault();
    const termo = this.termoBusca().trim();
    void this.router.navigate(['/pesquisa'], {
      queryParams: termo ? { q: termo } : {},
    });
  }
}
