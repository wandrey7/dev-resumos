import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { PesquisaComponent } from './pesquisa.component';

const esperarBusca = () => new Promise((resolve) => setTimeout(resolve, 300));

describe('PesquisaComponent', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'pesquisa', component: PesquisaComponent }])],
    });
    harness = await RouterTestingHarness.create();
  });

  const tela = () => harness.routeNativeElement as HTMLElement;

  it('sem termo, mostra o estado inicial', async () => {
    await harness.navigateByUrl('/pesquisa', PesquisaComponent);
    expect(tela().textContent).toContain('O que você quer consultar?');
  });

  it('com 1 caractere, pede o mínimo de 2 e não busca', async () => {
    await harness.navigateByUrl('/pesquisa?q=a', PesquisaComponent);
    expect(tela().textContent).toContain('pelo menos 2 caracteres');
    expect(tela().querySelector('.arvore')).toBeNull();
  });

  it('mostra carregamento e depois a árvore, com campo preenchido e contagem', async () => {
    await harness.navigateByUrl('/pesquisa?q=ArrayList', PesquisaComponent);
    expect(tela().querySelector('.pesquisa-spinner')).not.toBeNull();

    await esperarBusca();
    harness.detectChanges();

    expect(tela().querySelector('.pesquisa-spinner')).toBeNull();
    expect(tela().querySelector('h1')?.textContent).toContain('Pesquisar: ArrayList');
    expect(tela().textContent).toContain('Resultados:');
    expect(tela().textContent).toContain('4 resultados');
    expect((tela().querySelector('#campo-pesquisa') as HTMLInputElement).value).toBe('ArrayList');
    expect(tela().querySelectorAll('.arvore-topico-link')).toHaveLength(3);
  });

  it('destaca o termo e liga cada item a /tecnologia/:slug#assunto', async () => {
    await harness.navigateByUrl('/pesquisa?q=ordenacao', PesquisaComponent);
    await esperarBusca();
    harness.detectChanges();

    const marcas = Array.from(tela().querySelectorAll('mark.search-highlight')).map((m) => m.textContent);
    expect(marcas).toContain('Ordenação');

    const link = tela().querySelector('.arvore-assunto-link') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/tecnologia/java#ordenacao');
    // o destaque não pode inserir espaços dentro da palavra
    expect(link.textContent?.trim()).toBe('Ordenação');
  });

  it('sem resultados, sugere ver as categorias', async () => {
    await harness.navigateByUrl('/pesquisa?q=zzz', PesquisaComponent);
    await esperarBusca();
    harness.detectChanges();

    expect(tela().textContent).toContain("Nenhum resultado para 'zzz'");
    const link = tela().querySelector('a[href="/categorias"]');
    expect(link).not.toBeNull();
  });
});
