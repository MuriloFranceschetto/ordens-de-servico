import { Direction } from "@angular/cdk/bidi";
import { MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";

export class GlobalSnackBarConfig extends MatSnackBarConfig {
    override verticalPosition?: MatSnackBarVerticalPosition = 'bottom';
    override horizontalPosition?: MatSnackBarHorizontalPosition = 'right';
}