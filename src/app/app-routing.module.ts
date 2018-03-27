import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {AuthGuard} from './auth/auth.guard';
import {HomeComponent} from './home/home.component';
import {AiBoardComponent} from './ai-board/ai-board.component';
import {GameComponent} from './game/game.component';
import {LoginGuard} from './auth/login.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'game/:id', component: GameComponent, canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: 'ai', component: AiBoardComponent },
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', redirectTo: '/home'},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: [],
  providers: [AuthGuard, LoginGuard]
})
export class AppRoutingModule { }
