import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Usuario } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/usuario';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getUserProfile(userId: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${userId}`, { headers: this.auth.getAuthHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar perfil do usuário:', error);
          return throwError(() => new Error(error.error?.message || 'Erro ao buscar perfil'));
        })
      );
  }
}
