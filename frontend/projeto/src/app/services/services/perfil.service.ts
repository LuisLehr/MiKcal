import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Usuario } from '../../models/usuario';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUsuarioLogado(): Observable<Usuario> {
    const token = this.authService.getToken();
    console.log('Token enviado na requisição', token);
    const headers = this.authService.getAuthHeaders();
    console.log('Cabeçalhos da requisição', headers);
    return this.http.get<Usuario>(`${this.apiUrl}/usuario/me`, { headers })
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}

