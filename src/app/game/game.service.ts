import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Subscription} from 'rxjs/Subscription';
import {Table} from './table.model';
import 'rxjs/operator/map';
import {UiService} from '../shared/ui.service';
import {AuthService} from '../shared/auth.service';

@Injectable()
export class GameService {
  OngoingGame$ = new Subject<boolean>();
  private firebaseSubscriptions: Subscription[] = [];
  private gameTablesAvailable: Table[] = [];
  gameTableUpdate = new Subject<Table[]>();

  constructor(private db: AngularFirestore, private uiService: UiService, private authService: AuthService) {}

  fetchAvailableGames(): void {
    this.firebaseSubscriptions.push(this.db
      .collection('gameTables')
      .snapshotChanges()
      .map(gameArray => {
        return gameArray.map(game => {
          return {
            id: game.payload.doc.id,
            name: game.payload.doc.data().name,
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

  newGame(gameID: string): void {
    const userInfo = this.authService.userInfo();
    const info: Table = {
      id: '',
      name: gameID,
      user: userInfo.email,
      numberOfPlayers: 1,
      created: new Date()
    };
    this.createNewGameTable(info);
  }

  updateTableState(docId: any) {
   this.db.doc(`gameTables/${docId}`).update({numberOfPlayers: 2});
  }

  createNewGameTable(newTable: Table): void {
    this.db.collection<Table>('gameTables').add(newTable);
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
