import { Component } from '@angular/core';
import { MenuComponent } from '../../components/shared/menu/menu.component';

@Component({
  selector: 'app-home',
  imports: [MenuComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  template: `<app-menu></app-menu>
             <h1>Página inicial</h1>`
})
export class HomeComponent {

}
