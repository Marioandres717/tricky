import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';

export interface Table {
  id: number;
  user: string;
  key: string;
  count: number;
  created: string;
  country?: string;
}

const GAME_TABLE: Table[] = [
  {id: 0, user: 'sebastian', key:'holo01', created:'Sunday 16, March 2018', country: 'Colombia', count: 1},
  {id: 1, user: 'pepitoPerez', key:'holo02', created:'Sunday 16, March 2018', country: 'United States', count: 1},
  {id: 2, user: 'pacoElFlaco', key:'holo03', created:'Sunday 16, March 2018', country: 'Canada', count: 1},
  {id: 3, user: 'elmo', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1},
  {id: 4, user: 'Esteban', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1},
  {id: 5, user: 'Harry Potter', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1},
  {id: 6, user: 'Daniela', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1},
  {id: 7, user: 'Daeneris', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1},
  {id: 8, user: 'Diana', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1},
  {id: 9, user: 'Ana', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1},
  {id: 10, user: 'Mauricia', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1},
  {id: 11, user: 'Cristobal', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1},
  {id: 12, user: 'Fluffy', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1},
  {id: 13, user: 'Juan Nieves', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico', count: 1}
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns = ['user', 'created', 'country', 'join'];
  gameTable = new MatTableDataSource<Table>(GAME_TABLE);


  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.gameTable.paginator = this.paginator;
  }

  constructor() {}

  ngOnInit() {}

  createGame(gameId: string) {
    console.log(gameId);
  }
}
