import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {catchError, Observable, throwError} from "rxjs"


@Injectable({
    providedIn: 'root'
})

export class UsuarioService {
    private baseUrl = 'http://localhost:8080/usuario';

    constructor(private http: HttpClient) { }

    cadastrar(cadastroData: any): Observable< {message: string}> {
        console.log('Enviando requisição POST para:',`${this.baseUrl}/cadastro`,cadastroData);
        return this.http.post<{ message: string}>(`${this.baseUrl}/cadastro`, cadastroData).pipe(catchError(error => {
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
}
