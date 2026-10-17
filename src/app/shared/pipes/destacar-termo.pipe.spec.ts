import { DestacarTermoPipe } from './destacar-termo.pipe';

describe('DestacarTermoPipe', () => {
  const pipe = new DestacarTermoPipe();
  const montar = (texto: string, termo: string) =>
    pipe.transform(texto, termo).map((s) => (s.destaque ? `[${s.texto}]` : s.texto)).join('');

  it('marca o termo preservando o texto original', () => {
    expect(montar('Criando um ArrayList', 'array')).toBe('Criando um [Array]List');
  });

  it('ignora maiúsculas e acentos', () => {
    expect(montar('Ordenação de listas', 'ordenacao')).toBe('[Ordenação] de listas');
    expect(montar('Ordenacao', 'ORDENAÇÃO')).toBe('[Ordenacao]');
  });

  it('marca todas as ocorrências', () => {
    expect(montar('Array de arrays', 'array')).toBe('[Array] de [array]s');
  });

  it('não altera o texto quando não há termo ou ocorrência', () => {
    expect(montar('Java', '')).toBe('Java');
    expect(montar('Java', 'python')).toBe('Java');
    expect(pipe.transform('', 'java')).toEqual([]);
    expect(pipe.transform(null, 'java')).toEqual([]);
  });

  it('não interpreta HTML (devolve só texto)', () => {
    const segmentos = pipe.transform('<b>tag</b>', 'tag');
    expect(segmentos.map((s) => s.texto).join('')).toBe('<b>tag</b>');
  });
});
