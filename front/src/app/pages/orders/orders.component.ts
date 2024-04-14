import { Component, inject } from '@angular/core';
import { OrdersService } from '../../shared/services/orders.service';
import { take } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IOrder } from '../../shared/models/Order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatTableModule, AsyncPipe, MatIconModule, MatButtonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  public columns: Array<keyof IOrder | 'actions'> = ['open', 'title', 'client', 'paymentStatus', 'actions'];

  private ordersService = inject(OrdersService);

  public orders$ = this.ordersService.orders$
    .pipe(take(1));

  openOrderForm(order?: IOrder) {

  }

}
