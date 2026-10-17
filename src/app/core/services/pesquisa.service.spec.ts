import { TestBed } from '@angular/core/testing';
import { MIN_CARACTERES_BUSCA, PesquisaService, pesquisar, termoValido } from './pesquisa.service';
import { DadosService } from './dados.service';

describe('pesquisar (função pura)', () => {
  const dados = new DadosService();
  const base = {
    tecnologias: dados.getTecnologias(),
    conteudos: dados.getConteudos(),
    exemplos: dados.getExemplos(),
  };

  it('exige no mínimo 2 caracteres (ignorando espaços nas pontas)', () => {
    expect(MIN_CARACTERES_BUSCA).toBe(2);
    expect(termoValido('a')).toBe(false);
    expect(termoValido('  a  ')).toBe(false);
    expect(termoValido('ja')).toBe(true);
    expect(pesquisar('a', base)).toEqual({ termo: 'a', grupos: [], total: 0 });
    expect(pesquisar('   ', base).grupos).toEqual([]);
  });

  it('monta a árvore Tecnologia -> Assunto -> Tópico (caso ArrayList)', () => {
    const res = pesquisar('ArrayList', base);
    expect(res.grupos).toHaveLength(1);

    const java = res.grupos[0];
    expect(java.nome).toBe('Java');
    expect(java.assuntos).toHaveLength(1);
    expect(java.assuntos[0].titulo).toBe('ArrayList');
    expect(java.assuntos[0].topicos.map((t) => t.titulo)).toEqual([
      'Criando um ArrayList',
      'Adicionando elementos',
      'Removendo elementos',
    ]);
    // 1 assunto + 3 tópicos
    expect(res.total).toBe(4);
  });

  it('ignora maiúsculas/minúsculas', () => {
    expect(pesquisar('ARRAYLIST', base).total).toBe(pesquisar('arraylist', base).total);
    expect(pesquisar('arraylist', base).total).toBeGreaterThan(0);
  });

  it('ignora acentos nos dois sentidos ("ordenacao" encontra "Ordenação")', () => {
    const semAcento = pesquisar('ordenacao', base);
    const comAcento = pesquisar('Ordenação', base);
    expect(semAcento.total).toBeGreaterThan(0);
    expect(semAcento).toEqual({ ...comAcento, termo: 'ordenacao' });
    const titulos = semAcento.grupos.flatMap((g) => g.assuntos.map((a) => a.titulo));
    expect(titulos).toContain('Ordenação');
  });

  it('agrupa os resultados por tecnologia', () => {
    const res = pesquisar('ordenacao', base);
    expect(res.grupos.map((g) => g.nome)).toEqual(['Java', 'Python']);
  });

  it('nome da tecnologia traz todos os assuntos e tópicos dela', () => {
    const res = pesquisar('Java', base);
    const java = res.grupos.find((g) => g.slug === 'java');
    expect(java?.assuntos.map((a) => a.titulo)).toEqual(['ArrayList', 'Ordenação']);
    expect(java?.assuntos[0].topicos).toHaveLength(3);
  });

  it('título de exemplo traz o assunto pai só com os tópicos que batem', () => {
    const res = pesquisar('Removendo', base);
    expect(res.grupos).toHaveLength(1);
    const assunto = res.grupos[0].assuntos[0];
    expect(assunto.slug).toBe('arraylist');
    expect(assunto.topicos.map((t) => t.titulo)).toEqual(['Removendo elementos']);
    expect(res.total).toBe(2);
  });

  it('não busca no texto do conteúdo nem no código', () => {
    // "dinâmica" só aparece no texto do conteúdo; "nomes.add" só no código.
    expect(pesquisar('dinamica', base).total).toBe(0);
    expect(pesquisar('nomes.add', base).total).toBe(0);
  });

  it('devolve zero resultados quando nada bate', () => {
    const res = pesquisar('zzz', base);
    expect(res.total).toBe(0);
    expect(res.grupos).toEqual([]);
    expect(res.termo).toBe('zzz');
  });
});

describe('PesquisaService', () => {
  it('busca usando os dados do DadosService', () => {
    TestBed.configureTestingModule({});
    const servico = TestBed.inject(PesquisaService);
    expect(servico.buscar('  JavaScript ').grupos[0].nome).toBe('JavaScript');
  });
});
