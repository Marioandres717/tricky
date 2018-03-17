import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {MaterialModule} from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthModule} from './auth/auth.module';
import {AngularFireModule} from 'angularfire2';

import {environment} from '../environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { LoginComponent } from './auth/login/login.component';
import { GameComponent } from './game/game.component';
import { ScoreComponent } from './game/score/score.component';
import {GameService} from './game/game.service';
import { GameBoardComponent } from './game/game-board/game-board.component';
import { PlayerLeftComponent } from './game/game-board/player-left.component';
import { NewGameComponent } from './game/new-game/new-game.component';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './auth/auth.service';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    LoginComponent,
    GameComponent,
    ScoreComponent,
    GameBoardComponent,
    PlayerLeftComponent,
    NewGameComponent,
    ChatComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule
  ],
  entryComponents: [PlayerLeftComponent],
  providers: [GameService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
