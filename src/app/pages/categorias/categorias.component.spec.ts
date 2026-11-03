import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { CategoriasComponent } from './categorias.component';

describe('CategoriasComponent', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'categorias', component: CategoriasComponent },
          { path: 'categorias/:slug', component: CategoriasComponent },
        ]),
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  it('lista categorias e quantas tecnologias pertencem a cada uma', async () => {
    await harness.navigateByUrl('/categorias', CategoriasComponent);

    const pagina = harness.routeNativeElement as HTMLElement;
    expect(pagina.querySelectorAll('.card-categoria')).toHaveLength(3);
    expect(pagina.textContent).toContain('Linguagens');
    expect(pagina.textContent).toContain('3 tecnologias');
  });

  it('abre uma categoria e lista tecnologias com links para pesquisa', async () => {
    await harness.navigateByUrl('/categorias/linguagens', CategoriasComponent);

    const pagina = harness.routeNativeElement as HTMLElement;
    const java = pagina.querySelector('a[href^="/pesquisa"]') as HTMLAnchorElement | null;
    expect(pagina.querySelector('h1')?.textContent).toContain('Linguagens');
    expect(pagina.textContent).toContain('Java');
    expect(java?.getAttribute('href')).toContain('q=Java');
  });

  it('informa quando o slug não corresponde a uma categoria', async () => {
    await harness.navigateByUrl('/categorias/inexistente', CategoriasComponent);

    expect((harness.routeNativeElement as HTMLElement).textContent).toContain('Categoria não encontrada');
  });
});
