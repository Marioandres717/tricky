import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import {GameBoardComponent} from './game/game-board/game-board.component';
import {AuthGuard} from './auth/auth.guard';
import {HomeComponent} from './home/home.component';
import { PageNotFoundComponent } from './not-found.component';
import {AiBoardComponent} from './ai/ai-board.component';
import {WaitingComponent} from './game/waiting/waiting.component';
import {ChatComponent} from './chat/chat.component';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path: 'ai', component: AiBoardComponent, canActivate: [AuthGuard] },
  {path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  {path: 'waiting', component: WaitingComponent},
  {path: 'game/:id', component: GameBoardComponent, canActivate: [AuthGuard] },
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
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
