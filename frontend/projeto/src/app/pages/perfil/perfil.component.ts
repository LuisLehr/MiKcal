import { Component } from '@angular/core';
import { MenuComponent } from '../../components/shared/menu/menu.component';

@Component({
  selector: 'app-perfil',
  imports: [MenuComponent],
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

}
