import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AngularFirestore} from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';
import {Table} from './table.model';
import 'rxjs/operator/map';
import {UiService} from '../shared/ui.service';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class GameService {
  OngoingGame$ = new Subject<boolean>();
  private firebaseSubscriptions: Subscription[] = [];
  private gameTablesAvailable: Table[] = [];
  gameTableUpdate = new Subject<Table[]>();

  constructor(private db: AngularFirestore, private uiService: UiService, private authService: AuthService) {}

  fetchAvailableGames() {
    this.firebaseSubscriptions.push(this.db
      .collection('gameTables')
      .snapshotChanges()
      .map(gameArray => {
        return gameArray.map(game => {
          return {
            id: game.payload.doc.data().id,
            user: game.payload.doc.data().user,
            numberOfPlayers: game.payload.doc.data().numberOfPlayers,
            created: game.payload.doc.data().created
          };
      });
    }).subscribe((gamesAvailable: Table[]) => {
      this.gameTablesAvailable = gamesAvailable;
      this.gameTableUpdate.next([...this.gameTablesAvailable]);
      }, error => {
        this.uiService.showSnackBar('fetching game tables failed, please try again later', null, 3000);
        this.gameTableUpdate.next(null);
      }));
  }

  newGame(gameID: string) {
    const userInfo = this.authService.userInfo();
    const info: Table = {
      id: +gameID,
      user: userInfo.email,
      numberOfPlayers: 1,
      created: new Date()
    };
    this.createNewGameTable(info);
  }


  private createNewGameTable(newTable: Table) {
    this.db.collection('gameTables').add(newTable);
  }














    selectNewGame(value: string) {
    if (value) {
      this.OngoingGame$.next(true);
    } else {
      this.OngoingGame$.next(false);
    }
  }

  cancelSubscriptions() {
    this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
  }
}
