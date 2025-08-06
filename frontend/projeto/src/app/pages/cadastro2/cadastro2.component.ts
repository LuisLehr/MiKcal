import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, Form } from '@angular/forms';
import { RegistrationDataService } from '../../services/registration/RegistrationDataService';
import { UsuarioService } from '../../services/registration/usuario.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro2',
  imports: [MatButtonModule, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './cadastro2.component.html',
  styleUrl: './cadastro2.component.scss'
})
export class Cadastro2Component {
  cadastro2Form: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private registrationDataService: RegistrationDataService,
    private usuarioService: UsuarioService,
    private router: Router
  )
  {
    this.cadastro2Form = this.fb.group({
      altura: ['', [Validators.required, Validators.min(30), Validators.max(300)]],
      peso: ['', [Validators.required, Validators.min(20), Validators.max(400)]],
      dataNascimento: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.cadastro2Form.valid) {
      const initialData = this.registrationDataService.getInitialData();

      if (!initialData) {
        this.errorMessage = 'Dados iniciais do cadastro não forma encontrados.';
        console.error('Inital data not found', initialData);
        return;
      }

      // Combinando dados do fomular 1 com o formulario 2
      const cadastroData = {
        ...initialData,
        altura: Number(this.cadastro2Form.value.altura), // Garantir que altura seja numero
        peso: Number(this.cadastro2Form.value.peso), // Garantir que peso seja numero
        dataNascimento: this.cadastro2Form.value.dataNascimento // deve estar em yyyy-mm-dd
      };

      console.log('Dados enviados para o backend:', cadastroData)

      this.usuarioService.cadastrar(cadastroData).subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso: ', response);
          this.errorMessage = '';
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Erro ao cadastrar: ', error);
          this.errorMessage = error.message || 'Erro ao realizar o cadastro. Tente novamente.';
        }
      });
      } else {
        console.warn('Formulário inválido:', this.cadastro2Form.errors);
        this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      }
    }
  }
