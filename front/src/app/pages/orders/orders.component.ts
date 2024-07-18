import { debounceTime, merge, switchMap, take } from 'rxjs';
import colors from 'tailwindcss/colors';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { IOrder, PaymentStatus } from '../../shared/models/order/Order';
import { OrdersService } from '../../shared/services/orders.service';
import { MyChipComponent } from '../../shared/components/my-chip/my-chip.component';
import { PaymentStatusPipe } from '../../shared/pipes/payment-status.pipe';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IUser, UserRole } from '../../shared/models/User';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserSelectComponent } from '../../shared/components/form-controls/user-select/user-select.component';

const MATERIAL_MODULES = [MatTableModule, MatIconModule, MatButtonModule, MatChipsModule, MatSelectModule, MatInputModule, MatFormFieldModule]

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [AsyncPipe, PaymentStatusPipe, ReactiveFormsModule, MyChipComponent, UserSelectComponent, ...MATERIAL_MODULES],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  private ordersService = inject(OrdersService);
  private router = inject(Router);

  public formFilters = new FormGroup({
    open: new FormControl<boolean>(null),
    payment_status: new FormControl<PaymentStatus>(null),
    client: new FormControl<IUser>(null),
    title: new FormControl<string>(null),
  });

  public colors = colors;
  public columns: Array<keyof IOrder | 'actions'> = ['title', 'client', 'open', 'paymentStatus', 'actions'];
  public readonly onlyClients = [UserRole.Client];

  public orders$ = merge(
    this.ordersService.orders$.pipe(take(1)),
    this.formFilters.valueChanges
      .pipe(
        takeUntilDestroyed(),
        debounceTime(400),
        switchMap((formValue) => this.ordersService.getOrders(formValue).pipe(take(1))),
      )
  )


  openOrderForm(order?: IOrder) {
    this.router.navigate(['order', order?.id ?? 'new']);
  }

}
