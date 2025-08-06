import {Component, OnInit} from '@angular/core';
import {MenuComponent} from '../../components/shared/menu/menu.component';
import {MatCalendar} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {CommonModule} from '@angular/common';
import {RefeicaoService} from '../../services/services/RefeicaoService';
import {AuthService} from '../../services/auth/auth.service';
import {Refeicao, RefeicaoAlimento, Alimento} from '../../models/refeicao';
import {Usuario} from '../../models/usuario';
import {HttpClientModule} from '@angular/common/http';
import {switchMap, catchError} from 'rxjs/operators';
import {of} from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-calendario',
  imports: [
    MenuComponent,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatProgressBarModule,
    CommonModule,
    HttpClientModule,
    MatCalendar,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  standalone: true,
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.scss'
})
export class CalendarioComponent implements OnInit {
  selectedDate: Date = new Date();
  refeicoes: Refeicao[] = [];
  userId: number | null = null;
  usuario: Usuario | null = null;
  totalCalorias: number = 0;
  totalCarboidratos: number = 0;
  totalProteinas: number = 0;
  metaCalorica: number = 0;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private refeicaoService: RefeicaoService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {
    this.authService.getUserIdFromToken().pipe(
      switchMap((userId) => {
        if (!userId) {
          this.error = 'Usuário não autenticado';
          return of(null);
        }
        this.userId = userId;
        return this.authService.getUsuarioLogado();
      }),
      switchMap((usuario: Usuario | null) => {
        if (usuario) {
          this.usuario = usuario;
          this.metaCalorica = usuario.metaCalorica || 0;
        }
        return this.userId ? this.refeicaoService.listarPorData(this.userId, this.formatDate(this.selectedDate)) : of([]);
      })
    ).subscribe({
      next: (refeicoes: Refeicao[]) => {
        this.refeicoes = refeicoes;
        this.calcularTotais();
      },
      error: (err) => {
        this.error = 'Erro ao carregar dados: ' + err.message;
        this.loading = false;
      }
    });
  }

  onDateChange(date: Date | null): void {
    if (date && this.userId) {
      this.selectedDate = date;
      this.loading = true;
      this.error = null;
      this.refeicaoService.listarPorData(this.userId, this.formatDate(date)).subscribe({
        next: (refeicoes: Refeicao[]) => {
          this.refeicoes = refeicoes;
          this.calcularTotais();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Erro ao carregar refeições: ' + err.message;
          this.loading = false;
        }
      });
    }
  }

  private calcularTotais(): void {
    this.totalCalorias = 0;
    this.totalCarboidratos = 0;
    this.totalProteinas = 0;
    this.refeicoes.forEach((refeicao) => {
      refeicao.itens?.forEach((item: RefeicaoAlimento) => {
        if (item.id_alimento && item.quantidade != null) {
          const alimento: Alimento = item.id_alimento;
          const quantidade = item.quantidade;
          const isUnidade = alimento.unidadeMedida?.id === 2;
          this.totalCalorias += isUnidade ? quantidade * alimento.kcal : (quantidade * alimento.kcal) / 100;
          this.totalCarboidratos += isUnidade ? quantidade * alimento.carboidratos : (quantidade * alimento.carboidratos) / 100;
          this.totalProteinas += isUnidade ? quantidade * alimento.proteinas : (quantidade * alimento.proteinas) / 100;
        }
      });
    });
    this.totalCalorias = parseFloat(this.totalCalorias.toFixed(0));
    this.totalCarboidratos = parseFloat(this.totalCarboidratos.toFixed(0));
    this.totalProteinas = parseFloat(this.totalProteinas.toFixed(0));
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  metaAtingida(): boolean {
    return this.totalCalorias >= this.metaCalorica;
  }

  getProgressValue(): number {
    return this.metaCalorica ? (this.totalCalorias / this.metaCalorica) * 100 : 0;
  }
}
