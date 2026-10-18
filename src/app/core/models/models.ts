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
