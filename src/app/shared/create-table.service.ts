import { Injectable } from '@angular/core';
import {NewSession} from '../game/table.model';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';
/*
* http://reactivex.io/rxjs/manual/overview.html#subject
* A Subject is like an Observable, but can multicast to many Observers.
* Subjects are like EventEmitters: they maintain a registry of many listeners.
*/
import {AngularFirestore} from 'angularfire2/firestore';
import {UiService} from './ui.service';
import {AuthService} from './auth.service';

@Injectable()
export class CreateTableService {
  private firebaseSubscriptions: Subscription[] = [];
  private gameTablesAvailable: NewSession[] = [];
  gameTableUpdate = new Subject<NewSession[]>();

  constructor(private db: AngularFirestore, private uiService: UiService, private authService: AuthService) { }

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
      }).subscribe((gamesAvailable: NewSession[]) => {
        this.gameTablesAvailable = gamesAvailable;
        this.gameTableUpdate.next([...this.gameTablesAvailable]);
      }, error => {
        this.uiService.showSnackBar('fetching game tables failed, please try again later', null, 3000);
        this.gameTableUpdate.next(null);
      }));
  }

  newGame(sessionName: string) {
    const userInfo = this.authService.userInfo();
    const info: NewSession = {
      name: sessionName,
      user: userInfo.email,
      created: new Date()
    };
    return this.createNewGameTable(info);
  }

  updateTableState(docId: any): void {
    this.db.doc(`gameTables/${docId}`).update({numberOfPlayers: 2});
  }

  private createNewGameTable(newTable: NewSession) {
    return new Promise ((resolve, reject) => {
      this.db.collection<NewSession>('gameTables').add(newTable).then(function(data) {
        resolve(data);
        console.log(data);
      }, function(err) {
        reject(err);
      });
    });
  }
}
