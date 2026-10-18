import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DadosService } from '../../core/services/dados.service';
import { AuthService } from '../../core/services/auth.service';
import { Categoria, Tecnologia, Conteudo, ExemploCodigo, Usuario } from '../../core/models/models';

type SecaoAdmin = 'usuarios' | 'tecnologias' | 'categorias' | 'conteudos' | 'exemplos';
type TipoItemAdmin = 'tecnologia' | 'categoria' | 'conteudo' | 'exemplo' | 'usuario';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="admin-wrapper">
      <!-- Barra Lateral do Painel Admin -->
      <aside class="admin-sidebar">
        <div class="admin-sidebar-header">
          <span class="logo-badge">DR</span>
          <div>
            <div class="admin-brand-title">DevResumos</div>
            <div class="admin-brand-badge">PAINEL ADMINISTRATIVO</div>
          </div>
        </div>

        <nav class="admin-nav" aria-label="Menu administrativo">
          <button
            type="button"
            class="admin-nav-item"
            [class.active]="secaoAtiva === 'tecnologias'"
            (click)="mudarSecao('tecnologias')"
          >
            <span class="nav-icon">💻</span>
            <span>Tecnologias</span>
            <span class="badge-count">{{ tecnologias.length }}</span>
          </button>

          <button
            type="button"
            class="admin-nav-item"
            [class.active]="secaoAtiva === 'categorias'"
            (click)="mudarSecao('categorias')"
          >
            <span class="nav-icon">📁</span>
            <span>Categorias</span>
            <span class="badge-count">{{ categorias.length }}</span>
          </button>

          <button
            type="button"
            class="admin-nav-item"
            [class.active]="secaoAtiva === 'conteudos'"
            (click)="mudarSecao('conteudos')"
          >
            <span class="nav-icon">📄</span>
            <span>Conteúdos</span>
            <span class="badge-count">{{ conteudos.length }}</span>
          </button>

          <button
            type="button"
            class="admin-nav-item"
            [class.active]="secaoAtiva === 'exemplos'"
            (click)="mudarSecao('exemplos')"
          >
            <span class="nav-icon">⚡</span>
            <span>Exemplos de Código</span>
            <span class="badge-count">{{ exemplos.length }}</span>
          </button>

          <button
            type="button"
            class="admin-nav-item"
            [class.active]="secaoAtiva === 'usuarios'"
            (click)="mudarSecao('usuarios')"
          >
            <span class="nav-icon">👥</span>
            <span>Usuários</span>
            <span class="badge-count">{{ usuarios.length }}</span>
          </button>

          <div class="admin-nav-divider"></div>

          <button type="button" class="admin-nav-item nav-sair" (click)="sair()">
            <span class="nav-icon">🚪</span>
            <span>Sair do Painel</span>
          </button>
        </nav>

        <div class="admin-user-card" *ngIf="authService.usuarioAtual$ | async as usuario">
          <div class="admin-user-avatar">{{ usuario.nome.substring(0, 1) | uppercase }}</div>
          <div class="admin-user-info">
            <span class="user-fullname">{{ usuario.nome }}</span>
            <span class="user-role-badge">Super Admin</span>
          </div>
        </div>
      </aside>

      <!-- Conteúdo Principal do Painel -->
      <main class="admin-main">
        <!-- Toast de Mensagem de Sucesso -->
        <div *ngIf="mensagemSucesso" class="admin-toast-success" role="status">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{{ mensagemSucesso }}</span>
          <button type="button" class="toast-close" (click)="mensagemSucesso = ''">✕</button>
        </div>
        <div *ngIf="mensagemErro" class="admin-toast-error" role="alert">
          <span>{{ mensagemErro }}</span>
          <button type="button" class="toast-close" (click)="mensagemErro = ''" aria-label="Fechar mensagem">✕</button>
        </div>

        <!-- Cabeçalho da Seção Atual -->
        <header class="admin-section-header">
          <div>
            <h1 class="admin-title">
              {{ tituloSecao }}
            </h1>
            <p class="admin-subtitle">{{ descricaoSecao }}</p>
          </div>
          <button type="button" class="btn-primary" (click)="abrirModalCriacao()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            {{ secaoAtiva === 'categorias' ? 'Nova' : 'Novo' }} {{ rotuloItemSingular }}
          </button>
        </header>

        <!-- Barra de Busca da Tabela -->
        <div class="admin-toolbar">
          <div class="admin-search-wrapper">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              class="admin-search-input"
              [(ngModel)]="filtroTabela"
              [placeholder]="'Filtrar ' + rotuloItemPlural.toLowerCase() + '...'"
            />
          </div>
          <span class="admin-items-count">Total: {{ totalItensFiltrados }} registros</span>
        </div>

        <!-- TABELA: TECNOLOGIAS -->
        <div *ngIf="secaoAtiva === 'tecnologias'" class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Slug</th>
                <th>Categoria</th>
                <th>Popular</th>
                <th>Recente</th>
                <th class="col-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let tec of tecnologiasFiltradas">
                <td class="font-semibold">{{ tec.nome }}</td>
                <td class="code-font">/{{ tec.slug }}</td>
                <td>{{ tec.categoriaNome }}</td>
                <td>
                  <span [class.tag-yes]="tec.popular" [class.tag-no]="!tec.popular">
                    {{ tec.popular ? 'Sim' : 'Não' }}
                  </span>
                </td>
                <td>
                  <span [class.tag-yes]="tec.recente" [class.tag-no]="!tec.recente">
                    {{ tec.recente ? 'Sim' : 'Não' }}
                  </span>
                </td>
                <td class="col-actions">
                  <button type="button" class="btn-action edit" (click)="abrirModalEdicaoTecnologia(tec)" title="Editar">
                    Editar
                  </button>
                  <button type="button" class="btn-action delete" (click)="confirmarExclusao('tecnologia', tec.id, tec.nome)" title="Excluir">
                    Excluir
                  </button>
                </td>
              </tr>
              <tr *ngIf="tecnologiasFiltradas.length === 0">
                <td colspan="6" class="text-center-empty">Nenhuma tecnologia encontrada.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TABELA: CATEGORIAS -->
        <div *ngIf="secaoAtiva === 'categorias'" class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Slug</th>
                <th>Descrição</th>
                <th class="col-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cat of categoriasFiltradas">
                <td class="font-semibold">{{ cat.nome }}</td>
                <td class="code-font">{{ cat.slug }}</td>
                <td class="text-desc-cell">{{ cat.descricao }}</td>
                <td class="col-actions">
                  <button type="button" class="btn-action edit" (click)="abrirModalEdicaoCategoria(cat)" title="Editar">
                    Editar
                  </button>
                  <button type="button" class="btn-action delete" (click)="confirmarExclusao('categoria', cat.id, cat.nome)" title="Excluir">
                    Excluir
                  </button>
                </td>
              </tr>
              <tr *ngIf="categoriasFiltradas.length === 0">
                <td colspan="4" class="text-center-empty">Nenhuma categoria encontrada.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TABELA: CONTEÚDOS -->
        <div *ngIf="secaoAtiva === 'conteudos'" class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Tecnologia</th>
                <th>Ordem</th>
                <th>Texto Resumido</th>
                <th class="col-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let cnt of conteudosFiltrados">
                <td class="font-semibold">{{ cnt.titulo }}</td>
                <td>{{ obterNomeTecnologia(cnt.tecnologiaId) }}</td>
                <td class="code-font">{{ cnt.ordem }}</td>
                <td class="text-desc-cell">{{ cnt.texto }}</td>
                <td class="col-actions">
                  <button type="button" class="btn-action edit" (click)="abrirModalEdicaoConteudo(cnt)" title="Editar">
                    Editar
                  </button>
                  <button type="button" class="btn-action delete" (click)="confirmarExclusao('conteudo', cnt.id, cnt.titulo)" title="Excluir">
                    Excluir
                  </button>
                </td>
              </tr>
              <tr *ngIf="conteudosFiltrados.length === 0">
                <td colspan="5" class="text-center-empty">Nenhum conteúdo encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TABELA: EXEMPLOS DE CÓDIGO -->
        <div *ngIf="secaoAtiva === 'exemplos'" class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Linguagem</th>
                <th>Conteúdo Associado</th>
                <th>Código (Prévia)</th>
                <th class="col-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ex of exemplosFiltrados">
                <td class="font-semibold">{{ ex.titulo }}</td>
                <td><span class="lang-tag">{{ ex.linguagem | uppercase }}</span></td>
                <td>{{ obterTituloConteudo(ex.conteudoId) }}</td>
                <td class="code-preview-cell"><code>{{ ex.codigo.split('\\n')[0] }}</code></td>
                <td class="col-actions">
                  <button type="button" class="btn-action edit" (click)="abrirModalEdicaoExemplo(ex)" title="Editar">
                    Editar
                  </button>
                  <button type="button" class="btn-action delete" (click)="confirmarExclusao('exemplo', ex.id, ex.titulo)" title="Excluir">
                    Excluir
                  </button>
                </td>
              </tr>
              <tr *ngIf="exemplosFiltrados.length === 0">
                <td colspan="5" class="text-center-empty">Nenhum exemplo encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TABELA: USUÁRIOS -->
        <div *ngIf="secaoAtiva === 'usuarios'" class="admin-table-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Perfil</th>
                <th>Criado em</th>
                <th class="col-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let usr of usuariosFiltrados">
                <td class="font-semibold">{{ usr.nome }}</td>
                <td>{{ usr.email }}</td>
                <td>
                  <span class="badge-role" [class.badge-admin]="usr.perfil === 'admin'">
                    {{ usr.perfil === 'admin' ? 'Administrador' : 'Usuário' }}
                  </span>
                </td>
                <td class="code-font">{{ usr.criadoEm }}</td>
                <td class="col-actions">
                  <button type="button" class="btn-action edit" (click)="abrirModalEdicaoUsuario(usr)" title="Editar">
                    Editar
                  </button>
                  <button type="button" class="btn-action delete" (click)="confirmarExclusao('usuario', usr.id, usr.nome)" title="Excluir">
                    Excluir
                  </button>
                </td>
              </tr>
              <tr *ngIf="usuariosFiltrados.length === 0">
                <td colspan="5" class="text-center-empty">Nenhum usuário encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>

    <!-- MODAL REATIVO DE FORMULÁRIO -->
    <div *ngIf="modalAberto" class="admin-modal-backdrop" (click)="fecharModal()">
      <div class="admin-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">{{ editandoId ? 'Editar' : 'Novo' }} {{ rotuloItemSingular }}</h3>
          <button type="button" class="modal-close" (click)="fecharModal()">✕</button>
        </div>

        <!-- FORMULÁRIO TECNOLOGIAS -->
        <form *ngIf="secaoAtiva === 'tecnologias'" [formGroup]="formTecnologia" (ngSubmit)="salvarTecnologia()" class="modal-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="tec-nome">Nome *</label>
            <input id="tec-nome" type="text" formControlName="nome" class="form-input" placeholder="Ex: Kotlin" />
            <div *ngIf="isFormInvalido(formTecnologia, 'nome')" class="field-error-text">O nome é obrigatório.</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="tec-categoria">Categoria *</label>
            <select id="tec-categoria" formControlName="categoriaId" class="form-input">
              <option *ngFor="let cat of categorias" [value]="cat.id">{{ cat.nome }}</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="tec-descricao">Descrição *</label>
            <textarea id="tec-descricao" formControlName="descricao" class="form-textarea" rows="3" placeholder="Breve resumo da tecnologia"></textarea>
            <div *ngIf="isFormInvalido(formTecnologia, 'descricao')" class="field-error-text">A descrição é obrigatória.</div>
          </div>

          <div class="form-row-checkboxes">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="popular" />
              <span>Marcar como Popular</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" formControlName="recente" />
              <span>Marcar como Recente</span>
            </label>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-ghost-sm" (click)="fecharModal()">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar Tecnologia</button>
          </div>
        </form>

        <!-- FORMULÁRIO CATEGORIAS -->
        <form *ngIf="secaoAtiva === 'categorias'" [formGroup]="formCategoria" (ngSubmit)="salvarCategoria()" class="modal-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="cat-nome">Nome da Categoria *</label>
            <input id="cat-nome" type="text" formControlName="nome" class="form-input" placeholder="Ex: DevOps & Cloud" />
            <div *ngIf="isFormInvalido(formCategoria, 'nome')" class="field-error-text">O nome da categoria é obrigatório.</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="cat-descricao">Descrição</label>
            <textarea id="cat-descricao" formControlName="descricao" class="form-textarea" rows="3" placeholder="Descrição dos tópicos abordados"></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-ghost-sm" (click)="fecharModal()">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar Categoria</button>
          </div>
        </form>

        <!-- FORMULÁRIO CONTEÚDOS -->
        <form *ngIf="secaoAtiva === 'conteudos'" [formGroup]="formConteudo" (ngSubmit)="salvarConteudo()" class="modal-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="cnt-titulo">Título do Assunto *</label>
            <input id="cnt-titulo" type="text" formControlName="titulo" class="form-input" placeholder="Ex: Streams & Lambdas" />
            <div *ngIf="isFormInvalido(formConteudo, 'titulo')" class="field-error-text">O título é obrigatório.</div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label" for="cnt-tecnologia">Tecnologia *</label>
              <select id="cnt-tecnologia" formControlName="tecnologiaId" class="form-input">
                <option *ngFor="let tec of tecnologias" [value]="tec.id">{{ tec.nome }}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="cnt-ordem">Ordem de Exibição *</label>
              <input id="cnt-ordem" type="number" formControlName="ordem" class="form-input" />
              <div *ngIf="isFormInvalido(formConteudo, 'ordem')" class="field-error-text">Informe a ordem.</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="cnt-texto">Texto Explicativo *</label>
            <textarea id="cnt-texto" formControlName="texto" class="form-textarea" rows="4" placeholder="Explicação clara e objetiva do conceito"></textarea>
            <div *ngIf="isFormInvalido(formConteudo, 'texto')" class="field-error-text">O texto explicativo é obrigatório.</div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-ghost-sm" (click)="fecharModal()">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar Conteúdo</button>
          </div>
        </form>

        <!-- FORMULÁRIO EXEMPLOS DE CÓDIGO -->
        <form *ngIf="secaoAtiva === 'exemplos'" [formGroup]="formExemplo" (ngSubmit)="salvarExemplo()" class="modal-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="ex-titulo">Título do Exemplo *</label>
            <input id="ex-titulo" type="text" formControlName="titulo" class="form-input" placeholder="Ex: Exemplo de Reduce com Soma" />
            <div *ngIf="isFormInvalido(formExemplo, 'titulo')" class="field-error-text">O título é obrigatório.</div>
          </div>

          <div class="form-row-2">
            <div class="form-group">
              <label class="form-label" for="ex-conteudo">Conteúdo Associado *</label>
              <select id="ex-conteudo" formControlName="conteudoId" class="form-input">
                <option *ngFor="let cnt of conteudos" [value]="cnt.id">
                  {{ obterNomeTecnologia(cnt.tecnologiaId) }} - {{ cnt.titulo }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="ex-linguagem">Linguagem *</label>
              <input id="ex-linguagem" type="text" formControlName="linguagem" class="form-input" placeholder="java, python, sql..." />
              <div *ngIf="isFormInvalido(formExemplo, 'linguagem')" class="field-error-text">A linguagem é obrigatória.</div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="ex-codigo">Código *</label>
            <textarea id="ex-codigo" formControlName="codigo" class="form-textarea code-font" rows="5" placeholder="// insira o bloco de código"></textarea>
            <div *ngIf="isFormInvalido(formExemplo, 'codigo')" class="field-error-text">O código é obrigatório.</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="ex-explicacao">Explicação Opcional</label>
            <input id="ex-explicacao" type="text" formControlName="explicacao" class="form-input" placeholder="Dica ou observação sobre o código" />
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-ghost-sm" (click)="fecharModal()">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar Exemplo</button>
          </div>
        </form>

        <!-- FORMULÁRIO USUÁRIOS -->
        <form *ngIf="secaoAtiva === 'usuarios'" [formGroup]="formUsuario" (ngSubmit)="salvarUsuario()" class="modal-form" novalidate>
          <div class="form-group">
            <label class="form-label" for="usr-nome">Nome Completo *</label>
            <input id="usr-nome" type="text" formControlName="nome" class="form-input" placeholder="Nome do usuário" />
            <div *ngIf="isFormInvalido(formUsuario, 'nome')" class="field-error-text">O nome é obrigatório.</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="usr-email">E-mail *</label>
            <input id="usr-email" type="email" formControlName="email" class="form-input" placeholder="email@exemplo.com" />
            <div *ngIf="isFormInvalido(formUsuario, 'email')" class="field-error-text">Informe um e-mail válido.</div>
          </div>

          <div class="form-group" *ngIf="!editandoId">
            <label class="form-label" for="usr-senha">Senha inicial *</label>
            <input id="usr-senha" type="password" formControlName="senha" class="form-input" autocomplete="new-password" />
            <div *ngIf="isFormInvalido(formUsuario, 'senha')" class="field-error-text">A senha deve ter pelo menos 8 caracteres.</div>
          </div>

          <div class="form-group">
            <label class="form-label" for="usr-perfil">Perfil de Acesso *</label>
            <select id="usr-perfil" formControlName="perfil" class="form-input">
              <option value="usuario">Usuário Comum</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-ghost-sm" (click)="fecharModal()">Cancelar</button>
            <button type="submit" class="btn-primary">Salvar Usuário</button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO -->
    <div *ngIf="itemParaExcluir" class="admin-modal-backdrop" (click)="cancelarExclusao()">
      <div class="admin-modal modal-danger" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">Confirmar Exclusão</h3>
          <button type="button" class="modal-close" (click)="cancelarExclusao()">✕</button>
        </div>
        <div class="modal-body-confirm">
          <div class="danger-icon">⚠️</div>
          <p>
            Tem certeza de que deseja excluir <strong>"{{ itemParaExcluir.nome }}"</strong>?
          </p>
          <p class="danger-subtext">Esta ação não pode ser desfeita.</p>
          <p class="danger-subtext">{{ detalhesExclusao }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-ghost-sm" (click)="cancelarExclusao()">Cancelar</button>
          <button type="button" class="btn-danger" (click)="executarExclusao()" [disabled]="exclusaoBloqueada">Confirmar Exclusão</button>
        </div>
      </div>
    </div>
  `
})
export class AdminComponent implements OnInit {
  secaoAtiva: SecaoAdmin = 'tecnologias';
  filtroTabela = '';
  mensagemSucesso = '';
  mensagemErro = '';

  tecnologias: Tecnologia[] = [];
  categorias: Categoria[] = [];
  conteudos: Conteudo[] = [];
  exemplos: ExemploCodigo[] = [];
  usuarios: Usuario[] = [];

  // Modais
  modalAberto = false;
  editandoId: string | null = null;
  itemParaExcluir: { tipo: TipoItemAdmin; id: string; nome: string } | null = null;

  // Formulários Reativos
  formTecnologia: FormGroup;
  formCategoria: FormGroup;
  formConteudo: FormGroup;
  formExemplo: FormGroup;
  formUsuario: FormGroup;

  constructor(
    private dadosService: DadosService,
    public authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formTecnologia = this.fb.group({
      nome: ['', [Validators.required]],
      categoriaId: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      popular: [false],
      recente: [false]
    });

    this.formCategoria = this.fb.group({
      nome: ['', [Validators.required]],
      descricao: ['']
    });

    this.formConteudo = this.fb.group({
      titulo: ['', [Validators.required]],
      tecnologiaId: ['', [Validators.required]],
      texto: ['', [Validators.required]],
      ordem: [1, [Validators.required, Validators.min(1)]]
    });

    this.formExemplo = this.fb.group({
      titulo: ['', [Validators.required]],
      conteudoId: ['', [Validators.required]],
      linguagem: ['', [Validators.required]],
      codigo: ['', [Validators.required]],
      explicacao: ['']
    });

    this.formUsuario = this.fb.group({
      nome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      perfil: ['usuario', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit() {
    this.dadosService.tecnologias$.subscribe(list => (this.tecnologias = list));
    this.dadosService.categorias$.subscribe(list => (this.categorias = list));
    this.dadosService.conteudos$.subscribe(list => (this.conteudos = list));
    this.dadosService.exemplos$.subscribe(list => (this.exemplos = list));
    this.dadosService.usuarios$.subscribe(list => (this.usuarios = list));
    this.route.paramMap.subscribe(params => {
      const secao = params.get('secao');
      const secoes: SecaoAdmin[] = ['usuarios', 'tecnologias', 'categorias', 'conteudos', 'exemplos'];
      if (!secao) {
        this.secaoAtiva = 'tecnologias';
      } else if (secoes.includes(secao as SecaoAdmin)) {
        this.secaoAtiva = secao as SecaoAdmin;
      } else {
        this.router.navigate(['/admin/tecnologias'], { replaceUrl: true });
      }
      this.filtroTabela = '';
    });
  }

  mudarSecao(secao: SecaoAdmin) {
    this.secaoAtiva = secao;
    this.filtroTabela = '';
    this.mensagemErro = '';
    this.router.navigate(['/admin', secao]);
  }

  sair() {
    this.authService.logout();
  }

  // Getters para títulos e rótulos
  get tituloSecao(): string {
    switch (this.secaoAtiva) {
      case 'tecnologias': return 'Gerenciamento de Tecnologias';
      case 'categorias': return 'Gerenciamento de Categorias';
      case 'conteudos': return 'Gerenciamento de Conteúdos & Assuntos';
      case 'exemplos': return 'Gerenciamento de Exemplos de Código';
      case 'usuarios': return 'Gerenciamento de Usuários';
    }
  }

  get descricaoSecao(): string {
    switch (this.secaoAtiva) {
      case 'tecnologias': return 'Cadastre, edite e vincule tecnologias às suas respectivas categorias.';
      case 'categorias': return 'Categorias temáticas que agrupam as linguagens e ferramentas.';
      case 'conteudos': return 'Tópicos detalhados exibidos no sumário da tela de cada tecnologia.';
      case 'exemplos': return 'Trechos de sintaxe e código exibidos nos blocos executáveis.';
      case 'usuarios': return 'Controle de contas cadastradas e permissões de acesso ao sistema.';
    }
  }

  get rotuloItemSingular(): string {
    switch (this.secaoAtiva) {
      case 'tecnologias': return 'Tecnologia';
      case 'categorias': return 'Categoria';
      case 'conteudos': return 'Conteúdo';
      case 'exemplos': return 'Exemplo';
      case 'usuarios': return 'Usuário';
    }
  }

  get rotuloItemPlural(): string {
    switch (this.secaoAtiva) {
      case 'tecnologias': return 'Tecnologias';
      case 'categorias': return 'Categorias';
      case 'conteudos': return 'Conteúdos';
      case 'exemplos': return 'Exemplos';
      case 'usuarios': return 'Usuários';
    }
  }

  // Filtros
  get tecnologiasFiltradas(): Tecnologia[] {
    const termo = this.filtroTabela.trim().toLowerCase();
    if (!termo) return this.tecnologias;
    return this.tecnologias.filter(t =>
      t.nome.toLowerCase().includes(termo) ||
      t.descricao.toLowerCase().includes(termo) ||
      (t.categoriaNome && t.categoriaNome.toLowerCase().includes(termo))
    );
  }

  get categoriasFiltradas(): Categoria[] {
    const termo = this.filtroTabela.trim().toLowerCase();
    if (!termo) return this.categorias;
    return this.categorias.filter(c =>
      c.nome.toLowerCase().includes(termo) ||
      c.descricao.toLowerCase().includes(termo)
    );
  }

  get conteudosFiltrados(): Conteudo[] {
    const termo = this.filtroTabela.trim().toLowerCase();
    if (!termo) return this.conteudos;
    return this.conteudos.filter(c =>
      c.titulo.toLowerCase().includes(termo) ||
      c.texto.toLowerCase().includes(termo)
    );
  }

  get exemplosFiltrados(): ExemploCodigo[] {
    const termo = this.filtroTabela.trim().toLowerCase();
    if (!termo) return this.exemplos;
    return this.exemplos.filter(e =>
      e.titulo.toLowerCase().includes(termo) ||
      e.linguagem.toLowerCase().includes(termo) ||
      e.codigo.toLowerCase().includes(termo)
    );
  }

  get usuariosFiltrados(): Usuario[] {
    const termo = this.filtroTabela.trim().toLowerCase();
    if (!termo) return this.usuarios;
    return this.usuarios.filter(u =>
      u.nome.toLowerCase().includes(termo) ||
      u.email.toLowerCase().includes(termo)
    );
  }

  get totalItensFiltrados(): number {
    switch (this.secaoAtiva) {
      case 'tecnologias': return this.tecnologiasFiltradas.length;
      case 'categorias': return this.categoriasFiltradas.length;
      case 'conteudos': return this.conteudosFiltrados.length;
      case 'exemplos': return this.exemplosFiltrados.length;
      case 'usuarios': return this.usuariosFiltrados.length;
    }
  }

  obterNomeTecnologia(tecnologiaId: string): string {
    const t = this.tecnologias.find(item => item.id === tecnologiaId);
    return t ? t.nome : 'N/A';
  }

  obterTituloConteudo(conteudoId: string): string {
    const c = this.conteudos.find(item => item.id === conteudoId);
    return c ? c.titulo : 'N/A';
  }

  isFormInvalido(form: FormGroup, campo: string): boolean {
    const control = form.get(campo);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Modais de Edição / Criação
  abrirModalCriacao() {
    this.editandoId = null;
    this.modalAberto = true;

    if (this.secaoAtiva === 'tecnologias') {
      this.formTecnologia.reset({
        nome: '',
        categoriaId: this.categorias[0]?.id || '',
        descricao: '',
        popular: false,
        recente: true
      });
    } else if (this.secaoAtiva === 'categorias') {
      this.formCategoria.reset({ nome: '', descricao: '' });
    } else if (this.secaoAtiva === 'conteudos') {
      this.formConteudo.reset({
        titulo: '',
        tecnologiaId: this.tecnologias[0]?.id || '',
        texto: '',
        ordem: this.conteudos.length + 1
      });
    } else if (this.secaoAtiva === 'exemplos') {
      this.formExemplo.reset({
        titulo: '',
        conteudoId: this.conteudos[0]?.id || '',
        linguagem: 'java',
        codigo: '',
        explicacao: ''
      });
    } else if (this.secaoAtiva === 'usuarios') {
      this.formUsuario.get('senha')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.formUsuario.get('senha')?.updateValueAndValidity();
      this.formUsuario.reset({
        nome: '',
        email: '',
        perfil: 'usuario',
        senha: ''
      });
    }
  }

  abrirModalEdicaoTecnologia(tec: Tecnologia) {
    this.editandoId = tec.id;
    this.modalAberto = true;
    this.formTecnologia.patchValue({
      nome: tec.nome,
      categoriaId: tec.categoriaId,
      descricao: tec.descricao,
      popular: tec.popular,
      recente: tec.recente
    });
  }

  abrirModalEdicaoCategoria(cat: Categoria) {
    this.editandoId = cat.id;
    this.modalAberto = true;
    this.formCategoria.patchValue({
      nome: cat.nome,
      descricao: cat.descricao
    });
  }

  abrirModalEdicaoConteudo(cnt: Conteudo) {
    this.editandoId = cnt.id;
    this.modalAberto = true;
    this.formConteudo.patchValue({
      titulo: cnt.titulo,
      tecnologiaId: cnt.tecnologiaId,
      texto: cnt.texto,
      ordem: cnt.ordem
    });
  }

  abrirModalEdicaoExemplo(ex: ExemploCodigo) {
    this.editandoId = ex.id;
    this.modalAberto = true;
    this.formExemplo.patchValue({
      titulo: ex.titulo,
      conteudoId: ex.conteudoId,
      linguagem: ex.linguagem,
      codigo: ex.codigo,
      explicacao: ex.explicacao || ''
    });
  }

  abrirModalEdicaoUsuario(usr: Usuario) {
    this.editandoId = usr.id;
    this.modalAberto = true;
    this.formUsuario.get('senha')?.clearValidators();
    this.formUsuario.get('senha')?.updateValueAndValidity();
    this.formUsuario.patchValue({
      nome: usr.nome,
      email: usr.email,
      perfil: usr.perfil,
      senha: ''
    });
  }

  fecharModal() {
    this.modalAberto = false;
    this.editandoId = null;
  }

  exibirSucesso(msg: string) {
    this.mensagemErro = '';
    this.mensagemSucesso = msg;
    setTimeout(() => {
      this.mensagemSucesso = '';
    }, 3500);
  }

  exibirErro(msg: string) {
    this.mensagemSucesso = '';
    this.mensagemErro = msg;
  }

  private mensagemDaFalha(error: unknown): string {
    return error instanceof Error ? error.message : 'Não foi possível concluir a ação. Tente novamente.';
  }

  get detalhesExclusao(): string {
    if (!this.itemParaExcluir) return '';
    const { tipo, id } = this.itemParaExcluir;
    if (tipo === 'categoria') {
      const quantidade = this.tecnologias.filter(tecnologia => tecnologia.categoriaId === id).length;
      return quantidade
        ? `Esta categoria possui ${quantidade} tecnologia(s) e não pode ser excluída enquanto houver vínculos.`
        : 'A categoria não possui tecnologias associadas.';
    }
    if (tipo === 'tecnologia') {
      const conteudos = this.conteudos.filter(conteudo => conteudo.tecnologiaId === id);
      const idsConteudos = new Set(conteudos.map(conteudo => conteudo.id));
      const exemplos = this.exemplos.filter(exemplo => idsConteudos.has(exemplo.conteudoId));
      return `Também serão excluídos ${conteudos.length} conteúdo(s) e ${exemplos.length} exemplo(s) de código associados.`;
    }
    if (tipo === 'conteudo') {
      const quantidade = this.exemplos.filter(exemplo => exemplo.conteudoId === id).length;
      return `Também serão excluídos ${quantidade} exemplo(s) de código associado(s).`;
    }
    return '';
  }

  get exclusaoBloqueada(): boolean {
    return this.itemParaExcluir?.tipo === 'categoria' &&
      this.tecnologias.some(tecnologia => tecnologia.categoriaId === this.itemParaExcluir?.id);
  }

  // Ações de Salvar
  salvarTecnologia() {
    if (this.formTecnologia.invalid) {
      this.formTecnologia.markAllAsTouched();
      return;
    }
    const val = this.formTecnologia.value;
    try {
      this.dadosService.salvarTecnologia({ id: this.editandoId || undefined, ...val });
      this.exibirSucesso(
        this.editandoId ? `Tecnologia "${val.nome}" atualizada com sucesso!` : `Tecnologia "${val.nome}" adicionada com sucesso!`
      );
      this.fecharModal();
    } catch (error) {
      this.exibirErro(this.mensagemDaFalha(error));
    }
  }

  salvarCategoria() {
    if (this.formCategoria.invalid) {
      this.formCategoria.markAllAsTouched();
      return;
    }
    const val = this.formCategoria.value;
    try {
      this.dadosService.salvarCategoria({ id: this.editandoId || undefined, ...val });
      this.exibirSucesso(
        this.editandoId ? `Categoria "${val.nome}" atualizada com sucesso!` : `Categoria "${val.nome}" adicionada com sucesso!`
      );
      this.fecharModal();
    } catch (error) {
      this.exibirErro(this.mensagemDaFalha(error));
    }
  }

  salvarConteudo() {
    if (this.formConteudo.invalid) {
      this.formConteudo.markAllAsTouched();
      return;
    }
    const val = this.formConteudo.value;
    try {
      this.dadosService.salvarConteudo({ id: this.editandoId || undefined, ...val });
      this.exibirSucesso(
        this.editandoId ? `Conteúdo "${val.titulo}" atualizado com sucesso!` : `Conteúdo "${val.titulo}" adicionado com sucesso!`
      );
      this.fecharModal();
    } catch (error) {
      this.exibirErro(this.mensagemDaFalha(error));
    }
  }

  salvarExemplo() {
    if (this.formExemplo.invalid) {
      this.formExemplo.markAllAsTouched();
      return;
    }
    const val = this.formExemplo.value;
    try {
      this.dadosService.salvarExemplo({ id: this.editandoId || undefined, ...val });
      this.exibirSucesso(
        this.editandoId ? `Exemplo "${val.titulo}" atualizado com sucesso!` : `Exemplo "${val.titulo}" adicionado com sucesso!`
      );
      this.fecharModal();
    } catch (error) {
      this.exibirErro(this.mensagemDaFalha(error));
    }
  }

  async salvarUsuario() {
    if (this.formUsuario.invalid) {
      this.formUsuario.markAllAsTouched();
      return;
    }
    const val = this.formUsuario.value;
    const atual = this.usuarios.find(usuario => usuario.id === this.editandoId);
    const outrosAdmins = this.usuarios.filter(usuario => usuario.perfil === 'admin' && usuario.id !== atual?.id);
    if (atual?.id === this.authService.usuarioAtual?.id && val.perfil !== 'admin' && outrosAdmins.length === 0) {
      this.exibirErro('Não é possível remover o perfil do único administrador cadastrado.');
      return;
    }
    try {
      const { senha, ...dadosUsuario } = val;
      const usuarioSalvo = this.dadosService.salvarUsuario({
        id: this.editandoId || undefined,
        ...dadosUsuario
      });
      if (!this.editandoId) {
        await this.authService.definirSenha(usuarioSalvo.id, senha);
      } else {
        this.authService.atualizarSessao(usuarioSalvo);
      }
      this.exibirSucesso(
        this.editandoId ? `Usuário "${val.nome}" atualizado com sucesso!` : `Usuário "${val.nome}" cadastrado com sucesso!`
      );
      this.fecharModal();
    } catch (error) {
      this.exibirErro(this.mensagemDaFalha(error));
    }
  }

  // Exclusão
  confirmarExclusao(tipo: TipoItemAdmin, id: string, nome: string) {
    this.mensagemErro = '';
    if (tipo === 'usuario' && id === this.authService.usuarioAtual?.id) {
      this.exibirErro('Não é possível excluir o usuário que está conectado.');
      return;
    }
    if (tipo === 'usuario') {
      const usuario = this.usuarios.find(item => item.id === id);
      const adminsRestantes = this.usuarios.filter(item => item.perfil === 'admin' && item.id !== id);
      if (usuario?.perfil === 'admin' && adminsRestantes.length === 0) {
        this.exibirErro('Não é possível excluir o único administrador cadastrado.');
        return;
      }
    }
    this.itemParaExcluir = { tipo, id, nome };
  }

  cancelarExclusao() {
    this.itemParaExcluir = null;
  }

  executarExclusao() {
    if (!this.itemParaExcluir) return;
    const { tipo, id, nome } = this.itemParaExcluir;

    try {
      if (tipo === 'tecnologia') {
        this.dadosService.excluirTecnologia(id);
      } else if (tipo === 'categoria') {
        if (!this.dadosService.excluirCategoria(id)) {
          this.exibirErro('Esta categoria ainda possui tecnologias. Remova ou realoque as tecnologias antes de excluí-la.');
          this.itemParaExcluir = null;
          return;
        }
      } else if (tipo === 'conteudo') {
        this.dadosService.excluirConteudo(id);
      } else if (tipo === 'exemplo') {
        this.dadosService.excluirExemplo(id);
      } else {
        this.dadosService.excluirUsuario(id);
      }

      this.exibirSucesso(`"${nome}" foi excluído com sucesso!`);
      this.itemParaExcluir = null;
    } catch (error) {
      this.exibirErro(this.mensagemDaFalha(error));
      this.itemParaExcluir = null;
    }
  }
}
export default AdminComponent;
