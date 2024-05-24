import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { SubserviceChargeTypeLabelPipe } from '../../../shared/pipes/subservice-charge-type-label.pipe';
import { MatIconModule } from '@angular/material/icon';
import { SubservicesService } from '../../../shared/services/subservices.service';
import { take } from 'rxjs';
import { ISubservice } from '../../../shared/models/subservice/ISubservice';
import { SubserviceComponent } from '../../../shared/components/subservice/subservice.component';

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

  public subservices$ = this.subservicesService.subservices$.pipe(take(1));

  public readonly columns = ['name', 'charged_per', 'price', 'actions'];

  async openSubserviceForm(subservice?: ISubservice) {
    let dialogRef = this.dialog.open(SubserviceComponent, {
      data: subservice,
    });
    dialogRef.afterClosed().subscribe((response) => {
      this.subservices$ = this.subservicesService.subservices$.pipe(take(1));
    });
  }

}
