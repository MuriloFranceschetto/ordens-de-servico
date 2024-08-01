import { toObservable } from '@angular/core/rxjs-interop';
import { map, shareReplay, switchMap, take } from 'rxjs';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, input, ViewEncapsulation } from '@angular/core';

import { OrdersService } from '../../../shared/services/orders.service';

@Component({
  selector: 'app-print-order',
  standalone: true,
  templateUrl: './print-order.component.html',
  styleUrl: './print-order.component.scss',
  imports: [AsyncPipe, DatePipe, CurrencyPipe],
  encapsulation: ViewEncapsulation.None,
})
export class PrintOrderComponent {

  public id = input.required<string>();
  private orderService = inject(OrdersService);

  public order$ = toObservable(this.id)
    .pipe(
      switchMap(() => {
        return this.orderService.getOrderById(this.id()).pipe(take(1))
      }),
      shareReplay()
    );

  public totalSubservices$ = this.order$.pipe(
    map(
      (order) => order.subservices.map(service => service.amount).reduce((a, b) => a + b, 0)
    )
  )

  constructor() {
    this.order$.subscribe({
      next: () => {
        setTimeout(() => {
          window.print();
          window.close();
        })
      }
    });
  }

}
