import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/registration/usuario.service';
import { AuthService } from '../../services/auth/auth.service';
import {FormBuilder, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-cadastro',
  imports: [ FormsModule, CommonModule],
  standalone: true,
  templateUrl: './editar-cadastro.component.html',
  styleUrl: './editar-cadastro.component.scss'
})
export class EditarCadastroComponent implements OnInit{
  usuario: any = {
    nome: '',
    username: '',
    email: '',
    peso: '',
    altura: '',
    metaCaloria: '',
    dataNascimento: '',
    senha: ''
  };
  mensagem: string = '';
  erro: string = '';

  constructor(private usuarioService: UsuarioService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.carregarUsuarioLogado();
  }

  carregarUsuarioLogado(): void {
    this.usuarioService.getUsuarioLogado().subscribe({
      next: (data) => {
        this.usuario = {
          ...data,
          senha: '', // Não preenche a senha por segurança
          dataNascimento: data.dataNascimento ? data.dataNascimento.split('T')[0] : ''
        };
        console.log('Usuário carregado:', this.usuario);
      },
      error: (err) => {
        this.erro = 'Erro ao carregar dados do usuario: ' + err.message;
        console.error(this.erro)
      }
    });
  }

  atualizar(): void {
    this.mensagem = '',
      this.erro = '';

    const usuarioData = {
      nome: this.usuario.nome,
      email: this.usuario.email,
      peso: this.usuario.peso,
      altura: this.usuario.altura,
      metaCalorica: this.usuario.metaCalorica,
      dataNascimento: this.usuario.dataNascimento,
      senha: this.usuario.senha || undefined
    };

    this.usuarioService.atualizarUsuario(usuarioData).subscribe({
      next: (response) => {
        this.mensagem = 'Cadastro atualizado com sucesso!';
        console.log('Usuário atualizado:', response);
        setTimeout(() => {this.mensagem= ''; this.router.navigate(['/perfil']); }, 3000);
      },
      error: (err) => {
        this.erro = 'Erro ao atualizar usuario: ' + err.message;
        console.error(this.erro);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/perfil']);
  }
}
