import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../components/shared/menu/menu.component';
import { AlimentoService, Alimento } from '../../services/services/alimento.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabela',
  imports: [MenuComponent, CommonModule],
  standalone: true,
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.scss'
})
export class TabelaComponent implements OnInit {
  alimentos: Alimento[] = [];
  loading = false;
  error: string | null = null;

  constructor(private alimentoService: AlimentoService, private router: Router) {}

  ngOnInit():void {
    this.carregarAlimentos();
  }

  carregarAlimentos(): void {
    this.loading = true;
    this.error = null;
    this.alimentoService.getAlimento().subscribe({
      next: (data) => {
        this.alimentos = data;
        console.log(this.alimentos);
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.error = 'Sessão expirada. Faça login novamente.';
          localStorage.removeItem('token'); // Limpar Token expirado
          this.router.navigate(['/login']);
        } else if (err.status === 500) {
          this.error = 'Erro no servidor. Tente novamente mais tarde ou faça login novamente.';
          localStorage.removeItem('token'); //Limpar token por segurança
          this.router.navigate(['/login']);
        } else {
          this.error = `Erro ao carregar alimentos.: ${err.message || 'Tente novamente.' }`;
        }
        this.loading = false;
        console.error('Erro ao carregar alimentos.', err);
      },
      complete: () => {
        console.log('Carregando de alimentos concluído.');
      }
    });
  }
}
