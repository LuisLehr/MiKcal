import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../components/shared/menu/menu.component';
import { AlimentoService, Alimento, Page } from '../../services/services/alimento.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-tabela',
  imports: [MenuComponent, CommonModule, FormsModule],
  standalone: true,
  templateUrl: './tabela.component.html',
  styleUrl: './tabela.component.scss'
})

export class TabelaComponent implements OnInit {
  alimentos: Alimento[] = [];
  totalPages: number = 0;
  pageSize:number = 8;
  currentPage:number = 0;
  loading = false;
  error: string | null = null;
  searchTerm: string = '';

  constructor(private alimentoService: AlimentoService, private router: Router) {}

  ngOnInit():void {
    this.carregarAlimentos();
  }

  carregarAlimentos(page: number = this.currentPage, searchTerm: string = this.searchTerm): void {
    this.loading = true;
    this.error = null;
    this.alimentoService.getAlimento(page, this.pageSize, searchTerm).subscribe({
      next: (data: Page<Alimento>) => {
        this.alimentos = data.content;
        this.currentPage = data.number;
        this.totalPages = data.totalPages;
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

  pesquisarAlimento(): void {
    this.currentPage = 0; // Resetar para a primeira página ao pesquisar
    this.carregarAlimentos(this.currentPage, this.searchTerm);
  }

  proximaPagina(): void {
    if (this.currentPage < this.totalPages -1) {
      this.currentPage++;
      this.carregarAlimentos(this.currentPage, this.searchTerm);
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.carregarAlimentos(this.currentPage, this.searchTerm);
    }
  }
}
