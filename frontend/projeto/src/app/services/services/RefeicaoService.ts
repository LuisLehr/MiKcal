import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from '../auth/auth.service';
import {catchError, Observable, pipe, throwError} from 'rxjs';
import { RefeicaoDTO } from '../../models/RefeicaoDTO';
import { Refeicao } from '../../models/refeicao';

@Injectable({
  providedIn: 'root'
})
export class RefeicaoService {
  private apiUrl = 'http://localhost:8080/refeicao';

  constructor(private http: HttpClient, private auth: AuthService) {
  }

  listarHoje(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${userId}/hoje`, {headers: this.auth.getAuthHeaders()})
      .pipe(
        catchError((error) => {
          console.error('Erro ao listar refeições:', error);
          return throwError(() => new Error(error.error?.message || 'Erro ao listar refeições'));
        })
      );
  }

  listarPorData(userId: number, data: String): Observable<Refeicao[]> {
    return this.http.get<Refeicao[]>(`${this.apiUrl}/usuario/${userId}/data?data=${data}`, {headers: this.auth.getAuthHeaders()})
    .pipe(
      catchError((error) => {
        console.error('Erro ao listar refeições por data:', error);
        return throwError(() => new Error(error.error?.message || 'Erro ao listar refeições'));
      })
    );
  }

  salvar(refeicao: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, refeicao, {headers: this.auth.getAuthHeaders()})
      .pipe(
        catchError((error) => {
          console.error('Erro ao salvar refeição', error);
          return throwError(() => new Error(error.error?.message || 'Erro ao salvar reição'));
        })
      );
  }

  excluir(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, {headers: this.auth.getAuthHeaders()})
      .pipe(
        catchError((error) => {
          console.error('Erro ao excluir refeição:', error);
          return throwError(() => new Error(error.error?.message || 'Erro ao excluir refeição'));
        })
      );
  }

  atualizar(id: number, refeicao: RefeicaoDTO): Observable<Refeicao> {
    return this.http
      .put<Refeicao>(`${this.apiUrl}/${id}`, refeicao, {headers: this.auth.getAuthHeaders()})
      .pipe(
        catchError((error) => {
          console.error('Erro ao atualizar refeição:', error);
          return throwError(() => new Error(error.error?.message || 'Erro ao atualizar refeição'));
        })
      );
  }
}
