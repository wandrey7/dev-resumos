import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CabecalhoComponent } from './shared/cabecalho/cabecalho.component';
import { RodapeComponent } from './shared/rodape/rodape.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CabecalhoComponent, RodapeComponent],
  template: `
    <div class="app-layout" [class.admin-layout-active]="isAdminRoute">
      <app-cabecalho *ngIf="!isAdminRoute"></app-cabecalho>
      <main class="app-main-content">
        <router-outlet></router-outlet>
      </main>
      <app-rodape *ngIf="!isAdminRoute"></app-rodape>
    </div>
  `
})
export class AppComponent {
  isAdminRoute = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.isAdminRoute = event.urlAfterRedirects.startsWith('/admin');
      window.scrollTo(0, 0);
    });
  }
}
