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
import {SessionService, UserService} from './api/api.service';

import {environment} from '../environments/environment';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { GameComponent } from './game/game.component';
import { PlayerLeftComponent } from './game/player-left.component';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './shared/auth.service';
import {UiService} from './shared/ui.service';
import { PageNotFoundComponent } from './not-found.component';
import { SocketService } from './shared/socket.service';
import {AiService} from './shared/ai.service';
import { AiBoardComponent } from './ai-board/ai-board.component';
import {RematchComponent} from './game/rematch.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    GameComponent,
    PlayerLeftComponent,
    ChatComponent,
    HomeComponent,
    PageNotFoundComponent,
    AiBoardComponent,
    RematchComponent
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
  entryComponents: [PlayerLeftComponent, RematchComponent],
  providers: [AuthService,  UiService, SocketService, AiService, SessionService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
