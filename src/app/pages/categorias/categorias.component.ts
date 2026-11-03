import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { DadosService } from '../../core/services/dados.service';
import { CardCategoriaComponent } from '../../shared/card-categoria/card-categoria.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [RouterLink, CardCategoriaComponent],
  template: `
    <div class="page-container">
      @if (categoriaSelecionada(); as categoria) {
        <div class="page-header-nav">
          <a routerLink="/categorias" class="back-link">Todas as categorias</a>
        </div>
        <div class="category-hero-card">
          <div class="category-meta-badge">Categoria</div>
          <h1 class="page-title">{{ categoria.nome }}</h1>
          <p class="page-desc">{{ categoria.descricao }}</p>
        </div>

        <section class="section-container">
          <div class="section-header">
            <div>
              <h2 class="section-title">Tecnologias em {{ categoria.nome }}</h2>
              <p class="section-subtitle">
                {{ tecnologiasDaCategoria().length }}
                {{ tecnologiasDaCategoria().length === 1 ? 'tecnologia cadastrada' : 'tecnologias cadastradas' }}
              </p>
            </div>
          </div>

          @if (tecnologiasDaCategoria().length) {
            <div class="tech-grid">
              @for (tecnologia of tecnologiasDaCategoria(); track tecnologia.id) {
                <a
                  class="card-tecnologia"
                  routerLink="/pesquisa"
                  [queryParams]="{ q: tecnologia.nome }"
                >
                  <div class="card-tec-top">
                    <div class="card-tec-title-area">
                      <span class="card-tec-initial">{{ tecnologia.nome.substring(0, 2) }}</span>
                      <div>
                        <h3 class="card-tec-title">{{ tecnologia.nome }}</h3>
                        <span class="card-tec-cat">{{ categoria.nome }}</span>
                      </div>
                    </div>
                    @if (tecnologia.versao) {
                      <span class="card-tec-version">{{ tecnologia.versao }}</span>
                    }
                  </div>
                  <p class="card-tec-desc">{{ tecnologia.descricao }}</p>
                  <span class="card-tec-action">Pesquisar resumos e sintaxes →</span>
                </a>
              }
            </div>
          } @else {
            <div class="empty-state-box">
              <h3 class="empty-title">Nenhuma tecnologia nesta categoria ainda</h3>
              <p class="empty-text">Novos resumos para esta área estão sendo preparados.</p>
              <a routerLink="/categorias" class="btn-primary-sm">Explorar categorias</a>
            </div>
          }
        </section>
      } @else if (slug()) {
        <div class="empty-state-box">
          <h1 class="empty-title">Categoria não encontrada</h1>
          <a routerLink="/categorias" class="btn-primary-sm">Ver todas as categorias</a>
        </div>
      } @else {
        <div class="page-header">
          <div class="hero-kicker">Estrutura de conteúdo</div>
          <h1 class="page-title">Categorias de conhecimento</h1>
          <p class="page-desc">Explore as tecnologias organizadas por categoria.</p>
        </div>

        @if (categorias().length) {
          <div class="cat-grid main-categories-grid">
            @for (categoria of categorias(); track categoria.id) {
              <app-card-categoria
                [categoria]="categoria"
                [quantidadeTecnologias]="contarTecnologias(categoria.id)"
              />
            }
          </div>
        } @else {
          <div class="empty-state-box">
            <p class="empty-text">Ainda não há categorias cadastradas.</p>
          </div>
        }
      }
    </div>
  `,
})
export class CategoriasComponent {
  private readonly dados = inject(DadosService);
  private readonly route = inject(ActivatedRoute);

  readonly categorias = toSignal(this.dados.categorias$, {
    initialValue: this.dados.getCategorias(),
  });
  private readonly tecnologias = toSignal(this.dados.tecnologias$, {
    initialValue: this.dados.getTecnologias(),
  });
  readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug'))),
    { initialValue: this.route.snapshot.paramMap.get('slug') },
  );
  readonly categoriaSelecionada = computed(
    () => this.categorias().find((categoria) => categoria.slug === this.slug()) ?? null,
  );
  readonly tecnologiasDaCategoria = computed(() => {
    const categoria = this.categoriaSelecionada();
    return categoria
      ? this.tecnologias().filter((tecnologia) => tecnologia.categoriaId === categoria.id)
      : [];
  });

  contarTecnologias(categoriaId: string): number {
    return this.tecnologias().filter((tecnologia) => tecnologia.categoriaId === categoriaId).length;
  }
}
