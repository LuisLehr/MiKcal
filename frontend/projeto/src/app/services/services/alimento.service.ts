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

export interface Page<T> {
  content: T[];
  pageable: {
    sort: { sorted:boolean; unsorted: boolean; empty: boolean };
      offset: number;
      pageNumber: number;
      pageSize: number;
      unpaged: boolean;
      paged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: { sorted: boolean; unsorted: boolean; empty: boolean };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlimentoService {
  private apiUrl = 'http://localhost:8080/alimento';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAlimento(page: number = 0, size: number = 12, searchTerm: string = ''): Observable<Page<Alimento>> {
    const url = searchTerm
    ? `${this.apiUrl}/search?nome=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`
      : `${this.apiUrl}?page=${page}&size=${size}`;
    return this.http.get<Page<Alimento>>(url);
  }
}
