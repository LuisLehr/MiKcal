import { Component } from '@angular/core';
import {MenuComponent} from '../../components/shared/menu/menu.component';

@Component({
  selector: 'app-calendario',
  imports: [
    MenuComponent
  ],
  standalone: true,
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent {

}
