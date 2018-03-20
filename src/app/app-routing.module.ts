import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {GameBoardComponent} from './game/game-board/game-board.component';
import {AuthGuard} from './auth/auth.guard';
import {HomeComponent} from './home/home.component';
import { PageNotFoundComponent } from './not-found.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'game/:id', component: GameBoardComponent, canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent},
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes) //, {enableTracing: true})
  ],
  exports: [
    RouterModule
  ],
  declarations: [],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
