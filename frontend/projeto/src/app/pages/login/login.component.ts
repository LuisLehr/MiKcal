import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {LoginRequest} from '../../components/models/login-request';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      senha: ['', [Validators.required]]
    });
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginRequest: LoginRequest = this.loginForm.value;
      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.authService.saveToken(response.token);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.errorMessage = 'Usuário ou senha incorreta!';
          console.error('Erro de login:', error);
        }
      });
    } else {
      this.errorMessage = 'Por favor, preenche todos os campos.';
    }
  }
  irParaCadastro() {
      this.router.navigate(['/cadastro']);
    }
}
