import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../components/shared/menu/menu.component';
import { PerfilService } from '../../services/services/perfil.service';
import {Router} from '@angular/router';
import { Usuario} from '../../models/usuario';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-perfil',
  imports: [MenuComponent, MatButton],
  standalone: true,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  metaCalorica: number | null = null; // PlaceHolder para meta calorica

  constructor(private perfilService: PerfilService, private router: Router) {}

  ngOnInit(): void {
    this.perfilService.getUsuarioLogado().subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
      error: (err) => {
        console.error('Erro ao carregar usuário:', err);
        this.router.navigate(['/auth/login']);
      }
    });
  }

  calcularIdade(dataNascimento?: string): number {
    if (!dataNascimento) return 0;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }

  logout(): void {
    this.perfilService.logout();
    this.router.navigate(['/login']);
  }

  irParaEditarCadastro(){
    this.router.navigate(['/editarCadastro']);
  }
}
