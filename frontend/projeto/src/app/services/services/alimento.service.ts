import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface Alimento {
  id: number;
  nome: string;
  kcal: number;
  carboidratos: number;
  proteinas: number;
  unidadeMedida: {id: number, descricao: string, abreviacao: string};
}

@Injectable({
  providedIn: 'root'
})
export class AlimentoService {
  private apiUrl = 'http://localhost:8080/alimento';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAlimento(): Observable<Alimento[]> {
    const headers = this.authService.getAuthHeaders();
    return this.http.get<Alimento[]>(this.apiUrl, { headers });
  }
}
