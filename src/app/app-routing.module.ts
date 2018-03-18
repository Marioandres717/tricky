import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {GameComponent} from './game/game.component';
import {AuthGuard} from './auth/auth.guard';
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'game/:id', component: GameComponent, canActivate: [AuthGuard] },
  {path: '', component: LoginComponent},
  {path: '**', component: LoginComponent},
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {enableTracing: true})
  ],
  exports: [
    RouterModule
  ],
  declarations: [],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
