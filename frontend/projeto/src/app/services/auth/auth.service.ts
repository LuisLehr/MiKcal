import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {LoginRequest} from "../../components/models/login-request";
import {LoginResponse} from "../../components/models/login-response";
import {Usuario} from '../../models/usuario';
import {catchError, map, switchMap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth/login';
  private usuarioApiUrl = 'http://localhost:8080/usuario/me';

  constructor(private http: HttpClient) {
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, loginRequest);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; //Converter segundos para milisegundos
      return Date.now() > exp;
    } catch (e) {
      console.error('Erro ao decodificar token: ', e);
      return true;
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getUserIdFromToken(): Observable<number | null> {
    const token = this.getToken();
    if (!token) {
      console.error('token não encontrado');
      return of(null);
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const username = payload.sub;
      if (!username) {
        console.error('Username não encontrado no payload do token', payload);
        return of(null);
      }

      // Busca usuário logado para obter o ID numérico
      return this.http
        .get<Usuario>(this.usuarioApiUrl, {headers: this.getAuthHeaders()})
        .pipe(
          map((usuario: Usuario) => usuario.id),
          catchError((error) => {
            console.error('Erro ao buscar usuário logado:', error);
            return of(null);
          })
        );
    } catch (error) {
      console.error('Erro ao decodificar token: ', error);
      return of(null);
    }
  }

  getUsuarioLogado(): Observable<Usuario | null> {
    return this.http.get<Usuario>(this.usuarioApiUrl, {headers: this.getAuthHeaders()})
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar usuário logado:', error);
          return of(null);
        })
      );
  }
}
