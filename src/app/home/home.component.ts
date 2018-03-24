import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {SocketService} from '../shared/socket.service';
import {NewSession} from '../game/table.model';
import {GameService} from '../game/game.service';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';
import {CreateTableService} from '../shared/create-table.service';
import {SessionService} from '../api/api.service';
import {AuthService} from "../shared/auth.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns = ['user', 'created', 'number of players', 'join'];
  gameTable = new MatTableDataSource<NewSession>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private gameTableSubscription: Subscription;

  constructor(private createTableService: CreateTableService, private session: SessionService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.createTableService.fetchAvailableGames();

    this.gameTableSubscription = this.createTableService.gameTableUpdate
      .subscribe((gamesAvailable: NewSession[]) => { this.gameTable.data = gamesAvailable; });
  }

  ngAfterViewInit() {
    this.gameTable.paginator = this.paginator;
  }

  onSubmitNewGame(gameID: string) {
    const userInfo = this.authService.userInfo();
    let newGame: NewSession = {
      name: gameID,
      created: new Date(),
      user: userInfo.email,
      numberOfUsers: 1
    };
    this.session.createSession(newGame)

    // sessionService


    // const self = this;
    // this.createTableService.newGame(gameID).then(function(data: any) {
    //   // self.socketService.joinGame(data.id);
    //   self.router.navigate(['/game/', data.id]);
    // }, function(err) {
    //   console.log(err);
    // });
  }

  joinGame(id: string) {
     this.createTableService.getSessionInfo(id);

    // this.createTableService.updateTableState(docId);
    // this.socketService.joinGame(gameID);
    // this.router.navigate(['/game/', gameID]);
  }
}
