import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {NewSession} from '../interfaces/table.model';
import {Router} from '@angular/router';
import {SessionService} from '../api/api.service';
import {AuthService} from '../shared/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns = ['user', 'created', 'number of players', 'join'];
  gameTable = new MatTableDataSource<NewSession>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  tablesRef = firebase.database().ref('gameTables/');

  constructor(private session: SessionService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.gameTable.data = [];
    // this.session.getAllSessions().subscribe((sessions: NewSession[]) => {
    //   let formedData = [];
    //   for (let key in sessions) {
    //     sessions[key]['id'] = key;
    //     formedData.push(sessions[key]);
    //   }
    //   this.gameTable.data = formedData;
    //
    // }, err => {
    //   console.log(err);
    // });
    this.tablesRef.on('child_added', (newData) => {
      let newSession: NewSession[] = this.gameTable.data;
      let session: NewSession = {
        id: newData.key,
        name: newData.val().name,
        user: newData.val().user,
        created: newData.val().created,
        numberOfPlayers: newData.val().numberOfPlayers
      };
      newSession.push(session);
      this.gameTable.data = newSession;
    });

    this.tablesRef.on('child_changed', (newData) => {
      console.log(newData.val());
      let table = newData.val();
      let copy = this.gameTable.data;
      copy.forEach((data, index) => {
        if (data.name === table.name && data.created === table.created && (data.numberOfPlayers !== table.numberOfPlayers) ) {
          copy[index].numberOfPlayers = table.numberOfPlayers;
          this.gameTable.data = copy;
        }});
    });

    this.tablesRef.on('child_removed', (newData) => {
      let table = newData.val();
      let copy = this.gameTable.data;
      copy.forEach((data, index) => {
        if (data.name === table.name && data.created === table.created) {
          copy.splice(index, 1);
          this.gameTable.data = copy;
        }
      });
    });
  }

  ngAfterViewInit() {
    this.gameTable.paginator = this.paginator;
  }

  onSubmitNewGame(gameID: string) {
    const userInfo = this.authService.userInfo();
    let newGame: NewSession = {
      id: '',
      name: gameID,
      created: new Date(),
      user: userInfo.email,
      numberOfPlayers: 0
    };

    this.session.createSession(newGame).subscribe((data: any) => {
        this.router.navigate(['/game/', data.name]);
    }, err => {
      console.log(err);
    });
  }

  joinGame(id: string) {
    this.router.navigate(['/game/', id]);
  }
}
