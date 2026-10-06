import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Tecnologia } from '../../core/models/models';

@Component({
  selector: 'app-card-tecnologia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <a [routerLink]="['/tecnologia', tecnologia.slug]" class="card-tecnologia">
      <div class="card-tec-top">
        <div class="card-tec-title-area">
          <span class="card-tec-initial">{{ tecnologia.nome.substring(0, 2) | uppercase }}</span>
          <div>
            <h3 class="card-tec-title">{{ tecnologia.nome }}</h3>
            <span class="card-tec-cat">{{ tecnologia.categoriaNome }}</span>
          </div>
        </div>
        <span *ngIf="tecnologia.versao" class="card-tec-version">{{ tecnologia.versao }}</span>
      </div>

      <p class="card-tec-desc">{{ tecnologia.descricao }}</p>

      <div class="card-tec-footer">
        <span class="card-tec-action">
          Ver resumos & sintaxes
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </span>
      </div>
    </a>
  `
})
export class CardTecnologiaComponent {
  @Input({ required: true }) tecnologia!: Tecnologia;
}
