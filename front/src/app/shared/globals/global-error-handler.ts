import { ErrorHandler, Injectable } from "@angular/core";
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(private snackBar: MatSnackBar) { }

    handleError(error: any): void {
        console.error(error)
        this.snackBar.open(
            (error?.error?.message || error?.error?.toString() || error?.toString()),
            'Fechar',
            { duration: 3000, panelClass: 'errorSnack' }
        );
        return error;
    }
}