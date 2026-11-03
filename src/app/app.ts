import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CabecalhoComponent } from './shared/cabecalho/cabecalho.component';
import { RodapeComponent } from './shared/rodape/rodape.component';

@Component({
  imports: [RouterOutlet, CabecalhoComponent, RodapeComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);

  get isAdminPage(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
