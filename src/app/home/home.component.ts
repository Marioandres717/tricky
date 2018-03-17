import { Component, OnInit} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';

export interface Table {
  id: number;
  user: string;
  key: string;
  created: string;
  country?: string;
}

const GAME_TABLE: Table[] = [
  {id: 0, user: 'sebastian', key:'holo01', created:'Sunday 16, March 2018', country: 'Colombia'},
  {id: 1, user: 'pepitoPerez', key:'holo02', created:'Sunday 16, March 2018', country: 'United States'},
  {id: 2, user: 'pacoElFlaco', key:'holo03', created:'Sunday 16, March 2018', country: 'Canada'},
  {id: 3, user: 'elmo', key:'holo04', created:'Sunday 16, March 2018', country: 'Mexico'}
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns = ['user', 'created', 'country', 'join'];
  gameTable = new MatTableDataSource<Table>(GAME_TABLE);

  constructor() {}

  ngOnInit() {}
}
