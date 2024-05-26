import { take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, Signal, computed, inject, input, output } from '@angular/core';

import { IOrder } from '../../../models/order/Order';
import { SubserviceOrder } from '../../../models/order/SubserviceOrder';
import { SubserviceComponent } from './subservice/subservice.component';
import { SubservicesService } from '../../../services/subservices.service';

const MATERIAL_MODULES = [MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatInputModule, MatTooltipModule];
const ANGULAR_MODULES = [CurrencyPipe, DatePipe, NgClass, FormsModule];

@Component({
  selector: 'app-order-subservices',
  standalone: true,
  imports: [...ANGULAR_MODULES, ...MATERIAL_MODULES],
  templateUrl: './order-subservices.component.html',
  styleUrl: './order-subservices.component.scss'
})
export class OrderSubservicesComponent {

  private readonly subservicesService: SubservicesService = inject(SubservicesService);
  public readonly FN_COMPARE_WITH_SUBSERVICES = this.subservicesService.FN_COMPARE_WITH_SUBSERVICES;

  public subserviceOptions$ = this.subservicesService.subservices$;

  public order = input.required<IOrder>();
  public subservices$ = input.required<SubserviceOrder[]>();
  public onAction = output<void>();

  public subservicesSum$: Signal<number> = computed(() => {
    return this.subservices$()
      ?.map(subservice => subservice.amount)
      ?.reduce((priceA, priceB) => priceA + priceB, 0);
  });

  public dialog = inject(MatDialog);

  async openDialogSubservice(subservices?: SubserviceOrder): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dialog.open(SubserviceComponent, { data: { order: this.order(), subservices } })
        .afterClosed()
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.onAction.emit();
            resolve(response);
          },
          error: (err) => reject(err),
        })
    });
  }

}
