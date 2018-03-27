import {Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-rematch',
  template: `<h1 mat-dialog-title fxFlexAlign="center center">{{passedData.opponentName}}</h1>
                <mat-dialog-content fxFlexAlign="center center">
                  <p>play again?</p>
                </mat-dialog-content>
                <mat-dialog-actions>
                  <button mat-button [mat-dialog-close]="true" fxFlexAlign="center center">Yes</button>
                  <button mat-button [mat-dialog-close]="false" fxFlexAlign="center center">No</button>
                </mat-dialog-actions>`
})
export class RematchComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
}
