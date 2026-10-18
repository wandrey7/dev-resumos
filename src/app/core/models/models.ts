export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'usuario';
  criadoEm: string;
}

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  icone?: string;
  ordem?: number;
}

export interface Tecnologia {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  categoriaId: string;
  categoriaNome?: string;
  popular: boolean;
  recente: boolean;
  icone?: string;
  resumo?: string;
  versao?: string;
}

export interface Conteudo {
  id: string;
  tecnologiaId: string;
  titulo: string;
  /** Usado como âncora na Tela de tecnologia: /tecnologia/:slug#<slug> */
  slug: string;
  texto: string;
  ordem: number;
}

export interface ExemploCodigo {
  id: string;
  conteudoId: string;
  titulo: string;
  linguagem: string;
  codigo: string;
  explicacao?: string;
}

/* ---- Resultado da pesquisa (árvore Tecnologia -> Assunto -> Tópico) ---- */

/** Tópico = ExemploCodigo */
export interface NoTopico {
  exemploId: string;
  titulo: string;
}

/** Assunto = Conteudo */
export interface NoAssunto {
  conteudoId: string;
  titulo: string;
  slug: string;
  topicos: NoTopico[];
}

export interface NoTecnologia {
  tecnologiaId: string;
  nome: string;
  slug: string;
  assuntos: NoAssunto[];
}

export interface ResultadoPesquisa {
  /** Termo já sem espaços nas pontas. */
  termo: string;
  grupos: NoTecnologia[];
  /** Total de itens listados: cada assunto e cada tópico exibido conta 1. */
  total: number;
}
