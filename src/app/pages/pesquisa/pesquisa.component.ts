import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { DadosService } from '../../core/services/dados.service';
import { Tecnologia, Conteudo } from '../../core/models/models';

interface NoPesquisaArvore {
  tecnologia: Tecnologia;
  assuntos: {
    assunto: Conteudo;
    topicos: { titulo: string; codigo?: string; snippet: string }[];
  }[];
}

@Component({
  selector: 'app-pesquisa',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-container page-pesquisa">
      <div class="page-header">
        <div class="hero-kicker">Busca Instantânea</div>
        <h1 class="page-title">Pesquisa de Tecnologias e Sintaxes</h1>
        <p class="page-desc">
          Encontre comandos, métodos, exemplos de código e conceitos em toda a base do DevResumos.
        </p>
      </div>

      <!-- Formulário de Busca -->
      <div class="search-box-card">
        <form (ngSubmit)="atualizarUrlBusca()" class="search-form-row">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              class="hero-search-input"
              [(ngModel)]="termoInput"
              name="termoInput"
              placeholder="Digite ao menos 2 caracteres (ex: ArrayList, for, map, joins)..."
              autocomplete="off"
            />
            <button
              *ngIf="termoInput"
              type="button"
              class="btn-clear-search"
              (click)="limparBusca()"
              title="Limpar pesquisa"
            >
              ✕
            </button>
          </div>
          <button type="submit" class="btn-primary">Pesquisar</button>
        </form>

        <div class="search-quick-tags">
          <span class="quick-tags-label">Sugestões rápidas:</span>
          <button type="button" class="quick-tag-btn" (click)="aplicarSugestao('ArrayList')">ArrayList</button>
          <button type="button" class="quick-tag-btn" (click)="aplicarSugestao('for')">for</button>
          <button type="button" class="quick-tag-btn" (click)="aplicarSugestao('JOIN')">JOIN</button>
          <button type="button" class="quick-tag-btn" (click)="aplicarSugestao('map')">map</button>
          <button type="button" class="quick-tag-btn" (click)="aplicarSugestao('executar')">executar()</button>
        </div>
      </div>

      <!-- Resumo da Busca -->
      <div *ngIf="termoAtivo" class="search-status-bar">
        <div class="status-left">
          <span class="status-label">Pesquisar:</span>
          <span class="status-term">"{{ termoAtivo }}"</span>
          <span class="status-sep">·</span>
          <span class="status-count">
            <strong>{{ totalTopicosEncontrados }}</strong> {{ totalTopicosEncontrados === 1 ? 'resultado encontrado' : 'resultados encontrados' }}
          </span>
        </div>
      </div>

      <!-- Exibição dos Resultados em Árvore: Tecnologia → Assunto → Tópico -->
      <div *ngIf="arvoreResultados.length > 0; else semResultadosOuInicial" class="search-tree-container">
        <div class="tree-header-notice">
          <span>Resultados organizados em hierarquia: Tecnologia → Assunto → Tópico:</span>
        </div>

        <div *ngFor="let tecNo of arvoreResultados" class="tree-tech-card">
          <!-- Nível 1: Tecnologia -->
          <div class="tree-tech-header">
            <div class="tree-tech-title">
              <span class="tree-marker-root">📁</span>
              <a [routerLink]="['/tecnologia', tecNo.tecnologia.slug]" class="tree-tech-link">
                {{ tecNo.tecnologia.nome }}
              </a>
              <span class="tree-cat-tag">{{ tecNo.tecnologia.categoriaNome }}</span>
            </div>
            <a [routerLink]="['/tecnologia', tecNo.tecnologia.slug]" class="btn-ghost-sm">Ver resumo completo →</a>
          </div>

          <!-- Nível 2: Assuntos da Tecnologia -->
          <div class="tree-assuntos-list">
            <div *ngFor="let assNo of tecNo.assuntos" class="tree-assunto-item">
              <div class="tree-assunto-title">
                <span class="tree-branch-symbol">↳</span>
                <span class="tree-assunto-icon">📄</span>
                <a
                  [routerLink]="['/tecnologia', tecNo.tecnologia.slug]"
                  [fragment]="assNo.assunto.slug"
                  class="tree-assunto-link"
                >
                  {{ assNo.assunto.titulo }}
                </a>
              </div>

              <!-- Nível 3: Tópicos / Exemplos / Sintaxes com Link Direto -->
              <ul class="tree-topicos-list">
                <li *ngFor="let topico of assNo.topicos" class="tree-topico-item">
                  <span class="tree-leaf-symbol">↳</span>
                  <div class="tree-topico-content">
                    <a
                      [routerLink]="['/tecnologia', tecNo.tecnologia.slug]"
                      [fragment]="assNo.assunto.slug"
                      class="tree-topico-link"
                    >
                      <strong class="topico-nome">{{ topico.titulo }}</strong>
                      <span *ngIf="topico.snippet" class="topico-snippet">{{ topico.snippet }}</span>
                    </a>
                    <div *ngIf="topico.codigo" class="tree-code-preview">
                      <code>{{ topico.codigo }}</code>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado Sem Resultados ou Estado Inicial -->
      <ng-template #semResultadosOuInicial>
        <div *ngIf="termoAtivo && termoAtivo.length >= 2" class="empty-state-box">
          <div class="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </div>
          <h3 class="empty-title">Nenhum resultado para "{{ termoAtivo }}"</h3>
          <p class="empty-text">
            Não encontramos correspondências exatas em tecnologias, assuntos ou códigos. Tente palavras mais gerais como <code>ArrayList</code>, <code>Java</code>, <code>variáveis</code>, <code>for</code> ou <code>SQL</code>.
          </p>
        </div>

        <div *ngIf="!termoAtivo || termoAtivo.length < 2" class="empty-state-box info-initial">
          <div class="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <h3 class="empty-title">Pronto para pesquisar</h3>
          <p class="empty-text">Digite pelo menos 2 caracteres no campo acima ou clique em uma das sugestões para navegar pela árvore de tópicos.</p>
        </div>
      </ng-template>
    </div>
  `
})
export class PesquisaComponent implements OnInit, OnDestroy {
  termoInput = '';
  termoAtivo = '';
  arvoreResultados: NoPesquisaArvore[] = [];
  totalTopicosEncontrados = 0;
  private sub?: Subscription;

  constructor(
    private dadosService: DadosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(params => {
      const q = params['q'] || '';
      this.termoInput = q;
      this.termoAtivo = q.trim();
      this.processarPesquisa();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  atualizarUrlBusca() {
    const limpo = this.termoInput.trim();
    this.router.navigate(['/pesquisa'], {
      queryParams: limpo ? { q: limpo } : {},
      replaceUrl: true
    });
  }

  aplicarSugestao(sugestao: string) {
    this.termoInput = sugestao;
    this.atualizarUrlBusca();
  }

  limparBusca() {
    this.termoInput = '';
    this.atualizarUrlBusca();
  }

  private processarPesquisa() {
    if (!this.termoAtivo || this.termoAtivo.length < 2) {
      this.arvoreResultados = [];
      this.totalTopicosEncontrados = 0;
      return;
    }

    const flatResultados = this.dadosService.buscar(this.termoAtivo);

    // Agrupar em árvore: Tecnologia → Assunto → Tópicos
    const mapaTecnologias = new Map<string, {
      tecnologia: Tecnologia;
      assuntos: Map<string, { assunto: Conteudo; topicos: { titulo: string; codigo?: string; snippet: string }[] }>;
    }>();

    let countTopicos = 0;

    for (const item of flatResultados) {
      if (!mapaTecnologias.has(item.tecnologia.id)) {
        mapaTecnologias.set(item.tecnologia.id, {
          tecnologia: item.tecnologia,
          assuntos: new Map()
        });
      }

      const tecEntry = mapaTecnologias.get(item.tecnologia.id)!;
      if (!tecEntry.assuntos.has(item.assunto.id)) {
        tecEntry.assuntos.set(item.assunto.id, {
          assunto: item.assunto,
          topicos: []
        });
      }

      const assEntry = tecEntry.assuntos.get(item.assunto.id)!;
      for (const topico of item.topicos) {
        assEntry.topicos.push(topico);
        countTopicos++;
      }
    }

    this.totalTopicosEncontrados = countTopicos;

    // Converter para array final
    this.arvoreResultados = Array.from(mapaTecnologias.values()).map(tecNode => ({
      tecnologia: tecNode.tecnologia,
      assuntos: Array.from(tecNode.assuntos.values())
    }));
  }
}
export default PesquisaComponent;
