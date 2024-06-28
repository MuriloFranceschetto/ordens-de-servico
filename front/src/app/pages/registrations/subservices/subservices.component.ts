import { RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ISubservice } from '../../../shared/models/subservice/ISubservice';
import { SubservicesService } from '../../../shared/services/subservices.service';
import { SubserviceComponent } from '../../../shared/components/subservice/subservice.component';
import { SubserviceChargeTypeLabelPipe } from '../../../shared/pipes/subservice-charge-type-label.pipe';

@Component({
  selector: 'app-subservices',
  standalone: true,
  imports: [AsyncPipe, MatTableModule, RouterLink, MatButtonModule, MatDialogModule, SubserviceChargeTypeLabelPipe, MatIconModule, NgClass, CurrencyPipe],
  templateUrl: './subservices.component.html',
  styleUrl: './subservices.component.scss'
})
export class SubservicesComponent {

  private subservicesService = inject(SubservicesService);
  private dialog = inject(MatDialog);

  public subservices$ = this.subservicesService.subservices$;

  public readonly columns = ['name', 'charged_per', 'price', 'actions'];

  async openSubserviceForm(subservice?: ISubservice) {
    let dialogRef = this.dialog.open(SubserviceComponent, {
      data: subservice,
      autoFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.subservices$ = this.subservicesService.subservices$;
    });
  }

}
