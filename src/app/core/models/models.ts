export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'usuario';
  senha?: string;
  criadoEm?: string;
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

export interface ResultadoPesquisa {
  tecnologia: Tecnologia;
  conteudo: Conteudo;
  exemplos: ExemploCodigo[];
  trechoRelevante: string;
}
