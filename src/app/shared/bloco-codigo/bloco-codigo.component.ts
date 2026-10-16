import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bloco-codigo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="code-block-container">
      <div class="code-block-header">
        <div class="code-block-title">
          <span class="lang-tag">{{ linguagem | uppercase }}</span>
          <span *ngIf="titulo" class="code-title-text">{{ titulo }}</span>
        </div>
        <button
          type="button"
          class="btn-copy"
          (click)="copiarCodigo()"
          [class.copied]="copiado"
          [attr.aria-label]="copiado ? 'Código copiado' : 'Copiar código'"
        >
          <svg *ngIf="!copiado" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg *ngIf="copiado" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{{ copiado ? 'Copiado!' : 'Copiar' }}</span>
        </button>
      </div>

      <pre class="code-pre"><code class="code-content">{{ codigo }}</code></pre>

      <div *ngIf="explicacao" class="code-block-footer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>{{ explicacao }}</span>
      </div>
    </div>
  `
})
export class BlocoCodigoComponent {
  @Input({ required: true }) codigo: string = '';
  @Input() linguagem: string = 'code';
  @Input() titulo?: string;
  @Input() explicacao?: string;

  copiado = false;

  async copiarCodigo() {
    try {
      await navigator.clipboard.writeText(this.codigo);
      this.copiado = true;
      setTimeout(() => {
        this.copiado = false;
      }, 2000);
    } catch {
      // Fallback manual para clipboard
      const textarea = document.createElement('textarea');
      textarea.value = this.codigo;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.copiado = true;
      setTimeout(() => {
        this.copiado = false;
      }, 2000);
    }
  }
}
