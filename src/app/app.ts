import { Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
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
  private readonly location = inject(Location);
  private hasInternalHistory = false;
  private previousUrl: string | null = null;

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.hasInternalHistory = this.hasInternalHistory || this.previousUrl !== null;
        this.previousUrl = event.urlAfterRedirects;
        window.scrollTo(0, 0);
      });
  }

  get isAdminPage(): boolean {
    return this.router.url.startsWith('/admin');
  }

  get showBackButton(): boolean {
    const currentPath = this.router.url.split(/[?#]/)[0];
    return currentPath !== '/' && !/^\/categorias\/[^/]+$/.test(currentPath);
  }

  voltar(): void {
    if (this.hasInternalHistory) {
      this.location.back();
    } else {
      void this.router.navigateByUrl('/');
    }
  }
}
