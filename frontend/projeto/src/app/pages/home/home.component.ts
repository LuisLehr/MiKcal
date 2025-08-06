import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from '../../components/shared/menu/menu.component';
import {FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators} from '@angular/forms';
import {RefeicaoService} from '../../services/services/RefeicaoService';
import {AuthService} from '../../services/auth/auth.service';
import {UsuarioService} from '../../services/registration/usuario.service';
import {Usuario} from '../../models/usuario';
import {MatCardModule} from '@angular/material/card';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {AlimentoService} from '../../services/services/alimento.service';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

interface Alimento {
  id: number;
  nome: string;
  kcal: number;
  carboidratos: number;
  proteinas: number;
  unidadeMedida?: {id?: number; abreviacao?: string};
}

interface RefeicaoAlimento {
  id?: number;
  id_refeicao?: { id?: number };
  id_alimento: Alimento;
  quantidade: number;
}

interface Refeicao {
  id?: number;
  tipoRefeicao: string;
  dataRefeicao: Date;
  itens?: RefeicaoAlimento[];
}

@Component({
  selector: 'app-home',
  imports: [MenuComponent,
    ReactiveFormsModule,
    MatCardModule,
    NgCircleProgressModule,
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  usuario: Usuario | null = null;
  progresso = 0;
  meta = 2000;
  total = 0;
  refeicoes: Refeicao[] = [];
  novaRefeicao = false;
  refeicaoForm: FormGroup;
  userId!: number;
  nomeUsuario: string = 'Carregando...';
  alimentos: Alimento[] = [];
  tiposRefeicao = ['Café da manhã', 'Almoço', 'Jantar', 'Lanche'];
  filteredAlimentos: Alimento[] = [];

  constructor(
    private refeicaoService: RefeicaoService,
    private auth: AuthService,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private alimentoService: AlimentoService
  ) {
    this.refeicaoForm = this.fb.group({
      tipoRefeicao: ['', Validators.required],
      itens: this.fb.array([], Validators.required),
    });
  }

  ngOnInit() {
    this.auth.getUserIdFromToken().subscribe({
      next: (userId) => {
        if (!userId) {
          console.error('Não foi possivel obter o userId. Abortando requisições.');
          return;
        }
        this.userId = userId;

        this.usuarioService.getUsuario(userId).subscribe({
          next: (user: Usuario) => {
            const nomeParts = user.nome ? user.nome.split(' ') : [];
            this.nomeUsuario = nomeParts.length > 0 ? nomeParts[0] : 'Usuário';
            this.meta = user.metaCalorica || 2000;
          },
          error: (err) => {
            console.error('Erro ao buscar usuário', err);
          },
        });

        this.refeicaoService.listarHoje(userId).subscribe({
          next: (refeicoes) => {
            this.refeicoes = refeicoes || [];
            this.total = this.calcularTotalCalorias(refeicoes);
            this.progresso = this.meta ? (this.total / this.meta) * 100 : 0;
          },
          error: (err) => {
            console.error('Erro ao listar refeições: ', err);
          },
        });

        this.alimentoService.listarTodos().subscribe({
          next: (alimentos) => {
            this.alimentos = alimentos;
            this.filteredAlimentos = alimentos;
            console.log('Alimentos Carregados:', alimentos);
          },
          error: (err) => {
            console.error('Erro ao listar alimentos:', err);
          },
        });
      },
      error: (err) => {
        console.error('Erro ao obter userId do token:', err);
      },
    });
  }

  calcularTotalCalorias(refeicoes: Refeicao[]): number {
    return refeicoes.reduce((total, refeicao) => {
      if (refeicao.itens && Array.isArray(refeicao.itens)) {
        return total + refeicao.itens.reduce((sum: number, item: RefeicaoAlimento) => {
          const quantidade = item.quantidade || 0;
          const alimento = item.id_alimento || { kcal: 0, unidadeMedida: { id: 1 } };
          const isUnidade = alimento.unidadeMedida?.id === 2;
          return sum + (isUnidade ? quantidade * alimento.kcal : (quantidade * alimento.kcal) / 100);
        }, 0);
      }
      return total;
    }, 0);
  }

  calculaTotaisRefeicao(refeicao: Refeicao) {
    if (!refeicao.itens || !Array.isArray(refeicao.itens)) return {kcal: 0, carboidratos: 0, proteinas: 0};

    return refeicao.itens.reduce((totais: { kcal: number; carboidratos: number; proteinas: number}, item: RefeicaoAlimento) => {
        const quantidade = item.quantidade || 0;
        const alimento = item.id_alimento || { kcal: 0, carboidratos: 0, proteinas: 0, unidadeMedida: { id: 1 } };
        const isUnidade = alimento.unidadeMedida?.id === 2;

        return {
          kcal: totais.kcal + (isUnidade ? quantidade * alimento.kcal : (quantidade * alimento.kcal) / 100),
          carboidratos: totais.carboidratos + (isUnidade ? quantidade * alimento.carboidratos : (quantidade * alimento.carboidratos) / 100),
          proteinas: totais.proteinas + (isUnidade ? quantidade * alimento.proteinas : (quantidade * alimento.proteinas) / 100),
        };
      },
      {kcal: 0, carboidratos: 0, proteinas: 0},
    );
  }

  itens(): FormArray {
    return this.refeicaoForm.get('itens') as FormArray;
  }

  addItem() {
    this.itens().push(
      this.fb.group({
        idAlimento: ['', [Validators.required, Validators.min(1)]],
        quantidade: ['', [Validators.required, Validators.min(0.1)]],
      })
    );
  }

  removeItem(index: number) {
    this.itens().removeAt(index);
  }

  salvar() {
    if (!this.userId) {
      console.error('userId não está definido.');
      return;
    }

    if (this.refeicaoForm.invalid) {
      console.error('Formulário inválido: ', this.refeicaoForm.value);
      return;
    }

    const dto = {
      idUsuario: this.userId,
      tipoRefeicao: this.refeicaoForm.value.tipoRefeicao,
      itens: this.refeicaoForm.value.itens,
    };

    console.log('DTO enviado:', JSON.stringify(dto));

    this.refeicaoService.salvar(dto).subscribe({
      next: () => {
        this.refeicaoService.listarHoje(this.userId).subscribe({
          next: (refeicoes) => {
            this.refeicoes = refeicoes;
            this.total = this.calcularTotalCalorias(refeicoes);
            this.progresso = (this.total / this.meta) * 100;
            this.novaRefeicao = false;
            this.refeicaoForm.reset();
            while (this.itens().length > 0) {
              this.itens().removeAt(0);
            }
          },
          error: (err) => {
            console.error('Erro ao listar refeições após salvar: ', err);
          },
        });
      },
      error: (err) => {
        console.error('Erro ao salvar refeições', err);
      },
    });
  }

  excluir(refeicao: Refeicao) {
    if (!this.userId) {
      console.error('userId não está definido');
      return;
    }

    if (!refeicao.id) {
      console.error('ID da refeição não está definido, impossível excluir.');
      return;
    }

    this.refeicaoService.excluir(refeicao.id).subscribe({
      next: () => {
        this.refeicoes = this.refeicoes.filter((r) => r.id !== refeicao.id);
        this.total = this.calcularTotalCalorias(this.refeicoes);
        this.progresso = (this.total / this.meta) * 100;
      },
      error: (err) => {
        console.error('Erro ao excluir refeição:', err);
      },
    });
  }

  toggleNovaRefeicao() {
    this.novaRefeicao = !this.novaRefeicao;
    if (this.novaRefeicao) {
      this.addItem();
    } else {
      this.refeicaoForm.reset();
      while (this.itens().length) {
        this.itens().removeAt(0);
      }
    }
  }

  getPlaceholder(index: number): string {
    const item = this.itens().at(index) as FormGroup;
    const idAlimento = item.get('idAlimento')?.value;
    if (idAlimento) {
      const alimento = this.alimentos.find((a) => a.id === idAlimento);
      return alimento ? `Ex: 100 (${alimento.unidadeMedida?.abreviacao || 'un'})` : 'Ex: 100';
    }
    return 'Ex: 100';
  }
}
