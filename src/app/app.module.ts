import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {MaterialModule} from './material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthModule} from './auth/auth.module';
import {AngularFireModule} from 'angularfire2';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import {SessionService} from './api/api.service';

import {environment} from '../environments/environment';

import { AppComponent } from './app.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { LoginComponent } from './auth/login/login.component';
import { GameComponent } from './game/game.component';
import {GameService} from './game/game.service';
import { GameBoardComponent } from './game/game-board/game-board.component';
import { PlayerLeftComponent } from './game/game-board/player-left.component';
import { NewGameComponent } from './game/new-game/new-game.component';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './shared/auth.service';
import {UiService} from './shared/ui.service';
import { PageNotFoundComponent } from './not-found.component';
import { SocketService } from './shared/socket.service';
import {AiService} from './game/ai.service';
import { AiBoardComponent } from './ai/ai-board.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidenavListComponent,
    LoginComponent,
    GameComponent,
    GameBoardComponent,
    PlayerLeftComponent,
    NewGameComponent,
    ChatComponent,
    HomeComponent,
    PageNotFoundComponent,
    AiBoardComponent
  ],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    AppRoutingModule,
    HttpClientModule
  ],
  entryComponents: [PlayerLeftComponent],
  providers: [GameService, AuthService,  UiService, SocketService, AiService, SessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
