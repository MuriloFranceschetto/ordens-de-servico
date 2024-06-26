import { take } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Component, Signal, computed, inject, input, output } from '@angular/core';

import { IOrder } from '../../../models/order/Order';
import { PaymentComponent } from './payment/payment.component';
import { IPaymentOrder } from '../../../models/order/PaymentOrder';
import { PaymentMethodLabelPipe } from '../../../pipes/payment-method-label.pipe';

const MATERIAL_MODULES = [MatIconModule, MatTooltipModule, MatDialogModule];
const ANGULAR_MODULES = [CurrencyPipe, DatePipe, NgClass];

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
  public onAction = output<void>();

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
          next: () => {
            this.onAction.emit();
          },
          error: (err) => reject(err),
        })
    });
  }

}
