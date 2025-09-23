import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { MenuComponent } from '../../components/shared/menu/menu.component';
import { RefeicaoService } from '../../services/services/RefeicaoService';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { format, startOfWeek, parseISO, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-relatorio',
  imports: [MenuComponent, FormsModule, BaseChartDirective],
  templateUrl: './relatorio.component.html',
  styleUrl: './relatorio.component.scss',
  standalone: true
})
export class RelatorioComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  period: 'weekly' | 'monthly' = 'weekly';
  startDate: string = format(new Date(), 'yyyy-MM-dd');
  userId: number | null = null;
  caloricGoal: number = 0;
  calorieData: {date: string; calories: number }[] = [];
  errorMessage: string | null = null;
  isLoading: boolean = false;

  public barChartOptions: ChartConfiguration<'bar' | 'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 250,
          callback: (tickValue: string | number) => {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return `${value} kcal`
          }
        },
        title: {
          display: true,
          text: 'Calorias (kcal)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Data'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };

  public barChartData: ChartData<'bar' | 'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Calorias Ingeridas',
        data: [],
        backgroundColor: '#2E7D32',
        hoverBackgroundColor: '#4CAF50',
        type: 'bar' as const
      },
      {
        label: 'Meta Calórica',
        data: [],
        type: 'line' as const,
        borderColor: '#FF9800',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0
      }
    ]
  };

  constructor(private refeicaoService: RefeicaoService, private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const today = new Date();
    const sunday = startOfWeek(today, { weekStartsOn: 0, locale: ptBR });
    this.startDate = format(sunday, 'yyyy-MM-dd');

    this.authService.getUsuarioLogado().subscribe({
      next: (usuario: any) => {
        this.userId = usuario?.id ?? null;
        console.log('Usuário logado:', usuario, 'userId', this.userId); // Log para depuração
        if (this.userId) {
        this.loadCalorieData();
        } else {
          this.errorMessage = 'Usuario não autenticado';
          console.error('Nenhum userId disponivel')
        }
      },
      error: (error) => {
        this.errorMessage = 'Erro ao buscar usuário logado';
        console.error('Erro ao buscar usuário logado:', error)
      }
    });
  }

  loadCalorieData(): void {
    if (!this.userId) {
      this.errorMessage = 'Usuário não autenticado';
      console.error('UserId não identificado', this.userId)
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    console.log('Enviando requisição para:',
      `${this.refeicaoService['apiUrl']}/usuario/${this.userId}/calories?period=${this.period}&startDate=${this.startDate}`);
    this.refeicaoService.getCalorieData(this.userId, this.period, this.startDate).subscribe({
      next: (response: { calorieData: { date: string; calories: number }[]; metaCalorica: number }) => {
        console.log('Resposta recebida:', response); // Log para depuração
        if (response && response.calorieData) {
        this.calorieData = response.calorieData;
        this.caloricGoal = response.metaCalorica || 0;
        this.updateChart();
        } else {
          this.errorMessage = 'Resposta inválida do servidor';
          console.error('Resposta não contém calorieData:', response);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Erro ao carregar dados de calorias';
        console.error('Erro ao carregar dados de calorias: ', error);
        this.calorieData = [];
        this.updateChart();
        this.isLoading = false;
      }
    });
  }

  updateChart(): void {
    console.log('Atualizando gráfico com calorieData:', this.calorieData); // Log para depuração

    if (!this.calorieData) {
      console.error('calorieData é undefined ou null');
      return;
    }

    const labels: string[] = [];
    const calorieValues: number[] = [];
    const goalValues: number[] = [];

    this.calorieData.forEach(item => {
      const date = parseISO(item.date);
      const label = this.period === 'weekly'
        ? format(date, 'EEEE', { locale: ptBR }) // Exibe o nome do dia da semana
        : format(date, 'dd', { locale: ptBR }); // Exibe apenas o dia do mês
      labels.push(label);
      calorieValues.push(item.calories / 100);
      goalValues.push(this.caloricGoal);
    });

    if (this.chart && this.chart.chart) {
      this.chart.chart.data.labels = labels;
      this.barChartData.datasets[0].data = calorieValues;
      this.barChartData.datasets[1].data = goalValues;
      this.chart.chart.update();
    } else {
      console.warn('Chart não inicializado ainda. Tentando fallback...');
      this.barChartData.labels = labels;
      this.barChartData.datasets[0].data = calorieValues;
      this.barChartData.datasets[1].data = goalValues;
    }

    setTimeout(() => {
      this.cdr.detectChanges();
      if (this.chart && this.chart.chart) {
        this.chart.chart.update();
      }
    }, 200);
  }

  onPeriodChange(period: 'weekly' | 'monthly'): void {
    this.period = period;
    console.log('Período alterado para: ', this.period);

    const today = new Date();
    if (this.period === 'weekly') {
      const sunday = startOfWeek(today, { weekStartsOn: 0, locale: ptBR });
      this.startDate = format(sunday, 'yyyy-MM-dd');
    } else if (this.period === 'monthly') {
      const firstDay = startOfMonth(today);
      this.startDate = format(firstDay, 'yyyy-MM-dd');
    }
    this.cdr.detectChanges();
    this.loadCalorieData();
  }

  onDateChange(date: string): void {
    this.startDate = date;
    console.log('Data selecionada: ', this.startDate);

    if(this.startDate) {
      const selectedDate = parseISO(this.startDate);
      if (this.period === 'weekly') {
        const sunday = startOfWeek(selectedDate, { weekStartsOn: 0, locale: ptBR });
        this.startDate = format(sunday, 'yyyy-MM-dd');
      } else if (this.period === 'monthly') {
        const firstDay = startOfMonth(selectedDate);
        this.startDate = format(firstDay, 'yyyy-MM-dd');
      }
    }
    this.cdr.detectChanges();
    this.loadCalorieData();
  }
}
