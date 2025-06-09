import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { Cadastro2Component } from './pages/cadastro2/cadastro2.component';
import {PerfilComponent} from './pages/perfil/perfil.component';
import {CalendarioComponent} from './pages/calendario/calendario.component';
import {RelatorioComponent} from './pages/relatorio/relatorio.component';
import {TabelaComponent} from './pages/tabela/tabela.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, //Define a página inicial para a tela de Login
  { path: 'login', component: LoginComponent }, // Rota explicita para Login
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'cadastro2', component: Cadastro2Component},
  { path: 'perfil', component: PerfilComponent},
  { path: 'calendario', component: CalendarioComponent},
  { path: 'relatorio', component: RelatorioComponent},
  { path: 'tabela', component: TabelaComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redireciona qualquer rota invalida para Login

];
