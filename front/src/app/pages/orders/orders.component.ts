import { take } from 'rxjs';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

import { IOrder } from '../../shared/models/Order';
import { OrdersService } from '../../shared/services/orders.service';
import { MyChipComponent } from '../../shared/components/my-chip/my-chip.component';

import colors from 'tailwindcss/colors';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatTableModule, AsyncPipe, MatIconModule, MatButtonModule, MatChipsModule, MyChipComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  colors = colors;

  public columns: Array<keyof IOrder | 'actions'> = ['open', 'title', 'client', 'paymentStatus', 'actions'];

  private ordersService = inject(OrdersService);

  public orders$ = this.ordersService.orders$
    .pipe(take(1));

  openOrderForm(order?: IOrder) {

  }

}
