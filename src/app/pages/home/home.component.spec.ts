import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { HomeComponent } from './home.component';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: '<a routerLink="/">Início</a>',
})
class PesquisaStubComponent {}

describe('HomeComponent', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: HomeComponent },
          { path: 'pesquisa', component: PesquisaStubComponent },
        ]),
      ],
    });
    harness = await RouterTestingHarness.create();
  });

  it('mostra as tecnologias e categorias na página inicial', async () => {
    await harness.navigateByUrl('/', HomeComponent);

    const pagina = harness.routeNativeElement as HTMLElement;
    expect(pagina.querySelector('h1')?.textContent).toContain('Consulte uma tecnologia');
    expect(pagina.textContent).toContain('Tecnologias populares');
    expect(pagina.textContent).toContain('Linguagens');
  });

  it('envia a busca da página inicial para os resultados', async () => {
    await harness.navigateByUrl('/', HomeComponent);
    const pagina = harness.routeNativeElement as HTMLElement;

    const campo = pagina.querySelector('.hero-search-input') as HTMLInputElement;
    campo.value = 'Java';
    campo.dispatchEvent(new Event('input'));
    pagina.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/pesquisa?q=Java');
  });
});
