import { DadosService } from './dados.service';

describe('DadosService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('preserva o conjunto de dados usado pela pesquisa', () => {
    const dados = new DadosService();

    expect(dados.getConteudos().find((conteudo) => conteudo.id === 'c-java-arraylist')?.slug).toBe('arraylist');
    expect(dados.getExemplos().filter((exemplo) => exemplo.conteudoId === 'c-java-arraylist')).toHaveLength(3);
  });

  it('persiste CRUD e mantém a categoria vinculada à tecnologia', () => {
    const dados = new DadosService();
    const categoria = dados.salvarCategoria({
      nome: 'Rust e sistemas',
      descricao: 'Linguagens de sistemas',
    });
    const tecnologia = dados.salvarTecnologia({
      nome: 'Rust',
      categoriaId: categoria.id,
      descricao: 'Linguagem de sistemas',
    });

    expect(tecnologia.id).toBeTruthy();
    expect(tecnologia.slug).toBe('rust');
    expect(tecnologia.categoriaNome).toBe(categoria.nome);
    expect(dados.excluirCategoria(categoria.id)).toBe(false);

    const restaurados = new DadosService();
    expect(restaurados.getCategorias().some((item) => item.id === categoria.id)).toBe(true);

    dados.salvarCategoria({ id: categoria.id, nome: 'Sistemas' });
    expect(dados.getTecnologias().find((item) => item.id === tecnologia.id)?.categoriaNome).toBe('Sistemas');
  });

  it('remove conteúdos e exemplos associados ao excluir uma tecnologia', () => {
    const dados = new DadosService();
    const tecnologia = dados.salvarTecnologia({
      nome: 'Rust',
      categoriaId: 'c-linguagens',
      descricao: 'Linguagem de sistemas',
    });
    const conteudo = dados.salvarConteudo({
      tecnologiaId: tecnologia.id,
      titulo: 'Ownership',
      texto: 'Regras de propriedade',
      ordem: 1,
    });
    const exemplo = dados.salvarExemplo({
      conteudoId: conteudo.id,
      titulo: 'Borrow',
      linguagem: 'rust',
      codigo: 'let x = 1;',
    });

    dados.excluirTecnologia(tecnologia.id);

    expect(dados.getTecnologias().some((item) => item.id === tecnologia.id)).toBe(false);
    expect(dados.getConteudos().some((item) => item.id === conteudo.id)).toBe(false);
    expect(dados.getExemplos().some((item) => item.id === exemplo.id)).toBe(false);
  });
});
