import {Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-player-left',
  template: `<h1 mat-dialog-title fxFlexAlign="center center">Message</h1>
                <mat-dialog-content fxFlexAlign="center center">
                  <p>{{passedData.opponentInfo}}</p>
                </mat-dialog-content>
                <mat-dialog-actions>
                  <button mat-button [mat-dialog-close]="true" fxFlexAlign="center center">OK</button>
                </mat-dialog-actions>`
})
export class PlayerLeftComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}
