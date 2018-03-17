import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {GameComponent} from './game/game.component';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'game', component: GameComponent, canActivate: [AuthGuard] }
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
  providers: [AuthGuard]
})
export class AppRoutingModule { }
