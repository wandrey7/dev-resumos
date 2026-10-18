import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DadosService } from '../../core/services/dados.service';
import { Tecnologia, Conteudo, ExemploCodigo } from '../../core/models/models';
import { BlocoCodigoComponent } from '../../shared/bloco-codigo/bloco-codigo.component';

@Component({
  selector: 'app-tecnologia',
  standalone: true,
  imports: [CommonModule, RouterLink, BlocoCodigoComponent],
  template: `
    <div *ngIf="carregando" class="page-container" role="status" aria-live="polite">
      <div class="technology-loading-state">
        <span class="loading-spinner" aria-hidden="true"></span>
        <p>Carregando conteúdo...</p>
      </div>
    </div>

    <!-- Tela 404 Amigável quando a tecnologia não for encontrada -->
    <div *ngIf="!carregando && tecnologiaNaoEncontrada" class="page-container">
      <div class="empty-state-box not-found-box">
        <div class="not-found-status">404</div>
        <h1 class="empty-title">Tecnologia não encontrada</h1>
        <p class="empty-text">
          A tecnologia com o identificador "<strong>{{ slugSolicitado }}</strong>" não existe em nossa base de cheatsheets ou foi removida.
        </p>
        <div class="not-found-actions">
          <a routerLink="/" class="btn-primary-sm">Ir para Página Inicial</a>
          <a routerLink="/categorias" class="btn-ghost-sm">Ver todas as categorias</a>
        </div>
      </div>
    </div>

    <!-- Tela Principal da Tecnologia -->
    <div *ngIf="!carregando && tecnologia" class="page-tecnologia">
      <!-- Breadcrumb Superior -->
      <div class="tec-breadcrumb-bar">
        <div class="tec-breadcrumb">
          <a routerLink="/">Início</a>
          <span class="sep">/</span>
          <a routerLink="/categorias">Categorias</a>
          <span class="sep">/</span>
          <a *ngIf="tecnologia.categoriaId" [routerLink]="['/categorias', categoriaSlug]">{{ tecnologia.categoriaNome }}</a>
          <span class="sep">/</span>
          <span class="current">{{ tecnologia.nome }}</span>
        </div>

        <a routerLink="/pesquisa" class="tec-quick-search-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Pesquisar outros tópicos
        </a>
      </div>

      <!-- Menu Móvel Recolhível no Topo (Visível em Celulares/Telas Pequenas) -->
      <div class="mobile-topics-drawer">
        <button
          type="button"
          class="mobile-drawer-toggle"
          (click)="toggleMenuTopicosMobile()"
          [attr.aria-expanded]="menuTopicosMobileAberto"
        >
          <div class="toggle-info">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
            <span>Índice de Assuntos ({{ conteudos.length }})</span>
          </div>
          <span class="toggle-arrow" [class.open]="menuTopicosMobileAberto">▼</span>
        </button>

        <div *ngIf="menuTopicosMobileAberto" class="mobile-topics-list">
          <a
            [routerLink]="['/tecnologia', tecnologia.slug]"
            fragment="oque-e"
            (click)="menuTopicosMobileAberto = false"
            class="mobile-topic-item"
            [class.active]="itemAtivoSlug === 'oque-e'"
          >
            O que é {{ tecnologia.nome }}?
          </a>
          <a
            *ngFor="let assunto of conteudos"
            [routerLink]="['/tecnologia', tecnologia.slug]"
            [fragment]="assunto.slug"
            (click)="menuTopicosMobileAberto = false"
            class="mobile-topic-item"
            [class.active]="itemAtivoSlug === assunto.slug"
          >
            {{ assunto.titulo }}
          </a>
        </div>
      </div>

      <!-- Layout em Duas Colunas -->
      <div class="tecnologia-layout">
        <!-- Coluna Esquerda: Menu de Assuntos Fixo/Sticky -->
        <aside class="tecnologia-sidebar">
          <div class="sidebar-sticky-wrapper">
            <div class="sidebar-header">
              <span class="tec-pill-name">{{ tecnologia.nome }}</span>
              <span class="tec-pill-version" *ngIf="tecnologia.versao">{{ tecnologia.versao }}</span>
            </div>

            <nav class="sidebar-nav" aria-label="Sumário de tópicos">
              <div class="sidebar-nav-title">Assuntos</div>
              <ul class="nav-topics-list">
                <li>
                  <a
                    [routerLink]="['/tecnologia', tecnologia.slug]"
                    fragment="oque-e"
                    class="nav-topic-link"
                    [class.active]="itemAtivoSlug === 'oque-e'"
                  >
                    <span class="topic-dot"></span>
                    <span class="topic-name">O que é {{ tecnologia.nome }}?</span>
                  </a>
                </li>
                <li *ngFor="let assunto of conteudos">
                  <a
                    [routerLink]="['/tecnologia', tecnologia.slug]"
                    [fragment]="assunto.slug"
                    class="nav-topic-link"
                    [class.active]="itemAtivoSlug === assunto.slug"
                  >
                    <span class="topic-dot"></span>
                    <span class="topic-name">{{ assunto.titulo }}</span>
                  </a>
                </li>
              </ul>
            </nav>

            <div class="sidebar-footer-tip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Clique em qualquer assunto para rolar direto ao exemplo.</span>
            </div>
          </div>
        </aside>

        <!-- Coluna Direita: Conteúdo Principal com Seções e Blocos de Código -->
        <main class="tecnologia-content">
          <!-- Título da Tecnologia e "O que é [Tecnologia]?" -->
          <header class="tec-main-header" id="oque-e">
            <div class="tec-main-meta">
              <span class="meta-tag">{{ tecnologia.categoriaNome }}</span>
              <span class="meta-sep">·</span>
              <span>Cheat Sheet Oficial</span>
              <span class="meta-sep" *ngIf="tecnologia.versao">·</span>
              <span *ngIf="tecnologia.versao">{{ tecnologia.versao }}</span>
            </div>

            <h1 class="tec-main-title">{{ tecnologia.nome }}</h1>

            <section class="section-box oque-e-box">
              <h2 class="section-heading-clean">O que é {{ tecnologia.nome }}?</h2>
              <p class="tec-resumo-text">{{ tecnologia.resumo || tecnologia.descricao }}</p>
            </section>
          </header>

          <div *ngIf="conteudos.length === 0" class="empty-state-box technology-empty-state">
            <h2 class="empty-title">Esta tecnologia ainda não tem conteúdo</h2>
            <p class="empty-text">Estamos preparando resumos e exemplos para esta tecnologia. Volte em breve.</p>
          </div>

          <!-- Seções por Assunto -->
          <div class="assuntos-container">
            <section
              *ngFor="let assunto of conteudos"
              [id]="assunto.slug"
              class="assunto-section"
            >
              <div class="assunto-header">
                <h2 class="assunto-title">{{ assunto.titulo | uppercase }}</h2>
                <a
                  [routerLink]="['/tecnologia', tecnologia.slug]"
                  [fragment]="assunto.slug"
                  class="permalink-anchor"
                  title="Link direto para este assunto"
                >#</a>
              </div>

              <p class="assunto-text">{{ assunto.texto }}</p>

              <!-- Blocos de Código Reutilizáveis deste Assunto -->
              <div class="assunto-exemplos">
                <div
                  *ngFor="let exemplo of obterExemplos(assunto.id)"
                  class="exemplo-item"
                >
                  <app-bloco-codigo
                    [codigo]="exemplo.codigo"
                    [linguagem]="exemplo.linguagem"
                    [titulo]="exemplo.titulo"
                    [explicacao]="exemplo.explicacao"
                  ></app-bloco-codigo>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  `
})
export class TecnologiaComponent implements OnInit, OnDestroy {
  tecnologia: Tecnologia | null = null;
  categoriaSlug = '';
  conteudos: Conteudo[] = [];
  exemplosMap = new Map<string, ExemploCodigo[]>();
  tecnologiaNaoEncontrada = false;
  carregando = true;
  slugSolicitado = '';
  itemAtivoSlug = 'oque-e';
  menuTopicosMobileAberto = false;

  private routeSub?: Subscription;
  private fragmentSub?: Subscription;
  private loadingTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private dadosService: DadosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.slugSolicitado = slug;
        this.carregando = true;
        this.tecnologiaNaoEncontrada = false;
        this.tecnologia = null;
        this.menuTopicosMobileAberto = false;
        clearTimeout(this.loadingTimer);
        this.loadingTimer = setTimeout(() => this.carregarTecnologia(slug), 0);
      }
    });

    this.fragmentSub = this.route.fragment.subscribe(fragment => {
      this.itemAtivoSlug = fragment || 'oque-e';
      if (fragment && !this.carregando) {
        setTimeout(() => this.rolarParaSecao(fragment, false), 0);
      }
    });
  }

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.fragmentSub?.unsubscribe();
    clearTimeout(this.loadingTimer);
  }

  carregarTecnologia(slug: string) {
    const tec = this.dadosService.getTecnologiaBySlug(slug);
    if (!tec) {
      this.tecnologiaNaoEncontrada = true;
      this.tecnologia = null;
      this.carregando = false;
      return;
    }

    this.tecnologiaNaoEncontrada = false;
    this.tecnologia = tec;

    const cat = this.dadosService.getCategorias().find(c => c.id === tec.categoriaId);
    this.categoriaSlug = cat?.slug || 'todas';

    this.conteudos = this.dadosService.getConteudosByTecnologiaId(tec.id);

    // Carregar exemplos de cada conteúdo
    this.exemplosMap.clear();
    for (const c of this.conteudos) {
      this.exemplosMap.set(c.id, this.dadosService.getExemplosByConteudoId(c.id));
    }

    const fragment = this.route.snapshot.fragment;
    this.itemAtivoSlug = fragment && this.conteudos.some(c => c.slug === fragment)
      ? fragment
      : 'oque-e';
    this.carregando = false;

    if (fragment === 'oque-e' || this.conteudos.some(c => c.slug === fragment)) {
      setTimeout(() => this.rolarParaSecao(fragment, false), 0);
    }
  }

  obterExemplos(conteudoId: string): ExemploCodigo[] {
    return this.exemplosMap.get(conteudoId) || [];
  }

  rolarParaSecao(secaoId: string, atualizarUrl = true) {
    this.itemAtivoSlug = secaoId;
    this.menuTopicosMobileAberto = false;

    if (atualizarUrl && this.tecnologia) {
      this.router.navigate(['/tecnologia', this.tecnologia.slug], {
        fragment: secaoId,
        replaceUrl: true
      });
    }

    const elemento = document.getElementById(secaoId);
    if (elemento) {
      const topOffset = 80; // Compensar altura do cabeçalho fixo
      const elementPosition = elemento.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  @HostListener('window:scroll')
  atualizarAssuntoAtivo() {
    if (!this.tecnologia) return;

    const secoes = Array.from(
      document.querySelectorAll<HTMLElement>('.tec-main-header[id], .assunto-section[id]')
    );
    const linhaAtiva = (window.scrollY || window.pageYOffset) + 120;
    const secoesVisiveis = secoes.filter(secao => secao.offsetTop <= linhaAtiva);
    const secaoAtiva = secoesVisiveis[secoesVisiveis.length - 1];

    this.itemAtivoSlug = secaoAtiva?.id || secoes[0]?.id || 'oque-e';
  }

  toggleMenuTopicosMobile() {
    this.menuTopicosMobileAberto = !this.menuTopicosMobileAberto;
  }
}
export default TecnologiaComponent;
