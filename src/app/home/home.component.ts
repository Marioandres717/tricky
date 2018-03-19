import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {SocketService} from '../shared/socket.service';
import {Table} from '../game/table.model';
import {GameService} from '../game/game.service';
import {Subscription} from 'rxjs/Subscription';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns = ['user', 'created', 'number of players', 'join'];
  gameTable = new MatTableDataSource<Table>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private gameTableSubscription: Subscription;

  constructor(private socketService: SocketService, private gameService: GameService, private router: Router) {}

  ngOnInit() {
    this.gameService.fetchAvailableGames();

    this.gameTableSubscription = this.gameService.gameTableUpdate
      .subscribe((gamesAvailable: Table[]) => { this.gameTable.data = gamesAvailable; });
  }

  ngAfterViewInit() {
    this.gameTable.paginator = this.paginator;
  }

  onSubmitNewGame(gameID: string) {
    this.gameService.newGame(gameID);
  }

  joinGame(gameID: number) {
    this.router.navigate(['/game/', gameID]);
  }
}
