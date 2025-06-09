import { Component } from '@angular/core';
import { MenuComponent } from '../../components/shared/menu/menu.component';

@Component({
  selector: 'app-tabela',
  imports: [MenuComponent],
  standalone: true,
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.scss'
})
export class TabelaComponent {

}
