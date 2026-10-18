import { Pipe, PipeTransform } from '@angular/core';
import { normalizarTexto } from '../../core/utils/normalizar-texto';

export interface SegmentoTexto {
  texto: string;
  destaque: boolean;
}

/**
 * Divide um texto em segmentos, marcando as ocorrências do termo buscado
 * (ignorando maiúsculas e acentos). O texto original é preservado.
 *
 * Devolve segmentos em vez de HTML: o template renderiza com @for e <mark>,
 * sem innerHTML nem DomSanitizer (sem risco de XSS).
 */
@Pipe({ name: 'destacarTermo', standalone: true })
export class DestacarTermoPipe implements PipeTransform {
  transform(texto: string | null | undefined, termo: string | null | undefined): SegmentoTexto[] {
    const original = texto ?? '';
    const alvo = normalizarTexto((termo ?? '').trim());

    if (!original || !alvo) {
      return original ? [{ texto: original, destaque: false }] : [];
    }

    const normalizado = normalizarTexto(original);
    const segmentos: SegmentoTexto[] = [];
    let cursor = 0;

    while (cursor < original.length) {
      const indice = normalizado.indexOf(alvo, cursor);
      if (indice === -1) {
        break;
      }
      if (indice > cursor) {
        segmentos.push({ texto: original.slice(cursor, indice), destaque: false });
      }
      segmentos.push({ texto: original.slice(indice, indice + alvo.length), destaque: true });
      cursor = indice + alvo.length;
    }

    if (cursor < original.length) {
      segmentos.push({ texto: original.slice(cursor), destaque: false });
    }

    return segmentos;
  }
}
