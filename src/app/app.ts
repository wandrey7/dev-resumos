import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CabecalhoComponent } from './shared/cabecalho/cabecalho.component';
import { RodapeComponent } from './shared/rodape/rodape.component';

// ponytail: sem lógica de rota /admin escondendo header/rodape — adicionar com
// signals quando a task de admin/guards portar as rotas
@Component({
  imports: [RouterOutlet, CabecalhoComponent, RodapeComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
