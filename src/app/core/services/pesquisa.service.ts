import { Injectable, inject } from '@angular/core';
import {
  Conteudo,
  ExemploCodigo,
  NoAssunto,
  NoTecnologia,
  ResultadoPesquisa,
  Tecnologia,
} from '../models/models';
import { normalizarTexto } from '../utils/normalizar-texto';
import { DadosService } from './dados.service';

/** Mínimo de caracteres (sem contar espaços nas pontas) para executar a busca. */
export const MIN_CARACTERES_BUSCA = 2;

export interface BaseDePesquisa {
  tecnologias: Tecnologia[];
  conteudos: Conteudo[];
  exemplos: ExemploCodigo[];
}

export function termoValido(termo: string): boolean {
  return termo.trim().length >= MIN_CARACTERES_BUSCA;
}

/**
 * Busca pura (sem Angular, sem DOM): fácil de testar.
 *
 * Procura SOMENTE em nome de tecnologia, título de conteúdo (assunto) e título
 * de exemplo (tópico), ignorando maiúsculas e acentos.
 *
 * - Nome da tecnologia bate  -> lista todos os assuntos dela, com todos os tópicos.
 * - Título do assunto bate   -> lista o assunto com todos os seus tópicos.
 * - Só título do tópico bate -> lista o assunto pai com apenas os tópicos que batem.
 *
 * Contagem (`total`): cada assunto e cada tópico listado conta 1.
 */
export function pesquisar(termoBruto: string, base: BaseDePesquisa): ResultadoPesquisa {
  const termo = termoBruto.trim();
  if (!termoValido(termo)) {
    return { termo, grupos: [], total: 0 };
  }

  const alvo = normalizarTexto(termo);
  const bate = (texto: string) => normalizarTexto(texto).includes(alvo);

  const grupos: NoTecnologia[] = [];
  let total = 0;

  for (const tecnologia of base.tecnologias) {
    const tecnologiaBate = bate(tecnologia.nome);
    const assuntos: NoAssunto[] = [];

    const conteudos = base.conteudos
      .filter((c) => c.tecnologiaId === tecnologia.id)
      .sort((a, b) => a.ordem - b.ordem);

    for (const conteudo of conteudos) {
      const exemplos = base.exemplos.filter((e) => e.conteudoId === conteudo.id);
      const assuntoCompleto = tecnologiaBate || bate(conteudo.titulo);
      const exemplosVisiveis = assuntoCompleto ? exemplos : exemplos.filter((e) => bate(e.titulo));

      if (!assuntoCompleto && exemplosVisiveis.length === 0) {
        continue;
      }

      assuntos.push({
        conteudoId: conteudo.id,
        titulo: conteudo.titulo,
        slug: conteudo.slug,
        topicos: exemplosVisiveis.map((e) => ({ exemploId: e.id, titulo: e.titulo })),
      });
      total += 1 + exemplosVisiveis.length;
    }

    if (assuntos.length > 0) {
      grupos.push({
        tecnologiaId: tecnologia.id,
        nome: tecnologia.nome,
        slug: tecnologia.slug,
        assuntos,
      });
    }
  }

  return { termo, grupos, total };
}

@Injectable({ providedIn: 'root' })
export class PesquisaService {
  private readonly dados = inject(DadosService);

  buscar(termo: string): ResultadoPesquisa {
    return pesquisar(termo, {
      tecnologias: this.dados.getTecnologias(),
      conteudos: this.dados.getConteudos(),
      exemplos: this.dados.getExemplos(),
    });
  }
}
