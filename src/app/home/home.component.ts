import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {NewSession} from '../interfaces/table.model';
import {Router} from '@angular/router';
import {SessionService} from '../api/api.service';
import {AuthService} from '../shared/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  displayedColumns = ['user', 'created', 'number of players', 'join'];
  gameTable = new MatTableDataSource<NewSession>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private session: SessionService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.session.getAllSessions().subscribe((sessions: NewSession[]) => {
      let formedData = [];
      for (let key in sessions) {
        sessions[key]['id'] = key;
        formedData.push(sessions[key]);
      }
      this.gameTable.data = formedData;
    }, err => {
      console.log(err);
    });
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
