import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AsyncValidatorFn, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {RegistrationDataService} from '../../services/registration/RegistrationDataService';
import {UsuarioService} from '../../services/registration/usuario.service';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-cadastro',
  imports: [MatButtonModule, ReactiveFormsModule, CommonModule, RouterLink],
  standalone: true,
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})

export class CadastroComponent {
  cadastroForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registrationDataService: RegistrationDataService,
    private usuarioService: UsuarioService
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)], [this.usernameValidator()]],
      senha: ['', [Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  usernameValidator(): AsyncValidatorFn {
    return (control): Observable<ValidationErrors | null> => {
      const username = control.value?.trim();
      if (!username || username.length < 3) {
        console.warn('Username vazio, ignorado validação assincrona', username);
        return of(null);
      }
      console.log('Validando username:', username);
      return of(username).pipe (
        debounceTime(500), // Aguardar 300ms para evitar chamadas excessivas
        switchMap(value => this.usuarioService.checkUsername(value)),
        map(exists => {
          console.log('Resposta da validação de username', exists);
          return exists ? { usernameTaken : true } : null;
        }),
        catchError(error => {
          console.error('Erro ao validar username:', error);
          this.errorMessage = 'Erro ao verificar username. Tente novamente.';
          return of({ usernameError: true});
        })
      );
    };
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      console.log('Formulário válido, salvando dados:', this.cadastroForm.value);
      this.errorMessage = '';
      this.registrationDataService.setInitialData(this.cadastroForm.value);
      this.router.navigate(['/cadastro2']);
    } else {
      console.warn('Formulario inválido:', this.cadastroForm.errors);
      this.errorMessage = 'Por favor, preenche todos os campos corretamente.';
    }
  }
}








