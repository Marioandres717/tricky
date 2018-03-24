import { NgModule } from '@angular/core';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AuthService} from '../shared/auth.service';

import { AngularFireDatabaseModule } from 'angularfire2/database';

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule
  ],
  providers: [AuthService]
})
export class AuthModule { }
