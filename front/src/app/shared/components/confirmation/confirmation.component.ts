import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'confirmation',
    imports: [MatDialogModule, MatButtonModule],
    templateUrl: './confirmation.component.html',
    styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent {
  public message: string = inject(MAT_DIALOG_DATA);
}
