import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import {Observable, throwError} from "rxjs"
import { catchError } from "rxjs/operators"
import { Usuario } from '../../models/usuario';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private baseUrl = 'http://localhost:8080/usuario';
  private apiUrl = 'http://localhost:8080/usuario';

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  cadastrar(cadastroData: any): Observable<{ message: string }> {
    console.log('Enviando requisição POST para:', `${this.baseUrl}/cadastro`, cadastroData);
    return this.http.post<{ message: string }>(`${this.baseUrl}/cadastro`, cadastroData).pipe(catchError(error => {
        console.error('Erro na requisição de cadastro:', error);
        return throwError(() => new Error(error.error?.message || 'Erro ao cadastrar usuário'));
      })
    );
  }

  checkUsername(username: string): Observable<boolean> {
    if (!username || username.trim().length === 0) {
      console.warn('Username vazio enviado para checkUsername', username);
      return throwError(() => new Error('Username não pode ser vazio')) as Observable<boolean>;
    }
    const url = `${this.baseUrl}/checar-username/${encodeURIComponent(username)}`;
    console.log('Verificando username', username, 'URL', url);
    return this.http.get<boolean>(url).pipe(
      catchError(error => {
        console.error('Erro ao verificar username', error);
        return throwError(() => new Error('Erro ao verificar username'));
      })
    );
  }

  atualizarUsuario(usuarioData: any): Observable<{ message: string }> {
    const url = `${this.baseUrl}/me`;
    console.log('Enviando requisição PUT para: ', url, usuarioData);
    return this.http.put<{ message: string }>(url, usuarioData, {headers: this.authService.getAuthHeaders()}).pipe(
      catchError(error => {
        console.error('Erro na requisição de atualização:', error);
        return throwError(() => new Error(error.error?.message || 'Erro ao atualizar usuário'));
      })
    );
  }

  getUsuarioLogado(): Observable<Usuario> {
    const url = `${this.baseUrl}/me`;
    console.log('Buscando usuário logado', url);
    return this.http.get<Usuario>(url, {headers: this.authService.getAuthHeaders()}).pipe(
      catchError(error => {
        console.error('Erro ao buscar usuário logado:', error);
        return throwError(() => new Error(error.error?.message || 'Erro ao buscar usuário'));
      })
    );
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http
      .get<Usuario>(`${this.apiUrl}/id/${id}`, {headers: this.authService.getAuthHeaders()})
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar usuário', error);
          return throwError(() => new Error(error.error?.message || 'Erro ao buscar usuário'));
        })
      );
  }
}
