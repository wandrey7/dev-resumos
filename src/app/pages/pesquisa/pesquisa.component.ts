import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { distinctUntilChanged, map, of, startWith, switchMap, timer } from 'rxjs';
import { ResultadoPesquisa } from '../../core/models/models';
import { MIN_CARACTERES_BUSCA, PesquisaService } from '../../core/services/pesquisa.service';
import { DestacarTermoPipe } from '../../shared/pipes/destacar-termo.pipe';

// Contrato com a Tela de tecnologia (outra tarefa): os links daqui apontam para
// /tecnologia/:slug#<slug-do-assunto>. Para funcionar, a Tela de tecnologia precisa:
//   1) ter um elemento com id igual ao slug de cada Conteudo;
//   2) habilitar anchorScrolling no router (withInMemoryScrolling).
// Até essa tela existir, os links da pesquisa caem em rota não encontrada.

/** Tempo simulado de busca (os dados são locais). Também evita recalcular a cada tecla. */
const ATRASO_BUSCA_MS = 200;

type EstadoPesquisa =
  | { tipo: 'inicial'; termo: string }
  | { tipo: 'curto'; termo: string }
  | { tipo: 'carregando'; termo: string }
  | { tipo: 'pronto'; termo: string; resultado: ResultadoPesquisa };

@Component({
  selector: 'app-pesquisa',
  imports: [RouterLink, NgTemplateOutlet, UpperCasePipe, DestacarTermoPipe],
  template: `
    <!-- Trecho de texto com o termo buscado destacado -->
    <ng-template #realce let-texto>
      @for (parte of texto | destacarTermo: estado().termo; track $index) {
        @if (parte.destaque) {
          <mark class="search-highlight">{{ parte.texto }}</mark>
        } @else {
          <span>{{ parte.texto }}</span>
        }
      }
    </ng-template>

    <section class="pesquisa-page">
      <header class="pesquisa-header">
        <!-- Sem quebras de linha dentro do @if, para não criar espaço antes dos dois pontos. -->
        <h1 class="pesquisa-titulo">Pesquisar@if (estado().termo) {<span>: </span><span class="pesquisa-termo">{{ estado().termo }}</span>}</h1>

        <form class="pesquisa-form" role="search" (submit)="pesquisar($event)">
          <label class="form-label" for="campo-pesquisa">
            Buscar tecnologia, assunto ou exemplo
          </label>
          <div class="pesquisa-campo">
            <div class="pesquisa-input-wrap">
              <input
                #campoBusca
                id="campo-pesquisa"
                class="form-input"
                type="text"
                name="q"
                autocomplete="off"
                placeholder="Ex.: ArrayList, Ordenação, JOIN"
                [value]="texto()"
                (input)="texto.set(campoBusca.value)"
              />
              @if (texto()) {
                <button
                  type="button"
                  class="pesquisa-limpar"
                  aria-label="Limpar pesquisa"
                  (click)="limpar()"
                >
                  ×
                </button>
              }
            </div>
            <button type="submit" class="btn-primary">Pesquisar</button>
          </div>
        </form>
      </header>

      <div class="pesquisa-conteudo" aria-live="polite" [attr.aria-busy]="estado().tipo === 'carregando'">
        @switch (estado().tipo) {
          @case ('inicial') {
            <div class="pesquisa-estado">
              <p class="pesquisa-estado-titulo">O que você quer consultar?</p>
              <p class="pesquisa-estado-texto">
                Digite o nome de uma tecnologia, de um assunto ou de um exemplo.
              </p>
              <div class="pesquisa-sugestoes">
                <span class="pesquisa-estado-texto">Sugestões:</span>
                @for (sugestao of sugestoes; track sugestao) {
                  <a class="pesquisa-chip" [routerLink]="[]" [queryParams]="{ q: sugestao }">{{ sugestao }}</a>
                }
              </div>
            </div>
          }

          @case ('curto') {
            <div class="pesquisa-estado">
              <p class="pesquisa-estado-texto">
                Digite pelo menos {{ minCaracteres }} caracteres para pesquisar.
              </p>
            </div>
          }

          @case ('carregando') {
            <div class="pesquisa-estado" role="status">
              <span class="pesquisa-spinner" aria-hidden="true"></span>
              <p class="pesquisa-estado-texto">Buscando por '{{ estado().termo }}'...</p>
            </div>
          }

          @case ('pronto') {
            @if (resultado(); as res) {
              @if (res.total === 0) {
                <div class="pesquisa-estado">
                  <p class="pesquisa-estado-titulo">Nenhum resultado para '{{ res.termo }}'</p>
                  <p class="pesquisa-estado-texto">
                    Confira a ortografia ou explore as tecnologias por categoria.
                  </p>
                  <a routerLink="/categorias" class="btn-primary">Ver categorias</a>
                </div>
              } @else {
                <h2 class="pesquisa-resultados-titulo">
                  Resultados:
                  <span class="pesquisa-contagem">
                    {{ res.total }} {{ res.total === 1 ? 'resultado' : 'resultados' }}
                  </span>
                </h2>

                <ul class="arvore">
                  @for (grupo of res.grupos; track grupo.tecnologiaId) {
                    <li class="arvore-tecnologia">
                      <a class="arvore-tec-link" [routerLink]="['/tecnologia', grupo.slug]">
                        <span class="arvore-tec-inicial">{{ grupo.nome.substring(0, 2) | uppercase }}</span>
                        <span class="arvore-tec-nome">
                          <ng-container *ngTemplateOutlet="realce; context: { $implicit: grupo.nome }" />
                        </span>
                      </a>

                      <ul class="arvore-assuntos">
                        @for (assunto of grupo.assuntos; track assunto.conteudoId) {
                          <li class="arvore-assunto">
                            <a
                              class="arvore-assunto-link"
                              [routerLink]="['/tecnologia', grupo.slug]"
                              [fragment]="assunto.slug"
                            >
                              <ng-container *ngTemplateOutlet="realce; context: { $implicit: assunto.titulo }" />
                            </a>

                            @if (assunto.topicos.length > 0) {
                              <ul class="arvore-topicos">
                                @for (topico of assunto.topicos; track topico.exemploId) {
                                  <li>
                                    <a
                                      class="arvore-topico-link"
                                      [routerLink]="['/tecnologia', grupo.slug]"
                                      [fragment]="assunto.slug"
                                    >
                                      <ng-container *ngTemplateOutlet="realce; context: { $implicit: topico.titulo }" />
                                    </a>
                                  </li>
                                }
                              </ul>
                            }
                          </li>
                        }
                      </ul>
                    </li>
                  }
                </ul>
              }
            }
          }
        }
      </div>
    </section>
  `,
})
export class PesquisaComponent {
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pesquisaService = inject(PesquisaService);

  protected readonly minCaracteres = MIN_CARACTERES_BUSCA;
  protected readonly sugestoes = ['ArrayList', 'Ordenação', 'JOIN'];

  private readonly campoBusca = viewChild<ElementRef<HTMLInputElement>>('campoBusca');

  /** Texto do campo (pode divergir da URL enquanto a pessoa digita). */
  protected readonly texto = signal(this.rota.snapshot.queryParamMap.get('q')?.trim() ?? '');

  /**
   * Estado da tela, derivado da URL (?q=). O timer dentro do switchMap faz o papel
   * de debounce: uma busca nova cancela a anterior, e termos repetidos são ignorados.
   */
  protected readonly estado = toSignal(
    this.rota.queryParamMap.pipe(
      map((params) => (params.get('q') ?? '').trim()),
      distinctUntilChanged(),
      switchMap((termo) => {
        if (termo.length === 0) {
          return of<EstadoPesquisa>({ tipo: 'inicial', termo });
        }
        if (termo.length < MIN_CARACTERES_BUSCA) {
          return of<EstadoPesquisa>({ tipo: 'curto', termo });
        }
        return timer(ATRASO_BUSCA_MS).pipe(
          map(
            (): EstadoPesquisa => ({
              tipo: 'pronto',
              termo,
              resultado: this.pesquisaService.buscar(termo),
            }),
          ),
          startWith<EstadoPesquisa>({ tipo: 'carregando', termo }),
        );
      }),
    ),
    { initialValue: { tipo: 'inicial', termo: '' } as EstadoPesquisa },
  );

  protected readonly resultado = computed(() => {
    const estado = this.estado();
    return estado.tipo === 'pronto' ? estado.resultado : null;
  });

  constructor() {
    // Botão voltar/avançar do navegador: mantém o campo igual à URL.
    effect(() => this.texto.set(this.estado().termo));

    afterNextRender(() => this.campoBusca()?.nativeElement.focus());
  }

  protected pesquisar(evento: Event): void {
    evento.preventDefault();
    this.atualizarUrl(this.texto().trim());
  }

  protected limpar(): void {
    this.texto.set('');
    this.atualizarUrl('');
    this.campoBusca()?.nativeElement.focus();
  }

  private atualizarUrl(termo: string): void {
    this.router.navigate([], {
      relativeTo: this.rota,
      queryParams: { q: termo || null },
      queryParamsHandling: 'merge',
    });
  }
}
