import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {AuthGuard} from './auth/auth.guard';
import {HomeComponent} from './home/home.component';
import { PageNotFoundComponent } from './not-found.component';
import {AiBoardComponent} from './ai-board/ai-board/ai-board.component';
import {GameComponent} from "./game/game.component";

const routes: Routes = [
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'game/:id', component: GameComponent, canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent},
  {path: 'ai', component: AiBoardComponent },
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
