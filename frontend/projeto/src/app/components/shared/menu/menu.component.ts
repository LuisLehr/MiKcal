import {Component} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-menu',
  imports: [MatButton],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  constructor(
    private router: Router,
  ) {

  }

  irParaHome() {
    this.router.navigate(['/home']);
  }

  irParaTabela() {
    this.router.navigate(['/tabela']);
  }

  irParaCalendario() {
    this.router.navigate(['/calendario']);
  }

  irParaRelatorio() {
    this.router.navigate(['/relatorio']);
  }

  irParaPerfil() {
    this.router.navigate(['/perfil']);
  }
}
