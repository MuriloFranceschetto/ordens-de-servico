import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, Signal, computed, inject, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PaymentComponent } from './payment/payment.component';
import { IPaymentOrder } from '../../../models/order/PaymentOrder';
import { PaymentMethodLabelPipe } from '../../../pipes/payment-method-label.pipe';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { catchError, take } from 'rxjs';
import { IOrder } from '../../../models/order/Order';

const MATERIAL_MODULES = [MatIconModule, MatTooltipModule, MatDialogModule];
const ANGULAR_MODULES = [CurrencyPipe, NgClass];

@Component({
  selector: 'app-order-payments',
  standalone: true,
  imports: [PaymentMethodLabelPipe, PaymentComponent, ...ANGULAR_MODULES, ...MATERIAL_MODULES],
  templateUrl: './order-payments.component.html',
  styleUrl: './order-payments.component.scss'
})
export class OrderPaymentsComponent {

  public order = input.required<IOrder>();
  public payments$ = input.required<IPaymentOrder[]>();
  public onAction = output();

  public paymentSum$: Signal<number> = computed(() => {
    return this.payments$()
      ?.map(payment => payment.amount)
      ?.reduce((amountA, amountB) => amountA + amountB, 0);
  });

  public dialog = inject(MatDialog);

  async openDialogPayment(payment?: IPaymentOrder): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dialog.open(PaymentComponent, { data: { order: this.order(), payment } })
        .afterClosed()
        .pipe(take(1))
        .subscribe({
          next: (response) => {
            this.onAction.emit();
          },
          error: (err) => reject(err),
        })
    });
  }

}
