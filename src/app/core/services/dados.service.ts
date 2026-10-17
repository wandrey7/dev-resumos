import { Injectable } from '@angular/core';
import { Conteudo, ExemploCodigo, Tecnologia } from '../models/models';

// ponytail: serviço MÍNIMO, só com dados de exemplo para a Tela de pesquisa funcionar.
// Quando o DadosService completo do projeto for portado, ele substitui este arquivo —
// a API pública (getTecnologias / getConteudos / getExemplos) foi mantida simples
// para facilitar essa troca.
@Injectable({ providedIn: 'root' })
export class DadosService {
  private readonly tecnologias: Tecnologia[] = [
    { id: 't-java', nome: 'Java', slug: 'java', descricao: 'Linguagem orientada a objetos, fortemente tipada.', categoriaId: 'c-linguagens', categoriaNome: 'Linguagens', popular: true, recente: false, versao: '21' },
    { id: 't-js', nome: 'JavaScript', slug: 'javascript', descricao: 'Linguagem da web, no navegador e no servidor.', categoriaId: 'c-linguagens', categoriaNome: 'Linguagens', popular: true, recente: false, versao: 'ES2024' },
    { id: 't-python', nome: 'Python', slug: 'python', descricao: 'Linguagem simples e versátil para scripts, dados e web.', categoriaId: 'c-linguagens', categoriaNome: 'Linguagens', popular: true, recente: false, versao: '3.13' },
    { id: 't-sql', nome: 'SQL', slug: 'sql', descricao: 'Linguagem para consultar e manipular bancos de dados relacionais.', categoriaId: 'c-bancos', categoriaNome: 'Bancos de Dados', popular: true, recente: false },
    { id: 't-html', nome: 'HTML', slug: 'html', descricao: 'Linguagem de marcação para estruturar páginas web.', categoriaId: 'c-web', categoriaNome: 'Web', popular: false, recente: true, versao: '5' },
  ];

  private readonly conteudos: Conteudo[] = [
    { id: 'c-java-arraylist', tecnologiaId: 't-java', titulo: 'ArrayList', slug: 'arraylist', texto: 'Lista dinâmica da API de coleções do Java.', ordem: 1 },
    { id: 'c-java-ordenacao', tecnologiaId: 't-java', titulo: 'Ordenação', slug: 'ordenacao', texto: 'Como ordenar listas e arrays em Java.', ordem: 2 },
    { id: 'c-js-array', tecnologiaId: 't-js', titulo: 'Array', slug: 'array', texto: 'Estrutura para guardar coleções de valores.', ordem: 1 },
    { id: 'c-js-funcoes', tecnologiaId: 't-js', titulo: 'Funções', slug: 'funcoes', texto: 'Declaração e uso de funções.', ordem: 2 },
    { id: 'c-py-listas', tecnologiaId: 't-python', titulo: 'Listas', slug: 'listas', texto: 'Sequências mutáveis de valores.', ordem: 1 },
    { id: 'c-py-ordenacao', tecnologiaId: 't-python', titulo: 'Ordenação de listas', slug: 'ordenacao-de-listas', texto: 'Ordenando listas com sorted() e sort().', ordem: 2 },
    { id: 'c-sql-select', tecnologiaId: 't-sql', titulo: 'SELECT', slug: 'select', texto: 'Consulta de dados em tabelas.', ordem: 1 },
    { id: 'c-sql-join', tecnologiaId: 't-sql', titulo: 'JOIN', slug: 'join', texto: 'Combinação de linhas de duas ou mais tabelas.', ordem: 2 },
    { id: 'c-html-formularios', tecnologiaId: 't-html', titulo: 'Formulários', slug: 'formularios', texto: 'Campos e botões para entrada de dados.', ordem: 1 },
  ];

  private readonly exemplos: ExemploCodigo[] = [
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
  ];

  getTecnologias(): Tecnologia[] {
    return this.tecnologias;
  }

  getConteudos(): Conteudo[] {
    return this.conteudos;
  }

  getExemplos(): ExemploCodigo[] {
    return this.exemplos;
  }
}
