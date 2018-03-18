import { Injectable } from "@angular/core";
import {MatSnackBar} from '@angular/material';

@Injectable()
export class UiService {

    constructor(private snackbar: MatSnackBar) {}

    test(message) {
        console.log('el ui service' + message);
    }

    showSnackBar(message, action, duration) {
        console.log('snackbar called!');
        this.snackbar.open(message, action, {
            duration: duration
        });
    }
}