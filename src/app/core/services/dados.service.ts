import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Categoria, Conteudo, ExemploCodigo, Tecnologia } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DadosService {
  private readonly categoriasSubject = new BehaviorSubject<Categoria[]>([
    {
      id: 'c-linguagens',
      nome: 'Linguagens',
      slug: 'linguagens',
      descricao: 'Linguagens de programação e desenvolvimento.',
      ordem: 1,
    },
    {
      id: 'c-bancos',
      nome: 'Bancos de Dados',
      slug: 'bancos-de-dados',
      descricao: 'Consulta e manipulação de dados.',
      ordem: 2,
    },
    {
      id: 'c-web',
      nome: 'Web',
      slug: 'web',
      descricao: 'Tecnologias para desenvolvimento web.',
      ordem: 3,
    },
  ]);

  private readonly tecnologiasSubject = new BehaviorSubject<Tecnologia[]>([
    { id: 't-java', nome: 'Java', slug: 'java', descricao: 'Linguagem orientada a objetos, fortemente tipada.', categoriaId: 'c-linguagens', categoriaNome: 'Linguagens', popular: true, recente: false, versao: '21' },
    { id: 't-js', nome: 'JavaScript', slug: 'javascript', descricao: 'Linguagem da web, no navegador e no servidor.', categoriaId: 'c-linguagens', categoriaNome: 'Linguagens', popular: true, recente: false, versao: 'ES2024' },
    { id: 't-python', nome: 'Python', slug: 'python', descricao: 'Linguagem simples e versátil para scripts, dados e web.', categoriaId: 'c-linguagens', categoriaNome: 'Linguagens', popular: true, recente: false, versao: '3.13' },
    { id: 't-sql', nome: 'SQL', slug: 'sql', descricao: 'Linguagem para consultar e manipular bancos de dados relacionais.', categoriaId: 'c-bancos', categoriaNome: 'Bancos de Dados', popular: true, recente: false },
    { id: 't-html', nome: 'HTML', slug: 'html', descricao: 'Linguagem de marcação para estruturar páginas web.', categoriaId: 'c-web', categoriaNome: 'Web', popular: false, recente: true, versao: '5' },
  ]);

  private readonly conteudosSubject = new BehaviorSubject<Conteudo[]>([
    { id: 'c-java-arraylist', tecnologiaId: 't-java', titulo: 'ArrayList', slug: 'arraylist', texto: 'Lista dinâmica da API de coleções do Java.', ordem: 1 },
    { id: 'c-java-ordenacao', tecnologiaId: 't-java', titulo: 'Ordenação', slug: 'ordenacao', texto: 'Como ordenar listas e arrays em Java.', ordem: 2 },
    { id: 'c-js-array', tecnologiaId: 't-js', titulo: 'Array', slug: 'array', texto: 'Estrutura para guardar coleções de valores.', ordem: 1 },
    { id: 'c-js-funcoes', tecnologiaId: 't-js', titulo: 'Funções', slug: 'funcoes', texto: 'Declaração e uso de funções.', ordem: 2 },
    { id: 'c-py-listas', tecnologiaId: 't-python', titulo: 'Listas', slug: 'listas', texto: 'Sequências mutáveis de valores.', ordem: 1 },
    { id: 'c-py-ordenacao', tecnologiaId: 't-python', titulo: 'Ordenação de listas', slug: 'ordenacao-de-listas', texto: 'Ordenando listas com sorted() e sort().', ordem: 2 },
    { id: 'c-sql-select', tecnologiaId: 't-sql', titulo: 'SELECT', slug: 'select', texto: 'Consulta de dados em tabelas.', ordem: 1 },
    { id: 'c-sql-join', tecnologiaId: 't-sql', titulo: 'JOIN', slug: 'join', texto: 'Combinação de linhas de duas ou mais tabelas.', ordem: 2 },
    { id: 'c-html-formularios', tecnologiaId: 't-html', titulo: 'Formulários', slug: 'formularios', texto: 'Campos e botões para entrada de dados.', ordem: 1 },
  ]);

  private readonly exemplosSubject = new BehaviorSubject<ExemploCodigo[]>([
    { id: 'e-java-1', conteudoId: 'c-java-arraylist', titulo: 'Criando um ArrayList', linguagem: 'java', codigo: 'ArrayList<String> nomes = new ArrayList<>();' },
    { id: 'e-java-2', conteudoId: 'c-java-arraylist', titulo: 'Adicionando elementos', linguagem: 'java', codigo: 'nomes.add("Ana");' },
    { id: 'e-java-3', conteudoId: 'c-java-arraylist', titulo: 'Removendo elementos', linguagem: 'java', codigo: 'nomes.remove("Ana");' },
    { id: 'e-java-4', conteudoId: 'c-java-ordenacao', titulo: 'Ordenando com Collections.sort', linguagem: 'java', codigo: 'Collections.sort(nomes);' },
    { id: 'e-js-1', conteudoId: 'c-js-array', titulo: 'Métodos de Array', linguagem: 'javascript', codigo: '[1, 2, 3].map((n) => n * 2);' },
    { id: 'e-js-2', conteudoId: 'c-js-array', titulo: 'Criando um array', linguagem: 'javascript', codigo: 'const nomes = ["Ana", "Bruno"];' },
    { id: 'e-js-3', conteudoId: 'c-js-funcoes', titulo: 'Arrow functions', linguagem: 'javascript', codigo: 'const somar = (a, b) => a + b;' },
    { id: 'e-py-1', conteudoId: 'c-py-listas', titulo: 'Criando uma lista', linguagem: 'python', codigo: 'nomes = ["Ana", "Bruno"]' },
    { id: 'e-py-2', conteudoId: 'c-py-ordenacao', titulo: 'Usando sorted()', linguagem: 'python', codigo: 'sorted(nomes)' },
    { id: 'e-sql-1', conteudoId: 'c-sql-select', titulo: 'Selecionando colunas', linguagem: 'sql', codigo: 'SELECT nome, email FROM usuarios;' },
    { id: 'e-sql-2', conteudoId: 'c-sql-join', titulo: 'INNER JOIN', linguagem: 'sql', codigo: 'SELECT * FROM a INNER JOIN b ON a.id = b.a_id;' },
    { id: 'e-html-1', conteudoId: 'c-html-formularios', titulo: 'Campo de texto e botão', linguagem: 'html', codigo: '<input type="text"><button>Enviar</button>' },
  ]);

  constructor() {
    this.restaurarLista('devresumos_categorias', this.categoriasSubject);
    this.restaurarLista('devresumos_tecnologias', this.tecnologiasSubject);
    this.restaurarLista('devresumos_conteudos', this.conteudosSubject);
    this.restaurarLista('devresumos_exemplos', this.exemplosSubject);
  }

  readonly categorias$: Observable<Categoria[]> = this.categoriasSubject.asObservable();
  readonly tecnologias$: Observable<Tecnologia[]> = this.tecnologiasSubject.asObservable();
  readonly conteudos$: Observable<Conteudo[]> = this.conteudosSubject.asObservable();
  readonly exemplos$: Observable<ExemploCodigo[]> = this.exemplosSubject.asObservable();

  getCategorias(): Categoria[] {
    return this.categoriasSubject.getValue();
  }

  getCategoriaBySlug(slug: string): Categoria | undefined {
    return this.getCategorias().find((categoria) => categoria.slug.toLowerCase() === slug.toLowerCase());
  }

  getTecnologias(): Tecnologia[] {
    return this.tecnologiasSubject.getValue();
  }

  getTecnologiasPopulares(): Tecnologia[] {
    return this.getTecnologias().filter((tecnologia) => tecnologia.popular);
  }

  getTecnologiasRecentes(): Tecnologia[] {
    return this.getTecnologias().filter((tecnologia) => tecnologia.recente);
  }

  getTecnologiaBySlug(slug: string): Tecnologia | undefined {
    return this.getTecnologias().find((tecnologia) => tecnologia.slug.toLowerCase() === slug.toLowerCase());
  }

  getTecnologiasByCategoriaId(categoriaId: string): Tecnologia[] {
    return this.getTecnologias().filter((tecnologia) => tecnologia.categoriaId === categoriaId);
  }

  getConteudos(): Conteudo[] {
    return this.conteudosSubject.getValue();
  }

  getConteudosByTecnologiaId(tecnologiaId: string): Conteudo[] {
    return this.getConteudos()
      .filter((conteudo) => conteudo.tecnologiaId === tecnologiaId)
      .sort((a, b) => a.ordem - b.ordem);
  }

  getExemplos(): ExemploCodigo[] {
    return this.exemplosSubject.getValue();
  }

  getExemplosByConteudoId(conteudoId: string): ExemploCodigo[] {
    return this.getExemplos().filter((exemplo) => exemplo.conteudoId === conteudoId);
  }

  salvarTecnologia(dados: Partial<Tecnologia>): Tecnologia {
    const tecnologias = [...this.getTecnologias()];
    const categoria = this.getCategorias().find((item) => item.id === dados.categoriaId);
    const indice = dados.id ? tecnologias.findIndex((item) => item.id === dados.id) : -1;

    if (indice >= 0) {
      const atualizada = {
        ...tecnologias[indice],
        ...dados,
        categoriaNome: categoria?.nome ?? tecnologias[indice].categoriaNome,
      };
      tecnologias[indice] = atualizada;
      this.publicarLista('devresumos_tecnologias', this.tecnologiasSubject, tecnologias);
      return atualizada;
    }

    const nova: Tecnologia = {
      ...dados,
      id: this.novoId('tec'),
      nome: dados.nome || 'Nova Tecnologia',
      slug: dados.slug || this.slug(dados.nome || 'nova-tecnologia'),
      descricao: dados.descricao || '',
      categoriaId: dados.categoriaId || this.getCategorias()[0]?.id || '',
      categoriaNome: categoria?.nome || 'Geral',
      popular: dados.popular ?? false,
      recente: dados.recente ?? true,
      resumo: dados.resumo || dados.descricao || '',
      versao: dados.versao || '',
    };
    tecnologias.unshift(nova);
    this.publicarLista('devresumos_tecnologias', this.tecnologiasSubject, tecnologias);
    return nova;
  }

  excluirTecnologia(id: string): void {
    const conteudosRemovidos = this.getConteudos().filter((conteudo) => conteudo.tecnologiaId === id);
    const idsConteudos = new Set(conteudosRemovidos.map((conteudo) => conteudo.id));
    this.publicarLista(
      'devresumos_exemplos',
      this.exemplosSubject,
      this.getExemplos().filter((exemplo) => !idsConteudos.has(exemplo.conteudoId)),
    );
    this.publicarLista(
      'devresumos_conteudos',
      this.conteudosSubject,
      this.getConteudos().filter((conteudo) => conteudo.tecnologiaId !== id),
    );
    this.publicarLista(
      'devresumos_tecnologias',
      this.tecnologiasSubject,
      this.getTecnologias().filter((tecnologia) => tecnologia.id !== id),
    );
  }

  salvarCategoria(dados: Partial<Categoria>): Categoria {
    const categorias = [...this.getCategorias()];
    const indice = dados.id ? categorias.findIndex((item) => item.id === dados.id) : -1;

    if (indice >= 0) {
      const atualizada = { ...categorias[indice], ...dados };
      categorias[indice] = atualizada;
      this.publicarLista(
        'devresumos_tecnologias',
        this.tecnologiasSubject,
        this.getTecnologias().map((tecnologia) =>
          tecnologia.categoriaId === atualizada.id
            ? { ...tecnologia, categoriaNome: atualizada.nome }
            : tecnologia,
        ),
      );
      this.publicarLista('devresumos_categorias', this.categoriasSubject, categorias);
      return atualizada;
    }

    const nova: Categoria = {
      ...dados,
      id: this.novoId('cat'),
      nome: dados.nome || 'Nova Categoria',
      slug: dados.slug || this.slug(dados.nome || 'nova-categoria'),
      descricao: dados.descricao || '',
      icone: dados.icone || 'folder',
      ordem: dados.ordem ?? categorias.length + 1,
    };
    categorias.push(nova);
    this.publicarLista('devresumos_categorias', this.categoriasSubject, categorias);
    return nova;
  }

  excluirCategoria(id: string): boolean {
    if (this.getTecnologias().some((tecnologia) => tecnologia.categoriaId === id)) return false;
    this.publicarLista(
      'devresumos_categorias',
      this.categoriasSubject,
      this.getCategorias().filter((categoria) => categoria.id !== id),
    );
    return true;
  }

  salvarConteudo(dados: Partial<Conteudo>): Conteudo {
    const conteudos = [...this.getConteudos()];
    const indice = dados.id ? conteudos.findIndex((item) => item.id === dados.id) : -1;

    if (indice >= 0) {
      const atualizado = { ...conteudos[indice], ...dados };
      conteudos[indice] = atualizado;
      this.publicarLista('devresumos_conteudos', this.conteudosSubject, conteudos);
      return atualizado;
    }

    const novo: Conteudo = {
      ...dados,
      id: this.novoId('cnt'),
      tecnologiaId: dados.tecnologiaId || this.getTecnologias()[0]?.id || '',
      titulo: dados.titulo || 'Novo Assunto',
      slug: dados.slug || this.slug(dados.titulo || 'novo-assunto'),
      texto: dados.texto || '',
      ordem: dados.ordem ?? conteudos.length + 1,
    };
    conteudos.push(novo);
    this.publicarLista('devresumos_conteudos', this.conteudosSubject, conteudos);
    return novo;
  }

  excluirConteudo(id: string): void {
    this.publicarLista(
      'devresumos_exemplos',
      this.exemplosSubject,
      this.getExemplos().filter((exemplo) => exemplo.conteudoId !== id),
    );
    this.publicarLista(
      'devresumos_conteudos',
      this.conteudosSubject,
      this.getConteudos().filter((conteudo) => conteudo.id !== id),
    );
  }

  salvarExemplo(dados: Partial<ExemploCodigo>): ExemploCodigo {
    const exemplos = [...this.getExemplos()];
    const indice = dados.id ? exemplos.findIndex((item) => item.id === dados.id) : -1;

    if (indice >= 0) {
      const atualizado = { ...exemplos[indice], ...dados };
      exemplos[indice] = atualizado;
      this.publicarLista('devresumos_exemplos', this.exemplosSubject, exemplos);
      return atualizado;
    }

    const novo: ExemploCodigo = {
      ...dados,
      id: this.novoId('ex'),
      conteudoId: dados.conteudoId || this.getConteudos()[0]?.id || '',
      titulo: dados.titulo || 'Novo Exemplo',
      linguagem: dados.linguagem || 'text',
      codigo: dados.codigo || '',
      explicacao: dados.explicacao || '',
    };
    exemplos.push(novo);
    this.publicarLista('devresumos_exemplos', this.exemplosSubject, exemplos);
    return novo;
  }

  excluirExemplo(id: string): void {
    this.publicarLista(
      'devresumos_exemplos',
      this.exemplosSubject,
      this.getExemplos().filter((exemplo) => exemplo.id !== id),
    );
  }

  private restaurarLista<T>(chave: string, subject: BehaviorSubject<T[]>): void {
    if (typeof window === 'undefined') return;

    try {
      const salvo = window.localStorage.getItem(chave);
      if (!salvo) return;
      const dados: unknown = JSON.parse(salvo);
      if (!Array.isArray(dados)) throw new Error(`Os dados salvos em "${chave}" não são uma lista.`);
      subject.next(dados as T[]);
    } catch (error) {
      console.error(`Não foi possível restaurar "${chave}". Os dados iniciais serão usados.`, error);
      window.localStorage.removeItem(chave);
    }
  }

  private publicarLista<T>(chave: string, subject: BehaviorSubject<T[]>, lista: T[]): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(chave, JSON.stringify(lista));
      } catch (error) {
        console.error(`Não foi possível salvar "${chave}".`, error);
        throw new Error('Não foi possível salvar os dados. Verifique o armazenamento do navegador e tente novamente.');
      }
    }
    subject.next(lista);
  }

  private novoId(prefixo: string): string {
    return `${prefixo}-${crypto.randomUUID()}`;
  }

  private slug(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
