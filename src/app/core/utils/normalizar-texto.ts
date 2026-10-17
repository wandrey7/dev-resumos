/**
 * Normaliza um texto para comparação: minúsculas e sem acentos.
 *
 * Importante: o resultado tem SEMPRE o mesmo tamanho do texto original
 * (um caractere vira um caractere). Isso permite usar os índices do texto
 * normalizado para marcar o trecho correspondente no texto original
 * (ver DestacarTermoPipe).
 */
export function normalizarTexto(texto: string): string {
  let resultado = '';
  for (const caractere of texto) {
    const semAcento = caractere.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const minusculo = semAcento.toLowerCase();
    // Garante a regra "1 caractere -> 1 caractere" mesmo em casos raros do Unicode.
    resultado += minusculo.length === caractere.length ? minusculo : caractere;
  }
  return resultado;
}
